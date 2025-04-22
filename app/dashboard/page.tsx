"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Video, Brain, Bell, Calendar } from "lucide-react"
import HealthMetricsChart from "@/components/health-metrics-chart"
import RecentPatients from "@/components/recent-patients"
import UpcomingAppointments from "@/components/upcoming-appointments"
import AIRecommendations from "@/components/ai-recommendations"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)

      // Show welcome toast
      toast({
        title: "Welcome back, Dr. Moyo",
        description: "You have 3 telehealth consultations scheduled for today.",
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [toast])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={isLoading ? "animate-pulse" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : "1,284"}</div>
              <p className="text-xs text-muted-foreground">{isLoading ? "" : "+24% from last month"}</p>
            </CardContent>
          </Card>

          <Card className={isLoading ? "animate-pulse" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Telehealth Sessions</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : "432"}</div>
              <p className="text-xs text-muted-foreground">{isLoading ? "" : "+18% from last month"}</p>
            </CardContent>
          </Card>

          <Card className={isLoading ? "animate-pulse" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : "892"}</div>
              <p className="text-xs text-muted-foreground">{isLoading ? "" : "+42% from last month"}</p>
            </CardContent>
          </Card>

          <Card className={isLoading ? "animate-pulse" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : "56"}</div>
              <p className="text-xs text-muted-foreground">{isLoading ? "" : "For the next 7 days"}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Recent Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="insights">ML Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Health Metrics Overview</CardTitle>
                  <CardDescription>Patient health trends across rural Zimbabwe</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <HealthMetricsChart />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>AI-Powered Recommendations</CardTitle>
                  <CardDescription>ML-generated insights based on patient data</CardDescription>
                </CardHeader>
                <CardContent>
                  <AIRecommendations />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Newly registered patients in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPatients />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Telehealth Sessions</CardTitle>
                <CardDescription>Scheduled virtual consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingAppointments />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>ML-Generated Health Insights</CardTitle>
                <CardDescription>AI analysis of patient data and regional health trends</CardDescription>
              </CardHeader>
              <CardContent>
                <AIRecommendations extended={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
