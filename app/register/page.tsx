"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Activity } from "lucide-react"
import useAuthStore from "@/lib/auth-store"
import Link from "next/link"
import { validateProfessionalId, registerProfessionalId } from "@/lib/professional-id-validator"

const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    firstName: z.string().min(1, {
      message: "First name is required.",
    }),
    lastName: z.string().min(1, {
      message: "Last name is required.",
    }),
    role: z.enum(["doctor", "nurse", "patient"], {
      required_error: "Please select a role.",
    }),
    specialty: z.string().optional(),
    phoneNumber: z.string().optional(),
    professionalId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    // Require professional ID for doctors and nurses
    if (data.role === "doctor" || data.role === "nurse") {
      return data.professionalId && data.professionalId.trim().length > 0;
    }
    return true;
  }, {
    message: "Professional ID is required for doctors and nurses",
    path: ["professionalId"],
  })
  .refine((data) => {
    // Validate professional ID format and check for duplicates
    if ((data.role === "doctor" || data.role === "nurse") && data.professionalId) {
      const result = validateProfessionalId(data.professionalId, data.role as "doctor" | "nurse");
      return result.isValid;
    }
    return true;
  }, {
    message: "Invalid or duplicate Professional ID",
    path: ["professionalId"],
  })

export default function RegisterPage() {
  const router = useRouter()
  const { register, loading, error } = useAuthStore()
  const [authError, setAuthError] = useState<string | null>(error)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "patient",
      specialty: "",
      phoneNumber: "",
      professionalId: "",
    },
  })

  const watchRole = form.watch("role")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAuthError(null)
    const { email, password, firstName, lastName, role, specialty, phoneNumber, professionalId } = values
    const success = await register({
      email,
      password,
      firstName,
      lastName,
      role,
      specialty,
      phoneNumber,
      professionalId,
    })

    if (success) {
      // Register the Professional ID in the validator if it's a doctor or nurse
      if ((role === "doctor" || role === "nurse") && professionalId) {
        const userId = `${role}-${Date.now()}` // Generate a unique user ID
        registerProfessionalId(userId, professionalId, role as "doctor" | "nurse")
      }
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex items-center justify-center rounded-md bg-emerald-600 p-1">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold">MJ's Health Hub</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(watchRole === "doctor" || watchRole === "nurse") && (
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={watchRole === "nurse" ? "Select your nursing specialty" : "Select your medical specialty"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {watchRole === "nurse" ? (
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(watchRole === "doctor" || watchRole === "nurse") && (
                <FormField
                  control={form.control}
                  name="professionalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="xxxx"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
