"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Pill,
  Activity,
  MapPin,
  BarChart3,
  RefreshCw,
  Download,
  Zap,
  Users,
  Thermometer,
  Droplets,
  Stethoscope,
} from "lucide-react"
import {
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

// Generate ML insights data
const generateInsights = () => {
  return {
    predictions: [
      {
        id: 1,
        title: "Malaria Outbreak Prediction",
        description: "High probability of malaria outbreak in Bulawayo region within the next 30 days.",
        confidence: 87,
        impact: "High",
        category: "Disease Outbreak",
        icon: AlertTriangle,
        iconColor: "text-red-500",
        action: "Initiate preventive measures",
        details:
          "Based on weather patterns, mosquito population data, and historical outbreak records, our ML model predicts an increased risk of malaria in the Bulawayo region. Recommend immediate preventive measures including distribution of mosquito nets and community education.",
      },
      {
        id: 2,
        title: "Diabetes Risk Assessment",
        description: "24% of patients over 40 show early signs of diabetes risk factors.",
        confidence: 82,
        impact: "Medium",
        category: "Chronic Disease",
        icon: TrendingUp,
        iconColor: "text-amber-500",
        action: "Schedule screening program",
        details:
          "Analysis of patient vitals, lab results, and demographic data indicates that 24% of patients over 40 years old exhibit multiple risk factors for Type 2 Diabetes. Early intervention could significantly reduce progression to full diabetes.",
      },
      {
        id: 3,
        title: "Medication Efficacy Analysis",
        description: "Current malaria treatment showing 15% lower efficacy compared to last year.",
        confidence: 79,
        impact: "Medium",
        category: "Treatment Efficacy",
        icon: Pill,
        iconColor: "text-blue-500",
        action: "Review treatment protocols",
        details:
          "ML analysis of patient outcomes shows the current first-line malaria treatment is becoming less effective, with recovery times increasing by 15% compared to the same period last year. This may indicate emerging resistance patterns.",
      },
      {
        id: 4,
        title: "Respiratory Infection Cluster",
        description: "Unusual cluster of respiratory infections detected in Masvingo province.",
        confidence: 76,
        impact: "High",
        category: "Disease Cluster",
        icon: Activity,
        iconColor: "text-red-500",
        action: "Investigate potential outbreak",
        details:
          "Pattern recognition algorithms have identified an unusual increase in respiratory symptoms reported in telehealth consultations from the Masvingo area. The symptom pattern does not match seasonal flu or COVID-19 profiles.",
      },
      {
        id: 5,
        title: "Prenatal Care Optimization",
        description: "Adjusted prenatal visit scheduling could improve outcomes by 18%.",
        confidence: 84,
        impact: "Medium",
        category: "Care Protocol",
        icon: MapPin,
        iconColor: "text-green-500",
        action: "Review prenatal care protocols",
        details:
          "ML analysis of maternal health outcomes indicates that adjusting the frequency of prenatal visits based on individual risk factors could improve birth outcomes by approximately 18% while reducing the total number of required visits.",
      },
    ],
    trends: {
      diseasePrevalence: [
        { name: "Malaria", value: 35 },
        { name: "Hypertension", value: 25 },
        { name: "Diabetes", value: 15 },
        { name: "Respiratory", value: 12 },
        { name: "HIV/AIDS", value: 8 },
        { name: "Other", value: 5 },
      ],
      treatmentOutcomes: [
        { month: "Jan", success: 78, failure: 22 },
        { month: "Feb", success: 82, failure: 18 },
        { month: "Mar", success: 79, failure: 21 },
        { month: "Apr", success: 85, failure: 15 },
        { month: "May", success: 88, failure: 12 },
        { month: "Jun", success: 84, failure: 16 },
      ],
      patientDemographics: [
        { age: "0-10", male: 120, female: 115 },
        { age: "11-20", male: 95, female: 105 },
        { age: "21-30", male: 85, female: 110 },
        { age: "31-40", male: 75, female: 90 },
        { age: "41-50", male: 65, female: 70 },
        { age: "51-60", male: 55, female: 60 },
        { age: "61+", male: 45, female: 50 },
      ],
    },
    riskScores: [
      {
        id: 1,
        condition: "Malaria",
        score: 78,
        trend: "increasing",
        factors: ["Recent rainfall", "Mosquito population", "Previous outbreaks"],
        icon: Thermometer,
      },
      {
        id: 2,
        condition: "Diabetes Type 2",
        score: 65,
        trend: "stable",
        factors: ["Dietary patterns", "Obesity rates", "Genetic factors"],
        icon: Droplets,
      },
      {
        id: 3,
        condition: "Hypertension",
        score: 72,
        trend: "decreasing",
        factors: ["Stress levels", "Diet", "Physical activity"],
        icon: Activity,
      },
      {
        id: 4,
        condition: "Respiratory Infections",
        score: 58,
        trend: "increasing",
        factors: ["Air quality", "Population density", "Vaccination rates"],
        icon: Stethoscope,
      },
    ],
  }
}

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function MLInsightsPage() {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeInsight, setActiveInsight] = useState<number | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setInsights(generateInsights())
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)

    // Simulate refreshing data
    setTimeout(() => {
      setInsights(generateInsights())
      setRefreshing(false)

      toast({
        title: "ML insights refreshed",
        description: "The latest machine learning insights have been loaded.",
      })
    }, 2000)
  }

  const toggleInsightDetails = (id: number) => {
    setActiveInsight(activeInsight === id ? null : id)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">ML Insights</h2>
            <p className="text-muted-foreground">AI-powered health insights and predictions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh Insights"}
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="predictions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="predictions">Predictions & Alerts</TabsTrigger>
            <TabsTrigger value="trends">Health Trends</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>ML-Generated Predictions</CardTitle>
                      <CardDescription>
                        AI-powered health predictions and recommendations based on patient data
                      </CardDescription>
                    </div>
                    <Brain className="h-6 w-6 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-5 w-[70%]" />
                          </div>
                          <Skeleton className="mb-4 h-4 w-full" />
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {insights.predictions.map((prediction: any) => {
                        const Icon = prediction.icon
                        const isActive = activeInsight === prediction.id

                        return (
                          <Card
                            key={prediction.id}
                            className={`rounded-lg border p-4 transition-all duration-200 ${isActive ? "ring-1 ring-emerald-500" : ""}`}
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <Brain className="h-5 w-5 text-emerald-500" />
                              <h3 className="font-medium">{prediction.title}</h3>
                            </div>
                            <p className="mb-3 text-sm text-muted-foreground">{prediction.description}</p>

                            {isActive && (
                              <div className="mb-3 rounded-md bg-muted p-3 text-sm">
                                <p>{prediction.details}</p>
                              </div>
                            )}

                            <div className="mb-3">
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span>Confidence</span>
                                <span className="font-medium">{prediction.confidence}%</span>
                              </div>
                              <Progress value={prediction.confidence} className="h-2" />
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Icon className={`h-3 w-3 ${prediction.iconColor}`} />
                                {prediction.category}
                              </Badge>

                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    prediction.impact === "High"
                                      ? "bg-red-500 hover:bg-red-600"
                                      : prediction.impact === "Medium"
                                        ? "bg-amber-500 hover:bg-amber-600"
                                        : "bg-blue-500 hover:bg-blue-600"
                                  }
                                >
                                  {prediction.impact} Impact
                                </Badge>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => toggleInsightDetails(prediction.id)}
                                >
                                  {isActive ? "Less" : "More"}
                                </Button>
                              </div>
                            </div>

                            {isActive && (
                              <div className="mt-3 text-right">
                                <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700">
                                  {prediction.action}
                                </Button>
                              </div>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>ML Model Performance</CardTitle>
                  <CardDescription>Accuracy metrics for prediction models</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="font-medium">Disease Outbreak Model</span>
                          </div>
                          <span className="font-medium">92% Accuracy</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">Chronic Disease Risk Model</span>
                          </div>
                          <span className="font-medium">88% Accuracy</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Treatment Efficacy Model</span>
                          </div>
                          <span className="font-medium">85% Accuracy</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            <span className="font-medium">Patient Outcome Prediction</span>
                          </div>
                          <span className="font-medium">79% Accuracy</span>
                        </div>
                        <Progress value={79} className="h-2" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ML-Powered Insights Summary</CardTitle>
                  <CardDescription>Key metrics and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border-2 border-emerald-100">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Predictions Generated</p>
                              <p className="text-2xl font-bold">1,248</p>
                            </div>
                            <Brain className="h-8 w-8 text-emerald-500" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-blue-100">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Data Points Analyzed</p>
                              <p className="text-2xl font-bold">5.2M</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-amber-100">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Patients Assessed</p>
                              <p className="text-2xl font-bold">3,842</p>
                            </div>
                            <Users className="h-8 w-8 text-amber-500" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-red-100">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">High Priority Alerts</p>
                              <p className="text-2xl font-bold">12</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Disease Prevalence</CardTitle>
                  <CardDescription>Distribution of diseases across patient population</CardDescription>
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
                            data={insights.trends.diseasePrevalence}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {insights.trends.diseasePrevalence.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Treatment Outcomes</CardTitle>
                  <CardDescription>Success and failure rates over time</CardDescription>
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
                          data={insights.trends.treatmentOutcomes}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="success" stackId="a" fill="#10b981" name="Success" />
                          <Bar dataKey="failure" stackId="a" fill="#ef4444" name="Failure" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Patient Demographics</CardTitle>
                  <CardDescription>Age and gender distribution of patients</CardDescription>
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
                          data={insights.trends.patientDemographics}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="age" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="male" fill="#3b82f6" name="Male" />
                          <Bar dataKey="female" fill="#ec4899" name="Female" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {loading ? (
                <>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-[200px]" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="mb-4 h-4 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  {insights.riskScores.map((risk: any) => {
                    const Icon = risk.icon
                    return (
                      <Card key={risk.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{risk.condition} Risk</CardTitle>
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span>Population Risk Score</span>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{risk.score}/100</span>
                                {risk.trend === "increasing" && <TrendingUp className="h-4 w-4 text-red-500" />}
                                {risk.trend === "decreasing" && (
                                  <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
                                )}
                                {risk.trend === "stable" && <Activity className="h-4 w-4 text-amber-500" />}
                              </div>
                            </div>
                            <Progress
                              value={risk.score}
                              className="h-2.5"
                              indicatorClassName={
                                risk.score > 70 ? "bg-red-500" : risk.score > 50 ? "bg-amber-500" : "bg-emerald-500"
                              }
                            />
                          </div>

                          <div>
                            <p className="mb-2 text-sm font-medium">Key Risk Factors:</p>
                            <ul className="space-y-1 text-sm">
                              {risk.factors.map((factor: string, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            View Detailed Analysis
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Regional Risk Map</CardTitle>
                <CardDescription>Geographic distribution of health risks</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <div className="text-center">
                    <MapPin className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Interactive risk map visualization</p>
                    <Button variant="outline" className="mt-4">
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Risk Map
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
