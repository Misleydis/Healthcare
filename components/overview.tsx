"use client"

import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useAuthStore from "@/lib/auth-store"
import { useDataStore } from "@/lib/data-store"

export function Overview() {
  const { userData: user } = useAuthStore()
  const isDoctor = user?.role === "doctor"
  const isAdmin = user?.role === "admin"
  const isNurse = user?.role === "nurse"
  const isPatient = user?.role === "patient"
  const userId = user?.id || ""

  const { appointments, patients, healthRecords } = useDataStore()

  // Filter data based on user role
  const userAppointments = appointments.filter((appointment) => {
    if (isPatient) {
      return appointment.patientId === userId
    } else if (isDoctor) {
      return appointment.doctorId === userId
    }
    return true // Admin and nurse can see all
  })

  const userPatients = isDoctor ? patients.filter((patient) => patient.doctorId === userId) : patients

  const userHealthRecords = isPatient ? healthRecords.filter((record) => record.patientId === userId) : healthRecords

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
      <div className="h-[350px] w-full animate-pulse rounded-md bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    )
  }

  if (isPatient) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Health Summary</CardTitle>
            <CardDescription>Your health metrics will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                <p className="text-2xl font-bold">--/--</p>
                <p className="text-xs text-muted-foreground">Not recorded yet</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                <p className="text-2xl font-bold">--</p>
                <p className="text-xs text-muted-foreground">Not recorded yet</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Weight</p>
                <p className="text-2xl font-bold">--</p>
                <p className="text-xs text-muted-foreground">Not recorded yet</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">BMI</p>
                <p className="text-2xl font-bold">--</p>
                <p className="text-xs text-muted-foreground">Not calculated yet</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your healthcare activities will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {userAppointments.length === 0 && userHealthRecords.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">No activities recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userAppointments.slice(0, 2).map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {appointment.type} with {appointment.doctorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.formattedDate} at {appointment.formattedTime}
                      </p>
                    </div>
                    <Badge variant={appointment.status === "Scheduled" ? "default" : "secondary"}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
                {userHealthRecords.slice(0, 2).map((record, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{record.recordType}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.formattedDate} by {record.doctor}
                      </p>
                    </div>
                    <Badge variant="outline">{record.diagnosis}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Practice Overview</CardTitle>
          <CardDescription>Key metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Appointments Today</p>
              <p className="text-2xl font-bold">
                {
                  userAppointments.filter(
                    (a) => a.status === "Scheduled" && new Date(a.date).toDateString() === new Date().toDateString(),
                  ).length
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {userAppointments.length === 0 ? "No appointments yet" : "3 pending confirmations"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Patient Satisfaction</p>
              <p className="text-2xl font-bold">--</p>
              <p className="text-xs text-muted-foreground">No reviews yet</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Wait Time</p>
              <p className="text-2xl font-bold">--</p>
              <p className="text-xs text-muted-foreground">Not calculated yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest appointments and updates</CardDescription>
        </CardHeader>
        <CardContent>
          {userAppointments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">No activities recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userAppointments.slice(0, 3).map((appointment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {appointment.type} - {appointment.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.formattedDate} at {appointment.formattedTime}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "Scheduled"
                        ? "outline"
                        : appointment.status === "Completed"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
