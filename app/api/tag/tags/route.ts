import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/tag/tags
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header (optional for tags)
    const authHeader = request.headers.get("authorization")
    let headers: HeadersInit = {
      Accept: "*/*",
    }

    if (authHeader) {
      headers.Authorization = authHeader
    }

    // Call external API
    const response = await fetch(`${API_BASE_URL}/Tag/tags`, {
      method: "GET",
      headers,
    })

    // Check if response has content
    const contentType = response.headers.get("content-type")
    let data
    try {
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text()
        data = text ? JSON.parse(text) : null
      } else {
        const text = await response.text()
        data = text ? { message: text } : { message: "Failed to fetch tags" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      // Clean up image URLs - remove configured prefix if present
      let cleanedData = data
      if (Array.isArray(data)) {
        cleanedData = data.map((tag: any) => ({
          ...tag,
          tagImg: tag.tagImg ? tag.tagImg.replace(config.imageUrlPrefix, "") : tag.tagImg,
        }))
      }
      return NextResponse.json(cleanedData, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Failed to fetch tags" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Get tags error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

