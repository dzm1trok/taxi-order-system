import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { pool } from "@/lib/db"

export async function PUT(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    // Get current password hash
    const [users] = await pool.query(
      `SELECT password_hash FROM Users WHERE id = ?`,
      [userId]
    )

    const user = (users as any[])[0]
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await pool.query(
      `UPDATE Users SET password_hash = ? WHERE id = ?`,
      [hashedPassword, userId]
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: error.message || "Failed to change password" },
      { status: 500 }
    )
  }
} 