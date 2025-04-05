import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const { type, data } = await request.json()

    if (!type || !data) {
      return NextResponse.json({ success: false, message: "Type and data are required" }, { status: 400 })
    }

    // Get existing health data
    const healthData = (await db.getHealthData(user.id)) || {}

    // Update health data
    if (!healthData[type]) {
      healthData[type] = []
    }

    // Add new data to the beginning of the array
    healthData[type].unshift(data)

    // Save updated health data
    const result = await db.saveHealthData(user.id, healthData)

    if (!result) {
      return NextResponse.json({ success: false, message: "Failed to save health data" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: healthData[type] })
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}

