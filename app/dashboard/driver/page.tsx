"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Car, Clock, CreditCard, MapPin, Star, Banknote, User, MessageSquare } from "lucide-react"
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
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0)
  const [totalDistance, setTotalDistance] = useState(0)
  const [availableOrders, setAvailableOrders] = useState<any[]>([])
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const driverId = 1; // This should be replaced with actual driver ID from auth

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

  useEffect(() => {
    // Fetch completed orders to calculate earnings and count
    fetch(`/api/orders?driver_id=${driverId}&status=completed`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const earnings = data.reduce((sum, order) => sum + (Number(order.price) || 0), 0)
          const distance = data.reduce((sum, order) => sum + (Number(order.distance) || 0), 0)
          setTotalEarnings(earnings)
          setCompletedOrdersCount(data.length)
          setTotalDistance(distance)
        }
      })
  }, [])

  useEffect(() => {
    // Fetch available orders
    fetch('/api/orders?available=1')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAvailableOrders(data)
        }
      })
  }, [])

  useEffect(() => {
    // Fetch current active order
    fetch(`/api/orders?driver_id=${driverId}&status=accepted`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCurrentOrder(data[0]) // Берем первый заказ, так как у водителя может быть только один активный заказ
        }
      })
  }, [driverId])

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

  const handleAcceptOrder = async (orderId: number) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, action: 'accept' })
      })

      if (!response.ok) {
        throw new Error('Failed to accept order')
      }

      // Update available orders and set current order
      const acceptedOrder = availableOrders.find(order => order.id === orderId)
      if (acceptedOrder) {
        setCurrentOrder(acceptedOrder)
        setAvailableOrders(prev => prev.filter(order => order.id !== orderId))
      }

      toast.success('Заказ принят')
    } catch (error) {
      console.error('Error accepting order:', error)
      toast.error('Не удалось принять заказ')
    }
  }

  const handleDeclineOrder = async (orderId: number) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, action: 'decline' })
      })

      if (!response.ok) {
        throw new Error('Failed to decline order')
      }

      // Remove declined order from available orders
      setAvailableOrders(prev => prev.filter(order => order.id !== orderId))
      toast.success('Заказ отклонен')
    } catch (error) {
      console.error('Error declining order:', error)
      toast.error('Не удалось отклонить заказ')
    }
  }

  const handleCompleteOrder = async () => {
    if (!currentOrder) return

    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentOrder.id, action: 'complete' })
      })

      if (!response.ok) {
        throw new Error('Failed to complete order')
      }

      setCurrentOrder(null)
      toast.success('Заказ завершен')
      
      // Refresh completed orders count and earnings
      fetch(`/api/orders?driver_id=${driverId}&status=completed`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const earnings = data.reduce((sum, order) => sum + (Number(order.price) || 0), 0)
            setTotalEarnings(earnings)
            setCompletedOrdersCount(data.length)
          }
        })
    } catch (error) {
      console.error('Error completing order:', error)
      toast.error('Не удалось завершить заказ')
    }
  }

  const handleCancelOrder = async () => {
    if (!currentOrder) return

    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentOrder.id, action: 'decline' })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel order')
      }

      setCurrentOrder(null)
      toast.success('Заказ отменен')
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error('Не удалось отменить заказ')
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
            <CardTitle className="text-sm font-medium">Общий заработок</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toFixed(2)} BYN</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказов выполнено</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrdersCount}</div>
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
            <CardTitle className="text-sm font-medium">Всего проехано</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(1)} км</div>
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
            {availableOrders.length === 0 ? (
              <p className="text-center text-muted-foreground">Нет доступных заказов</p>
            ) : (
              availableOrders.map(order => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{order.from_address} → {order.to_address}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>~{Math.ceil(order.distance * 2)} мин</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <p className="text-sm"> Клиент: {order.first_name} {order.last_name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{Number(order.price).toFixed(2)} BYN</p>
                        <p className="text-xs text-muted-foreground">{Number(order.distance).toFixed(1)} км</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeclineOrder(order.id)}
                      >
                        Отклонить
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        Принять
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Текущий заказ</CardTitle>
            <CardDescription>Информация о текущем заказе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentOrder ? (
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <Badge>В процессе</Badge>
                      <p className="text-xs text-muted-foreground">
                        Создан: {new Date(currentOrder.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-bold">{Number(currentOrder.price).toFixed(2)} BYN</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Маршрут</p>
                        <p className="text-sm">{currentOrder.from_address} → {currentOrder.to_address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Расстояние</p>
                        <p className="text-sm">{Number(currentOrder.distance).toFixed(1)} км</p>
                      </div>
                    </div>

                    {(currentOrder.first_name || currentOrder.last_name) && (
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Клиент</p>
                          <p className="text-sm">
                            {currentOrder.first_name} {currentOrder.last_name}
                            {currentOrder.phone && ` • ${currentOrder.phone}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {currentOrder.comment && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Комментарий</p>
                          <p className="text-sm">{currentOrder.comment}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between gap-2 mt-4">
                    <Button variant="outline" onClick={handleCancelOrder}>Отменить</Button>
                    <Button onClick={handleCompleteOrder}>Завершить</Button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Нет активных заказов</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
