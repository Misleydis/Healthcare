"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Health Profile</CardTitle>
            <CardDescription>
              Register to access healthcare services and connect with medical professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step > index + 1
                          ? "bg-primary text-primary-foreground"
                          : step === index + 1
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    {index < totalSteps - 1 && (
                      <div className={`h-1 w-16 ${step > index + 1 ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Personal Info</span>
                <span>Medical History</span>
                <span>Account Setup</span>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter your address" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Do you have any existing medical conditions?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Diabetes", "Hypertension", "Asthma", "Heart Disease", "Arthritis", "None"].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox id={condition.toLowerCase()} />
                        <Label htmlFor={condition.toLowerCase()}>{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Are you currently taking any medications?</Label>
                  <Tabs defaultValue="yes">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="yes">Yes</TabsTrigger>
                      <TabsTrigger value="no">No</TabsTrigger>
                    </TabsList>
                    <TabsContent value="yes" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="medications">Please list your current medications</Label>
                        <Input id="medications" placeholder="Enter medications separated by commas" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label>Do you have any allergies?</Label>
                  <Tabs defaultValue="no">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="yes">Yes</TabsTrigger>
                      <TabsTrigger value="no">No</TabsTrigger>
                    </TabsList>
                    <TabsContent value="yes" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="allergies">Please list your allergies</Label>
                        <Input id="allergies" placeholder="Enter allergies separated by commas" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input id="emergencyContact" placeholder="Enter emergency contact name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input id="emergencyPhone" placeholder="Enter emergency contact phone" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email address" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create a password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="dataConsent" />
                    <Label htmlFor="dataConsent" className="text-sm">
                      I consent to the collection and processing of my health data for the purpose of providing
                      healthcare services
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/">Cancel</Link>
              </Button>
            )}

            {step < totalSteps ? (
              <Button onClick={nextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button asChild>
                <Link href="/dashboard">Complete Registration</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

