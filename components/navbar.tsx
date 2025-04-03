"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-background border-b sticky top-0 z-50 backdrop-blur-sm bg-background/90">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-primary font-bold text-xl">HealthConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/assessment"
              className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors duration-200"
            >
              Health Assessment
            </Link>
            <Link
              href="/telemedicine"
              className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors duration-200"
            >
              Telemedicine
            </Link>
            <Link
              href="/monitoring"
              className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors duration-200"
            >
              Monitoring
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <ModeToggle />
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b animate-in slide-in-from-top-5 duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              href="/assessment"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
              onClick={toggleMenu}
            >
              Health Assessment
            </Link>
            <Link
              href="/telemedicine"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
              onClick={toggleMenu}
            >
              Telemedicine
            </Link>
            <Link
              href="/monitoring"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
              onClick={toggleMenu}
            >
              Monitoring
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3 space-x-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={toggleMenu}>
                    Login
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/register" onClick={toggleMenu}>
                    Register
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

