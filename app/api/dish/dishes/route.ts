import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/dish/dishes
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const sort = searchParams.get("sort")
    const price = searchParams.get("price")
    const search = searchParams.get("search")

    // Build query string
    const queryParams = new URLSearchParams()
    if (sort) queryParams.append("sort", sort)
    if (price) queryParams.append("price", price)
    if (search) queryParams.append("search", search)

    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/Dish/dishes${queryString ? `?${queryString}` : ""}`

    // Get token from Authorization header (optional for dishes)
    const authHeader = request.headers.get("authorization")
    let headers: HeadersInit = {
      Accept: "*/*",
    }

    if (authHeader) {
      headers.Authorization = authHeader
    }

    // Call external API
    const response = await fetch(url, {
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
        data = text ? { message: text } : { message: "Failed to fetch dishes" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      // Clean up image URLs - remove localhost:7091 prefix if present
      let cleanedData = data
      if (data?.result && Array.isArray(data.result)) {
        cleanedData = {
          ...data,
          result: data.result.map((dish: any) => ({
            ...dish,
            dishImage: dish.dishImage ? dish.dishImage.replace(config.imageUrlPrefix, "") : dish.dishImage,
          })),
        }
      }
      return NextResponse.json(cleanedData, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Failed to fetch dishes" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Get dishes error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

