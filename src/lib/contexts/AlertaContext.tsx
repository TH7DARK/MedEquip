'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Equipamento } from './EquipamentoContext';

// Definição dos tipos
export interface Alerta {
  id?: number;
  equipamento_id: number;
  data_alerta: string;
  tipo_manutencao: string;
  descricao?: string;
  status: 'Pendente' | 'Enviado' | 'Concluído' | 'Cancelado';
  created_at?: string;
  updated_at?: string;
  equipamento?: Equipamento;
}

interface AlertaContextType {
  alertas: Alerta[];
  loading: boolean;
  error: string | null;
  getAlertas: () => Promise<void>;
  getAlertasEquipamento: (equipamentoId: number) => Promise<Alerta[]>;
  getAlerta: (id: number) => Promise<Alerta | null>;
  createAlerta: (alerta: Alerta) => Promise<number | null>;
  updateAlerta: (id: number, alerta: Alerta) => Promise<boolean>;
  deleteAlerta: (id: number) => Promise<boolean>;
  marcarComoConcluido: (id: number) => Promise<boolean>;
  marcarComoCancelado: (id: number) => Promise<boolean>;
}

// Criação do contexto
const AlertaContext = createContext<AlertaContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAlertas = () => {
  const context = useContext(AlertaContext);
  if (context === undefined) {
    throw new Error('useAlertas deve ser usado dentro de um AlertaProvider');
  }
  return context;
};

// Provider do contexto
export const AlertaProvider = ({ children }: { children: ReactNode }) => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todos os alertas
  const getAlertas = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      setTimeout(() => {
        const mockAlertas: Alerta[] = [
          { 
            id: 1, 
            equipamento_id: 1,
            data_alerta: '2025-04-28',
            tipo_manutencao: 'Preventiva',
            descricao: 'Manutenção preventiva trimestral',
            status: 'Pendente',
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
            data_alerta: '2025-05-05',
            tipo_manutencao: 'Preventiva',
            descricao: 'Calibração semestral',
            status: 'Pendente',
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
            equipamento_id: 3,
            data_alerta: '2025-05-12',
            tipo_manutencao: 'Preventiva',
            descricao: 'Verificação de bobinas e calibração',
            status: 'Enviado',
            equipamento: {
              id: 3,
              numero_serie: 'SN11223344',
              marca: 'Siemens',
              modelo: 'MAGNETOM Aera',
              unidade: 'Centro Diagnóstico',
              cidade: 'Belo Horizonte',
              status: 'Ativo'
            }
          }
        ];
        setAlertas(mockAlertas);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erro ao buscar alertas');
      setLoading(false);
    }
  };

  // Função para buscar alertas de um equipamento específico
  const getAlertasEquipamento = async (equipamentoId: number): Promise<Alerta[]> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredAlertas = alertas.filter(a => a.equipamento_id === equipamentoId);
          setLoading(false);
          resolve(filteredAlertas);
        }, 500);
      });
    } catch (err) {
      setError('Erro ao buscar alertas do equipamento');
      setLoading(false);
      return [];
    }
  };

  // Função para buscar um alerta específico
  const getAlerta = async (id: number): Promise<Alerta | null> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const alerta = alertas.find(a => a.id === id) || null;
          setLoading(false);
          resolve(alerta);
        }, 500);
      });
    } catch (err) {
      setError('Erro ao buscar alerta');
      setLoading(false);
      return null;
    }
  };

  // Função para criar um novo alerta
  const createAlerta = async (alerta: Alerta): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const newId = alertas.length > 0 ? Math.max(...alertas.map(a => a.id || 0)) + 1 : 1;
          const newAlerta = { 
            ...alerta, 
            id: newId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setAlertas([...alertas, newAlerta]);
          setLoading(false);
          resolve(newId);
        }, 1000);
      });
    } catch (err) {
      setError('Erro ao criar alerta');
      setLoading(false);
      return null;
    }
  };

  // Função para atualizar um alerta
  const updateAlerta = async (id: number, alerta: Alerta): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = alertas.findIndex(a => a.id === id);
          if (index !== -1) {
            const updatedAlertas = [...alertas];
            updatedAlertas[index] = { 
              ...alerta, 
              id, 
              updated_at: new Date().toISOString() 
            };
            setAlertas(updatedAlertas);
            setLoading(false);
            resolve(true);
          } else {
            setError('Alerta não encontrado');
            setLoading(false);
            resolve(false);
          }
        }, 1000);
      });
    } catch (err) {
      setError('Erro ao atualizar alerta');
      setLoading(false);
      return false;
    }
  };

  // Função para excluir um alerta
  const deleteAlerta = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredAlertas = alertas.filter(a => a.id !== id);
          if (filteredAlertas.length < alertas.length) {
            setAlertas(filteredAlertas);
            setLoading(false);
            resolve(true);
          } else {
            setError('Alerta não encontrado');
            setLoading(false);
            resolve(false);
          }
        }, 1000);
      });
    } catch (err) {
      setError('Erro ao excluir alerta');
      setLoading(false);
      return false;
    }
  };

  // Função para marcar alerta como concluído
  const marcarComoConcluido = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = alertas.findIndex(a => a.id === id);
          if (index !== -1) {
            const updatedAlertas = [...alertas];
            updatedAlertas[index] = { 
              ...updatedAlertas[index], 
              status: 'Concluído', 
              updated_at: new Date().toISOString() 
            };
            setAlertas(updatedAlertas);
            setLoading(false);
            resolve(true);
          } else {
            setError('Alerta não encontrado');
            setLoading(false);
            resolve(false);
          }
        }, 1000);
      });
    } catch (err) {
      setError('Erro ao marcar alerta como concluído');
      setLoading(false);
      return false;
    }
  };

  // Função para marcar alerta como cancelado
  const marcarComoCancelado = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de chamada à API
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = alertas.findIndex(a => a.id === id);
          if (index !== -1) {
            const updatedAlertas = [...alertas];
            updatedAlertas[index] = { 
              ...updatedAlertas[index], 
              status: 'Cancelado', 
              updated_at: new Date().toISOString() 
            };
            setAlertas(updatedAlertas);
            setLoading(false);
            resolve(true);
          } else {
            setError('Alerta não encontrado');
            setLoading(false);
            resolve(false);
          }
        }, 1000);
      });
    } catch (err) {
      setError('Erro ao marcar alerta como cancelado');
      setLoading(false);
      return false;
    }
  };

  // Carregar alertas ao inicializar
  useEffect(() => {
    getAlertas();
  }, []);

  const value = {
    alertas,
    loading,
    error,
    getAlertas,
    getAlertasEquipamento,
    getAlerta,
    createAlerta,
    updateAlerta,
    deleteAlerta,
    marcarComoConcluido,
    marcarComoCancelado
  };

  return (
    <AlertaContext.Provider value={value}>
      {children}
    </AlertaContext.Provider>
  );
};
