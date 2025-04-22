"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Brain, AlertTriangle, TrendingUp, Pill } from "lucide-react"

// Generate random AI recommendations
const generateRecommendations = () => {
  const recommendations = [
    {
      id: 1,
      title: "Malaria Prevention Campaign",
      description: "ML analysis suggests increased risk of malaria in Bulawayo region due to recent rainfall patterns.",
      type: "Prevention",
      priority: "High",
      icon: AlertTriangle,
      iconColor: "text-red-500",
    },
    {
      id: 2,
      title: "Diabetes Screening Initiative",
      description: "Patient data indicates 24% increase in diabetes symptoms. Recommend targeted screening program.",
      type: "Screening",
      priority: "Medium",
      icon: TrendingUp,
      iconColor: "text-amber-500",
    },
    {
      id: 3,
      title: "Medication Supply Optimization",
      description: "Predictive analysis shows potential shortage of hypertension medication in Mutare district.",
      type: "Supply Chain",
      priority: "Medium",
      icon: Pill,
      iconColor: "text-blue-500",
    },
  ]

  return recommendations
}

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setRecommendations(generateRecommendations())
      setLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="mb-2 h-5 w-[70%] animate-pulse rounded bg-muted"></div>
            <div className="mb-4 h-4 w-full animate-pulse rounded bg-muted"></div>
            <div className="flex justify-between">
              <div className="h-6 w-20 animate-pulse rounded bg-muted"></div>
              <div className="h-6 w-20 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => {
        const Icon = rec.icon
        return (
          <div key={rec.id} className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-500" />
              <h3 className="font-medium">{rec.title}</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">{rec.description}</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <Icon className={`h-3 w-3 ${rec.iconColor}`} />
                {rec.type}
              </Badge>
              <Badge
                className={
                  rec.priority === "High"
                    ? "bg-red-500 hover:bg-red-600"
                    : rec.priority === "Medium"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-blue-500 hover:bg-blue-600"
                }
              >
                {rec.priority} Priority
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}
