"use client"

import { useState } from "react"
import { DataTable } from "@/components/admin/data-table"
import { DataTableRowActions } from "@/components/admin/data-table-row-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// Типы данных
type UserRole = "client" | "driver" | "admin"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  createdAt: string
}

// Моковые данные
const users: User[] = [
  {
    id: "1",
    name: "Иван Петров",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
    role: "client",
    createdAt: "01.01.2023",
  },
  {
    id: "2",
    name: "Алексей Иванов",
    email: "alexey@example.com",
    phone: "+7 (999) 987-65-43",
    role: "driver",
    createdAt: "15.12.2022",
  },
  {
    id: "3",
    name: "Администратор",
    email: "admin@example.com",
    phone: "+7 (999) 111-22-33",
    role: "admin",
    createdAt: "01.01.2022",
  },
  {
    id: "4",
    name: "Мария Сидорова",
    email: "maria@example.com",
    phone: "+7 (999) 444-55-66",
    role: "client",
    createdAt: "10.02.2023",
  },
  {
    id: "5",
    name: "Дмитрий Смирнов",
    email: "dmitry@example.com",
    phone: "+7 (999) 777-88-99",
    role: "driver",
    createdAt: "05.03.2023",
  },
]

// Функция для получения текста роли пользователя
function getRoleText(role: UserRole): string {
  switch (role) {
    case "client":
      return "Клиент"
    case "driver":
      return "Водитель"
    case "admin":
      return "Администратор"
    default:
      return role
  }
}

export default function UsersPage() {
  const [data, setData] = useState<User[]>(users)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Обработчики действий
  const handleAdd = () => {
    setCurrentUser({
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "client",
      createdAt: new Date().toLocaleDateString(),
    })
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setCurrentUser(user)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = () => {
    if (!currentUser) return

    if (isEditing) {
      // Обновление существующего пользователя
      setData(data.map((user) => (user.id === currentUser.id ? currentUser : user)))
    } else {
      // Добавление нового пользователя
      const newUser = {
        ...currentUser,
        id: Math.random().toString(36).substring(2, 9),
      }
      setData([...data, newUser])
    }

    setIsDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!currentUser) return
    setData(data.filter((user) => user.id !== currentUser.id))
    setIsDeleteDialogOpen(false)
  }

  // Определение колонок таблицы
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Имя
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Телефон",
    },
    {
      accessorKey: "role",
      header: "Роль",
      cell: ({ row }) => <div>{getRoleText(row.getValue("role"))}</div>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Дата регистрации
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Пользователи</h1>
        <p className="text-muted-foreground">Управление пользователями системы</p>
      </div>

      <DataTable columns={columns} data={data} searchColumn="name" onAdd={handleAdd} />

      {/* Диалог добавления/редактирования пользователя */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Редактировать пользователя" : "Добавить пользователя"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Измените данные пользователя и нажмите Сохранить."
                : "Заполните данные нового пользователя и нажмите Сохранить."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Имя
              </Label>
              <Input
                id="name"
                value={currentUser?.name || ""}
                onChange={(e) => setCurrentUser(currentUser ? { ...currentUser, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={currentUser?.email || ""}
                onChange={(e) => setCurrentUser(currentUser ? { ...currentUser, email: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Телефон
              </Label>
              <Input
                id="phone"
                value={currentUser?.phone || ""}
                onChange={(e) => setCurrentUser(currentUser ? { ...currentUser, phone: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Роль
              </Label>
              <Select
                value={currentUser?.role}
                onValueChange={(value) =>
                  setCurrentUser(currentUser ? { ...currentUser, role: value as UserRole } : null)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Клиент</SelectItem>
                  <SelectItem value="driver">Водитель</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить пользователя {currentUser?.name}? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
