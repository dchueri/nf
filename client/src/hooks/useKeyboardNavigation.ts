import { useEffect, useCallback } from 'react'

interface KeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: () => void
  enabled?: boolean
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions = {}) => {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    enabled = true
  } = options

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    switch (event.key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault()
          onEscape()
        }
        break
      case 'Enter':
        if (onEnter) {
          event.preventDefault()
          onEnter()
        }
        break
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault()
          onArrowUp()
        }
        break
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault()
          onArrowDown()
        }
        break
      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault()
          onArrowLeft()
        }
        break
      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault()
          onArrowRight()
        }
        break
      case 'Tab':
        if (onTab) {
          onTab()
        }
        break
    }
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab])

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [handleKeyDown, enabled])
}

// Hook para focus management
export const useFocusManagement = () => {
  const focusFirstElement = useCallback((containerRef: HTMLElement | null) => {
    if (!containerRef) return

    const focusableElements = containerRef.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement
      firstElement.focus()
    }
  }, [])

  const focusLastElement = useCallback((containerRef: HTMLElement | null) => {
    if (!containerRef) return

    const focusableElements = containerRef.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
      lastElement.focus()
    }
  }, [])

  const trapFocus = useCallback((containerRef: HTMLElement | null) => {
    if (!containerRef) return

    const focusableElements = containerRef.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  return {
    focusFirstElement,
    focusLastElement,
    trapFocus
  }
}

// Hook para screen reader announcements
export const useScreenReaderAnnouncement = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove the announcement after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  return { announce }
}

// Hook para skip links
export const useSkipLink = (targetId: string) => {
  const handleSkipLink = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.focus()
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [targetId])

  return { handleSkipLink }
}
