"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  LayoutDashboard,
  Users,
  Video,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Brain,
  Bell,
  UserCog,
  Stethoscope,
  Clipboard,
  CalendarClock,
} from "lucide-react"
import useAuthStore from "@/lib/auth-store"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout, userData } = useAuthStore()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(!isMobile)

  const userRole = userData?.role || "patient"
  const userEmail = userData?.email || "user@mjshealthhub.org"
  const userInitials =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName[0]}${userData.lastName[0]}`
      : userEmail.substring(0, 2).toUpperCase()
  const fullName = userData?.firstName && userData?.lastName ? `${userData.firstName} ${userData.lastName}` : userEmail

  useEffect(() => {
    setIsOpen(!isMobile)
  }, [isMobile])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  // Define navigation items for different roles
  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "User Management",
      href: "/dashboard/users",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      title: "Patients",
      href: "/dashboard/patients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Telehealth",
      href: "/dashboard/telehealth",
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: "Health Records",
      href: "/dashboard/records",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "ML Insights",
      href: "/dashboard/insights",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const doctorNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "My Patients",
      href: "/dashboard/patients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Telehealth",
      href: "/dashboard/telehealth",
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: "Health Records",
      href: "/dashboard/records",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "ML Insights",
      href: "/dashboard/insights",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
      badge: 3,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const nurseNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Patients",
      href: "/dashboard/patients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Telehealth",
      href: "/dashboard/telehealth",
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: "Health Records",
      href: "/dashboard/records",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const patientNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "My Health Records",
      href: "/dashboard/records",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/appointments",
      icon: <CalendarClock className="h-5 w-5" />,
    },
    {
      title: "Telehealth",
      href: "/dashboard/telehealth",
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: "Prescriptions",
      href: "/dashboard/prescriptions",
      icon: <Clipboard className="h-5 w-5" />,
    },
    {
      title: "My Doctors",
      href: "/dashboard/doctors",
      icon: <Stethoscope className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
      badge: 2,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  // Select navigation items based on user role
  let navItems = patientNavItems
  if (userRole === "admin") navItems = adminNavItems
  else if (userRole === "doctor") navItems = doctorNavItems
  else if (userRole === "nurse") navItems = nurseNavItems

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button variant="outline" size="icon" className="fixed left-4 top-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSidebarOnMobile}>
              <div className="flex items-center justify-center rounded-md bg-emerald-600 p-1">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">MJ's Health Hub</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${userInitials}`} alt={userEmail} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{fullName}</p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  {userData?.specialty && <p className="text-xs text-muted-foreground">• {userData.specialty}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebarOnMobile}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.title}
                  </div>
                  {item.badge && <Badge className="bg-red-500 hover:bg-red-600">{item.badge}</Badge>}
                </Link>
              ))}
            </nav>
          </ScrollArea>

          {/* Logout Button */}
          <div className="border-t p-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={toggleSidebar} aria-hidden="true"></div>
      )}
    </>
  )
}
