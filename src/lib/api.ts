// src/lib/api.ts
// Arquivo para centralizar as chamadas de API para o backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Função auxiliar para fazer requisições HTTP
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Adiciona headers padrão para todas as requisições
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Obtém o token de autenticação do localStorage (se disponível)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Verifica se a resposta foi bem-sucedida
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Ocorreu um erro na requisição');
  }

  return response.json();
}

// API de Autenticação
export const authAPI = {
  login: (email: string, password: string) => 
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (name: string, email: string, password: string, role: string = 'user') => 
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),
  
  getMe: () => fetchAPI('/auth/me'),
  
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
};

// API de Equipamentos
export const equipamentosAPI = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    
    const queryString = queryParams.toString();
    return fetchAPI(`/equipment${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: number) => fetchAPI(`/equipment/${id}`),
  
  create: (equipamento: any) => 
    fetchAPI('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipamento),
    }),
  
  update: (id: number, equipamento: any) => 
    fetchAPI(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipamento),
    }),
  
  delete: (id: number) => 
    fetchAPI(`/equipment/${id}`, {
      method: 'DELETE',
    }),
  
  searchInfo: (brand: string, model: string) => 
    fetchAPI('/equipment/search-info', {
      method: 'POST',
      body: JSON.stringify({ brand, model }),
    }),
};

// API de Manutenções
export const manutencoesAPI = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    
    const queryString = queryParams.toString();
    return fetchAPI(`/maintenance${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: number) => fetchAPI(`/maintenance/${id}`),
  
  create: (manutencao: any) => 
    fetchAPI('/maintenance', {
      method: 'POST',
      body: JSON.stringify(manutencao),
    }),
  
  update: (id: number, manutencao: any) => 
    fetchAPI(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(manutencao),
    }),
  
  delete: (id: number) => 
    fetchAPI(`/maintenance/${id}`, {
      method: 'DELETE',
    }),
  
  getByEquipamento: (equipamentoId: number) => 
    fetchAPI(`/maintenance/equipment/${equipamentoId}`),
};

// API de Alertas
export const alertasAPI = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    
    const queryString = queryParams.toString();
    return fetchAPI(`/alerts${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: number) => fetchAPI(`/alerts/${id}`),
  
  create: (alerta: any) => 
    fetchAPI('/alerts', {
      method: 'POST',
      body: JSON.stringify(alerta),
    }),
  
  update: (id: number, status: string, message?: string) => 
    fetchAPI(`/alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, message }),
    }),
  
  delete: (id: number) => 
    fetchAPI(`/alerts/${id}`, {
      method: 'DELETE',
    }),
  
  getByEquipamento: (equipamentoId: number) => 
    fetchAPI(`/alerts/equipment/${equipamentoId}`),
};

// API de Dashboard
export const dashboardAPI = {
  getEquipmentStatus: () => fetchAPI('/dashboard/equipment-status'),
  
  getMaintenanceByMonth: (year?: number) => {
    const queryParams = year ? `?year=${year}` : '';
    return fetchAPI(`/dashboard/maintenance-by-month${queryParams}`);
  },
  
  getMaintenanceCosts: (period?: string) => {
    const queryParams = period ? `?period=${period}` : '';
    return fetchAPI(`/dashboard/maintenance-costs${queryParams}`);
  },
  
  getEquipmentMaintenanceFrequency: (limit?: number) => {
    const queryParams = limit ? `?limit=${limit}` : '';
    return fetchAPI(`/dashboard/equipment-maintenance-frequency${queryParams}`);
  },
};
