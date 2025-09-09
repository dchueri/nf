import { useUser } from 'contexts/UserContext'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'
import { userService, userUtils, useUserService } from 'services/userService'
import { User, UserRole } from 'types/user'
import { useToastHelpers } from 'components/ui/Toast'
import { useState } from 'react'
import { UserIcon, PhoneIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { formatToPhone, isPhone } from 'brazilian-values'
import { z } from 'zod'

// Schema Zod para validação de perfil
const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim().length === 0) return true
      return isPhone(phone)
    }, 'Formato de telefone inválido. Use: (11) 99999-9999')
})

type ProfileData = z.infer<typeof profileSchema>

export const MyProfile = () => {
  const { user, setUser } = useUser()
  const { name, email, role, phone } = user || {}
  const [formData, setFormData] = useState<ProfileData>({
    name: name || '',
    phone: phone || ''
  })
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateUser } = useUserService()
  const toast = useToastHelpers()

  const validateForm = () => {
    try {
      profileSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { name?: string; phone?: string } = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof typeof fieldErrors] = issue.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleInputChange = (field: 'name' | 'phone', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleUpdateUser = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await updateUser('me', {
        name: formData.name.trim(),
        phone: formData.phone?.trim() || undefined
      })
      setUser({ ...user, name: formData.name.trim(), phone: formData.phone?.trim() || undefined } as User)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil', (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <TextField
          type="text"
          id="name"
          value={formData.name}
          onChange={(value) => handleInputChange('name', value)}
          placeholder="Digite seu nome completo"
          disabled={isSubmitting}
          icon={<UserIcon className="h-5 w-5" />}
          error={errors.name}
          label="Nome *"
        />

        {/* Telefone */}
        <TextField
          type="text"
          id="phone"
          value={formatToPhone(formData.phone || '')}
          onChange={(value) => handleInputChange('phone', value?.replace(/\D/g, ''))}
          placeholder="(11) 99999-9999"
          disabled={isSubmitting}
          icon={<PhoneIcon className="h-5 w-5" />}
          error={errors.phone}
          label="Telefone"
        />

        {/* Cargo */}
        <TextField
          type="text"
          id="role"
          value={role === UserRole.MANAGER ? 'Gestor' : 'Colaborador'}
          onChange={() => {}}
          disabled
          icon={<ShieldCheckIcon className="h-5 w-5" />}
          label="Cargo"
          inputClassName="cursor-not-allowed bg-gray-100 text-gray-500"
        />

        {/* Email */}
        <TextField
          type="email"
          id="email"
          value={email || ''}
          onChange={() => {}}
          disabled
          icon={<EnvelopeIcon className="h-5 w-5" />}
          label="Email"
          inputClassName="cursor-not-allowed bg-gray-100 text-gray-500"
        />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleUpdateUser}
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </div>
  )
}
