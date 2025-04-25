'use client';

import RootLayout from '@/components/layout/RootLayout';
import Providers from '@/lib/providers';

export default function ConfiguracoesPage() {
  return (
    <Providers>
      <RootLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold dark:text-white">Configurações</h1>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Preferências do Sistema</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Configure suas preferências para personalizar sua experiência com o sistema.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium mb-2 dark:text-white">Tema</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Você pode alternar entre o tema claro e escuro usando o botão no canto inferior direito da tela.
                </p>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2 dark:text-white">Notificações</h3>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notifications" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Receber notificações de alertas de manutenção
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2 dark:text-white">Idioma</h3>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Sobre o Sistema</h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium dark:text-white">Nome:</span> Sistema de Gerenciamento de Equipamentos Médicos
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium dark:text-white">Versão:</span> 1.0.0
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium dark:text-white">Desenvolvido por:</span> Manus AI
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium dark:text-white">Contato:</span> suporte@exemplo.com
              </p>
            </div>
          </div>
        </div>
      </RootLayout>
    </Providers>
  );
}
