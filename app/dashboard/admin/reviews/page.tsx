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
import { Textarea } from "@/components/ui/textarea"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Star } from "lucide-react"

// Типы данных
interface Review {
  id: string
  orderNumber: string
  clientName: string
  driverName: string
  rating: number
  comment: string
  date: string
}

// Моковые данные
const reviews: Review[] = [
  {
    id: "1",
    orderNumber: "#1234",
    clientName: "Иван Петров",
    driverName: "Алексей Иванов",
    rating: 5,
    comment: "Отличный водитель, приехал вовремя!",
    date: "12.04.2023",
  },
  {
    id: "2",
    orderNumber: "#1233",
    clientName: "Иван Петров",
    driverName: "Дмитрий Смирнов",
    rating: 4,
    comment: "Хорошая поездка, но немного задержался.",
    date: "05.04.2023",
  },
  {
    id: "3",
    orderNumber: "#1236",
    clientName: "Мария Сидорова",
    driverName: "Сергей Козлов",
    rating: 5,
    comment: "Очень вежливый водитель, помог с багажом.",
    date: "15.04.2023",
  },
  {
    id: "4",
    orderNumber: "#1232",
    clientName: "Алексей Смирнов",
    driverName: "Максим Новиков",
    rating: 3,
    comment: "Водитель был не очень вежлив, но доехали нормально.",
    date: "10.04.2023",
  },
  {
    id: "5",
    orderNumber: "#1230",
    clientName: "Екатерина Иванова",
    driverName: "Андрей Соколов",
    rating: 5,
    comment: "Прекрасная поездка, чистая машина, приятный водитель.",
    date: "01.04.2023",
  },
]

export default function ReviewsPage() {
  const [data, setData] = useState<Review[]>(reviews)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState<Review | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Обработчики действий
  const handleAdd = () => {
    setCurrentReview({
      id: "",
      orderNumber: "",
      clientName: "",
      driverName: "",
      rating: 5,
      comment: "",
      date: new Date().toLocaleDateString(),
    })
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEdit = (review: Review) => {
    setCurrentReview(review)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = (review: Review) => {
    setCurrentReview(review)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = () => {
    if (!currentReview) return

    if (isEditing) {
      // Обновление существующего отзыва
      setData(data.map((review) => (review.id === currentReview.id ? currentReview : review)))
    } else {
      // Добавление нового отзыва
      const newReview = {
        ...currentReview,
        id: Math.random().toString(36).substring(2, 9),
      }
      setData([...data, newReview])
    }

    setIsDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!currentReview) return
    setData(data.filter((review) => review.id !== currentReview.id))
    setIsDeleteDialogOpen(false)
  }

  // Определение колонок таблицы
  const columns: ColumnDef<Review>[] = [
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
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Рейтинг
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rating = Number.parseInt(row.getValue("rating"))
        return (
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "comment",
      header: "Комментарий",
      cell: ({ row }) => {
        const comment = row.getValue("comment") as string
        return (
          <div className="max-w-xs truncate" title={comment}>
            {comment}
          </div>
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
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Отзывы</h1>
        <p className="text-muted-foreground">Управление отзывами клиентов</p>
      </div>

      <DataTable columns={columns} data={data} searchColumn="clientName" onAdd={handleAdd} />

      {/* Диалог добавления/редактирования отзыва */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Редактировать отзыв" : "Добавить отзыв"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Измените данные отзыва и нажмите Сохранить."
                : "Заполните данные нового отзыва и нажмите Сохранить."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderNumber" className="text-right">
                № заказа
              </Label>
              <Input
                id="orderNumber"
                value={currentReview?.orderNumber || ""}
                onChange={(e) =>
                  setCurrentReview(currentReview ? { ...currentReview, orderNumber: e.target.value } : null)
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
                value={currentReview?.clientName || ""}
                onChange={(e) =>
                  setCurrentReview(currentReview ? { ...currentReview, clientName: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driverName" className="text-right">
                Водитель
              </Label>
              <Input
                id="driverName"
                value={currentReview?.driverName || ""}
                onChange={(e) =>
                  setCurrentReview(currentReview ? { ...currentReview, driverName: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Рейтинг
              </Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={currentReview?.rating || 5}
                onChange={(e) =>
                  setCurrentReview(currentReview ? { ...currentReview, rating: Number.parseInt(e.target.value) } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Комментарий
              </Label>
              <Textarea
                id="comment"
                value={currentReview?.comment || ""}
                onChange={(e) => setCurrentReview(currentReview ? { ...currentReview, comment: e.target.value } : null)}
                className="col-span-3"
                rows={4}
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
              Вы уверены, что хотите удалить отзыв от клиента {currentReview?.clientName}? Это действие нельзя отменить.
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
