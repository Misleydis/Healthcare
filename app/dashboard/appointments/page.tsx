"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
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
import { Plus, Video, Clock, CalendarIcon, MapPin } from "lucide-react"
import Link from "next/link"
import { format, isSameDay, addDays, addHours, addMinutes, isAfter, isBefore } from "date-fns"
import useAuthStore from "@/lib/auth-store"

// Generate appointments data
const generateAppointments = (count = 10, isPatient = false, patientName = "") => {
  const doctorNames = ["Dr. Mutasa", "Dr. Chigumba", "Dr. Ndlovu", "Dr. Makoni", "Dr. Zimuto"]
  const appointmentTypes = ["Check-up", "Follow-up", "Consultation", "Vaccination", "Lab Test", "Prescription Renewal"]
  const locations = ["Main Clinic", "Telehealth", "Rural Outpost", "Mobile Clinic", "Home Visit"]
  const statuses = ["Scheduled", "Completed", "Cancelled", "Rescheduled"]

  const now = new Date()
  const appointments = []

  // Past appointments
  for (let i = 0; i < Math.floor(count / 3); i++) {
    const appointmentDate = addDays(now, -Math.floor(Math.random() * 30) - 1)
    appointments.push({
      id: i + 1,
      patientName: isPatient ? patientName : `Patient ${i + 1}`,
      doctorName: doctorNames[Math.floor(Math.random() * doctorNames.length)],
      type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      date: appointmentDate,
      formattedDate: format(appointmentDate, "MMMM d, yyyy"),
      formattedTime: format(appointmentDate, "h:mm a"),
      status: Math.random() > 0.2 ? "Completed" : "Cancelled",
      location: locations[Math.floor(Math.random() * locations.length)],
      notes: "Regular check-up appointment.",
      duration: 30,
    })
  }

  // Today's appointments
  for (let i = 0; i < Math.floor(count / 3); i++) {
    const appointmentDate = addHours(addMinutes(now, Math.floor(Math.random() * 300)), i)
    appointments.push({
      id: appointments.length + 1,
      patientName: isPatient ? patientName : `Patient ${appointments.length + 1}`,
      doctorName: doctorNames[Math.floor(Math.random() * doctorNames.length)],
      type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      date: appointmentDate,
      formattedDate: format(appointmentDate, "MMMM d, yyyy"),
      formattedTime: format(appointmentDate, "h:mm a"),
      status: isAfter(appointmentDate, now) ? "Scheduled" : "Completed",
      location: locations[Math.floor(Math.random() * locations.length)],
      notes: "Follow-up appointment to discuss test results.",
      duration: 30,
    })
  }

  // Future appointments
  for (let i = 0; i < Math.floor(count / 3); i++) {
    const appointmentDate = addDays(now, Math.floor(Math.random() * 30) + 1)
    appointments.push({
      id: appointments.length + 1,
      patientName: isPatient ? patientName : `Patient ${appointments.length + 1}`,
      doctorName: doctorNames[Math.floor(Math.random() * doctorNames.length)],
      type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      date: appointmentDate,
      formattedDate: format(appointmentDate, "MMMM d, yyyy"),
      formattedTime: format(appointmentDate, "h:mm a"),
      status: "Scheduled",
      location: locations[Math.floor(Math.random() * locations.length)],
      notes: "Initial consultation for new symptoms.",
      duration: 30,
    })
  }

  return appointments
}

export default function AppointmentsPage() {
  const { userData } = useAuthStore()
  const isPatient = userData?.role === "patient"
  const isDoctor = userData?.role === "doctor"
  const isNurse = userData?.role === "nurse"
  const isAdmin = userData?.role === "admin"

  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : "User"

  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
  const [newAppointmentData, setNewAppointmentData] = useState({
    doctorName: "",
    type: "",
    date: new Date(),
    time: "09:00",
    notes: "",
  })
  const [cancelReason, setCancelReason] = useState("")
  const [cancelLoading, setCancelLoading] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(new Date())
  const [rescheduleTime, setRescheduleTime] = useState("09:00")
  const [rescheduleLoading, setRescheduleLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAppointments(generateAppointments(15, isPatient, fullName))
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [isPatient, fullName])

  // Filter appointments based on selected date and status
  const todayAppointments = appointments.filter(
    (appointment) => isSameDay(appointment.date, new Date()) && appointment.status === "Scheduled",
  )

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      isAfter(appointment.date, new Date()) &&
      !isSameDay(appointment.date, new Date()) &&
      appointment.status === "Scheduled",
  )

  const pastAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed" || appointment.status === "Cancelled",
  )

  const selectedDateAppointments = selectedDate
    ? appointments.filter((appointment) => isSameDay(appointment.date, selectedDate))
    : []

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }

  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsCancelDialogOpen(true)
  }

  const confirmCancel = () => {
    setCancelLoading(true)

    // Simulate API call
    setTimeout(() => {
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === selectedAppointment.id ? { ...appointment, status: "Cancelled" } : appointment,
        ),
      )

      setIsCancelDialogOpen(false)
      setCancelLoading(false)
      setCancelReason("")

      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been successfully cancelled.",
      })
    }, 1500)
  }

  const handleRescheduleAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setRescheduleDate(appointment.date)
    setRescheduleTime(format(appointment.date, "HH:mm"))
    setIsRescheduleDialogOpen(true)
  }

  const confirmReschedule = () => {
    if (!rescheduleDate) return

    setRescheduleLoading(true)

    // Combine date and time
    const [hours, minutes] = rescheduleTime.split(":").map(Number)
    const newDate = new Date(rescheduleDate)
    newDate.setHours(hours, minutes)

    // Simulate API call
    setTimeout(() => {
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? {
                ...appointment,
                date: newDate,
                formattedDate: format(newDate, "MMMM d, yyyy"),
                formattedTime: format(newDate, "h:mm a"),
                status: "Scheduled",
              }
            : appointment,
        ),
      )

      setIsRescheduleDialogOpen(false)
      setRescheduleLoading(false)

      toast({
        title: "Appointment rescheduled",
        description: `Your appointment has been rescheduled to ${format(newDate, "MMMM d, yyyy 'at' h:mm a")}.`,
      })
    }, 1500)
  }

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

    // Simulate API call
    setTimeout(() => {
      const newAppointment = {
        id: appointments.length + 1,
        patientName: fullName,
        doctorName: newAppointmentData.doctorName,
        type: newAppointmentData.type,
        date: appointmentDate,
        formattedDate: format(appointmentDate, "MMMM d, yyyy"),
        formattedTime: format(appointmentDate, "h:mm a"),
        status: "Scheduled",
        location: "Main Clinic",
        notes: newAppointmentData.notes,
        duration: 30,
      }

      setAppointments([...appointments, newAppointment])
      setIsBookDialogOpen(false)
      setBookingLoading(false)

      // Reset form
      setNewAppointmentData({
        doctorName: "",
        type: "",
        date: new Date(),
        time: "09:00",
        notes: "",
      })

      toast({
        title: "Appointment booked",
        description: `Your appointment has been scheduled for ${format(appointmentDate, "MMMM d, yyyy 'at' h:mm a")}.`,
      })
    }, 1500)
  }

  // Function to get appointment dates for calendar highlighting
  const getAppointmentDates = () => {
    return appointments
      .filter((appointment) => appointment.status === "Scheduled")
      .map((appointment) => appointment.date)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{isPatient ? "My Appointments" : "Appointments"}</h2>
            <p className="text-muted-foreground">
              {isPatient ? "View and manage your scheduled appointments" : "View and manage patient appointments"}
            </p>
          </div>
          <Button onClick={handleBookAppointment}>
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>{isPatient ? "My Appointments" : "Appointments"}</CardTitle>
              <CardDescription>View and manage upcoming and past appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="today" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="today">Today ({todayAppointments.length})</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
                  <TabsTrigger value="past">Past Appointments</TabsTrigger>
                  <TabsTrigger value="date">By Date</TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="space-y-4">
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
                  ) : todayAppointments.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center space-y-3">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">No appointments scheduled for today.</p>
                      <Button onClick={handleBookAppointment} variant="outline">
                        Book an Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <Card key={appointment.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/placeholder.svg?height=40&width=40&text=${appointment.doctorName.substring(0, 2)}`}
                                />
                                <AvatarFallback>{appointment.doctorName.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">{appointment.doctorName}</h4>
                                <p className="text-sm text-muted-foreground">{appointment.type}</p>
                              </div>
                              <Badge className="bg-green-500 hover:bg-green-600">Today</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 md:w-1/3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {appointment.formattedTime} ({appointment.duration} min)
                                </span>
                              </div>
                              {appointment.location === "Telehealth" ? (
                                <Button asChild size="sm">
                                  <Link href="/dashboard/telehealth/join">
                                    <Video className="mr-2 h-4 w-4" />
                                    Join
                                  </Link>
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" onClick={() => handleViewAppointment(appointment)}>
                                  Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
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
                  ) : upcomingAppointments.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center space-y-3">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">No upcoming appointments scheduled.</p>
                      <Button onClick={handleBookAppointment} variant="outline">
                        Book an Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <Card key={appointment.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/placeholder.svg?height=40&width=40&text=${appointment.doctorName.substring(0, 2)}`}
                                />
                                <AvatarFallback>{appointment.doctorName.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">{appointment.doctorName}</h4>
                                <p className="text-sm text-muted-foreground">{appointment.type}</p>
                              </div>
                              <Badge variant="outline">{appointment.formattedDate}</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 md:w-1/3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.formattedTime}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewAppointment(appointment)}>
                                  Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
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
                  ) : pastAppointments.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center space-y-3">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">No past appointments found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastAppointments.slice(0, 5).map((appointment) => (
                        <Card key={appointment.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/placeholder.svg?height=40&width=40&text=${appointment.doctorName.substring(0, 2)}`}
                                />
                                <AvatarFallback>{appointment.doctorName.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">{appointment.doctorName}</h4>
                                <p className="text-sm text-muted-foreground">{appointment.type}</p>
                              </div>
                              <Badge
                                variant={appointment.status === "Completed" ? "default" : "destructive"}
                                className={appointment.status === "Completed" ? "bg-green-500 hover:bg-green-600" : ""}
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 md:w-1/3">
                              <div>
                                <div className="text-sm font-medium">{appointment.formattedDate}</div>
                                <div className="text-sm text-muted-foreground">{appointment.formattedTime}</div>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => handleViewAppointment(appointment)}>
                                Details
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="date" className="space-y-4">
                  {selectedDate ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Appointments for {format(selectedDate, "MMMM d, yyyy")}</h3>

                      {selectedDateAppointments.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center space-y-3">
                          <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                          <p className="text-center text-muted-foreground">No appointments scheduled for this date.</p>
                          <Button onClick={handleBookAppointment} variant="outline">
                            Book an Appointment
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedDateAppointments.map((appointment) => (
                            <Card key={appointment.id} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={`/placeholder.svg?height=40&width=40&text=${appointment.doctorName.substring(0, 2)}`}
                                    />
                                    <AvatarFallback>{appointment.doctorName.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{appointment.doctorName}</h4>
                                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                                  </div>
                                  <Badge
                                    variant={
                                      appointment.status === "Scheduled"
                                        ? "default"
                                        : appointment.status === "Completed"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                    className={
                                      appointment.status === "Scheduled" ? "bg-green-500 hover:bg-green-600" : ""
                                    }
                                  >
                                    {appointment.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 md:w-1/3">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{appointment.formattedTime}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    {appointment.status === "Scheduled" &&
                                    appointment.location === "Telehealth" &&
                                    isSameDay(appointment.date, new Date()) ? (
                                      <Button asChild size="sm">
                                        <Link href="/dashboard/telehealth/join">
                                          <Video className="mr-2 h-4 w-4" />
                                          Join
                                        </Link>
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewAppointment(appointment)}
                                      >
                                        Details
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center">
                      <p className="text-muted-foreground">Please select a date from the calendar.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  booked: getAppointmentDates(),
                }}
                modifiersStyles={{
                  booked: {
                    fontWeight: "bold",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                  },
                }}
              />

              <div className="mt-4">
                <h4 className="mb-2 font-medium">Quick Actions</h4>
                <div className="space-y-2">
                  <Button onClick={handleBookAppointment} variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Book New Appointment
                  </Button>
                  {todayAppointments.length > 0 && todayAppointments[0].location === "Telehealth" && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/dashboard/telehealth/join">
                        <Video className="mr-2 h-4 w-4" />
                        Join Today's Telehealth
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* View Appointment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>View details of your scheduled appointment</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/placeholder.svg?height=64&width=64&text=${selectedAppointment.doctorName.substring(0, 2)}`}
                  />
                  <AvatarFallback>{selectedAppointment.doctorName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedAppointment.doctorName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.type}</p>
                </div>
                <Badge
                  variant={
                    selectedAppointment.status === "Scheduled"
                      ? "default"
                      : selectedAppointment.status === "Completed"
                        ? "secondary"
                        : "destructive"
                  }
                  className={`ml-auto ${selectedAppointment.status === "Scheduled" ? "bg-green-500 hover:bg-green-600" : ""}`}
                >
                  {selectedAppointment.status}
                </Badge>
              </div>

              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedAppointment.formattedDate} at {selectedAppointment.formattedTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedAppointment.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {selectedAppointment.duration} minutes</span>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Notes</Label>
                  <div className="rounded-md border p-3">
                    <p>{selectedAppointment.notes}</p>
                  </div>
                </div>
              )}

              <DialogFooter>
                {selectedAppointment.status === "Scheduled" && (
                  <div className="flex w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsViewDialogOpen(false)
                        handleRescheduleAppointment(selectedAppointment)
                      }}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setIsViewDialogOpen(false)
                        handleCancelAppointment(selectedAppointment)
                      }}
                    >
                      Cancel Appointment
                    </Button>
                  </div>
                )}
                {selectedAppointment.location === "Telehealth" &&
                  selectedAppointment.status === "Scheduled" &&
                  isSameDay(selectedAppointment.date, new Date()) && (
                    <Button asChild className="w-full">
                      <Link href="/dashboard/telehealth/join">
                        <Video className="mr-2 h-4 w-4" />
                        Join Telehealth Session
                      </Link>
                    </Button>
                  )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this appointment?</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <p className="font-medium">{selectedAppointment.doctorName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.formattedDate} at {selectedAppointment.formattedTime}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancelReason">Reason for cancellation (optional)</Label>
                <Textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this appointment"
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                  Keep Appointment
                </Button>
                <Button variant="destructive" onClick={confirmCancel} disabled={cancelLoading}>
                  {cancelLoading ? "Cancelling..." : "Cancel Appointment"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>Select a new date and time for your appointment</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <p className="font-medium">{selectedAppointment.doctorName}</p>
                <p className="text-sm text-muted-foreground">
                  Currently scheduled for {selectedAppointment.formattedDate} at {selectedAppointment.formattedTime}
                </p>
              </div>

              <div className="space-y-2">
                <Label>New Date</Label>
                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={setRescheduleDate}
                    disabled={(date) => isBefore(date, new Date()) && !isSameDay(date, new Date())}
                    initialFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rescheduleTime">New Time</Label>
                <Input
                  id="rescheduleTime"
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmReschedule} disabled={rescheduleLoading || !rescheduleDate}>
                  {rescheduleLoading ? "Rescheduling..." : "Confirm Reschedule"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                value={newAppointmentData.doctorName}
                onValueChange={(value) => setNewAppointmentData({ ...newAppointmentData, doctorName: value })}
              >
                <SelectTrigger id="doctorName">
                  <SelectValue placeholder="Select a healthcare provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Mutasa">Dr. Mutasa (General Practitioner)</SelectItem>
                  <SelectItem value="Dr. Chigumba">Dr. Chigumba (Pediatrician)</SelectItem>
                  <SelectItem value="Dr. Ndlovu">Dr. Ndlovu (Cardiologist)</SelectItem>
                  <SelectItem value="Dr. Makoni">Dr. Makoni (Dermatologist)</SelectItem>
                  <SelectItem value="Dr. Zimuto">Dr. Zimuto (Psychiatrist)</SelectItem>
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
              <Label>Appointment Date</Label>
              <div className="rounded-md border">
                <Calendar
                  mode="single"
                  selected={newAppointmentData.date}
                  onSelect={(date) => date && setNewAppointmentData({ ...newAppointmentData, date })}
                  disabled={(date) => isBefore(date, new Date()) && !isSameDay(date, new Date())}
                  initialFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Appointment Time</Label>
              <Input
                id="appointmentTime"
                type="time"
                value={newAppointmentData.time}
                onChange={(e) => setNewAppointmentData({ ...newAppointmentData, time: e.target.value })}
              />
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
