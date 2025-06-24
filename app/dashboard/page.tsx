"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Plus, User, Video, Activity, Pill, Brain, FileText, Users, Stethoscope } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import useAuthStore from "@/lib/auth-store"
import { useDataStore } from "@/lib/data-store"
import { useToast } from "@/components/ui/use-toast"

// Lazy load heavy components with proper dynamic imports
const Overview = lazy(() => import("@/components/overview").then(mod => ({ default: mod.Overview })))
const AIRecommendations = lazy(() => import("@/components/ai-recommendations"))
const HealthMetricsChart = lazy(() => import("@/components/health-metrics-chart"))

// Loading component for lazy-loaded components
const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-[200px] w-full" />
    <Skeleton className="h-[100px] w-full" />
  </div>
)

export default function DashboardPage() {
  const { userData } = useAuthStore()
  const isPatient = userData?.role === "patient"
  const isDoctor = userData?.role === "doctor"
  const isNurse = userData?.role === "nurse"
  const isAdmin = userData?.role === "admin"
  const userId = userData?.id || ""
  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : "User"

  const { appointments, doctors, patients, healthRecords, addAppointment } = useDataStore()

  // Memoize filtered data
  const userAppointments = appointments.filter((appointment) => {
    if (isPatient) {
      return appointment.patientId === userId
    } else if (isDoctor) {
      return appointment.doctorId === userId
    }
    return true // Admin and nurse can see all
  })

  const userDoctors = isPatient ? doctors.filter((doctor) => doctor.isMyDoctor) : doctors
  const userPatients = isDoctor ? patients.filter((patient) => patient.doctorId === userId) : patients
  const userHealthRecords = isPatient ? healthRecords.filter((record) => record.patientId === userId) : healthRecords

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  useEffect(() => {
    // Set loading to false after initial render
    setLoading(false)
  }, [])

  // Render dashboard cards
  const renderDashboardCards = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isPatient ? "My Appointments" : "Total Appointments"}
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <>
              <div className="text-2xl font-bold">{userAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {userAppointments.filter((a) => a.status === "Scheduled").length} upcoming
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{doctors.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across {Array.from(new Set(doctors.map(doctor => doctor.specialization))).length} specialties
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {isDoctor && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{userPatients.length}</div>
                <p className="text-xs text-muted-foreground">
                  {userPatients.length === 0 ? "No patients yet" : "Active patients"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active in the system
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isPatient ? "My Health Records" : "Total Records"}
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <>
              <div className="text-2xl font-bold">{userHealthRecords.length}</div>
              <p className="text-xs text-muted-foreground">
                {userHealthRecords.length === 0
                  ? "No health records"
                  : `Last updated: ${userHealthRecords.length > 0 ? format(new Date(), "MMM d, yyyy") : "N/A"}`}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isPatient ? "Prescriptions" : "AI Recommendations"}
          </CardTitle>
          {isPatient ? (
            <Pill className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Brain className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                {isPatient ? "No active prescriptions" : "No new recommendations"}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {isPatient && (
            <div className="flex items-center space-x-2">
              <Button onClick={() => setActiveTab("book")}>
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {!isPatient && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {renderDashboardCards()}
            
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Specialties Overview</CardTitle>
                  <CardDescription>Distribution of medical specialties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from(new Set(doctors.map(doctor => doctor.specialization))).map((specialty) => (
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
            )}
            
            <Suspense fallback={<LoadingFallback />}>
              <Overview />
            </Suspense>
          </TabsContent>

          {!isPatient && (
            <TabsContent value="analytics" className="space-y-4">
              <Suspense fallback={<LoadingFallback />}>
                <HealthMetricsChart />
              </Suspense>
            </TabsContent>
          )}

          <TabsContent value="ai-insights" className="space-y-4">
            <Suspense fallback={<LoadingFallback />}>
              <AIRecommendations />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
