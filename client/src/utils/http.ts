import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Configuração base do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsInN1YiI6IjY4YjcyZjQyMWQ4MTkzYjk2Y2MzODkxNCIsInJvbGUiOiJjb21wYW55IiwiY29tcGFueUlkIjoiNTA3ZjFmNzdiY2Y4NmNkNzk5NDM5MDExIiwiaWF0IjoxNzU2ODM1NjUwLCJleHAiOjE3NTc0NDA0NTB9.Rn7j1g0RmmqdqH1bpbaBLYf_d9WkmWBgmyqLWpbWixE');
    //   window.location.href = '/login';
      throw new Error('Não autorizado');
    }
    
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        `Erro ${error.response?.status}: ${error.response?.statusText}`;
    
    console.error('Erro na requisição:', error);
    throw new Error(errorMessage);
  }
);

// Helper para fazer requisições autenticadas
export const request = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    console.log('ooo')
    const response = await api.request<T>({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};