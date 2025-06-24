"use client"

import { useState } from "react"
import { Bell, Calendar, FileText, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import useAuthStore from "@/lib/auth-store"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "appointment" | "message" | "prescription" | "record" | "system"
  action?: string
}

export default function NotificationsPage() {
  const { userData } = useAuthStore()
  const { toast } = useToast()
  const role = userData?.role || "patient"
  
  const getInitialNotifications = (): Notification[] => {
    // For new users, return an empty array
    if (!userData?.createdAt || new Date(userData.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return []
    }

    if (role === "patient") {
      return [
        {
          id: "1",
          title: "Appointment Reminder",
          description: "Your appointment with Dr. Sarah Johnson is tomorrow at 2:00 PM",
          time: "1 hour ago",
          read: false,
          type: "appointment",
          action: "View"
        },
        {
          id: "2",
          title: "New Prescription",
          description: "Dr. Michael Chen has prescribed Amoxicillin 500mg",
          time: "3 hours ago",
          read: false,
          type: "prescription",
          action: "View"
        },
        {
          id: "3",
          title: "Test Results Available",
          description: "Your blood test results are now available",
          time: "Yesterday",
          read: true,
          type: "record",
          action: "View"
        },
        {
          id: "4",
          title: "Telehealth Session",
          description: "Your telehealth session with Dr. Emily Rodriguez is scheduled for May 15",
          time: "2 days ago",
          read: true,
          type: "appointment",
          action: "Join"
        },
        {
          id: "5",
          title: "Medication Reminder",
          description: "Remember to take your Lisinopril medication",
          time: "3 days ago",
          read: true,
          type: "prescription"
        }
      ]
    } else if (role === "doctor") {
      return [
        {
          id: "1",
          title: "New Patient Appointment",
          description: "John Smith has scheduled an appointment for tomorrow at 2:00 PM",
          time: "1 hour ago",
          read: false,
          type: "appointment",
          action: "View"
        },
        {
          id: "2",
          title: "Lab Results Ready",
          description: "Maria Garcia's lab results are ready for review",
          time: "3 hours ago",
          read: false,
          type: "record",
          action: "View"
        },
        {
          id: "3",
          title: "Prescription Refill Request",
          description: "Robert Johnson has requested a refill for Metformin",
          time: "Yesterday",
          read: true,
          type: "prescription",
          action: "Approve"
        },
        {
          id: "4",
          title: "Telehealth Session",
          description: "Your telehealth session with Sarah Williams is scheduled for May 15",
          time: "2 days ago",
          read: true,
          type: "appointment",
          action: "Join"
        },
        {
          id: "5",
          title: "Medical Record Update",
          description: "James Brown's medical record has been updated",
          time: "3 days ago",
          read: true,
          type: "record",
          action: "View"
        }
      ]
    } else {
      // Admin notifications
      return [
        {
          id: "1",
          title: "System Update",
          description: "System maintenance scheduled for May 20 at 2:00 AM",
          time: "1 hour ago",
          read: false,
          type: "system"
        },
        {
          id: "2",
          title: "New User Registration",
          description: "5 new users have registered in the last 24 hours",
          time: "3 hours ago",
          read: false,
          type: "system",
          action: "View"
        },
        {
          id: "3",
          title: "Database Backup",
          description: "Weekly database backup completed successfully",
          time: "Yesterday",
          read: true,
          type: "system"
        },
        {
          id: "4",
          title: "User Report",
          description: "Monthly user activity report is ready",
          time: "2 days ago",
          read: true,
          type: "system",
          action: "View"
        },
        {
          id: "5",
          title: "Security Alert",
          description: "Multiple failed login attempts detected",
          time: "3 days ago",
          read: true,
          type: "system",
          action: "Review"
        }
      ]
    }
  }

  const [notifications, setNotifications] = useState<Notification[]>(getInitialNotifications())

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read",
    })
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "message":
        return <Bell className="h-5 w-5 text-green-500" />
      case "prescription":
        return <Pill className="h-5 w-5 text-purple-500" />
      case "record":
        return <FileText className="h-5 w-5 text-yellow-500" />
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const handleAction = (notification: Notification) => {
    toast({
      title: `Action: ${notification.action}`,
      description: `Performing action on: ${notification.title}`,
    })
    
    // Mark as read when action is taken
    markAsRead(notification.id)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            You have {unreadCount} unread notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {notifications.length === 0 ? (
            <div className="mt-6 rounded-lg border p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {role === "patient" 
                  ? "Welcome! You don't have any notifications yet. They will appear here when you have appointments, messages, or updates."
                  : "You don't have any notifications at the moment. They will appear here when you have new updates."}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read ? "bg-background" : "bg-muted"
                }`}
              >
                <div className="flex items-start gap-4">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    {notification.action && (
                      <Button
                        variant="link"
                        className="mt-2 p-0 h-auto"
                        onClick={() => handleAction(notification)}
                      >
                        {notification.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
        <TabsContent value="unread" className="space-y-4">
          {notifications.filter((n) => !n.read).length === 0 ? (
            <div className="mt-6 rounded-lg border p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No unread notifications</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You don't have any unread notifications at the moment.
              </p>
            </div>
          ) : (
            notifications
              .filter((n) => !n.read)
              .map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 rounded-lg border bg-muted"
                >
                  <div className="flex items-start gap-4">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      {notification.action && (
                        <Button
                          variant="link"
                          className="mt-2 p-0 h-auto"
                          onClick={() => handleAction(notification)}
                        >
                          {notification.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
