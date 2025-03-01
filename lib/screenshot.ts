const SCREENSHOT_API = "https://2wg20nrbv4.execute-api.eu-west-1.amazonaws.com/default/screenshot"

export async function captureWebsiteScreenshot(url: string, isMobile = false) {
  try {
    const response = await fetch(`${SCREENSHOT_API}?url=${encodeURIComponent(url)}${isMobile ? "&mobile=1" : ""}`)
    if (!response.ok) {
      throw new Error("Screenshot capture failed")
    }
    const data = await response.json()
    return `data:image/png;base64,${data.imageBase64}`
  } catch (error) {
    console.error("Screenshot capture error:", error)
    throw error
  }
}

