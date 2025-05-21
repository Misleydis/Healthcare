"use client"

import {
  useEffect,
  useState,
} from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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

interface RecentPatientsProps {
  isPatientView?: boolean
}

export default function RecentPatients({ isPatientView = false }: RecentPatientsProps) {
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

  if (isPatientView) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Dr. Sarah Johnson" />
            <AvatarFallback>DJ</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Dr. Sarah Johnson</p>
            <p className="text-sm text-muted-foreground">Primary Care Physician</p>
          </div>
          <div className="ml-auto font-medium">
            <Badge variant="secondary">Primary</Badge>
          </div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/02.png" alt="Dr. Michael Chen" />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Dr. Michael Chen</p>
            <p className="text-sm text-muted-foreground">Cardiologist</p>
          </div>
          <div className="ml-auto font-medium">
            <Badge variant="outline">Specialist</Badge>
          </div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/03.png" alt="Dr. Emily Rodriguez" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Dr. Emily Rodriguez</p>
            <p className="text-sm text-muted-foreground">Dermatologist</p>
          </div>
          <div className="ml-auto font-medium">
            <Badge variant="outline">Specialist</Badge>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">John Doe</p>
          <p className="text-sm text-muted-foreground">Last visit: 2 days ago</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge variant="secondary">Follow-up</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/02.png" alt="Jane Smith" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jane Smith</p>
          <p className="text-sm text-muted-foreground">Last visit: 1 week ago</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge variant="outline">Regular</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Robert Johnson" />
          <AvatarFallback>RJ</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Robert Johnson</p>
          <p className="text-sm text-muted-foreground">Last visit: 2 weeks ago</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge variant="outline">Regular</Badge>
        </div>
      </div>
    </div>
  )
}
