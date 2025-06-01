import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, MapPin, Shield, Star, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Car className="h-6 w-6" />
            <span>ТаксиСервис</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Возможности
            </Link>
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Наши преимущества
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button>Войти</Button>
            </Link>
            
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Быстрый и удобный заказ такси
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Наше приложение позволяет быстро заказать такси, отслеживать поездку и оплачивать услуги онлайн.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register?role=client">
                    <Button size="lg">Зарегистрироваться как клиент</Button>
                  </Link>
                  <Link href="/register?role=driver">
                    <Button size="lg" variant="outline">
                      Стать водителем
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Наши преимущества</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Почему клиенты и водители выбирают нашу платформу
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <MapPin className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Удобная навигация</h3>
                <p className="text-center text-muted-foreground">
                  Точное определение местоположения и оптимальные маршруты
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Shield className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Безопасность</h3>
                <p className="text-center text-muted-foreground">Проверенные водители и защищенные платежи</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Star className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Рейтинговая система</h3>
                <p className="text-center text-muted-foreground">Отзывы и оценки для повышения качества обслуживания</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Clock className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Быстрый отклик</h3>
                <p className="text-center text-muted-foreground">
                  Минимальное время ожидания и быстрое подтверждение заказа
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm md:col-span-2 lg:col-span-1">
                <Car className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Разные классы автомобилей</h3>
                <p className="text-center text-muted-foreground">
                  Выбор автомобиля в зависимости от ваших потребностей
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            <span className="text-lg font-bold">ТаксиСервис</span>
          </div>
          
          <div className="flex-1 text-center md:text-right text-sm">© 2025 ТаксиСервис.</div>
        </div>
      </footer>
    </div>
  )
}
