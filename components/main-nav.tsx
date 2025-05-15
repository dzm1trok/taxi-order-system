"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Car, Menu, X } from "lucide-react"
import { useState } from "react"

interface MainNavProps {
  userRole: "client" | "driver"
}

export function MainNav({ userRole }: MainNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const clientLinks = [
    { href: "/dashboard/client", label: "Главная" },
    { href: "/dashboard/client/orders", label: "Мои заказы" },
    { href: "/dashboard/client/new-order", label: "Новый заказ" },
    { href: "/dashboard/client/profile", label: "Профиль" },
  ]

  const driverLinks = [
    { href: "/dashboard/driver", label: "Главная" },
    { href: "/dashboard/driver/orders", label: "Заказы" },
    { href: "/dashboard/driver/stats", label: "Статистика" },
    { href: "/dashboard/driver/profile", label: "Профиль" },
  ]

  const links = userRole === "driver" ? driverLinks : clientLinks

  return (
    <>
      <div className="flex items-center">
        <Link href={`/dashboard/${userRole}`} className="flex items-center gap-2 mr-6">
          <Car className="h-6 w-6" />
          <span className="font-bold text-xl hidden md:inline-block">ТаксиСервис</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href={`/dashboard/${userRole}`} className="flex items-center gap-2">
                <Car className="h-6 w-6" />
                <span className="font-bold text-xl">ТаксиСервис</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Закрыть меню</span>
              </Button>
            </div>
            <nav className="flex flex-col p-4 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary p-2",
                    pathname === link.href ? "text-primary bg-muted rounded-md" : "text-muted-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
