import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/admin/payments - Get all payments (Admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { statuscodes: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Debug: log token info (first/last chars only for security)
    console.log("Payment API - Token length:", token.length)
    console.log("Payment API - Token preview:", token.substring(0, 10) + "..." + token.substring(token.length - 10))
    console.log("Payment API - Calling:", `${API_BASE_URL}/Payment/payments`)
    console.log("Payment API - Full URL:", `${API_BASE_URL}/Payment/payments`)

    // Call external API - using /Payment/payments endpoint (as provided by user)
    // This endpoint may require admin token
    // Try with same headers as working admin endpoints
    const response = await fetch(`${API_BASE_URL}/Payment/payments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
    
    // Debug: log response headers
    console.log("Payment API - Response status:", response.status)
    console.log("Payment API - Response statusText:", response.statusText)
    const responseHeaders = Object.fromEntries(response.headers.entries())
    console.log("Payment API - Response headers:", responseHeaders)
    
    // Check if token is expired
    const wwwAuthenticate = response.headers.get('www-authenticate')
    if (wwwAuthenticate && wwwAuthenticate.includes('expired')) {
      console.error("Token expired! Please login again.")
      return NextResponse.json(
        { 
          statuscodes: 401, 
          message: "Token expired. Please login again.",
          tokenExpired: true 
        },
        { status: 401 }
      )
    }

    const contentType = response.headers.get("content-type")
    let data
    try {
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text()
        data = text ? JSON.parse(text) : null
      } else {
        const text = await response.text()
        data = text ? { message: text } : { message: "Failed to fetch payments" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    // Debug: log the response
    console.log("Payments API response status:", response.status)
    console.log("Payments API response data:", data)
    console.log("Payments API response ok:", response.ok)

    // Check if response has data even if status is not ok
    // Sometimes API returns data with error status
    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      // If we have data with totalItems/payments, return it anyway
      if (data && (data.totalItems !== undefined || data.payments !== undefined)) {
        console.log("Response not ok but has payment data, returning data")
        return NextResponse.json(data, { status: 200 })
      }
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Failed to fetch payments" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Get payments error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

