"use client"

import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentPatients } from "@/components/recent-patients"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import AIRecommendations from "@/components/ai-recommendations"
import useAuthStore from "@/lib/auth-store"

export default function DashboardPage() {
  const { userData: user } = useAuthStore()
  const isDoctor = user?.role === "doctor"
  const isAdmin = user?.role === "admin"

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled={!isDoctor && !isAdmin}>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled={!isDoctor && !isAdmin}>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
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
                <CardTitle className="text-sm font-medium">
                  {isDoctor ? "Upcoming Appointments" : "Scheduled Appointments"}
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isDoctor ? "12" : "2"}</div>
                <p className="text-xs text-muted-foreground">{isDoctor ? "For today" : "Upcoming appointments"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isDoctor ? "Patient Satisfaction" : "Health Score"}
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isDoctor ? "98%" : "87%"}</div>
                <p className="text-xs text-muted-foreground">
                  {isDoctor ? "Based on reviews" : "Based on your health records"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isDoctor ? "Completed Consultations" : "Completed Checkups"}
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isDoctor ? "435" : "7"}</div>
                <p className="text-xs text-muted-foreground">
                  {isDoctor ? "+20.1% from last month" : "In the last 12 months"}
                </p>
              </CardContent>
            </Card>
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
                <CardTitle>{isDoctor ? "Recent Patients" : "Your Doctors"}</CardTitle>
                <CardDescription>
                  {isDoctor ? "You have seen 12 patients this week" : "Your healthcare providers"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPatients isPatientView={!isDoctor} />
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
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Age and gender distribution of your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Demographics chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Consultation Types</CardTitle>
                <CardDescription>Distribution of in-person vs telehealth consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Consultation chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Patient Satisfaction Trends</CardTitle>
                <CardDescription>Monthly satisfaction scores based on patient feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Satisfaction trend chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Common Diagnoses</CardTitle>
                <CardDescription>Most frequent diagnoses in the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Diagnoses chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monthly Patient Report</CardTitle>
                <CardDescription>Summary of patient visits and outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[100px] w-full bg-muted rounded-md flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">Report preview</p>
                </div>
                <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                  Download PDF
                </button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Prescription Analytics</CardTitle>
                <CardDescription>Analysis of prescription patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[100px] w-full bg-muted rounded-md flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">Report preview</p>
                </div>
                <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                  Download PDF
                </button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Revenue and expense breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[100px] w-full bg-muted rounded-md flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">Report preview</p>
                </div>
                <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                  Download PDF
                </button>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Generator</CardTitle>
              <CardDescription>Create customized reports based on specific parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
                    Report Type
                  </label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Patient Demographics</option>
                    <option>Clinical Outcomes</option>
                    <option>Financial Performance</option>
                    <option>Staff Productivity</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
                    Date Range
                  </label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last 12 months</option>
                    <option>Custom range</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
                    Format
                  </label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                    <option>Interactive Dashboard</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                    Generate Report
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Stay updated with important information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/20 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-primary"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Appointment Reminder</h3>
                    <p className="text-sm text-muted-foreground">
                      {isDoctor
                        ? "You have a consultation with Jane Smith tomorrow at 10:00 AM"
                        : "You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2">
                        Reschedule
                      </button>
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2">
                        {isDoctor ? "View Patient" : "View Details"}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-blue-500/20 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-blue-500"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                      <path d="m9 16 2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{isDoctor ? "Lab Results Available" : "Test Results Ready"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {isDoctor
                        ? "New lab results are available for patient John Doe"
                        : "Your recent blood test results are now available"}
                    </p>
                    <div className="mt-2">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 py-2">
                        View Results
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Yesterday</div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-green-500/20 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-green-500"
                    >
                      <path d="M2.5 19.5A2.5 2.5 0 0 1 5 17H19a2.5 2.5 0 0 1 0 5H5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      <path d="M2.5 7.5A2.5 2.5 0 0 1 5 5h14a2.5 2.5 0 0 1 0 5H5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      <path d="M2.5 13.5A2.5 2.5 0 0 1 5 11h14a2.5 2.5 0 0 1 0 5H5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{isDoctor ? "System Update" : "Health Tips"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {isDoctor
                        ? "The clinical system will be updated tonight at 2 AM. Expect 30 minutes of downtime."
                        : "5 essential tips for maintaining heart health"}
                    </p>
                    <div className="mt-2">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2">
                        {isDoctor ? "Learn More" : "Read Article"}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">2 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
