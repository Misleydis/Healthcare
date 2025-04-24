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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        if (credentials.email === "existing@example.com") {
          set({ loading: false, error: "Email already exists" })
          return false
        }
        const newUser: User = {
          id: Math.random().toString(),
          name: `${credentials.firstName} ${credentials.lastName}`,
          email: credentials.email,
          role: credentials.role,
          specialty: credentials.specialty,
          phoneNumber: credentials.phoneNumber,
          bio: "",
          createdAt: new Date().toISOString(),
          address: "",
          firstName: credentials.firstName,
          lastName: credentials.lastName,
        }
        set({
          token: "fake-token",
          userData: newUser,
          isAuthenticated: true,
          loading: false,
        })
        return true
      },
      login: async (email, password) => {
        set({ loading: true, error: null })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        if (email === "wrong@example.com" || password !== "password123") {
          set({ loading: false, error: "Invalid credentials" })
          return false
        }
        const fakeUser: User = {
          id: Math.random().toString(),
          name: "Test User",
          email: email,
          role: "patient",
          specialty: "",
          phoneNumber: "",
          address: "",
          createdAt: new Date().toISOString(),
          bio: "",
          firstName: "Test",
          lastName: "User",
        }
        set({
          token: "fake-token",
          userData: fakeUser,
          isAuthenticated: true,
          loading: false,
        })
        return true
      },
      logout: () => set({ token: null, userData: null, isAuthenticated: false }),
      updateUserData: async (data) => {
        set({ loading: true, error: null })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        set((state) => ({
          userData: state.userData ? { ...state.userData, ...data } : null,
          loading: false,
        }))
        return true
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

export type { UserRole }
export default useAuthStore
