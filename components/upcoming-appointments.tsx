"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDataStore } from "@/lib/data-store"
import useAuthStore from "@/lib/auth-store"
import Link from "next/link"

export function UpcomingAppointments({ isPatientView = false }) {
  const { userData } = useAuthStore()
  const userId = userData?.id || ""
  const isPatient = userData?.role === "patient"
  const isDoctor = userData?.role === "doctor"

  const { appointments } = useDataStore()

  // Filter appointments based on user role
  const userAppointments = appointments
    .filter((appointment) => {
      if (isPatient) {
        return appointment.patientId === userId
      } else if (isDoctor) {
        return appointment.doctorId === userId
      }
      return true // Admin and nurse can see all
    })
    .filter((appointment) => appointment.status === "Scheduled")

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
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

  if (userAppointments.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center space-y-3">
        <p className="text-center text-muted-foreground">No upcoming appointments scheduled.</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/appointments">Book an Appointment</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {userAppointments.slice(0, 3).map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={`/placeholder.svg?height=40&width=40&text=${
                  isPatientView ? appointment.doctorName.substring(0, 2) : appointment.patientName.substring(0, 2)
                }`}
              />
              <AvatarFallback>
                {isPatientView ? appointment.doctorName.substring(0, 2) : appointment.patientName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{isPatientView ? appointment.doctorName : appointment.patientName}</p>
              <p className="text-xs text-muted-foreground">
                {appointment.formattedDate} at {appointment.formattedTime}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{appointment.type}</Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/appointments`}>{appointment.location === "Telehealth" ? "Join" : "View"}</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
