import { create } from "zustand"
import api from "./api"

interface VitalSigns {
  temperature?: number
  bloodPressure?: string
  heartRate?: number
  respiratoryRate?: number
  oxygenSaturation?: number
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
}

interface LabResult {
  testName: string
  result: string
  normalRange: string
  interpretation: string
}

interface HealthRecord {
  _id: string
  patientId: string
  recordType: string
  recordDate: string
  doctorId: string
  vitalSigns?: VitalSigns
  diagnosis?: string
  treatment?: string
  medications?: Medication[]
  labResults?: LabResult[]
  notes?: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

interface HealthRecordState {
  records: HealthRecord[]
  currentRecord: HealthRecord | null
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  fetchRecords: (patientId?: string, recordType?: string, page?: number, limit?: number) => Promise<void>
  fetchRecordById: (id: string) => Promise<HealthRecord | null>
  createRecord: (recordData: Omit<HealthRecord, "_id" | "createdAt" | "updatedAt">) => Promise<HealthRecord | null>
  updateRecord: (id: string, recordData: Partial<HealthRecord>) => Promise<HealthRecord | null>
  deleteRecord: (id: string) => Promise<boolean>
}

const useHealthRecordStore = create<HealthRecordState>((set, get) => ({
  records: [],
  currentRecord: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,

  fetchRecords: async (patientId = "", recordType = "", page = 1, limit = 10) => {
    set({ loading: true, error: null })
    try {
      let queryParams = `?page=${page}&limit=${limit}`
      if (patientId) queryParams += `&patientId=${encodeURIComponent(patientId)}`
      if (recordType) queryParams += `&recordType=${encodeURIComponent(recordType)}`

      const response = await api.get(`/health-records${queryParams}`)

      set({
        records: response.data.healthRecords || [],
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        loading: false,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch health records",
      })
    }
  },

  fetchRecordById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/health-records/${id}`)
      set({ currentRecord: response.data, loading: false })
      return response.data
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch health record",
      })
      return null
    }
  },

  createRecord: async (recordData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/health-records", recordData)
      const newRecord = response.data

      // Update the records list with the new record
      const { records } = get()
      set({
        records: [newRecord, ...records],
        loading: false,
      })

      return newRecord
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to create health record",
      })
      return null
    }
  },

  updateRecord: async (id: string, recordData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/health-records/${id}`, recordData)
      const updatedRecord = response.data

      // Update the records list with the updated record
      const { records } = get()
      set({
        records: records.map((r) => (r._id === id ? updatedRecord : r)),
        currentRecord: get().currentRecord?._id === id ? updatedRecord : get().currentRecord,
        loading: false,
      })

      return updatedRecord
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update health record",
      })
      return null
    }
  },

  deleteRecord: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/health-records/${id}`)

      // Remove the deleted record from the list
      const { records } = get()
      set({
        records: records.filter((r) => r._id !== id),
        currentRecord: get().currentRecord?._id === id ? null : get().currentRecord,
        loading: false,
      })

      return true
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete health record",
      })
      return false
    }
  },
}))

export default useHealthRecordStore
