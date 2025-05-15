import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { userId, isOnline } = body

    if (userId === undefined || isOnline === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Update driver's online status
    await pool.query(
      `UPDATE Drivers 
       SET is_online = ? 
       WHERE user_id = ?`,
      [isOnline ? 1 : 0, userId]
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating driver status:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update status" },
      { status: 500 }
    )
  }
} 