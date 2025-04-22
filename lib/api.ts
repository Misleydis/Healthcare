import axios from "axios"
import { toast } from "@/components/ui/use-toast"

const API_URL = "https://auth-backend-qyna.onrender.com/api"
const API_BASE_URL = "https://auth-backend-qyna.onrender.com/api"

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
})

interface ApiOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
  includeAuth?: boolean
}

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear auth data on 401 errors
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_role")
      }
    }
    return Promise.reject(error)
  },
)

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, includeAuth = true } = options

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  // Add auth token if available and includeAuth is true
  if (includeAuth) {
    const token = localStorage.getItem("auth_token")
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`
    }
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: "include",
  }

  if (body && method !== "GET") {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions)

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") === -1) {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      return {} as T
    }

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.message || `API request failed with status ${response.status}`
      throw new Error(errorMessage)
    }

    return data as T
  } catch (error) {
    console.error("API request error:", error)

    // Show toast notification for errors
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    })

    throw error
  }
}

export default api
