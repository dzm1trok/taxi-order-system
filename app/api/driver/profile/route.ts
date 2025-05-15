import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET /api/driver/profile
export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user and driver information
    const [users] = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at,
              u.home_address, u.work_address, u.profile_image,
              d.car_model, d.car_number, d.car_year, d.car_color, d.driver_license, d.rating
       FROM Users u
       LEFT JOIN Drivers d ON u.id = d.user_id
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
        carModel: user.car_model,
        carNumber: user.car_number,
        carYear: user.car_year,
        carColor: user.car_color,
        driverLicense: user.driver_license,
        rating: parseFloat(user.rating) || 0
      }
    })
  } catch (error: any) {
    console.error("Error fetching driver profile:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// PUT /api/driver/profile
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
      workAddress,
      carModel, 
      carNumber, 
      carYear, 
      carColor,
      driverLicense 
    } = body

    // Start transaction
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // Update user information
      await connection.query(
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

      // Update driver information
      await connection.query(
        `UPDATE Drivers 
         SET car_model = ?, 
             car_number = ?, 
             car_year = ?, 
             car_color = ?,
             driver_license = ?
         WHERE user_id = ?`,
        [carModel, carNumber, carYear, carColor, driverLicense, userId]
      )

      await connection.commit()
      return NextResponse.json({ success: true })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error: any) {
    console.error("Error updating driver profile:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    )
  }
} 