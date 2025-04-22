"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  Download,
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Video,
  Pill,
  Brain,
  Map,
  Clock,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Generate analytics data
const generateAnalyticsData = () => {
  return {
    patientMetrics: {
      totalPatients: 1284,
      newPatients: 124,
      activePatients: 876,
      inactivePatients: 408,
      growthRate: 24,
    },
    telehealthMetrics: {
      totalSessions: 432,
      completedSessions: 398,
      canceledSessions: 34,
      averageDuration: 28,
      growthRate: 18,
    },
    treatmentMetrics: {
      totalTreatments: 892,
      successfulTreatments: 754,
      ongoingTreatments: 138,
      averageRecoveryDays: 12,
      effectivenessRate: 84,
    },
    mlMetrics: {
      totalRecommendations: 1156,
      implementedRecommendations: 876,
      pendingRecommendations: 280,
      accuracyRate: 92,
      impactScore: 78,
    },
    patientTrends: [
      { month: "Jan", patients: 980, newRegistrations: 85 },
      { month: "Feb", patients: 1020, newRegistrations: 92 },
      { month: "Mar", patients: 1080, newRegistrations: 105 },
      { month: "Apr", patients: 1150, newRegistrations: 118 },
      { month: "May", patients: 1210, newRegistrations: 110 },
      { month: "Jun", patients: 1284, newRegistrations: 124 },
    ],
    telehealthTrends: [
      { month: "Jan", sessions: 310, duration: 25 },
      { month: "Feb", sessions: 340, duration: 26 },
      { month: "Mar", sessions: 360, duration: 27 },
      { month: "Apr", sessions: 390, duration: 27 },
      { month: "May", sessions: 410, duration: 28 },
      { month: "Jun", sessions: 432, duration: 28 },
    ],
    diseaseDistribution: [
      { name: "Malaria", value: 35 },
      { name: "Hypertension", value: 25 },
      { name: "Diabetes", value: 15 },
      { name: "Respiratory", value: 12 },
      { name: "HIV/AIDS", value: 8 },
      { name: "Other", value: 5 },
    ],
    regionalData: [
      { region: "Bulawayo", patients: 320, sessions: 110, treatments: 215 },
      { region: "Harare", patients: 420, sessions: 145, treatments: 280 },
      { region: "Mutare", patients: 180, sessions: 65, treatments: 120 },
      { region: "Gweru", patients: 150, sessions: 45, treatments: 95 },
      { region: "Masvingo", patients: 110, sessions: 35, treatments: 85 },
      { region: "Chinhoyi", patients: 104, sessions: 32, treatments: 97 },
    ],
  }
}

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("6m")
  const [refreshing, setRefreshing] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAnalytics(generateAnalyticsData())
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)

    // Simulate refreshing data
    setTimeout(() => {
      setAnalytics(generateAnalyticsData())
      setRefreshing(false)

      toast({
        title: "Analytics refreshed",
        description: "The latest analytics data has been loaded.",
      })
    }, 2000)
  }

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
    setLoading(true)

    // Simulate loading data for different time ranges
    setTimeout(() => {
      setAnalytics(generateAnalyticsData())
      setLoading(false)

      toast({
        title: "Time range updated",
        description: `Analytics data updated for ${
          value === "1m"
            ? "last month"
            : value === "3m"
              ? "last 3 months"
              : value === "6m"
                ? "last 6 months"
                : "last year"
        }.`,
      })
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Comprehensive health system analytics and metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={loading ? "animate-pulse" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : analytics?.patientMetrics.totalPatients}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {!loading && (
                  <>
                    <TrendingUp className="mr-1 h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">{analytics?.patientMetrics.growthRate}%</span>
                    <span className="ml-1">from last period</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={loading ? "animate-pulse" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Telehealth Sessions</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : analytics?.telehealthMetrics.totalSessions}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {!loading && (
                  <>
                    <TrendingUp className="mr-1 h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">{analytics?.telehealthMetrics.growthRate}%</span>
                    <span className="ml-1">from last period</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={loading ? "animate-pulse" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treatment Success Rate</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : `${analytics?.treatmentMetrics.effectivenessRate}%`}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {!loading && (
                  <>
                    <TrendingUp className="mr-1 h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">2.5%</span>
                    <span className="ml-1">improvement</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={loading ? "animate-pulse" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ML Accuracy</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : `${analytics?.mlMetrics.accuracyRate}%`}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {!loading && (
                  <>
                    <TrendingUp className="mr-1 h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">3.2%</span>
                    <span className="ml-1">improvement</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patient Analytics</TabsTrigger>
            <TabsTrigger value="telehealth">Telehealth Analytics</TabsTrigger>
            <TabsTrigger value="regional">Regional Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Growth Trend</CardTitle>
                  <CardDescription>Total patients and new registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.patientTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="patients" stroke="#3b82f6" name="Total Patients" />
                          <Line type="monotone" dataKey="newRegistrations" stroke="#10b981" name="New Registrations" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disease Distribution</CardTitle>
                  <CardDescription>Breakdown of conditions across patient population</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.diseaseDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {analytics.diseaseDistribution.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                  <CardDescription>Patient metrics across different regions</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="region" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="patients" fill="#3b82f6" name="Patients" />
                          <Bar dataKey="sessions" fill="#10b981" name="Telehealth Sessions" />
                          <Bar dataKey="treatments" fill="#f59e0b" name="Treatments" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{analytics.patientMetrics.totalPatients}</div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{analytics.patientMetrics.newPatients}</div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{analytics.patientMetrics.activePatients}</div>
                      <Activity className="h-8 w-8 text-blue-500" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Inactive Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{analytics.patientMetrics.inactivePatients}</div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Demographics</CardTitle>
                  <CardDescription>Age and gender distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Users className="h-16 w-16 text-muted-foreground" />
                      <p className="ml-4 text-muted-foreground">Demographic visualization</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patient Retention</CardTitle>
                  <CardDescription>Patient retention rates over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Activity className="h-16 w-16 text-muted-foreground" />
                      <p className="ml-4 text-muted-foreground">Retention visualization</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="telehealth" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{analytics.telehealthMetrics.totalSessions}</div>
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{analytics.telehealthMetrics.completedSessions}</div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Canceled Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{analytics.telehealthMetrics.canceledSessions}</div>
                      <TrendingDown className="h-8 w-8 text-red-500" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Duration (min)</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{analytics.telehealthMetrics.averageDuration}</div>
                      <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Telehealth Session Trends</CardTitle>
                  <CardDescription>Number of sessions and average duration</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analytics.telehealthTrends}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#3b82f6" name="Sessions" />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="duration"
                            stroke="#10b981"
                            name="Avg Duration (min)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Outcomes</CardTitle>
                  <CardDescription>Results and effectiveness of telehealth consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Resolved", value: 65 },
                              { name: "Follow-up Required", value: 25 },
                              { name: "Referred", value: 10 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#3b82f6" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Regional Health Map</CardTitle>
                <CardDescription>Geographic distribution of health metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center">
                    <Map className="h-16 w-16 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Interactive regional health map</p>
                    <Button variant="outline" className="mt-4">
                      <Map className="mr-2 h-4 w-4" />
                      Generate Regional Map
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Patient Distribution</CardTitle>
                  <CardDescription>Patient counts across different regions</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="region" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="patients" fill="#3b82f6" name="Patients" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Disease Prevalence</CardTitle>
                  <CardDescription>Top diseases by region</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={[
                            { region: "Bulawayo", malaria: 45, diabetes: 25, hypertension: 30 },
                            { region: "Harare", malaria: 30, diabetes: 35, hypertension: 35 },
                            { region: "Mutare", malaria: 55, diabetes: 20, hypertension: 25 },
                            { region: "Gweru", malaria: 40, diabetes: 30, hypertension: 30 },
                            { region: "Masvingo", malaria: 60, diabetes: 15, hypertension: 25 },
                          ]}
                          margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="region" type="category" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="malaria" stackId="a" fill="#ef4444" name="Malaria" />
                          <Bar dataKey="diabetes" stackId="a" fill="#3b82f6" name="Diabetes" />
                          <Bar dataKey="hypertension" stackId="a" fill="#f59e0b" name="Hypertension" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
