"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CreditCard, User, Lock, MapPin, History } from "lucide-react"
import { toast } from "sonner"

interface ClientProfile {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string
  createdAt: string
  homeAddress: string
  workAddress: string
  profile_image: string | null
  totalRides: number
}

export default function ClientProfilePage() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    homeAddress: "",
    workAddress: ""
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const userData = localStorage.getItem("user")
      if (!userData) {
        toast.error("Не удалось получить данные пользователя")
        return
      }

      const user = JSON.parse(userData)
      const response = await fetch("/api/client/profile", {
        headers: {
          "x-user-id": user.id.toString()
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile(data.profile)
      
      // Update user data in localStorage with profile image
      const updatedUser = {
        ...user,
        profile_image: data.profile.profile_image
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      setFormData({
        firstName: data.profile.firstName || "",
        lastName: data.profile.lastName || "",
        phone: data.profile.phone || "",
        email: data.profile.email || "",
        homeAddress: data.profile.homeAddress || "",
        workAddress: data.profile.workAddress || ""
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Не удалось загрузить профиль")
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userData = localStorage.getItem("user")
      if (!userData) {
        throw new Error("User data not found")
      }

      const user = JSON.parse(userData)
      const response = await fetch("/api/client/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id.toString()
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      await fetchProfile()
      toast.success("Профиль успешно обновлен")
      setSuccessMessage("Профиль успешно обновлен")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Не удалось обновить профиль")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPasswordError(null)
    setSaveStatus(null)

    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("Новые пароли не совпадают")
        return
      }

      if (passwordData.newPassword.length < 6) {
        setPasswordError("Новый пароль должен содержать минимум 6 символов")
        return
      }

      const userData = localStorage.getItem("user")
      if (!userData) {
        throw new Error("User data not found")
      }

      const user = JSON.parse(userData)
      const response = await fetch("/api/client/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id.toString()
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to change password")
      }

      setSaveStatus("success")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      console.error("Error changing password:", error)
      setPasswordError(error.message)
      setSaveStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageUpload = async () => {
    if (!imageFile) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const userData = localStorage.getItem("user")
      if (!userData) {
        throw new Error("User data not found")
      }

      const user = JSON.parse(userData)
      const response = await fetch("/api/client/upload-profile-image", {
        method: "POST",
        headers: {
          "x-user-id": user.id.toString()
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      setProfile(prev => prev ? { ...prev, profile_image: data.profile_image } : null)
      toast.success("Фото профиля успешно обновлено")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Не удалось загрузить фото")
    } finally {
      setLoading(false)
      setImageFile(null)
      setImagePreview(null)
    }
  }

  if (!profile) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
        <p className="text-muted-foreground">Управляйте своими личными данными</p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Личная информация</CardTitle>
            <CardDescription>Ваши основные данные</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={profile.profile_image || "/placeholder-user.jpg"} 
                alt={`${profile.firstName} ${profile.lastName}`} 
              />
              <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-medium">{`${profile.firstName} ${profile.lastName}`}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <p className="text-sm text-muted-foreground">{profile.phone}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image-input"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('profile-image-input')?.click()}
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Изменить фото"}
              </Button>
              {imagePreview && (
                <div className="flex flex-col items-center gap-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleImageUpload}
                    disabled={loading}
                  >
                    Сохранить
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-2" />

            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Дата регистрации</span>
                </div>
                <span className="text-sm">{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Поездок</span>
                </div>
                <span className="text-sm">{profile.totalRides}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <Tabs defaultValue="personal">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Настройки профиля</CardTitle>
                <TabsList>
                  <TabsTrigger value="personal">
                    <User className="h-4 w-4 mr-2" />
                    Личные
                  </TabsTrigger>
                  <TabsTrigger value="payment">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Оплата
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Lock className="h-4 w-4 mr-2" />
                    Безопасность
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>Обновите свои личные данные</CardDescription>
            </CardHeader>

            <TabsContent value="personal">
              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Имя</Label>
                      <Input 
                        id="firstName" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input 
                        id="lastName" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeAddress">Домашний адрес</Label>
                    <Input 
                      id="homeAddress" 
                      value={formData.homeAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workAddress">Рабочий адрес</Label>
                    <Input 
                      id="workAddress" 
                      value={formData.workAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                  {successMessage && (
                    <span className="text-green-600 text-sm">{successMessage}</span>
                  )}
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="payment">
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Visa **** 4567</p>
                        <p className="text-xs text-muted-foreground">Истекает 12/25</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Удалить
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Добавить новую карту
                </Button>
              </CardContent>
            </TabsContent>

            <TabsContent value="security">
              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Текущий пароль</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Новый пароль</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                  </div>
                  {passwordError && (
                    <div className="text-red-600 text-sm">{passwordError}</div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Сохранение..." : "Изменить пароль"}
                  </Button>
                  {saveStatus === "success" && (
                    <span className="text-green-600 font-medium">Пароль успешно изменен</span>
                  )}
                  {saveStatus === "error" && (
                    <span className="text-red-600 font-medium">Ошибка при изменении пароля</span>
                  )}
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
