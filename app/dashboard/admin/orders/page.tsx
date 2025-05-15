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
import { Badge } from "@/components/ui/badge"

// Типы данных
type OrderStatus = "pending" | "active" | "completed" | "cancelled"

interface Order {
  id: string
  orderNumber: string
  clientName: string
  driverName: string | null
  fromAddress: string
  toAddress: string
  price: number
  status: OrderStatus
  createdAt: string
  completedAt: string | null
}

// Моковые данные
const orders: Order[] = [
  {
    id: "1",
    orderNumber: "#1234",
    clientName: "Иван Петров",
    driverName: "Алексей Иванов",
    fromAddress: "ул. Ленина, 10",
    toAddress: "ТЦ 'Мега'",
    price: 250,
    status: "completed",
    createdAt: "12.04.2023, 14:30",
    completedAt: "12.04.2023, 14:55",
  },
  {
    id: "2",
    orderNumber: "#1233",
    clientName: "Иван Петров",
    driverName: "Дмитрий Смирнов",
    fromAddress: "Бизнес-центр 'Высота'",
    toAddress: "ул. Ленина, 10",
    price: 320,
    status: "completed",
    createdAt: "05.04.2023, 18:15",
    completedAt: "05.04.2023, 18:50",
  },
  {
    id: "3",
    orderNumber: "#1235",
    clientName: "Мария Сидорова",
    driverName: null,
    fromAddress: "ул. Пушкина, 15",
    toAddress: "ТЦ 'Европа'",
    price: 280,
    status: "pending",
    createdAt: "15.04.2023, 10:00",
    completedAt: null,
  },
  {
    id: "4",
    orderNumber: "#1236",
    clientName: "Мария Сидорова",
    driverName: "Сергей Козлов",
    fromAddress: "Вокзал",
    toAddress: "ул. Гагарина, 42",
    price: 350,
    status: "active",
    createdAt: "15.04.2023, 12:30",
    completedAt: null,
  },
  {
    id: "5",
    orderNumber: "#1237",
    clientName: "Иван Петров",
    driverName: null,
    fromAddress: "ул. Ленина, 10",
    toAddress: "Аэропорт",
    price: 500,
    status: "cancelled",
    createdAt: "16.04.2023, 08:00",
    completedAt: null,
  },
]

// Функция для получения текста статуса заказа
function getStatusText(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Ожидает"
    case "active":
      return "В процессе"
    case "completed":
      return "Завершен"
    case "cancelled":
      return "Отменен"
    default:
      return status
  }
}

// Функция для получения цвета статуса заказа
function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "active":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return ""
  }
}

export default function OrdersPage() {
  const [data, setData] = useState<Order[]>(orders)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Обработчики действий
  const handleAdd = () => {
    setCurrentOrder({
      id: "",
      orderNumber: `#${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: "",
      driverName: null,
      fromAddress: "",
      toAddress: "",
      price: 0,
      status: "pending",
      createdAt: new Date().toLocaleString(),
      completedAt: null,
    })
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEdit = (order: Order) => {
    setCurrentOrder(order)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = (order: Order) => {
    setCurrentOrder(order)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = () => {
    if (!currentOrder) return

    if (isEditing) {
      // Обновление существующего заказа
      setData(data.map((order) => (order.id === currentOrder.id ? currentOrder : order)))
    } else {
      // Добавление нового заказа
      const newOrder = {
        ...currentOrder,
        id: Math.random().toString(36).substring(2, 9),
      }
      setData([...data, newOrder])
    }

    setIsDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!currentOrder) return
    setData(data.filter((order) => order.id !== currentOrder.id))
    setIsDeleteDialogOpen(false)
  }

  // Определение колонок таблицы
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderNumber",
      header: "№ заказа",
    },
    {
      accessorKey: "clientName",
      header: "Клиент",
    },
    {
      accessorKey: "driverName",
      header: "Водитель",
      cell: ({ row }) => {
        const driverName = row.getValue("driverName")
        return <div>{driverName || "Не назначен"}</div>
      },
    },
    {
      accessorKey: "fromAddress",
      header: "Откуда",
    },
    {
      accessorKey: "toAddress",
      header: "Куда",
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Цена
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"))
        return <div>{price.toFixed(0)} ₽</div>
      },
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const status = row.getValue("status") as OrderStatus
        return (
          <Badge variant="outline" className={getStatusColor(status)}>
            {getStatusText(status)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Создан
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
        <h1 className="text-3xl font-bold tracking-tight">Заказы</h1>
        <p className="text-muted-foreground">Управление заказами в системе</p>
      </div>

      <DataTable columns={columns} data={data} searchColumn="orderNumber" onAdd={handleAdd} />

      {/* Диалог добавления/редактирования заказа */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Редактировать заказ" : "Добавить заказ"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Измените данные заказа и нажмите Сохранить."
                : "Заполните данные нового заказа и нажмите Сохранить."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderNumber" className="text-right">
                № заказа
              </Label>
              <Input
                id="orderNumber"
                value={currentOrder?.orderNumber || ""}
                onChange={(e) =>
                  setCurrentOrder(currentOrder ? { ...currentOrder, orderNumber: e.target.value } : null)
                }
                className="col-span-3"
                disabled={isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName" className="text-right">
                Клиент
              </Label>
              <Input
                id="clientName"
                value={currentOrder?.clientName || ""}
                onChange={(e) => setCurrentOrder(currentOrder ? { ...currentOrder, clientName: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driverName" className="text-right">
                Водитель
              </Label>
              <Input
                id="driverName"
                value={currentOrder?.driverName || ""}
                onChange={(e) =>
                  setCurrentOrder(currentOrder ? { ...currentOrder, driverName: e.target.value || null } : null)
                }
                className="col-span-3"
                placeholder="Не назначен"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fromAddress" className="text-right">
                Откуда
              </Label>
              <Input
                id="fromAddress"
                value={currentOrder?.fromAddress || ""}
                onChange={(e) =>
                  setCurrentOrder(currentOrder ? { ...currentOrder, fromAddress: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="toAddress" className="text-right">
                Куда
              </Label>
              <Input
                id="toAddress"
                value={currentOrder?.toAddress || ""}
                onChange={(e) => setCurrentOrder(currentOrder ? { ...currentOrder, toAddress: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Цена
              </Label>
              <Input
                id="price"
                type="number"
                value={currentOrder?.price || 0}
                onChange={(e) =>
                  setCurrentOrder(currentOrder ? { ...currentOrder, price: Number.parseFloat(e.target.value) } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Статус
              </Label>
              <Select
                value={currentOrder?.status}
                onValueChange={(value) =>
                  setCurrentOrder(currentOrder ? { ...currentOrder, status: value as OrderStatus } : null)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="active">В процессе</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
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
              Вы уверены, что хотите удалить заказ {currentOrder?.orderNumber}? Это действие нельзя отменить.
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
