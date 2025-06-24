"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useAuthStore from "@/lib/auth-store"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userData } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!userData || userData.role !== "admin") {
      router.push("/dashboard")
    }
  }, [userData, router])

  if (!userData || userData.role !== "admin") {
    return null
  }

  return <>{children}</>
} 