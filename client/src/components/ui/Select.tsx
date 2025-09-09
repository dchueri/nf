import React, { forwardRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  autoFocus?: boolean
  icon?: React.ReactNode
  error?: string
  validationSchema?: z.ZodSchema<any>
  validateOnBlur?: boolean
  className?: string
  selectClassName?: string
  id?: string
  options: SelectOption[]
  label?: string
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      value,
      onChange,
      onBlur,
      disabled = false,
      autoFocus = false,
      icon,
      error,
      validationSchema,
      validateOnBlur = false,
      className = '',
      selectClassName = '',
      id,
      options = [],
      label,
      placeholder
    },
    ref
  ) => {
    const handleSelectChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value)
      },
      [onChange]
    )

    const handleBlur = useCallback(() => {
      if (validateOnBlur && validationSchema && value.trim().length > 0) {
        try {
          validationSchema.parse({ value })
        } catch (err) {
          if (err instanceof z.ZodError) {
            // O erro será tratado pelo componente pai
          }
        }
      }
      onBlur?.()
    }, [validateOnBlur, validationSchema, value, onBlur])

    const hasError = !!error
    const isValid = value.trim().length > 0 && !hasError

    const selectClasses = `w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer ${
      hasError
        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
    } ${selectClassName}`

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
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors pointer-events-none ${
                hasError ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {icon}
            </div>
          )}
          
          <select
            ref={ref}
            id={id}
            value={value}
            onChange={handleSelectChange}
            onBlur={handleBlur}
            className={selectClasses}
            disabled={disabled}
            autoFocus={autoFocus}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Seta do select */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className={`w-4 h-4 transition-colors ${
                hasError ? 'text-red-400' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

Select.displayName = 'Select'
