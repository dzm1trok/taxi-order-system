import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
// import { getServerSession } from 'next-auth' // если используете next-auth
// import { authOptions } from '@/lib/auth' // путь к вашим auth настройкам

export async function POST(req: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    // const client_id = session?.user?.id
    // Для примера, client_id = 1
    const client_id = 1
    const body = await req.json()
    const {
      from_address,
      to_address,
      car_class,
      price,
      distance,
      comment,
      status = 'pending',
    } = body

    const [result] = await pool.execute(
      `INSERT INTO Orders (client_id, from_address, to_address, car_class, price, distance, comment, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_id, from_address, to_address, car_class, price, distance, comment, status]
    )

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при создании заказа', details: String(error) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    // const client_id = session?.user?.id
    const client_id = 1 // для примера
    const [rows] = await pool.query(
      'SELECT * FROM Orders WHERE client_id = ? ORDER BY created_at DESC',
      [client_id]
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при получении заказов', details: String(error) }, { status: 500 });
  }
} 