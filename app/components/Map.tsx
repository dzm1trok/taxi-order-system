"use client"

import { useEffect, useRef } from "react"

interface MapProps {
  className?: string
  from: string
  to: string
}

declare global {
  interface Window {
    ymaps: any
  }
}

export default function Map({ className, from, to }: MapProps) {
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

  // Геокодирование и отображение меток при изменении адресов
  useEffect(() => {
    if (!window.ymaps || !mapInstance.current) return
    const map = mapInstance.current
    map.geoObjects.removeAll()

    // Геокодируем и ставим метки
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
  }, [from, to])

  return <div ref={mapRef} className={className} />
} 