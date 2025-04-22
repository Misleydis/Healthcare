import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Video, Brain, Bell } from "lucide-react"
import Link from "next/link"
import HealthMetricsChart from "@/components/health-metrics-chart"
import RecentPatients from "@/components/recent-patients"
import UpcomingAppointments from "@/components/upcoming-appointments"
import AIRecommendations from "@/components/ai-recommendations"
import { DashboardHeader } from "@/components/dashboard-header"

export default function Dashboard() {
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

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="telehealth">Telehealth</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,284</div>
                  <p className="text-xs text-muted-foreground">+24% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Telehealth Sessions</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">432</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">892</div>
                  <p className="text-xs text-muted-foreground">+42% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">56</div>
                  <p className="text-xs text-muted-foreground">For the next 7 days</p>
                </CardContent>
              </Card>
            </div>

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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>Newly registered patients in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentPatients />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Upcoming Telehealth Sessions</CardTitle>
                  <CardDescription>Scheduled virtual consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingAppointments />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Register new patients and manage existing records</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <Button asChild>
                    <Link href="/register">Register New Patient</Link>
                  </Button>
                  <Button variant="outline">Import Patient Records</Button>
                </div>
                <p>
                  Access the patient registration system to add new patients to the database or manage existing patient
                  records.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="telehealth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Telehealth Services</CardTitle>
                <CardDescription>Schedule and conduct virtual consultations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <Button asChild>
                    <Link href="/telehealth/schedule">Schedule Consultation</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/telehealth/join">Join Consultation</Link>
                  </Button>
                </div>
                <p>Connect rural patients with healthcare professionals through secure video consultations.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Analytics</CardTitle>
                <CardDescription>ML-powered insights and population health trends</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  View analytics on patient health trends and ML-generated insights for rural Zimbabwe.
                </p>
                <Button>Generate Health Report</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
