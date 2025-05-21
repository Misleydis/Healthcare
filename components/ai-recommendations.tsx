"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useAuthStore from "@/lib/auth-store"
import { useDataStore } from "@/lib/data-store"

export default function AIRecommendations({ extended = false }: { extended?: boolean }) {
  const { userData: user } = useAuthStore()
  const isDoctor = user?.role === "doctor"
  const userId = user?.id || ""

  const { appointments, healthRecords } = useDataStore()

  // Filter data based on user role
  const userAppointments = appointments.filter((appointment) => {
    if (isDoctor) {
      return appointment.doctorId === userId
    }
    return appointment.patientId === userId
  })

  const userHealthRecords = healthRecords.filter((record) => {
    if (isDoctor) {
      return record.doctorId === userId
    }
    return record.patientId === userId
  })

  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      // Generate recommendations based on user data
      let generatedRecommendations = []

      if (isDoctor) {
        // Doctor recommendations
        generatedRecommendations = [
          {
            id: 1,
            title:
              userAppointments.length > 0
                ? `Patient compliance alert (${userAppointments.length} appointments)`
                : "No patient appointments yet",
            description:
              userAppointments.length > 0
                ? `${userAppointments.filter((a) => a.status === "Cancelled").length} patients have missed their appointments this week.`
                : "Schedule appointments with patients to see compliance metrics.",
            priority: "high",
          },
          {
            id: 2,
            title: "Appointment optimization",
            description: "Scheduling more appointments on Wednesday could improve clinic efficiency by 15%.",
            priority: "medium",
          },
          {
            id: 3,
            title: userHealthRecords.length > 0 ? "Treatment pattern insight" : "No health records yet",
            description:
              userHealthRecords.length > 0
                ? "Your treatment approach shows promising outcomes compared to average."
                : "Add health records to receive treatment pattern insights.",
            priority: "low",
          },
        ]

        if (extended) {
          generatedRecommendations.push(
            {
              id: 4,
              title: "Patient risk stratification",
              description:
                userAppointments.length > 0
                  ? `${Math.min(5, userAppointments.length)} patients may benefit from preventative intervention based on risk factors.`
                  : "No patients to analyze for risk stratification.",
              priority: "medium",
            },
            {
              id: 5,
              title: "Clinical documentation improvement",
              description: "AI analysis suggests more detailed notes could improve care continuity.",
              priority: "low",
            },
          )
        }
      } else {
        // Patient recommendations
        generatedRecommendations = [
          {
            id: 1,
            title: "Increase daily water intake",
            description: "Based on your health data, we recommend drinking at least 2 liters of water daily.",
            priority: "medium",
          },
          {
            id: 2,
            title: userAppointments.length > 0 ? "Schedule follow-up appointment" : "Schedule initial check-up",
            description:
              userAppointments.length > 0
                ? "Your last checkup indicates you should schedule a follow-up within 3 months."
                : "It's recommended to have a regular health check-up at least once a year.",
            priority: "high",
          },
          {
            id: 3,
            title: "Consider vitamin D supplement",
            description: "Many people in your region have vitamin D deficiency. Consider getting tested.",
            priority: "low",
          },
        ]
      }

      setRecommendations(generatedRecommendations)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [isDoctor, extended, userAppointments, userHealthRecords])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-2 p-2">
            <div className="h-5 w-[70%] animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-[90%] animate-pulse rounded bg-muted"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{recommendation.title}</h4>
                  <Badge
                    variant={
                      recommendation.priority === "high"
                        ? "destructive"
                        : recommendation.priority === "medium"
                          ? "default"
                          : "outline"
                    }
                    className="ml-2"
                  >
                    {recommendation.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
