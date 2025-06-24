"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Video, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoCallPopup } from "@/components/video-call-popup"
import useAuthStore from "@/lib/auth-store"

export default function TelehealthPage() {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState({
    name: "Sarah Johnson",
    specialty: "Cardiologist",
    image: "/placeholder.svg?height=40&width=40",
  })
  const router = useRouter()
  const { userData } = useAuthStore()
  const isPatient = userData?.role === "patient"

  // Check if user is new (created within last 24 hours)
  const isNewUser = !userData?.createdAt || new Date(userData.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)

  const upcomingAppointments = isNewUser ? [] : [
    {
      id: "1",
      doctorName: "Sarah Johnson",
      specialty: "Cardiologist",
      date: "Today",
      time: "2:00 PM",
      type: "Video",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      doctorName: "Michael Chen",
      specialty: "Dermatologist",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "Video",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      doctorName: "Emily Rodriguez",
      specialty: "Neurologist",
      date: "May 15, 2023",
      time: "3:15 PM",
      type: "Video",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  const patientAppointments = isPatient
    ? upcomingAppointments
    : isNewUser ? [] : [
        {
          id: "1",
          patientName: "John Smith",
          reason: "Follow-up consultation",
          date: "Today",
          time: "2:00 PM",
          type: "Video",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "2",
          patientName: "Maria Garcia",
          reason: "Initial consultation",
          date: "Tomorrow",
          time: "10:30 AM",
          type: "Video",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "3",
          patientName: "Robert Johnson",
          reason: "Test results review",
          date: "May 15, 2023",
          time: "3:15 PM",
          type: "Video",
          image: "/placeholder.svg?height=40&width=40",
        },
      ]

  const handleJoinCall = (appointment: any) => {
    if (isPatient) {
      setSelectedDoctor({
        name: appointment.doctorName,
        specialty: appointment.specialty,
        image: appointment.image,
      })
    } else {
      setSelectedDoctor({
        name: appointment.patientName,
        specialty: "Patient",
        image: appointment.image,
      })
    }
    setIsVideoCallOpen(true)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Telehealth</h1>
        <Button onClick={() => router.push("/telehealth/schedule")}>
          <Plus className="mr-2 h-4 w-4" /> Schedule Consultation
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          {!isPatient && <TabsTrigger value="availability">My Availability</TabsTrigger>}
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {patientAppointments.length === 0 ? (
            <div className="mt-6 rounded-lg border p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No upcoming consultations</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isNewUser 
                  ? "Welcome! You don't have any telehealth consultations scheduled yet. Click the button above to schedule your first consultation."
                  : "You don't have any upcoming telehealth consultations. Click the button above to schedule a new consultation."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {patientAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {isPatient ? `Dr. ${appointment.doctorName}` : appointment.patientName}
                    </CardTitle>
                    <CardDescription>{isPatient ? appointment.specialty : appointment.reason}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="mt-2 flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="mt-2 flex items-center space-x-2 text-sm">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.type} Consultation</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3">
                    <Button variant="default" className="w-full" onClick={() => handleJoinCall(appointment)}>
                      Join Call
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="past">
          <div className="mt-6 rounded-lg border p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No past consultations</h3>
            <p className="mt-2 text-sm text-muted-foreground">You haven't had any telehealth consultations yet.</p>
          </div>
        </TabsContent>
        {!isPatient && (
          <TabsContent value="availability">
            <div className="mt-6 rounded-lg border p-8">
              <h3 className="text-lg font-semibold">Your Availability Schedule</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Set your available hours for telehealth consultations.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Monday</h4>
                  <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit
                  </Button>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Tuesday</h4>
                  <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit
                  </Button>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Wednesday</h4>
                  <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit
                  </Button>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Thursday</h4>
                  <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit
                  </Button>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Friday</h4>
                  <p className="text-sm text-muted-foreground">9:00 AM - 3:00 PM</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {isVideoCallOpen && (
        <VideoCallPopup
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
          doctorName={selectedDoctor.name}
          doctorSpecialty={selectedDoctor.specialty}
          doctorImage={selectedDoctor.image}
        />
      )}
    </div>
  )
}
