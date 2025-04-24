"use client"

import { useState, useEffect, useRef } from "react"
import { X, Video, Mic, MicOff, VideoOff, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface VideoCallPopupProps {
  isOpen: boolean
  onClose: () => void
  doctorName: string
  doctorSpecialty: string
  doctorImage?: string
}

export function VideoCallPopup({ isOpen, onClose, doctorName, doctorSpecialty, doctorImage }: VideoCallPopupProps) {
  const [status, setStatus] = useState<"connecting" | "connected" | "ended">("connecting")
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!isOpen) return

    let stream: MediaStream | null = null

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Simulate connection after 2 seconds
        setTimeout(() => {
          setStatus("connected")
          toast({
            title: "Connected",
            description: `You are now connected with Dr. ${doctorName}`,
          })
        }, 2000)
      } catch (err) {
        console.error("Error accessing camera:", err)
        setPermissionDenied(true)
        toast({
          variant: "destructive",
          title: "Camera access denied",
          description: "Please enable camera access to join the video call",
        })
      }
    }

    setupCamera()

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isOpen, doctorName, toast])

  const handleEndCall = () => {
    setStatus("ended")
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const toggleCamera = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .find((track) => track.kind === "video")

      if (videoTrack) {
        videoTrack.enabled = !cameraEnabled
        setCameraEnabled(!cameraEnabled)
      }
    }
  }

  const toggleMic = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .find((track) => track.kind === "audio")

      if (audioTrack) {
        audioTrack.enabled = !micEnabled
        setMicEnabled(!micEnabled)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={doctorImage || "/placeholder.svg"} alt={doctorName} />
              <AvatarFallback>{doctorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Dr. {doctorName}</CardTitle>
              <p className="text-sm text-muted-foreground">{doctorSpecialty}</p>
            </div>
          </div>
          <Badge
            variant={status === "connecting" ? "outline" : status === "connected" ? "success" : "destructive"}
            className="ml-auto mr-4"
          >
            {status === "connecting" ? "Connecting..." : status === "connected" ? "Connected" : "Call Ended"}
          </Badge>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted">
            {permissionDenied ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <VideoOff className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Camera access denied</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please enable camera access in your browser settings to join the video call.
                </p>
              </div>
            ) : (
              <>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${!cameraEnabled ? "hidden" : ""}`}
                />
                {!cameraEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Avatar className="h-32 w-32">
                      <AvatarFallback className="text-4xl">{doctorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
                  <div className="h-32 w-48 bg-muted">
                    {status === "connected" && (
                      <div className="flex h-full items-center justify-center">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/placeholder.svg?height=64&width=64" />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 p-4">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${!micEnabled ? "bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400" : ""}`}
            onClick={toggleMic}
            disabled={permissionDenied}
          >
            {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${!cameraEnabled ? "bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400" : ""}`}
            onClick={toggleCamera}
            disabled={permissionDenied}
          >
            {cameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          <Button variant="destructive" size="icon" className="rounded-full" onClick={handleEndCall}>
            <Phone className="h-4 w-4 rotate-135" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
