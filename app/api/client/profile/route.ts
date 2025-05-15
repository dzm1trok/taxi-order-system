import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET /api/client/profile
export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user information
    const [users] = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at,
              u.home_address, u.work_address, u.profile_image,
              (SELECT COUNT(*) FROM Orders WHERE client_id = u.id) as total_rides
       FROM Users u
       WHERE u.id = ?`,
      [userId]
    )

    const user = (users as any[])[0]
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        createdAt: user.created_at,
        homeAddress: user.home_address,
        workAddress: user.work_address,
        profile_image: user.profile_image,
        totalRides: user.total_rides
      }
    })
  } catch (error: any) {
    console.error("Error fetching client profile:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// PUT /api/client/profile
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
    const { 
      firstName, 
      lastName, 
      phone, 
      email,
      homeAddress,
      workAddress
    } = body

    // Update user information
    await pool.query(
      `UPDATE Users 
       SET first_name = ?, 
           last_name = ?, 
           phone = ?,
           email = ?,
           home_address = ?,
           work_address = ?
       WHERE id = ?`,
      [firstName, lastName, phone, email, homeAddress, workAddress, userId]
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating client profile:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    )
  }
} 