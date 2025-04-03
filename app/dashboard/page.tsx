import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Activity, Calendar, Clock, FileText, Video } from "lucide-react"
import { AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, John</h1>
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
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Dr. Sarah Moyo</p>
                  <p className="text-sm text-muted-foreground">General Checkup</p>
                  <p className="text-sm font-medium mt-1">Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Dr. James Ndlovu</p>
                  <p className="text-sm text-muted-foreground">Follow-up Consultation</p>
                  <p className="text-sm font-medium mt-1">Friday, 2:30 PM</p>
                </div>
              </div>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Metformin</p>
                    <p className="text-sm text-muted-foreground">500mg, twice daily</p>
                  </div>
                </div>
                <Badge>8:00 AM</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Lisinopril</p>
                    <p className="text-sm text-muted-foreground">10mg, once daily</p>
                  </div>
                </div>
                <Badge variant="outline">Taken</Badge>
              </div>
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
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Blood Pressure</p>
                  <p className="text-sm text-muted-foreground">Slightly elevated</p>
                  <p className="text-sm font-medium mt-1">130/85 mmHg</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Blood Glucose</p>
                  <p className="text-sm text-muted-foreground">Within normal range</p>
                  <p className="text-sm font-medium mt-1">110 mg/dL</p>
                </div>
              </div>
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
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
                      alt="Dr. Sarah Moyo"
                    />
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
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
                      alt="Dr. James Ndlovu"
                    />
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
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
                      alt="Pharmacy Notification"
                    />
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

