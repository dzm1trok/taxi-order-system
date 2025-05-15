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
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Star } from "lucide-react"

// Типы данных
interface Driver {
  id: string
  userId: string
  name: string
  carModel: string
  carNumber: string
  carYear: string
  carColor: string
  licenseNumber: string
  rating: number
  status: "active" | "inactive"
}

// Моковые данные
const drivers: Driver[] = [
  {
    id: "1",
    userId: "2",
    name: "Алексей Иванов",
    carModel: "Toyota Camry",
    carNumber: "А123БВ777",
    carYear: "2020",
    carColor: "Белый",
    licenseNumber: "1234 567890",
    rating: 4.8,
    status: "active",
  },
  {
    id: "2",
    userId: "5",
    name: "Дмитрий Смирнов",
    carModel: "Kia Rio",
    carNumber: "В456АВ777",
    carYear: "2019",
    carColor: "Черный",
    licenseNumber: "9876 543210",
    rating: 4.5,
    status: "active",
  },
  {
    id: "3",
    userId: "7",
    name: "Сергей Козлов",
    carModel: "Hyundai Solaris",
    carNumber: "Е789ОП777",
    carYear: "2021",
    carColor: "Серый",
    licenseNumber: "5678 901234",
    rating: 4.9,
    status: "active",
  },
  {
    id: "4",
    userId: "9",
    name: "Андрей Соколов",
    carModel: "Volkswagen Polo",
    carNumber: "К321ТУ777",
    carYear: "2018",
    carColor: "Синий",
    licenseNumber: "4321 098765",
    rating: 4.2,
    status: "inactive",
  },
  {
    id: "5",
    userId: "11",
    name: "Максим Новиков",
    carModel: "Skoda Rapid",
    carNumber: "М654НО777",
    carYear: "2022",
    carColor: "Красный",
    licenseNumber: "6789 012345",
    rating: 4.7,
    status: "active",
  },
]

export default function DriversPage() {
  const [data, setData] = useState<Driver[]>(drivers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Обработчики действий
  const handleAdd = () => {
    setCurrentDriver({
      id: "",
      userId: "",
      name: "",
      carModel: "",
      carNumber: "",
      carYear: "",
      carColor: "",
      licenseNumber: "",
      rating: 5.0,
      status: "active",
    })
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEdit = (driver: Driver) => {
    setCurrentDriver(driver)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = (driver: Driver) => {
    setCurrentDriver(driver)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = () => {
    if (!currentDriver) return

    if (isEditing) {
      // Обновление существующего водителя
      setData(data.map((driver) => (driver.id === currentDriver.id ? currentDriver : driver)))
    } else {
      // Добавление нового водителя
      const newDriver = {
        ...currentDriver,
        id: Math.random().toString(36).substring(2, 9),
        userId: Math.random().toString(36).substring(2, 9),
      }
      setData([...data, newDriver])
    }

    setIsDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!currentDriver) return
    setData(data.filter((driver) => driver.id !== currentDriver.id))
    setIsDeleteDialogOpen(false)
  }

  // Определение колонок таблицы
  const columns: ColumnDef<Driver>[] = [
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
      accessorKey: "carModel",
      header: "Модель автомобиля",
    },
    {
      accessorKey: "carNumber",
      header: "Номер",
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
        const rating = Number.parseFloat(row.getValue("rating"))
        return (
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className={`font-medium ${status === "active" ? "text-green-500" : "text-red-500"}`}>
            {status === "active" ? "Активен" : "Неактивен"}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Водители</h1>
        <p className="text-muted-foreground">Управление водителями системы</p>
      </div>

      <DataTable columns={columns} data={data} searchColumn="name" onAdd={handleAdd} />

      {/* Диалог добавления/редактирования водителя */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Редактировать водителя" : "Добавить водителя"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Измените данные водителя и нажмите Сохранить."
                : "Заполните данные нового водителя и нажмите Сохранить."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Имя
              </Label>
              <Input
                id="name"
                value={currentDriver?.name || ""}
                onChange={(e) => setCurrentDriver(currentDriver ? { ...currentDriver, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carModel" className="text-right">
                Модель авто
              </Label>
              <Input
                id="carModel"
                value={currentDriver?.carModel || ""}
                onChange={(e) =>
                  setCurrentDriver(currentDriver ? { ...currentDriver, carModel: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carNumber" className="text-right">
                Номер авто
              </Label>
              <Input
                id="carNumber"
                value={currentDriver?.carNumber || ""}
                onChange={(e) =>
                  setCurrentDriver(currentDriver ? { ...currentDriver, carNumber: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carYear" className="text-right">
                Год выпуска
              </Label>
              <Input
                id="carYear"
                value={currentDriver?.carYear || ""}
                onChange={(e) => setCurrentDriver(currentDriver ? { ...currentDriver, carYear: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carColor" className="text-right">
                Цвет
              </Label>
              <Input
                id="carColor"
                value={currentDriver?.carColor || ""}
                onChange={(e) =>
                  setCurrentDriver(currentDriver ? { ...currentDriver, carColor: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="licenseNumber" className="text-right">
                Номер ВУ
              </Label>
              <Input
                id="licenseNumber"
                value={currentDriver?.licenseNumber || ""}
                onChange={(e) =>
                  setCurrentDriver(currentDriver ? { ...currentDriver, licenseNumber: e.target.value } : null)
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
              Вы уверены, что хотите удалить водителя {currentDriver?.name}? Это действие нельзя отменить.
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
