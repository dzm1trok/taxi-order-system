"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"

interface User {
  firstName: string
  lastName: string
  role: "client" | "driver"
  profile_image?: string | null
}

export default function DriverDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  if (!user) {
    return null // or a loading state
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-6">
          <MainNav userRole={user.role} />
          <UserNav 
            userRole={user.role} 
            userName={`${user.firstName} ${user.lastName}`}
            profileImage={user.profile_image}
          />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
