import { z } from 'zod'

// Schema para validação de CNPJ
const cnpjSchema = z
  .string()
  .min(1, 'CNPJ é obrigatório')
  .refine((cnpj) => {
    const cleaned = cnpj.replace(/\D/g, '')
    return cleaned.length === 14
  }, 'CNPJ deve ter 14 dígitos')
  .refine((cnpj) => {
    const cleaned = cnpj.replace(/\D/g, '')
    // Validação básica de CNPJ (verificar se não são todos os mesmos dígitos)
    return !/^(\d)\1{13}$/.test(cleaned)
  }, 'CNPJ inválido')

// Schema para validação de telefone
const phoneSchema = z
  .string()
  .min(1, 'Telefone é obrigatório')
  .refine((phone) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length >= 10 && cleaned.length <= 11
  }, 'Telefone deve ter 10 ou 11 dígitos')

// Schema para validação de CEP
const cepSchema = z
  .string()
  .min(1, 'CEP é obrigatório')
  .refine((cep) => {
    const cleaned = cep.replace(/\D/g, '')
    return cleaned.length === 8
  }, 'CEP deve ter 8 dígitos')

// Schema para validação de email
const emailSchema = z
  .string()
  .email('Email deve ser válido')
  .optional()
  .or(z.literal(''))

// Schema para validação de URL (website)
const urlSchema = z
  .string()
  .url('Website deve ser uma URL válida')
  .optional()
  .or(z.literal(''))

// Schema principal para criação de empresa
export const createCompanySchema = z.object({
  name: z
    .string()
    .min(1, 'Nome da empresa é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  
  cnpj: cnpjSchema,
  
  address: z
    .string()
    .min(1, 'Endereço é obrigatório')
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .trim(),
  
  city: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .trim(),
  
  state: z
    .string()
    .min(1, 'Estado é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres'),
  
  zipCode: cepSchema,
  
  phone: phoneSchema,
  
  email: emailSchema,
  
  website: urlSchema
})

// Schema para validação de formulário (com formatação)
export const companyFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome da empresa é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .refine((cnpj) => {
      const cleaned = cnpj.replace(/\D/g, '')
      return cleaned.length === 14
    }, 'CNPJ deve ter 14 dígitos'),
  
  address: z
    .string()
    .min(1, 'Endereço é obrigatório')
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .trim(),
  
  city: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .trim(),
  
  state: z
    .string()
    .min(1, 'Estado é obrigatório'),
  
  zipCode: z
    .string()
    .min(1, 'CEP é obrigatório')
    .refine((cep) => {
      const cleaned = cep.replace(/\D/g, '')
      return cleaned.length === 8
    }, 'CEP deve ter 8 dígitos'),
  
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .refine((phone) => {
      const cleaned = phone.replace(/\D/g, '')
      return cleaned.length >= 10 && cleaned.length <= 11
    }, 'Telefone deve ter 10 ou 11 dígitos'),
  
  email: z
    .string()
    .email('Email deve ser válido')
    .optional()
    .or(z.literal(''))
})

// Tipos derivados dos schemas
export type CreateCompanyData = z.infer<typeof createCompanySchema>
export type CompanyFormData = z.infer<typeof companyFormSchema>

// Função para validar dados de criação de empresa
export const validateCreateCompany = (data: unknown): CreateCompanyData => {
  return createCompanySchema.parse(data)
}

// Função para validar dados do formulário
export const validateCompanyForm = (data: unknown): CompanyFormData => {
  return companyFormSchema.parse(data)
}

// Função para validar dados do formulário com erros customizados
export const validateCompanyFormSafe = (data: unknown): { success: true; data: CompanyFormData } | { success: false; errors: Record<string, string> } => {
  const result = companyFormSchema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string> = {}
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as string
    errors[field] = issue.message
  })
  
  return { success: false, errors }
}

// Função para limpar e formatar dados para envio
export const formatCompanyDataForSubmission = (formData: CompanyFormData): CreateCompanyData => {
  return {
    name: formData.name.trim(),
    cnpj: formData.cnpj.replace(/\D/g, ''),
    address: formData.address.trim(),
    city: formData.city.trim(),
    state: formData.state,
    zipCode: formData.zipCode.replace(/\D/g, ''),
    phone: formData.phone.replace(/\D/g, ''),
    email: formData.email?.trim() || undefined,
    website: undefined // Removido conforme mudança do usuário
  }
}
