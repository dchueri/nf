import React, { useState, useRef, useEffect } from 'react'
import { Button } from './Button'
import { cn } from '../../utils/cn'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

export interface ButtonGroupItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
}

export interface ButtonGroupProps {
  items: ButtonGroupItem[]
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  attached?: boolean
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  items,
  orientation = 'horizontal',
  spacing = 'md',
  className = '',
  size = 'md',
  variant = 'secondary',
  attached = false
}) => {
  const getSpacingClass = () => {
    if (attached) return ''
    
    switch (spacing) {
      case 'sm':
        return orientation === 'horizontal' ? 'space-x-1' : 'space-y-1'
      case 'lg':
        return orientation === 'horizontal' ? 'space-x-3' : 'space-y-3'
      default:
        return orientation === 'horizontal' ? 'space-x-2' : 'space-y-2'
    }
  }

  const getOrientationClass = () => {
    return orientation === 'horizontal' ? 'flex-row' : 'flex-col'
  }

  const getAttachedClass = () => {
    if (!attached) return ''
    
    return orientation === 'horizontal' 
      ? 'divide-x divide-gray-300' 
      : 'divide-y divide-gray-300'
  }

  return (
    <div
      className={cn(
        'flex',
        getOrientationClass(),
        getSpacingClass(),
        getAttachedClass(),
        className
      )}
    >
      {items.map((item, index) => {
        const isFirst = index === 0
        const isLast = index === items.length - 1
        
        const getAttachedButtonClass = () => {
          if (!attached) return ''
          
          let classes = ''
          
          if (orientation === 'horizontal') {
            if (isFirst) classes += 'rounded-l-md rounded-r-none'
            else if (isLast) classes += 'rounded-r-md rounded-l-none'
            else classes += 'rounded-none'
          } else {
            if (isFirst) classes += 'rounded-t-md rounded-b-none'
            else if (isLast) classes += 'rounded-b-md rounded-t-none'
            else classes += 'rounded-none'
          }
          
          return classes
        }

        return (
          <Button
            key={item.id}
            variant={item.variant || variant}
            size={item.size || size}
            disabled={item.disabled}
            onClick={item.onClick}
            className={cn(
              attached && getAttachedButtonClass(),
              attached && 'border-0'
            )}
          >
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.label}
          </Button>
        )
      })}
    </div>
  )
}

// Componente para ações rápidas (botões menores)
export const ActionGroup: React.FC<Omit<ButtonGroupProps, 'size'> & { size?: 'xs' | 'sm' }> = ({
  items,
  orientation = 'horizontal',
  spacing = 'sm',
  className = '',
  size = 'xs',
  variant = 'secondary',
  attached = false
}) => {
  return (
    <ButtonGroup
      items={items}
      orientation={orientation}
      spacing={spacing}
      className={className}
      size={size === 'xs' ? 'sm' : size}
      variant={variant}
      attached={attached}
    />
  )
}

// Componente para botões de toolbar
export const ToolbarGroup: React.FC<ButtonGroupProps> = ({
  items,
  orientation = 'horizontal',
  spacing = 'sm',
  className = '',
  size = 'sm',
  variant = 'secondary',
  attached = true
}) => {
  return (
    <div className={cn('bg-gray-50 p-2 rounded-lg border', className)}>
      <ButtonGroup
        items={items}
        orientation={orientation}
        spacing={spacing}
        size={size}
        variant={variant}
        attached={attached}
      />
    </div>
  )
}

// Componente para botão com dropdown de ações secundárias
export interface DropdownButtonGroupProps {
  primaryAction: ButtonGroupItem
  secondaryActions: ButtonGroupItem[]
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  disabled?: boolean
}

export const DropdownButtonGroup: React.FC<DropdownButtonGroupProps> = ({
  primaryAction,
  secondaryActions,
  className = '',
  size = 'md',
  variant = 'secondary',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(target)
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target)
      
      if (isOutsideButton && isOutsideDropdown) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handlePrimaryClick = () => {
    if (primaryAction.onClick) {
      primaryAction.onClick()
    }
  }

  const handleDropdownToggle = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      })
    }
    setIsOpen(!isOpen)
  }

  const handleSecondaryAction = (action: ButtonGroupItem) => {
    if (action.onClick) {
      action.onClick()
    }
    setIsOpen(false)
  }

  return (
    <div ref={buttonRef} className={cn('relative inline-flex', className)}>
      {/* Botão Principal */}
      <Button
        variant={primaryAction.variant || variant}
        size={primaryAction.size || size}
        disabled={disabled || primaryAction.disabled}
        onClick={handlePrimaryClick}
        className="rounded-r-none border-r-0"
      >
        {primaryAction.icon && <span className="mr-1">{primaryAction.icon}</span>}
        {primaryAction.label}
      </Button>

      {/* Botão Dropdown */}
      <Button
        variant={primaryAction.variant || variant}
        size={primaryAction.size || size}
        disabled={disabled}
        onClick={handleDropdownToggle}
        className="rounded-l-none px-2 border-l border-gray-300"
      >
        <ChevronDownIcon className="h-4 w-4" />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && createPortal(
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            {secondaryActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleSecondaryAction(action)}
                disabled={action.disabled}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center',
                  action.variant === 'danger' && 'text-red-600 hover:bg-red-50',
                  action.variant === 'success' && 'text-green-600 hover:bg-green-50',
                  action.variant === 'primary' && 'text-blue-600 hover:bg-blue-50'
                )}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>,
        document.body
      )}
    </div>
  )
}

// Componente para múltiplos dropdowns
export interface MultiDropdownButtonGroupProps {
  groups: {
    primaryAction: ButtonGroupItem
    secondaryActions: ButtonGroupItem[]
  }[]
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  spacing?: 'sm' | 'md' | 'lg'
}

export const MultiDropdownButtonGroup: React.FC<MultiDropdownButtonGroupProps> = ({
  groups,
  className = '',
  size = 'md',
  variant = 'secondary',
  spacing = 'md'
}) => {
  const getSpacingClass = () => {
    switch (spacing) {
      case 'sm':
        return 'space-x-1'
      case 'lg':
        return 'space-x-3'
      default:
        return 'space-x-2'
    }
  }

  return (
    <div className={cn('flex', getSpacingClass(), className)}>
      {groups.map((group, index) => (
        <DropdownButtonGroup
          key={index}
          primaryAction={group.primaryAction}
          secondaryActions={group.secondaryActions}
          size={size}
          variant={variant}
        />
      ))}
    </div>
  )
}
