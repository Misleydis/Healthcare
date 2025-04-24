"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Search, Download, Pill, Calendar, Clock, AlertCircle, Check, RefreshCw, Phone } from "lucide-react"
import { format, addDays } from "date-fns"
import useAuthStore from "@/lib/auth-store"

// Generate prescriptions data
const generatePrescriptions = (count = 10) => {
  const medications = [
    "Artemether/Lumefantrine",
    "Paracetamol",
    "Amoxicillin",
    "Metformin",
    "Hydrochlorothiazide",
    "Ibuprofen",
    "Ciprofloxacin",
    "Omeprazole",
    "Salbutamol",
    "Atorvastatin",
  ]

  const dosages = [
    "500mg twice daily",
    "1 tablet daily",
    "250mg three times daily",
    "850mg with meals",
    "25mg once daily",
    "400mg as needed",
    "500mg twice daily for 7 days",
    "20mg before breakfast",
    "2 puffs as needed",
    "10mg at bedtime",
  ]

  const doctors = ["Dr. Mutasa", "Dr. Chigumba", "Dr. Ndlovu", "Dr. Makoni", "Dr. Zimuto"]

  const statuses = ["Active", "Expired", "Refill Due", "Completed"]

  const today = new Date()

  return Array.from({ length: count }, (_, i) => {
    const prescriptionDate = new Date(today)
    prescriptionDate.setDate(today.getDate() - Math.floor(Math.random() * 90))

    const expiryDate = new Date(prescriptionDate)
    expiryDate.setDate(prescriptionDate.getDate() + 30)

    const medicationIndex = Math.floor(Math.random() * medications.length)

    let status = "Active"
    if (expiryDate < today) {
      status = "Expired"
    } else if (expiryDate < addDays(today, 7)) {
      status = "Refill Due"
    } else if (Math.random() > 0.7) {
      status = "Completed"
    }

    return {
      id: i + 1,
      medication: medications[medicationIndex],
      dosage: dosages[medicationIndex],
      doctor: doctors[Math.floor(Math.random() * doctors.length)],
      prescriptionDate,
      formattedPrescriptionDate: format(prescriptionDate, "MMM d, yyyy"),
      expiryDate,
      formattedExpiryDate: format(expiryDate, "MMM d, yyyy"),
      refillsRemaining: Math.floor(Math.random() * 3),
      status,
      instructions: "Take with food. Avoid alcohol while on this medication.",
      sideEffects: "May cause drowsiness, dizziness, or upset stomach.",
      doctorInitials: doctors[Math.floor(Math.random() * doctors.length)].substring(0, 2),
    }
  }).sort((a, b) => b.prescriptionDate.getTime() - a.prescriptionDate.getTime()) // Sort by date, newest first
}

export default function PrescriptionsPage() {
  const { userData } = useAuthStore()
  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : "User"

  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRefillDialogOpen, setIsRefillDialogOpen] = useState(false)
  const [refillLoading, setRefillLoading] = useState(false)
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [reminderTime, setReminderTime] = useState("08:00")
  const [reminderLoading, setReminderLoading] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPrescriptions(generatePrescriptions(15))
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    return (
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Group prescriptions by status
  const activePrescriptions = filteredPrescriptions.filter((prescription) => prescription.status === "Active")

  const refillDuePrescriptions = filteredPrescriptions.filter((prescription) => prescription.status === "Refill Due")

  const expiredPrescriptions = filteredPrescriptions.filter((prescription) => prescription.status === "Expired")

  const completedPrescriptions = filteredPrescriptions.filter((prescription) => prescription.status === "Completed")

  const handleViewPrescription = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsViewDialogOpen(true)
  }

  const handleRefillRequest = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsRefillDialogOpen(true)
  }

  const confirmRefill = () => {
    setRefillLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Refill requested",
        description: `Your refill request for ${selectedPrescription.medication} has been sent to your healthcare provider.`,
      })

      setRefillLoading(false)
      setIsRefillDialogOpen(false)
    }, 1500)
  }

  const handleSetReminder = (prescription: any) => {
    setSelectedPrescription(prescription)
    setShowReminderDialog(true)
  }

  const confirmReminder = () => {
    setReminderLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Reminder set",
        description: `You will receive daily reminders at ${reminderTime} for ${selectedPrescription.medication}.`,
      })

      setReminderLoading(false)
      setShowReminderDialog(false)
    }, 1500)
  }

  const downloadPrescription = () => {
    // Simulate download
    toast({
      title: "Prescription downloaded",
      description: "The prescription has been downloaded as PDF.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Prescriptions</h2>
            <p className="text-muted-foreground">View and manage your medication prescriptions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search prescriptions..."
                className="w-full pl-8 md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Contact Pharmacy
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active ({activePrescriptions.length})</TabsTrigger>
            <TabsTrigger value="refill">Refill Due ({refillDuePrescriptions.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({expiredPrescriptions.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Active Prescriptions</CardTitle>
                <CardDescription>Currently active medication prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activePrescriptions.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center space-y-3">
                    <Pill className="h-10 w-10 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">No active prescriptions found.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Prescribed By</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Refills</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activePrescriptions.map((prescription) => (
                          <TableRow key={prescription.id}>
                            <TableCell className="font-medium">{prescription.medication}</TableCell>
                            <TableCell>{prescription.dosage}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={`/placeholder.svg?height=24&width=24&text=${prescription.doctorInitials}`}
                                  />
                                  <AvatarFallback>{prescription.doctorInitials}</AvatarFallback>
                                </Avatar>
                                <span>{prescription.doctor}</span>
                              </div>
                            </TableCell>
                            <TableCell>{prescription.formattedExpiryDate}</TableCell>
                            <TableCell>
                              {prescription.refillsRemaining > 0 ? (
                                <Badge variant="outline">{prescription.refillsRemaining} remaining</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-100 text-red-800">
                                  No refills
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewPrescription(prescription)}>
                                  View
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleSetReminder(prescription)}>
                                  Reminder
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refill" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Refill Due Prescriptions</CardTitle>
                <CardDescription>Prescriptions that need to be refilled soon</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : refillDuePrescriptions.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center space-y-3">
                    <Check className="h-10 w-10 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">No prescriptions due for refill.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {refillDuePrescriptions.map((prescription) => (
                      <Card key={prescription.id} className="overflow-hidden border-amber-200">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                              <Pill className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{prescription.medication}</h4>
                              <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                            </div>
                            <Badge className="bg-amber-500 hover:bg-amber-600">Refill Due</Badge>
                          </div>
                          <div className="flex items-center justify-between p-4 md:w-1/3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Expires on</span>
                              <span className="text-sm text-muted-foreground">{prescription.formattedExpiryDate}</span>
                            </div>
                            <Button size="sm" onClick={() => handleRefillRequest(prescription)}>
                              Request Refill
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Expired Prescriptions</CardTitle>
                <CardDescription>Prescriptions that have expired and need renewal</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : expiredPrescriptions.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center space-y-3">
                    <Check className="h-10 w-10 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">No expired prescriptions.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expiredPrescriptions.map((prescription) => (
                      <Card key={prescription.id} className="overflow-hidden border-red-200">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex items-center gap-4 border-b p-4 md:w-2/3 md:border-b-0 md:border-r">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{prescription.medication}</h4>
                              <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                            </div>
                            <Badge variant="destructive">Expired</Badge>
                          </div>
                          <div className="flex items-center justify-between p-4 md:w-1/3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Expired on</span>
                              <span className="text-sm text-muted-foreground">{prescription.formattedExpiryDate}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleViewPrescription(prescription)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Completed Prescriptions</CardTitle>
                <CardDescription>Prescriptions that have been completed</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : completedPrescriptions.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center space-y-3">
                    <Pill className="h-10 w-10 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">No completed prescriptions found.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Prescribed By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedPrescriptions.map((prescription) => (
                          <TableRow key={prescription.id}>
                            <TableCell className="font-medium">{prescription.medication}</TableCell>
                            <TableCell>{prescription.dosage}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={`/placeholder.svg?height=24&width=24&text=${prescription.doctorInitials}`}
                                  />
                                  <AvatarFallback>{prescription.doctorInitials}</AvatarFallback>
                                </Avatar>
                                <span>{prescription.doctor}</span>
                              </div>
                            </TableCell>
                            <TableCell>{prescription.formattedPrescriptionDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewPrescription(prescription)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* View Prescription Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>View details of your medication prescription</DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Pill className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedPrescription.medication}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPrescription.dosage}</p>
                </div>
                <Badge
                  variant={
                    selectedPrescription.status === "Active"
                      ? "default"
                      : selectedPrescription.status === "Refill Due"
                        ? "outline"
                        : selectedPrescription.status === "Expired"
                          ? "destructive"
                          : "secondary"
                  }
                  className={
                    selectedPrescription.status === "Active"
                      ? "bg-green-500 hover:bg-green-600"
                      : selectedPrescription.status === "Refill Due"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : ""
                  }
                >
                  {selectedPrescription.status}
                </Badge>
              </div>

              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Prescribed on: {selectedPrescription.formattedPrescriptionDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Expires on: {selectedPrescription.formattedExpiryDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={`/placeholder.svg?height=24&width=24&text=${selectedPrescription.doctorInitials}`}
                    />
                    <AvatarFallback>{selectedPrescription.doctorInitials}</AvatarFallback>
                  </Avatar>
                  <span>Prescribed by: {selectedPrescription.doctor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  <span>Refills remaining: {selectedPrescription.refillsRemaining}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Instructions</Label>
                <div className="rounded-md border p-3">
                  <p>{selectedPrescription.instructions}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Possible Side Effects</Label>
                <div className="rounded-md border p-3">
                  <p>{selectedPrescription.sideEffects}</p>
                </div>
              </div>

              <DialogFooter>
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1" onClick={downloadPrescription}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  {selectedPrescription.status === "Active" || selectedPrescription.status === "Refill Due" ? (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setIsViewDialogOpen(false)
                        handleRefillRequest(selectedPrescription)
                      }}
                      disabled={selectedPrescription.refillsRemaining === 0}
                    >
                      Request Refill
                    </Button>
                  ) : null}
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refill Request Dialog */}
      <Dialog open={isRefillDialogOpen} onOpenChange={setIsRefillDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Medication Refill</DialogTitle>
            <DialogDescription>Submit a request to refill your prescription</DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <p className="font-medium">{selectedPrescription.medication}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPrescription.dosage} • Prescribed by {selectedPrescription.doctor}
                </p>
                <p className="mt-2 text-sm">
                  Refills remaining: <span className="font-medium">{selectedPrescription.refillsRemaining}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pharmacy">Preferred Pharmacy</Label>
                <Input
                  id="pharmacy"
                  defaultValue="Main Street Pharmacy, Harare"
                  placeholder="Enter pharmacy name and location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Input id="notes" placeholder="Any special instructions for your healthcare provider" />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRefillDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmRefill} disabled={refillLoading || selectedPrescription.refillsRemaining === 0}>
                  {refillLoading ? "Submitting..." : "Submit Refill Request"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Set Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Medication Reminder</DialogTitle>
            <DialogDescription>Set a daily reminder to take your medication</DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <p className="font-medium">{selectedPrescription.medication}</p>
                <p className="text-sm text-muted-foreground">{selectedPrescription.dosage}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderTime">Reminder Time</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">You will receive a notification at this time every day</p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmReminder} disabled={reminderLoading}>
                  {reminderLoading ? "Setting..." : "Set Reminder"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
