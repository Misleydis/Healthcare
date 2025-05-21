"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart,
  Bell,
  Brain,
  Calendar,
  FileText,
  Home,
  Pill,
  Settings,
  Stethoscope,
  User,
  Users,
  Video,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import useAuthStore from "@/lib/auth-store"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { userData } = useAuthStore()
  const userRole = userData?.role || "patient"

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "doctor", "nurse", "patient"],
    },
    {
      title: "Patients",
      href: "/dashboard/patients",
      icon: Users,
      roles: ["admin", "doctor", "nurse"],
    },
    {
      title: "My Health Records",
      href: "/dashboard/records",
      icon: FileText,
      roles: ["patient"],
    },
    {
      title: "Appointments",
      href: "/dashboard/appointments",
      icon: Calendar,
      roles: ["patient", "doctor", "nurse"],
    },
    {
      title: "Telehealth",
      href: "/dashboard/telehealth",
      icon: Video,
      roles: ["admin", "doctor", "nurse", "patient"],
    },
    {
      title: "Prescriptions",
      href: "/dashboard/prescriptions",
      icon: Pill,
      roles: ["patient"],
    },
    {
      title: "Prescriptions Management",
      href: "/dashboard/prescriptions-management",
      icon: Pill,
      roles: ["doctor", "nurse"],
    },
    {
      title: "My Doctors",
      href: "/dashboard/doctors",
      icon: Stethoscope,
      roles: ["patient"],
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
      roles: ["admin", "doctor"],
    },
    {
      title: "ML Insights",
      href: "/dashboard/insights",
      icon: Brain,
      roles: ["admin", "doctor"],
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      roles: ["admin", "doctor", "nurse", "patient"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin", "doctor", "nurse", "patient"],
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
      roles: ["admin", "doctor", "nurse", "patient"],
    },
    {
      title: "Chatbot",
      href: "/dashboard/chatbot",
      icon: Brain,
      roles: ["patient"],
    },
  ]

  const filteredItems = sidebarItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="border-r bg-background w-64">
      <div className="py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Health Portal</h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
