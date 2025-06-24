import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export type User = {
  id: string
  name: string
  email: string
  role: "patient" | "doctor" | "nurse" | "admin"
  avatar?: string
  specialization?: string
  department?: string
}

export type Patient = {
  id: string
  name: string
  email: string
  dateOfBirth: string
  gender: string
  bloodType?: string
  address?: string
  phone?: string
  emergencyContact?: string
  insuranceProvider?: string
  insuranceNumber?: string
  assignedDoctorId?: string
  createdAt: string
  updatedAt: string
}

export type Doctor = {
  id: string
  name: string
  email: string
  specialization: string
  department: string
  phone?: string
  avatar?: string
  availability?: string[]
  createdAt: string
  updatedAt: string
  patients?: string[] // Array of patient IDs
}

export type Appointment = {
  id: string
  patientId: string
  doctorId: string
  date: string
  time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  type: "in-person" | "telehealth"
  reason: string
  notes?: string
  followUp?: boolean
  createdAt: string
  updatedAt: string
}

export type HealthRecord = {
  id: string
  patientId: string
  doctorId: string
  date: string
  type: "visit" | "lab" | "imaging" | "procedure" | "vaccination" | "other"
  title: string
  description: string
  diagnosis?: string
  treatment?: string
  medications?: string[]
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

export type Medication = {
  id: string
  patientId: string
  name: string
  dosage: string
  frequency: string
  time?: string
  instructions?: string
  startDate: string
  endDate?: string
  refillDate?: string
  refillReminder?: boolean
  notes?: string
  status: "active" | "inactive" | "completed"
  lastTaken?: string
  createdAt: string
  updatedAt: string
}

export type Notification = {
  id: string
  userId: string
  title: string
  message: string
  type: "appointment" | "medication" | "result" | "system" | "other"
  read: boolean
  createdAt: string
}

export type DataStore = {
  patients: Patient[]
  doctors: Doctor[]
  appointments: Appointment[]
  healthRecords: HealthRecord[]
  medications: Medication[]
  notifications: Notification[]

  // Patient actions
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void

  // Doctor actions
  addDoctor: (doctor: Doctor) => void
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void
  deleteDoctor: (id: string) => void
  addPatientToDoctor: (doctorId: string, patientId: string) => void

  // Appointment actions
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void

  // Health record actions
  addHealthRecord: (record: HealthRecord) => void
  updateHealthRecord: (id: string, record: Partial<HealthRecord>) => void
  deleteHealthRecord: (id: string) => void

  // Medication actions
  addMedication: (medication: Medication) => void
  updateMedication: (id: string, medication: Partial<Medication>) => void
  deleteMedication: (id: string) => void

  // Notification actions
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  deleteNotification: (id: string) => void
  clearAllNotifications: () => void

  // Store management
  clearStore: () => void
}

// Sample data
const samplePatients: Patient[] = [
  {
    id: "patient-1",
    name: "John Doe",
    email: "john@example.com",
    dateOfBirth: "1990-01-01",
    gender: "male",
    phone: "+1234567890",
    address: "123 Main St",
    emergencyContact: "Jane Doe",
    insuranceProvider: "HealthCare Plus",
    insuranceNumber: "INS123456",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

const sampleDoctors: Doctor[] = [
  {
    id: "doctor-1",
    name: "Dr. Smith",
    email: "smith@example.com",
    specialization: "General Medicine",
    department: "Primary Care",
    phone: "+1234567891",
    availability: ["Monday", "Wednesday", "Friday"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    patients: ["patient-1"]
  }
]

const sampleAppointments: Appointment[] = [
  {
    id: "appointment-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    date: new Date().toISOString(),
    time: "09:00",
    duration: 30,
    status: "scheduled",
    type: "in-person",
    reason: "Regular checkup",
    notes: "Annual physical examination",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

const sampleHealthRecords: HealthRecord[] = []
const sampleMedications: Medication[] = []
const sampleNotifications: Notification[] = []

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initialize with sample data
      patients: samplePatients,
      doctors: sampleDoctors,
      appointments: sampleAppointments,
      healthRecords: sampleHealthRecords,
      medications: sampleMedications,
      notifications: sampleNotifications,

      // Patient actions
      addPatient: (patient) =>
        set((state) => ({
          patients: [...state.patients, patient],
        })),

      updatePatient: (id, patient) =>
        set((state) => ({
          patients: state.patients.map((p) => (p.id === id ? { ...p, ...patient } : p)),
        })),

      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
        })),

      // Doctor actions
      addDoctor: (doctor) =>
        set((state) => ({
          doctors: [...state.doctors, { ...doctor, patients: [] }],
        })),

      updateDoctor: (id, doctor) =>
        set((state) => ({
          doctors: state.doctors.map((d) => (d.id === id ? { ...d, ...doctor } : d)),
        })),

      deleteDoctor: (id) =>
        set((state) => ({
          doctors: state.doctors.filter((d) => d.id !== id),
        })),

      addPatientToDoctor: (doctorId, patientId) =>
        set((state) => ({
          doctors: state.doctors.map((doctor) => {
            if (doctor.id === doctorId) {
              const patients = doctor.patients || []
              if (!patients.includes(patientId)) {
                return { ...doctor, patients: [...patients, patientId] }
              }
            }
            return doctor
          }),
        })),

      // Appointment actions
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, appointment],
        })),

      updateAppointment: (id, appointment) =>
        set((state) => ({
          appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...appointment } : a)),
        })),

      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),

      // Health record actions
      addHealthRecord: (record) =>
        set((state) => ({
          healthRecords: [...state.healthRecords, record],
        })),

      updateHealthRecord: (id, record) =>
        set((state) => ({
          healthRecords: state.healthRecords.map((r) => (r.id === id ? { ...r, ...record } : r)),
        })),

      deleteHealthRecord: (id) =>
        set((state) => ({
          healthRecords: state.healthRecords.filter((r) => r.id !== id),
        })),

      // Medication actions
      addMedication: (medication) =>
        set((state) => ({
          medications: [...state.medications, medication],
        })),

      updateMedication: (id, medication) =>
        set((state) => ({
          medications: state.medications.map((m) => (m.id === id ? { ...m, ...medication } : m)),
        })),

      deleteMedication: (id) =>
        set((state) => ({
          medications: state.medications.filter((m) => m.id !== id),
        })),

      // Notification actions
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAllNotifications: () =>
        set(() => ({
          notifications: [],
        })),

      // Store management
      clearStore: () =>
        set(() => ({
          patients: [],
          doctors: [],
          appointments: [],
          healthRecords: [],
          medications: [],
          notifications: [],
        })),
    }),
    {
      name: "healthcare-data",
      partialize: (state) => ({
        patients: state.patients,
        doctors: state.doctors,
        appointments: state.appointments,
        healthRecords: state.healthRecords,
        medications: state.medications,
        notifications: state.notifications,
      }),
    },
  ),
)
