"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Car, Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("all")

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  function filterOrders(status: string) {
    if (status === "all") return orders
    if (status === "active") return orders.filter(o => ["pending", "accepted", "in_progress"].includes(o.status))
    return orders.filter(o => o.status === status)
  }

  function statusLabel(status: string) {
    switch (status) {
      case "pending": return "Ожидание"
      case "accepted": return "Принят"
      case "in_progress": return "В пути"
      case "completed": return "Завершен"
      case "cancelled": return "Отменен"
      default: return status
    }
  }

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Мои заказы</h1>
          <p className="text-muted-foreground">Управляйте своими заказами такси</p>
        </div>
        <Link href="/dashboard/client/new-order">
          <Button>
            <Car className="mr-2 h-4 w-4" /> Новый заказ
          </Button>
        </Link>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Все заказы</TabsTrigger>
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
          <TabsTrigger value="cancelled">Отмененные</TabsTrigger>
        </TabsList>

        {(["all", "active", "completed", "cancelled"] as const).map(tabKey => (
          <TabsContent key={tabKey} value={tabKey} className="space-y-4">
            {loading ? (
              <Card className="p-8 text-center"><p>Загрузка...</p></Card>
            ) : filterOrders(tabKey).length === 0 ? (
              <Card className="p-8 text-center"><p className="text-muted-foreground">Нет заказов</p></Card>
            ) : filterOrders(tabKey).map(order => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Заказ #{order.id}</CardTitle>
                      <CardDescription>{new Date(order.created_at).toLocaleString()}</CardDescription>
                    </div>
                    <Badge>{statusLabel(order.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{order.from_address} → {order.to_address}</p>
                        <p className="text-xs text-muted-foreground">{order.distance ? `${Number(order.distance).toFixed(2)} км` : "-"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.price ? Number(order.price).toFixed(2) : "-"} ₽</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>Класс: {order.car_class === "economy" ? "Эконом" : order.car_class === "comfort" ? "Комфорт" : "Бизнес"}</span>
                    </div>
                    {order.comment && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Комментарий:</span>
                        <span>{order.comment}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
