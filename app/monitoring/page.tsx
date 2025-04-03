"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, AlertCircle, Calendar, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MonitoringPage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Health Monitoring</h1>
          <p className="text-muted-foreground">Track and manage your health metrics</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Reading
          </Button>
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
                      <p className="text-xl font-bold">130/85</p>
                      <p className="text-sm text-muted-foreground">Today, 8:30 AM</p>
                    </div>
                  </div>

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
                      <p className="text-xl font-bold">110 mg/dL</p>
                      <p className="text-sm text-muted-foreground">Today, 7:15 AM</p>
                    </div>
                  </div>

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
                      <p className="text-xl font-bold">78 kg</p>
                      <p className="text-sm text-muted-foreground">Yesterday, 7:00 PM</p>
                    </div>
                  </div>
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
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Blood Pressure Trend</AlertTitle>
                  <AlertDescription>
                    Your blood pressure readings have been slightly elevated over the past week. Consider discussing
                    this with your healthcare provider.
                  </AlertDescription>
                </Alert>

                <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Blood Glucose Improvement</AlertTitle>
                  <AlertDescription>
                    Your blood glucose levels have improved and stabilized within the target range over the past two
                    weeks. Keep up the good work!
                  </AlertDescription>
                </Alert>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                        <Plus className="h-3 w-3" />
                      </span>
                      Continue monitoring your blood pressure twice daily
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                        <Plus className="h-3 w-3" />
                      </span>
                      Maintain your current diet and exercise routine
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                        <Plus className="h-3 w-3" />
                      </span>
                      Schedule a follow-up with Dr. Ndlovu to discuss your blood pressure
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
                  <Input id="bp-time" type="time" defaultValue="08:00" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systolic">Systolic (mmHg)</Label>
                    <Input id="systolic" type="number" placeholder="120" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                    <Input id="diastolic" type="number" placeholder="80" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pulse">Pulse (bpm)</Label>
                  <Input id="pulse" type="number" placeholder="72" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Any additional information" />
                </div>

                <Button className="w-full">Save Reading</Button>
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

                    {[
                      { date: "Today, 8:30 AM", reading: "130/85", pulse: "74", status: "elevated" },
                      { date: "Yesterday, 8:45 AM", reading: "128/83", pulse: "72", status: "elevated" },
                      { date: "Mar 22, 2025, 9:00 AM", reading: "125/82", pulse: "70", status: "normal" },
                      { date: "Mar 21, 2025, 8:15 AM", reading: "132/87", pulse: "75", status: "elevated" },
                      { date: "Mar 20, 2025, 8:30 AM", reading: "127/84", pulse: "73", status: "normal" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{item.date}</span>
                        </div>
                        <div
                          className={`font-medium ${item.status === "elevated" ? "text-orange-500" : "text-green-500"}`}
                        >
                          {item.reading}
                        </div>
                        <div>{item.pulse} bpm</div>
                      </div>
                    ))}
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
                  <Input id="glucose-time" type="time" defaultValue="07:00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glucose-level">Glucose Level (mg/dL)</Label>
                  <Input id="glucose-level" type="number" placeholder="110" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glucose-timing">Measurement Timing</Label>
                  <Select defaultValue="fasting">
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
                  <Input id="glucose-notes" placeholder="Any additional information" />
                </div>

                <Button className="w-full">Save Reading</Button>
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

                    {[
                      { date: "Today, 7:15 AM", reading: "110", timing: "Fasting", status: "normal" },
                      { date: "Yesterday, 7:00 AM", reading: "115", timing: "Fasting", status: "normal" },
                      { date: "Mar 22, 2025, 7:30 AM", reading: "108", timing: "Fasting", status: "normal" },
                      { date: "Mar 21, 2025, 7:15 AM", reading: "112", timing: "Fasting", status: "normal" },
                      { date: "Mar 20, 2025, 7:00 AM", reading: "118", timing: "Fasting", status: "normal" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{item.date}</span>
                        </div>
                        <div
                          className={`font-medium ${
                            Number.parseInt(item.reading) > 115 ? "text-orange-500" : "text-green-500"
                          }`}
                        >
                          {item.reading} mg/dL
                        </div>
                        <div>{item.timing}</div>
                      </div>
                    ))}
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
                  <Input id="weight-time" type="time" defaultValue="07:00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="78" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight-notes">Notes</Label>
                  <Input id="weight-notes" placeholder="Any additional information" />
                </div>

                <Button className="w-full">Save Reading</Button>
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

                    {[
                      { date: "Yesterday, 7:00 PM", weight: "78", change: "-0.5", status: "decrease" },
                      { date: "Mar 22, 2025, 7:15 PM", weight: "78.5", change: "-0.3", status: "decrease" },
                      { date: "Mar 21, 2025, 7:00 PM", weight: "78.8", change: "+0.2", status: "increase" },
                      { date: "Mar 20, 2025, 7:30 PM", weight: "78.6", change: "-0.4", status: "decrease" },
                      { date: "Mar 19, 2025, 7:00 PM", weight: "79", change: "0", status: "stable" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{item.date}</span>
                        </div>
                        <div className="font-medium">{item.weight} kg</div>
                        <div
                          className={`${
                            item.status === "decrease"
                              ? "text-green-500"
                              : item.status === "increase"
                                ? "text-orange-500"
                                : "text-gray-500"
                          }`}
                        >
                          {item.change} kg
                        </div>
                      </div>
                    ))}
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

