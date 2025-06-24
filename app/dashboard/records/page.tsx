"use client"

import {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';
import {
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import useAuthStore from '@/lib/auth-store';

// Generate random patient records
const generatePatientRecords = (count = 10, isPatient = false, patientName = "") => {
  const today = new Date()
  const recordTypes = ["Medical Examination", "Lab Results", "Prescription", "Vaccination", "Telehealth Consultation"]
  const diagnoses = ["Hypertension", "Diabetes", "Asthma", "Arthritis", "Migraine", "Common Cold", "Flu", "COVID-19"]
  const doctors = ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Davis"]
  const patientNames = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Wilson"]

  return Array.from({ length: count }, (_, i) => {
    // Generate a date within the last 180 days
    const recordDate = new Date(today)
    recordDate.setDate(today.getDate() - Math.floor(Math.random() * 180))

    // If user is a patient, only generate records for them
    const patient = isPatient ? patientName : patientNames[Math.floor(Math.random() * patientNames.length)]
    const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)]
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)]
    const doctor = doctors[Math.floor(Math.random() * doctors.length)]

    return {
      id: i + 1,
      patientName: patient,
      patientId: isPatient ? userData?.id : `P${1000 + Math.floor(Math.random() * 9000)}`,
      recordType,
      diagnosis,
      doctor,
      date: recordDate,
      formattedDate: format(recordDate, "MMM d, yyyy"),
      notes: `Patient presented with symptoms of ${diagnosis.toLowerCase()}. Recommended treatment and follow-up in 2 weeks.`,
      status: Math.random() > 0.3 ? "Complete" : "Pending",
      initials: patient
        .split(" ")
        .map((n) => n[0])
        .join(""),
    }
  }).sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by date, newest first
}

export default function HealthRecordsPage() {
  const { userData } = useAuthStore()
  const isPatient = userData?.role === "patient"
  const isDoctor = userData?.role === "doctor"
  const isNurse = userData?.role === "nurse"
  const isAdmin = userData?.role === "admin"

  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : "User"

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
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [shareLoading, setShareLoading] = useState(false)

  // Add state for managing medical history
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [isAddHistoryDialogOpen, setIsAddHistoryDialogOpen] = useState(false);
  const [isEditHistoryDialogOpen, setIsEditHistoryDialogOpen] = useState(false);
  const [isDeleteHistoryDialogOpen, setIsDeleteHistoryDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const [newHistoryData, setNewHistoryData] = useState({
    condition: "",
    treatment: "",
    notes: "",
  });

  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      // For new users, don't generate any records
      if (!userData?.createdAt || new Date(userData.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        setRecords([])
        setMedicalHistory([])
      } else {
        setRecords(generatePatientRecords(30, isPatient, fullName))
        // Generate some medical history for existing users
        setMedicalHistory([
          {
            id: 1,
            condition: "Hypertension",
            treatment: "Lisinopril 10mg daily",
            notes: "Diagnosed in 2020, well controlled with medication"
          },
          {
            id: 2,
            condition: "Type 2 Diabetes",
            treatment: "Metformin 500mg twice daily",
            notes: "Diagnosed in 2019, monitoring blood sugar levels"
          }
        ])
      }
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [isPatient, fullName, userData])

  // Filter records based on search term and patient ID if the user is a patient
  const filteredRecords = records.filter((record) => {
    const matchesSearchTerm =
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recordType.toLowerCase().includes(searchTerm.toLowerCase());

    // If the user is a patient, ensure they only see their own records
    if (isPatient) {
      return matchesSearchTerm && record.patientId === userData?.id;
    }

    return matchesSearchTerm;
  })

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record)
    setIsViewDialogOpen(true)
  }

  const handleEditRecord = (record: any) => {
    if (isDoctor || isNurse || isAdmin) {
      setSelectedRecord(record);
      setEditedNotes(record.notes);
      setIsEditDialogOpen(true);
    }
  }

  const handleDeleteRecord = (record: any) => {
    if (isDoctor || isAdmin) {
      setSelectedRecord(record);
      setIsDeleteDialogOpen(true);
    }
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
      patientName: isPatient ? fullName : "New Patient",
      patientId: newRecordData.patientId,
      recordType: newRecordData.recordType,
      diagnosis: newRecordData.diagnosis,
      doctor: isDoctor ? `Dr. ${userData?.lastName}` : "Current User",
      date: new Date(),
      formattedDate: format(new Date(), "MMM d, yyyy"),
      notes: newRecordData.notes,
      status: "Complete",
      initials: isPatient
        ? fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "NP",
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

  const handleShareRecord = () => {
    setShareLoading(true)

    // Simulate sharing process
    setTimeout(() => {
      setShareLoading(false)
      setShowShareDialog(false)

      toast({
        title: "Record shared",
        description: `Record has been shared with ${shareEmail}`,
      })
    }, 1500)
  }

  const downloadRecord = () => {
    // Simulate download
    toast({
      title: "Record downloaded",
      description: "The health record has been downloaded as PDF.",
    })
  }

  // Function to handle adding new medical history
  const handleAddHistory = () => {
    const newHistory = {
      id: medicalHistory.length + 1,
      ...newHistoryData,
    };
    setMedicalHistory([newHistory, ...medicalHistory]);
    setIsAddHistoryDialogOpen(false);
    setNewHistoryData({ condition: "", treatment: "", notes: "" });
    toast({ title: "History added", description: "New medical history has been added." });
  };

  // Function to handle editing medical history
  const handleEditHistory = () => {
    setMedicalHistory(medicalHistory.map((h) => (h.id === selectedHistory.id ? { ...h, ...newHistoryData } : h)));
    setIsEditHistoryDialogOpen(false);
    toast({ title: "History updated", description: "Medical history has been updated." });
  };

  // Function to handle deleting medical history
  const confirmDeleteHistory = () => {
    setMedicalHistory(medicalHistory.filter((h) => h.id !== selectedHistory.id));
    setIsDeleteHistoryDialogOpen(false);
    toast({ title: "History deleted", description: "Medical history has been deleted." });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{isPatient ? "My Health Records" : "Health Records"}</h2>
            <p className="text-muted-foreground">
              {isPatient ? "View and manage your personal health records" : "View and manage patient health records"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={isPatient ? "Search my records..." : "Search records..."}
                className="w-full pl-8 md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {!isPatient && (
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            )}
            {(isDoctor || isNurse || isAdmin) && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            )}
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
                <CardTitle>{isPatient ? "My Health Records" : "Patient Health Records"}</CardTitle>
                <CardDescription>
                  {isPatient
                    ? "View your comprehensive health records"
                    : "View, edit, and manage comprehensive patient health records"}
                </CardDescription>
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
                          {!isPatient && <TableHead>Patient</TableHead>}
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
                            <TableCell colSpan={isPatient ? 6 : 7} className="h-24 text-center">
                              No records found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRecords.slice(0, 10).map((record) => (
                            <TableRow key={record.id}>
                              {!isPatient && (
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage
                                        src={`/placeholder.svg?height=40&width=40&text=${record.initials}`}
                                      />
                                      <AvatarFallback>{record.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{record.patientName}</div>
                                      <div className="text-xs text-muted-foreground">ID: {record.patientId}</div>
                                    </div>
                                  </div>
                                </TableCell>
                              )}
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
                                  {(isDoctor || isNurse || isAdmin) && (
                                    <Button variant="ghost" size="icon" onClick={() => handleEditRecord(record)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {(isDoctor || isAdmin) && (
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord(record)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
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
                <div className="flex gap-2">
                  {isPatient && (
                    <Button variant="outline" onClick={() => setShowShareDialog(true)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Share Record
                    </Button>
                  )}
                  <Button variant="outline" onClick={downloadRecord}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  {(isDoctor || isNurse || isAdmin) && (
                    <Button variant="outline" onClick={() => handleEditRecord(selectedRecord)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Record
                    </Button>
                  )}
                </div>
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

      {/* Share Record Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Health Record</DialogTitle>
            <DialogDescription>Share this health record with another healthcare provider</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shareEmail">Healthcare Provider Email</Label>
              <Input
                id="shareEmail"
                type="email"
                placeholder="doctor@example.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleShareRecord} disabled={shareLoading || !shareEmail}>
                {shareLoading ? "Sharing..." : "Share Record"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add buttons to trigger modals */}
      <Button onClick={() => setIsAddHistoryDialogOpen(true)}>Add Medical History</Button>

      {/* Add modals for managing medical history */}
      <Dialog open={isAddHistoryDialogOpen} onOpenChange={setIsAddHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Medical History</DialogTitle>
            <DialogDescription>Enter details of your medical history</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input id="condition" value={newHistoryData.condition} onChange={(e) => setNewHistoryData({ ...newHistoryData, condition: e.target.value })} placeholder="Enter condition" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment</Label>
              <Input id="treatment" value={newHistoryData.treatment} onChange={(e) => setNewHistoryData({ ...newHistoryData, treatment: e.target.value })} placeholder="Enter treatment" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={newHistoryData.notes} onChange={(e) => setNewHistoryData({ ...newHistoryData, notes: e.target.value })} placeholder="Enter notes" rows={4} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddHistoryDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddHistory}>Add History</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditHistoryDialogOpen} onOpenChange={setIsEditHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Medical History</DialogTitle>
            <DialogDescription>Edit details of your medical history</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editCondition">Condition</Label>
              <Input id="editCondition" value={newHistoryData.condition} onChange={(e) => setNewHistoryData({ ...newHistoryData, condition: e.target.value })} placeholder="Enter condition" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTreatment">Treatment</Label>
              <Input id="editTreatment" value={newHistoryData.treatment} onChange={(e) => setNewHistoryData({ ...newHistoryData, treatment: e.target.value })} placeholder="Enter treatment" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotes">Notes</Label>
              <Textarea id="editNotes" value={newHistoryData.notes} onChange={(e) => setNewHistoryData({ ...newHistoryData, notes: e.target.value })} placeholder="Enter notes" rows={4} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditHistoryDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditHistory}>Save Changes</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteHistoryDialogOpen} onOpenChange={setIsDeleteHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this medical history? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteHistoryDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteHistory}>Delete History</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add a table to display medical history entries */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Manage your medical history records</CardDescription>
        </CardHeader>
        <CardContent>
          {medicalHistory.length === 0 ? (
            <div className="text-center text-muted-foreground">No medical history records found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Condition</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{history.condition}</TableCell>
                      <TableCell>{history.treatment}</TableCell>
                      <TableCell>{history.notes}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setSelectedHistory(history);
                            setNewHistoryData(history);
                            setIsEditHistoryDialogOpen(true);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            setSelectedHistory(history);
                            setIsDeleteHistoryDialogOpen(true);
                          }}>
                            <Trash2 className="h-4 w-4" />
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
    </div>
  )
}
