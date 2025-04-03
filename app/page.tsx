import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Clock, FileText, MessageSquare, Shield, User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary to-primary/80 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Healthcare background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-in slide-up">
              Healthcare Access for Rural Zimbabwe
            </h1>
            <p className="text-xl mb-8 animate-in slide-up" style={{ animationDelay: "0.1s" }}>
              Connecting patients with healthcare professionals through telemedicine and AI-powered health insights
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button asChild size="lg" variant="secondary" className="hover-lift transition-all">
                <Link href="/register">Register Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white hover:bg-white/20 transition-all"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 animate-in fade-in">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<User className="h-10 w-10 text-primary" />}
            title="Easy Registration"
            description="Create your profile and securely store your medical history and personal information."
            link="/register"
            image="https://images.unsplash.com/photo-1576089172869-4f5f6f315620?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-primary" />}
            title="Health Assessment"
            description="Describe your symptoms and receive AI-powered health insights and recommendations."
            link="/assessment"
            image="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
          />
          <FeatureCard
            icon={<MessageSquare className="h-10 w-10 text-primary" />}
            title="Telemedicine"
            description="Connect with healthcare professionals through video consultations from anywhere."
            link="/telemedicine"
            image="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-primary" />}
            title="Treatment Plans"
            description="Receive personalized treatment plans and medication reminders to manage your health."
            link="/treatment"
            image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
          />
          <FeatureCard
            icon={<Clock className="h-10 w-10 text-primary" />}
            title="Health Monitoring"
            description="Track your health progress over time and receive adjustments to your treatment as needed."
            link="/monitoring"
            image="https://images.unsplash.com/photo-1559447087-3b6c9b6c2c3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Data Protection"
            description="Your health data is protected with industry-standard security and privacy measures."
            link="/privacy"
            image="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to improve your healthcare access?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who are already benefiting from our healthcare platform.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  link,
  image,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  image: string
}) {
  return (
    <Card className="h-full overflow-hidden hover-lift transition-all duration-300 border border-border/50">
      <div className="h-40 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
        />
      </div>
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full justify-between">
          <Link href={link}>
            Learn more <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

