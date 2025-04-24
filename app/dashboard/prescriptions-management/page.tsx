"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import useAuthStore from "@/lib/auth-store"

// Mock prescription data
const mockPrescriptions = [
  {
    id: "1",
    patientName: "John Smith",
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    duration: "30 days",
    notes: "Take with food",
    status: "Active",
    dateIssued: "2023-04-15",
    refills: 2,
  },
  {
    id: "2",
    patientName: "Sarah Johnson",
    medication: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    duration: "90 days",
    notes: "Take with meals",
    status: "Active",
    dateIssued: "2023-04-10",
    refills: 3,
  },
  {
    id: "3",
    patientName: "Robert Williams",
    medication: "Ibuprofen",
    dosage: "400mg",
    frequency: "As needed",
    duration: "7 days",
    notes: "For pain relief",
    status: "Expired",
    dateIssued: "2023-03-28",
    refills: 0,
  },
  {
    id: "4",
    patientName: "Emily Davis",
    medication: "Albuterol",
    dosage: "90mcg",
    frequency: "As needed",
    duration: "30 days",
    notes: "For asthma attacks",
    status: "Active",
    dateIssued: "2023-04-05",
    refills: 1,
  },
]

// Mock patients for dropdown
const mockPatients = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Robert Williams" },
  { id: "4", name: "Emily Davis" },
  { id: "5", name: "Michael Brown" },
]

export default function PrescriptionsManagementPage() {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuthStore()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle adding a new prescription
  const handleAddPrescription = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newPrescription = {
      id: (prescriptions.length + 1).toString(),
      patientName: formData.get("patientName"),
      medication: formData.get("medication"),
      dosage: formData.get("dosage"),
      frequency: formData.get("frequency"),
      duration: formData.get("duration"),
      notes: formData.get("notes"),
      status: "Active",
      dateIssued: new Date().toISOString().split("T")[0],
      refills: Number.parseInt(formData.get("refills")),
    }

    setPrescriptions([...prescriptions, newPrescription])
    setIsAddDialogOpen(false)
    toast({
      title: "Prescription added",
      description: `Prescription for ${newPrescription.patientName} has been created.`,
    })
  }

  // Handle editing a prescription
  const handleEditPrescription = (e) => {
    e.preventDefault()
    if (!selectedPrescription) return

    const formData = new FormData(e.target)
    const updatedPrescription = {
      ...selectedPrescription,
      medication: formData.get("medication"),
      dosage: formData.get("dosage"),
      frequency: formData.get("frequency"),
      duration: formData.get("duration"),
      notes: formData.get("notes"),
      refills: Number.parseInt(formData.get("refills")),
    }

    setPrescriptions(prescriptions.map((p) => (p.id === selectedPrescription.id ? updatedPrescription : p)))
    setIsEditDialogOpen(false)
    toast({
      title: "Prescription updated",
      description: `Prescription for ${updatedPrescription.patientName} has been updated.`,
    })
  }

  // Handle deleting a prescription
  const handleDeletePrescription = () => {
    if (!selectedPrescription) return

    setPrescriptions(prescriptions.filter((p) => p.id !== selectedPrescription.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Prescription removed",
      description: `Prescription for ${selectedPrescription.patientName} has been removed.`,
      variant: "destructive",
    })
    setSelectedPrescription(null)
  }

  // Check if user is a doctor
  if (user?.role !== "doctor") {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Restricted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">This page is only accessible to medical professionals.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="bg-gray-200 animate-pulse rounded h-[500px] w-full"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prescription Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Prescription</DialogTitle>
              <DialogDescription>Enter the prescription details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPrescription}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="patientName" className="text-right">
                    Patient
                  </label>
                  <select
                    id="patientName"
                    name="patientName"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select a patient</option>
                    {mockPatients.map((patient) => (
                      <option key={patient.id} value={patient.name}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="medication" className="text-right">
                    Medication
                  </label>
                  <Input id="medication" name="medication" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="dosage" className="text-right">
                    Dosage
                  </label>
                  <Input id="dosage" name="dosage" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="frequency" className="text-right">
                    Frequency
                  </label>
                  <Input id="frequency" name="frequency" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="duration" className="text-right">
                    Duration
                  </label>
                  <Input id="duration" name="duration" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="refills" className="text-right">
                    Refills
                  </label>
                  <Input id="refills" name="refills" type="number" min="0" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="notes" className="text-right">
                    Notes
                  </label>
                  <Textarea id="notes" name="notes" className="col-span-3" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Prescription</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Input
        type="search"
        placeholder="Search prescriptions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle>{prescription.patientName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Medication:</strong> {prescription.medication}
              </p>
              <p>
                <strong>Dosage:</strong> {prescription.dosage}
              </p>
              <p>
                <strong>Frequency:</strong> {prescription.frequency}
              </p>
              <p>
                <strong>Refills:</strong> {prescription.refills}
              </p>
              <div className="flex justify-end mt-4">
                <Dialog
                  open={isEditDialogOpen && selectedPrescription?.id === prescription.id}
                  onOpenChange={() => setIsEditDialogOpen(false)}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPrescription(prescription)}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Edit Prescription</DialogTitle>
                      <DialogDescription>Update the prescription details below.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditPrescription}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="medication" className="text-right">
                            Medication
                          </label>
                          <Input
                            id="medication"
                            name="medication"
                            className="col-span-3"
                            defaultValue={prescription.medication}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="dosage" className="text-right">
                            Dosage
                          </label>
                          <Input
                            id="dosage"
                            name="dosage"
                            className="col-span-3"
                            defaultValue={prescription.dosage}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="frequency" className="text-right">
                            Frequency
                          </label>
                          <Input
                            id="frequency"
                            name="frequency"
                            className="col-span-3"
                            defaultValue={prescription.frequency}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="duration" className="text-right">
                            Duration
                          </label>
                          <Input
                            id="duration"
                            name="duration"
                            className="col-span-3"
                            defaultValue={prescription.duration}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="refills" className="text-right">
                            Refills
                          </label>
                          <Input
                            id="refills"
                            name="refills"
                            type="number"
                            min="0"
                            className="col-span-3"
                            defaultValue={prescription.refills}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="notes" className="text-right">
                            Notes
                          </label>
                          <Textarea
                            id="notes"
                            name="notes"
                            className="col-span-3"
                            rows={3}
                            defaultValue={prescription.notes}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Update Prescription</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={isDeleteDialogOpen && selectedPrescription?.id === prescription.id}
                  onOpenChange={() => setIsDeleteDialogOpen(false)}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setSelectedPrescription(prescription)}>
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete the prescription.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" variant="destructive" onClick={handleDeletePrescription}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
