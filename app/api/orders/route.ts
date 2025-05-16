import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = body.email;
    if (!email) {
      console.log('Ошибка: email не передан в теле запроса', body);
      return NextResponse.json({ error: 'Email не передан', details: body }, { status: 400 });
    }
    const [rows]: any = await pool.query(
      'SELECT id FROM Users WHERE email = ?',
      [email]
    );
    if (!rows.length) {
      console.log('Пользователь не найден по email:', email, 'Тело запроса:', body);
      return NextResponse.json({ error: 'Пользователь не найден', details: { email, body } }, { status: 400 });
    }
    const client_id = rows[0].id;
    console.log('Создание заказа для client_id:', client_id, 'email:', email, 'Тело запроса:', body);
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
    console.log('Ошибка при создании заказа:', error);
    return NextResponse.json({ error: 'Ошибка при создании заказа', details: String(error) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    // const user_id = session?.user?.id
    const user_id = 1; // для теста

    const { id, action } = await req.json();
    let status = "";
    if (action === "accept") status = "accepted";
    if (action === "decline") status = "cancelled";
    if (action === "complete") status = "completed";
    if (!status) return NextResponse.json({ error: "Некорректное действие" }, { status: 400 });

    let driver_id = null;
    if (status === "accepted" || status === "completed" || status === "cancelled") {
      // Получаем driver_id по user_id
      const [rows]: any = await pool.query("SELECT id FROM Drivers WHERE user_id = ?", [user_id]);
      if (!rows.length) return NextResponse.json({ error: "Водитель не найден" }, { status: 400 });
      driver_id = rows[0].id;
      await pool.execute(
        "UPDATE Orders SET status = ?, driver_id = ? WHERE id = ?",
        [status, driver_id, id]
      );
    } else {
      await pool.execute(
        "UPDATE Orders SET status = ? WHERE id = ?",
        [status, id]
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
    // Если есть ?email=... — возвращаем заказы этого клиента
    const email = searchParams.get('email');
    if (email) {
      const [users]: any = await pool.query('SELECT id FROM Users WHERE email = ?', [email]);
      if (!users.length) return NextResponse.json([], { status: 200 });
      const client_id = users[0].id;
      const [rows] = await pool.query(
        'SELECT * FROM Orders WHERE client_id = ? ORDER BY created_at DESC',
        [client_id]
      );
      return NextResponse.json(rows, { status: 200 });
    }
    // Если есть ?available=1 — возвращаем только pending
    if (searchParams.get('available') === '1') {
      const [rows] = await pool.query(
        `SELECT Orders.*, Users.first_name, Users.last_name FROM Orders
         JOIN Users ON Orders.client_id = Users.id
         WHERE Orders.status = ? ORDER BY Orders.created_at DESC`,
        ['pending']
      );
      return NextResponse.json(rows, { status: 200 });
    }
    // Для вкладки current/declined для водителя
    if (searchParams.get('driver_id')) {
      const driver_id = Number(searchParams.get('driver_id'));
      const status = searchParams.get('status');
      let query = `SELECT Orders.*, Users.first_name, Users.last_name FROM Orders
                   JOIN Users ON Orders.client_id = Users.id
                   WHERE Orders.driver_id = ?`;
      let params: (string|number)[] = [driver_id];
      if (status) {
        query += ' AND Orders.status = ?';
        params.push(String(status));
      }
      query += ' ORDER BY Orders.created_at DESC';
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