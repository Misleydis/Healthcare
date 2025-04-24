"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  Bell,
  CheckCircle2,
  Calendar,
  Users,
  Brain,
  RefreshCw,
  Trash2,
  CheckCheck,
  Clock,
  FileText,
  MessageSquare,
  Pill,
  Activity,
} from "lucide-react"
import { format, subHours, subDays, subMinutes } from "date-fns"

// Generate notifications data
const generateNotifications = () => {
  const now = new Date()

  return {
    unread: [
      {
        id: 1,
        title: "New patient registration",
        description: "Tendai Moyo has registered as a new patient",
        time: subMinutes(now, 10),
        category: "Patient",
        icon: Users,
        iconColor: "text-blue-500",
        read: false,
      },
      {
        id: 2,
        title: "Telehealth session reminder",
        description: "Upcoming session with Chipo Ncube in 30 minutes",
        time: subMinutes(now, 30),
        category: "Telehealth",
        icon: Calendar,
        iconColor: "text-emerald-500",
        read: false,
      },
      {
        id: 3,
        title: "ML insight alert",
        description: "Potential malaria outbreak detected in Bulawayo region",
        time: subHours(now, 2),
        category: "ML Alert",
        icon: Brain,
        iconColor: "text-red-500",
        read: false,
      },
      {
        id: 4,
        title: "Patient record updated",
        description: "Dr. Ndlovu updated Farai Sibanda's medical records",
        time: subHours(now, 4),
        category: "Records",
        icon: FileText,
        iconColor: "text-amber-500",
        read: false,
      },
      {
        id: 5,
        title: "System update completed",
        description: "The system has been updated to version 2.4.0",
        time: subHours(now, 6),
        category: "System",
        icon: CheckCircle2,
        iconColor: "text-emerald-500",
        read: false,
      },
    ],
    read: [
      {
        id: 6,
        title: "Medication supply alert",
        description: "Low stock of antimalarial medication detected",
        time: subDays(now, 1),
        category: "Supply",
        icon: Pill,
        iconColor: "text-amber-500",
        read: true,
      },
      {
        id: 7,
        title: "Patient follow-up reminder",
        description: "Follow-up required for Nyasha Mpofu's treatment",
        time: subDays(now, 2),
        category: "Patient",
        icon: Clock,
        iconColor: "text-blue-500",
        read: true,
      },
      {
        id: 8,
        title: "Telehealth session completed",
        description: "Session with Tatenda Dube was completed successfully",
        time: subDays(now, 3),
        category: "Telehealth",
        icon: CheckCheck,
        iconColor: "text-emerald-500",
        read: true,
      },
      {
        id: 9,
        title: "New message received",
        description: "You have a new message from Dr. Mutasa",
        time: subDays(now, 4),
        category: "Message",
        icon: MessageSquare,
        iconColor: "text-blue-500",
        read: true,
      },
      {
        id: 10,
        title: "Health metrics updated",
        description: "Regional health metrics have been updated",
        time: subDays(now, 5),
        category: "Analytics",
        icon: Activity,
        iconColor: "text-purple-500",
        read: true,
      },
    ],
    all: [], // Will be combined in useEffect
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const notificationsData = generateNotifications()
      notificationsData.all = [...notificationsData.unread, ...notificationsData.read]
      setNotifications(notificationsData)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)

    // Simulate refreshing data
    setTimeout(() => {
      const notificationsData = generateNotifications()
      notificationsData.all = [...notificationsData.unread, ...notificationsData.read]
      setNotifications(notificationsData)
      setRefreshing(false)

      toast({
        title: "Notifications refreshed",
        description: "Your notifications have been updated.",
      })
    }, 1500)
  }

  const handleSelectNotification = (id: number) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter((notificationId) => notificationId !== id))
    } else {
      setSelectedNotifications([...selectedNotifications, id])
    }
  }

  const handleSelectAll = (notificationsList: any[]) => {
    if (selectedNotifications.length === notificationsList.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(notificationsList.map((notification) => notification.id))
    }
  }

  const handleMarkAsRead = () => {
    if (selectedNotifications.length === 0) return

    // Simulate marking as read
    const updatedNotifications = { ...notifications }

    // Update unread notifications
    updatedNotifications.unread = updatedNotifications.unread.filter(
      (notification: any) => !selectedNotifications.includes(notification.id),
    )

    // Update read notifications and all notifications
    updatedNotifications.all = updatedNotifications.all.map((notification: any) => {
      if (selectedNotifications.includes(notification.id)) {
        return { ...notification, read: true }
      }
      return notification
    })

    // Move selected notifications to read
    const selectedNotificationsData = updatedNotifications.all.filter((notification: any) =>
      selectedNotifications.includes(notification.id),
    )
    updatedNotifications.read = [...selectedNotificationsData, ...updatedNotifications.read]

    setNotifications(updatedNotifications)
    setSelectedNotifications([])

    toast({
      title: "Notifications marked as read",
      description: `${selectedNotifications.length} notification(s) marked as read.`,
    })
  }

  const handleDelete = () => {
    if (selectedNotifications.length === 0) return

    // Simulate deleting notifications
    const updatedNotifications = { ...notifications }

    // Remove from all categories
    updatedNotifications.unread = updatedNotifications.unread.filter(
      (notification: any) => !selectedNotifications.includes(notification.id),
    )
    updatedNotifications.read = updatedNotifications.read.filter(
      (notification: any) => !selectedNotifications.includes(notification.id),
    )
    updatedNotifications.all = updatedNotifications.all.filter(
      (notification: any) => !selectedNotifications.includes(notification.id),
    )

    setNotifications(updatedNotifications)
    setSelectedNotifications([])

    toast({
      title: "Notifications deleted",
      description: `${selectedNotifications.length} notification(s) deleted.`,
    })
  }

  const formatNotificationTime = (time: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
      } else {
        return format(time, "MMM d, yyyy")
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            <p className="text-muted-foreground">Manage your system notifications and alerts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button variant="outline" onClick={handleMarkAsRead} disabled={selectedNotifications.length === 0}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark as Read
            </Button>
            <Button variant="outline" onClick={handleDelete} disabled={selectedNotifications.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" className="relative">
              All
              {!loading && notifications?.all.length > 0 && <Badge className="ml-2">{notifications.all.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {!loading && notifications?.unread.length > 0 && (
                <Badge className="ml-2 bg-red-500">{notifications.unread.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Notifications</CardTitle>
                    <CardDescription>View and manage all your system notifications</CardDescription>
                  </div>
                  {!loading && notifications?.all.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="select-all"
                        checked={
                          selectedNotifications.length === notifications.all.length && notifications.all.length > 0
                        }
                        onCheckedChange={() => handleSelectAll(notifications.all)}
                      />
                      <label htmlFor="select-all" className="text-sm">
                        Select All
                      </label>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications?.all.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center space-y-3">
                    <Bell className="h-10 w-10 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">No notifications to display.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.all.map((notification: any) => {
                      const Icon = notification.icon
                      return (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                            selectedNotifications.includes(notification.id) ? "bg-muted" : ""
                          } ${!notification.read ? "border-l-4 border-l-emerald-500" : ""}`}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <Icon className={`h-5 w-5 ${notification.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{notification.title}</h4>
                                <Badge variant="outline">{notification.category}</Badge>
                              </div>
                              <Checkbox
                                checked={selectedNotifications.includes(notification.id)}
                                onCheckedChange={() => handleSelectNotification(notification.id)}
                              />
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {formatNotificationTime(notification.time)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Unread Notifications</CardTitle>
                    <CardDescription>Notifications that require your attention</CardDescription>
                  </div>
                  {!loading && notifications?.unread.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="select-all-unread"
                        checked={
                          selectedNotifications.length === notifications.unread.length &&
                          notifications.unread.length > 0
                        }
                        onCheckedChange={() => handleSelectAll(notifications.unread)}
                      />
                      <label htmlFor="select-all-unread" className="text-sm">
                        Select All
                      </label>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications?.unread.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center space-y-3">
                    <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">No unread notifications.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.unread.map((notification: any) => {
                      const Icon = notification.icon
                      return (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-4 rounded-lg border border-l-4 border-l-emerald-500 p-4 transition-colors ${
                            selectedNotifications.includes(notification.id) ? "bg-muted" : ""
                          }`}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <Icon className={`h-5 w-5 ${notification.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{notification.title}</h4>
                                <Badge variant="outline">{notification.category}</Badge>
                              </div>
                              <Checkbox
                                checked={selectedNotifications.includes(notification.id)}
                                onCheckedChange={() => handleSelectNotification(notification.id)}
                              />
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {formatNotificationTime(notification.time)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Read Notifications</CardTitle>
                    <CardDescription>Previously viewed notifications</CardDescription>
                  </div>
                  {!loading && notifications?.read.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="select-all-read"
                        checked={
                          selectedNotifications.length === notifications.read.length && notifications.read.length > 0
                        }
                        onCheckedChange={() => handleSelectAll(notifications.read)}
                      />
                      <label htmlFor="select-all-read" className="text-sm">
                        Select All
                      </label>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications?.read.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center space-y-3">
                    <Bell className="h-10 w-10 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">No read notifications.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.read.map((notification: any) => {
                      const Icon = notification.icon
                      return (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                            selectedNotifications.includes(notification.id) ? "bg-muted" : ""
                          }`}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <Icon className={`h-5 w-5 ${notification.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{notification.title}</h4>
                                <Badge variant="outline">{notification.category}</Badge>
                              </div>
                              <Checkbox
                                checked={selectedNotifications.includes(notification.id)}
                                onCheckedChange={() => handleSelectNotification(notification.id)}
                              />
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {formatNotificationTime(notification.time)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
