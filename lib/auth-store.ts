import { create } from "zustand"
import { persist } from "zustand/middleware"

// Helper function to safely access localStorage
const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key)
  }
  return null
}

// Helper function to safely set localStorage
const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value)
  }
}

// Helper function to safely remove from localStorage
const removeLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key)
  }
}

export type UserRole = "admin" | "doctor" | "nurse" | "patient"

interface UserData {
  _id?: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  specialty?: string
  phoneNumber?: string
  address?: string
  createdAt?: string
}

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  error: string | null
  loading: boolean
  userData: UserData | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
    specialty?: string
    phoneNumber?: string
    address?: string
  }) => Promise<boolean>
  logout: () => void
  updateUserData: (data: Partial<UserData>) => Promise<boolean>
}

// Mock API endpoint - in a real app, this would be your actual API URL
const API_URL = "https://auth-backend-qyna.onrender.com/api"

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: getLocalStorage("token") || null,
      isAuthenticated: !!getLocalStorage("token"),
      error: null,
      loading: false,
      userData: getLocalStorage("userData") ? JSON.parse(getLocalStorage("userData") || "{}") : null,

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          // Simulate API call with a delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // In a real app, this would be a fetch call to your API
          // const response = await fetch(`${API_URL}/login`, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email, password }),
          // });
          // const data = await response.json();
          // if (!response.ok) throw new Error(data.message || 'Login failed');

          // For demo purposes, we'll create mock user data based on email
          let role: UserRole = "patient"
          let specialty = ""
          let firstName = email.split("@")[0]
          let lastName = "User"

          // Determine role based on email prefix
          if (email.includes("admin")) {
            role = "admin"
            firstName = "Admin"
            lastName = "User"
          } else if (email.includes("doctor")) {
            role = "doctor"
            firstName = "Doctor"
            lastName = "Smith"
            specialty = "General Medicine"
          } else if (email.includes("nurse")) {
            role = "nurse"
            firstName = "Nurse"
            lastName = "Johnson"
            specialty = "General Care"
          }

          const userData = {
            _id: `user_${Math.random().toString(36).substring(2, 9)}`,
            email,
            firstName,
            lastName,
            role,
            specialty,
            phoneNumber: "+263 7" + Math.floor(Math.random() * 10000000),
            createdAt: new Date().toISOString(),
          }

          const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)

          setLocalStorage("token", token)
          setLocalStorage("userData", JSON.stringify(userData))

          set({
            token,
            isAuthenticated: true,
            userData,
            loading: false,
          })

          return true
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            loading: false,
          })
          return false
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null })
        try {
          // Validate required fields
          const { email, password, firstName, lastName, role } = userData

          if (!email || !password || !firstName || !lastName) {
            set({
              error: "Please fill in all required fields",
              loading: false,
            })
            return false
          }

          // Simulate API call with a delay
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // In a real app, this would be a fetch call to your API
          // const response = await fetch(`${API_URL}/register`, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(userData),
          // });
          // const data = await response.json();
          // if (!response.ok) throw new Error(data.message || 'Registration failed');

          const newUserData = {
            _id: `user_${Math.random().toString(36).substring(2, 9)}`,
            email,
            firstName,
            lastName,
            role,
            specialty: userData.specialty || "",
            phoneNumber: userData.phoneNumber || "",
            address: userData.address || "",
            createdAt: new Date().toISOString(),
          }

          const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)

          setLocalStorage("token", token)
          setLocalStorage("userData", JSON.stringify(newUserData))

          set({
            token,
            isAuthenticated: true,
            userData: newUserData,
            loading: false,
          })

          return true
        } catch (error: any) {
          set({
            error: error.message || "Registration failed",
            loading: false,
          })
          return false
        }
      },

      logout: () => {
        removeLocalStorage("token")
        removeLocalStorage("userData")
        set({ token: null, isAuthenticated: false, userData: null, error: null })
      },

      updateUserData: async (data) => {
        set({ loading: true, error: null })
        try {
          // Simulate API call with a delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // In a real app, this would be a fetch call to your API
          // const response = await fetch(`${API_URL}/users/me`, {
          //   method: 'PATCH',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${get().token}`
          //   },
          //   body: JSON.stringify(data),
          // });
          // const updatedData = await response.json();
          // if (!response.ok) throw new Error(updatedData.message || 'Update failed');

          const updatedUserData = { ...get().userData, ...data } as UserData
          setLocalStorage("userData", JSON.stringify(updatedUserData))

          set({
            userData: updatedUserData,
            loading: false,
          })

          return true
        } catch (error: any) {
          set({
            error: error.message || "Update failed",
            loading: false,
          })
          return false
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, userData: state.userData }),
    },
  ),
)

export default useAuthStore
