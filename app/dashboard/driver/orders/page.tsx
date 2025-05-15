import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, CreditCard, MapPin, Banknote } from "lucide-react"

export default function DriverOrdersPage() {
  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Заказы</h1>
        <p className="text-muted-foreground">Управляйте своими заказами</p>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Доступные</TabsTrigger>
          <TabsTrigger value="current">Текущие</TabsTrigger>
          <TabsTrigger value="completed">Выполненные</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1235</CardTitle>
                  <CardDescription>Только что</CardDescription>
                </div>
                <Badge variant="outline">3.5 км</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">ул. Пушкина, 15 → ТЦ "Европа"</p>
                    <p className="text-xs text-muted-foreground">Эконом</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">280 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs ml-1">Карта</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Примерное время поездки: 15 минут</span>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Отклонить
                  </Button>
                  <Button size="sm">Принять</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1236</CardTitle>
                  <CardDescription>2 минуты назад</CardDescription>
                </div>
                <Badge variant="outline">5.2 км</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Вокзал → ул. Гагарина, 42</p>
                    <p className="text-xs text-muted-foreground">Эконом</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">350 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      <Banknote className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs ml-1">Наличные</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Примерное время поездки: 20 минут</span>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Отклонить
                  </Button>
                  <Button size="sm">Принять</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1234</CardTitle>
                  <CardDescription>Начат 15 минут назад</CardDescription>
                </div>
                <Badge>В процессе</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">ул. Ленина, 10 → Бизнес-центр "Высота"</p>
                      <p className="text-xs text-muted-foreground">Эконом</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">320 ₽</p>
                      <div className="flex items-center justify-end mt-1">
                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs ml-1">Карта</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>Клиент: Иван Петров</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Начало: 14:30, Ожидаемое прибытие: 14:55</span>
                  </div>
                </div>

                <div className="h-48 w-full bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Карта маршрута</p>
                </div>

                <div className="flex justify-between gap-2">
                  <Button variant="outline">Отменить</Button>
                  <Button>Завершить</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1233</CardTitle>
                  <CardDescription>12.04.2023</CardDescription>
                </div>
                <Badge variant="outline">Выполнен</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">ул. Гагарина, 42 → ТЦ "Мега"</p>
                    <p className="text-xs text-muted-foreground">12.04.2023, 12:30</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">290 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      <Banknote className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs ml-1">Наличные</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Время в пути: 22 минуты</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1232</CardTitle>
                  <CardDescription>12.04.2023</CardDescription>
                </div>
                <Badge variant="outline">Выполнен</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Бизнес-центр "Высота" → ул. Ленина, 10</p>
                    <p className="text-xs text-muted-foreground">12.04.2023, 10:15</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">320 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs ml-1">Карта</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Время в пути: 25 минут</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
