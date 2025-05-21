"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Activity,
  Settings,
  Bell,
  MessageSquare,
  Lightbulb,
  Video,
  Pill,
  ClipboardList,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import useAuthStore from "@/lib/auth-store"

interface DashboardSidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { userData } = useAuthStore()

  const isPatient = userData?.role === "patient"
  const isDoctor = userData?.role === "doctor"
  const isNurse = userData?.role === "nurse"
  const isAdmin = userData?.role === "admin"

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
      roles: ["patient", "doctor", "nurse", "admin"],
    },
    {
      label: "Appointments",
      icon: Calendar,
      href: "/dashboard/appointments",
      active: pathname === "/dashboard/appointments",
      roles: ["patient", "doctor", "nurse", "admin"],
    },
    {
      label: "Patients",
      icon: Users,
      href: "/dashboard/patients",
      active: pathname === "/dashboard/patients",
      roles: ["doctor", "nurse", "admin"],
    },
    {
      label: "Doctors",
      icon: Users,
      href: "/dashboard/doctors",
      active: pathname === "/dashboard/doctors",
      roles: ["patient", "admin"],
    },
    {
      label: "Health Records",
      icon: FileText,
      href: "/dashboard/records",
      active: pathname === "/dashboard/records",
      roles: ["patient", "doctor", "nurse", "admin"],
    },
    {
      label: "Medications",
      icon: Pill,
      href: "/dashboard/medications",
      active: pathname === "/dashboard/medications",
      roles: ["patient", "doctor", "nurse", "admin"],
    },
    {
      label: "Prescriptions",
      icon: ClipboardList,
      href: "/dashboard/prescriptions",
      active: pathname === "/dashboard/prescriptions",
      roles: ["patient", "doctor", "admin"],
    },
    {
      label: "Telehealth",
      icon: Video,
      href: "/dashboard/telehealth",
      active: pathname === "/dashboard/telehealth",
      roles: ["patient", "doctor"],
    },
    {
      label: "Analytics",
      icon: Activity,
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics",
      roles: ["doctor", "admin"],
    },
    {
      label: "AI Insights",
      icon: Lightbulb,
      href: "/dashboard/insights",
      active: pathname === "/dashboard/insights",
      roles: ["patient", "doctor"],
    },
    {
      label: "Chatbot",
      icon: MessageSquare,
      href: "/dashboard/chatbot",
      active: pathname === "/dashboard/chatbot",
      roles: ["patient", "doctor", "nurse", "admin"],
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/dashboard/notifications",
      active: pathname === "/dashboard/notifications",
      roles: ["patient", "doctor", "nurse", "admin"],
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
      roles: ["patient", "doctor", "nurse", "admin"],
    },
  ]

  return (
    <div className={cn("pb-12 border-r h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Health Portal</h2>
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-1">
                {routes.map((route) => {
                  // Only show routes that are applicable to the user's role
                  if (!userData || !route.roles.includes(userData.role)) {
                    return null
                  }

                  return (
                    <Button
                      key={route.href}
                      variant={route.active ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={route.href}>
                        <route.icon className="mr-2 h-4 w-4" />
                        {route.label}
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
