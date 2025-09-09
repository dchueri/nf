import { z } from 'zod'
import { UserRole, UserStatus } from '../types/user'

// Schema para validação de email
const emailSchema = z
  .email('Email deve ser válido')
  .min(1, 'Email é obrigatório')
  .min(5, 'Email deve ter pelo menos 5 caracteres')
  .max(254, 'Email deve ter no máximo 254 caracteres')
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Formato de email inválido'
  )
  .refine((email) => {
    // Verificar se não contém espaços
    return !email.includes(' ')
  }, 'Email não pode conter espaços')
  .refine((email) => {
    // Verificar se não começa ou termina com ponto
    return !email.startsWith('.') && !email.endsWith('.')
  }, 'Email não pode começar ou terminar com ponto')
  .refine((email) => {
    // Verificar se não tem pontos consecutivos
    return !email.includes('..')
  }, 'Email não pode ter pontos consecutivos')
  .toLowerCase()
  .trim()

// Schema para validação de nome
const nameSchema = z
  .string()
  .min(1, 'Nome é obrigatório')
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome deve ter no máximo 100 caracteres')
  .trim()

// Schema para validação de departamento
const departmentSchema = z
  .string()
  .max(50, 'Departamento deve ter no máximo 50 caracteres')
  .trim()
  .optional()

// Schema para validação de função/role
const roleSchema = z
  .enum([UserRole.MANAGER, UserRole.COLLABORATOR])
  .transform((val) => val as UserRole)
  .refine((val) => [UserRole.MANAGER, UserRole.COLLABORATOR].includes(val), {
    message: 'Função deve ser Gestor ou Colaborador'
  })

// Schema para validação de status
const statusSchema = z
  .enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED])
  .transform((val) => val as UserStatus)
  .refine(
    (val) =>
      [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED].includes(
        val
      ),
    {
      message: 'Status deve ser Ativo, Inativo ou Suspenso'
    }
  )

// Schema principal para edição de usuário
export const editUserSchema = z.object({
  name: nameSchema,
  role: roleSchema,
  department: departmentSchema,
  status: statusSchema
})

// Schema para convite de usuário (apenas email)
export const inviteUserSchema = z.object({
  email: emailSchema
})

// Tipos derivados dos schemas
export type EditUserData = z.infer<typeof editUserSchema>
export type InviteUserData = z.infer<typeof inviteUserSchema>

// Função para validar dados de edição de usuário
export const validateEditUser = (data: unknown): EditUserData => {
  return editUserSchema.parse(data)
}

// Função para validar dados de convite de usuário
export const validateInviteUser = (data: unknown): InviteUserData => {
  return inviteUserSchema.parse(data)
}

// Função para validar dados de edição com erros customizados
export const validateEditUserSafe = (
  data: unknown
):
  | { success: true; data: EditUserData }
  | { success: false; errors: Record<string, string> } => {
  const result = editUserSchema.safeParse(data)

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

// Função para validar dados de convite com erros customizados
export const validateInviteUserSafe = (
  data: unknown
):
  | { success: true; data: InviteUserData }
  | { success: false; errors: Record<string, string> } => {
  const result = inviteUserSchema.safeParse(data)

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
export const formatEditUserDataForSubmission = (
  formData: EditUserData
): EditUserData => {
  return {
    name: formData.name.trim(),
    role: formData.role,
    department: formData.department?.trim() || '',
    status: formData.status
  }
}

// Função para limpar e formatar dados de convite para envio
export const formatInviteUserDataForSubmission = (
  formData: InviteUserData
): InviteUserData => {
  return {
    email: formData.email.trim().toLowerCase()
  }
}
