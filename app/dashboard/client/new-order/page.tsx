"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Car, Clock, CreditCard, Banknote } from "lucide-react"
import { useRouter } from "next/navigation"
import Map from "@/app/components/Map"

export default function NewOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderStep, setOrderStep] = useState(1)
  const [fromAddress, setFromAddress] = useState("ул. Ленина, 10")
  const [toAddress, setToAddress] = useState("")
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const [carClass, setCarClass] = useState("economy")
  const [comment, setComment] = useState("")
  let pricePerKm = 0.75
  if (carClass === "comfort") pricePerKm = 1.5
  if (carClass === "business") pricePerKm = 2
  const price = distance ? (Math.ceil(distance / 1000) * pricePerKm) : 0

  // Получение email авторизованного пользователя (пример: из localStorage или контекста)
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : '';

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!userEmail) {
      alert('Ошибка: не найден email пользователя. Пожалуйста, войдите в систему.');
      setLoading(false);
      return;
    }
    console.log('Создание заказа, email:', userEmail);

    const orderData = {
      email: userEmail,
      from_address: fromAddress,
      to_address: toAddress,
      car_class: carClass,
      price: price,
      distance: distance / 1000, // в км
      comment: comment,
      status: 'pending'
    }
    console.log('orderData:', orderData);

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })

    if (res.ok) {
      router.push("/dashboard/client/orders?email=" + encodeURIComponent(userEmail))
    } else {
      setLoading(false)
      const error = await res.json();
      alert('Ошибка при создании заказа: ' + (error?.error || '')); 
      console.log('Ошибка при создании заказа:', error);
    }
  }

  return (
    <div className="container py-6 px-4 md:px-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Новый заказ</h1>
        <p className="text-muted-foreground">Заполните информацию для заказа такси</p>
      </div>

      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center ${orderStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              1
            </div>
            <span className={orderStep >= 1 ? "font-medium" : "text-muted-foreground"}>Маршрут</span>
          </div>
          <div className="h-px w-12 bg-muted"></div>
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center ${orderStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <span className={orderStep >= 2 ? "font-medium" : "text-muted-foreground"}>Детали</span>
          </div>
          <div className="h-px w-12 bg-muted"></div>
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center ${orderStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              3
            </div>
            <span className={orderStep >= 3 ? "font-medium" : "text-muted-foreground"}>Оплата</span>
          </div>
        </div>

        {orderStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Укажите маршрут</CardTitle>
              <CardDescription>Введите адреса отправления и назначения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-address">Откуда</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="from-address"
                      placeholder="Адрес отправления"
                      className="pl-8"
                      value={fromAddress}
                      onChange={e => setFromAddress(e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-address">Куда</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="to-address" placeholder="Адрес назначения" className="pl-8" value={toAddress} onChange={e => setToAddress(e.target.value)} />
                  </div>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="h-64 w-full bg-muted rounded-md">
                <Map className="h-full w-full rounded-md" from={fromAddress} to={toAddress} onRouteChange={(dist, dur) => { setDistance(dist); setDuration(dur); }} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/dashboard/client")}>
                Отмена
              </Button>
              <Button onClick={() => setOrderStep(2)}>Далее</Button>
            </CardFooter>
          </Card>
        )}

        {orderStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Детали заказа</CardTitle>
              <CardDescription>Выберите класс автомобиля и дополнительные опции</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Класс автомобиля</Label>
                <Tabs value={carClass} onValueChange={setCarClass}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="economy">Эконом</TabsTrigger>
                    <TabsTrigger value="comfort">Комфорт</TabsTrigger>
                    <TabsTrigger value="business">Бизнес</TabsTrigger>
                  </TabsList>
                  <TabsContent value="economy" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Эконом</p>
                          <p className="text-sm text-muted-foreground">Стандартные седаны</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{distance ? (Math.ceil(distance / 1000) * 0.75).toFixed(2) : '0.00'} BYN</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="comfort" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Комфорт</p>
                          <p className="text-sm text-muted-foreground">Просторные автомобили</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{distance ? (Math.ceil(distance / 1000) * 1.5).toFixed(2) : '0.00'} BYN</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="business" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Бизнес</p>
                          <p className="text-sm text-muted-foreground">Премиум автомобили</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{distance ? (Math.ceil(distance / 1000) * 2).toFixed(2) : '0.00'} BYN</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label>Время подачи</Label>
                <RadioGroup defaultValue="now">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="time-now" />
                    <Label htmlFor="time-now" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Как можно скорее
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий для водителя</Label>
                <Textarea id="comment" placeholder="Например: подъезд №2, код домофона 1234" value={comment} onChange={e => setComment(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setOrderStep(1)}>
                Назад
              </Button>
              <Button onClick={() => setOrderStep(3)}>Далее</Button>
            </CardFooter>
          </Card>
        )}

        {orderStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Способ оплаты</CardTitle>
              <CardDescription>Выберите способ оплаты поездки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup defaultValue="card">
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="card" id="payment-card" />
                  <Label htmlFor="payment-card" className="flex items-center gap-2 flex-1">
                    <CreditCard className="h-4 w-4" />
                    <div>
                      <p>Банковская карта</p>
                      <p className="text-sm text-muted-foreground">**** 4567</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="cash" id="payment-cash" />
                  <Label htmlFor="payment-cash" className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Наличные
                  </Label>
                </div>
              </RadioGroup>

              <div className="border rounded-md p-4 mt-6">
                <h3 className="font-medium mb-2">Детали заказа</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Маршрут:</span>
                    <span>{fromAddress || 'Неизвестно'} → {toAddress || 'Неизвестно'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Класс:</span>
                    <span>{carClass === "economy" ? "Эконом" : carClass === "comfort" ? "Комфорт" : "Бизнес"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Время подачи:</span>
                    <span>Как можно скорее</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Расстояние:</span>
                    <span>{distance ? (distance / 1000).toFixed(2) + ' км' : '-'}</span>
                  </div>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Итого:</span>
                  <span>{price ? price.toFixed(2) : '0.00'} BYN</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setOrderStep(2)}>
                Назад
              </Button>
              <Button onClick={handleCreateOrder} disabled={loading}>
                {loading ? "Оформление заказа..." : "Заказать такси"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
