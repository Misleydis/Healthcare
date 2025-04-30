import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  role: "patient" | "doctor" | "admin" | "nurse"
  specialty?: string
  phoneNumber?: string
  address?: string
  createdAt?: string
  bio?: string
  firstName: string
  lastName: string
}

type UserRole = "patient" | "doctor" | "admin" | "nurse"

interface AuthState {
  token: string | null
  userData: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  register: (
    credentials: Omit<User, "id" | "name"> & { password: string; firstName: string; lastName: string },
  ) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUserData: (data: Partial<User>) => Promise<boolean>
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userData: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      register: async (credentials) => {
        set({ loading: true, error: null })

        try {
          const response = await fetch('https://auth-backend-qyna.onrender.com/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          })

          const data = await response.json()

          if (!response.ok) {
            set({ loading: false, error: data.message || "Registration failed" })
            console.error("Registration failed:", data.message)
            return false
          }

          const newUser: User = {
            id: data.userId,
            name: `${credentials.firstName} ${credentials.lastName}`,
            email: credentials.email,
            role: data.role,
            specialty: credentials.specialty,
            phoneNumber: credentials.phoneNumber,
            bio: "",
            createdAt: new Date().toISOString(),
            address: "",
            firstName: credentials.firstName,
            lastName: credentials.lastName,
          }

          set({
            token: data.token,
            userData: newUser,
            isAuthenticated: true,
            loading: false,
          })

          console.log("Registration successful for user:", credentials.email)
          return true

        } catch (error) {
          console.error("Registration error:", error)
          set({ loading: false, error: "Registration failed" })
          return false
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null })

        try {
          const response = await fetch('https://auth-backend-qyna.onrender.com/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            console.error("Login failed:", data.message)
            set({ loading: false, error: data.message || "Invalid credentials" })
            return false
          }

          set({
            token: data.token,
            userData: data.user,
            isAuthenticated: true,
            loading: false,
          })

          console.log("Login successful for user:", email)
          return true

        } catch (error) {
          console.error("Login error:", error)
          set({ loading: false, error: "Login failed" })
          return false
        }
      },

      logout: () => set({ token: null, userData: null, isAuthenticated: false }),

      updateUserData: async (data) => {
        set({ loading: true, error: null })

        try {
          const token = get().token
          const response = await fetch('https://auth-backend-qyna.onrender.com/api/users/me', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            const errorData = await response.json()
            set({ loading: false, error: errorData.message || "Failed to update user data" })
            return false
          }

          const updatedUser = await response.json()

          set((state) => ({
            userData: state.userData ? { ...state.userData, ...updatedUser } : null,
            loading: false,
          }))

          console.log("User data updated successfully")
          return true

        } catch (error) {
          console.error("Update user data error:", error)
          set({ loading: false, error: "Failed to update user data" })
          return false
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

export type { UserRole }
export default useAuthStore
