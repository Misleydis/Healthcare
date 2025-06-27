import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDataStore } from "./data-store"

interface User {
  id: string
  name: string
  email: string
  role: "patient" | "doctor" | "nurse" | "admin"
  specialty?: string
  phoneNumber?: string
  address?: string
  createdAt?: string
  bio?: string
  firstName: string
  lastName: string
  professionalId?: string
}

type UserRole = "patient" | "doctor" | "nurse" | "admin"

interface AuthState {
  token: string | null
  userData: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  register: (
    credentials: Omit<User, "id" | "name"> & { password: string; firstName: string; lastName: string; professionalId?: string },
  ) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUserData: (data: Partial<User>) => Promise<boolean>
  clearError: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userData: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      clearError: () => set({ error: null }),

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
            professionalId: credentials.professionalId,
          }

          // If the user is a doctor, add them to the data store
          if (data.role === "doctor") {
            const doctorData = {
              id: data.userId,
              name: `${credentials.firstName} ${credentials.lastName}`,
              email: credentials.email,
              specialization: credentials.specialty || "General Practitioner",
              department: "General Medicine",
              phone: credentials.phoneNumber || "",
              avatar: "",
              availability: ["Monday", "Wednesday", "Friday"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            useDataStore.getState().addDoctor(doctorData)
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
        try {
          console.log("Attempting login for email:", email)
          
          // Check for default admin credentials
          if (email === "Admin@123" && password === "Admin123") {
            const adminUser: User = {
              id: "admin-1",
              email: "Admin@123",
              firstName: "Admin",
              lastName: "User",
              name: "Admin User",
              role: "admin",
              specialty: "Administration",
              phoneNumber: "",
              address: "",
              bio: "System Administrator",
              createdAt: new Date().toISOString(),
              professionalId: "",
            }
            set({
              userData: adminUser,
              isAuthenticated: true,
              loading: false,
              error: null,
            })
            return true
          }

          // Local dev fallback for demo doctor
          if (
            process.env.NODE_ENV === 'development' &&
            email === 'kuda@gmail.com' &&
            password === 'Kuda123'
          ) {
            const demoDoctor: User = {
              id: 'doctor-kuda',
              email: 'kuda@gmail.com',
              firstName: 'Kudakwashe',
              lastName: 'Moyo',
              name: 'Dr. Kudakwashe Moyo',
              role: 'doctor',
              specialty: 'Cardiology',
              phoneNumber: '+263771234567',
              address: '',
              bio: 'Demo doctor for presentation',
              createdAt: new Date().toISOString(),
              professionalId: 'MDZ001',
            }
            set({
              userData: demoDoctor,
              isAuthenticated: true,
              loading: false,
              error: null,
            })
            return true
          }

          const response = await fetch("https://auth-backend-qyna.onrender.com/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error("Login failed")
          }

          const data = await response.json()
          set({
            userData: data,
            isAuthenticated: true,
            loading: false,
            error: null,
          })
          return true
        } catch (error) {
          console.error("Login error:", error)
          // Fallback to local authentication for development/testing
          if (email === "test@example.com" && password === "password") {
            const mockUserData: User = {
              id: "1",
              email: "test@example.com",
              firstName: "Test",
              lastName: "User",
              name: "Test User",
              role: "patient" as const,
              professionalId: "",
            }
            set({
              userData: mockUserData,
              isAuthenticated: true,
              loading: false,
              error: null,
            })
            return true
          }
          set({
            userData: null,
            isAuthenticated: false,
            loading: false,
            error: error instanceof Error ? error.message : "Login failed",
          })
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

export type { UserRole };
export default useAuthStore
