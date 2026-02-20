import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  
  if (!url) {
    return NextResponse.json({ valid: false, error: "No URL provided" })
  }
  
  // Validate URL format
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json({ valid: false, error: "URL must start with http:// or https://" })
    }
  } catch {
    return NextResponse.json({ valid: false, error: "Invalid URL format" })
  }
  
  // Check if URL is reachable
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "LunaX-Scanner/1.0",
      },
    })
    
    clearTimeout(timeoutId)
    
    // Accept any response (even 4xx/5xx means the server exists)
    if (response.ok || response.status < 500) {
      return NextResponse.json({ valid: true, status: response.status })
    }
    
    // If HEAD fails, try GET as some servers don't support HEAD
    const getResponse = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "LunaX-Scanner/1.0",
      },
    })
    
    return NextResponse.json({ valid: true, status: getResponse.status })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    if (errorMessage.includes("abort") || errorMessage.includes("timeout")) {
      return NextResponse.json({ valid: false, error: "Connection timed out. The site may be slow or unreachable." })
    }
    
    if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("getaddrinfo")) {
      return NextResponse.json({ valid: false, error: "Domain not found. Please check the URL." })
    }
    
    if (errorMessage.includes("ECONNREFUSED")) {
      return NextResponse.json({ valid: false, error: "Connection refused. The server may be down." })
    }
    
    return NextResponse.json({ valid: false, error: "Could not connect to the URL. Please verify it exists." })
  }
}
