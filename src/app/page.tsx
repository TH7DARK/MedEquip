'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RootLayout from '@/components/layout/RootLayout';
import Link from 'next/link';
import { Clipboard, Wrench, BarChart2, Bell, Plus } from 'lucide-react';
import Providers from '@/lib/providers';

export default function Home() {
  return (
    <Providers>
      <RootLayout>
        <div className="space-y-8">
          <div className="text-center py-12 px-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Sistema de Gerenciamento de Equipamentos Médicos</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Gerencie seus equipamentos médicos, registre manutenções preventivas e corretivas, 
              e receba alertas para manutenções programadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/equipamentos" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
                  <Clipboard className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Equipamentos</h2>
                <p className="text-gray-600 dark:text-gray-300">Cadastre e gerencie todos os seus equipamentos médicos.</p>
              </div>
            </Link>

            <Link href="/manutencoes" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                  <Wrench className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Manutenções</h2>
                <p className="text-gray-600 dark:text-gray-300">Registre manutenções preventivas e corretivas.</p>
              </div>
            </Link>

            <Link href="/dashboard" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full mb-4">
                  <BarChart2 className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Dashboard</h2>
                <p className="text-gray-600 dark:text-gray-300">Visualize estatísticas e relatórios sobre seus equipamentos.</p>
              </div>
            </Link>

            <Link href="/alertas" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full mb-4">
                  <Bell className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
                </div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Alertas</h2>
                <p className="text-gray-600 dark:text-gray-300">Gerencie alertas para manutenções programadas.</p>
              </div>
            </Link>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0 md:mr-6">
                <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-100 mb-2">Comece agora mesmo</h2>
                <p className="text-blue-700 dark:text-blue-200">
                  Cadastre seu primeiro equipamento médico e comece a gerenciar suas manutenções.
                </p>
              </div>
              <Link 
                href="/equipamentos/novo" 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-md flex items-center"
              >
                <Plus className="mr-2" size={20} />
                <span>Novo Equipamento</span>
              </Link>
            </div>
          </div>
        </div>
      </RootLayout>
    </Providers>
  );
}
