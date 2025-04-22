"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { User, Bell, Shield, Smartphone, Moon, Sun, Save, Upload, LogOut, Lock, FileText } from "lucide-react"
import useAuthStore from "@/lib/auth-store"
import { useSettingsStore } from "@/lib"

export default function SettingsPage() {
  const { toast } = useToast()
  const { token, logout } = useAuthStore()

  // Extract username from token or use a default
  const getUserDisplayName = () => {
    if (!token) return "User"

    try {
      // Assuming token is a JWT, decode it to get the email
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const payload = JSON.parse(window.atob(base64))

      // Extract username from email (remove domain)
      if (payload.email) {
        return payload.email.split("@")[0]
      }

      // Fallback to a simulated email
      return "user@mjshealthhub"
    } catch (error) {
      // If token parsing fails, use a simulated email
      return "user@mjshealthhub"
    }
  }

  const userEmail = getUserDisplayName()
  const userInitials = userEmail.substring(0, 2).toUpperCase()

  // Replace the useState and useEffect for settings with our settings store
  // Remove these lines:
  // const [loading, setLoading] = useState(true);
  // const [userProfile, setUserProfile] = useState<any>(null);
  // const [formData, setFormData] = useState({...});

  // Add this inside the component:
  const { settings, loading: settingsLoading, fetchSettings, updateSettings } = useSettingsStore()
  const { user, loading: userLoading, updateProfile } = useAuthStore()

  const loading = settingsLoading || userLoading

  // Use useEffect to fetch settings when the component mounts
  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // Create a formData state that combines user and settings data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    language: "english",
    theme: "light",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30m",
    },
  })

  // Update formData when user and settings are loaded
  useEffect(() => {
    if (user && settings) {
      setFormData({
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || `Dr. ${userEmail}`,
        email: user.email || `${userEmail}@mjshealthhub.org`,
        phone: user.phoneNumber || `+263 7${Math.floor(Math.random() * 10000000)}`,
        bio: user.specialty || "Healthcare professional specializing in rural medicine and telemedicine services.",
        language: settings.language || "english",
        theme: settings.theme || "light",
        notifications: {
          email: settings.notifications?.email || true,
          sms: settings.notifications?.sms || false,
          push: settings.notifications?.app || true,
        },
        security: {
          twoFactor: false,
          sessionTimeout: "30m",
        },
      })
    }
  }, [user, settings, userEmail])

  const [saving, setSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (category: string, name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category as keyof typeof formData],
        [name]: checked,
      },
    })
  }

  // Update the handleSaveProfile function to use updateProfile and updateSettings
  const handleSaveProfile = async () => {
    setSaving(true)

    try {
      // Update user profile
      await updateProfile({
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ").slice(1).join(" "),
        phoneNumber: formData.phone,
      })

      // Update settings
      await updateSettings({
        theme: formData.theme as "light" | "dark" | "system",
        language: formData.language,
        notifications: {
          email: formData.notifications.email,
          sms: formData.notifications.sms,
          app: formData.notifications.push,
        },
      })

      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile settings.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()

    toast({
      title: "Logged out",
      description: "You have been logged out of your account.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving || loading}>
            <Save className={`mr-2 h-4 w-4 ${saving ? "animate-spin" : ""}`} />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Sun className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${userInitials}`} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="font-medium">{formData.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{formData.email}</p>
                        <Button size="sm" variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={formData.language}
                          onValueChange={(value) => handleSelectChange("language", value)}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="shona">Shona</SelectItem>
                            <SelectItem value="ndebele">Ndebele</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                      <p className="text-xs text-muted-foreground">
                        Brief description of your professional background and expertise.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={formData.notifications.email}
                          onCheckedChange={(checked) => handleSwitchChange("notifications", "email", checked)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={formData.notifications.sms}
                          onCheckedChange={(checked) => handleSwitchChange("notifications", "sms", checked)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive in-app push notifications</p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={formData.notifications.push}
                          onCheckedChange={(checked) => handleSwitchChange("notifications", "push", checked)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the appearance and theme of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="flex gap-4">
                          <div
                            className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border p-4 ${
                              formData.theme === "light" ? "border-emerald-500 bg-emerald-50" : ""
                            }`}
                            onClick={() => handleSelectChange("theme", "light")}
                          >
                            <Sun className="h-6 w-6 text-amber-500" />
                            <span className="text-sm font-medium">Light</span>
                          </div>
                          <div
                            className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border p-4 ${
                              formData.theme === "dark" ? "border-emerald-500 bg-emerald-50" : ""
                            }`}
                            onClick={() => handleSelectChange("theme", "dark")}
                          >
                            <Moon className="h-6 w-6 text-blue-500" />
                            <span className="text-sm font-medium">Dark</span>
                          </div>
                          <div
                            className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border p-4 ${
                              formData.theme === "system" ? "border-emerald-500 bg-emerald-50" : ""
                            }`}
                            onClick={() => handleSelectChange("theme", "system")}
                          >
                            <Smartphone className="h-6 w-6 text-gray-500" />
                            <span className="text-sm font-medium">System</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="language-preference">Language Preference</Label>
                        <Select
                          value={formData.language}
                          onValueChange={(value) => handleSelectChange("language", value)}
                        >
                          <SelectTrigger id="language-preference">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="shona">Shona</SelectItem>
                            <SelectItem value="ndebele">Ndebele</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          id="two-factor"
                          checked={formData.security.twoFactor}
                          onCheckedChange={(checked) => handleSwitchChange("security", "twoFactor", checked)}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Session Timeout</Label>
                        <Select
                          value={formData.security.sessionTimeout}
                          onValueChange={(value) => handleSwitchChange("security", "sessionTimeout", value)}
                        >
                          <SelectTrigger id="session-timeout">
                            <SelectValue placeholder="Select timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15m">15 minutes</SelectItem>
                            <SelectItem value="30m">30 minutes</SelectItem>
                            <SelectItem value="1h">1 hour</SelectItem>
                            <SelectItem value="4h">4 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Automatically log out after a period of inactivity
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Account Actions</Label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Lock className="mr-2 h-4 w-4" />
                            Change Password
                          </Button>
                          <Button variant="outline" className="w-full sm:w-auto">
                            <FileText className="mr-2 h-4 w-4" />
                            Download Data
                          </Button>
                          <Button variant="destructive" className="w-full sm:w-auto" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
