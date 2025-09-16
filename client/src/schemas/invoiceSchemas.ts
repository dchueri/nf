import { z } from 'zod'

// Schema para validação do formulário de envio de nota fiscal
export const invoiceSubmissionSchema = z.object({
  file: z.instanceof(File, {
    message: 'Por favor, selecione um arquivo para upload'
  }),
  invoiceNumber: z
    .string()
    .min(1, 'Número da nota fiscal é obrigatório')
    .max(50, 'Número da nota fiscal deve ter no máximo 50 caracteres')
    .regex(
      /^[A-Za-z0-9\-\/\.\s]+$/,
      'Número da nota fiscal contém caracteres inválidos. Use apenas letras, números, hífens, barras e pontos'
    ),
  referenceMonth: z
    .string()
    .min(1, 'Mês de competência é obrigatório')
    .regex(
      /^\d{4}-\d{2}$/,
      'Formato de mês inválido. Use o formato YYYY-MM (ex: 2024-01)'
    )
})

// Schema para validação de arquivo
export const fileValidationSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => {
      const allowedTypes = ['application/pdf', 'text/xml', 'application/xml']
      return allowedTypes.includes(file.type)
    }, 'Formato de arquivo não suportado. Apenas arquivos PDF e XML são aceitos')
    .refine((file) => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      return file.size <= maxSize
    }, 'Arquivo muito grande. O tamanho máximo permitido é 10MB')
})

// Schema para validação de número da nota fiscal
export const invoiceNumberSchema = z
  .string()
  .min(1, 'Número da nota fiscal é obrigatório')
  .max(50, 'Número da nota fiscal deve ter no máximo 50 caracteres')
  .regex(/^\d+$/, 'Número da nota fiscal deve conter apenas números')

// Schema para validação de mês de competência
export const monthSchema = z
  .string()
  .min(1, 'Mês de competência é obrigatório')
  .regex(
    /^\d{4}-\d{2}$/,
    'Formato de mês inválido. Use o formato YYYY-MM (ex: 2024-01)'
  )
  .refine((month) => {
    const [year, monthNum] = month.split('-')
    const selectedYear = parseInt(year)
    const selectedMonth = parseInt(monthNum)
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    
    // Permitir apenas meses do ano atual ou anteriores
    if (selectedYear > currentYear) {
      return false
    }
    
    // Se for o ano atual, não permitir meses futuros
    if (selectedYear === currentYear && selectedMonth > currentMonth) {
      return false
    }
    
    return true
  }, 'Não é possível enviar notas fiscais para meses futuros. Selecione um mês anterior ou o mês atual')

// Tipo TypeScript derivado do schema
export type InvoiceSubmissionData = z.infer<typeof invoiceSubmissionSchema>

// Função para validar mês de competência
export const validateMonth = (month: string): string | null => {
  try {
    monthSchema.parse(month)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0].message
    }
    return 'Mês inválido'
  }
}

// Função para validar número da nota fiscal
export const validateInvoiceNumber = (invoiceNumber: string): string | null => {
  try {
    invoiceNumberSchema.parse(invoiceNumber)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0].message
    }
    return 'Número da nota fiscal inválido'
  }
}

// Função para validar arquivo
export const validateFile = (file: File | null): string | null => {
  if (!file) {
    return 'Arquivo é obrigatório'
  }

  try {
    fileValidationSchema.parse({ file })
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0].message
    }
    return 'Arquivo inválido'
  }
}
