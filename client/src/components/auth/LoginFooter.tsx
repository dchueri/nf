import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export const LoginFooter: React.FC = () => {
  const navigate = useNavigate()

  const handleFirstAccess = () => {
    navigate('/first-access')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="text-center"
    >
      {/* First Access Button */}
      <div className="mb-6">
        <button
          onClick={handleFirstAccess}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Primeiro Acesso
        </button>
        <p className="mt-2 text-xs text-gray-500">
          Foi convidado? Configure sua conta aqui
        </p>
      </div>

      {/* Sign up link */}
      <p className="text-sm text-gray-600 mb-4">
        Não tem uma conta?{' '}
        <a
          href="#"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            // TODO: Navigate to signup page
            console.log('Navigate to signup')
          }}
        >
          Criar conta
        </a>
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-center space-x-6 text-sm text-gray-500">
          <a
            href="#"
            className="hover:text-gray-700 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              // TODO: Open privacy policy
              console.log('Open privacy policy')
            }}
          >
            Privacidade
          </a>
          <a
            href="#"
            className="hover:text-gray-700 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              // TODO: Open terms of service
              console.log('Open terms of service')
            }}
          >
            Termos de Uso
          </a>
          <a
            href="#"
            className="hover:text-gray-700 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              // TODO: Open help/support
              console.log('Open help/support')
            }}
          >
            Ajuda
          </a>
        </div>
      </div>

      {/* Copyright */}
      <p className="mt-4 text-xs text-gray-400">
        © 2024 Central de Notas PJ. Todos os direitos reservados.
      </p>
    </motion.div>
  )
}
