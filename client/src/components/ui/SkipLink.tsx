import React from 'react'
import { useSkipLink } from '../../hooks/useKeyboardNavigation'

interface SkipLinkProps {
  targetId: string
  children: React.ReactNode
  className?: string
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  children,
  className = ''
}) => {
  const { handleSkipLink } = useSkipLink(targetId)

  return (
    <a
      href={`#${targetId}`}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      onKeyDown={handleSkipLink}
    >
      {children}
    </a>
  )
}

// Componente para múltiplos skip links
export const SkipLinks: React.FC = () => {
  return (
    <>
      <SkipLink targetId="main-content">
        Pular para o conteúdo principal
      </SkipLink>
      <SkipLink targetId="navigation">
        Pular para a navegação
      </SkipLink>
      <SkipLink targetId="footer">
        Pular para o rodapé
      </SkipLink>
    </>
  )
}
