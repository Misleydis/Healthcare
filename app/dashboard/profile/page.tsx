"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Save, Upload, Loader2 } from "lucide-react"
import useAuthStore from "@/lib/auth-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfilePage() {
  const { userData, updateUserData } = useAuthStore()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
    address: userData?.address || "",
    specialty: userData?.specialty || "",
    bio: userData?.bio || "Healthcare professional with experience in rural medicine and telemedicine services.",
  })

  const userInitials =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName[0]}${userData.lastName[0]}`
      : (userData?.email || "").substring(0, 2).toUpperCase()

  const userRole = userData?.role || "patient"
  const createdAt = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSaveProfile = async () => {
    setSaving(true)

    try {
      const success = await updateUserData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        specialty: formData.specialty,
        bio: formData.bio,
      })

      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
            <p className="text-muted-foreground">View and manage your personal information</p>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`/placeholder.svg?height=96&width=96&text=${userInitials}`} />
                  <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload avatar</span>
                </Button>
              </div>
              <h3 className="text-xl font-bold">
                {userData?.firstName} {userData?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
              {userData?.specialty && <p className="text-sm text-muted-foreground">{userData.specialty}</p>}

              <Separator className="my-4" />

              <div className="w-full space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData?.email}</span>
                </div>
                {userData?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userData.phoneNumber}</span>
                  </div>
                )}
                {userData?.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userData.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined {createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    <User className="mr-1 inline-block h-4 w-4" />
                    First Name
                  </Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    <User className="mr-1 inline-block h-4 w-4" />
                    Last Name
                  </Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="mr-1 inline-block h-4 w-4" />
                  Email
                </Label>
                <Input id="email" name="email" value={formData.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    <Phone className="mr-1 inline-block h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                {(userRole === "doctor" || userRole === "nurse") && (
                  <div className="space-y-2">
                    <Label htmlFor="specialty">
                      <Briefcase className="mr-1 inline-block h-4 w-4" />
                      Specialty
                    </Label>
                    <Select
                      value={formData.specialty}
                      onValueChange={(value) => handleInputChange({ target: { name: "specialty", value } } as any)}
                    >
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder={userRole === "nurse" ? "Select your nursing specialty" : "Select your medical specialty"} className="text-muted-foreground data-[state=checked]:text-foreground" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRole === "nurse" ? (
                          <>
                            <SelectItem value="Pediatric Nurse">Pediatric Nurse</SelectItem>
                            <SelectItem value="Surgical Nurse">Surgical/Operating Room Nurse</SelectItem>
                            <SelectItem value="Oncology Nurse">Oncology Nurse</SelectItem>
                            <SelectItem value="Critical Care Nurse">Critical Care (ICU) Nurse</SelectItem>
                            <SelectItem value="Emergency Nurse">Emergency/Trauma Nurse</SelectItem>
                            <SelectItem value="Psychiatric Nurse">Psychiatric Nurse</SelectItem>
                            <SelectItem value="Cardiac Nurse">Cardiac (Heart) Nurse</SelectItem>
                            <SelectItem value="Neonatal Nurse">Neonatal Nurse</SelectItem>
                            <SelectItem value="Geriatric Nurse">Geriatric Nurse</SelectItem>
                            <SelectItem value="Public Health Nurse">Public Health Nurse</SelectItem>
                            <SelectItem value="School Nurse">School Nurse</SelectItem>
                            <SelectItem value="Home Health Nurse">Home Health Nurse</SelectItem>
                            <SelectItem value="Hospice Nurse">Hospice Nurse</SelectItem>
                            <SelectItem value="Rehabilitation Nurse">Rehabilitation Nurse</SelectItem>
                            <SelectItem value="Occupational Health Nurse">Occupational Health Nurse</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="General Practitioner">General Practitioner</SelectItem>
                            <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                            <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                            <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                            <SelectItem value="Neurologist">Neurologist</SelectItem>
                            <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                            <SelectItem value="Gynecologist">Gynecologist</SelectItem>
                            <SelectItem value="Orthopedic Surgeon">Orthopedic Surgeon</SelectItem>
                            <SelectItem value="Ophthalmologist">Ophthalmologist</SelectItem>
                            <SelectItem value="ENT Specialist">ENT Specialist</SelectItem>
                            <SelectItem value="Urologist">Urologist</SelectItem>
                            <SelectItem value="Gastroenterologist">Gastroenterologist</SelectItem>
                            <SelectItem value="Endocrinologist">Endocrinologist</SelectItem>
                            <SelectItem value="Rheumatologist">Rheumatologist</SelectItem>
                            <SelectItem value="Pulmonologist">Pulmonologist</SelectItem>
                            <SelectItem value="Infectious Disease Specialist">Infectious Disease Specialist</SelectItem>
                            <SelectItem value="Oncologist">Oncologist</SelectItem>
                            <SelectItem value="Nephrologist">Nephrologist</SelectItem>
                            <SelectItem value="Hematologist">Hematologist</SelectItem>
                            <SelectItem value="Allergist">Allergist</SelectItem>
                            <SelectItem value="Geriatrician">Geriatrician</SelectItem>
                            <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                            <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                            <SelectItem value="Sports Medicine">Sports Medicine</SelectItem>
                            <SelectItem value="Preventive Medicine">Preventive Medicine</SelectItem>
                            <SelectItem value="Pain Management">Pain Management</SelectItem>
                            <SelectItem value="Palliative Care">Palliative Care</SelectItem>
                            <SelectItem value="Sleep Medicine">Sleep Medicine</SelectItem>
                            <SelectItem value="Rehabilitation Medicine">Rehabilitation Medicine</SelectItem>
                            <SelectItem value="Occupational Medicine">Occupational Medicine</SelectItem>
                            <SelectItem value="Public Health">Public Health</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="mr-1 inline-block h-4 w-4" />
                  Address
                </Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                <p className="text-xs text-muted-foreground">
                  Brief description of your professional background and expertise.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
