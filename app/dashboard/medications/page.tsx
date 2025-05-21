"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Plus, AlertCircle, CheckCircle2, Pill, Info } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

import { useAuthStore } from "@/lib/auth-store"
import { useDataStore } from "@/lib/data-store"

export default function MedicationsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuthStore()
  const { medications, addMedication, updateMedication } = useDataStore()

  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "daily",
    time: "08:00",
    instructions: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    refillDate: "",
    refillReminder: false,
    notes: "",
  })

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("current")

  // Filter medications based on active tab
  const currentMedications = medications.filter((med) => !med.endDate || new Date(med.endDate) >= new Date())

  const pastMedications = medications.filter((med) => med.endDate && new Date(med.endDate) < new Date())

  const upcomingRefills = medications.filter(
    (med) =>
      med.refillDate &&
      new Date(med.refillDate) >= new Date() &&
      new Date(med.refillDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  )

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    addMedication({
      ...newMedication,
      id: Date.now().toString(),
      patientId: user?.id || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
    })

    toast({
      title: "Medication added",
      description: "Your medication has been added successfully",
    })

    setNewMedication({
      name: "",
      dosage: "",
      frequency: "daily",
      time: "08:00",
      instructions: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: "",
      refillDate: "",
      refillReminder: false,
      notes: "",
    })

    setOpenAddDialog(false)
  }

  const handleTakeMedication = (id: string) => {
    const medication = medications.find((med) => med.id === id)
    if (medication) {
      updateMedication(id, {
        ...medication,
        lastTaken: new Date().toISOString(),
      })

      toast({
        title: "Medication taken",
        description: `You've marked ${medication.name} as taken`,
      })
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medication Management</h1>
          <p className="text-muted-foreground">Track, manage, and set reminders for your medications</p>
        </div>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>Enter the details of your medication below</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name*
                </Label>
                <Input
                  id="name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                  Dosage*
                </Label>
                <Input
                  id="dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., 10mg, 1 tablet"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select
                  value={newMedication.frequency}
                  onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="twice-daily">Twice Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newMedication.endDate}
                  onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="refillDate" className="text-right">
                  Refill Date
                </Label>
                <Input
                  id="refillDate"
                  type="date"
                  value={newMedication.refillDate}
                  onChange={(e) => setNewMedication({ ...newMedication, refillDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="refillReminder" className="text-right">
                  Refill Reminder
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="refillReminder"
                    checked={newMedication.refillReminder}
                    onCheckedChange={(checked) => setNewMedication({ ...newMedication, refillReminder: checked })}
                  />
                  <Label htmlFor="refillReminder">Enable reminder</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instructions" className="text-right">
                  Instructions
                </Label>
                <Input
                  id="instructions"
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Take with food"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  value={newMedication.notes}
                  onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMedication}>Add Medication</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {upcomingRefills.length > 0 && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upcoming Refills</AlertTitle>
          <AlertDescription>
            You have {upcomingRefills.length} medication{upcomingRefills.length > 1 ? "s" : ""} that need to be refilled
            soon.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="current">Current Medications</TabsTrigger>
          <TabsTrigger value="past">Past Medications</TabsTrigger>
          <TabsTrigger value="refills">Upcoming Refills</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {currentMedications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Pill className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No Current Medications</h3>
              <p className="text-muted-foreground mt-2">
                You don't have any current medications. Click "Add Medication" to add one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentMedications.map((medication) => (
                <Card key={medication.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{medication.name}</CardTitle>
                      <Badge variant={medication.status === "active" ? "default" : "outline"}>
                        {medication.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{medication.dosage}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {medication.frequency === "daily" && "Daily"}
                          {medication.frequency === "twice-daily" && "Twice Daily"}
                          {medication.frequency === "weekly" && "Weekly"}
                          {medication.frequency === "monthly" && "Monthly"}
                          {medication.frequency === "as-needed" && "As Needed"}
                          {medication.time && ` at ${medication.time}`}
                        </span>
                      </div>
                      {medication.instructions && (
                        <div className="flex items-center text-sm">
                          <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{medication.instructions}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Started: {format(new Date(medication.startDate), "MMM d, yyyy")}</span>
                      </div>
                      {medication.refillDate && (
                        <div className="flex items-center text-sm">
                          <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Refill by: {format(new Date(medication.refillDate), "MMM d, yyyy")}</span>
                        </div>
                      )}
                      {medication.lastTaken && (
                        <div className="flex items-center text-sm">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                          <span>Last taken: {format(new Date(medication.lastTaken), "MMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="default" className="w-full" onClick={() => handleTakeMedication(medication.id)}>
                      Mark as Taken
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastMedications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Pill className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No Past Medications</h3>
              <p className="text-muted-foreground mt-2">You don't have any past medications in your history.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastMedications.map((medication) => (
                <Card key={medication.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{medication.name}</CardTitle>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <CardDescription>{medication.dosage}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {medication.frequency === "daily" && "Daily"}
                          {medication.frequency === "twice-daily" && "Twice Daily"}
                          {medication.frequency === "weekly" && "Weekly"}
                          {medication.frequency === "monthly" && "Monthly"}
                          {medication.frequency === "as-needed" && "As Needed"}
                        </span>
                      </div>
                      {medication.instructions && (
                        <div className="flex items-center text-sm">
                          <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{medication.instructions}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(medication.startDate), "MMM d, yyyy")} -{" "}
                          {format(new Date(medication.endDate || ""), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="refills">
          {upcomingRefills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Pill className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No Upcoming Refills</h3>
              <p className="text-muted-foreground mt-2">
                You don't have any medications that need to be refilled soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingRefills.map((medication) => (
                <Card key={medication.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{medication.name}</CardTitle>
                      <Badge variant="destructive">Refill Soon</Badge>
                    </div>
                    <CardDescription>{medication.dosage}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                        <span>Refill by: {format(new Date(medication.refillDate || ""), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {medication.frequency === "daily" && "Daily"}
                          {medication.frequency === "twice-daily" && "Twice Daily"}
                          {medication.frequency === "weekly" && "Weekly"}
                          {medication.frequency === "monthly" && "Monthly"}
                          {medication.frequency === "as-needed" && "As Needed"}
                        </span>
                      </div>
                      {medication.instructions && (
                        <div className="flex items-center text-sm">
                          <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{medication.instructions}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Refill Requested",
                          description: "Your refill request has been sent to your pharmacy.",
                        })
                      }}
                    >
                      Request Refill
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
