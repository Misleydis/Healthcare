import { create } from "zustand"
import api from "./api"

interface NotificationSettings {
  email: boolean
  sms: boolean
  app: boolean
}

interface Settings {
  userId: string
  theme: "light" | "dark" | "system"
  notifications: NotificationSettings
  language: string
  timezone: string
  updatedAt: string
}

interface SettingsState {
  settings: Settings | null
  loading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
  updateSettings: (settingsData: Partial<Settings>) => Promise<boolean>
  updateTheme: (theme: "light" | "dark" | "system") => Promise<boolean>
  updateNotificationSettings: (notificationSettings: Partial<NotificationSettings>) => Promise<boolean>
  updateLanguage: (language: string) => Promise<boolean>
  updateTimezone: (timezone: string) => Promise<boolean>
}

const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/settings")
      set({ settings: response.data, loading: false })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch settings",
      })
    }
  },

  updateSettings: async (settingsData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put("/settings", settingsData)
      set({ settings: response.data, loading: false })
      return true
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update settings",
      })
      return false
    }
  },

  updateTheme: async (theme) => {
    const { settings } = get()
    if (!settings) return false

    return get().updateSettings({ theme })
  },

  updateNotificationSettings: async (notificationSettings) => {
    const { settings } = get()
    if (!settings) return false

    return get().updateSettings({
      notifications: { ...settings.notifications, ...notificationSettings },
    })
  },

  updateLanguage: async (language) => {
    return get().updateSettings({ language })
  },

  updateTimezone: async (timezone) => {
    return get().updateSettings({ timezone })
  },
}))

export default useSettingsStore
