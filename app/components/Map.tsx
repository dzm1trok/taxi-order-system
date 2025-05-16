"use client"

import { useEffect, useRef } from "react"

interface MapProps {
  className?: string
  from: string
  to: string
  onRouteChange?: (distance: number, duration: number) => void // distance в метрах, duration в минутах
}

declare global {
  interface Window {
    ymaps: any
  }
}

export default function Map({ className, from, to, onRouteChange }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  // Инициализация карты только один раз
  useEffect(() => {
    function createMap() {
      if (window.ymaps) {
        window.ymaps.ready(() => {
          if (mapRef.current) {
            mapRef.current.innerHTML = ""
            mapInstance.current = new window.ymaps.Map(mapRef.current, {
              center: [52.0976, 23.7341], // Брест, Беларусь
              zoom: 12,
              controls: ["zoomControl", "fullscreenControl"]
            })
          }
        })
      }
    }

    if (!document.getElementById("yandex-maps-script")) {
      const script = document.createElement("script")
      script.id = "yandex-maps-script"
      script.src = "https://api-maps.yandex.ru/2.1/?apikey=8fcc2a1d-46cf-42ca-bc15-9bf008c6d0e2&lang=ru_RU"
      script.async = true
      document.body.appendChild(script)
      script.onload = () => {
        const waitForYmaps = setInterval(() => {
          if (window.ymaps) {
            clearInterval(waitForYmaps)
            createMap()
          }
        }, 50)
      }
    } else {
      const waitForYmaps = setInterval(() => {
        if (window.ymaps) {
          clearInterval(waitForYmaps)
          createMap()
        }
      }, 50)
    }

    return () => {
      if (mapRef.current) mapRef.current.innerHTML = ""
    }
  }, [])

  // Геокодирование и отображение меток/маршрута при изменении адресов
  useEffect(() => {
    if (!window.ymaps || !mapInstance.current) return
    const map = mapInstance.current
    map.geoObjects.removeAll()

    if (from && to) {
      // Строим маршрут
      window.ymaps.route(
        [from + ', Беларусь', to + ', Беларусь'],
        { routingMode: "auto" }
      ).then((route: any) => {
        const distance = route.getLength() // в метрах
        let duration = route.getTime() / 60 / 1000 // в минутах
        if (!duration || duration === 0) {
          const paths = route.getPaths()
          let totalDuration = 0
          for (let i = 0; i < paths.getLength(); i++) {
            const segDuration = paths.get(i).getProperties().duration?.value || 0
            totalDuration += segDuration
          }
          duration = totalDuration / 60 // из секунд в минуты
        }
        if (onRouteChange) onRouteChange(distance, duration)
        map.geoObjects.add(route)
      })
      return
    }

    // Если только метки
    if (from) {
      window.ymaps.geocode(from + ', Беларусь').then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0)
        if (firstGeoObject) {
          map.geoObjects.add(new window.ymaps.Placemark(firstGeoObject.geometry.getCoordinates(), { balloonContent: from }, { preset: 'islands#redIcon' }))
          map.setCenter(firstGeoObject.geometry.getCoordinates())
        }
      })
    }
    if (to) {
      window.ymaps.geocode(to + ', Беларусь').then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0)
        if (firstGeoObject) {
          map.geoObjects.add(new window.ymaps.Placemark(firstGeoObject.geometry.getCoordinates(), { balloonContent: to }, { preset: 'islands#blueIcon' }))
        }
      })
    }
    if (onRouteChange) onRouteChange(0, 0)
  }, [from, to])

  return <div ref={mapRef} className={className} />
} 