"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Plus, Edit, Trash2, FileText, Calendar, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuthStore } from "@/lib/auth-store"

// Mock patient data
const mockPatients = [
  {
    id: "1",
    name: "John Smith",
    age: 45,
    gender: "Male",
    condition: "Hypertension",
    lastVisit: "2023-04-15",
    status: "Active",
    phone: "(555) 123-4567",
    email: "john.smith@example.com",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    condition: "Diabetes Type 2",
    lastVisit: "2023-04-10",
    status: "Active",
    phone: "(555) 987-6543",
    email: "sarah.j@example.com",
  },
  {
    id: "3",
    name: "Robert Williams",
    age: 58,
    gender: "Male",
    condition: "Arthritis",
    lastVisit: "2023-03-28",
    status: "Follow-up",
    phone: "(555) 456-7890",
    email: "rob.williams@example.com",
  },
  {
    id: "4",
    name: "Emily Davis",
    age: 27,
    gender: "Female",
    condition: "Asthma",
    lastVisit: "2023-04-05",
    status: "New",
    phone: "(555) 234-5678",
    email: "emily.d@example.com",
  },
  {
    id: "5",
    name: "Michael Brown",
    age: 41,
    gender: "Male",
    condition: "Anxiety",
    lastVisit: "2023-04-12",
    status: "Active",
    phone: "(555) 876-5432",
    email: "michael.b@example.com",
  },
]

// Mock appointments data
const mockAppointments = [
  {
    id: "1",
    patientName: "John Smith",
    date: "2023-04-20",
    time: "09:00 AM",
    type: "Check-up",
    status: "Scheduled",
  },
  {
    id: "2",
    patientName: "Sarah Johnson",
    date: "2023-04-21",
    time: "10:30 AM",
    type: "Follow-up",
    status: "Scheduled",
  },
  {
    id: "3",
    patientName: "Robert Williams",
    date: "2023-04-22",
    time: "02:00 PM",
    type: "Consultation",
    status: "Confirmed",
  },
]

export default function PatientsPage() {
  const [patients, setPatients] = useState(mockPatients)
  const [appointments, setAppointments] = useState(mockAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuthStore()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle adding a new patient
  const handleAddPatient = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newPatient = {
      id: (patients.length + 1).toString(),
      name: formData.get("name"),
      age: Number.parseInt(formData.get("age")),
      gender: formData.get("gender"),
      condition: formData.get("condition"),
      lastVisit: new Date().toISOString().split("T")[0],
      status: "New",
      phone: formData.get("phone"),
      email: formData.get("email"),
    }

    setPatients([...patients, newPatient])
    setIsAddDialogOpen(false)
    toast({
      title: "Patient added",
      description: `${newPatient.name} has been added to your patient list.`,
    })
  }

  // Handle deleting a patient
  const handleDeletePatient = () => {
    if (!selectedPatient) return

    setPatients(patients.filter((patient) => patient.id !== selectedPatient.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Patient removed",
      description: `${selectedPatient.name} has been removed from your patient list.`,
      variant: "destructive",
    })
    setSelectedPatient(null)
  }

  // Handle scheduling an appointment
  const handleScheduleAppointment = (patient) => {
    router.push(`/dashboard/telehealth?patientId=${patient.id}&patientName=${patient.name}`)
  }

  // Check if user is a doctor
  if (user?.role !== "doctor") {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Restricted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">This page is only accessible to medical professionals.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="bg-gray-200 animate-pulse rounded h-[500px] w-full"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patient Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>Enter the patient details below to add them to your patient list.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPatient}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="age" className="text-right">
                    Age
                  </label>
                  <Input id="age" name="age" type="number" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="gender" className="text-right">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="condition" className="text-right">
                    Condition
                  </label>
                  <Input id="condition" name="condition" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="phone" className="text-right">
                    Phone
                  </label>
                  <Input id="phone" name="phone" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Patient</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Patient List</TabsTrigger>
          <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No patients found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.condition}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              patient.status === "Active"
                                ? "default"
                                : patient.status === "New"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/records?patientId=${patient.id}`)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Records
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleAppointment(patient)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Appointment
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/dashboard/telehealth?patientId=${patient.id}&patientName=${patient.name}`,
                                  )
                                }
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Start Telehealth
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedPatient(patient)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Patient
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.patientName}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            appointment.status === "Confirmed"
                              ? "default"
                              : appointment.status === "Scheduled"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const patientId = patients.find((p) => p.name === appointment.patientName)?.id
                            router.push(
                              `/dashboard/telehealth?patientId=${patientId}&patientName=${appointment.patientName}`,
                            )
                          }}
                        >
                          Start Session
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedPatient?.name} from your patient list? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePatient}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
