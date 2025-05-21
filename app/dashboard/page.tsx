"use client"

import { Suspense } from 'react';

import {
  Calendar,
  FileText,
  Pill,
  Users,
} from 'lucide-react';

import AIRecommendations from '@/components/ai-recommendations';
import { Overview } from '@/components/overview';
import { RecentPatients } from '@/components/recent-patients';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { UpcomingAppointments } from '@/components/upcoming-appointments';
import useAuthStore from '@/lib/auth-store';

export default function DashboardPage() {
  const { userData: user } = useAuthStore()
  const isDoctor = user?.role === "doctor"
  const isAdmin = user?.role === "admin"
  const isNurse = user?.role === "nurse"
  const isPatient = user?.role === "patient"

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {(isDoctor || isAdmin) && (
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          )}
          {(isDoctor || isAdmin) && (
            <TabsTrigger value="reports">Reports</TabsTrigger>
          )}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isPatient ? (
              // Patient-specific cards
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">Next appointment in 3 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                    <Pill className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">2 prescriptions need renewal</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">My Doctors</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">Primary care and specialist</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Health Records</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Last updated 2 days ago</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Healthcare provider cards
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isDoctor ? "124" : "3"}</div>
                    <p className="text-xs text-muted-foreground">
                      {isDoctor ? "+14% from last month" : "Your registered patients"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">3 pending confirmations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                    <Pill className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">4 need renewal</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">2 urgent</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{isPatient ? "My Healthcare Team" : "Recent Patients"}</CardTitle>
                <CardDescription>
                  {isPatient ? "Your healthcare providers" : "You have seen 12 patients this week"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPatients isPatientView={isPatient} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  {isDoctor ? "You have 12 appointments scheduled" : "You have 2 upcoming appointments"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingAppointments isPatientView={!isDoctor} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  {isDoctor ? "ML-powered insights for your practice" : "Personalized health recommendations"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading recommendations...</div>}>
                  <AIRecommendations extended={isDoctor} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {(isDoctor || isAdmin) && (
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>View detailed analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Analytics content */}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {(isDoctor || isAdmin) && (
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generate and view reports</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Reports content */}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>View your recent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Notifications content */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
