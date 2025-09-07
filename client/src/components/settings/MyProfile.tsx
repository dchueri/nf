import { useUser } from 'contexts/UserContext'
import { Button } from '../ui/Button'
import { userService, userUtils, useUserService } from 'services/userService'
import { UserRole } from 'types/user'
import { useToastHelpers } from 'components/ui/Toast'
import { useState } from 'react'

export const MyProfile = () => {
  const { user, setUser } = useUser()
  const { name, email, role, phone } = user || {}
  const [nameInput, setNameInput] = useState(name)
  const [phoneInput, setPhoneInput] = useState(phone)
  const { updateUser } = useUserService()
  const toast = useToastHelpers()

  const handleUpdateUser = async () => {
    try {
      const response = await updateUser(user?._id || '', {
        name: nameInput,
        phone: phoneInput
      })
      setUser(response.data)
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
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
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
        <Button onClick={() => handleUpdateUser()}>
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
