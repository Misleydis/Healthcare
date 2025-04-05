"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, AlertCircle, Calendar, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function MonitoringPage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [healthData, setHealthData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Form states
  const [bpTime, setBpTime] = useState("08:00")
  const [systolic, setSystolic] = useState("")
  const [diastolic, setDiastolic] = useState("")
  const [pulse, setPulse] = useState("")
  const [bpNotes, setBpNotes] = useState("")

  const [glucoseTime, setGlucoseTime] = useState("07:00")
  const [glucoseLevel, setGlucoseLevel] = useState("")
  const [glucoseTiming, setGlucoseTiming] = useState("fasting")
  const [glucoseNotes, setGlucoseNotes] = useState("")

  const [weightTime, setWeightTime] = useState("07:00")
  const [weight, setWeight] = useState("")
  const [weightNotes, setWeightNotes] = useState("")

  const [submitting, setSubmitting] = useState(false)

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

  const handleAddBloodPressure = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!systolic || !diastolic) {
      toast({
        title: "Missing fields",
        description: "Please enter both systolic and diastolic values.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/health-data/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bloodPressure",
          data: {
            date: selectedDate,
            time: bpTime,
            systolic: Number.parseInt(systolic),
            diastolic: Number.parseInt(diastolic),
            pulse: pulse ? Number.parseInt(pulse) : null,
            notes: bpNotes,
            createdAt: new Date().toISOString(),
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Blood pressure reading added successfully.",
        })

        // Update local state
        setHealthData({
          ...healthData,
          bloodPressure: result.data,
        })

        // Reset form
        setSystolic("")
        setDiastolic("")
        setPulse("")
        setBpNotes("")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add blood pressure reading.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddGlucose = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!glucoseLevel) {
      toast({
        title: "Missing fields",
        description: "Please enter a glucose level.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/health-data/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bloodGlucose",
          data: {
            date: selectedDate,
            time: glucoseTime,
            level: Number.parseInt(glucoseLevel),
            timing: glucoseTiming,
            notes: glucoseNotes,
            createdAt: new Date().toISOString(),
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Blood glucose reading added successfully.",
        })

        // Update local state
        setHealthData({
          ...healthData,
          bloodGlucose: result.data,
        })

        // Reset form
        setGlucoseLevel("")
        setGlucoseNotes("")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add blood glucose reading.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!weight) {
      toast({
        title: "Missing fields",
        description: "Please enter a weight value.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/health-data/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "weight",
          data: {
            date: selectedDate,
            time: weightTime,
            weight: Number.parseFloat(weight),
            notes: weightNotes,
            createdAt: new Date().toISOString(),
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Weight reading added successfully.",
        })

        // Update local state
        setHealthData({
          ...healthData,
          weight: result.data,
        })

        // Reset form
        setWeight("")
        setWeightNotes("")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add weight reading.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <MonitoringSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Health Monitoring</h1>
          <p className="text-muted-foreground">Track and manage your health metrics</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
          <TabsTrigger value="blood-glucose">Blood Glucose</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
                <CardDescription>Your recent health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthData?.bloodPressure?.length > 0 && (
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-4">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Blood Pressure</p>
                          <p className="text-sm text-muted-foreground">Last reading</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {healthData.bloodPressure[0].systolic}/{healthData.bloodPressure[0].diastolic}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(healthData.bloodPressure[0].date)}, {healthData.bloodPressure[0].time}
                        </p>
                      </div>
                    </div>
                  )}

                  {healthData?.bloodGlucose?.length > 0 && (
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-4">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Blood Glucose</p>
                          <p className="text-sm text-muted-foreground">Last reading</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{healthData.bloodGlucose[0].level} mg/dL</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(healthData.bloodGlucose[0].date)}, {healthData.bloodGlucose[0].time}
                        </p>
                      </div>
                    </div>
                  )}

                  {healthData?.weight?.length > 0 && (
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-4">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Weight</p>
                          <p className="text-sm text-muted-foreground">Last reading</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{healthData.weight[0].weight} kg</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(healthData.weight[0].date)}, {healthData.weight[0].time}
                        </p>
                      </div>
                    </div>
                  )}

                  {!healthData?.bloodPressure?.length &&
                    !healthData?.bloodGlucose?.length &&
                    !healthData?.weight?.length && (
                      <div className="text-center py-8 text-muted-foreground">
                        No health data available. Start adding your readings.
                      </div>
                    )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Detailed History
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Insights</CardTitle>
                <CardDescription>AI-powered analysis of your health data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthData?.bloodPressure?.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Blood Pressure Trend</AlertTitle>
                    <AlertDescription>
                      {healthData.bloodPressure[0].systolic > 120
                        ? "Your blood pressure readings have been slightly elevated over the past week. Consider discussing this with your healthcare provider."
                        : "Your blood pressure readings are within the normal range. Keep up the good work!"}
                    </AlertDescription>
                  </Alert>
                )}

                {healthData?.bloodGlucose?.length > 0 && (
                  <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Blood Glucose Improvement</AlertTitle>
                    <AlertDescription>
                      {healthData.bloodGlucose[0].level > 115
                        ? "Your blood glucose levels are slightly elevated. Consider discussing this with your healthcare provider."
                        : "Your blood glucose levels have improved and stabilized within the target range. Keep up the good work!"}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                        <Plus className="h-3 w-3" />
                      </span>
                      Continue monitoring your health metrics regularly
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                        <Plus className="h-3 w-3" />
                      </span>
                      Maintain a balanced diet and regular exercise routine
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                        <Plus className="h-3 w-3" />
                      </span>
                      Schedule regular check-ups with your healthcare provider
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/telemedicine">Schedule Consultation</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blood-pressure">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Add Blood Pressure Reading</CardTitle>
                <CardDescription>Record your latest measurement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddBloodPressure}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bp-date">Date</Label>
                      <Input
                        id="bp-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bp-time">Time</Label>
                      <Input id="bp-time" type="time" value={bpTime} onChange={(e) => setBpTime(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="systolic">Systolic (mmHg)</Label>
                        <Input
                          id="systolic"
                          type="number"
                          placeholder="120"
                          value={systolic}
                          onChange={(e) => setSystolic(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                        <Input
                          id="diastolic"
                          type="number"
                          placeholder="80"
                          value={diastolic}
                          onChange={(e) => setDiastolic(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pulse">Pulse (bpm)</Label>
                      <Input
                        id="pulse"
                        type="number"
                        placeholder="72"
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bp-notes">Notes</Label>
                      <Input
                        id="bp-notes"
                        placeholder="Any additional information"
                        value={bpNotes}
                        onChange={(e) => setBpNotes(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Saving..." : "Save Reading"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Blood Pressure History</CardTitle>
                <CardDescription>View your blood pressure readings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-muted rounded-lg flex items-center justify-center animate-in fade-in duration-500">
                  <p className="text-muted-foreground">Blood Pressure Chart Visualization</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Filter by date range:</Label>
                    <Select defaultValue="week">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last 7 days</SelectItem>
                        <SelectItem value="month">Last 30 days</SelectItem>
                        <SelectItem value="quarter">Last 3 months</SelectItem>
                        <SelectItem value="year">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border-b">
                      <div className="font-medium">Date & Time</div>
                      <div className="font-medium">Reading</div>
                      <div className="font-medium">Pulse</div>
                    </div>

                    {healthData?.bloodPressure?.length > 0 ? (
                      healthData.bloodPressure.map((reading: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {formatDate(reading.date)}, {reading.time}
                            </span>
                          </div>
                          <div
                            className={`font-medium ${reading.systolic > 120 ? "text-orange-500" : "text-green-500"}`}
                          >
                            {reading.systolic}/{reading.diastolic}
                          </div>
                          <div>{reading.pulse} bpm</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No blood pressure readings available</div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blood-glucose">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Add Blood Glucose Reading</CardTitle>
                <CardDescription>Record your latest measurement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddGlucose}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="glucose-date">Date</Label>
                      <Input
                        id="glucose-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="glucose-time">Time</Label>
                      <Input
                        id="glucose-time"
                        type="time"
                        value={glucoseTime}
                        onChange={(e) => setGlucoseTime(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="glucose-level">Glucose Level (mg/dL)</Label>
                      <Input
                        id="glucose-level"
                        type="number"
                        placeholder="110"
                        value={glucoseLevel}
                        onChange={(e) => setGlucoseLevel(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="glucose-timing">Measurement Timing</Label>
                      <Select value={glucoseTiming} onValueChange={setGlucoseTiming}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fasting">Fasting</SelectItem>
                          <SelectItem value="before-meal">Before Meal</SelectItem>
                          <SelectItem value="after-meal">After Meal (2 hours)</SelectItem>
                          <SelectItem value="bedtime">Bedtime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="glucose-notes">Notes</Label>
                      <Input
                        id="glucose-notes"
                        placeholder="Any additional information"
                        value={glucoseNotes}
                        onChange={(e) => setGlucoseNotes(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Saving..." : "Save Reading"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Blood Glucose History</CardTitle>
                <CardDescription>View your blood glucose readings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-muted rounded-lg flex items-center justify-center animate-in fade-in duration-500">
                  <p className="text-muted-foreground">Blood Glucose Chart Visualization</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Filter by date range:</Label>
                    <Select defaultValue="week">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last 7 days</SelectItem>
                        <SelectItem value="month">Last 30 days</SelectItem>
                        <SelectItem value="quarter">Last 3 months</SelectItem>
                        <SelectItem value="year">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border-b">
                      <div className="font-medium">Date & Time</div>
                      <div className="font-medium">Reading</div>
                      <div className="font-medium">Timing</div>
                    </div>

                    {healthData?.bloodGlucose?.length > 0 ? (
                      healthData.bloodGlucose.map((reading: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {formatDate(reading.date)}, {reading.time}
                            </span>
                          </div>
                          <div className={`font-medium ${reading.level > 115 ? "text-orange-500" : "text-green-500"}`}>
                            {reading.level} mg/dL
                          </div>
                          <div>{reading.timing}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No blood glucose readings available</div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weight">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Add Weight Reading</CardTitle>
                <CardDescription>Record your latest measurement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddWeight}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight-date">Date</Label>
                      <Input
                        id="weight-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight-time">Time</Label>
                      <Input
                        id="weight-time"
                        type="time"
                        value={weightTime}
                        onChange={(e) => setWeightTime(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="78"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight-notes">Notes</Label>
                      <Input
                        id="weight-notes"
                        placeholder="Any additional information"
                        value={weightNotes}
                        onChange={(e) => setWeightNotes(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Saving..." : "Save Reading"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Weight History</CardTitle>
                <CardDescription>View your weight measurements over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-muted rounded-lg flex items-center justify-center animate-in fade-in duration-500">
                  <p className="text-muted-foreground">Weight Chart Visualization</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Filter by date range:</Label>
                    <Select defaultValue="month">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last 7 days</SelectItem>
                        <SelectItem value="month">Last 30 days</SelectItem>
                        <SelectItem value="quarter">Last 3 months</SelectItem>
                        <SelectItem value="year">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border-b">
                      <div className="font-medium">Date & Time</div>
                      <div className="font-medium">Weight</div>
                      <div className="font-medium">Change</div>
                    </div>

                    {healthData?.weight?.length > 0 ? (
                      healthData.weight.map((reading: any, index: number) => {
                        const prevReading = index < healthData.weight.length - 1 ? healthData.weight[index + 1] : null
                        const change = prevReading ? (reading.weight - prevReading.weight).toFixed(1) : "0"
                        const status = change > 0 ? "increase" : change < 0 ? "decrease" : "stable"

                        return (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {formatDate(reading.date)}, {reading.time}
                              </span>
                            </div>
                            <div className="font-medium">{reading.weight} kg</div>
                            <div
                              className={`${
                                status === "decrease"
                                  ? "text-green-500"
                                  : status === "increase"
                                    ? "text-orange-500"
                                    : "text-gray-500"
                              }`}
                            >
                              {change > 0 ? "+" : ""}
                              {change} kg
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No weight readings available</div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </div>
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

function MonitoringSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="mt-4 md:mt-0">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <Skeleton className="h-10 w-full mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
              <Skeleton className="h-32 w-full" />
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

