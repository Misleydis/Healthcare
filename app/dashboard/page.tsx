"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Activity, Calendar, Clock, FileText, MessageSquare, User, Video } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { user } = useAuth()
  const [healthData, setHealthData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch("/api/health-data")
        const data = await response.json()

        if (data.success) {
          setHealthData(data.data)
        }
      } catch (error) {
        console.error("Error fetching health data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthData()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name || "User"}</h1>
          <p className="text-muted-foreground">Here's an overview of your health</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/assessment">Health Assessment</Link>
          </Button>
          <Button asChild>
            <Link href="/telemedicine">Book Consultation</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="animate-in fade-in slide-up hover-lift transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData?.appointments?.length > 0 ? (
                healthData.appointments.map((appointment: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {appointment.type.includes("Video") ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <Calendar className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      <p className="text-sm font-medium mt-1">
                        {formatDate(appointment.date)}, {appointment.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No upcoming appointments</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/appointments">View All Appointments</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card
          className="animate-in fade-in slide-up hover-lift transition-all duration-300"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Medication Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData?.medications?.length > 0 ? (
                healthData.medications.map((medication: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {medication.dosage}, {medication.frequency}
                        </p>
                      </div>
                    </div>
                    <Badge>{index === 0 ? "8:00 AM" : "Taken"}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No medications</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/medications">Manage Medications</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card
          className="animate-in fade-in slide-up hover-lift transition-all duration-300"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Health Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData?.bloodPressure?.length > 0 && (
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Blood Pressure</p>
                    <p className="text-sm text-muted-foreground">
                      {healthData.bloodPressure[0].systolic > 120 ? "Slightly elevated" : "Normal"}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {healthData.bloodPressure[0].systolic}/{healthData.bloodPressure[0].diastolic} mmHg
                    </p>
                  </div>
                </div>
              )}

              {healthData?.bloodGlucose?.length > 0 && (
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Blood Glucose</p>
                    <p className="text-sm text-muted-foreground">
                      {healthData.bloodGlucose[0].level > 115 ? "Slightly elevated" : "Within normal range"}
                    </p>
                    <p className="text-sm font-medium mt-1">{healthData.bloodGlucose[0].level} mg/dL</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/monitoring">View Health Trends</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="health-records" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="health-records">Health Records</TabsTrigger>
          <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="health-records">
          <Card>
            <CardHeader>
              <CardTitle>Your Health Records</CardTitle>
              <CardDescription>View and manage your medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Annual Physical Examination</p>
                      <p className="text-sm text-muted-foreground">Dr. Sarah Moyo • March 15, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Blood Test Results</p>
                      <p className="text-sm text-muted-foreground">Harare Medical Lab • February 28, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Diabetes Checkup</p>
                      <p className="text-sm text-muted-foreground">Dr. James Ndlovu • January 10, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/health-records">View All Records</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="treatment-plans">
          <Card>
            <CardHeader>
              <CardTitle>Your Treatment Plans</CardTitle>
              <CardDescription>View and follow your prescribed treatment plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Diabetes Management Plan</h3>
                    <Badge>Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Prescribed by Dr. James Ndlovu on January 10, 2025
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Medications:</span> Metformin 500mg twice daily
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Diet:</span> Low carbohydrate diet, limit sugar intake
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Exercise:</span> 30 minutes of walking daily
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Monitoring:</span> Check blood glucose levels twice daily
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button size="sm">View Details</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Hypertension Management</h3>
                    <Badge>Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Prescribed by Dr. Sarah Moyo on March 15, 2025</p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Medications:</span> Lisinopril 10mg once daily
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Diet:</span> Low sodium diet, increase potassium intake
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Exercise:</span> 45 minutes of moderate activity 5 days a week
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Monitoring:</span> Check blood pressure daily
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/treatment-plans">View All Plans</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with your healthcare providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Dr. Sarah Moyo</p>
                      <p className="text-sm text-muted-foreground">Follow-up on your blood pressure readings</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday, 2:45 PM</p>
                    </div>
                  </div>
                  <Badge variant="outline">Unread</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Dr. James Ndlovu</p>
                      <p className="text-sm text-muted-foreground">Your recent lab results are available</p>
                      <p className="text-xs text-muted-foreground mt-1">March 20, 2025</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Read</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Pharmacy Notification</p>
                      <p className="text-sm text-muted-foreground">Your prescription is ready for pickup</p>
                      <p className="text-xs text-muted-foreground mt-1">March 18, 2025</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Read</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/messages">View All Messages</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow"
  } else {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div>
        <Skeleton className="h-10 w-full mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

