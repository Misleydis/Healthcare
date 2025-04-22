import { create } from "zustand"
import api from "./api"

interface Notification {
  _id: string
  userId: string
  title: string
  message: string
  type: "appointment" | "message" | "system" | "alert"
  isRead: boolean
  relatedId?: string
  relatedModel?: string
  createdAt: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  fetchNotifications: (page?: number, limit?: number, isRead?: boolean) => Promise<void>
  markAsRead: (id: string) => Promise<boolean>
  markAllAsRead: () => Promise<boolean>
  deleteNotification: (id: string) => Promise<boolean>
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,

  fetchNotifications: async (page = 1, limit = 10, isRead?: boolean) => {
    set({ loading: true, error: null })
    try {
      let queryParams = `?page=${page}&limit=${limit}`
      if (isRead !== undefined) queryParams += `&isRead=${isRead}`

      const response = await api.get(`/notifications${queryParams}`)

      set({
        notifications: response.data.notifications || [],
        unreadCount: response.data.unreadCount || 0,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        loading: false,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch notifications",
      })
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await api.put(`/notifications/${id}/read`)
      const updatedNotification = response.data

      // Update the notifications list with the read notification
      const { notifications, unreadCount } = get()
      set({
        notifications: notifications.map((n) => (n._id === id ? updatedNotification : n)),
        unreadCount: unreadCount > 0 ? unreadCount - 1 : 0,
      })

      return true
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error)
      return false
    }
  },

  markAllAsRead: async () => {
    try {
      await api.put("/notifications/read-all")

      // Update all notifications as read
      const { notifications } = get()
      set({
        notifications: notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      })

      return true
    } catch (error: any) {
      console.error("Failed to mark all notifications as read:", error)
      return false
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`)

      // Remove the deleted notification from the list
      const { notifications, unreadCount } = get()
      const notification = notifications.find((n) => n._id === id)

      set({
        notifications: notifications.filter((n) => n._id !== id),
        unreadCount: notification && !notification.isRead && unreadCount > 0 ? unreadCount - 1 : unreadCount,
      })

      return true
    } catch (error: any) {
      console.error("Failed to delete notification:", error)
      return false
    }
  },
}))

export default useNotificationStore
