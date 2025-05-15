import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Car, FileText, CreditCard, Star } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Панель администратора</h1>
        <p className="text-muted-foreground">Управление данными системы заказа такси</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">254</div>
            <p className="text-xs text-muted-foreground">Всего зарегистрировано</p>
            <div className="mt-4">
              <Link href="/dashboard/admin/users">
                <Button variant="outline" size="sm">
                  Управление
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Водители</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Активных водителей</p>
            <div className="mt-4">
              <Link href="/dashboard/admin/drivers">
                <Button variant="outline" size="sm">
                  Управление
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказы</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">Всего заказов</p>
            <div className="mt-4">
              <Link href="/dashboard/admin/orders">
                <Button variant="outline" size="sm">
                  Управление
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Платежи</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽ 324,500</div>
            <p className="text-xs text-muted-foreground">Общая сумма платежей</p>
            <div className="mt-4">
              <Link href="/dashboard/admin/payments">
                <Button variant="outline" size="sm">
                  Управление
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отзывы</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-muted-foreground">Всего отзывов</p>
            <div className="mt-4">
              <Link href="/dashboard/admin/reviews">
                <Button variant="outline" size="sm">
                  Управление
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Последние действия</CardTitle>
            <CardDescription>Недавние изменения в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="text-sm font-medium">Добавлен новый водитель</p>
                  <p className="text-xs text-muted-foreground">15 минут назад</p>
                </div>
                <Link href="/dashboard/admin/drivers">
                  <Button variant="ghost" size="sm">
                    Просмотр
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="text-sm font-medium">Изменен статус заказа #1234</p>
                  <p className="text-xs text-muted-foreground">2 часа назад</p>
                </div>
                <Link href="/dashboard/admin/orders">
                  <Button variant="ghost" size="sm">
                    Просмотр
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Новый отзыв от пользователя</p>
                  <p className="text-xs text-muted-foreground">Вчера, 18:30</p>
                </div>
                <Link href="/dashboard/admin/reviews">
                  <Button variant="ghost" size="sm">
                    Просмотр
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Системная информация</CardTitle>
            <CardDescription>Информация о системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Версия системы:</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Последнее обновление:</span>
                <span className="text-sm font-medium">10.05.2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Статус базы данных:</span>
                <span className="text-sm font-medium text-green-500">Онлайн</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Активных сессий:</span>
                <span className="text-sm font-medium">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Загрузка сервера:</span>
                <span className="text-sm font-medium">32%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
