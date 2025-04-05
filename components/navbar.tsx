"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, loading } = useAuth()

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
          {!loading && (
            <>
              {user ? (
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
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    href="/about"
                    className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors duration-200"
                  >
                    About
                  </Link>
                  <Link
                    href="/services"
                    className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors duration-200"
                  >
                    Services
                  </Link>
                  <Link
                    href="/contact"
                    className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </div>
              )}
            </>
          )}

          <div className="hidden md:flex items-center space-x-2">
            <ModeToggle />

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </>
            )}
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
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
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
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
                      onClick={toggleMenu}
                    >
                      Settings
                    </Link>
                    <button
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
                      onClick={() => {
                        logout()
                        toggleMenu()
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/about"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
                      onClick={toggleMenu}
                    >
                      About
                    </Link>
                    <Link
                      href="/services"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
                      onClick={toggleMenu}
                    >
                      Services
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
                      onClick={toggleMenu}
                    >
                      Contact
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
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

