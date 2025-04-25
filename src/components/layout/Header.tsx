'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, BarChart2, Clipboard, Wrench, Bell, Settings, Home } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-blue-600 dark:bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h1 className="text-xl font-bold">MedEquip Manager</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="flex items-center space-x-1 hover:text-blue-200 dark:hover:text-blue-300 transition">
              <Home size={18} />
              <span>Início</span>
            </Link>
            <Link href="/equipamentos" className="flex items-center space-x-1 hover:text-blue-200 dark:hover:text-blue-300 transition">
              <Clipboard size={18} />
              <span>Equipamentos</span>
            </Link>
            <Link href="/manutencoes" className="flex items-center space-x-1 hover:text-blue-200 dark:hover:text-blue-300 transition">
              <Wrench size={18} />
              <span>Manutenções</span>
            </Link>
            <Link href="/dashboard" className="flex items-center space-x-1 hover:text-blue-200 dark:hover:text-blue-300 transition">
              <BarChart2 size={18} />
              <span>Dashboard</span>
            </Link>
            <Link href="/alertas" className="flex items-center space-x-1 hover:text-blue-200 dark:hover:text-blue-300 transition">
              <Bell size={18} />
              <span>Alertas</span>
            </Link>
            <Link href="/configuracoes" className="flex items-center space-x-1 hover:text-blue-200 dark:hover:text-blue-300 transition">
              <Settings size={18} />
              <span>Configurações</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-3">
            <Link href="/" className="block py-2 px-2 hover:bg-blue-700 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2">
              <Home size={18} />
              <span>Início</span>
            </Link>
            <Link href="/equipamentos" className="block py-2 px-2 hover:bg-blue-700 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2">
              <Clipboard size={18} />
              <span>Equipamentos</span>
            </Link>
            <Link href="/manutencoes" className="block py-2 px-2 hover:bg-blue-700 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2">
              <Wrench size={18} />
              <span>Manutenções</span>
            </Link>
            <Link href="/dashboard" className="block py-2 px-2 hover:bg-blue-700 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2">
              <BarChart2 size={18} />
              <span>Dashboard</span>
            </Link>
            <Link href="/alertas" className="block py-2 px-2 hover:bg-blue-700 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2">
              <Bell size={18} />
              <span>Alertas</span>
            </Link>
            <Link href="/configuracoes" className="block py-2 px-2 hover:bg-blue-700 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2">
              <Settings size={18} />
              <span>Configurações</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
