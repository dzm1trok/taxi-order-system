"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Car, Clock, CreditCard, Banknote, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useState } from "react"

export default function DriverStatsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Статистика</h1>
          <p className="text-muted-foreground">Анализ вашей работы и заработка</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ru }) : "Выберите дату"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ru} />
          </PopoverContent>
        </Popover>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">День</TabsTrigger>
          <TabsTrigger value="weekly">Неделя</TabsTrigger>
          <TabsTrigger value="monthly">Месяц</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Заработок</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250 BYN</div>
                <p className="text-xs text-muted-foreground">+12% по сравнению со вчера</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Заказов выполнено</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">-1 по сравнению со вчера</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Время в сети</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6ч 30м</div>
                <p className="text-xs text-muted-foreground">+30м по сравнению со вчера</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">250 BYN</div>
                <p className="text-xs text-muted-foreground">+15% по сравнению со вчера</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Заказы по времени</CardTitle>
                <CardDescription>Распределение заказов в течение дня</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">График распределения заказов</p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Способы оплаты</CardTitle>
                <CardDescription>Распределение способов оплаты</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>Банковская карта</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">3</div>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-3/5"></div>
                      </div>
                      <div className="text-muted-foreground text-sm">60%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                      <span>Наличные</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">2</div>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-2/5"></div>
                      </div>
                      <div className="text-muted-foreground text-sm">40%</div>
                    </div>
                  </div>
                </div>

                <div className="h-48 w-full bg-muted rounded-md flex items-center justify-center mt-4">
                  <p className="text-muted-foreground">Круговая диаграмма</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Детали заказов</CardTitle>
              <CardDescription>Информация о выполненных заказах</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 font-medium border-b">
                  <div>№ заказа</div>
                  <div>Время</div>
                  <div>Маршрут</div>
                  <div>Оплата</div>
                  <div className="text-right">Сумма</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-muted-foreground">#1233</div>
                    <div>12:30</div>
                    <div className="truncate">ул. Гагарина, 42 → ТЦ "Мега"</div>
                    <div className="flex items-center">
                      <Banknote className="h-3 w-3 mr-1" />
                      Наличные
                    </div>
                    <div className="text-right font-medium">290 BYN</div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-muted-foreground">#1232</div>
                    <div>10:15</div>
                    <div className="truncate">Бизнес-центр "Высота" → ул. Ленина, 10</div>
                    <div className="flex items-center">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Карта
                    </div>
                    <div className="text-right font-medium">320 BYN</div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-muted-foreground">#1231</div>
                    <div>09:20</div>
                    <div className="truncate">ул. Ленина, 10 → Вокзал</div>
                    <div className="flex items-center">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Карта
                    </div>
                    <div className="text-right font-medium">270 BYN</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Статистика за неделю находится в разработке</p>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Статистика за месяц находится в разработке</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
