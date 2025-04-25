'use client';

import { useEffect, useState } from 'react';
import { useManutencoes } from '@/lib/contexts/ManutencaoContext';
import { useEquipamentos } from '@/lib/contexts/EquipamentoContext';
import { Wrench, Filter, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ManutencoesListContainer({ equipamentoId = null }) {
  const { manutencoes, getManutencoes, getManutencoesEquipamento, loading, error } = useManutencoes();
  const { getEquipamento } = useEquipamentos();
  
  const [equipamento, setEquipamento] = useState(null);
  const [filteredManutencoes, setFilteredManutencoes] = useState([]);
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');

  useEffect(() => {
    const fetchData = async () => {
      if (equipamentoId) {
        // Buscar manutenções de um equipamento específico
        const equip = await getEquipamento(Number(equipamentoId));
        if (equip) {
          setEquipamento(equip);
        }
        const manutencoesEquip = await getManutencoesEquipamento(Number(equipamentoId));
        setFilteredManutencoes(manutencoesEquip);
      } else {
        // Buscar todas as manutenções
        await getManutencoes();
      }
    };

    fetchData();
  }, [equipamentoId, getManutencoes, getManutencoesEquipamento, getEquipamento]);

  // Atualizar manutenções filtradas quando as manutenções ou filtros mudarem
  useEffect(() => {
    if (!equipamentoId) {
      const filtered = manutencoes.filter(manutencao => {
        const matchesTipo = filterTipo === 'Todos' || manutencao.tipo === filterTipo;
        const matchesStatus = filterStatus === 'Todos' || manutencao.status === filterStatus;
        return matchesTipo && matchesStatus;
      });
      setFilteredManutencoes(filtered);
    }
  }, [manutencoes, filterTipo, filterStatus, equipamentoId]);

  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {equipamento 
            ? `Manutenções - ${equipamento.marca} ${equipamento.modelo || ''} (${equipamento.numero_serie})`
            : 'Manutenções'
          }
        </h1>
        <Link 
          href={equipamentoId ? `/manutencoes/novo?equipamento=${equipamentoId}` : '/manutencoes/novo'} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Nova Manutenção</span>
        </Link>
      </div>

      {!equipamentoId && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              <option value="Todos">Todos os tipos</option>
              <option value="Preventiva">Preventiva</option>
              <option value="Corretiva">Corretiva</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Todos">Todos os status</option>
              <option value="Concluída">Concluída</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Agendada">Agendada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : filteredManutencoes.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {!equipamentoId && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipamento
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Realização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Manutenção
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Técnico
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
                {filteredManutencoes.map((manutencao) => (
                  <tr key={manutencao.id} className="hover:bg-gray-50">
                    {!equipamentoId && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="font-medium">{manutencao.equipamento?.marca}</div>
                        <div className="text-xs text-gray-400">{manutencao.equipamento?.numero_serie}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${manutencao.tipo === 'Preventiva' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {manutencao.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatarData(manutencao.data_realizacao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {manutencao.data_proxima_manutencao ? (
                        <div className="flex items-center">
                          <Calendar size={14} className="text-blue-500 mr-1" />
                          {formatarData(manutencao.data_proxima_manutencao)}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {manutencao.tecnico_responsavel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${manutencao.status === 'Concluída' ? 'bg-green-100 text-green-800' : 
                          manutencao.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' : 
                          manutencao.status === 'Agendada' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {manutencao.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/manutencoes/${manutencao.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        Detalhes
                      </Link>
                      <Link href={`/manutencoes/${manutencao.id}/editar`} className="text-indigo-600 hover:text-indigo-900">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma manutenção encontrada</h3>
          <p className="text-gray-500">
            {equipamentoId 
              ? 'Este equipamento ainda não possui registros de manutenção.' 
              : 'Não há manutenções registradas com os filtros selecionados.'
            }
          </p>
          <Link 
            href={equipamentoId ? `/manutencoes/novo?equipamento=${equipamentoId}` : '/manutencoes/novo'} 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Registrar Manutenção
          </Link>
        </div>
      )}
    </div>
  );
}
