"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useAuthStore from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AdminAccountsPage() {
  const router = useRouter()
  const { userData, deleteTestAccount, loading, error } = useAuthStore()
  const [email, setEmail] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (userData && userData.role !== "doctor") {
      router.push("/dashboard")
    }
  }, [userData, router])

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    setIsDeleting(true)
    try {
      const success = await deleteTestAccount(email)
      if (success) {
        toast.success("Account deleted successfully")
        setEmail("")
      }
    } catch (error) {
      console.error("Failed to delete account:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!userData || userData.role !== "doctor") {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Test Accounts</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Delete Test Account</h2>
        <form onSubmit={handleDeleteAccount} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to delete"
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            variant="destructive"
            disabled={loading || isDeleting}
            className="w-full"
          >
            {loading || isDeleting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </span>
            ) : (
              <span className="flex items-center">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </span>
            )}
          </Button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Instructions</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-600">
            1. Enter the email address of the test account you want to delete
          </p>
          <p className="text-gray-600">
            2. Click the Delete Account button to remove the account
          </p>
          <p className="text-gray-600">
            3. You will be logged out if you delete your own account
          </p>
        </div>
      </div>
    </div>
  )
} 