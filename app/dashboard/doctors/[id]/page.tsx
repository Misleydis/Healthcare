"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Phone, Mail, Users, User, FileText, Video } from "lucide-react"
import useAuthStore from "@/lib/auth-store"
import { useDataStore } from "@/lib/data-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DoctorProfilePage() {
  const params = useParams()
  const doctorId = params.id as string
  const { userData } = useAuthStore()
  const { doctors, patients, appointments } = useDataStore()
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false)

  const doctor = doctors.find((d) => d.id === doctorId)
  const doctorPatients = doctor?.patients?.map((patientId) => patients.find((p) => p.id === patientId)) || []
  const doctorAppointments = appointments.filter((a) => a.doctorId === doctorId)

  // Sort appointments by date
  const sortedAppointments = [...doctorAppointments].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient)
    setIsPatientDialogOpen(true)
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Doctor not found</h2>
            <p className="text-muted-foreground">The doctor you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{doctor.name}</h2>
            <p className="text-muted-foreground">{doctor.specialization}</p>
          </div>
        </div>

        <Tabs defaultValue="patients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="patients">
              <Users className="mr-2 h-4 w-4" />
              Patients ({doctorPatients.length})
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments ({doctorAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>My Patients</CardTitle>
                <CardDescription>View and manage your patient list</CardDescription>
              </CardHeader>
              <CardContent>
                {doctorPatients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No patients assigned yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {doctorPatients.map((patient) => (
                      <Card key={patient?.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={patient?.avatar} />
                              <AvatarFallback>{patient?.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{patient?.name}</CardTitle>
                              <CardDescription>{patient?.email}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {patient?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{patient.phone}</span>
                              </div>
                            )}
                            {patient?.dateOfBirth && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardContent className="pt-0">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>View and manage patient appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {doctorAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No appointments scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedAppointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                            <Avatar>
                              <AvatarImage src={appointment.patientAvatar} />
                              <AvatarFallback>{appointment.patientName.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-medium">{appointment.patientName}</h4>
                              <p className="text-sm text-muted-foreground">{appointment.type}</p>
                            </div>
                            <Badge
                              variant={appointment.status === "Scheduled" ? "default" : "secondary"}
                              className={appointment.status === "Scheduled" ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-4 md:w-1/3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {appointment.formattedDate} at {appointment.formattedTime}
                              </span>
                            </div>
                            {appointment.location === "Telehealth" && appointment.status === "Scheduled" && (
                              <Button size="sm">
                                <Video className="mr-2 h-4 w-4" />
                                Join
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>View patient information and medical history</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPatient.avatar} />
                  <AvatarFallback>{selectedPatient.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedPatient.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedPatient.phone || "No phone number"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Date of Birth: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedPatient.address || "No address"}</span>
                </div>
              </div>

              {selectedPatient.emergencyContact && (
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Emergency Contact</h4>
                  <p className="text-sm text-muted-foreground">{selectedPatient.emergencyContact}</p>
                </div>
              )}

              {selectedPatient.insuranceProvider && (
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Insurance Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Provider: {selectedPatient.insuranceProvider}
                    {selectedPatient.insuranceNumber && (
                      <span className="block">Policy Number: {selectedPatient.insuranceNumber}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 