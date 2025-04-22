"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video } from "lucide-react"

// Generate random appointment data
const generateAppointments = () => {
  const patientNames = ["Tendai Moyo", "Chipo Ncube", "Tatenda Dube", "Farai Sibanda", "Nyasha Mpofu"]
  const doctorNames = ["Dr. Mutasa", "Dr. Chigumba", "Dr. Ndlovu", "Dr. Makoni", "Dr. Zimuto"]
  const appointmentTypes = ["Initial Consultation", "Follow-up", "Urgent Care", "Prescription Renewal"]

  // Get current date and time
  const now = new Date()

  return Array.from({ length: 5 }, (_, i) => {
    // Generate a date within the next 7 days
    const appointmentDate = new Date(now)
    appointmentDate.setDate(now.getDate() + Math.floor(Math.random() * 7))

    // Generate a random time between 8 AM and 5 PM
    const hour = 8 + Math.floor(Math.random() * 10)
    const minute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, or 45
    appointmentDate.setHours(hour, minute)

    return {
      id: i + 1,
      patient: patientNames[Math.floor(Math.random() * patientNames.length)],
      doctor: doctorNames[Math.floor(Math.random() * doctorNames.length)],
      type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      date: appointmentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isToday: appointmentDate.toDateString() === now.toDateString(),
    }
  }).sort((a, b) => {
    // Sort by date (today first, then by time)
    if (a.isToday && !b.isToday) return -1
    if (!a.isToday && b.isToday) return 1
    return 0
  })
}

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAppointments(generateAppointments())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-4 w-[200px] animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{appointment.patient}</p>
              {appointment.isToday && <Badge className="bg-green-500 hover:bg-green-600">Today</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              {appointment.doctor} • {appointment.type}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm">{appointment.date}</p>
              <p className="text-xs text-muted-foreground">{appointment.time}</p>
            </div>
            <Button size="icon" variant="outline">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
