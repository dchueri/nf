import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { SummaryCard } from './SummaryCard';
import { InvoiceFilters } from './InvoiceFilters';
import { InvoiceTable } from './InvoiceTable';
import { InvoiceCharts } from './InvoiceCharts';
import { Invoice, InvoiceFilters as InvoiceFiltersType } from '../../types/invoice';
import { invoiceService } from '../../services/invoiceService';

export const Dashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InvoiceFiltersType>({});

  // Dados mockados para demonstração
  const mockInvoices: Invoice[] = [
    {
      _id: '1',
      companyId: 'company1',
      submittedBy: { _id: 'user1', name: 'João Silva', email: 'joao@empresa.com' },
      invoiceNumber: 'NF-001/2024',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 2500.00,
      description: 'Serviços de consultoria técnica',
      type: 'invoice' as any,
      status: 'pending' as any,
      fileName: 'nf-001-2024.pdf',
      filePath: '/uploads/nf-001-2024.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      notes: 'Invoice pendente de aprovação',
      reminderCount: 0,
      tags: ['consultoria', 'técnica'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      _id: '2',
      companyId: 'company1',
      submittedBy: { _id: 'user2', name: 'Maria Santos', email: 'maria@empresa.com' },
      invoiceNumber: 'NF-002/2024',
      issueDate: '2024-01-20',
      dueDate: '2024-02-20',
      amount: 1800.00,
      description: 'Desenvolvimento de software',
      type: 'invoice' as any,
      status: 'submitted' as any,
      fileName: 'nf-002-2024.pdf',
      filePath: '/uploads/nf-002-2024.pdf',
      fileSize: 2048000,
      mimeType: 'application/pdf',
      notes: 'Software para gestão de estoque',
      reminderCount: 1,
      tags: ['desenvolvimento', 'software'],
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    {
      _id: '3',
      companyId: 'company1',
      submittedBy: { _id: 'user1', name: 'João Silva', email: 'joao@empresa.com' },
      invoiceNumber: 'NF-003/2024',
      issueDate: '2024-01-10',
      dueDate: '2024-02-10',
      amount: 3200.00,
      description: 'Manutenção de equipamentos',
      type: 'invoice' as any,
      status: 'approved' as any,
      fileName: 'nf-003-2024.pdf',
      filePath: '/uploads/nf-003-2024.pdf',
      fileSize: 1536000,
      mimeType: 'application/pdf',
      notes: 'Manutenção preventiva mensal',
      reminderCount: 0,
      tags: ['manutenção', 'equipamentos'],
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-10T09:15:00Z',
    },
  ];

  useEffect(() => {
    // Simular carregamento de dados
    const loadData = async () => {
      try {
        setLoading(true);
        // Em produção, usar: const data = await invoiceService.getInvoices();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
        setInvoices(mockInvoices);
        setFilteredInvoices(mockInvoices);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar invoices');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let filtered = [...invoices];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.description.toLowerCase().includes(searchLower) ||
        invoice.submittedBy.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(invoice => invoice.type === filters.type);
    }

    if (filters.startDate) {
      filtered = filtered.filter(invoice => 
        new Date(invoice.issueDate) >= new Date(filters.startDate!)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(invoice => 
        new Date(invoice.issueDate) <= new Date(filters.endDate!)
      );
    }

    setFilteredInvoices(filtered);
  }, [invoices, filters]);

  const handleFiltersChange = (newFilters: InvoiceFiltersType) => {
    setFilters(newFilters);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log('Visualizar invoice:', invoice);
    // Implementar modal de visualização
  };

  const handleEditInvoice = (invoice: Invoice) => {
    console.log('Editar invoice:', invoice);
    // Implementar modal de edição
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    console.log('Deletar invoice:', invoice);
    // Implementar confirmação de exclusão
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice);
    // Implementar download
  };

  const handleStatusChange = (invoice: Invoice, status: any) => {
    console.log('Mudar status:', invoice, status);
    // Implementar mudança de status
  };

  // Calcular métricas
  const totalInvoices = filteredInvoices.length;
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingInvoices = filteredInvoices.filter(invoice => invoice.status === 'pending').length;
  const overdueInvoices = filteredInvoices.filter(invoice => 
    new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid'
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header do Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Visão geral das suas notas fiscais e métricas de negócio
          </p>
        </motion.div>

        {/* Cards de Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <SummaryCard
            title="Total de Invoices"
            value={totalInvoices}
            change="+12% este mês"
            changeType="positive"
            icon={<DocumentTextIcon className="h-8 w-8" />}
          />
          <SummaryCard
            title="Valor Total"
            value={`R$ ${totalAmount.toLocaleString('pt-BR')}`}
            change="+8% este mês"
            changeType="positive"
            icon={<CurrencyDollarIcon className="h-8 w-8" />}
          />
          <SummaryCard
            title="Pendentes"
            value={pendingInvoices}
            change="+3 esta semana"
            changeType="neutral"
            icon={<ClockIcon className="h-8 w-8" />}
          />
          <SummaryCard
            title="Vencidas"
            value={overdueInvoices}
            change="+2 esta semana"
            changeType="negative"
            icon={<ExclamationTriangleIcon className="h-8 w-8" />}
          />
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <InvoiceFilters onFiltersChange={handleFiltersChange} />
        </motion.div>

        {/* Gráficos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <InvoiceCharts />
        </motion.div>

        {/* Tabela de Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Invoices ({filteredInvoices.length})
            </h2>
            <div className="text-sm text-gray-500">
              Mostrando {filteredInvoices.length} de {invoices.length} invoices
            </div>
          </div>
          <InvoiceTable
            invoices={filteredInvoices}
            onView={handleViewInvoice}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onDownload={handleDownloadInvoice}
            onStatusChange={handleStatusChange}
          />
        </motion.div>
      </div>
    </div>
  );
};
