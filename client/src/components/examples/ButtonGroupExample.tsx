import React from 'react'
import { ButtonGroup, ActionGroup, ToolbarGroup, DropdownButtonGroup, MultiDropdownButtonGroup } from '../ui/ButtonGroup'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'

export const ButtonGroupExample: React.FC = () => {
  const handleApprove = () => console.log('Aprovar')
  const handleReject = () => console.log('Rejeitar')
  const handleEdit = () => console.log('Editar')
  const handleDelete = () => console.log('Excluir')
  const handleView = () => console.log('Ver')
  const handleDownload = () => console.log('Download')

  const approvalActions = [
    {
      id: 'approve',
      label: 'Aprovar',
      icon: <CheckCircleIcon className="h-4 w-4" />,
      onClick: handleApprove,
      variant: 'success' as const
    },
    {
      id: 'reject',
      label: 'Rejeitar',
      icon: <XCircleIcon className="h-4 w-4" />,
      onClick: handleReject,
      variant: 'danger' as const
    }
  ]

  const editActions = [
    {
      id: 'edit',
      label: 'Editar',
      icon: <PencilIcon className="h-4 w-4" />,
      onClick: handleEdit
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: <TrashIcon className="h-4 w-4" />,
      onClick: handleDelete,
      variant: 'danger' as const
    }
  ]

  const viewActions = [
    {
      id: 'view',
      label: 'Ver',
      icon: <EyeIcon className="h-4 w-4" />,
      onClick: handleView
    },
    {
      id: 'download',
      label: 'Download',
      icon: <DocumentArrowDownIcon className="h-4 w-4" />,
      onClick: handleDownload
    }
  ]

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">ButtonGroup - Horizontal</h2>
        <ButtonGroup items={approvalActions} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">ButtonGroup - Vertical</h2>
        <ButtonGroup items={editActions} orientation="vertical" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">ButtonGroup - Attached</h2>
        <ButtonGroup items={approvalActions} attached />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">ActionGroup - Small</h2>
        <ActionGroup items={viewActions} size="xs" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">ToolbarGroup</h2>
        <ToolbarGroup items={[...approvalActions, ...editActions]} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">ButtonGroup - Custom Spacing</h2>
        <ButtonGroup items={viewActions} spacing="lg" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">ButtonGroup - Mixed Variants</h2>
        <ButtonGroup 
          items={[
            ...approvalActions,
            ...editActions,
            ...viewActions
          ]} 
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">DropdownButtonGroup - Aprovar com Ações</h2>
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
              onClick: () => console.log('Aprovar Todos')
            },
            {
              id: 'approve-selected',
              label: 'Aprovar Selecionados',
              icon: <CheckCircleIcon className="h-4 w-4" />,
              onClick: () => console.log('Aprovar Selecionados')
            }
          ]}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">DropdownButtonGroup - Adicionar com Opções</h2>
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
              icon: <PlusIcon className="h-4 w-4" />,
              onClick: () => console.log('Adicionar Usuário')
            },
            {
              id: 'add-invoice',
              label: 'Adicionar Nota Fiscal',
              icon: <PlusIcon className="h-4 w-4" />,
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

      <div>
        <h2 className="text-lg font-semibold mb-4">DropdownButtonGroup - Mais Ações</h2>
        <DropdownButtonGroup
          primaryAction={{
            id: 'more',
            label: 'Mais Ações',
            icon: <EllipsisVerticalIcon className="h-4 w-4" />,
            onClick: () => console.log('Mais Ações'),
            variant: 'secondary'
          }}
          secondaryActions={[
            {
              id: 'export',
              label: 'Exportar',
              icon: <DocumentArrowDownIcon className="h-4 w-4" />,
              onClick: () => console.log('Exportar')
            },
            {
              id: 'duplicate',
              label: 'Duplicar',
              icon: <PlusIcon className="h-4 w-4" />,
              onClick: () => console.log('Duplicar')
            },
            {
              id: 'archive',
              label: 'Arquivar',
              icon: <TrashIcon className="h-4 w-4" />,
              onClick: () => console.log('Arquivar'),
              variant: 'danger'
            }
          ]}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">MultiDropdownButtonGroup - Múltiplos Dropdowns</h2>
        <MultiDropdownButtonGroup
          groups={[
            {
              primaryAction: {
                id: 'approve',
                label: 'Aprovar',
                icon: <CheckCircleIcon className="h-4 w-4" />,
                onClick: handleApprove,
                variant: 'success'
              },
              secondaryActions: [
                {
                  id: 'approve-all',
                  label: 'Aprovar Todos',
                  onClick: () => console.log('Aprovar Todos')
                },
                {
                  id: 'approve-selected',
                  label: 'Aprovar Selecionados',
                  onClick: () => console.log('Aprovar Selecionados')
                }
              ]
            },
            {
              primaryAction: {
                id: 'reject',
                label: 'Rejeitar',
                icon: <XCircleIcon className="h-4 w-4" />,
                onClick: handleReject,
                variant: 'danger'
              },
              secondaryActions: [
                {
                  id: 'reject-all',
                  label: 'Rejeitar Todos',
                  onClick: () => console.log('Rejeitar Todos')
                },
                {
                  id: 'reject-selected',
                  label: 'Rejeitar Selecionados',
                  onClick: () => console.log('Rejeitar Selecionados')
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  )
}
