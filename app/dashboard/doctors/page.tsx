"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Calendar, Video, MessageSquare, Star, MapPin, Clock, User, Trash2, Edit, Stethoscope } from "lucide-react"
import Link from "next/link"
import useAuthStore from "@/lib/auth-store"
import { useDataStore, type Doctor } from "@/lib/data-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DoctorsPage() {
  const { userData } = useAuthStore()
  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : "User"
  const userId = userData?.id || ""
  const isPatient = userData?.role === "patient"
  const isAdmin = userData?.role === "admin"

  // Get doctors from data store
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useDataStore()

  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [messageSending, setMessageSending] = useState(false)
  const [showVideoCallDialog, setShowVideoCallDialog] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const [micPermission, setMicPermission] = useState<boolean | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAddDoctorDialogOpen, setIsAddDoctorDialogOpen] = useState(false)
  const [newDoctorData, setNewDoctorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter((doctor) => {
    if (searchTerm === "all") return true;
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Group doctors
  const myDoctors = doctors.filter((doctor) => doctor.isMyDoctor)
  const otherDoctors = filteredDoctors.filter((doctor) => !doctor.isMyDoctor)

  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor)
    setIsViewDialogOpen(true)
  }

  const handleMessageDoctor = (doctor: any) => {
    setSelectedDoctor(doctor)
    setIsMessageDialogOpen(true)
  }

  const sendMessage = () => {
    if (!messageText.trim()) return

    setMessageSending(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedDoctor.name}.`,
      })

      setMessageSending(false)
      setIsMessageDialogOpen(false)
      setMessageText("")
    }, 1000)
  }

  const initiateVideoCall = (doctor: any) => {
    setSelectedDoctor(doctor)
    setShowVideoCallDialog(true)

    // Request camera and microphone permissions
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => setCameraPermission(true))
        .catch(() => setCameraPermission(false))

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => setMicPermission(true))
        .catch(() => setMicPermission(false))
    }
  }

  const startVideoCall = () => {
    setIsConnecting(true)

    // Simulate connecting
    setTimeout(() => {
      setShowVideoCallDialog(false)
      setIsConnecting(false)

      // Redirect to telehealth join page
      window.location.href = "/dashboard/telehealth/join"
    }, 1000)
  }

  const handleAddDoctor = () => {
    if (!newDoctorData.firstName || !newDoctorData.lastName || !newDoctorData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addDoctor({
      id: `doctor-${Date.now()}`,
      name: `${newDoctorData.firstName} ${newDoctorData.lastName}`,
      email: newDoctorData.email,
      specialization: newDoctorData.specialty,
      department: newDoctorData.department,
      phone: newDoctorData.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    setIsAddDoctorDialogOpen(false)
    setNewDoctorData({
      firstName: "",
      lastName: "",
      email: "",
      specialty: "",
      phone: "",
      department: "",
    })

    toast({
      title: "Doctor added",
      description: "Doctor has been successfully added to the system.",
    })
  }

  const handleSetAsMyDoctor = (doctor: Doctor) => {
    updateDoctor(doctor.id, { isMyDoctor: true })

    toast({
      title: "Doctor assigned",
      description: `${doctor.name} has been assigned as your doctor.`,
    })
  }

  const handleDeleteDoctor = (doctorId: string) => {
    deleteDoctor(doctorId)
    toast({
      title: "Doctor deleted",
      description: "The doctor has been successfully removed from the system.",
    })
  }

  // If patient, show only their assigned doctors
  if (isPatient) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">My Doctor</h2>
              <p className="text-muted-foreground">View your assigned healthcare provider(s)</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Doctor(s)</CardTitle>
              <CardDescription>Your current healthcare provider(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {myDoctors.length === 0 ? (
                <div className="text-center py-8">
                  <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No doctor assigned</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You have not been assigned a healthcare provider yet.
                  </p>
                </div>
              ) : (
                myDoctors.map((doctor) => (
                  <Card key={doctor.id} className="mb-4">
                    <div className="flex items-center space-x-4 p-4">
                      <Avatar>
                        <AvatarImage src={doctor.avatar} />
                        <AvatarFallback>{doctor.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        <p className="text-xs text-muted-foreground">{doctor.email}</p>
                      </div>
                      <Badge variant="outline">{doctor.department}</Badge>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Check if user is admin
  if (userData?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Doctors Management</h2>
            <p className="text-muted-foreground">Manage healthcare providers and their specialties</p>
          </div>
          <Button onClick={() => setIsAddDoctorDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Healthcare Provider
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Healthcare Providers</CardTitle>
            <CardDescription>Manage doctors and their specialties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctors.length === 0 ? (
                <div className="text-center py-8">
                  <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No doctors yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by adding your first healthcare provider.
                  </p>
                </div>
              ) : (
                doctors.map((doctor) => (
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
                          <p className="text-xs text-muted-foreground">{doctor.email}</p>
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
                          onClick={() => handleDeleteDoctor(doctor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isAddDoctorDialogOpen} onOpenChange={setIsAddDoctorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Healthcare Provider</DialogTitle>
            <DialogDescription>Add a new doctor to the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newDoctorData.firstName}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newDoctorData.lastName}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newDoctorData.email}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select onValueChange={(value) => setNewDoctorData({ ...newDoctorData, specialty: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Practitioner">General Practitioner</SelectItem>
                  <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                  <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="Neurologist">Neurologist</SelectItem>
                  <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                  <SelectItem value="Gynecologist">Gynecologist</SelectItem>
                  <SelectItem value="Orthopedic Surgeon">Orthopedic Surgeon</SelectItem>
                  <SelectItem value="Ophthalmologist">Ophthalmologist</SelectItem>
                  <SelectItem value="ENT Specialist">ENT Specialist</SelectItem>
                  <SelectItem value="Urologist">Urologist</SelectItem>
                  <SelectItem value="Gastroenterologist">Gastroenterologist</SelectItem>
                  <SelectItem value="Endocrinologist">Endocrinologist</SelectItem>
                  <SelectItem value="Rheumatologist">Rheumatologist</SelectItem>
                  <SelectItem value="Pulmonologist">Pulmonologist</SelectItem>
                  <SelectItem value="Infectious Disease Specialist">Infectious Disease Specialist</SelectItem>
                  <SelectItem value="Oncologist">Oncologist</SelectItem>
                  <SelectItem value="Nephrologist">Nephrologist</SelectItem>
                  <SelectItem value="Hematologist">Hematologist</SelectItem>
                  <SelectItem value="Allergist">Allergist</SelectItem>
                  <SelectItem value="Geriatrician">Geriatrician</SelectItem>
                  <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                  <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                  <SelectItem value="Sports Medicine">Sports Medicine</SelectItem>
                  <SelectItem value="Preventive Medicine">Preventive Medicine</SelectItem>
                  <SelectItem value="Pain Management">Pain Management</SelectItem>
                  <SelectItem value="Palliative Care">Palliative Care</SelectItem>
                  <SelectItem value="Sleep Medicine">Sleep Medicine</SelectItem>
                  <SelectItem value="Rehabilitation Medicine">Rehabilitation Medicine</SelectItem>
                  <SelectItem value="Occupational Medicine">Occupational Medicine</SelectItem>
                  <SelectItem value="Public Health">Public Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newDoctorData.department}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newDoctorData.phone}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDoctorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDoctor}>Add Provider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedDoctor?.name}</DialogTitle>
            <DialogDescription>
              {selectedDoctor?.specialty} at {selectedDoctor?.location}
            </DialogDescription>
          </DialogHeader>

          <div className="divide-y divide-border">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Full Name
                </Label>
                <Input type="text" id="name" value={selectedDoctor?.name} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input type="email" id="email" value={selectedDoctor?.email} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input type="tel" id="phone" value={selectedDoctor?.phone} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Textarea id="bio" value={selectedDoctor?.bio} className="col-span-3" disabled />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Message to {selectedDoctor?.name}</DialogTitle>
            <DialogDescription>Write your message below to contact {selectedDoctor?.name}.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                className="col-span-3"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={sendMessage} disabled={messageSending}>
              {messageSending ? <>Sending...</> : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showVideoCallDialog} onOpenChange={setShowVideoCallDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Initiate Video Call with {selectedDoctor?.name}</DialogTitle>
            <DialogDescription>Confirm to start a video call with {selectedDoctor?.name}.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {cameraPermission === false || micPermission === false ? (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm">
                <p className="font-medium">Permissions Required</p>
                <p>
                  Please enable camera and microphone permissions in your browser settings to proceed with the video
                  call.
                </p>
              </div>
            ) : (
              <>
                {cameraPermission === null || micPermission === null ? (
                  <p>Requesting camera and microphone permissions...</p>
                ) : (
                  <p>Ready to connect with {selectedDoctor?.name} via video call?</p>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowVideoCallDialog(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={startVideoCall}
              disabled={isConnecting || cameraPermission === false || micPermission === false}
            >
              {isConnecting ? <>Connecting...</> : "Start Video Call"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
