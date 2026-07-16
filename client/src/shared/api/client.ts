import type { ApiResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const json = await response.json()

    if (!response.ok) {
      return { error: json.message || json.error || 'Error en la solicitud' }
    }

    const data = json.data ?? json
    return { data, raw: json }
  } catch {
    return { error: 'Error de conexión con el servidor' }
  }
}

export const api = {
  post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return request<T>(endpoint)
  },

  put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      method: 'DELETE',
    })
  },
}
