import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BuildingOfficeIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/Button'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { FeedbackMessage } from '../ui/FeedbackMessage'
import { companyUtils } from '../../services/companyService'
import { 
  validateCompanyFormSafe, 
  formatCompanyDataForSubmission,
  type CompanyFormData 
} from '../../schemas/companySchemas'

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

interface FormErrors {
  name?: string
  cnpj?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  email?: string
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    cnpj: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isValidatingCNPJ, setIsValidatingCNPJ] = useState(false)
  const [cnpjValidationMessage, setCnpjValidationMessage] = useState<string>('')

  const states = companyUtils.getBrazilianStates()

  // Validar formulário com Zod
  const validateForm = useCallback((): boolean => {
    const validation = validateCompanyFormSafe(formData)
    
    if (validation.success) {
      setErrors({})
      return true
    } else {
      setErrors(validation.errors)
      return false
    }
  }, [formData])

  // Manipular mudanças nos campos
  const handleInputChange = useCallback((field: keyof CompanyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  // Formatar CNPJ enquanto digita
  const handleCNPJChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const formatted = companyUtils.formatCNPJ(cleaned)
    handleInputChange('cnpj', formatted)
  }, [handleInputChange])

  // Formatar telefone enquanto digita
  const handlePhoneChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const formatted = companyUtils.formatPhone(cleaned)
    handleInputChange('phone', formatted)
  }, [handleInputChange])

  // Formatar CEP enquanto digita
  const handleCEPChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const formatted = companyUtils.formatCEP(cleaned)
    handleInputChange('zipCode', formatted)
  }, [handleInputChange])

  // Manipular envio do formulário
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const submitData = formatCompanyDataForSubmission(formData)
      await onSubmit(formData)
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
    }
  }, [formData, validateForm, onSubmit])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Informações da Empresa</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome da Empresa */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Empresa *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o nome da sua empresa"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* CNPJ */}
            <div className="md:col-span-2">
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ *
              </label>
              <div className="relative">
                <IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cnpj ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  disabled={isLoading}
                />
              </div>
              {errors.cnpj && (
                <p className="mt-1 text-sm text-red-600">{errors.cnpj}</p>
              )}
              {cnpjValidationMessage && (
                <p className={`mt-1 text-sm ${cnpjValidationMessage.includes('válido') ? 'text-green-600' : 'text-red-600'}`}>
                  {cnpjValidationMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <MapPinIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Endereço */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço *
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Rua, número, complemento"
                disabled={isLoading}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Cidade */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade *
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite a cidade"
                disabled={isLoading}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.state ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Selecione o estado</option>
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            {/* CEP */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                CEP *
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleCEPChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.zipCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="00000-000"
                maxLength={9}
                disabled={isLoading}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <PhoneIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Contato</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Telefone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="text"
                id="phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="(00) 00000-0000"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="email@empresa.com.br"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="Criando empresa..." />
            ) : (
              'Criar Empresa'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
