"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Brain, AlertTriangle, TrendingUp, Pill, Activity, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Generate random AI recommendations
const generateRecommendations = (extended = false) => {
  const baseRecommendations = [
    {
      id: 1,
      title: "Malaria Prevention Campaign",
      description: "ML analysis suggests increased risk of malaria in Bulawayo region due to recent rainfall patterns.",
      type: "Prevention",
      priority: "High",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      details:
        "Predictive models show a 68% probability of increased malaria cases in the next 30 days based on weather patterns, historical data, and current case reports.",
      action: "Initiate targeted prevention campaign",
    },
    {
      id: 2,
      title: "Diabetes Screening Initiative",
      description: "Patient data indicates 24% increase in diabetes symptoms. Recommend targeted screening program.",
      type: "Screening",
      priority: "Medium",
      icon: TrendingUp,
      iconColor: "text-amber-500",
      details:
        "Analysis of recent patient visits shows an uptick in symptoms associated with undiagnosed diabetes, particularly in the 40-60 age demographic.",
      action: "Schedule community screening event",
    },
    {
      id: 3,
      title: "Medication Supply Optimization",
      description: "Predictive analysis shows potential shortage of hypertension medication in Mutare district.",
      type: "Supply Chain",
      priority: "Medium",
      icon: Pill,
      iconColor: "text-blue-500",
      details:
        "Based on current prescription rates and supply chain data, hypertension medications will reach critical levels within 3 weeks.",
      action: "Request additional medication supply",
    },
  ]

  if (extended) {
    return [
      ...baseRecommendations,
      {
        id: 4,
        title: "Respiratory Infection Cluster",
        description: "ML model has detected a potential cluster of respiratory infections in Masvingo province.",
        type: "Outbreak Detection",
        priority: "High",
        icon: Activity,
        iconColor: "text-red-500",
        details:
          "Pattern recognition algorithms have identified an unusual increase in respiratory symptoms reported in telehealth consultations from the Masvingo area.",
        action: "Investigate potential outbreak",
      },
      {
        id: 5,
        title: "Prenatal Care Optimization",
        description: "Analysis suggests improved outcomes with adjusted prenatal visit scheduling.",
        type: "Care Protocol",
        priority: "Low",
        icon: MapPin,
        iconColor: "text-green-500",
        details:
          "ML analysis of maternal health outcomes indicates that adjusting the frequency of prenatal visits based on risk factors could improve outcomes by 15%.",
        action: "Review prenatal care protocols",
      },
    ]
  }

  return baseRecommendations
}

interface AIRecommendationsProps {
  extended?: boolean
}

export default function AIRecommendations({ extended = false }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setRecommendations(generateRecommendations(extended))
      setLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [extended])

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: extended ? 5 : 3 }).map((_, i) => (
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
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => {
        const Icon = rec.icon
        const isExpanded = expandedId === rec.id

        return (
          <Card
            key={rec.id}
            className={`rounded-lg border p-4 transition-all duration-200 ${isExpanded ? "ring-1 ring-emerald-500" : ""}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-500" />
              <h3 className="font-medium">{rec.title}</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">{rec.description}</p>

            {isExpanded && (
              <div className="mb-3 rounded-md bg-muted p-3 text-sm">
                <p>{rec.details}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <Icon className={`h-3 w-3 ${rec.iconColor}`} />
                {rec.type}
              </Badge>

              <div className="flex items-center gap-2">
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

                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => toggleExpand(rec.id)}>
                  {isExpanded ? "Less" : "More"}
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-3 text-right">
                <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700">
                  {rec.action}
                </Button>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
