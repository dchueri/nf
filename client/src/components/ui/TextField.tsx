import React, { forwardRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'

interface TextFieldProps {
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  autoComplete?: string
  spellCheck?: boolean
  icon?: React.ReactNode
  error?: string
  validationSchema?: z.ZodSchema<any>
  validateOnBlur?: boolean
  className?: string
  inputClassName?: string
  id?: string
  label?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      type = 'text',
      value,
      onChange,
      onBlur,
      placeholder,
      disabled = false,
      autoFocus = false,
      autoComplete,
      spellCheck = true,
      icon,
      error,
      validationSchema,
      validateOnBlur = false,
      className = '',
      inputClassName = '',
      id,
      label
    },
    ref
  ) => {
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
      },
      [onChange]
    )

    const handleBlur = useCallback(() => {
      if (validateOnBlur && validationSchema && value.trim().length > 0) {
        try {
          validationSchema.parse({ [type === 'email' ? 'email' : 'value']: value })
        } catch (err) {
          if (err instanceof z.ZodError) {
            // O erro será tratado pelo componente pai
          }
        }
      }
      onBlur?.()
    }, [validateOnBlur, validationSchema, value, type, onBlur])

    const hasError = !!error
    const isValid = value.trim().length > 0 && !hasError

    const inputClasses = `w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
      hasError
        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
    } ${inputClassName}`

    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                hasError ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            id={id}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
          />
        </div>

        {/* Mensagem de erro */}
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

TextField.displayName = 'TextField'