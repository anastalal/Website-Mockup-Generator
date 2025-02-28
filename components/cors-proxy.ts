// Simple CORS proxy helper for fetching external images
export async function fetchWithProxy(url: string): Promise<string> {
  // First try direct access
  try {
    const response = await fetch(url, { mode: "cors" })
    if (response.ok) return url
  } catch (error) {
    console.log("Direct fetch failed, trying proxy")
  }

  // If direct access fails, try using a CORS proxy
  // Note: In production, you should use your own proxy or a service you control
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`
  try {
    const response = await fetch(proxyUrl, { mode: "cors" })
    if (response.ok) return proxyUrl
  } catch (error) {
    console.error("Proxy fetch failed:", error)
  }
  return proxyUrl
}

