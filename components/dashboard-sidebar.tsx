"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart,
  Calendar,
  FileText,
  Home,
  Pill,
  Settings,
  Users,
  Video,
  Bell,
  User,
  Stethoscope,
  Brain,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import useAuthStore from "@/lib/auth-store"
import type { UserRole } from "@/lib/auth-store"

interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { userData } = useAuthStore()
  const userRole = userData?.role || "patient"

  const sidebarItems: SidebarItem[] = [
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
  ]

  const filteredItems = sidebarItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <ScrollArea className="h-full py-2">
        <nav className="grid gap-1 px-2">
          {filteredItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("flex h-10 items-center justify-start gap-2 px-4", pathname === item.href && "bg-muted")}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
