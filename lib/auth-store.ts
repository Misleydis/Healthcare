import { create } from "zustand"
import api from "./api"

interface User {
  _id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  specialty?: string
  phoneNumber?: string
  address?: string
}

interface AuthState {
  token: string | null
  user: User | null
  role: string | null
  loading: boolean
  error: string | null
  initialized: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, role?: string) => Promise<boolean>
  logout: () => void
  updateProfile: (profileData: Partial<User>) => Promise<boolean>
  fetchUserProfile: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

// Helper to safely access localStorage (only on client)
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key)
  }
  return null
}

const useAuthStore = create<AuthState>((set, get) => ({
  token: getLocalStorageItem("auth_token"),
  user: null,
  role: getLocalStorageItem("auth_role"),
  loading: false,
  error: null,
  initialized: false,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/login", { email, password })
      const { token, role } = response.data

      // Save to localStorage (client-side only)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
        localStorage.setItem("auth_role", role)
      }

      set({
        token,
        role,
        loading: false,
      })

      // Fetch user profile after successful login
      await get().fetchUserProfile()

      return true
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Login failed",
      })
      return false
    }
  },

  register: async (email: string, password: string, role = "patient") => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/register", { email, password, role })
      const { token, role: userRole } = response.data

      // Save to localStorage (client-side only)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
        localStorage.setItem("auth_role", userRole)
      }

      set({
        token,
        role: userRole,
        loading: false,
      })

      // Fetch user profile after successful registration
      await get().fetchUserProfile()

      return true
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Registration failed",
      })
      return false
    }
  },

  logout: () => {
    // Clear localStorage (client-side only)
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_role")
    }

    set({ token: null, user: null, role: null })
  },

  updateProfile: async (profileData: Partial<User>) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put("/users/me", profileData)
      set({ user: response.data, loading: false })
      return true
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Profile update failed",
      })
      return false
    }
  },

  fetchUserProfile: async () => {
    const { token } = get()
    if (!token) return

    set({ loading: true, error: null })
    try {
      const response = await api.get("/users/me")
      set({ user: response.data, loading: false, initialized: true })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch user profile",
        initialized: true,
      })
    }
  },

  checkAuth: async () => {
    const { token, initialized, fetchUserProfile } = get()

    if (!token) {
      set({ initialized: true })
      return false
    }

    if (!initialized) {
      await fetchUserProfile()
    }

    return !!get().user
  },
}))

export default useAuthStore
