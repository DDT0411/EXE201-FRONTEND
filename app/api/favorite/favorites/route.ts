import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/favorite/favorites
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = { Accept: "*/*" }
    if (authHeader) headers.Authorization = authHeader

    const upstream = await fetch(`${API_BASE_URL}/Favorite/favorites`, {
      method: "GET",
      headers,
    })
    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Get favorites error:", error)
    return NextResponse.json({ statuscodes: 500, message: "Internal server error" }, { status: 500 })
  }
}

// POST /api/favorite/favorites
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const dishid = formData.get("dishid")
    const restaurantid = formData.get("restaurantid")

    if (!dishid || !restaurantid) {
      return NextResponse.json({ message: "Missing dishid or restaurantid" }, { status: 400 })
    }

    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = { Accept: "*/*" }
    if (authHeader) headers.Authorization = authHeader

    // Create form data for backend
    const backendFormData = new FormData()
    backendFormData.append("dishid", dishid.toString())
    backendFormData.append("restaurantid", restaurantid.toString())

    const upstream = await fetch(`${API_BASE_URL}/Favorite/favorites`, {
      method: "POST",
      headers,
      body: backendFormData,
    })
    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Add favorite error:", error)
    return NextResponse.json({ statuscodes: 500, message: "Internal server error" }, { status: 500 })
  }
}

