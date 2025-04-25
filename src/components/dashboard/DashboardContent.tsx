'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

export default function Dashboard() {
  // Dados simulados para os gráficos
  const [equipamentosPorStatus] = useState([
    { name: 'Ativos', value: 42, color: '#10B981' },
    { name: 'Em manutenção', value: 8, color: '#F59E0B' },
    { name: 'Inativos', value: 3, color: '#EF4444' }
  ]);

  const [manutencoesPorMes] = useState([
    { name: 'Jan', preventivas: 5, corretivas: 2 },
    { name: 'Fev', preventivas: 7, corretivas: 3 },
    { name: 'Mar', preventivas: 6, corretivas: 1 },
    { name: 'Abr', preventivas: 8, corretivas: 4 },
    { name: 'Mai', preventivas: 9, corretivas: 2 },
    { name: 'Jun', preventivas: 7, corretivas: 3 }
  ]);

  const [equipamentosPorUnidade] = useState([
    { name: 'Hospital Central', quantidade: 18 },
    { name: 'Clínica Norte', quantidade: 12 },
    { name: 'Centro Diagnóstico', quantidade: 15 },
    { name: 'Unidade Leste', quantidade: 8 }
  ]);

  // Dados simulados para os cards
  const [estatisticas] = useState({
    totalEquipamentos: 53,
    manutencoesPendentes: 4,
    alertasProximos: 7,
    manutencoesMes: 12
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total de Equipamentos</p>
              <p className="text-2xl font-bold">{estatisticas.totalEquipamentos}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Clipboard className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Manutenções Pendentes</p>
              <p className="text-2xl font-bold">{estatisticas.manutencoesPendentes}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Alertas Próximos</p>
              <p className="text-2xl font-bold">{estatisticas.alertasProximos}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Manutenções no Mês</p>
              <p className="text-2xl font-bold">{estatisticas.manutencoesMes}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de status dos equipamentos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Status dos Equipamentos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipamentosPorStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {equipamentosPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} equipamentos`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de manutenções por mês */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Manutenções por Mês</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={manutencoesPorMes}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="preventivas" name="Preventivas" fill="#3B82F6" />
                <Bar dataKey="corretivas" name="Corretivas" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de equipamentos por unidade */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Equipamentos por Unidade</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={equipamentosPorUnidade}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" name="Quantidade" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Próximas manutenções */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Próximas Manutenções</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Philips IntelliVue MX40</h3>
                  <p className="text-sm text-gray-500">Hospital Central - SN12345678</p>
                </div>
                <div className="flex items-center text-blue-600">
                  <Calendar size={16} className="mr-1" />
                  <span className="text-sm">28/04/2025</span>
                </div>
              </div>
              <p className="text-sm mt-1">Manutenção preventiva trimestral</p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">GE Healthcare Carescape R860</h3>
                  <p className="text-sm text-gray-500">Clínica Norte - SN87654321</p>
                </div>
                <div className="flex items-center text-yellow-600">
                  <Calendar size={16} className="mr-1" />
                  <span className="text-sm">05/05/2025</span>
                </div>
              </div>
              <p className="text-sm mt-1">Calibração semestral</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Siemens MAGNETOM Aera</h3>
                  <p className="text-sm text-gray-500">Centro Diagnóstico - SN11223344</p>
                </div>
                <div className="flex items-center text-green-600">
                  <Calendar size={16} className="mr-1" />
                  <span className="text-sm">12/05/2025</span>
                </div>
              </div>
              <p className="text-sm mt-1">Verificação de bobinas e calibração</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Drager Evita V500</h3>
                  <p className="text-sm text-gray-500">Hospital Central - SN55667788</p>
                </div>
                <div className="flex items-center text-purple-600">
                  <Calendar size={16} className="mr-1" />
                  <span className="text-sm">18/05/2025</span>
                </div>
              </div>
              <p className="text-sm mt-1">Manutenção preventiva mensal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
