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

export async function PATCH(req: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    // const driver_id = session?.user?.id
    const { id, action } = await req.json();
    let status = "";
    if (action === "accept") status = "accepted";
    if (action === "decline") status = "cancelled";
    if (!status) return NextResponse.json({ error: "Некорректное действие" }, { status: 400 });

    // driver_id из сессии (пока для теста driver_id = 1)
    const driver_id = 1;

    if (status === "accepted") {
      await pool.execute(
        "UPDATE Orders SET status = ?, driver_id = ? WHERE id = ?",
        [status, driver_id, id]
      );
    } else {
      await pool.execute(
        "UPDATE Orders SET status = ?, driver_id = ? WHERE id = ?",
        [status, driver_id, id]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при обновлении заказа", details: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // Если есть ?available=1 — возвращаем только pending
    if (searchParams.get('available') === '1') {
      const [rows] = await pool.query(
        'SELECT * FROM Orders WHERE status = ? ORDER BY created_at DESC',
        ['pending']
      );
      return NextResponse.json(rows, { status: 200 });
    }
    // Для вкладки current/declined для водителя
    if (searchParams.get('driver_id')) {
      const driver_id = Number(searchParams.get('driver_id'));
      const status = searchParams.get('status');
      let query = 'SELECT * FROM Orders WHERE driver_id = ?';
      let params: (string|number)[] = [driver_id];
      if (status) {
        query += ' AND status = ?';
        params.push(String(status));
      }
      query += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(query, params);
      return NextResponse.json(rows, { status: 200 });
    }
    // Для клиента (client_id=1 для примера)
    // const session = await getServerSession(authOptions)
    // const client_id = session?.user?.id
    const client_id = 1
    const [rows] = await pool.query(
      'SELECT * FROM Orders WHERE client_id = ? ORDER BY created_at DESC',
      [client_id]
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при получении заказов', details: String(error) }, { status: 500 });
  }
} 