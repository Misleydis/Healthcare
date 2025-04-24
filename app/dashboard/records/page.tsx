"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Download, Upload, Edit, Trash2, Eye, Calendar } from "lucide-react"
import { format } from "date-fns"

// Generate random patient records
const generatePatientRecords = (count = 10) => {
  const patientNames = [
    "Tendai Moyo",
    "Chipo Ncube",
    "Tatenda Dube",
    "Farai Sibanda",
    "Nyasha Mpofu",
    "Kudzai Ndlovu",
    "Tafadzwa Mutasa",
    "Rumbidzai Chigumba",
    "Simba Makoni",
    "Vimbai Zimuto",
  ]

  const recordTypes = [
    "Medical Examination",
    "Lab Results",
    "Prescription",
    "Vaccination",
    "Telehealth Consultation",
    "Diagnosis",
    "Treatment Plan",
    "Follow-up",
  ]

  const diagnoses = [
    "Malaria",
    "Hypertension",
    "Diabetes Type 2",
    "Respiratory Infection",
    "Prenatal Care",
    "Malnutrition",
    "Typhoid",
    "HIV Management",
    "Tuberculosis",
    "General Checkup",
  ]

  const doctors = ["Dr. Mutasa", "Dr. Chigumba", "Dr. Ndlovu", "Dr. Makoni", "Dr. Zimuto"]

  // Get current date
  const today = new Date()

  return Array.from({ length: count }, (_, i) => {
    // Generate a date within the last 180 days
    const recordDate = new Date(today)
    recordDate.setDate(today.getDate() - Math.floor(Math.random() * 180))

    const patientName = patientNames[Math.floor(Math.random() * patientNames.length)]
    const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)]
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)]
    const doctor = doctors[Math.floor(Math.random() * doctors.length)]

    return {
      id: i + 1,
      patientName,
      patientId: `P${1000 + Math.floor(Math.random() * 9000)}`,
      recordType,
      diagnosis,
      doctor,
      date: recordDate,
      formattedDate: format(recordDate, "MMM d, yyyy"),
      notes: `Patient presented with symptoms of ${diagnosis.toLowerCase()}. Recommended treatment and follow-up in 2 weeks.`,
      status: Math.random() > 0.3 ? "Complete" : "Pending",
      initials: patientName
        .split(" ")
        .map((n) => n[0])
        .join(""),
    }
  }).sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by date, newest first
}

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editedNotes, setEditedNotes] = useState("")
  const [newRecordData, setNewRecordData] = useState({
    patientId: "",
    recordType: "",
    diagnosis: "",
    notes: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setRecords(generatePatientRecords(30))
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter records based on search term
  const filteredRecords = records.filter((record) => {
    return (
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recordType.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record)
    setIsViewDialogOpen(true)
  }

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record)
    setEditedNotes(record.notes)
    setIsEditDialogOpen(true)
  }

  const handleDeleteRecord = (record: any) => {
    setSelectedRecord(record)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Simulate delete operation
    setRecords(records.filter((r) => r.id !== selectedRecord.id))
    setIsDeleteDialogOpen(false)

    toast({
      title: "Record deleted",
      description: `Record for ${selectedRecord.patientName} has been deleted.`,
    })
  }

  const saveEdit = () => {
    // Simulate update operation
    setRecords(records.map((r) => (r.id === selectedRecord.id ? { ...r, notes: editedNotes } : r)))
    setIsEditDialogOpen(false)

    toast({
      title: "Record updated",
      description: `Record for ${selectedRecord.patientName} has been updated.`,
    })
  }

  const handleAddRecord = () => {
    // Simulate add operation
    const newRecord = {
      id: records.length + 1,
      patientName: "New Patient",
      patientId: newRecordData.patientId,
      recordType: newRecordData.recordType,
      diagnosis: newRecordData.diagnosis,
      doctor: "Current User",
      date: new Date(),
      formattedDate: format(new Date(), "MMM d, yyyy"),
      notes: newRecordData.notes,
      status: "Complete",
      initials: "NP",
    }

    setRecords([newRecord, ...records])
    setIsAddDialogOpen(false)

    // Reset form
    setNewRecordData({
      patientId: "",
      recordType: "",
      diagnosis: "",
      notes: "",
    })

    toast({
      title: "Record added",
      description: `New health record has been created.`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Health Records</h2>
            <p className="text-muted-foreground">View and manage patient health records</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search records..."
                className="w-full pl-8 md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="medical">Medical Exams</TabsTrigger>
            <TabsTrigger value="lab">Lab Results</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="telehealth">Telehealth</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Patient Health Records</CardTitle>
                <CardDescription>View, edit, and manage comprehensive patient health records</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Record Type</TableHead>
                          <TableHead>Diagnosis</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No records found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRecords.slice(0, 10).map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${record.initials}`} />
                                    <AvatarFallback>{record.initials}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{record.patientName}</div>
                                    <div className="text-xs text-muted-foreground">ID: {record.patientId}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{record.recordType}</TableCell>
                              <TableCell>{record.diagnosis}</TableCell>
                              <TableCell>{record.doctor}</TableCell>
                              <TableCell>{record.formattedDate}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={record.status === "Complete" ? "default" : "outline"}
                                  className={record.status === "Complete" ? "bg-green-500 hover:bg-green-600" : ""}
                                >
                                  {record.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleViewRecord(record)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleEditRecord(record)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord(record)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Records
                </Button>
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min(10, filteredRecords.length)} of {filteredRecords.length} records
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Medical Examinations</CardTitle>
                <CardDescription>Records of patient medical examinations and check-ups</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table structure as above, filtered for medical exams */}
                {/* This content is dynamically filtered by the tab value */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Laboratory Results</CardTitle>
                <CardDescription>Patient laboratory test results and analyses</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table structure as above, filtered for lab results */}
                {/* This content is dynamically filtered by the tab value */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>Medication prescriptions and treatment plans</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table structure as above, filtered for prescriptions */}
                {/* This content is dynamically filtered by the tab value */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="telehealth" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Telehealth Consultations</CardTitle>
                <CardDescription>Records from virtual healthcare consultations</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table structure as above, filtered for telehealth consultations */}
                {/* This content is dynamically filtered by the tab value */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* View Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Health Record Details</DialogTitle>
            <DialogDescription>Comprehensive details of the patient health record</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${selectedRecord.initials}`} />
                  <AvatarFallback>{selectedRecord.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedRecord.patientName}</h3>
                  <p className="text-sm text-muted-foreground">Patient ID: {selectedRecord.patientId}</p>
                </div>
                <Badge
                  variant={selectedRecord.status === "Complete" ? "default" : "outline"}
                  className={`ml-auto ${selectedRecord.status === "Complete" ? "bg-green-500 hover:bg-green-600" : ""}`}
                >
                  {selectedRecord.status}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Record Type</Label>
                  <p className="font-medium">{selectedRecord.recordType}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p className="font-medium">{selectedRecord.formattedDate}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Diagnosis</Label>
                  <p className="font-medium">{selectedRecord.diagnosis}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Doctor</Label>
                  <p className="font-medium">{selectedRecord.doctor}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Notes</Label>
                <div className="rounded-md border p-3">
                  <p>{selectedRecord.notes}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  Created on {selectedRecord.formattedDate}
                </div>
                <Button variant="outline" onClick={() => handleEditRecord(selectedRecord)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Record
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Health Record</DialogTitle>
            <DialogDescription>Make changes to the patient health record</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${selectedRecord.initials}`} />
                  <AvatarFallback>{selectedRecord.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedRecord.patientName}</h3>
                  <p className="text-sm text-muted-foreground">Record: {selectedRecord.recordType}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} rows={5} />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save Changes</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Record Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this health record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <p className="font-medium">{selectedRecord.patientName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRecord.recordType} - {selectedRecord.formattedDate}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete Record
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Record Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Health Record</DialogTitle>
            <DialogDescription>Create a new patient health record in the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={newRecordData.patientId}
                  onChange={(e) => setNewRecordData({ ...newRecordData, patientId: e.target.value })}
                  placeholder="Enter patient ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recordType">Record Type</Label>
                <Select
                  value={newRecordData.recordType}
                  onValueChange={(value) => setNewRecordData({ ...newRecordData, recordType: value })}
                >
                  <SelectTrigger id="recordType">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medical Examination">Medical Examination</SelectItem>
                    <SelectItem value="Lab Results">Lab Results</SelectItem>
                    <SelectItem value="Prescription">Prescription</SelectItem>
                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                    <SelectItem value="Telehealth Consultation">Telehealth Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input
                id="diagnosis"
                value={newRecordData.diagnosis}
                onChange={(e) => setNewRecordData({ ...newRecordData, diagnosis: e.target.value })}
                placeholder="Enter diagnosis"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newNotes">Notes</Label>
              <Textarea
                id="newNotes"
                value={newRecordData.notes}
                onChange={(e) => setNewRecordData({ ...newRecordData, notes: e.target.value })}
                placeholder="Enter record notes"
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRecord}>Create Record</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
