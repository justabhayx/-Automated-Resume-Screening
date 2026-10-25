import { useState } from 'react'
import { api } from '../api/client'
import { ScreenResponse } from '../types'

interface UseScreenReturn {
  loading: boolean
  error: string | null
  results: ScreenResponse | null
  screen: (jobDescription: string, files: File[]) => Promise<void>
  reset: () => void
}

export function useScreen(): UseScreenReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ScreenResponse | null>(null)

  const screen = async (jobDescription: string, files: File[]): Promise<void> => {
    if (!jobDescription.trim()) {
      setError('Job description is required.')
      return
    }

    if (files.length === 0) {
      setError('At least one resume file must be uploaded.')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('job_description', jobDescription)

      files.forEach((file) => {
        formData.append('resumes', file)
      })

      const response = await api.post<ScreenResponse>('/screen', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResults(response.data)
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        'An unexpected error occurred during screening.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResults(null)
    setError(null)
    setLoading(false)
  }

  return { loading, error, results, screen, reset }
}
