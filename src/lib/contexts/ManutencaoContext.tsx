'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Equipamento } from './EquipamentoContext';

// Definição dos tipos
export interface Manutencao {
  id?: number;
  equipamento_id: number;
  tipo: 'Preventiva' | 'Corretiva';
  data_realizacao: string;
  data_proxima_manutencao?: string;
  tecnico_responsavel: string;
  tempo_servico?: number;
  descricao: string;
  pecas_substituidas?: string;
  custo?: number;
  status: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
  equipamento?: Equipamento;
}

interface ManutencaoContextType {
  manutencoes: Manutencao[];
  loading: boolean;
  error: string | null;
  getManutencoes: () => Promise<void>;
  getManutencoesEquipamento: (equipamentoId: number) => Promise<Manutencao[]>;
  getManutencao: (id: number) => Promise<Manutencao | null>;
  createManutencao: (manutencao: Manutencao) => Promise<number | null>;
  updateManutencao: (id: number, manutencao: Manutencao) => Promise<boolean>;
  deleteManutencao: (id: number) => Promise<boolean>;
}

// Criação do contexto
const ManutencaoContext = createContext<ManutencaoContextType | undefined>(undefined);

// Hook para usar o contexto
export const useManutencoes = () => {
  const context = useContext(ManutencaoContext);
  if (context === undefined) {
    throw new Error('useManutencoes deve ser usado dentro de um ManutencaoProvider');
  }
  return context;
};

// Provider do contexto
export const ManutencaoProvider = ({ children }: { children: ReactNode }) => {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todas as manutenções
  const getManutencoes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      setTimeout(() => {
        const mockManutencoes: Manutencao[] = [
          { 
            id: 1, 
            equipamento_id: 1,
            tipo: 'Preventiva',
            data_realizacao: '2025-01-15',
            data_proxima_manutencao: '2025-04-15',
            tecnico_responsavel: 'João Silva',
            tempo_servico: 120,
            descricao: 'Manutenção preventiva trimestral',
            status: 'Concluída',
            equipamento: {
              id: 1,
              numero_serie: 'SN12345678',
              marca: 'Philips',
              modelo: 'IntelliVue MX40',
              unidade: 'Hospital Central',
              cidade: 'São Paulo',
              status: 'Ativo'
            }
          },
          { 
            id: 2, 
            equipamento_id: 2,
            tipo: 'Corretiva',
            data_realizacao: '2025-02-10',
            tecnico_responsavel: 'Maria Oliveira',
            tempo_servico: 180,
            descricao: 'Substituição de peça com defeito',
            pecas_substituidas: 'Sensor de oximetria',
            custo: 1200.50,
            status: 'Concluída',
            equipamento: {
              id: 2,
              numero_serie: 'SN87654321',
              marca: 'GE Healthcare',
              modelo: 'Carescape R860',
              unidade: 'Clínica Norte',
              cidade: 'Rio de Janeiro',
              status: 'Em manutenção'
            }
          },
          { 
            id: 3, 
            equipamento_id: 1,
            tipo: 'Preventiva',
            data_realizacao: '2025-04-15',
            data_proxima_manutencao: '2025-07-15',
            tecnico_responsavel: 'Carlos Santos',
            tempo_servico: 90,
            descricao: 'Calibração e verificação geral',
            status: 'Agendada',
            equipamento: {
              id: 1,
              numero_serie: 'SN12345678',
              marca: 'Philips',
              modelo: 'IntelliVue MX40',
              unidade: 'Hospital Central',
              cidade: 'São Paulo',
              status: 'Ativo'
            }
          }
        ];
        setManutencoes(mockManutencoes);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erro ao buscar manutenções');
      setLoading(false);
    }
  };

  // Função para buscar manutenções de um equipamento específico
  const getManutencoesEquipamento = async (equipamentoId: number): Promise<Manutencao[]> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredManutencoes = manutencoes.filter(m => m.equipamento_id === equipamentoId);
          setLoading(false);
          resolve(filteredManutencoes);
        }, 500);
      });
    } catch (err) {
      setError('Erro ao buscar manutenções do equipamento');
      setLoading(false);
      return [];
    }
  };

  // Função para buscar uma manutenção específica
  const getManutencao = async (id: number): Promise<Manutencao | null> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const manutencao = manutencoes.find(m => m.id === id) || null;
          setLoading(false);
          resolve(manutencao);
        }, 500);
      });
    } catch (err) {
      setError('Erro ao buscar manutenção');
      setLoading(false);
      return null;
    }
  };

  // Função para criar uma nova manutenção
  const createManutencao = async (manutencao: Manutencao): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const newId = manutencoes.length > 0 ? Math.max(...manutencoes.map(m => m.id || 0)) + 1 : 1;
          const newManutencao = { 
            ...manutencao, 
            id: newId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setManutencoes([...manutencoes, newManutencao]);
          
          // Se houver data para próxima manutenção, criar alerta (simulado)
          if (manutencao.data_proxima_manutencao) {
            console.log(`Alerta criado para manutenção em ${manutencao.data_proxima_manutencao}`);
          }
          
          setLoading(false);
          resolve(newId);
        }, 1000);
      });
    } catch (err) {
      setError('Erro ao criar manutenção');
      setLoading(false);
      return null;
    }
  };

  // Função para atualizar uma manutenção
  const updateManutencao = async (id: number, manutencao: Manutencao): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = manutencoes.findIndex(m => m.id === id);
          if (index !== -1) {
            const updatedManutencoes = [...manutencoes];
            updatedManutencoes[index] = { 
              ...manutencao, 
              id, 
              updated_at: new Date().toISOString() 
            };
            setManutencoes(updatedManutencoes);
            setLoading(false);
            resolve(true);
          } else {
            setError('Manutenção não encontrada');
            setLoading(false);
            resolve(false);
          }
        }, 1000);
      });
    } catch (err) {
      setError('Erro ao atualizar manutenção');
      setLoading(false);
      return false;
    }
  };

  // Função para excluir uma manutenção
  const deleteManutencao = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredManutencoes = manutencoes.filter(m => m.id !== id);
          if (filteredManutencoes.length < manutencoes.length) {
            setManutencoes(filteredManutencoes);
            setLoading(false);
            resolve(true);
          } else {
            setError('Manutenção não encontrada');
            setLoading(false);
            resolve(false);
          }
        }, 1000);
      });
    } catch (err) {
      setError('Erro ao excluir manutenção');
      setLoading(false);
      return false;
    }
  };

  // Carregar manutenções ao inicializar
  useEffect(() => {
    getManutencoes();
  }, []);

  const value = {
    manutencoes,
    loading,
    error,
    getManutencoes,
    getManutencoesEquipamento,
    getManutencao,
    createManutencao,
    updateManutencao,
    deleteManutencao
  };

  return (
    <ManutencaoContext.Provider value={value}>
      {children}
    </ManutencaoContext.Provider>
  );
};
