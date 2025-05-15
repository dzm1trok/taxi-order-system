import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { pool } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, firstName, lastName, phone, role, carModel, carNumber } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Additional validation for drivers
    if (role === "driver" && (!carModel || !carNumber)) {
      return NextResponse.json(
        { error: "Missing required driver fields" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Start transaction
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // Insert user
      const [userResult] = await connection.query(
        `INSERT INTO Users (email, password_hash, first_name, last_name, phone, role)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [email, hashedPassword, firstName, lastName, phone, role]
      )

      const userId = (userResult as any).insertId

      // If driver, insert driver details
      if (role === "driver") {
        await connection.query(
          `INSERT INTO Drivers (user_id, car_model, car_number, car_year, car_color, driver_license)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, carModel, carNumber, new Date().getFullYear(), "Unknown", "PENDING"]
        )
      }

      await connection.commit()
      return NextResponse.json({ success: true, userId })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    )
  }
} 