import { useUser } from 'contexts/UserContext'
import { Button } from '../ui/Button'
import { userService, userUtils, useUserService } from 'services/userService'
import { User, UserRole } from 'types/user'
import { useToastHelpers } from 'components/ui/Toast'
import { useState } from 'react'

export const MyProfile = () => {
  const { user, setUser } = useUser()
  const { name, email, role, phone } = user || {}
  const [formData, setFormData] = useState({
    name: name,
    phone: phone
  })
  const { updateUser } = useUserService()
  const toast = useToastHelpers()

  const handleUpdateUser = async () => {
    try {
      await updateUser(user?._id || '', {
        name: formData.name,
        phone: formData.phone
      })
      setUser({ ...user, name: formData.name, phone: formData.phone } as User)
      toast.success('Usuário atualizado com sucesso')
    } catch (error) {
      toast.error('Erro ao atualizar usuário', (error as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cargo
          </label>
          <input
            type="text"
            defaultValue={role === UserRole.MANAGER ? 'Gestor' : 'Colaborador'}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            defaultValue={email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed bg-gray-100 text-gray-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleUpdateUser()}>Salvar Alterações</Button>
      </div>
    </div>
  )
}
