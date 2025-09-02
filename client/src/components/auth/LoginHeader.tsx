import React from 'react'
import { motion } from 'framer-motion'

export const LoginHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-center"
    >
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl font-bold">CN</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Central de Notas PJ
      </h1>
      
      {/* Subtitle */}
      <p className="text-gray-600 text-lg">
        Gerencie suas notas fiscais de forma simples e eficiente
      </p>

      {/* Welcome message */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          <strong>Bem-vindo!</strong> Acesse sua conta para continuar.
        </p>
      </div>
    </motion.div>
  )
}
