"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowRight, Check, ChevronRight, FileText, MessageSquare, Video } from "lucide-react"
import Link from "next/link"

export default function AssessmentPage() {
  const [step, setStep] = useState(1)
  const totalSteps = 4

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Health Assessment</h1>
          <p className="text-muted-foreground">Describe your symptoms for AI-powered health insights</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step > index + 1
                      ? "bg-primary text-primary-foreground"
                      : step === index + 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > index + 1 ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div className={`h-1 w-16 sm:w-24 md:w-32 ${step > index + 1 ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Symptoms</span>
            <span>Medical History</span>
            <span>Assessment</span>
            <span>Recommendations</span>
          </div>
        </div>

        <Card className="animate-in fade-in duration-300">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Describe Your Symptoms</CardTitle>
                <CardDescription>Please provide details about what you're experiencing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">What symptoms are you experiencing?</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms in detail (e.g., headache, fever, cough, etc.)"
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label>How long have you been experiencing these symptoms?</Label>
                  <RadioGroup defaultValue="today">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="today" id="today" />
                      <Label htmlFor="today">Today</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="few-days" id="few-days" />
                      <Label htmlFor="few-days">Few days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="week" id="week" />
                      <Label htmlFor="week">About a week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="more-than-week" id="more-than-week" />
                      <Label htmlFor="more-than-week">More than a week</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Rate the severity of your symptoms:</Label>
                  <RadioGroup defaultValue="mild">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mild" id="mild" />
                      <Label htmlFor="mild">Mild - Noticeable but not interfering with daily activities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Moderate - Somewhat interfering with daily activities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severe" id="severe" />
                      <Label htmlFor="severe">Severe - Significantly interfering with daily activities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-severe" id="very-severe" />
                      <Label htmlFor="very-severe">Very Severe - Unable to perform daily activities</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Please provide information about your medical history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Textarea placeholder="List any medications you are currently taking" className="min-h-20" />
                </div>

                <div className="space-y-2">
                  <Label>Do you have any allergies?</Label>
                  <Textarea placeholder="List any allergies you have" className="min-h-20" />
                </div>

                <div className="space-y-2">
                  <Label>Have you had any recent changes in your health?</Label>
                  <Textarea placeholder="Describe any recent changes in your health" className="min-h-20" />
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>AI Assessment</CardTitle>
                <CardDescription>Based on the information you provided, here's an initial assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important Notice</AlertTitle>
                  <AlertDescription>
                    This is an AI-generated assessment and not a medical diagnosis. Please consult with a healthcare
                    professional for proper diagnosis and treatment.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg animate-in fade-in slide-up duration-300">
                    <h3 className="font-medium text-lg mb-2">Possible Conditions</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Type 2 Diabetes (High Probability)</p>
                          <p className="text-sm text-muted-foreground">
                            Your symptoms of increased thirst, frequent urination, and fatigue, combined with your
                            family history, suggest this condition.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Hypertension (Moderate Probability)</p>
                          <p className="text-sm text-muted-foreground">
                            Your reported headaches and family history of high blood pressure suggest this condition
                            should be evaluated.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div
                    className="p-4 border rounded-lg animate-in fade-in slide-up duration-300"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <h3 className="font-medium text-lg mb-2">Risk Factors</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Family History</p>
                          <p className="text-sm text-muted-foreground">
                            You mentioned a family history of diabetes and hypertension, which increases your risk.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Lifestyle Factors</p>
                          <p className="text-sm text-muted-foreground">
                            Your reported sedentary lifestyle and dietary habits may contribute to your symptoms.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Here are our recommendations based on your assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Recommended Actions</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-primary text-primary-foreground rounded-full p-1 mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Schedule a Telemedicine Consultation</p>
                        <p className="text-sm text-muted-foreground">
                          Connect with a healthcare provider to discuss your symptoms and get a proper diagnosis.
                        </p>
                        <Button className="mt-2" size="sm" asChild>
                          <Link href="/telemedicine">
                            <Video className="mr-2 h-4 w-4" />
                            Book Consultation
                          </Link>
                        </Button>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary text-primary-foreground rounded-full p-1 mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Blood Glucose Test</p>
                        <p className="text-sm text-muted-foreground">
                          Request a blood glucose test to check for diabetes.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary text-primary-foreground rounded-full p-1 mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Blood Pressure Monitoring</p>
                        <p className="text-sm text-muted-foreground">Start monitoring your blood pressure regularly.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Immediate Self-Care Measures</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Dietary Changes</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Reduce sugar and carbohydrate intake</li>
                          <li>Increase water consumption</li>
                          <li>Add more vegetables to your diet</li>
                          <li>Limit processed foods</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Lifestyle Adjustments</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Start with light daily exercise (30 min walks)</li>
                          <li>Ensure adequate sleep (7-8 hours)</li>
                          <li>Practice stress reduction techniques</li>
                          <li>Monitor your symptoms daily</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/monitoring">
                      <FileText className="mr-2 h-4 w-4" />
                      Start Monitoring
                    </Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href="/telemedicine">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Consult a Doctor
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep} className="transition-all duration-200 hover:-translate-x-1">
                Back
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            )}

            {step < totalSteps ? (
              <Button onClick={nextStep} className="transition-all duration-200 hover:translate-x-1">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

