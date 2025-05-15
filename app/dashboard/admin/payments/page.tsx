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
type PaymentStatus = "completed" | "pending" | "failed" | "refunded"
type PaymentMethod = "card" | "cash"

interface Payment {
  id: string
  orderNumber: string
  clientName: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  date: string
  transactionId: string
}

// Моковые данные
const payments: Payment[] = [
  {
    id: "1",
    orderNumber: "#1234",
    clientName: "Иван Петров",
    amount: 250,
    method: "card",
    status: "completed",
    date: "12.04.2023, 14:55",
    transactionId: "txn_123456789",
  },
  {
    id: "2",
    orderNumber: "#1233",
    clientName: "Иван Петров",
    amount: 320,
    method: "card",
    status: "completed",
    date: "05.04.2023, 18:50",
    transactionId: "txn_987654321",
  },
  {
    id: "3",
    orderNumber: "#1236",
    clientName: "Мария Сидорова",
    amount: 350,
    method: "cash",
    status: "completed",
    date: "15.04.2023, 13:00",
    transactionId: "cash_payment",
  },
  {
    id: "4",
    orderNumber: "#1238",
    clientName: "Алексей Смирнов",
    amount: 420,
    method: "card",
    status: "pending",
    date: "17.04.2023, 09:15",
    transactionId: "txn_pending123",
  },
  {
    id: "5",
    orderNumber: "#1239",
    clientName: "Дмитрий Козлов",
    amount: 180,
    method: "card",
    status: "failed",
    date: "17.04.2023, 11:30",
    transactionId: "txn_failed456",
  },
]

// Функция для получения текста статуса платежа
function getStatusText(status: PaymentStatus): string {
  switch (status) {
    case "completed":
      return "Выполнен"
    case "pending":
      return "В обработке"
    case "failed":
      return "Ошибка"
    case "refunded":
      return "Возвращен"
    default:
      return status
  }
}

// Функция для получения цвета статуса платежа
function getStatusColor(status: PaymentStatus): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    case "refunded":
      return "bg-blue-100 text-blue-800"
    default:
      return ""
  }
}

// Функция для получения текста метода оплаты
function getMethodText(method: PaymentMethod): string {
  switch (method) {
    case "card":
      return "Карта"
    case "cash":
      return "Наличные"
    default:
      return method
  }
}

export default function PaymentsPage() {
  const [data, setData] = useState<Payment[]>(payments)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Обработчики действий
  const handleAdd = () => {
    setCurrentPayment({
      id: "",
      orderNumber: "",
      clientName: "",
      amount: 0,
      method: "card",
      status: "pending",
      date: new Date().toLocaleString(),
      transactionId: "",
    })
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEdit = (payment: Payment) => {
    setCurrentPayment(payment)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = (payment: Payment) => {
    setCurrentPayment(payment)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = () => {
    if (!currentPayment) return

    if (isEditing) {
      // Обновление существующего платежа
      setData(data.map((payment) => (payment.id === currentPayment.id ? currentPayment : payment)))
    } else {
      // Добавление нового платежа
      const newPayment = {
        ...currentPayment,
        id: Math.random().toString(36).substring(2, 9),
      }
      setData([...data, newPayment])
    }

    setIsDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!currentPayment) return
    setData(data.filter((payment) => payment.id !== currentPayment.id))
    setIsDeleteDialogOpen(false)
  }

  // Определение колонок таблицы
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "orderNumber",
      header: "№ заказа",
    },
    {
      accessorKey: "clientName",
      header: "Клиент",
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Сумма
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        return <div>{amount.toFixed(0)} ₽</div>
      },
    },
    {
      accessorKey: "method",
      header: "Способ оплаты",
      cell: ({ row }) => {
        const method = row.getValue("method") as PaymentMethod
        return <div>{getMethodText(method)}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const status = row.getValue("status") as PaymentStatus
        return (
          <Badge variant="outline" className={getStatusColor(status)}>
            {getStatusText(status)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Дата
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "transactionId",
      header: "ID транзакции",
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Платежи</h1>
        <p className="text-muted-foreground">Управление платежами в системе</p>
      </div>

      <DataTable columns={columns} data={data} searchColumn="orderNumber" onAdd={handleAdd} />

      {/* Диалог добавления/редактирования платежа */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Редактировать платеж" : "Добавить платеж"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Измените данные платежа и нажмите Сохранить."
                : "Заполните данные нового платежа и нажмите Сохранить."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderNumber" className="text-right">
                № заказа
              </Label>
              <Input
                id="orderNumber"
                value={currentPayment?.orderNumber || ""}
                onChange={(e) =>
                  setCurrentPayment(currentPayment ? { ...currentPayment, orderNumber: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName" className="text-right">
                Клиент
              </Label>
              <Input
                id="clientName"
                value={currentPayment?.clientName || ""}
                onChange={(e) =>
                  setCurrentPayment(currentPayment ? { ...currentPayment, clientName: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Сумма
              </Label>
              <Input
                id="amount"
                type="number"
                value={currentPayment?.amount || 0}
                onChange={(e) =>
                  setCurrentPayment(
                    currentPayment ? { ...currentPayment, amount: Number.parseFloat(e.target.value) } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Способ оплаты
              </Label>
              <Select
                value={currentPayment?.method}
                onValueChange={(value) =>
                  setCurrentPayment(currentPayment ? { ...currentPayment, method: value as PaymentMethod } : null)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите способ оплаты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Карта</SelectItem>
                  <SelectItem value="cash">Наличные</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Статус
              </Label>
              <Select
                value={currentPayment?.status}
                onValueChange={(value) =>
                  setCurrentPayment(currentPayment ? { ...currentPayment, status: value as PaymentStatus } : null)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Выполнен</SelectItem>
                  <SelectItem value="pending">В обработке</SelectItem>
                  <SelectItem value="failed">Ошибка</SelectItem>
                  <SelectItem value="refunded">Возвращен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transactionId" className="text-right">
                ID транзакции
              </Label>
              <Input
                id="transactionId"
                value={currentPayment?.transactionId || ""}
                onChange={(e) =>
                  setCurrentPayment(currentPayment ? { ...currentPayment, transactionId: e.target.value } : null)
                }
                className="col-span-3"
              />
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
              Вы уверены, что хотите удалить платеж для заказа {currentPayment?.orderNumber}? Это действие нельзя
              отменить.
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
