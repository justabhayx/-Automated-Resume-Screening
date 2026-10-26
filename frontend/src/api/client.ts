import axios from 'axios'

// Use the deployed backend URL in production when configured.
// Keep the Vite proxy for local development.
const apiBaseURL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_BASE_URL || '')
  : ''

export const api = axios.create({
  baseURL: apiBaseURL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)