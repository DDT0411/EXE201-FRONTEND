import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/rating/restaurants/[restaurantId]/ratings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    const { restaurantId } = await params

    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = {
      Accept: "*/*",
    }
    if (authHeader) headers.Authorization = authHeader

    const upstream = await fetch(
      `${API_BASE_URL}/Rating/restaurants/${restaurantId}/ratings`,
      {
        method: "GET",
        headers,
      }
    )

    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("GET restaurant ratings error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/rating/restaurants/[restaurantId]/ratings
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    const { restaurantId } = await params
    const body = await request.json().catch(() => ({}))

    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = {
      Accept: "*/*",
      "Content-Type": "application/json",
    }
    if (authHeader) headers.Authorization = authHeader

    const upstream = await fetch(
      `${API_BASE_URL}/Rating/restaurants/${restaurantId}/ratings`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    )

    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("POST restaurant rating error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}


