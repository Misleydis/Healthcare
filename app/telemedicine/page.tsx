"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Star, Video } from "lucide-react"

export default function TelemedicinePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Telemedicine Consultations</h1>
          <p className="text-muted-foreground">Connect with healthcare professionals remotely</p>
        </div>
      </div>

      <Tabs defaultValue="book" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="book">Book Consultation</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="book">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>Choose when you'd like to have your consultation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />

                <div className="space-y-2">
                  <h3 className="font-medium">Available Time Slots</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"].map((time) => (
                      <Button key={time} variant="outline" className="justify-start">
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Consultation Type</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Checkup</SelectItem>
                      <SelectItem value="followup">Follow-up Consultation</SelectItem>
                      <SelectItem value="specialist">Specialist Consultation</SelectItem>
                      <SelectItem value="emergency">Urgent Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Available Healthcare Providers</CardTitle>
                <CardDescription>Select a healthcare provider for your consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <DoctorCard
                    name="Dr. Sarah Moyo"
                    specialty="General Practitioner"
                    rating={4.9}
                    reviews={124}
                    availability="Available today"
                    image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
                  />

                  <DoctorCard
                    name="Dr. James Ndlovu"
                    specialty="Endocrinologist"
                    rating={4.8}
                    reviews={98}
                    availability="Available tomorrow"
                    image="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
                  />

                  <DoctorCard
                    name="Dr. Grace Mutasa"
                    specialty="Cardiologist"
                    rating={4.7}
                    reviews={86}
                    availability="Available today"
                    image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
                  />

                  <DoctorCard
                    name="Dr. Michael Dube"
                    specialty="General Practitioner"
                    rating={4.6}
                    reviews={112}
                    availability="Available today"
                    image="https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Upcoming Consultations</CardTitle>
                <CardDescription>Manage your scheduled telemedicine appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Dr. Sarah Moyo" />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Dr. Sarah Moyo</p>
                        <p className="text-sm text-muted-foreground">General Checkup</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="mr-1 h-3 w-3" /> Tomorrow, 10:00 AM
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="default" size="sm">
                        Join Call
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Dr. James Ndlovu" />
                        <AvatarFallback>JN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Dr. James Ndlovu</p>
                        <p className="text-sm text-muted-foreground">Follow-up Consultation</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="mr-1 h-3 w-3" /> Friday, 2:30 PM
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="default" size="sm" disabled>
                        Join Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prepare for Your Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-medium mb-2">Tips for a Successful Telemedicine Visit</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Find a quiet, private space with good lighting</li>
                      <li>Test your camera and microphone before the appointment</li>
                      <li>Have a list of your current medications ready</li>
                      <li>Write down any symptoms or questions you want to discuss</li>
                      <li>Have your recent health readings available (blood pressure, glucose, etc.)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Consultations</CardTitle>
              <CardDescription>Review your previous telemedicine appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Dr. Grace Mutasa" />
                      <AvatarFallback>GM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Dr. Grace Mutasa</p>
                      <p className="text-sm text-muted-foreground">Cardiology Consultation</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs">
                          March 10, 2025
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Summary
                    </Button>
                    <Button variant="default" size="sm">
                      Book Follow-up
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Dr. Michael Dube" />
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Dr. Michael Dube</p>
                      <p className="text-sm text-muted-foreground">General Checkup</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs">
                          February 22, 2025
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Summary
                    </Button>
                    <Button variant="default" size="sm">
                      Book Follow-up
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Dr. Sarah Moyo" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Dr. Sarah Moyo</p>
                      <p className="text-sm text-muted-foreground">Follow-up Consultation</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs">
                          January 15, 2025
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Summary
                    </Button>
                    <Button variant="default" size="sm">
                      Book Follow-up
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Load More
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DoctorCard({
  name,
  specialty,
  rating,
  reviews,
  availability,
  image,
}: {
  name: string
  specialty: string
  rating: number
  reviews: number
  availability: string
  image: string
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-all duration-300 hover-lift">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{specialty}</p>
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm ml-1">
              {rating} ({reviews} reviews)
            </span>
          </div>
          <Badge variant="outline" className="mt-2 text-xs">
            {availability}
          </Badge>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="transition-all duration-200 hover:bg-accent/20">
          View Profile
        </Button>
        <Button size="sm" className="transition-all duration-200">
          <Video className="mr-2 h-4 w-4" />
          Book
        </Button>
      </div>
    </div>
  )
}

