import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Car, Clock, MapPin, Star } from "lucide-react"

export default function OrdersPage() {
  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Мои заказы</h1>
          <p className="text-muted-foreground">Управляйте своими заказами такси</p>
        </div>
        <Link href="/dashboard/client/new-order">
          <Button>
            <Car className="mr-2 h-4 w-4" /> Новый заказ
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Все заказы</TabsTrigger>
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
          <TabsTrigger value="cancelled">Отмененные</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1234</CardTitle>
                  <CardDescription>15 минут назад</CardDescription>
                </div>
                <Badge>Завершен</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">ул. Ленина, 10 → ТЦ "Мега"</p>
                    <p className="text-xs text-muted-foreground">12.04.2023, 14:30</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">250 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>Toyota Camry, Белый, А123БВ777</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Время в пути: 25 минут</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1233</CardTitle>
                  <CardDescription>05.04.2023</CardDescription>
                </div>
                <Badge>Завершен</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Бизнес-центр "Высота" → ул. Ленина, 10</p>
                    <p className="text-xs text-muted-foreground">05.04.2023, 18:15</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">320 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <Star className="h-3 w-3 text-gray-300" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>Kia Rio, Черный, В456АВ777</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Время в пути: 35 минут</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">У вас нет активных заказов</p>
            <div className="mt-4">
              <Link href="/dashboard/client/new-order">
                <Button>Заказать такси</Button>
              </Link>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1234</CardTitle>
                  <CardDescription>15 минут назад</CardDescription>
                </div>
                <Badge>Завершен</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">ул. Ленина, 10 → ТЦ "Мега"</p>
                    <p className="text-xs text-muted-foreground">12.04.2023, 14:30</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">250 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>Toyota Camry, Белый, А123БВ777</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Время в пути: 25 минут</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #1233</CardTitle>
                  <CardDescription>05.04.2023</CardDescription>
                </div>
                <Badge>Завершен</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Бизнес-центр "Высота" → ул. Ленина, 10</p>
                    <p className="text-xs text-muted-foreground">05.04.2023, 18:15</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">320 ₽</p>
                    <div className="flex items-center justify-end mt-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <Star className="h-3 w-3 text-gray-300" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>Kia Rio, Черный, В456АВ777</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Время в пути: 35 минут</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">У вас нет отмененных заказов</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
