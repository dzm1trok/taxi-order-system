"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Car, Clock, History, MapPin } from "lucide-react"

interface User {
  firstName: string
  lastName: string
  role: "client" | "driver"
  email: string
}

export default function ClientDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0)
  const [activeOrdersCount, setActiveOrdersCount] = useState(0)
  const [lastOrder, setLastOrder] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Fetch orders count and recent orders
      const userEmail = parsedUser.email
      if (userEmail) {
        fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              const completedOrders = data.filter(order => order.status === 'completed')
              const activeOrders = data.filter(order => ['pending', 'accepted', 'in_progress'].includes(order.status))
              setCompletedOrdersCount(completedOrders.length)
              setActiveOrdersCount(activeOrders.length)
              
              // Get the most recent orders
              if (data.length > 0) {
                const sortedOrders = [...data].sort((a, b) => 
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
                setLastOrder(sortedOrders[0])
                setRecentOrders(sortedOrders.slice(0, 3))
              }
            }
          })
      }
    }
  }, [])

  const handleReorder = async (order: any) => {
    if (!user?.email) return

    const orderData = {
      email: user.email,
      from_address: order.from_address,
      to_address: order.to_address,
      car_class: order.car_class,
      price: order.price,
      distance: order.distance,
      comment: order.comment,
      status: 'pending'
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (res.ok) {
        window.location.href = "/dashboard/client/orders"
      } else {
        const error = await res.json()
        alert('Ошибка при создании заказа: ' + (error?.error || ''))
      }
    } catch (error) {
      alert('Ошибка при создании заказа')
    }
  }

  if (!user) {
    return null // or a loading state
  }

  return (
    <div className="container py-6 px-4 md:px-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Добро пожаловать, {user.firstName}!</h1>
          <p className="text-muted-foreground">Управляйте своими поездками и заказами такси</p>
        </div>
        <Link href="/dashboard/client/new-order">
          <Button size="lg" className="w-full md:w-auto">
            <Car className="mr-2 h-4 w-4" /> Заказать такси
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Последний заказ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastOrder ? new Date(lastOrder.created_at).toLocaleString() : 'Нет заказов'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastOrder ? `${lastOrder.from_address} → ${lastOrder.to_address}` : 'У вас пока нет заказов'}
            </p>
            <div className="mt-4">
              <Link href="/dashboard/client/orders">
                <Button variant="outline" size="sm">
                  Подробнее
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные заказы</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrdersCount}</div>
            <p className="text-xs text-muted-foreground">У вас нет активных заказов</p>
            <div className="mt-4">
              <Link href="/dashboard/client/new-order">
                <Button variant="outline" size="sm">
                  Заказать такси
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">История заказов</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Всего выполненных заказов</p>
            <div className="mt-4">
              <Link href="/dashboard/client/orders">
                <Button variant="outline" size="sm">
                  Посмотреть историю
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Популярные маршруты</CardTitle>
            <CardDescription>Ваши частые поездки</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{order.from_address} → {order.to_address}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleReorder(order)}>
                    Заказать
                  </Button>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">Нет истории заказов</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Последние отзывы</CardTitle>
            <CardDescription>Ваши отзывы о поездках</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Поездка 12.04.2023</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-4 w-4 ${star <= 5 ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Отличный водитель, приехал вовремя!</p>
              </div>
              <div className="border-b pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Поездка 05.04.2023</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((star) => (
                      <svg
                        key={star}
                        className={`h-4 w-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Хорошая поездка, но немного задержался.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
