"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Video, Clock, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { format, isSameDay, addDays, addHours, addMinutes } from "date-fns"

// Generate telehealth sessions
const generateSessions = () => {
  const patientNames = ["Tendai Moyo", "Chipo Ncube", "Tatenda Dube", "Farai Sibanda", "Nyasha Mpofu"]
  const sessionTypes = ["Initial Consultation", "Follow-up", "Urgent Care", "Prescription Renewal", "Test Results"]

  const now = new Date()
  const sessions = []

  // Today's sessions
  for (let i = 0; i < 3; i++) {
    const sessionTime = addHours(addMinutes(now, Math.floor(Math.random() * 300)), i)
    sessions.push({
      id: i + 1,
      patient: patientNames[Math.floor(Math.random() * patientNames.length)],
      type: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
      date: sessionTime,
      status: sessionTime > now ? "Scheduled" : "Completed",
      duration: 30,
      notes: "Patient reported symptoms of fever and fatigue.",
      initials: patientNames[Math.floor(Math.random() * patientNames.length)]
        .split(" ")
        .map((n) => n[0])
        .join(""),
    })
  }

  // Upcoming sessions (next 7 days)
  for (let i = 1; i <= 7; i++) {
    const sessionsPerDay = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < sessionsPerDay; j++) {
      const sessionTime = addHours(addDays(now, i), 9 + j * 2)
      sessions.push({
        id: sessions.length + 1,
        patient: patientNames[Math.floor(Math.random() * patientNames.length)],
        type: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
        date: sessionTime,
        status: "Scheduled",
        duration: 30,
        notes: "",
        initials: patientNames[Math.floor(Math.random() * patientNames.length)]
          .split(" ")
          .map((n) => n[0])
          .join(""),
      })
    }
  }

  // Past sessions
  for (let i = 1; i <= 10; i++) {
    const sessionTime = addHours(addDays(now, -i), 9 + Math.floor(Math.random() * 8))
    sessions.push({
      id: sessions.length + 1,
      patient: patientNames[Math.floor(Math.random() * patientNames.length)],
      type: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
      date: sessionTime,
      status: "Completed",
      duration: 30,
      notes: "Follow-up scheduled in 2 weeks.",
      initials: patientNames[Math.floor(Math.random() * patientNames.length)]
        .split(" ")
        .map((n) => n[0])
        .join(""),
    })
  }

  return sessions
}

export default function TelehealthPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setSessions(generateSessions())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter sessions based on selected date and status
  const todaySessions = sessions.filter(
    (session) => isSameDay(session.date, new Date()) && session.status === "Scheduled",
  )

  const upcomingSessions = sessions.filter(
    (session) => session.date > new Date() && !isSameDay(session.date, new Date()),
  )

  const pastSessions = sessions.filter((session) => session.status === "Completed")

  const selectedDateSessions = selectedDate ? sessions.filter((session) => isSameDay(session.date, selectedDate)) : []

  // Function to get session dates for calendar highlighting
  const getSessionDates = () => {
    return sessions.map((session) => session.date)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Telehealth Management</h2>
            <p className="text-muted-foreground">Schedule and manage virtual consultations with patients</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/telehealth/schedule">
              <Plus className="mr-2 h-4 w-4" />
              New Consultation
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Telehealth Sessions</CardTitle>
              <CardDescription>View and manage upcoming and past telehealth consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="today" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="today">Today ({todaySessions.length})</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming ({upcomingSessions.length})</TabsTrigger>
                  <TabsTrigger value="past">Past Sessions</TabsTrigger>
                  <TabsTrigger value="date">By Date</TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="space-y-4">
                  {loading ? (
                    <div className="flex h-40 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : todaySessions.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center space-y-3">
                      <Video className="h-10 w-10 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">No telehealth sessions scheduled for today.</p>
                      <Button asChild variant="outline">
                        <Link href="/dashboard/telehealth/schedule">Schedule a Session</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todaySessions.map((session) => (
                        <Card key={session.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${session.initials}`} />
                                <AvatarFallback>{session.initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">{session.patient}</h4>
                                <p className="text-sm text-muted-foreground">{session.type}</p>
                              </div>
                              <Badge className="bg-green-500 hover:bg-green-600">Today</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 md:w-1/3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {format(session.date, "h:mm a")} ({session.duration} min)
                                </span>
                              </div>
                              <Button asChild>
                                <Link href="/dashboard/telehealth/join">
                                  <Video className="mr-2 h-4 w-4" />
                                  Join
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                  {loading ? (
                    <div className="flex h-40 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : upcomingSessions.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center space-y-3">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">No upcoming telehealth sessions scheduled.</p>
                      <Button asChild variant="outline">
                        <Link href="/dashboard/telehealth/schedule">Schedule a Session</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingSessions.slice(0, 5).map((session) => (
                        <Card key={session.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${session.initials}`} />
                                <AvatarFallback>{session.initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">{session.patient}</h4>
                                <p className="text-sm text-muted-foreground">{session.type}</p>
                              </div>
                              <Badge variant="outline">{format(session.date, "MMM d")}</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 md:w-1/3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {format(session.date, "h:mm a")} ({session.duration} min)
                                </span>
                              </div>
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                  {loading ? (
                    <div className="flex h-40 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : pastSessions.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center space-y-3">
                      <Video className="h-10 w-10 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">No past telehealth sessions found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastSessions.slice(0, 5).map((session) => (
                        <Card key={session.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${session.initials}`} />
                                <AvatarFallback>{session.initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">{session.patient}</h4>
                                <p className="text-sm text-muted-foreground">{session.type}</p>
                              </div>
                              <Badge variant="secondary">{format(session.date, "MMM d")}</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 md:w-1/3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{format(session.date, "h:mm a")}</span>
                              </div>
                              <Button variant="outline" size="sm">
                                View Record
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
                      <h3 className="text-lg font-medium">Sessions for {format(selectedDate, "MMMM d, yyyy")}</h3>

                      {selectedDateSessions.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center space-y-3">
                          <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                          <p className="text-center text-muted-foreground">No sessions scheduled for this date.</p>
                          <Button asChild variant="outline">
                            <Link href="/dashboard/telehealth/schedule">Schedule a Session</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedDateSessions.map((session) => (
                            <Card key={session.id} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${session.initials}`} />
                                    <AvatarFallback>{session.initials}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{session.patient}</h4>
                                    <p className="text-sm text-muted-foreground">{session.type}</p>
                                  </div>
                                  <Badge
                                    variant={session.status === "Completed" ? "secondary" : "default"}
                                    className={session.status === "Scheduled" ? "bg-green-500 hover:bg-green-600" : ""}
                                  >
                                    {session.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 md:w-1/3">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {format(session.date, "h:mm a")} ({session.duration} min)
                                    </span>
                                  </div>
                                  {session.status === "Scheduled" && isSameDay(session.date, new Date()) ? (
                                    <Button asChild size="sm">
                                      <Link href="/dashboard/telehealth/join">Join</Link>
                                    </Button>
                                  ) : (
                                    <Button variant="outline" size="sm">
                                      {session.status === "Completed" ? "View Record" : "Details"}
                                    </Button>
                                  )}
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
              <CardDescription>Select a date to view scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  booked: getSessionDates(),
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
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/dashboard/telehealth/schedule">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule New Session
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/dashboard/telehealth/join">
                      <Video className="mr-2 h-4 w-4" />
                      Join Active Session
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
