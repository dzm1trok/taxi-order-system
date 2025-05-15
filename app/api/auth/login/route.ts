import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { pool } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Get user from database
    const [users] = await pool.query(
      `SELECT id, email, password_hash, first_name, last_name, role 
       FROM Users 
       WHERE email = ?`,
      [email]
    )

    const user = (users as any[])[0]

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      )
    }

    // If user is a driver, get additional driver information
    let driverInfo = null
    if (user.role === "driver") {
      const [drivers] = await pool.query(
        `SELECT car_model, car_number, rating, is_online 
         FROM Drivers 
         WHERE user_id = ?`,
        [user.id]
      )
      driverInfo = (drivers as any[])[0]
    }

    // Return user data without password
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        ...(driverInfo && { driverInfo })
      }
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    )
  }
} 