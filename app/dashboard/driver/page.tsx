"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Car, Clock, CreditCard, MapPin, Star, Banknote } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: number
  firstName: string
  lastName: string
  role: string
  driverInfo?: {
    rating?: number
    isOnline: boolean
  }
}

export default function DriverDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setIsOnline(parsedUser.driverInfo?.isOnline || false)
    }
    setLoading(false)
  }, [])

  const handleStatusChange = async (checked: boolean) => {
    if (!user) return

    setUpdatingStatus(true)
    try {
      const response = await fetch("/api/driver/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          isOnline: checked,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      // Update local state
      setIsOnline(checked)
      setUser(prev => {
        if (!prev) return null
        return {
          ...prev,
          driverInfo: {
            ...prev.driverInfo,
            isOnline: checked,
          },
        }
      })

      // Update localStorage
      const userData = localStorage.getItem("user")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        parsedUser.driverInfo = {
          ...parsedUser.driverInfo,
          isOnline: checked,
        }
        localStorage.setItem("user", JSON.stringify(parsedUser))
      }

      toast.success(checked ? "Вы перешли в онлайн режим" : "Вы перешли в оффлайн режим")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Не удалось обновить статус")
      // Revert the switch state
      setIsOnline(!checked)
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in to view this page</div>
  }

  return (
    <div className="container py-6 px-4 md:px-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Добро пожаловать, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            {user.firstName} {user.lastName} • {user.role === "driver" ? "Водитель" : "Клиент"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="online-mode" className="font-medium">
            Режим работы
          </Label>
          <Switch 
            id="online-mode" 
            checked={isOnline} 
            onCheckedChange={handleStatusChange}
            disabled={updatingStatus}
          />
          <Badge variant="outline" className="ml-2">
            {isOnline ? "Онлайн" : "Оффлайн"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заработок сегодня</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250 BYN</div>
            <p className="text-xs text-muted-foreground">+12% по сравнению со вчера</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказов выполнено</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Сегодня</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Рейтинг</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(user.driverInfo?.rating || 0).toFixed(1)}</div>
            <div className="flex mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${
                    star <= Math.floor(Number(user.driverInfo?.rating || 0)) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : star <= Number(user.driverInfo?.rating || 0)
                        ? "text-yellow-400 fill-yellow-400 opacity-80"
                        : "text-gray-300"
                  }`} 
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Время в сети</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6ч 30м</div>
            <p className="text-xs text-muted-foreground">Сегодня</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Новые заказы</CardTitle>
            <CardDescription>Доступные заказы для принятия</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">ул. Пушкина, 15 → ТЦ "Европа"</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>~15 мин</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                        <span>Карта</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">15 BYN</p>
                    <p className="text-xs text-muted-foreground">3.5 км</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Отклонить
                  </Button>
                  <Button size="sm">Принять</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Вокзал → ул. Гагарина, 42</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>~20 мин</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Banknote className="h-3 w-3 text-muted-foreground" />
                        <span>Наличные</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">25 BYN</p>
                    <p className="text-xs text-muted-foreground">5.2 км</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Отклонить
                  </Button>
                  <Button size="sm">Принять</Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Текущий заказ</CardTitle>
            <CardDescription>Информация о текущем заказе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-4">
                  <Badge>В процессе</Badge>
                  <p className="font-bold">32 BYN</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Маршрут</p>
                      <p className="text-sm">ул. Ленина, 10 → Бизнес-центр "Высота"</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Время</p>
                      <p className="text-sm">Начало: 14:30, Ожидаемое прибытие: 14:55</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Оплата</p>
                      <p className="text-sm">Банковская карта</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-2 mt-4">
                  <Button variant="outline">Отменить</Button>
                  <Button>Завершить</Button>
                </div>
              </div>

              <div className="h-48 w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Карта маршрута</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
