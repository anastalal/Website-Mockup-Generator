"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface DeviceMockupProps {
  type: "desktop" | "mobile"
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
      case "desktop":
        return {
          container: "relative w-[720px] h-[400px] bg-black rounded-lg overflow-hidden",
          screen: "absolute top-[10px] left-[10px] right-[10px] bottom-[40px] bg-white overflow-hidden",
          stand: "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] h-[40px] bg-gray-800",
        }
      case "mobile":
        return {
          container: "relative w-[187px] h-[406px] bg-black rounded-xl overflow-hidden",
          screen: "absolute top-[10px] left-[5px] right-[5px] bottom-[10px] bg-white overflow-hidden rounded-lg",
          notch:
            "absolute top-[10px] left-[50%] transform -translate-x-1/2 w-[40px] h-[10px] bg-black rounded-b-xl z-10",
        }
      default:
        return {
          container: "relative w-[720px] h-[400px] bg-black rounded-lg overflow-hidden",
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
        {styles.stand && <div className={styles.stand}></div>}
      </div>
    </div>
  )
}

