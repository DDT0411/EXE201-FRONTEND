import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// DELETE /api/admin/ratings/[id] - Delete rating (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { statuscodes: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Call external API
    const response = await fetch(`${API_BASE_URL}/Admin/ratings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    })

    const contentType = response.headers.get("content-type")
    let data
    try {
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text()
        data = text ? JSON.parse(text) : null
      } else {
        const text = await response.text()
        data = text ? { message: text } : { message: "Failed to delete rating" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Failed to delete rating" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Delete rating error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

