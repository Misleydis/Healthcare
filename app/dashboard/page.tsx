"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Plus, User, Video, Activity, Pill, Brain, FileText } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import useAuthStore from "@/lib/auth-store"
import { useDataStore } from "@/lib/data-store"
import { Overview } from "@/components/overview"
import AIRecommendations from "@/components/ai-recommendations"
import HealthMetricsChart from "@/components/health-metrics-chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const { userData } = useAuthStore()
  const isPatient = userData?.role === "patient"
  const isDoctor = userData?.role === "doctor"
  const isNurse = userData?.role === "nurse"
  const isAdmin = userData?.role === "admin"
  const userId = userData?.id || ""
  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : "User"

  const { appointments, doctors, patients, healthRecords, addAppointment } = useDataStore()

  // Filter data based on user role
  const userAppointments = appointments.filter((appointment) => {
    if (isPatient) {
      return appointment.patientId === userId
    } else if (isDoctor) {
      return appointment.doctorId === userId
    }
    return true // Admin and nurse can see all
  })

  const userDoctors = isPatient ? doctors.filter((doctor) => doctor.isMyDoctor) : doctors

  const userPatients = isDoctor ? patients.filter((patient) => patient.doctorId === userId) : patients

  const userHealthRecords = isPatient ? healthRecords.filter((record) => record.patientId === userId) : healthRecords

  const [loading, setLoading] = useState(true)
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
  const [newAppointmentData, setNewAppointmentData] = useState({
    doctorName: "",
    doctorId: "",
    type: "",
    date: new Date(),
    time: "09:00",
    notes: "",
    location: "Main Clinic",
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleBookAppointment = () => {
    setIsBookDialogOpen(true)
  }

  const confirmBooking = () => {
    if (!newAppointmentData.doctorName || !newAppointmentData.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setBookingLoading(true)

    // Combine date and time
    const [hours, minutes] = newAppointmentData.time.split(":").map(Number)
    const appointmentDate = new Date(newAppointmentData.date)
    appointmentDate.setHours(hours, minutes)

    // Create a new appointment
    setTimeout(() => {
      addAppointment({
        patientName: fullName,
        patientId: userId,
        doctorName: newAppointmentData.doctorName,
        doctorId: newAppointmentData.doctorId,
        type: newAppointmentData.type,
        date: appointmentDate,
        formattedDate: format(appointmentDate, "MMMM d, yyyy"),
        formattedTime: format(appointmentDate, "h:mm a"),
        status: "Scheduled",
        location: newAppointmentData.location,
        notes: newAppointmentData.notes,
        duration: 30,
      })

      setIsBookDialogOpen(false)
      setBookingLoading(false)

      // Reset form
      setNewAppointmentData({
        doctorName: "",
        doctorId: "",
        type: "",
        date: new Date(),
        time: "09:00",
        notes: "",
        location: "Main Clinic",
      })

      toast({
        title: "Appointment booked",
        description: `Your appointment has been scheduled for ${format(appointmentDate, "MMMM d, yyyy 'at' h:mm a")}.`,
      })
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {isPatient && (
            <div className="flex items-center space-x-2">
              <Button onClick={handleBookAppointment}>
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isPatient ? "My Appointments" : "Total Appointments"}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{userAppointments.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {userAppointments.filter((a) => a.status === "Scheduled").length} upcoming
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{isPatient ? "My Doctors" : "Total Patients"}</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{isPatient ? userDoctors.length : userPatients.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {isPatient
                          ? userDoctors.length === 0
                            ? "No assigned doctors"
                            : "Assigned healthcare providers"
                          : userPatients.length === 0
                            ? "No patients"
                            : "Active patients"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isPatient ? "My Health Records" : "Total Records"}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{userHealthRecords.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {userHealthRecords.length === 0
                          ? "No health records"
                          : `Last updated: ${userHealthRecords.length > 0 ? format(new Date(), "MMM d, yyyy") : "N/A"}`}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isPatient ? "Prescriptions" : "AI Recommendations"}
                  </CardTitle>
                  {isPatient ? (
                    <Pill className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{isPatient ? "0" : "3"}</div>
                      <p className="text-xs text-muted-foreground">
                        {isPatient ? "Active prescriptions" : "New insights available"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {loading ? <div className="h-[300px] w-full animate-pulse rounded-md bg-muted" /> : <Overview />}
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>{isPatient ? "Upcoming Appointments" : "Recent Patients"}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : userAppointments.length === 0 ? (
                    <div className="flex h-[200px] flex-col items-center justify-center space-y-3">
                      <Calendar className="h-10 w-10 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">No upcoming appointments.</p>
                      {isPatient && (
                        <Button onClick={handleBookAppointment} variant="outline">
                          Book an Appointment
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {userAppointments
                        .filter((a) => a.status === "Scheduled")
                        .slice(0, 3)
                        .map((appointment) => (
                          <div key={appointment.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={`/placeholder.svg?height=36&width=36&text=${
                                  isPatient
                                    ? appointment.doctorName.substring(0, 2)
                                    : appointment.patientName.substring(0, 2)
                                }`}
                              />
                              <AvatarFallback>
                                {isPatient
                                  ? appointment.doctorName.substring(0, 2)
                                  : appointment.patientName.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {isPatient ? appointment.doctorName : appointment.patientName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.formattedDate} at {appointment.formattedTime}
                              </p>
                            </div>
                            <div className="ml-auto font-medium">
                              {appointment.location === "Telehealth" ? (
                                <Button asChild size="sm">
                                  <Link href="/dashboard/telehealth/join">
                                    <Video className="mr-2 h-4 w-4" />
                                    Join
                                  </Link>
                                </Button>
                              ) : (
                                <Badge variant="outline">{appointment.type}</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Health Metrics</CardTitle>
                  <CardDescription>
                    {isPatient ? "Your health trends over time" : "Patient health trends over time"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {loading ? (
                    <div className="h-[300px] w-full animate-pulse rounded-md bg-muted" />
                  ) : (
                    <HealthMetricsChart />
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Personalized insights based on your health data</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-[80px] w-full" />
                      ))}
                    </div>
                  ) : (
                    <AIRecommendations />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Health Analytics</CardTitle>
                <CardDescription>
                  {isPatient ? "Detailed analysis of your health data" : "Detailed analysis of patient health data"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                ) : userHealthRecords.length === 0 ? (
                  <div className="flex h-[400px] flex-col items-center justify-center space-y-3">
                    <Activity className="h-16 w-16 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">No health data available for analysis.</p>
                    <p className="text-center text-sm text-muted-foreground">
                      Health records and metrics will appear here once they are added to the system.
                    </p>
                  </div>
                ) : (
                  <div className="h-[400px]">
                    <HealthMetricsChart />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>AI Health Insights</CardTitle>
                <CardDescription>Machine learning powered insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-[100px] w-full" />
                    ))}
                  </div>
                ) : (
                  <AIRecommendations extended={true} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Book Appointment Dialog */}
      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book New Appointment</DialogTitle>
            <DialogDescription>Schedule a new appointment with a healthcare provider</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Healthcare Provider</Label>
              <Select
                value={newAppointmentData.doctorId}
                onValueChange={(value) => {
                  const selectedDoctor = doctors.find((d) => d.id === value)
                  setNewAppointmentData({
                    ...newAppointmentData,
                    doctorId: value,
                    doctorName: selectedDoctor ? selectedDoctor.name : "",
                  })
                }}
              >
                <SelectTrigger id="doctorName">
                  <SelectValue placeholder="Select a healthcare provider" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No doctors available
                    </SelectItem>
                  ) : (
                    doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialty})
                      </SelectItem>
                    ))
                  )}
                  {/* Fallback options if no doctors are in the system yet */}
                  {doctors.length === 0 && (
                    <>
                      <SelectItem value="dr-mutasa">Dr. Mutasa (General Practitioner)</SelectItem>
                      <SelectItem value="dr-chigumba">Dr. Chigumba (Pediatrician)</SelectItem>
                      <SelectItem value="dr-ndlovu">Dr. Ndlovu (Cardiologist)</SelectItem>
                      <SelectItem value="dr-makoni">Dr. Makoni (Dermatologist)</SelectItem>
                      <SelectItem value="dr-zimuto">Dr. Zimuto (Psychiatrist)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentType">Appointment Type</Label>
              <Select
                value={newAppointmentData.type}
                onValueChange={(value) => setNewAppointmentData({ ...newAppointmentData, type: value })}
              >
                <SelectTrigger id="appointmentType">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Check-up">General Check-up</SelectItem>
                  <SelectItem value="Follow-up">Follow-up Appointment</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Vaccination">Vaccination</SelectItem>
                  <SelectItem value="Lab Test">Lab Test</SelectItem>
                  <SelectItem value="Prescription Renewal">Prescription Renewal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={newAppointmentData.location}
                onValueChange={(value) => setNewAppointmentData({ ...newAppointmentData, location: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Clinic">Main Clinic</SelectItem>
                  <SelectItem value="Telehealth">Telehealth</SelectItem>
                  <SelectItem value="Rural Outpost">Rural Outpost</SelectItem>
                  <SelectItem value="Mobile Clinic">Mobile Clinic</SelectItem>
                  <SelectItem value="Home Visit">Home Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Date</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={format(newAppointmentData.date, "yyyy-MM-dd")}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : new Date()
                    setNewAppointmentData({ ...newAppointmentData, date })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Time</Label>
                <Input
                  id="appointmentTime"
                  type="time"
                  value={newAppointmentData.time}
                  onChange={(e) => setNewAppointmentData({ ...newAppointmentData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentNotes">Notes (optional)</Label>
              <Textarea
                id="appointmentNotes"
                value={newAppointmentData.notes}
                onChange={(e) => setNewAppointmentData({ ...newAppointmentData, notes: e.target.value })}
                placeholder="Add any additional information for the healthcare provider"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmBooking}
                disabled={bookingLoading || !newAppointmentData.doctorName || !newAppointmentData.type}
              >
                {bookingLoading ? "Booking..." : "Book Appointment"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
