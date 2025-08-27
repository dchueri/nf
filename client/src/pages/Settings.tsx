import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  UserIcon,
  BuildingOfficeIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { MyProfile } from 'components/settings/MyProfile';
import { MyCompany } from 'components/settings/MyCompany';
import { Security } from 'components/settings/Security';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Meu Perfil',
      description: 'Gerencie suas informações pessoais e preferências',
      icon: UserIcon,
      content: <MyProfile name="John Doe" email="john.doe@example.com" role="Software Engineer" phone="123-456-7890" />,
    },
    {
      id: 'company',
      title: 'Minha Empresa',
      description: 'Gerencie as configurações da sua empresa',
      icon: BuildingOfficeIcon,
      content: <MyCompany name="Tech Solutions Ltda" cnpj="12.345.678/0001-90" email="techsolutions@example.com" invoiceDeadline="2024-01-31" />,
    },
    // {
    //   id: 'notifications',
    //   title: 'Notificações',
    //   description: 'Configure suas preferências de notificação',
    //   icon: BellIcon,
    //   content: (
    //     <div className="space-y-6">
    //       <div className="space-y-4">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <h4 className="text-sm font-medium text-gray-900">Notificações por Email</h4>
    //             <p className="text-sm text-gray-500">Receba notificações importantes por email</p>
    //           </div>
    //           <label className="relative inline-flex items-center cursor-pointer">
    //             <input type="checkbox" defaultChecked className="sr-only peer" />
    //             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    //           </label>
    //         </div>



    //         <div className="flex items-center justify-between">
    //           <div>
    //             <h4 className="text-sm font-medium text-gray-900">Relatórios Semanais</h4>
    //             <p className="text-sm text-gray-500">Receba relatórios semanais por email</p>
    //           </div>
    //           <label className="relative inline-flex items-center cursor-pointer">
    //             <input type="checkbox" className="sr-only peer" />
    //             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    //           </label>
    //         </div>
    //       </div>

    //       <div className="flex justify-end">
    //         <Button>Salvar Preferências</Button>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      id: 'security',
      title: 'Segurança',
      description: 'Gerencie suas configurações de segurança',
      icon: ShieldCheckIcon,
      content: <Security />,
    },
    // {
    //   id: 'integrations',
    //   title: 'Integrações',
    //   description: 'Gerencie suas integrações com outros serviços',
    //   icon: KeyIcon,
    //   content: (
    //     <div className="space-y-6">
    //       <div className="space-y-4">
    //         <div className="border border-gray-200 rounded-lg p-4">
    //           <div className="flex items-center justify-between">
    //             <div className="flex items-center space-x-3">
    //               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
    //                 <GlobeAltIcon className="h-6 w-6 text-blue-600" />
    //               </div>
    //               <div>
    //                 <h4 className="text-sm font-medium text-gray-900">Google Workspace</h4>
    //                 <p className="text-sm text-gray-500">Sincronize com Google Drive e Calendar</p>
    //               </div>
    //             </div>
    //             <Button variant="secondary" size="sm">
    //               Conectar
    //             </Button>
    //           </div>
    //         </div>

    //         <div className="border border-gray-200 rounded-lg p-4">
    //           <div className="flex items-center justify-between">
    //             <div className="flex items-center space-x-3">
    //               <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
    //                 <DocumentTextIcon className="h-6 w-6 text-green-600" />
    //               </div>
    //               <div>
    //                 <h4 className="text-sm font-medium text-gray-900">Microsoft Office</h4>
    //                 <p className="text-sm text-gray-500">Sincronize com OneDrive e Outlook</p>
    //               </div>
    //             </div>
    //             <Button variant="secondary" size="sm">
    //               Conectar
    //             </Button>
    //           </div>
    //         </div>

    //         <div className="border border-gray-200 rounded-lg p-4">
    //           <div className="flex items-center justify-between">
    //             <div className="flex items-center space-x-3">
    //               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
    //                 <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
    //               </div>
    //               <div>
    //                 <h4 className="text-sm font-medium text-gray-900">Slack</h4>
    //                 <p className="text-sm text-gray-500">Receba notificações no Slack</p>
    //               </div>
    //             </div>
    //             <Button variant="secondary" size="sm">
    //               Conectar
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   ),
    // },
  ];

  const activeContent = settingsSections.find(section => section.id === activeSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 p-6">
            {activeContent && (
              <motion.div
                key={activeContent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">{activeContent.title}</h2>
                  <p className="text-gray-600">{activeContent.description}</p>
                </div>
                {activeContent.content}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
