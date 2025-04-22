"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Simulated data for health metrics
const generateHealthData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()

  return months.slice(currentMonth - 5, currentMonth + 1).map((month, index) => {
    const baseValue = 50 + Math.random() * 20
    const improvement = index * 2 // Simulating improvement over time

    return {
      month,
      "Malaria Cases": Math.round(baseValue - improvement + Math.random() * 10),
      "Telehealth Consultations": Math.round(20 + index * 8 + Math.random() * 15),
      "Vaccination Rate": Math.min(95, Math.round(60 + index * 3 + Math.random() * 5)),
    }
  })
}

export default function HealthMetricsChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setData(generateHealthData())
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Malaria Cases" stroke="#ef4444" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Telehealth Consultations" stroke="#3b82f6" />
        <Line type="monotone" dataKey="Vaccination Rate" stroke="#10b981" />
      </LineChart>
    </ResponsiveContainer>
  )
}
