import React, { forwardRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'

interface BigTextFieldProps {
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onEnter?: (e: React.KeyboardEvent) => void
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
}

export const BigTextField = forwardRef<HTMLInputElement, BigTextFieldProps>(
  (
    {
      type = 'text',
      value,
      onChange,
      onBlur,
      onEnter,
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
      inputClassName = ''
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
          validationSchema.parse({
            [type === 'email' ? 'email' : 'value']: value
          })
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

    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !disabled) {
          onEnter?.(e)
        }
      },
      [onEnter, disabled]
    )

    return (
      <div className={`space-y-2 ${className}`}>
        <div className="relative">
          {icon && (
            <div
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                hasError ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            className={`w-full ${
              icon ? 'pl-12' : 'pl-4'
            } pr-4 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              hasError
                ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
            } ${inputClassName}`}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
          />
        </div>

        {/* Mensagem de erro */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">
                {type === 'email' ? 'Email inválido' : 'Campo inválido'}
              </p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    )
  }
)

BigTextField.displayName = 'BigTextField'
