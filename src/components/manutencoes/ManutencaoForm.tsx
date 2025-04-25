'use client';

import { useState } from 'react';
import { Save, X, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ManutencaoForm({ manutencao = null, equipamentoId = null }) {
  // Estado para o formulário
  const [formData, setFormData] = useState({
    equipamento_id: manutencao?.equipamento_id || equipamentoId || '',
    tipo: manutencao?.tipo || 'Preventiva',
    data_realizacao: manutencao?.data_realizacao || new Date().toISOString().split('T')[0],
    data_proxima_manutencao: manutencao?.data_proxima_manutencao || '',
    tecnico_responsavel: manutencao?.tecnico_responsavel || '',
    tempo_servico: manutencao?.tempo_servico || '',
    descricao: manutencao?.descricao || '',
    pecas_substituidas: manutencao?.pecas_substituidas || '',
    custo: manutencao?.custo || '',
    status: manutencao?.status || 'Concluída',
    observacoes: manutencao?.observacoes || ''
  });

  // Função para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para salvar o formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para salvar no banco de dados
    console.log('Dados do formulário de manutenção:', formData);
    // Redirecionar após salvar
  };

  // Simulação de dados de equipamento (seria buscado do banco de dados)
  const equipamento = {
    id: equipamentoId || manutencao?.equipamento_id || 1,
    numero_serie: 'SN12345678',
    marca: 'Philips',
    modelo: 'IntelliVue MX40'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {manutencao ? 'Editar Registro de Manutenção' : 'Novo Registro de Manutenção'}
        </h1>
        <div className="flex space-x-2">
          <Link
            href={`/equipamentos/${equipamento.id}`}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <X size={18} />
            <span>Cancelar</span>
          </Link>
          <button
            type="submit"
            form="manutencao-form"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <Save size={18} />
            <span>Salvar</span>
          </button>
        </div>
      </div>

      {/* Informações do equipamento */}
      <div className="bg-blue-50 p-4 rounded-md">
        <h2 className="text-md font-semibold text-blue-800 mb-2">Informações do Equipamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Número de Série</p>
            <p className="font-medium">{equipamento.numero_serie}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Marca</p>
            <p className="font-medium">{equipamento.marca}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Modelo</p>
            <p className="font-medium">{equipamento.modelo}</p>
          </div>
        </div>
      </div>

      <form id="manutencao-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Detalhes da Manutenção</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Manutenção *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Preventiva">Preventiva</option>
                <option value="Corretiva">Corretiva</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Concluída">Concluída</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Agendada">Agendada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Realização *
              </label>
              <input
                type="date"
                name="data_realizacao"
                value={formData.data_realizacao}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data da Próxima Manutenção
              </label>
              <input
                type="date"
                name="data_proxima_manutencao"
                value={formData.data_proxima_manutencao}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.data_proxima_manutencao && (
                <div className="mt-1 flex items-center text-sm text-blue-600">
                  <Calendar size={14} className="mr-1" />
                  <span>Alerta será criado automaticamente</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Técnico Responsável *
              </label>
              <input
                type="text"
                name="tecnico_responsavel"
                value={formData.tecnico_responsavel}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo de Serviço (minutos)
              </label>
              <input
                type="number"
                name="tempo_servico"
                value={formData.tempo_servico}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo (R$)
              </label>
              <input
                type="number"
                name="custo"
                value={formData.custo}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peças Substituídas
            </label>
            <textarea
              name="pecas_substituidas"
              value={formData.pecas_substituidas}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Liste as peças substituídas durante a manutenção"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição do Serviço *
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva detalhadamente o serviço realizado"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações Adicionais
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais sobre a manutenção"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
