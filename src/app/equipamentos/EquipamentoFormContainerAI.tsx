'use client';

import { useEffect, useState } from 'react';
import { useEquipamentos, Equipamento } from '@/lib/contexts/EquipamentoContext';
import { buscarInformacoesEquipamento, InformacoesAutomaticasComponent } from '@/lib/services/equipamento-ai-service';
import { Save, X, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EquipamentoFormContainerAI({ equipamentoId = null }) {
  const router = useRouter();
  const { getEquipamento, createEquipamento, updateEquipamento, loading, error } = useEquipamentos();
  
  // Estado para o formulário
  const [formData, setFormData] = useState<Equipamento>({
    numero_serie: '',
    marca: '',
    modelo: '',
    nota_fiscal: '',
    unidade: '',
    cidade: '',
    telefone_suporte: '',
    data_aquisicao: '',
    data_garantia_ate: '',
    status: 'Ativo',
  });

  // Estado para informações automáticas
  const [autoInfo, setAutoInfo] = useState({
    foto_url: '',
    manual_url: '',
    descricao: '',
    especificacoes: []
  });

  // Carregar dados do equipamento se estiver editando
  useEffect(() => {
    const fetchEquipamento = async () => {
      if (equipamentoId) {
        const equipamento = await getEquipamento(Number(equipamentoId));
        if (equipamento) {
          setFormData(equipamento);
          setAutoInfo(prev => ({
            ...prev,
            foto_url: equipamento.foto_url || '',
            manual_url: equipamento.manual_url || ''
          }));
        }
      }
    };

    fetchEquipamento();
  }, [equipamentoId, getEquipamento]);

  // Função para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para lidar com informações encontradas pela IA
  const handleInformacoesEncontradas = (informacoes) => {
    setAutoInfo(informacoes);
  };

  // Função para salvar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const equipamentoData: Equipamento = {
      ...formData,
      foto_url: autoInfo.foto_url,
      manual_url: autoInfo.manual_url
    };
    
    try {
      if (equipamentoId) {
        // Atualizar equipamento existente
        const success = await updateEquipamento(Number(equipamentoId), equipamentoData);
        if (success) {
          router.push('/equipamentos');
        }
      } else {
        // Criar novo equipamento
        const newId = await createEquipamento(equipamentoData);
        if (newId) {
          router.push('/equipamentos');
        }
      }
    } catch (err) {
      console.error('Erro ao salvar equipamento:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {equipamentoId ? 'Editar Equipamento' : 'Novo Equipamento'}
        </h1>
        <div className="flex space-x-2">
          <Link
            href="/equipamentos"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <X size={18} />
            <span>Cancelar</span>
          </Link>
          <button
            type="submit"
            form="equipamento-form"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Salvar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <form id="equipamento-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Série *
              </label>
              <input
                type="text"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nota Fiscal
              </label>
              <input
                type="text"
                name="nota_fiscal"
                value={formData.nota_fiscal}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca *
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidade *
              </label>
              <input
                type="text"
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade *
              </label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone para Suporte
              </label>
              <input
                type="tel"
                name="telefone_suporte"
                value={formData.telefone_suporte}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ativo">Ativo</option>
                <option value="Em manutenção">Em manutenção</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Aquisição
              </label>
              <input
                type="date"
                name="data_aquisicao"
                value={formData.data_aquisicao}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Garantia até
              </label>
              <input
                type="date"
                name="data_garantia_ate"
                value={formData.data_garantia_ate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Componente de IA para busca automática de informações */}
        <InformacoesAutomaticasComponent 
          marca={formData.marca} 
          modelo={formData.modelo} 
          onInformacoesEncontradas={handleInformacoesEncontradas} 
        />
      </form>
    </div>
  );
}
