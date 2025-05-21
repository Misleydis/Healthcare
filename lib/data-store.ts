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
}

// Sample data
const samplePatients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    email: "john.doe@example.com",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    bloodType: "O+",
    address: "123 Main St, Anytown, USA",
    phone: "555-123-4567",
    emergencyContact: "Jane Doe, 555-987-6543",
    insuranceProvider: "Health Plus",
    insuranceNumber: "HP12345678",
    assignedDoctorId: "d1",
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "p2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    dateOfBirth: "1990-08-22",
    gender: "Female",
    bloodType: "A-",
    address: "456 Oak Ave, Somewhere, USA",
    phone: "555-234-5678",
    emergencyContact: "John Smith, 555-876-5432",
    insuranceProvider: "MediCare Plus",
    insuranceNumber: "MC87654321",
    assignedDoctorId: "d2",
    createdAt: "2023-02-10T10:15:00Z",
    updatedAt: "2023-02-10T10:15:00Z",
  },
]

const sampleDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    specialization: "Cardiology",
    department: "Cardiology",
    phone: "555-111-2222",
    avatar: "/placeholder.svg?height=100&width=100",
    availability: ["Monday", "Wednesday", "Friday"],
    createdAt: "2022-12-01T09:00:00Z",
    updatedAt: "2022-12-01T09:00:00Z",
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    email: "michael.chen@hospital.com",
    specialization: "Neurology",
    department: "Neurology",
    phone: "555-333-4444",
    avatar: "/placeholder.svg?height=100&width=100",
    availability: ["Tuesday", "Thursday", "Saturday"],
    createdAt: "2022-12-05T11:30:00Z",
    updatedAt: "2022-12-05T11:30:00Z",
  },
]

const sampleAppointments: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    doctorId: "d1",
    date: "2023-06-15",
    time: "10:00",
    duration: 30,
    status: "scheduled",
    type: "in-person",
    reason: "Annual checkup",
    notes: "Patient has reported occasional chest pain",
    followUp: false,
    createdAt: "2023-05-20T14:30:00Z",
    updatedAt: "2023-05-20T14:30:00Z",
  },
  {
    id: "a2",
    patientId: "p2",
    doctorId: "d2",
    date: "2023-06-18",
    time: "14:30",
    duration: 45,
    status: "scheduled",
    type: "telehealth",
    reason: "Follow-up on medication",
    notes: "Discuss side effects of new prescription",
    followUp: true,
    createdAt: "2023-05-25T09:45:00Z",
    updatedAt: "2023-05-25T09:45:00Z",
  },
]

const sampleHealthRecords: HealthRecord[] = [
  {
    id: "hr1",
    patientId: "p1",
    doctorId: "d1",
    date: "2023-04-10",
    type: "visit",
    title: "Annual Physical Examination",
    description: "Routine physical examination with blood work",
    diagnosis: "Patient is in good health. Slightly elevated cholesterol.",
    treatment: "Dietary recommendations provided",
    medications: ["Lipitor 10mg"],
    createdAt: "2023-04-10T11:00:00Z",
    updatedAt: "2023-04-10T11:00:00Z",
  },
  {
    id: "hr2",
    patientId: "p2",
    doctorId: "d2",
    date: "2023-05-05",
    type: "lab",
    title: "Blood Test Results",
    description: "Complete blood count and metabolic panel",
    diagnosis: "Iron deficiency anemia detected",
    treatment: "Iron supplements prescribed",
    medications: ["Ferrous Sulfate 325mg"],
    createdAt: "2023-05-05T15:30:00Z",
    updatedAt: "2023-05-05T15:30:00Z",
  },
]

const sampleMedications: Medication[] = [
  {
    id: "m1",
    patientId: "p1",
    name: "Lipitor",
    dosage: "10mg",
    frequency: "daily",
    time: "20:00",
    instructions: "Take with evening meal",
    startDate: "2023-04-15",
    refillDate: "2023-07-15",
    refillReminder: true,
    status: "active",
    createdAt: "2023-04-10T11:30:00Z",
    updatedAt: "2023-04-10T11:30:00Z",
  },
  {
    id: "m2",
    patientId: "p2",
    name: "Ferrous Sulfate",
    dosage: "325mg",
    frequency: "twice-daily",
    time: "08:00",
    instructions: "Take on empty stomach with water",
    startDate: "2023-05-06",
    endDate: "2023-08-06",
    refillDate: "2023-06-06",
    refillReminder: true,
    status: "active",
    createdAt: "2023-05-05T16:00:00Z",
    updatedAt: "2023-05-05T16:00:00Z",
  },
]

const sampleNotifications: Notification[] = [
  {
    id: "n1",
    userId: "p1",
    title: "Appointment Reminder",
    message: "You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM",
    type: "appointment",
    read: false,
    createdAt: "2023-06-14T09:00:00Z",
  },
  {
    id: "n2",
    userId: "p2",
    title: "Medication Refill",
    message: "Your Ferrous Sulfate prescription is due for refill in 3 days",
    type: "medication",
    read: false,
    createdAt: "2023-06-03T14:00:00Z",
  },
]

// Create the store
export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
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
      updatePatient: (id, updatedPatient) =>
        set((state) => ({
          patients: state.patients.map((patient) =>
            patient.id === id ? { ...patient, ...updatedPatient, updatedAt: new Date().toISOString() } : patient,
          ),
        })),
      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((patient) => patient.id !== id),
        })),

      // Doctor actions
      addDoctor: (doctor) =>
        set((state) => ({
          doctors: [...state.doctors, doctor],
        })),
      updateDoctor: (id, updatedDoctor) =>
        set((state) => ({
          doctors: state.doctors.map((doctor) =>
            doctor.id === id ? { ...doctor, ...updatedDoctor, updatedAt: new Date().toISOString() } : doctor,
          ),
        })),
      deleteDoctor: (id) =>
        set((state) => ({
          doctors: state.doctors.filter((doctor) => doctor.id !== id),
        })),

      // Appointment actions
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, appointment],
        })),
      updateAppointment: (id, updatedAppointment) =>
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id
              ? { ...appointment, ...updatedAppointment, updatedAt: new Date().toISOString() }
              : appointment,
          ),
        })),
      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((appointment) => appointment.id !== id),
        })),

      // Health record actions
      addHealthRecord: (record) =>
        set((state) => ({
          healthRecords: [...state.healthRecords, record],
        })),
      updateHealthRecord: (id, updatedRecord) =>
        set((state) => ({
          healthRecords: state.healthRecords.map((record) =>
            record.id === id ? { ...record, ...updatedRecord, updatedAt: new Date().toISOString() } : record,
          ),
        })),
      deleteHealthRecord: (id) =>
        set((state) => ({
          healthRecords: state.healthRecords.filter((record) => record.id !== id),
        })),

      // Medication actions
      addMedication: (medication) =>
        set((state) => ({
          medications: [...state.medications, medication],
        })),
      updateMedication: (id, updatedMedication) =>
        set((state) => ({
          medications: state.medications.map((medication) =>
            medication.id === id
              ? { ...medication, ...updatedMedication, updatedAt: new Date().toISOString() }
              : medication,
          ),
        })),
      deleteMedication: (id) =>
        set((state) => ({
          medications: state.medications.filter((medication) => medication.id !== id),
        })),

      // Notification actions
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
        })),
      clearAllNotifications: () =>
        set((state) => ({
          notifications: [],
        })),
    }),
    {
      name: "health-app-data",
    },
  ),
)
