import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Create a schema for registration data
    const RegisterSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
      role: z.enum(["patient", "doctor", "admin"]).default("patient"),
    })

    // Validate request body
    const result = RegisterSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invalid registration data", errors: result.error.format() },
        { status: 400 },
      )
    }

    const userData = result.data

    // Register user
    const registerResult = await registerUser(userData)

    if (!registerResult.success) {
      return NextResponse.json({ success: false, message: registerResult.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: registerResult.user })
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred during registration" }, { status: 500 })
  }
}

