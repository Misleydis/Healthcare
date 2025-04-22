"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, FileText, Send, Pill, Activity, Brain } from "lucide-react"

export default function TelehealthConsultation() {
  const [isConnecting, setIsConnecting] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([])
  const [newMessage, setNewMessage] = useState("")

  // Simulate connection process
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)

      // Add initial message from doctor
      setMessages([
        {
          sender: "Dr. Mutasa",
          text: "Hello, I can see you're connecting now. How are you feeling today? I've reviewed your previous records and would like to discuss your symptoms.",
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const userMessage = {
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate doctor's response after a short delay
    setTimeout(() => {
      const doctorResponse = {
        sender: "Dr. Mutasa",
        text: "Thank you for sharing that information. Based on your symptoms, our ML system suggests this could be related to seasonal malaria. I'd like to discuss some preventive measures and treatment options.",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, doctorResponse])
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            {isConnecting ? (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-lg text-white">Connecting to secure telehealth session...</p>
              </div>
            ) : (
              <>
                {/* Main video (doctor) */}
                <div className="h-full w-full">
                  <img
                    src="/placeholder.svg?height=480&width=640&text=Dr.+Mutasa"
                    alt="Doctor video feed"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Small video (patient) */}
                <div className="absolute bottom-4 right-4 h-1/4 w-1/4 overflow-hidden rounded-lg border-2 border-background">
                  <img
                    src="/placeholder.svg?height=120&width=160&text=You"
                    alt="Your video feed"
                    className={`h-full w-full object-cover ${isVideoOff ? "opacity-0" : ""}`}
                  />
                  {isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <VideoOff className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Connection status */}
                <div className="absolute left-4 top-4">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-white"></span>
                    Live
                  </Badge>
                </div>

                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2 rounded-full bg-background/80 p-2">
                  <Button
                    size="icon"
                    variant={isMuted ? "destructive" : "secondary"}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>

                  <Button
                    size="icon"
                    variant={isVideoOff ? "destructive" : "secondary"}
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>

                  <Button size="icon" variant="destructive">
                    <Phone className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <Tabs defaultValue="chat" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="mr-2 h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="health">
                <Activity className="mr-2 h-4 w-4" />
                Health
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="h-[400px] flex flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-xs font-medium">{message.sender}</span>
                        <span className="text-xs opacity-70">{message.time}</span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="h-[400px] flex flex-col">
              <div className="flex-1 p-4">
                <Textarea className="h-full resize-none" placeholder="Take notes during your consultation..." />
              </div>
            </TabsContent>

            <TabsContent value="health" className="h-[400px] overflow-y-auto">
              <div className="space-y-4 p-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-red-500" />
                      <h3 className="font-medium">Recent Vitals</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Blood Pressure:</span>
                        <span className="font-medium">130/85 mmHg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heart Rate:</span>
                        <span className="font-medium">78 bpm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span className="font-medium">37.2°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Oxygen Saturation:</span>
                        <span className="font-medium">98%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Pill className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Current Medications</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Artemether/Lumefantrine</span>
                        <span className="text-muted-foreground">80/480 mg, twice daily</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Paracetamol</span>
                        <span className="text-muted-foreground">500 mg, as needed</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-emerald-500" />
                      <h3 className="font-medium">ML-Based Insights</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>Based on your symptoms and regional data, our ML system suggests:</p>
                      <ul className="list-inside list-disc space-y-1">
                        <li>High probability of seasonal malaria (87%)</li>
                        <li>Recommended follow-up in 7 days</li>
                        <li>Suggested preventive measures: mosquito nets, repellents</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40&text=DM" alt="Dr. Mutasa" />
                  <AvatarFallback>DM</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Dr. Mutasa</h3>
                  <p className="text-xs text-muted-foreground">General Practitioner</p>
                </div>
              </div>
              <Badge>Healthcare Provider</Badge>
            </div>
            <p className="text-sm">
              Specializes in rural healthcare and infectious diseases with 15 years of experience in Zimbabwe's
              healthcare system.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40&text=TM" alt="Tendai Moyo" />
                  <AvatarFallback>TM</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Tendai Moyo</h3>
                  <p className="text-xs text-muted-foreground">Bulawayo, Zimbabwe</p>
                </div>
              </div>
              <Badge variant="outline">Patient</Badge>
            </div>
            <p className="text-sm">
              Recent symptoms include fever, headache, and fatigue for the past 3 days. Previous history of malaria in
              2022.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
