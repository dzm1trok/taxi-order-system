import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const image = formData.get("image") as File
    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Create unique filename
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${userId}-${Date.now()}.${image.type.split("/")[1]}`
    
    // Save file to public directory
    const publicDir = join(process.cwd(), "public", "uploads")
    const filepath = join(publicDir, filename)
    await writeFile(filepath, buffer)

    // Update user profile with image path
    const imagePath = `/uploads/${filename}`
    await pool.query(
      `UPDATE Users SET profile_image = ? WHERE id = ?`,
      [imagePath, userId]
    )

    return NextResponse.json({
      success: true,
      profile_image: imagePath
    })
  } catch (error: any) {
    console.error("Error uploading profile image:", error)
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    )
  }
} 