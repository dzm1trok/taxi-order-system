import type React from "react"
import { SidebarNav } from "@/components/admin/sidebar-nav"
import { UserNav } from "@/components/user-nav"

const sidebarNavItems = [
  {
    title: "Пользователи",
    href: "/dashboard/admin/users",
  },
  {
    title: "Водители",
    href: "/dashboard/admin/drivers",
  },
  {
    title: "Заказы",
    href: "/dashboard/admin/orders",
  },
  {
    title: "Платежи",
    href: "/dashboard/admin/payments",
  },
  {
    title: "Отзывы",
    href: "/dashboard/admin/reviews",
  },
]

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-6">
          <div className="font-bold text-xl">Админ-панель ТаксиСервис</div>
          <UserNav userRole="admin" userName="Администратор" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 px-4 md:px-6 py-6">
        <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
