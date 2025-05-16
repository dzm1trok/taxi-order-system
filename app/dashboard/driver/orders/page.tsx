"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, CreditCard, MapPin, Banknote } from "lucide-react"
import { useEffect, useState } from "react"

export default function DriverOrdersPage() {
  const driverId = 1;
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentOrders, setCurrentOrders] = useState<any[]>([])
  const [declinedOrders, setDeclinedOrders] = useState<any[]>([])
  const [tab, setTab] = useState("available")

  useEffect(() => {
    if (tab === "available") {
      setLoading(true);
      fetch("/api/orders?available=1")
        .then(res => res.json())
        .then(data => {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    } else if (tab === "current") {
      setLoading(true);
      fetch(`/api/orders?driver_id=${driverId}&status=accepted`)
        .then(res => res.json())
        .then(data => {
          setCurrentOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    } else if (tab === "declined") {
      setLoading(true);
      fetch(`/api/orders?driver_id=${driverId}&status=cancelled`)
        .then(res => res.json())
        .then(data => {
          setDeclinedOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }
  }, [tab]);

  const handleAction = async (id: number, action: "accept" | "decline") => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action })
    });
    // Обновить список заказов
    setLoading(true);
    fetch("/api/orders?available=1")
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Заказы</h1>
        <p className="text-muted-foreground">Управляйте своими заказами</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Доступные</TabsTrigger>
          <TabsTrigger value="current">Текущие</TabsTrigger>
          <TabsTrigger value="declined">Отклоненные</TabsTrigger>
          <TabsTrigger value="completed">Выполненные</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center"><p>Загрузка...</p></Card>
          ) : orders.length === 0 ? (
            <Card className="p-8 text-center"><p className="text-muted-foreground">Нет доступных заказов</p></Card>
          ) : orders.map(order => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Заказ #{order.id}</CardTitle>
                    <CardDescription>{new Date(order.created_at).toLocaleString()}</CardDescription>
                  </div>
                  <Badge variant="outline">{order.distance ? `${Number(order.distance).toFixed(2)} км` : "-"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{order.from_address} → {order.to_address}</p>
                      <p className="text-xs text-muted-foreground">{order.car_class === "economy" ? "Эконом" : order.car_class === "comfort" ? "Комфорт" : "Бизнес"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.price ? Number(order.price).toFixed(2) : "-"} ₽</p>
                    </div>
                  </div>
                  {order.comment && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Комментарий:</span>
                      <span>{order.comment}</span>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleAction(order.id, "decline")}>Отклонить</Button>
                    <Button size="sm" onClick={() => handleAction(order.id, "accept")}>Принять</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="current" className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center"><p>Загрузка...</p></Card>
          ) : currentOrders.length === 0 ? (
            <Card className="p-8 text-center"><p className="text-muted-foreground">Нет текущих заказов</p></Card>
          ) : currentOrders.map(order => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Заказ #{order.id}</CardTitle>
                    <CardDescription>{new Date(order.created_at).toLocaleString()}</CardDescription>
                  </div>
                  <Badge>В процессе</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{order.from_address} → {order.to_address}</p>
                      <p className="text-xs text-muted-foreground">{order.car_class === "economy" ? "Эконом" : order.car_class === "comfort" ? "Комфорт" : "Бизнес"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.price ? Number(order.price).toFixed(2) : "-"} ₽</p>
                    </div>
                  </div>
                  {order.comment && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Комментарий:</span>
                      <span>{order.comment}</span>
                    </div>
                  )}
                  {/* Здесь можно добавить подробную информацию о клиенте */}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="declined" className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center"><p>Загрузка...</p></Card>
          ) : declinedOrders.length === 0 ? (
            <Card className="p-8 text-center"><p className="text-muted-foreground">Нет отклоненных заказов</p></Card>
          ) : declinedOrders.map(order => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Заказ #{order.id}</CardTitle>
                    <CardDescription>{new Date(order.created_at).toLocaleString()}</CardDescription>
                  </div>
                  <Badge variant="outline">Отклонен</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{order.from_address} → {order.to_address}</p>
                      <p className="text-xs text-muted-foreground">{order.car_class === "economy" ? "Эконом" : order.car_class === "comfort" ? "Комфорт" : "Бизнес"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.price ? Number(order.price).toFixed(2) : "-"} ₽</p>
                    </div>
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

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1233</CardTitle>
                  <CardDescription>12.04.2023</CardDescription>
                </div>
                <Badge variant="outline">Выполнен</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">ул. Гагарина, 42 → ТЦ "Мега"</p>
                    <p className="text-xs text-muted-foreground">12.04.2023, 12:30</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">290 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      <Banknote className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs ml-1">Наличные</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Время в пути: 22 минуты</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1232</CardTitle>
                  <CardDescription>12.04.2023</CardDescription>
                </div>
                <Badge variant="outline">Выполнен</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Бизнес-центр "Высота" → ул. Ленина, 10</p>
                    <p className="text-xs text-muted-foreground">12.04.2023, 10:15</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">320 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs ml-1">Карта</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Время в пути: 25 минут</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
