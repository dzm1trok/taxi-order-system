"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "client"
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const isDriver = role === "driver"

    const userData = {
      email: formData.get(isDriver ? "driver-email" : "client-email"),
      password: formData.get(isDriver ? "driver-password" : "client-password"),
      firstName: formData.get(isDriver ? "driver-first-name" : "client-first-name"),
      lastName: formData.get(isDriver ? "driver-last-name" : "client-last-name"),
      phone: formData.get(isDriver ? "driver-phone" : "client-phone"),
      role,
      ...(isDriver && {
        carModel: formData.get("driver-car-model"),
        carNumber: formData.get("driver-car-number"),
      }),
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      toast.success("Registration successful!")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Car className="h-6 w-6" />
        <span className="text-2xl font-bold">ТаксиСервис</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
          <CardDescription>Создайте аккаунт для использования сервиса</CardDescription>
        </CardHeader>
        <Tabs defaultValue={role}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">Клиент</TabsTrigger>
            <TabsTrigger value="driver">Водитель</TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-first-name">Имя</Label>
                    <Input id="client-first-name" name="client-first-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-last-name">Фамилия</Label>
                    <Input id="client-last-name" name="client-last-name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input id="client-email" name="client-email" type="email" placeholder="example@mail.ru" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-phone">Телефон</Label>
                  <Input id="client-phone" name="client-phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-password">Пароль</Label>
                  <Input id="client-password" name="client-password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-confirm-password">Подтверждение пароля</Label>
                  <Input id="client-confirm-password" name="client-confirm-password" type="password" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Регистрация..." : "Зарегистрироваться как клиент"}
                </Button>
                <div className="mt-4 text-center text-sm">
                  Уже есть аккаунт?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Войти
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="driver">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver-first-name">Имя</Label>
                    <Input id="driver-first-name" name="driver-first-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver-last-name">Фамилия</Label>
                    <Input id="driver-last-name" name="driver-last-name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-email">Email</Label>
                  <Input id="driver-email" name="driver-email" type="email" placeholder="example@mail.ru" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-phone">Телефон</Label>
                  <Input id="driver-phone" name="driver-phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-car-model">Модель автомобиля</Label>
                  <Input id="driver-car-model" name="driver-car-model" placeholder="Toyota Camry" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-car-number">Номер автомобиля</Label>
                  <Input id="driver-car-number" name="driver-car-number" placeholder="А123БВ777" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-password">Пароль</Label>
                  <Input id="driver-password" name="driver-password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-confirm-password">Подтверждение пароля</Label>
                  <Input id="driver-confirm-password" name="driver-confirm-password" type="password" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Регистрация..." : "Зарегистрироваться как водитель"}
                </Button>
                <div className="mt-4 text-center text-sm">
                  Уже есть аккаунт?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Войти
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
