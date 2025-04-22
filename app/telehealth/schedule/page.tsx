import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import TelehealthScheduleForm from "@/components/telehealth-schedule-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TelehealthSchedule() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Schedule Telehealth Consultation</h2>
        </div>

        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle>New Telehealth Session</CardTitle>
            <CardDescription>
              Schedule a virtual consultation between a patient and healthcare provider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TelehealthScheduleForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
