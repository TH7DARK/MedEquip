'use client';

import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import Link from 'next/link';

export default function EquipamentosList() {
  // Estado para armazenar os equipamentos (simulado por enquanto)
  const [equipamentos, setEquipamentos] = useState([
    { 
      id: 1, 
      numero_serie: 'SN12345678', 
      marca: 'Philips', 
      modelo: 'IntelliVue MX40',
      unidade: 'Hospital Central',
      cidade: 'São Paulo',
      status: 'Ativo'
    },
    { 
      id: 2, 
      numero_serie: 'SN87654321', 
      marca: 'GE Healthcare', 
      modelo: 'Carescape R860',
      unidade: 'Clínica Norte',
      cidade: 'Rio de Janeiro',
      status: 'Em manutenção'
    },
    { 
      id: 3, 
      numero_serie: 'SN11223344', 
      marca: 'Siemens', 
      modelo: 'MAGNETOM Aera',
      unidade: 'Centro Diagnóstico',
      cidade: 'Belo Horizonte',
      status: 'Ativo'
    }
  ]);

  // Estado para filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Função para filtrar equipamentos
  const filteredEquipamentos = equipamentos.filter(equip => {
    const matchesSearch = 
      equip.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.unidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'Todos' || equip.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Equipamentos Médicos</h1>
        <Link 
          href="/equipamentos/novo" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Novo Equipamento</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar por número de série, marca, modelo..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-500" />
          <select
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Todos">Todos os status</option>
            <option value="Ativo">Ativo</option>
            <option value="Em manutenção">Em manutenção</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Série
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca/Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipamentos.length > 0 ? (
                filteredEquipamentos.map((equip) => (
                  <tr key={equip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {equip.numero_serie}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{equip.marca}</div>
                      <div className="text-xs text-gray-400">{equip.modelo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {equip.unidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {equip.cidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${equip.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                          equip.status === 'Em manutenção' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {equip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/equipamentos/${equip.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        Detalhes
                      </Link>
                      <Link href={`/equipamentos/${equip.id}/editar`} className="text-indigo-600 hover:text-indigo-900">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum equipamento encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
