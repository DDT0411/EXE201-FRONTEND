import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/restaurant/restaurants/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get token from Authorization header (optional)
    const authHeader = request.headers.get("authorization")
    let headers: HeadersInit = {
      Accept: "*/*",
    }

    if (authHeader) {
      headers.Authorization = authHeader
    }

    // Call external API
    const response = await fetch(`${API_BASE_URL}/Restaurant/restaurants/${id}`, {
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
        data = text ? { message: text } : { message: "Failed to fetch restaurant" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      // Clean up image URLs
      if (data) {
          if (data.restaurantImg) {
          data.restaurantImg = data.restaurantImg.replace(config.imageUrlPrefix, "")
        }
        if (data.dishes && Array.isArray(data.dishes)) {
          data.dishes = data.dishes.map((dish: any) => ({
            ...dish,
            dishImage: dish.dishImage ? dish.dishImage.replace(config.imageUrlPrefix, "") : dish.dishImage,
          }))
        }
      }
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Failed to fetch restaurant" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Get restaurant error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

