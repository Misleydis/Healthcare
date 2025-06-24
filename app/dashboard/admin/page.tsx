"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Trash2, Edit, Users, Calendar, Stethoscope, UserPlus } from "lucide-react"
import useAuthStore from "@/lib/auth-store"
import { useDataStore } from "@/lib/data-store"
import { useToast } from "@/components/ui/use-toast"

export default function AdminDashboard() {
  const { userData } = useAuthStore()
  const { doctors, patients, appointments, addDoctor, deleteDoctor, addPatient, deletePatient } = useDataStore()
  const [loading, setLoading] = useState(true)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "doctor",
    specialty: "",
    phone: "",
    department: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleAddUser = () => {
    if (!newUserData.firstName || !newUserData.lastName || !newUserData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (newUserData.role === "doctor") {
      addDoctor({
        id: `doctor-${Date.now()}`,
        name: `${newUserData.firstName} ${newUserData.lastName}`,
        email: newUserData.email,
        specialization: newUserData.specialty,
        department: newUserData.department,
        phone: newUserData.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    setIsAddUserDialogOpen(false)
    setNewUserData({
      firstName: "",
      lastName: "",
      email: "",
      role: "doctor",
      specialty: "",
      phone: "",
      department: "",
    })

    toast({
      title: "User added",
      description: `${newUserData.role} has been successfully added to the system.`,
    })
  }

  const handleDeleteUser = (userId: string, role: string) => {
    if (role === "doctor") {
      deleteDoctor(userId)
    } else if (role === "patient") {
      deletePatient(userId)
    }

    toast({
      title: "User deleted",
      description: "The user has been successfully removed from the system.",
    })
  }

  // Get unique specialties from doctors
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialization)))

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage healthcare providers and system settings</p>
          </div>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Healthcare Provider
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <Users className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="doctors">
              <Stethoscope className="mr-2 h-4 w-4" />
              Doctors
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Doctors</CardTitle>
                  <CardDescription>Active healthcare providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctors.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {specialties.length} specialties
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Patients</CardTitle>
                  <CardDescription>Registered patients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patients.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active in the system
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Appointments</CardTitle>
                  <CardDescription>Scheduled consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all departments
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Specialties Overview</CardTitle>
                <CardDescription>Distribution of medical specialties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {specialties.map((specialty) => (
                    <Card key={specialty}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{specialty}</CardTitle>
                        <CardDescription>
                          {doctors.filter(d => d.specialization === specialty).length} doctors
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Providers</CardTitle>
                <CardDescription>Manage doctors and their specialties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <Card key={doctor.id}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={doctor.avatar} />
                            <AvatarFallback>{doctor.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{doctor.name}</h4>
                            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{doctor.department}</Badge>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(doctor.id, "doctor")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>View and manage all scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium">
                              {doctors.find(d => d.id === appointment.doctorId)?.name || "Unknown Doctor"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              with {patients.find(p => p.id === appointment.patientId)?.name || "Unknown Patient"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={appointment.status === "scheduled" ? "default" : "secondary"}>
                            {appointment.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Healthcare Provider</DialogTitle>
            <DialogDescription>Add a new doctor to the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newUserData.firstName}
                  onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newUserData.lastName}
                  onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={newUserData.specialty}
                onChange={(e) => setNewUserData({ ...newUserData, specialty: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newUserData.department}
                onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newUserData.phone}
                onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add Provider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 