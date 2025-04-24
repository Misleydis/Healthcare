"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useAuthStore from "@/lib/auth-store"

// Generate random recommendations
const generateRecommendations = (isDoctor: boolean, extended = false) => {
  const patientRecommendations = [
    {
      id: 1,
      title: "Increase daily water intake",
      description: "Based on your health data, we recommend drinking at least 2 liters of water daily.",
      priority: "medium",
    },
    {
      id: 2,
      title: "Schedule follow-up appointment",
      description: "Your last checkup indicates you should schedule a follow-up within 3 months.",
      priority: "high",
    },
    {
      id: 3,
      title: "Consider vitamin D supplement",
      description: "Your recent blood work shows slightly low vitamin D levels.",
      priority: "low",
    },
  ]

  const doctorRecommendations = [
    {
      id: 1,
      title: "Patient compliance alert",
      description: "3 patients have missed their medication schedule this week.",
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
      title: "Treatment pattern insight",
      description: "Your hypertension treatment approach shows 22% better outcomes than average.",
      priority: "low",
    },
  ]

  if (extended && isDoctor) {
    doctorRecommendations.push(
      {
        id: 4,
        title: "Patient risk stratification",
        description: "5 patients may benefit from preventative intervention based on risk factors.",
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

  return isDoctor ? doctorRecommendations : patientRecommendations
}

export default function AIRecommendations({ extended = false }: { extended?: boolean }) {
  const { userData: user } = useAuthStore()
  const isDoctor = user?.role === "doctor"
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setRecommendations(generateRecommendations(isDoctor, extended))
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [isDoctor, extended])

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
