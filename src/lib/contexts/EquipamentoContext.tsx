'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definição dos tipos
export interface Equipamento {
  id?: number;
  numero_serie: string;
  marca: string;
  modelo?: string;
  nota_fiscal?: string;
  unidade: string;
  cidade: string;
  telefone_suporte?: string;
  data_aquisicao?: string;
  data_garantia_ate?: string;
  status: string;
  foto_url?: string;
  manual_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface EquipamentoContextType {
  equipamentos: Equipamento[];
  loading: boolean;
  error: string | null;
  getEquipamentos: () => Promise<void>;
  getEquipamento: (id: number) => Promise<Equipamento | null>;
  createEquipamento: (equipamento: Equipamento) => Promise<number | null>;
  updateEquipamento: (id: number, equipamento: Equipamento) => Promise<boolean>;
  deleteEquipamento: (id: number) => Promise<boolean>;
  buscarInformacoesAutomaticas: (marca: string, modelo: string) => Promise<{foto_url?: string, manual_url?: string}>;
}

// Criação do contexto
const EquipamentoContext = createContext<EquipamentoContextType | undefined>(undefined);

// Hook para usar o contexto
export const useEquipamentos = () => {
  const context = useContext(EquipamentoContext);
  if (context === undefined) {
    throw new Error('useEquipamentos deve ser usado dentro de um EquipamentoProvider');
  }
  return context;
};

// Provider do contexto
useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
    }
  }, [equipamentos]);

export const EquipamentoProvider = ({ children }: { children: ReactNode }) => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todos os equipamentos
  const getEquipamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      // Em produção, isso seria substituído por uma chamada real à API
      setTimeout(() => {
        const mockEquipamentos: Equipamento[] = [
          { 
            id: 1, 
            numero_serie: 'SN12345678', 
            marca: 'Philips', 
            modelo: 'IntelliVue MX40',
            unidade: 'Hospital Central',
            cidade: 'São Paulo',
            status: 'Ativo',
            telefone_suporte: '(11) 1234-5678',
            data_aquisicao: '2023-05-15',
            data_garantia_ate: '2025-05-15'
          },
          { 
            id: 2, 
            numero_serie: 'SN87654321', 
            marca: 'GE Healthcare', 
            modelo: 'Carescape R860',
            unidade: 'Clínica Norte',
            cidade: 'Rio de Janeiro',
            status: 'Em manutenção',
            telefone_suporte: '(21) 9876-5432',
            data_aquisicao: '2022-10-20',
            data_garantia_ate: '2024-10-20'
          },
          { 
            id: 3, 
            numero_serie: 'SN11223344', 
            marca: 'Siemens', 
            modelo: 'MAGNETOM Aera',
            unidade: 'Centro Diagnóstico',
            cidade: 'Belo Horizonte',
            status: 'Ativo',
            telefone_suporte: '(31) 3344-5566',
            data_aquisicao: '2021-08-10',
            data_garantia_ate: '2026-08-10'
          }
        ];
        setEquipamentos(mockEquipamentos);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erro ao buscar equipamentos');
      setLoading(false);
    }
  };

  // Função para buscar um equipamento específico
  const getEquipamento = async (id: number): Promise<Equipamento | null> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const equipamento = equipamentos.find(e => e.id === id) || null;
          setLoading(false);
          resolve(equipamento);
        }, 500);
      });
    } catch (err) {
      setError('Erro ao buscar equipamento');
      setLoading(false);
      return null;
    }
  };

  // Função para criar um novo equipamento
  
const API_URL = '/api/equipamentos';

const getEquipamentos = async (): Promise<Equipamento[]> => {
  setLoading(true);
  try {
    const res = await fetch(API_URL);
    const data: Equipamento[] = await res.json();
    setEquipamentos(data);
    return data;
  } finally {
    setLoading(false);
  }
};

const createEquipamento = async (equipamento: Equipamento): Promise<number | null> => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(equipamento),
    });
    if (!res.ok) throw new Error('Falha ao criar');
    const newEq: Equipamento = await res.json();
    setEquipamentos(old => [...old, newEq]);
    return newEq.id ?? null;
  } catch (err) {
    setError((err as Error).message);
    return null;
  } finally {
    setLoading(false);
  }
};

const updateEquipamento = async (id: number, equipamento: Equipamento): Promise<boolean> => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...equipamento, id }),
    });
    if (!res.ok) throw new Error('Falha ao atualizar');
    const updated: Equipamento = await res.json();
    setEquipamentos(old => old.map(e => (e.id === id ? updated : e)));
    return true;
  } catch (err) {
    setError((err as Error).message);
    return false;
  } finally {
    setLoading(false);
  }
};

const deleteEquipamento = async (id: number): Promise<boolean> => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Falha ao excluir');
    setEquipamentos(old => old.filter(e => e.id !== id));
    return true;
  } catch (err) {
    setError((err as Error).message);
    return false;
  } finally {
    setLoading(false);
  }
};


  // Função para buscar informações automáticas
  const buscarInformacoesAutomaticas = async (marca: string, modelo: string): Promise<{foto_url?: string, manual_url?: string}> => {
    if (!marca || !modelo) {
      return {};
    }

    // Simulação de busca de informações
    return new Promise((resolve) => {
      setTimeout(() => {
        // Aqui seria implementada a integração com IA para buscar informações
        // Por enquanto, retornamos dados simulados
        const result = {
          foto_url: `https://exemplo.com/imagens/${marca.toLowerCase()}_${modelo.toLowerCase().replace(/\s+/g, '_')}.jpg`,
          manual_url: `https://exemplo.com/manuais/${marca.toLowerCase()}_${modelo.toLowerCase().replace(/\s+/g, '_')}.pdf`
        };
        resolve(result);
      }, 2000);
    });
  };

  // Carregar equipamentos ao inicializar
  useEffect(() => {
    getEquipamentos();
  }, []);

  const value = {
    equipamentos,
    loading,
    error,
    getEquipamentos,
    getEquipamento,
    createEquipamento,
    updateEquipamento,
    deleteEquipamento,
    buscarInformacoesAutomaticas
  };

  return (
    <EquipamentoContext.Provider value={value}>
      {children}
    </EquipamentoContext.Provider>
  );
};
