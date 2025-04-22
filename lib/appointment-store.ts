import { create } from "zustand"
import api from "./api"

interface Appointment {
  _id: string
  patientId: string
  doctorId: string
  appointmentDate: string
  endTime?: string
  appointmentType: "consultation" | "follow-up" | "emergency" | "telehealth"
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  reason?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface AppointmentState {
  appointments: Appointment[]
  currentAppointment: Appointment | null
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  fetchAppointments: (
    patientId?: string,
    doctorId?: string,
    status?: string,
    startDate?: string,
    endDate?: string,
    page?: number,
    limit?: number,
  ) => Promise<void>
  fetchAppointmentById: (id: string) => Promise<Appointment | null>
  createAppointment: (
    appointmentData: Omit<Appointment, "_id" | "createdAt" | "updatedAt">,
  ) => Promise<Appointment | null>
  updateAppointment: (id: string, appointmentData: Partial<Appointment>) => Promise<Appointment | null>
  cancelAppointment: (id: string) => Promise<boolean>
  deleteAppointment: (id: string) => Promise<boolean>
}

const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,

  fetchAppointments: async (
    patientId = "",
    doctorId = "",
    status = "",
    startDate = "",
    endDate = "",
    page = 1,
    limit = 10,
  ) => {
    set({ loading: true, error: null })
    try {
      let queryParams = `?page=${page}&limit=${limit}`
      if (patientId) queryParams += `&patientId=${encodeURIComponent(patientId)}`
      if (doctorId) queryParams += `&doctorId=${encodeURIComponent(doctorId)}`
      if (status) queryParams += `&status=${encodeURIComponent(status)}`
      if (startDate) queryParams += `&startDate=${encodeURIComponent(startDate)}`
      if (endDate) queryParams += `&endDate=${encodeURIComponent(endDate)}`

      const response = await api.get(`/appointments${queryParams}`)

      set({
        appointments: response.data.appointments || [],
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        loading: false,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch appointments",
      })
    }
  },

  fetchAppointmentById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/appointments/${id}`)
      set({ currentAppointment: response.data, loading: false })
      return response.data
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch appointment",
      })
      return null
    }
  },

  createAppointment: async (appointmentData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/appointments", appointmentData)
      const newAppointment = response.data

      // Update the appointments list with the new appointment
      const { appointments } = get()
      set({
        appointments: [newAppointment, ...appointments],
        loading: false,
      })

      return newAppointment
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to create appointment",
      })
      return null
    }
  },

  updateAppointment: async (id: string, appointmentData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData)
      const updatedAppointment = response.data

      // Update the appointments list with the updated appointment
      const { appointments } = get()
      set({
        appointments: appointments.map((a) => (a._id === id ? updatedAppointment : a)),
        currentAppointment: get().currentAppointment?._id === id ? updatedAppointment : get().currentAppointment,
        loading: false,
      })

      return updatedAppointment
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update appointment",
      })
      return null
    }
  },

  cancelAppointment: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/appointments/${id}`, { status: "cancelled" })
      const updatedAppointment = response.data

      // Update the appointments list with the cancelled appointment
      const { appointments } = get()
      set({
        appointments: appointments.map((a) => (a._id === id ? updatedAppointment : a)),
        currentAppointment: get().currentAppointment?._id === id ? updatedAppointment : get().currentAppointment,
        loading: false,
      })

      return true
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to cancel appointment",
      })
      return false
    }
  },

  deleteAppointment: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/appointments/${id}`)

      // Remove the deleted appointment from the list
      const { appointments } = get()
      set({
        appointments: appointments.filter((a) => a._id !== id),
        currentAppointment: get().currentAppointment?._id === id ? null : get().currentAppointment,
        loading: false,
      })

      return true
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete appointment",
      })
      return false
    }
  },
}))

export default useAppointmentStore
