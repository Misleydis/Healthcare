"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Check, Clock, Plus, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import useAuthStore from "@/lib/auth-store"

// Sample medication data
const medications = [
  {
    id: "1",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2023-01-15",
    endDate: null,
    instructions: "Take in the morning with food",
    prescribedBy: "Dr. Sarah Johnson",
    status: "active",
    refillDate: "2023-06-15",
    timesPerDay: 1,
    timeOfDay: ["morning"],
  },
  {
    id: "2",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "2023-02-10",
    endDate: null,
    instructions: "Take with meals",
    prescribedBy: "Dr. Michael Chen",
    status: "active",
    refillDate: "2023-06-20",
    timesPerDay: 2,
    timeOfDay: ["morning", "evening"],
  },
  {
    id: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    startDate: "2023-03-05",
    endDate: null,
    instructions: "Take in the evening",
    prescribedBy: "Dr. Sarah Johnson",
    status: "active",
    refillDate: "2023-06-25",
    timesPerDay: 1,
    timeOfDay: ["evening"],
  },
  {
    id: "4",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    startDate: "2023-04-10",
    endDate: "2023-04-20",
    instructions: "Take until completed",
    prescribedBy: "Dr. Michael Chen",
    status: "completed",
    refillDate: null,
    timesPerDay: 3,
    timeOfDay: ["morning", "afternoon", "evening"],
  },
]

export default function MedicationsPage() {
  const { userData } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [activeTab, setActiveTab] = useState("current")

  const currentMedications = medications.filter((med) => med.status === "active")
  const pastMedications = medications.filter((med) => med.status === "completed")
  const upcomingRefills = medications.filter((med) => med.refillDate && new Date(med.refillDate) > new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
          <p className="text-muted-foreground">Manage your medications, set reminders, and request refills</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>Enter the details of your medication. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                  Dosage
                </Label>
                <Input id="dosage" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once daily</SelectItem>
                    <SelectItem value="twice">Twice daily</SelectItem>
                    <SelectItem value="three">Three times daily</SelectItem>
                    <SelectItem value="four">Four times daily</SelectItem>
                    <SelectItem value="asneeded">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prescribedBy" className="text-right">
                  Prescribed By
                </Label>
                <Input id="prescribedBy" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instructions" className="text-right">
                  Instructions
                </Label>
                <Textarea id="instructions" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setOpen(false)}>
                Save medication
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Medications</TabsTrigger>
          <TabsTrigger value="past">Past Medications</TabsTrigger>
          <TabsTrigger value="refills">Upcoming Refills</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4 mt-6">
          {currentMedications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground text-center">You don't have any current medications.</p>
                <Button className="mt-4" onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </CardContent>
            </Card>
          ) : (
            currentMedications.map((medication) => (
              <Card key={medication.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {medication.name} {medication.dosage}
                      </CardTitle>
                      <CardDescription>{medication.frequency}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                    >
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Instructions</p>
                      <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Prescribed By</p>
                      <p className="text-sm text-muted-foreground">{medication.prescribedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">{medication.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Next Refill</p>
                      <p className="text-sm text-muted-foreground">{medication.refillDate || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                      {medication.timeOfDay.map((time) => (
                        <Badge key={time} variant="secondary" className="capitalize">
                          {time}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Clock className="mr-2 h-4 w-4" />
                        Set Reminder
                      </Button>
                      <Button size="sm" variant="outline">
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Taken
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Request Refill
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-4 mt-6">
          {pastMedications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground text-center">You don't have any past medications.</p>
              </CardContent>
            </Card>
          ) : (
            pastMedications.map((medication) => (
              <Card key={medication.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {medication.name} {medication.dosage}
                      </CardTitle>
                      <CardDescription>{medication.frequency}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-700">
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Instructions</p>
                      <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Prescribed By</p>
                      <p className="text-sm text-muted-foreground">{medication.prescribedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">{medication.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">{medication.endDate || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="refills" className="space-y-4 mt-6">
          {upcomingRefills.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground text-center">You don't have any upcoming refills.</p>
              </CardContent>
            </Card>
          ) : (
            upcomingRefills.map((medication) => (
              <Card key={medication.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {medication.name} {medication.dosage}
                      </CardTitle>
                      <CardDescription>{medication.frequency}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700">
                      Refill Soon
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Instructions</p>
                      <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Prescribed By</p>
                      <p className="text-sm text-muted-foreground">{medication.prescribedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Refill Date</p>
                      <p className="text-sm text-muted-foreground">{medication.refillDate}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Request Refill
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
