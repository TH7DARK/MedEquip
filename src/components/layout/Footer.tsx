'use client';

import { Footer as FooterType } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; 2025 MedEquip Manager. Todos os direitos reservados.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">Termos de Uso</a>
            <a href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">Política de Privacidade</a>
            <a href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">Suporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
