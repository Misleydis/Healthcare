"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
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
import { Search, Calendar, Video, MessageSquare, Star, MapPin, Clock, User } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import useAuthStore from "@/lib/auth-store"

// Generate doctors data
const generateDoctors = (count = 10) => {
  const specialties = [
    "General Practitioner",
    "Pediatrician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Psychiatrist",
    "Gynecologist",
    "Orthopedic Surgeon",
    "Ophthalmologist",
    "Infectious Disease Specialist",
  ]

  const firstNames = ["John", "Sarah", "Michael", "Elizabeth", "David", "Mary", "Robert", "Patricia", "James", "Linda"]
  const lastNames = ["Mutasa", "Chigumba", "Ndlovu", "Makoni", "Zimuto", "Moyo", "Ncube", "Dube", "Sibanda", "Mpofu"]

  const locations = [
    "Harare Central Hospital",
    "Bulawayo General Hospital",
    "Mutare Provincial Hospital",
    "Gweru Medical Center",
    "Masvingo Health Clinic",
  ]

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const specialty = specialties[Math.floor(Math.random() * specialties.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const rating = (3 + Math.random() * 2).toFixed(1)
    const experience = 5 + Math.floor(Math.random() * 20)

    return {
      id: i + 1,
      name: `Dr. ${firstName} ${lastName}`,
      specialty,
      location,
      rating: Number.parseFloat(rating),
      experience,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mjshealthhub.org`,
      phone: `+263 7${Math.floor(Math.random() * 10000000)}`,
      bio: `Dr. ${lastName} is a highly experienced ${specialty.toLowerCase()} with over ${experience} years of practice. Specializes in providing comprehensive healthcare services to patients in Zimbabwe.`,
      availability: ["Monday", "Wednesday", "Friday"],
      availableTimes: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
      isMyDoctor: Math.random() > 0.7,
      lastVisit:
        Math.random() > 0.5
          ? format(new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000), "MMMM d, yyyy")
          : null,
      nextAppointment:
        Math.random() > 0.7
          ? format(
              new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
              "MMMM d, yyyy 'at' h:mm a",
            )
          : null,
      initials: `${firstName[0]}${lastName[0]}`,
    }
  })
}

export default function DoctorsPage() {
  const { userData } = useAuthStore()
  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : "User"

  const [doctors, setDoctors] = useState<any[]>([])
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

  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDoctors(generateDoctors(15))
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter((doctor) => {
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Group doctors
  const myDoctors = filteredDoctors.filter((doctor) => doctor.isMyDoctor)
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
    }, 1500)
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
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Doctors</h2>
            <p className="text-muted-foreground">View and connect with your healthcare providers</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctors..."
                className="w-full pl-8 md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="my-doctors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="my-doctors">My Doctors ({myDoctors.length})</TabsTrigger>
            <TabsTrigger value="all-doctors">All Doctors</TabsTrigger>
            <TabsTrigger value="specialists">Specialists</TabsTrigger>
          </TabsList>

          <TabsContent value="my-doctors" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="mt-1 h-4 w-24" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-2 h-4 w-3/4" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </>
              ) : myDoctors.length === 0 ? (
                <div className="col-span-full flex h-40 flex-col items-center justify-center space-y-3">
                  <User className="h-10 w-10 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">You don't have any assigned doctors yet.</p>
                </div>
              ) : (
                <>
                  {myDoctors.map((doctor) => (
                    <Card key={doctor.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${doctor.initials}`} />
                            <AvatarFallback>{doctor.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{doctor.name}</CardTitle>
                            <CardDescription>{doctor.specialty}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{doctor.location}</span>
                          </div>
                          {doctor.lastVisit && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Last visit: {doctor.lastVisit}</span>
                            </div>
                          )}
                          {doctor.nextAppointment && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Next appointment: {doctor.nextAppointment}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleMessageDoctor(doctor)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => initiateVideoCall(doctor)}>
                          <Video className="mr-2 h-4 w-4" />
                          Video Call
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all-doctors" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="mt-1 h-4 w-24" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-2 h-4 w-3/4" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </>
              ) : filteredDoctors.length === 0 ? (
                <div className="col-span-full flex h-40 flex-col items-center justify-center space-y-3">
                  <User className="h-10 w-10 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">No doctors found matching your search.</p>
                </div>
              ) : (
                <>
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${doctor.initials}`} />
                            <AvatarFallback>{doctor.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{doctor.name}</CardTitle>
                            <CardDescription>{doctor.specialty}</CardDescription>
                          </div>
                          {doctor.isMyDoctor && (
                            <Badge className="ml-auto bg-emerald-500 hover:bg-emerald-600">My Doctor</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span>
                              {doctor.rating} • {doctor.experience} years experience
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDoctor(doctor)}>
                          View Profile
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <Link href="/dashboard/appointments">
                            <Calendar className="mr-2 h-4 w-4" />
                            Book
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="specialists" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="mt-1 h-4 w-24" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-2 h-4 w-3/4" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  {filteredDoctors
                    .filter(
                      (doctor) => doctor.specialty !== "General Practitioner" && !doctor.specialty.includes("General"),
                    )
                    .map((doctor) => (
                      <Card key={doctor.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${doctor.initials}`} />
                              <AvatarFallback>{doctor.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{doctor.name}</CardTitle>
                              <CardDescription>{doctor.specialty}</CardDescription>
                            </div>
                            {doctor.isMyDoctor && (
                              <Badge className="ml-auto bg-emerald-500 hover:bg-emerald-600">My Doctor</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{doctor.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-amber-500" />
                              <span>
                                {doctor.rating} • {doctor.experience} years experience
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewDoctor(doctor)}
                          >
                            View Profile
                          </Button>
                          <Button size="sm" className="flex-1" asChild>
                            <Link href="/dashboard/appointments">
                              <Calendar className="mr-2 h-4 w-4" />
                              Book
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="specialists" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="mt-1 h-4 w-24" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-2 h-4 w-3/4" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  {filteredDoctors
                    .filter(
                      (doctor) => doctor.specialty !== "General Practitioner" && !doctor.specialty.includes("General"),
                    )
                    .map((doctor) => (
                      <Card key={doctor.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${doctor.initials}`} />
                              <AvatarFallback>{doctor.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{doctor.name}</CardTitle>
                              <CardDescription>{doctor.specialty}</CardDescription>
                            </div>
                            {doctor.isMyDoctor && (
                              <Badge className="ml-auto bg-emerald-500 hover:bg-emerald-600">My Doctor</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{doctor.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-amber-500" />
                              <span>
                                {doctor.rating} • {doctor.experience} years experience
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewDoctor(doctor)}
                          >
                            View Profile
                          </Button>
                          <Button size="sm" className="flex-1" asChild>
                            <Link href="/dashboard/appointments">
                              <Calendar className="mr-2 h-4 w-4" />
                              Book
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

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
      </main>
    </div>
  )
}
