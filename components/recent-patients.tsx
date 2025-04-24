"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Generate random patient data
const generatePatients = () => {
  const firstNames = ["Tendai", "Chipo", "Tatenda", "Farai", "Nyasha", "Kudzai", "Tafadzwa", "Rumbidzai"]
  const lastNames = ["Moyo", "Ncube", "Dube", "Sibanda", "Mpofu", "Ndlovu", "Mutasa", "Chigumba"]
  const locations = ["Bulawayo", "Harare", "Mutare", "Gweru", "Masvingo", "Chinhoyi", "Kadoma", "Kwekwe"]
  const conditions = ["Malaria", "Hypertension", "Diabetes", "Respiratory", "Prenatal Care", "General Checkup"]

  // Get current date
  const today = new Date()

  return Array.from({ length: 5 }, (_, i) => {
    // Generate a date within the last 7 days
    const registrationDate = new Date(today)
    registrationDate.setDate(today.getDate() - Math.floor(Math.random() * 7))

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      registrationDate: registrationDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      initials: `${firstName[0]}${lastName[0]}`,
    }
  })
}

export function RecentPatients({ isPatientView = false }) {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPatients(generatePatients())
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 w-[200px] animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-[150px] animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${patient.initials}`} />
              <AvatarFallback>{patient.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{patient.name}</p>
              <p className="text-xs text-muted-foreground">{patient.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{patient.condition}</Badge>
            <span className="text-xs text-muted-foreground">{patient.registrationDate}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
