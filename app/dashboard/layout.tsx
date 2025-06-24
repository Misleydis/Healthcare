"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import useAuthStore from "@/lib/auth-store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, userData } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Validate user role
    if (!userData || !userData.role) {
      console.error("Invalid user data or role")
      router.push("/login")
      return
    }

    // Ensure the role is valid
    const validRoles = ["patient", "doctor", "nurse", "admin"]
    if (!validRoles.includes(userData.role)) {
      console.error("Invalid user role:", userData.role)
      router.push("/login")
      return
    }
  }, [isAuthenticated, userData, router])

  if (!isAuthenticated || !userData) {
    return null
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
