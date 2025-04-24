"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Generate random appointment data
const generateAppointments = () => {
  const firstNames = ["Tendai", "Chipo", "Tatenda", "Farai", "Nyasha", "Kudzai", "Tafadzwa", "Rumbidzai"]
  const lastNames = ["Moyo", "Ncube", "Dube", "Sibanda", "Mpofu", "Ndlovu", "Mutasa", "Chigumba"]
  const doctorFirstNames = ["Sarah", "John", "Michael", "Elizabeth", "Robert", "Patricia"]
  const doctorLastNames = ["Johnson", "Smith", "Williams", "Brown", "Jones", "Miller"]
  const appointmentTypes = ["Checkup", "Follow-up", "Consultation", "Vaccination", "Screening"]
  const statuses = ["Confirmed", "Pending", "Rescheduled"]

  // Get current date
  const today = new Date()

  return Array.from({ length: 3 }, (_, i) => {
    // Generate a date within the next 7 days
    const appointmentDate = new Date(today)
    appointmentDate.setDate(today.getDate() + Math.floor(Math.random() * 7) + 1)

    // Generate a random time between 8 AM and 5 PM
    const hour = 8 + Math.floor(Math.random() * 10)
    const minute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, or 45
    appointmentDate.setHours(hour, minute)

    const patientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const patientLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const doctorFirstName = doctorFirstNames[Math.floor(Math.random() * doctorFirstNames.length)]
    const doctorLastName = doctorLastNames[Math.floor(Math.random() * doctorLastNames.length)]

    return {
      id: i + 1,
      patientName: `${patientFirstName} ${patientLastName}`,
      doctorName: `Dr. ${doctorFirstName} ${doctorLastName}`,
      type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: appointmentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: appointmentDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      patientInitials: `${patientFirstName[0]}${patientLastName[0]}`,
      doctorInitials: `${doctorFirstName[0]}${doctorLastName[0]}`,
    }
  })
}

export function UpcomingAppointments({ isPatientView = false }) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAppointments(generateAppointments())
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-[200px] animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-[150px] animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={`/placeholder.svg?height=40&width=40&text=${
                  isPatientView ? appointment.doctorInitials : appointment.patientInitials
                }`}
              />
              <AvatarFallback>
                {isPatientView ? appointment.doctorInitials : appointment.patientInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{isPatientView ? appointment.doctorName : appointment.patientName}</p>
              <p className="text-xs text-muted-foreground">
                {appointment.date} at {appointment.time}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                appointment.status === "Confirmed"
                  ? "default"
                  : appointment.status === "Pending"
                    ? "outline"
                    : "secondary"
              }
            >
              {appointment.type}
            </Badge>
            <Button variant="outline" size="sm">
              {isPatientView ? "Join" : "View"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
