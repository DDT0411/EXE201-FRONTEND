import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/restaurant/distance
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header (required for user location)
    const authHeader = request.headers.get("authorization")
    let headers: HeadersInit = {
      Accept: "*/*",
    }

    if (authHeader) {
      headers.Authorization = authHeader
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    const queryString = search ? `?search=${search}` : ""

    // Call external API
    const response = await fetch(`${API_BASE_URL}/Restaurant/distance${queryString}`, {
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
        data = text ? { message: text } : { message: "Failed to fetch restaurants by distance" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      // Clean up image URLs
      if (data && data.restaurants && Array.isArray(data.restaurants)) {
        data.restaurants = data.restaurants.map((restaurant: any) => ({
          ...restaurant,
          restaurantImg: restaurant.restaurantImg ? restaurant.restaurantImg.replace(config.imageUrlPrefix, "") : restaurant.restaurantImg,
        }))
      }
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Failed to fetch restaurants by distance" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Get restaurants by distance error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

