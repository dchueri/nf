import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface Response<T> {
  data: T
  message: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Configuração base do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - redirecionar para login
      localStorage.removeItem('access_token')
      sessionStorage.removeItem('access_token')
      console.log('Token expirado ou inválido - redirecionando para login')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      throw new Error(error.response?.data?.message || 'Não autorizado')
    }

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Erro ${error.response?.status}: ${error.response?.statusText}`

    console.error('Erro na requisição:', error)
    throw new Error(errorMessage)
  }
)

// Helper para fazer requisições autenticadas
export const request = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<{ data: T; message: string }> => {
  const response = await api.request<T, { data: T; message: string }>({
    url: endpoint,
    ...options
  })
  return response
}
