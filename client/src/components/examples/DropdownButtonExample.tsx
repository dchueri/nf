import React from 'react'
import { DropdownButtonGroup } from '../ui/ButtonGroup'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  PlusIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

export const DropdownButtonExample: React.FC = () => {
  const handleApprove = () => console.log('Aprovar')
  const handleReject = () => console.log('Rejeitar')
  const handleApproveAll = () => console.log('Aprovar Todos')
  const handleApproveSelected = () => console.log('Aprovar Selecionados')

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">DropdownButtonGroup - Exemplo Simples</h2>
      
      <div className="space-y-4">
        {/* Exemplo 1: Aprovar com ações secundárias */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Aprovar com Ações Secundárias:</h3>
          <DropdownButtonGroup
            primaryAction={{
              id: 'approve',
              label: 'Aprovar',
              icon: <CheckCircleIcon className="h-4 w-4" />,
              onClick: handleApprove,
              variant: 'success'
            }}
            secondaryActions={[
              {
                id: 'approve-all',
                label: 'Aprovar Todos',
                icon: <CheckCircleIcon className="h-4 w-4" />,
                onClick: handleApproveAll
              },
              {
                id: 'approve-selected',
                label: 'Aprovar Selecionados',
                icon: <CheckCircleIcon className="h-4 w-4" />,
                onClick: handleApproveSelected
              }
            ]}
          />
        </div>

        {/* Exemplo 2: Adicionar com opções */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Adicionar com Opções:</h3>
          <DropdownButtonGroup
            primaryAction={{
              id: 'add',
              label: 'Adicionar',
              icon: <PlusIcon className="h-4 w-4" />,
              onClick: () => console.log('Adicionar'),
              variant: 'primary'
            }}
            secondaryActions={[
              {
                id: 'add-user',
                label: 'Adicionar Usuário',
                onClick: () => console.log('Adicionar Usuário')
              },
              {
                id: 'add-invoice',
                label: 'Adicionar Nota Fiscal',
                onClick: () => console.log('Adicionar Nota Fiscal')
              },
              {
                id: 'import',
                label: 'Importar CSV',
                icon: <DocumentArrowDownIcon className="h-4 w-4" />,
                onClick: () => console.log('Importar CSV')
              }
            ]}
          />
        </div>

        {/* Exemplo 3: Rejeitar com ações perigosas */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Rejeitar com Ações Perigosas:</h3>
          <DropdownButtonGroup
            primaryAction={{
              id: 'reject',
              label: 'Rejeitar',
              icon: <XCircleIcon className="h-4 w-4" />,
              onClick: handleReject,
              variant: 'danger'
            }}
            secondaryActions={[
              {
                id: 'reject-all',
                label: 'Rejeitar Todos',
                icon: <XCircleIcon className="h-4 w-4" />,
                onClick: () => console.log('Rejeitar Todos'),
                variant: 'danger'
              },
              {
                id: 'reject-selected',
                label: 'Rejeitar Selecionados',
                icon: <XCircleIcon className="h-4 w-4" />,
                onClick: () => console.log('Rejeitar Selecionados'),
                variant: 'danger'
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}
