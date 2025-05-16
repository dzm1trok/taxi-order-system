"use client"

import { useEffect, useRef } from "react"

interface MapProps {
  className?: string
}

declare global {
  interface Window {
    ymaps: any
  }
}

export default function Map({ className }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function createMap() {
      if (window.ymaps) {
        window.ymaps.ready(() => {
          if (mapRef.current) {
            mapRef.current.innerHTML = ""
            new window.ymaps.Map(mapRef.current, {
              center: [52.0976, 23.7341],
              zoom: 12,
              controls: ["zoomControl", "fullscreenControl"]
            })
          }
        })
      }
    }

    // Проверяем, был ли уже добавлен скрипт
    if (!document.getElementById("yandex-maps-script")) {
      const script = document.createElement("script")
      script.id = "yandex-maps-script"
      script.src = "https://api-maps.yandex.ru/2.1/?apikey=8fcc2a1d-46cf-42ca-bc15-9bf008c6d0e2&lang=ru_RU"
      script.async = true
      document.body.appendChild(script)
      script.onload = () => {
        // Ждём появления window.ymaps
        const waitForYmaps = setInterval(() => {
          if (window.ymaps) {
            clearInterval(waitForYmaps)
            createMap()
          }
        }, 50)
      }
    } else {
      // Скрипт уже есть, но ymaps может быть ещё не загружен
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

  return <div ref={mapRef} className={className} />
} 