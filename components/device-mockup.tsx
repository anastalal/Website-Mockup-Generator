"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface DeviceMockupProps {
  type: "macbook" | "imac" | "ipad" | "iphone" | "android" | "desktop" | "watch"
  url: string
  layout: string
  className?: string
}

export default function DeviceMockup({ type, url, layout, className }: DeviceMockupProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageUrl, setImageUrl] = useState(url || "/placeholder.svg")

  // Reset states when URL changes
  useEffect(() => {
    setLoading(true)
    setError(false)
    setImageUrl(url || "/placeholder.svg")
  }, [url])

  const handleImageLoad = () => {
    setLoading(false)
  }

  const handleImageError = () => {
    setLoading(false)
    setError(true)
    setImageUrl("/placeholder.svg")
  }

  const getDeviceStyles = () => {
    switch (type) {
      case "macbook":
        return {
          container: "relative w-[400px] h-[240px] bg-black rounded-lg overflow-hidden",
          screen: "absolute top-[10px] left-[10px] right-[10px] bottom-[30px] bg-white overflow-hidden",
          bezel: "absolute bottom-0 left-0 right-0 h-[20px] bg-gray-800 flex items-center justify-center",
          notch: "w-[60px] h-[5px] bg-gray-700 rounded-full",
          base: "absolute -bottom-[10px] left-[50px] right-[50px] h-[10px] bg-gray-800 rounded-b-lg",
        }
      case "imac":
        return {
          container: "relative w-[480px] h-[300px] bg-black rounded-lg overflow-hidden",
          screen: "absolute top-[10px] left-[10px] right-[10px] bottom-[60px] bg-white overflow-hidden",
          stand: "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80px] h-[60px] bg-gray-800",
          base: "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[140px] h-[10px] bg-gray-700 rounded-lg",
        }
      case "ipad":
        return {
          container: "relative w-[240px] h-[320px] bg-black rounded-lg overflow-hidden",
          screen: "absolute top-[10px] left-[10px] right-[10px] bottom-[10px] bg-white overflow-hidden",
          bezel: "absolute top-[50%] right-[0px] w-[3px] h-[30px] bg-gray-700 rounded-l-full",
        }
      case "iphone":
        return {
          container: "relative w-[120px] h-[240px] bg-black rounded-xl overflow-hidden",
          screen: "absolute top-[10px] left-[5px] right-[5px] bottom-[10px] bg-white overflow-hidden rounded-lg",
          notch:
            "absolute top-[10px] left-[50%] transform -translate-x-1/2 w-[40px] h-[10px] bg-black rounded-b-xl z-10",
        }
      case "android":
        return {
          container: "relative w-[120px] h-[240px] bg-black rounded-lg overflow-hidden",
          screen: "absolute top-[10px] left-[5px] right-[5px] bottom-[10px] bg-white overflow-hidden rounded-lg",
          camera: "absolute top-[15px] left-[50%] transform -translate-x-1/2 w-[6px] h-[6px] bg-gray-700 rounded-full",
        }
      case "desktop":
        return {
          container: "relative w-[480px] h-[300px] bg-black rounded-lg overflow-hidden",
          screen: "absolute top-[10px] left-[10px] right-[10px] bottom-[40px] bg-white overflow-hidden",
          stand: "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] h-[40px] bg-gray-800",
        }
      case "watch":
        return {
          container: "relative w-[80px] h-[100px] bg-black rounded-2xl overflow-hidden",
          screen: "absolute top-[10px] left-[10px] right-[10px] bottom-[10px] bg-white overflow-hidden rounded-xl",
          band: "absolute -top-[10px] left-1/2 transform -translate-x-1/2 w-[20px] h-[20px] bg-gray-800",
          bandBottom: "absolute -bottom-[10px] left-1/2 transform -translate-x-1/2 w-[20px] h-[20px] bg-gray-800",
        }
      default:
        return {
          container: "relative w-[400px] h-[240px] bg-black rounded-lg overflow-hidden",
          screen: "absolute top-[10px] left-[10px] right-[10px] bottom-[10px] bg-white overflow-hidden",
        }
    }
  }

  const styles = getDeviceStyles()

  return (
    <div className={cn("transition-all duration-300", className)}>
      <div className={styles.container}>
        <div className={styles.screen}>
          {styles.notch && <div className={styles.notch}></div>}
          {styles.camera && <div className={styles.camera}></div>}
          {loading && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="animate-pulse w-6 h-6 rounded-full bg-gray-300"></div>
            </div>
          )}
          {error && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-xs text-gray-500">Error loading content</p>
            </div>
          )}
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Website screenshot"
            fill
            className={`object-cover ${loading ? "opacity-0" : "opacity-100"}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            unoptimized
          />
        </div>
        {styles.bezel && <div className={styles.bezel}></div>}
        {styles.stand && <div className={styles.stand}></div>}
        {styles.base && <div className={styles.base}></div>}
        {styles.band && <div className={styles.band}></div>}
        {styles.bandBottom && <div className={styles.bandBottom}></div>}
      </div>
    </div>
  )
}

