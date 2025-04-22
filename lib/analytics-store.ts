import { create } from "zustand"
import { apiRequest } from "./api"

interface PatientAnalytics {
  totalPatients: number
  activePatients: number
  inactivePatients: number
  pendingPatients: number
  patientsByGender: Array<{ _id: string; count: number }>
  newPatients: number
}

interface AppointmentAnalytics {
  totalAppointments: number
  scheduledAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowAppointments: number
  appointmentsByType: Array<{ _id: string; count: number }>
  upcomingAppointments: number
}

interface HealthRecordAnalytics {
  totalRecords: number
  recordsByType: Array<{ _id: string; count: number }>
  recentRecords: number
}

interface AnalyticsState {
  patientAnalytics: PatientAnalytics | null
  appointmentAnalytics: AppointmentAnalytics | null
  healthRecordAnalytics: HealthRecordAnalytics | null
  loading: boolean
  error: string | null
  fetchPatientAnalytics: () => Promise<void>
  fetchAppointmentAnalytics: () => Promise<void>
  fetchHealthRecordAnalytics: () => Promise<void>
  fetchAllAnalytics: () => Promise<void>
}

const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  patientAnalytics: null,
  appointmentAnalytics: null,
  healthRecordAnalytics: null,
  loading: false,
  error: null,

  fetchPatientAnalytics: async () => {
    set({ loading: true, error: null })
    try {
      const analytics = await apiRequest<PatientAnalytics>("/analytics/patients")
      set({ patientAnalytics: analytics, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch patient analytics",
      })
    }
  },

  fetchAppointmentAnalytics: async () => {
    set({ loading: true, error: null })
    try {
      const analytics = await apiRequest<AppointmentAnalytics>("/analytics/appointments")
      set({ appointmentAnalytics: analytics, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch appointment analytics",
      })
    }
  },

  fetchHealthRecordAnalytics: async () => {
    set({ loading: true, error: null })
    try {
      const analytics = await apiRequest<HealthRecordAnalytics>("/analytics/health-records")
      set({ healthRecordAnalytics: analytics, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch health record analytics",
      })
    }
  },

  fetchAllAnalytics: async () => {
    set({ loading: true, error: null })
    try {
      const [patientAnalytics, appointmentAnalytics, healthRecordAnalytics] = await Promise.all([
        apiRequest<PatientAnalytics>("/analytics/patients"),
        apiRequest<AppointmentAnalytics>("/analytics/appointments"),
        apiRequest<HealthRecordAnalytics>("/analytics/health-records"),
      ])

      set({
        patientAnalytics,
        appointmentAnalytics,
        healthRecordAnalytics,
        loading: false,
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch analytics",
      })
    }
  },
}))

export default useAnalyticsStore
