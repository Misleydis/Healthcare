import { create } from "zustand"
import api from "./api"

interface Patient {
  _id: string
  fullName: string
  dateOfBirth: string
  gender: string
  contactNumber: string
  email?: string
  address?: string
  emergencyContact?: string
  bloodType?: string
  allergies?: string[]
  medicalHistory?: string
  insuranceInfo?: string
  status: "active" | "inactive" | "pending"
  createdAt: string
  updatedAt: string
}

interface PatientState {
  patients: Patient[]
  currentPatient: Patient | null
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  fetchPatients: (page?: number, limit?: number, search?: string, status?: string) => Promise<void>
  fetchPatientById: (id: string) => Promise<Patient | null>
  createPatient: (patientData: Omit<Patient, "_id" | "createdAt" | "updatedAt">) => Promise<Patient | null>
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<Patient | null>
  deletePatient: (id: string) => Promise<boolean>
}

const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  currentPatient: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,

  fetchPatients: async (page = 1, limit = 10, search = "", status = "") => {
    set({ loading: true, error: null })
    try {
      let queryParams = `?page=${page}&limit=${limit}`
      if (search) queryParams += `&search=${encodeURIComponent(search)}`
      if (status) queryParams += `&status=${encodeURIComponent(status)}`

      const response = await api.get(`/patients${queryParams}`)

      set({
        patients: response.data.patients,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        loading: false,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch patients",
      })
    }
  },

  fetchPatientById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/patients/${id}`)
      set({ currentPatient: response.data, loading: false })
      return response.data
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch patient",
      })
      return null
    }
  },

  createPatient: async (patientData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/patients", patientData)
      const newPatient = response.data

      // Update the patients list with the new patient
      const { patients } = get()
      set({
        patients: [newPatient, ...patients],
        loading: false,
      })

      return newPatient
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to create patient",
      })
      return null
    }
  },

  updatePatient: async (id: string, patientData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/patients/${id}`, patientData)
      const updatedPatient = response.data

      // Update the patients list with the updated patient
      const { patients } = get()
      set({
        patients: patients.map((p) => (p._id === id ? updatedPatient : p)),
        currentPatient: get().currentPatient?._id === id ? updatedPatient : get().currentPatient,
        loading: false,
      })

      return updatedPatient
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update patient",
      })
      return null
    }
  },

  deletePatient: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/patients/${id}`)

      // Remove the deleted patient from the list
      const { patients } = get()
      set({
        patients: patients.filter((p) => p._id !== id),
        currentPatient: get().currentPatient?._id === id ? null : get().currentPatient,
        loading: false,
      })

      return true
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete patient",
      })
      return false
    }
  },
}))

export default usePatientStore
