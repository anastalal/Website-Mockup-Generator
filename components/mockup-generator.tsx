"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Download, Upload, Globe, Laptop, Smartphone, Tablet, Monitor, Watch, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DeviceMockup from "@/components/device-mockup"
import { Tabs as TabsComponent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import html2canvas from "html2canvas"
import { fetchWithProxy } from "@/components/cors-proxy"

// Predefined gradients
const PRESET_GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(to right, #f56565, #ed64a6)" },
  { name: "Ocean", value: "linear-gradient(to right, #4299e1, #667eea)" },
  { name: "Forest", value: "linear-gradient(to right, #48bb78, #38b2ac)" },
  { name: "Lavender", value: "linear-gradient(to right, #9f7aea, #667eea)" },
  { name: "Peach", value: "linear-gradient(to right, #ed8936, #f56565)" },
  { name: "Mint", value: "linear-gradient(to right, #38b2ac, #4fd1c5)" },
  { name: "Berry", value: "linear-gradient(to right, #9f7aea, #ed64a6)" },
  { name: "Sky", value: "linear-gradient(to right, #4299e1, #4fd1c5)" },
  { name: "Slate", value: "linear-gradient(to right, #718096, #4a5568)" },
  { name: "Amber", value: "linear-gradient(to right, #f6ad55, #ed8936)" },
  { name: "Coral", value: "linear-gradient(to right, #fc8181, #f56565)" },
  { name: "Indigo", value: "linear-gradient(to right, #667eea, #5a67d8)" },
  { name: "Emerald", value: "linear-gradient(to right, #48bb78, #38a169)" },
  { name: "Rose", value: "linear-gradient(to right, #fc8181, #f687b3)" },
  { name: "Teal", value: "linear-gradient(to right, #4fd1c5, #38b2ac)" },
  { name: "Gray", value: "linear-gradient(to right, #a0aec0, #718096)" },
]

// Predefined layouts
const LAYOUTS = [
  { id: "horizontal", name: "Horizontal", icon: "→" },
  { id: "stacked", name: "Stacked", icon: "↓" },
  { id: "angled", name: "Angled", icon: "⟋" },
  { id: "perspective", name: "Perspective", icon: "⟑" },
  { id: "floating", name: "Floating", icon: "☁" },
  { id: "grid", name: "Grid", icon: "▦" },
  { id: "showcase", name: "Showcase", icon: "★" },
  { id: "orbit", name: "Orbit", icon: "◎" },
  { id: "wave", name: "Wave", icon: "∿" },
  { id: "spiral", name: "Spiral", icon: "↯" },
  { id: "cascade", name: "Cascade", icon: "⇲" },
  { id: "scattered", name: "Scattered", icon: "⁘" },
]

// Predefined presets
const PRESETS = [
  {
    id: "modern-portfolio",
    name: "Modern Portfolio",
    devices: { macbook: true, iphone: true, ipad: false, imac: false, android: false, desktop: false, watch: false },
    layout: "angled",
    background: "linear-gradient(to right, #4299e1, #667eea)",
    scale: 90,
    spacing: 20,
  },
  {
    id: "product-showcase",
    name: "Product Showcase",
    devices: { macbook: true, iphone: true, ipad: true, imac: false, android: false, desktop: false, watch: false },
    layout: "showcase",
    background: "#f7fafc",
    scale: 100,
    spacing: 40,
  },
  {
    id: "app-presentation",
    name: "App Presentation",
    devices: { macbook: false, iphone: true, ipad: false, imac: false, android: true, desktop: false, watch: false },
    layout: "floating",
    background: "linear-gradient(to right, #9f7aea, #ed64a6)",
    scale: 110,
    spacing: 30,
  },
  {
    id: "tech-ecosystem",
    name: "Tech Ecosystem",
    devices: { macbook: true, iphone: true, ipad: true, imac: true, android: false, desktop: false, watch: true },
    layout: "grid",
    background: "#1a202c",
    scale: 80,
    spacing: 20,
  },
  {
    id: "minimal",
    name: "Minimal",
    devices: { macbook: true, iphone: false, ipad: false, imac: false, android: false, desktop: false, watch: false },
    layout: "horizontal",
    background: "#ffffff",
    scale: 100,
    spacing: 0,
  },
]

export default function MockupGenerator() {
  const [inputType, setInputType] = useState<"url" | "image">("url")
  const [url, setUrl] = useState("https://example.com")
  const [imageUrl, setImageUrl] = useState("")
  const [layout, setLayout] = useState<string>("angled")
  const [devices, setDevices] = useState({
    macbook: true,
    ipad: true,
    iphone: true,
    imac: false,
    android: false,
    desktop: false,
    watch: false,
  })
  const [background, setBackground] = useState("#f3f4f6")
  const [backgroundType, setBackgroundType] = useState<"solid" | "gradient">("solid")
  const [gradientDirection, setGradientDirection] = useState("to right")
  const [gradientStart, setGradientStart] = useState("#4299e1")
  const [gradientEnd, setGradientEnd] = useState("#667eea")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [scale, setScale] = useState(100)
  const [spacing, setSpacing] = useState(30)
  const [activeTab, setActiveTab] = useState("customize")
  const mockupRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [processedUrl, setProcessedUrl] = useState("/placeholder.svg")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeviceChange = (device: keyof typeof devices) => {
    setDevices({
      ...devices,
      [device]: !devices[device],
    })
  }

  const downloadMockup = async () => {
    if (!mockupRef.current) return

    try {
      // Show loading state
      setIsDownloading(true)

      // Use html2canvas to capture the mockup
      const canvas = await html2canvas(mockupRef.current, {
        scale: 2, // Higher quality
        useCORS: true, // Allow cross-origin images
        allowTaint: true,
        backgroundColor: null,
      })

      // Convert to data URL and create download link
      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = "website-mockup.png"
      link.click()
    } catch (error) {
      console.error("Error generating mockup:", error)
      alert("There was an error generating your mockup. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const getDisplayUrl = async () => {
    if (inputType === "url") {
      if (url.startsWith("http")) {
        try {
          // Try to use a CORS proxy if needed
          return await fetchWithProxy(url)
        } catch (error) {
          console.error("Error fetching URL:", error)
          return url // Fall back to direct URL
        }
      }
      return url
    }
    return imageUrl || "/placeholder.svg?height=800&width=1200"
  }

  const getBackgroundStyle = () => {
    if (backgroundType === "solid") {
      return background
    } else {
      return `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`
    }
  }

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setDevices(preset.devices)
    setLayout(preset.layout)
    if (preset.background.includes("gradient")) {
      setBackgroundType("gradient")
      const match = preset.background.match(/linear-gradient$$(.*?), (.*?), (.*?)$$/)
      if (match) {
        setGradientDirection(match[1])
        setGradientStart(match[2])
        setGradientEnd(match[3])
      }
    } else {
      setBackgroundType("solid")
      setBackground(preset.background)
    }
    setScale(preset.scale)
    setSpacing(preset.spacing)
  }

  const applyGradientPreset = (gradient: string) => {
    setBackgroundType("gradient")
    const match = gradient.match(/linear-gradient$$(.*?), (.*?), (.*?)$$/)
    if (match) {
      setGradientDirection(match[1])
      setGradientStart(match[2])
      setGradientEnd(match[3])
    }
  }

  const getDevicePositionStyle = (deviceType: string, index: number) => {
    const activeDevices = Object.entries(devices).filter(([_, isActive]) => isActive).length
    const angle = (360 / activeDevices) * index
    const radius = 200

    switch (layout) {
      case "horizontal":
        return {
          display: "inline-block",
          marginRight: index < activeDevices - 1 ? spacing : 0,
        }
      case "stacked":
        return {
          display: "block",
          marginBottom: index < activeDevices - 1 ? spacing : 0,
        }
      case "angled":
        return {
          position: "relative",
          transform: `rotate(${index * 5}deg)`,
          margin: `${index * 10}px`,
          zIndex: 10 + index,
        }
      case "perspective":
        return {
          position: "relative",
          transform: `perspective(1000px) rotateY(${-20 + index * 10}deg)`,
          margin: `0 ${-50 + index * 30}px`,
          zIndex: 10 + index,
        }
      case "floating":
        return {
          position: "relative",
          transform: `translateY(${index % 2 === 0 ? -20 : 20}px)`,
          margin: `0 ${spacing}px`,
          zIndex: 10 + index,
        }
      case "grid":
        return {
          display: "inline-block",
          margin: spacing / 2,
        }
      case "showcase":
        if (index === 0) {
          return {
            position: "relative",
            zIndex: 10,
            transform: "scale(1.2)",
            margin: "20px 0",
          }
        } else {
          return {
            position: "relative",
            transform: `translateX(${index % 2 === 0 ? -100 : 100}px) scale(0.8)`,
            zIndex: 5,
            margin: "0 -20px",
          }
        }
      case "orbit":
        return {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
          zIndex: 10 + index,
        }
      case "wave":
        return {
          position: "relative",
          transform: `translateY(${Math.sin(index * 0.5) * 50}px)`,
          margin: `0 ${spacing}px`,
          zIndex: 10 + index,
        }
      case "spiral":
        const spiralRadius = 50 + index * 30
        const spiralAngle = index * 30
        return {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `rotate(${spiralAngle}deg) translate(${spiralRadius}px) rotate(-${spiralAngle}deg)`,
          zIndex: 10 + index,
        }
      case "cascade":
        return {
          position: "relative",
          transform: `translate(${index * 40}px, ${index * 40}px) rotate(-${index * 5}deg)`,
          zIndex: activeDevices - index,
        }
      case "scattered":
        const randomX = Math.sin(index * 45) * 100
        const randomY = Math.cos(index * 45) * 100
        const randomRotate = ((index * 17) % 20) - 10
        return {
          position: "relative",
          transform: `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`,
          zIndex: 10 + index,
        }
      default:
        return {}
    }
  }

  useEffect(() => {
    const processUrl = async () => {
      if (inputType === "url" && url) {
        try {
          // Add protocol if missing
          let urlToProcess = url
          if (!/^https?:\/\//i.test(urlToProcess)) {
            urlToProcess = "https://" + urlToProcess
            setUrl(urlToProcess)
          }

          // Set the processed URL
          setProcessedUrl(urlToProcess)
        } catch (error) {
          console.error("Error processing URL:", error)
          setProcessedUrl("/placeholder.svg")
        }
      } else if (inputType === "image" && imageUrl) {
        setProcessedUrl(imageUrl)
      } else {
        setProcessedUrl("/placeholder.svg")
      }
    }

    processUrl()
  }, [url, imageUrl, inputType])

  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="col-span-full md:col-span-9">
        <div
          ref={mockupRef}
          className="relative w-full  p-10 rounded-lg transition-colors overflow-hidden"
          style={{
            background: getBackgroundStyle(),
            transform: `scale(${scale / 100})`,
            transformOrigin: "center center",
          }}
        >
          <div
            className={`
            relative w-full h-full flex items-center justify-center
            ${layout === "horizontal" ? "flex-row" : ""}
            ${layout === "stacked" ? "flex-col" : ""}
            ${layout === "grid" ? "flex-row flex-wrap" : ""}
            ${["orbit", "spiral", "scattered"].includes(layout) ? "min-h-[600px]" : ""}
          `}
          >
            {Object.entries(devices).map(([deviceType, isActive], index) => {
              if (!isActive) return null
              return (
                <div key={deviceType} style={getDevicePositionStyle(deviceType, index)}>
                  <DeviceMockup type={deviceType as any} url={processedUrl} layout={layout} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Card className=" col-span-3  sticky top-4">
        <CardContent className="pt-6">
          <TabsComponent value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>

            <TabsContent value="customize" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Content Source</h2>
                <Tabs value={inputType} onValueChange={(v) => setInputType(v as "url" | "image")}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="url">Website URL</TabsTrigger>
                    <TabsTrigger value="image">Upload Image</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">Website URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="url"
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                        <Button onClick={getDisplayUrl} variant="outline" size="icon">
                          <Globe className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="image" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Upload Screenshot</Label>
                      <div className="flex space-x-2">
                        <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
                        <Button variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Layout</h2>
                <RadioGroup value={layout} onValueChange={setLayout} className="grid grid-cols-4 gap-2">
                  {LAYOUTS.map((layoutOption) => (
                    <Label
                      key={layoutOption.id}
                      htmlFor={layoutOption.id}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value={layoutOption.id} id={layoutOption.id} className="sr-only" />
                      <div className="text-2xl">{layoutOption.icon}</div>
                      <span className="block w-full text-center text-xs mt-1">{layoutOption.name}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Devices</h2>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="macbook"
                      checked={devices.macbook}
                      onCheckedChange={() => handleDeviceChange("macbook")}
                    />
                    <Label htmlFor="macbook" className="flex items-center">
                      <Laptop className="mr-2 h-4 w-4" />
                      MacBook
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="imac" checked={devices.imac} onCheckedChange={() => handleDeviceChange("imac")} />
                    <Label htmlFor="imac" className="flex items-center">
                      <Monitor className="mr-2 h-4 w-4" />
                      iMac
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ipad" checked={devices.ipad} onCheckedChange={() => handleDeviceChange("ipad")} />
                    <Label htmlFor="ipad" className="flex items-center">
                      <Tablet className="mr-2 h-4 w-4" />
                      iPad
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="iphone"
                      checked={devices.iphone}
                      onCheckedChange={() => handleDeviceChange("iphone")}
                    />
                    <Label htmlFor="iphone" className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      iPhone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="android"
                      checked={devices.android}
                      onCheckedChange={() => handleDeviceChange("android")}
                    />
                    <Label htmlFor="android" className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Android
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="desktop"
                      checked={devices.desktop}
                      onCheckedChange={() => handleDeviceChange("desktop")}
                    />
                    <Label htmlFor="desktop" className="flex items-center">
                      <Monitor className="mr-2 h-4 w-4" />
                      Desktop
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="watch" checked={devices.watch} onCheckedChange={() => handleDeviceChange("watch")} />
                    <Label htmlFor="watch" className="flex items-center">
                      <Watch className="mr-2 h-4 w-4" />
                      Watch
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Background</h2>
                  <Select value={backgroundType} onValueChange={(v) => setBackgroundType(v as "solid" | "gradient")}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid Color</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {backgroundType === "solid" ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-12 h-12 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Label className="w-24">Direction</Label>
                      <Select value={gradientDirection} onValueChange={setGradientDirection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="to right">Horizontal →</SelectItem>
                          <SelectItem value="to left">Horizontal ←</SelectItem>
                          <SelectItem value="to bottom">Vertical ↓</SelectItem>
                          <SelectItem value="to top">Vertical ↑</SelectItem>
                          <SelectItem value="to bottom right">Diagonal ↘</SelectItem>
                          <SelectItem value="to bottom left">Diagonal ↙</SelectItem>
                          <SelectItem value="to top right">Diagonal ↗</SelectItem>
                          <SelectItem value="to top left">Diagonal ↖</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="flex-1"
                      />
                    </div>

                    <div>
                      <Label className="block mb-2">Gradient Presets</Label>
                      <ScrollArea className="h-[100px] w-full rounded-md border">
                        <div className="grid grid-cols-2 gap-2 p-2">
                          {PRESET_GRADIENTS.map((gradient, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="h-10 w-full p-0 overflow-hidden"
                              onClick={() => applyGradientPreset(gradient.value)}
                            >
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ background: gradient.value }}
                              >
                                <span className="text-xs font-medium text-white drop-shadow-md">{gradient.name}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="scale" className="text-xl font-semibold">
                    Scale
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="scale"
                      min={50}
                      max={150}
                      step={1}
                      value={[scale]}
                      onValueChange={(value) => setScale(value[0])}
                    />
                    <span className="w-12 text-center">{scale}%</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="spacing" className="text-xl font-semibold">
                    Spacing
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="spacing"
                      min={0}
                      max={100}
                      step={10}
                      value={[spacing]}
                      onValueChange={(value) => setSpacing(value[0])}
                    />
                    <span className="w-12 text-center">{spacing}px</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Ready-made Presets</h2>
                <div className="grid gap-3">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      className="w-full justify-between h-auto py-3"
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-md mr-3" style={{ background: preset.background }}></div>
                        <div className="text-left">
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {Object.entries(preset.devices)
                              .filter(([_, isActive]) => isActive)
                              .map(([device]) => device)
                              .join(", ")}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </TabsComponent>

          <div className="mt-6 pt-6 border-t">
            <Button className="w-full" onClick={downloadMockup} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Mockup
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

