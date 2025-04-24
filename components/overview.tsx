"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import useAuthStore from "@/lib/auth-store"

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

export function Overview() {
  const { userData: user } = useAuthStore()
  const isDoctor = user?.role === "doctor"
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

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[0].payload.name}</span>
                      <span className="font-bold text-muted-foreground">
                        {isDoctor ? "Patients" : "Health Score"}: {payload[0].value}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
