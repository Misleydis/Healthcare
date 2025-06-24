"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useAuthStore from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { login, loading, error, clearError } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [showError, setShowError] = useState(false)

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError()
    setShowError(false)
  }, [clearError])

  // Show error alert when error state changes
  useEffect(() => {
    if (error) {
      setShowError(true)
      // Hide the error after 5 seconds
      const timer = setTimeout(() => {
        setShowError(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setShowError(true)
      return
    }

    try {
      await login(email, password)
      toast.success("Login successful")
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      // Error is already handled by the store and shown via useEffect
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setShowError(true)
      return
    }

    setIsResetting(true)
    try {
      // TODO: Implement actual password reset logic
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      toast.success("Password reset instructions sent to your email")
    } catch (error) {
      toast.error("Failed to send reset instructions")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="flex items-center justify-center rounded-md bg-emerald-600 p-1">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-emerald-600">MJ's Health Hub</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <div>
            <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-emerald-600">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
                create a new account
              </Link>
            </p>
          </div>

          {showError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                {error === "Invalid email or password" ? (
                  "The email or password you entered is incorrect. Please try again."
                ) : error === "Connection timed out. Please try again." ? (
                  "The connection timed out. Please check your internet connection and try again."
                ) : error === "Network error. Please check your connection." ? (
                  "Unable to connect to the server. Please check your internet connection."
                ) : error === "Server error. Please try again later." ? (
                  "The server is currently unavailable. Please try again later."
                ) : error === "Authentication failed. Please try again." ? (
                  "Authentication failed. Please check your credentials and try again."
                ) : error === "User data not found. Please try again." ? (
                  "Your account information could not be retrieved. Please try again."
                ) : error === "Invalid user data received. Please try again." ? (
                  "There was a problem with your account data. Please try again."
                ) : (
                  "An error occurred during login. Please try again."
                )}
              </AlertDescription>
            </Alert>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setShowError(false)
                  }}
                  className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setShowError(false)
                    }}
                    className="mt-1 pr-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className="font-medium text-emerald-600 hover:text-emerald-500"
                >
                  {isResetting ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Forgot your password?"
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
