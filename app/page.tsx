import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Users, Video, Brain, Shield } from "lucide-react"
import { LandingHeader } from "@/components/landing-header"
import { LandingFooter } from "@/components/landing-footer"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-20 md:py-32">
          <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Transforming Rural Healthcare</span>
                <span className="block text-emerald-600">with AI and Telemedicine</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                MJ's Health Hub brings advanced healthcare to rural Zimbabwe through machine learning and telemedicine,
                improving access to quality healthcare services for underserved communities.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/login">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute -top-24 right-0 -z-10 opacity-20">
            <Activity className="h-64 w-64 rotate-12 text-emerald-500" />
          </div>
          <div className="absolute -bottom-16 left-0 -z-10 opacity-20">
            <Brain className="h-48 w-48 -rotate-12 text-emerald-500" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Revolutionizing Healthcare Delivery
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                Our platform combines cutting-edge technology with healthcare expertise to serve rural communities.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Brain className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold">ML-Powered Diagnostics</h3>
                <p className="text-gray-600">
                  Our machine learning algorithms analyze patient data to provide accurate diagnostic suggestions and
                  treatment recommendations.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Video className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Telehealth Consultations</h3>
                <p className="text-gray-600">
                  Connect patients with healthcare professionals through secure video consultations, reducing the need
                  for travel.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Patient Management</h3>
                <p className="text-gray-600">
                  Comprehensive patient registration and management system to track health records and treatment
                  history.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Health Monitoring</h3>
                <p className="text-gray-600">
                  Continuous monitoring of patient health metrics and automated alerts for critical conditions.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Data Security</h3>
                <p className="text-gray-600">
                  Advanced encryption and security measures to protect sensitive patient information and ensure privacy.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <ArrowRight className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Offline Capabilities</h3>
                <p className="text-gray-600">
                  Designed to work in areas with limited connectivity, with offline data storage and synchronization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-emerald-600 py-16">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform healthcare delivery?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
              Join MJ's Health Hub today and help bring quality healthcare to rural Zimbabwe.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
                <Link href="/register">Register Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
