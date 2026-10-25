import axios from 'axios'

// In production, use the VITE_API_BASE_URL env var; otherwise, use the Vite proxy for local development
const isProduction = import.meta.env.PROD
const apiBaseURL = isProduction ? (import.meta.env.VITE_API_BASE_URL || '') : '/api'

export const api = axios.create({
  baseURL: apiBaseURL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)
