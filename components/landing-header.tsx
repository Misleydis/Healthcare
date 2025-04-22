import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-md bg-emerald-600 p-1">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">MJ's Health Hub</span>
        </Link>

        <nav className="hidden space-x-8 md:flex">
          <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
            Features
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
            About Us
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
