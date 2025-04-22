"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Plus, MoreHorizontal, FileText, Video, Brain, Filter } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { usePatientStore } from "@/lib"

// Generate random patient data
const generatePatients = (count = 10) => {
  const firstNames = [
    "Tendai",
    "Chipo",
    "Tatenda",
    "Farai",
    "Nyasha",
    "Kudzai",
    "Tafadzwa",
    "Rumbidzai",
    "Simba",
    "Vimbai",
  ]
  const lastNames = ["Moyo", "Ncube", "Dube", "Sibanda", "Mpofu", "Ndlovu", "Mutasa", "Chigumba", "Makoni", "Zimuto"]
  const locations = ["Bulawayo", "Harare", "Mutare", "Gweru", "Masvingo", "Chinhoyi", "Kadoma", "Kwekwe"]
  const conditions = [
    "Malaria",
    "Hypertension",
    "Diabetes",
    "Respiratory",
    "Prenatal Care",
    "General Checkup",
    "Vaccination",
    "Follow-up",
  ]
  const statuses = ["Active", "Inactive", "Pending"]

  // Get current date
  const today = new Date()

  return Array.from({ length: count }, (_, i) => {
    // Generate a date within the last 90 days
    const registrationDate = new Date(today)
    registrationDate.setDate(today.getDate() - Math.floor(Math.random() * 90))

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const age = 18 + Math.floor(Math.random() * 60)
    const gender = Math.random() > 0.5 ? "Male" : "Female"

    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      age,
      gender,
      location: locations[Math.floor(Math.random() * locations.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      registrationDate: registrationDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      lastVisit:
        Math.random() > 0.3
          ? new Date(today.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )
          : "N/A",
      initials: `${firstName[0]}${lastName[0]}`,
    }
  })
}

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")

  const { patients, loading, totalPages, fetchPatients } = usePatientStore()

  const patientsPerPage = 10

  useEffect(() => {
    fetchPatients(currentPage, patientsPerPage, searchTerm, activeTab === "all" ? "" : activeTab)
  }, [fetchPatients, currentPage, patientsPerPage, searchTerm, activeTab])

  // Filter patients based on search term and active tab
  const filteredPatients = patients

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Patient Management</h2>
            <p className="text-muted-foreground">View and manage all registered patients in the system</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="w-full pl-8 md:w-[300px]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
              />
            </div>
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button asChild>
              <Link href="/dashboard/patients/register">
                <Plus className="mr-2 h-4 w-4" />
                Add Patient
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Patient Directory</CardTitle>
                <CardDescription>
                  Manage patient records, view health history, and schedule appointments
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
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Age/Gender</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Visit</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patients.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">
                                No patients found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            patients.map((patient) => (
                              <TableRow key={patient.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage
                                        src={`/placeholder.svg?height=40&width=40&text=${patient.initials}`}
                                      />
                                      <AvatarFallback>{patient.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{patient.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        Registered: {patient.registrationDate}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {patient.age} / {patient.gender}
                                </TableCell>
                                <TableCell>{patient.location}</TableCell>
                                <TableCell>{patient.condition}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      patient.status === "Active"
                                        ? "default"
                                        : patient.status === "Inactive"
                                          ? "secondary"
                                          : "outline"
                                    }
                                    className={
                                      patient.status === "Active"
                                        ? "bg-green-500 hover:bg-green-600"
                                        : patient.status === "Inactive"
                                          ? "bg-gray-500 hover:bg-gray-600"
                                          : ""
                                    }
                                  >
                                    {patient.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{patient.lastVisit}</TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Records
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Video className="mr-2 h-4 w-4" />
                                        Schedule Telehealth
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Brain className="mr-2 h-4 w-4" />
                                        ML Analysis
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                            />
                          </PaginationItem>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber = currentPage
                            if (totalPages <= 5) {
                              pageNumber = i + 1
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i
                            } else {
                              pageNumber = currentPage - 2 + i
                            }

                            return (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  onClick={() => {
                                    setCurrentPage(pageNumber)
                                    fetchPatients(
                                      pageNumber,
                                      patientsPerPage,
                                      searchTerm,
                                      activeTab === "all" ? "" : activeTab,
                                    )
                                  }}
                                  isActive={currentPage === pageNumber}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => {
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                fetchPatients(
                                  currentPage + 1,
                                  patientsPerPage,
                                  searchTerm,
                                  activeTab === "all" ? "" : activeTab,
                                )
                              }}
                              disabled={currentPage === totalPages}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Active Patients</CardTitle>
                <CardDescription>Patients currently receiving care or treatment</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table structure as above, filtered for active patients */}
                {/* This content is dynamically filtered by the activeTab state */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Pending Patients</CardTitle>
                <CardDescription>Patients awaiting initial assessment or approval</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table structure as above, filtered for pending patients */}
                {/* This content is dynamically filtered by the activeTab state */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Inactive Patients</CardTitle>
                <CardDescription>Patients who have not received care in over 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table structure as above, filtered for inactive patients */}
                {/* This content is dynamically filtered by the activeTab state */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
