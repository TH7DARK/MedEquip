'use client';

import { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AlertasList() {
  // Estado para armazenar os alertas (simulado por enquanto)
  const [alertas, setAlertas] = useState([
    { 
      id: 1, 
      equipamento_id: 1,
      equipamento: {
        numero_serie: 'SN12345678',
        marca: 'Philips',
        modelo: 'IntelliVue MX40',
        unidade: 'Hospital Central'
      },
      data_alerta: '2025-04-28',
      tipo_manutencao: 'Preventiva',
      descricao: 'Manutenção preventiva trimestral',
      status: 'Pendente'
    },
    { 
      id: 2, 
      equipamento_id: 2,
      equipamento: {
        numero_serie: 'SN87654321',
        marca: 'GE Healthcare',
        modelo: 'Carescape R860',
        unidade: 'Clínica Norte'
      },
      data_alerta: '2025-05-05',
      tipo_manutencao: 'Preventiva',
      descricao: 'Calibração semestral',
      status: 'Pendente'
    },
    { 
      id: 3, 
      equipamento_id: 3,
      equipamento: {
        numero_serie: 'SN11223344',
        marca: 'Siemens',
        modelo: 'MAGNETOM Aera',
        unidade: 'Centro Diagnóstico'
      },
      data_alerta: '2025-05-12',
      tipo_manutencao: 'Preventiva',
      descricao: 'Verificação de bobinas e calibração',
      status: 'Enviado'
    }
  ]);

  // Estado para filtros
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Função para marcar alerta como concluído
  const marcarComoConcluido = (id) => {
    setAlertas(alertas.map(alerta => 
      alerta.id === id ? { ...alerta, status: 'Concluído' } : alerta
    ));
  };

  // Função para marcar alerta como cancelado
  const marcarComoCancelado = (id) => {
    setAlertas(alertas.map(alerta => 
      alerta.id === id ? { ...alerta, status: 'Cancelado' } : alerta
    ));
  };

  // Função para filtrar alertas
  const filteredAlertas = alertas.filter(alerta => {
    return filterStatus === 'Todos' || alerta.status === filterStatus;
  });

  // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alertas de Manutenção</h1>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <Bell size={18} className="text-gray-500" />
        <select
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="Todos">Todos os alertas</option>
          <option value="Pendente">Pendentes</option>
          <option value="Enviado">Enviados</option>
          <option value="Concluído">Concluídos</option>
          <option value="Cancelado">Cancelados</option>
        </select>
      </div>

      {filteredAlertas.length > 0 ? (
        <div className="space-y-4">
          {filteredAlertas.map((alerta) => (
            <div 
              key={alerta.id} 
              className={`border rounded-lg shadow-sm p-4 ${
                alerta.status === 'Pendente' ? 'border-l-4 border-l-yellow-500' :
                alerta.status === 'Enviado' ? 'border-l-4 border-l-blue-500' :
                alerta.status === 'Concluído' ? 'border-l-4 border-l-green-500' :
                'border-l-4 border-l-gray-500'
              }`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{alerta.equipamento.marca} {alerta.equipamento.modelo}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      alerta.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      alerta.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                      alerta.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {alerta.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {alerta.equipamento.unidade} - {alerta.equipamento.numero_serie}
                  </p>
                </div>
                <div className="flex items-center mt-2 md:mt-0">
                  <Calendar size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm">{formatarData(alerta.data_alerta)}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm">
                  <span className="font-medium">Tipo:</span> {alerta.tipo_manutencao}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Descrição:</span> {alerta.descricao}
                </p>
              </div>
              
              {(alerta.status === 'Pendente' || alerta.status === 'Enviado') && (
                <div className="mt-4 flex space-x-2">
                  <Link 
                    href={`/manutencoes/novo?equipamento=${alerta.equipamento_id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm flex items-center"
                  >
                    <Calendar size={14} className="mr-1" />
                    <span>Registrar Manutenção</span>
                  </Link>
                  <button 
                    onClick={() => marcarComoConcluido(alerta.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm flex items-center"
                  >
                    <CheckCircle size={14} className="mr-1" />
                    <span>Marcar como Concluído</span>
                  </button>
                  <button 
                    onClick={() => marcarComoCancelado(alerta.id)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm flex items-center"
                  >
                    <AlertTriangle size={14} className="mr-1" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum alerta encontrado</h3>
          <p className="text-gray-500">Não há alertas com o status selecionado.</p>
        </div>
      )}
    </div>
  );
}
