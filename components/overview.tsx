"use client"

import {
  useEffect,
  useState,
} from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useAuthStore from '@/lib/auth-store';

// Generate random data for the chart
const generateChartData = (isDoctor: boolean) => {
  if (isDoctor) {
    // For doctors, show patient visits data
    return [
      { name: "Jan", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Feb", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Mar", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Apr", total: Math.floor(Math.random() * 50) + 20 },
      { name: "May", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Jun", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Jul", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Aug", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Sep", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Oct", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Nov", total: Math.floor(Math.random() * 50) + 20 },
      { name: "Dec", total: Math.floor(Math.random() * 50) + 20 },
    ]
  } else {
    // For patients, show health metrics data
    return [
      { name: "Jan", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Feb", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Mar", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Apr", total: Math.floor(Math.random() * 30) + 60 },
      { name: "May", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Jun", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Jul", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Aug", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Sep", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Oct", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Nov", total: Math.floor(Math.random() * 30) + 60 },
      { name: "Dec", total: Math.floor(Math.random() * 30) + 60 },
    ]
  }
}

export default function Overview() {
  const { userData: user } = useAuthStore()
  const isDoctor = user?.role === "doctor"
  const isAdmin = user?.role === "admin"
  const isNurse = user?.role === "nurse"
  const isPatient = user?.role === "patient"
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setData(generateChartData(isDoctor))
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [isDoctor])

  if (loading) {
    return (
      <div className="h-[350px] w-full animate-pulse rounded-md bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    )
  }

  if (isPatient) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Health Summary</CardTitle>
            <CardDescription>Your recent health metrics and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                <p className="text-2xl font-bold">120/80</p>
                <p className="text-xs text-muted-foreground">Last checked: 2 days ago</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                <p className="text-2xl font-bold">72 bpm</p>
                <p className="text-xs text-muted-foreground">Last checked: 2 days ago</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Weight</p>
                <p className="text-2xl font-bold">68 kg</p>
                <p className="text-xs text-muted-foreground">Last checked: 1 week ago</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">BMI</p>
                <p className="text-2xl font-bold">22.5</p>
                <p className="text-xs text-muted-foreground">Last calculated: 1 week ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your recent healthcare activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Annual Check-up</p>
                  <p className="text-xs text-muted-foreground">Completed on March 15, 2024</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Blood Test</p>
                  <p className="text-xs text-muted-foreground">Completed on March 10, 2024</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dental Cleaning</p>
                  <p className="text-xs text-muted-foreground">Scheduled for April 5, 2024</p>
                </div>
                <Badge variant="outline">Upcoming</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Practice Overview</CardTitle>
          <CardDescription>Key metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Appointments Today</p>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-muted-foreground">3 pending confirmations</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Patient Satisfaction</p>
              <p className="text-2xl font-bold">4.8/5</p>
              <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Wait Time</p>
              <p className="text-2xl font-bold">12 min</p>
              <p className="text-xs text-muted-foreground">-2 min from last week</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest appointments and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Annual Check-up - John Doe</p>
                <p className="text-xs text-muted-foreground">Completed on March 15, 2024</p>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Follow-up - Jane Smith</p>
                <p className="text-xs text-muted-foreground">Completed on March 14, 2024</p>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New Patient - Robert Johnson</p>
                <p className="text-xs text-muted-foreground">Scheduled for March 16, 2024</p>
              </div>
              <Badge variant="outline">Upcoming</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
