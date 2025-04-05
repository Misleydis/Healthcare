import { type NextRequest, NextResponse } from "next/server"
import { logoutUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await logoutUser()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred during logout" }, { status: 500 })
  }
}

