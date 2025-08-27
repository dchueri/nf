import React, { useState } from "react";
import { Button } from "../ui/Button";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface Props {
  name: string
  cnpj: string
  email: string
  invoiceDeadline?: string // Data limite para envio das notas fiscais (formato: YYYY-MM-DD)
}

export const MyCompany = ({ name, cnpj, email, invoiceDeadline }: Props) => {
  const [formData, setFormData] = useState({
    name: name || '',
    cnpj: cnpj || '',
    email: email || '',
    invoiceDeadline: invoiceDeadline || '',
    emailNotifications: 'enabled',
    deadlineStrategy: 'fixed_day' as 'fixed_day' | 'start_month' | 'end_month',
    deadlineDay: 15, // Dia fixo do mês (1-31)
    deadlineDaysFromStart: 5, // Dias úteis do início do mês
    deadlineDaysFromEnd: 5 // Dias úteis do fim do mês
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar as alterações
    console.log('Dados da empresa:', formData);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para calcular a data limite baseada na estratégia selecionada
  const calculateDeadlineDate = (strategy: string, month: number, year: number) => {
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth();
    const targetYear = year || currentDate.getFullYear();
    
    switch (strategy) {
      case 'fixed_day':
        return new Date(targetYear, targetMonth, formData.deadlineDay);
      
      case 'start_month':
        return getNthWorkingDay(targetYear, targetMonth, formData.deadlineDaysFromStart, 'start');
      
      case 'end_month':
        return getNthWorkingDay(targetYear, targetMonth, formData.deadlineDaysFromEnd, 'end');
      
      default:
        return new Date(targetYear, targetMonth, 15);
    }
  };

  // Função para obter o N-ésimo dia útil do início ou fim do mês
  const getNthWorkingDay = (year: number, month: number, days: number, direction: 'start' | 'end') => {
    let currentDate: Date;
    let workingDays = 0;
    
    if (direction === 'start') {
      currentDate = new Date(year, month, 1);
      while (workingDays < days) {
        if (isWorkingDay(currentDate)) {
          workingDays++;
        }
        if (workingDays < days) {
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    } else {
      currentDate = new Date(year, month + 1, 0); // Último dia do mês
      while (workingDays < days) {
        if (isWorkingDay(currentDate)) {
          workingDays++;
        }
        if (workingDays < days) {
          currentDate.setDate(currentDate.getDate() - 1);
        }
      }
    }
    
    return currentDate;
  };

  // Função para verificar se um dia é útil (não é fim de semana)
  const isWorkingDay = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Domingo, 6 = Sábado
  };

  // Função para obter a data limite do próximo mês para preview
  const getNextMonthDeadline = () => {
    const currentDate = new Date();
    const nextMonth = currentDate.getMonth() + 1;
    const nextYear = nextMonth > 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
    const adjustedMonth = nextMonth > 11 ? 0 : nextMonth;
    
    return calculateDeadlineDate(formData.deadlineStrategy, adjustedMonth, nextYear);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        {/* Seção 1: Dados da Empresa */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ
              </label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Seção 2: Configurações de Notas Fiscais */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Configurações de Notas Fiscais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail para Recebimento
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@empresa.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                E-mail que receberá as notas fiscais dos colaboradores
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enviar Notas Fiscais por E-mail
              </label>
              <select
                value={formData.emailNotifications || 'enabled'}
                onChange={(e) => handleInputChange('emailNotifications', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="enabled">Ativado</option>
                <option value="disabled">Desativado</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Envia as notas fiscais automaticamente para o e-mail configurado após o termino do prazo             </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estratégia de Data Limite para Notas Fiscais
            </label>
            
            {/* Seleção da Estratégia */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="fixed_day"
                  name="deadlineStrategy"
                  value="fixed_day"
                  checked={formData.deadlineStrategy === 'fixed_day'}
                  onChange={(e) => handleInputChange('deadlineStrategy', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="fixed_day" className="text-sm font-medium text-gray-700">
                  Dia fixo do mês
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="start_month"
                  name="deadlineStrategy"
                  value="start_month"
                  checked={formData.deadlineStrategy === 'start_month'}
                  onChange={(e) => handleInputChange('deadlineStrategy', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="start_month" className="text-sm font-medium text-gray-700">
                  Dias úteis do início do mês
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="end_month"
                  name="deadlineStrategy"
                  value="end_month"
                  checked={formData.deadlineStrategy === 'end_month'}
                  onChange={(e) => handleInputChange('deadlineStrategy', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="end_month" className="text-sm font-medium text-gray-700">
                  Dias úteis do fim do mês
                </label>
              </div>
            </div>

            {/* Configurações específicas para cada estratégia */}
            <div className="pl-6 space-y-4">
              {/* Dia fixo do mês */}
              {formData.deadlineStrategy === 'fixed_day' && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Dia do mês (1-31)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.deadlineDay}
                    onChange={(e) => handleInputChange('deadlineDay', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Ex: 15 = todo dia 15 de cada mês
                  </p>
                </div>
              )}

              {/* Dias úteis do início do mês */}
              {formData.deadlineStrategy === 'start_month' && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Quantos dias úteis do início do mês?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.deadlineDaysFromStart}
                    onChange={(e) => handleInputChange('deadlineDaysFromStart', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Ex: 5 = 5º dia útil do mês (ignorando fins de semana)
                  </p>
                </div>
              )}

              {/* Dias úteis do fim do mês */}
              {formData.deadlineStrategy === 'end_month' && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Quantos dias úteis do fim do mês?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.deadlineDaysFromEnd}
                    onChange={(e) => handleInputChange('deadlineDaysFromEnd', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Ex: 3 = 3º dia útil antes do fim do mês
                  </p>
                </div>
              )}
            </div>

            {/* Preview da data limite */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                📅 Preview da Data Limite
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Próximo mês:</strong> {formatDateForDisplay(getNextMonthDeadline().toISOString())}
                </p>
                <p>
                  <strong>Mês atual:</strong> {formatDateForDisplay(calculateDeadlineDate(formData.deadlineStrategy, new Date().getMonth(), new Date().getFullYear()).toISOString())}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              A data limite será calculada automaticamente baseada na estratégia selecionada
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
}
