import fs from "fs"
import path from "path"
import type { User } from "./auth"

// Path to data directory
const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const HEALTH_DATA_FILE = path.join(DATA_DIR, "health-data.json")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]))
}

// Ensure health data file exists
if (!fs.existsSync(HEALTH_DATA_FILE)) {
  fs.writeFileSync(HEALTH_DATA_FILE, JSON.stringify({}))
}

// Database operations
export const db = {
  // User operations
  async getUsers(): Promise<User[]> {
    try {
      const data = fs.readFileSync(USERS_FILE, "utf8")
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  },

  async getUser(id: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find((user) => user.id === id) || null
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find((user) => user.email === email) || null
  },

  async createUser(user: User): Promise<User> {
    const users = await this.getUsers()
    users.push(user)
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
    return user
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const index = users.findIndex((user) => user.id === id)

    if (index === -1) {
      return null
    }

    users[index] = { ...users[index], ...userData }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
    return users[index]
  },

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers()
    const filteredUsers = users.filter((user) => user.id !== id)

    if (filteredUsers.length === users.length) {
      return false
    }

    fs.writeFileSync(USERS_FILE, JSON.stringify(filteredUsers, null, 2))
    return true
  },

  // Health data operations
  async getHealthData(userId: string): Promise<any> {
    try {
      const data = fs.readFileSync(HEALTH_DATA_FILE, "utf8")
      const healthData = JSON.parse(data)
      return healthData[userId] || null
    } catch (error) {
      return null
    }
  },

  async saveHealthData(userId: string, data: any): Promise<boolean> {
    try {
      const healthData = fs.existsSync(HEALTH_DATA_FILE) ? JSON.parse(fs.readFileSync(HEALTH_DATA_FILE, "utf8")) : {}

      healthData[userId] = {
        ...(healthData[userId] || {}),
        ...data,
      }

      fs.writeFileSync(HEALTH_DATA_FILE, JSON.stringify(healthData, null, 2))
      return true
    } catch (error) {
      return false
    }
  },
}

// Seed initial data if needed
export async function seedInitialData() {
  const users = await db.getUsers()

  if (users.length === 0) {
    // Create admin user
    await db.createUser({
      id: crypto.randomUUID(),
      email: "admin@example.com",
      name: "Admin User",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    })

    // Create doctor user
    await db.createUser({
      id: crypto.randomUUID(),
      email: "doctor@example.com",
      name: "Dr. Sarah Moyo",
      password: "doctor123",
      role: "doctor",
      createdAt: new Date().toISOString(),
    })

    // Create patient user
    const patientId = crypto.randomUUID()
    await db.createUser({
      id: patientId,
      email: "patient@example.com",
      name: "John Doe",
      password: "patient123",
      role: "patient",
      createdAt: new Date().toISOString(),
    })

    // Add sample health data for patient
    await db.saveHealthData(patientId, {
      bloodPressure: [
        { date: "2025-03-24", time: "08:30", systolic: 130, diastolic: 85, pulse: 74 },
        { date: "2025-03-23", time: "08:45", systolic: 128, diastolic: 83, pulse: 72 },
        { date: "2025-03-22", time: "09:00", systolic: 125, diastolic: 82, pulse: 70 },
        { date: "2025-03-21", time: "08:15", systolic: 132, diastolic: 87, pulse: 75 },
        { date: "2025-03-20", time: "08:30", systolic: 127, diastolic: 84, pulse: 73 },
      ],
      bloodGlucose: [
        { date: "2025-03-24", time: "07:15", level: 110, timing: "Fasting" },
        { date: "2025-03-23", time: "07:00", level: 115, timing: "Fasting" },
        { date: "2025-03-22", time: "07:30", level: 108, timing: "Fasting" },
        { date: "2025-03-21", time: "07:15", level: 112, timing: "Fasting" },
        { date: "2025-03-20", time: "07:00", level: 118, timing: "Fasting" },
      ],
      weight: [
        { date: "2025-03-23", time: "19:00", weight: 78 },
        { date: "2025-03-22", time: "19:15", weight: 78.5 },
        { date: "2025-03-21", time: "19:00", weight: 78.8 },
        { date: "2025-03-20", time: "19:30", weight: 78.6 },
        { date: "2025-03-19", time: "19:00", weight: 79 },
      ],
      appointments: [
        {
          id: crypto.randomUUID(),
          doctorId: "doctor-1",
          doctorName: "Dr. Sarah Moyo",
          date: "2025-03-25",
          time: "10:00",
          type: "General Checkup",
          status: "scheduled",
        },
        {
          id: crypto.randomUUID(),
          doctorId: "doctor-2",
          doctorName: "Dr. James Ndlovu",
          date: "2025-03-28",
          time: "14:30",
          type: "Follow-up Consultation",
          status: "scheduled",
        },
      ],
      medications: [
        {
          id: crypto.randomUUID(),
          name: "Metformin",
          dosage: "500mg",
          frequency: "twice daily",
          startDate: "2025-01-10",
          endDate: null,
        },
        {
          id: crypto.randomUUID(),
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "once daily",
          startDate: "2025-03-15",
          endDate: null,
        },
      ],
    })
  }
}

// Call seed function
seedInitialData().catch(console.error)

