import type React from "react"
import ProtectedRoute from "@/components/protected-route"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </ProtectedRoute>
  )
}
