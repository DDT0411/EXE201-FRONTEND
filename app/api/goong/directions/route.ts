import { NextRequest, NextResponse } from "next/server"

const GOONG_REST_API_KEY = process.env.NEXT_PUBLIC_GOONG_MAPS_REST_API_KEY

// GET /api/goong/directions
export async function GET(request: NextRequest) {
  try {
    if (!GOONG_REST_API_KEY) {
      console.error("Goong Maps REST API key is not configured")
      return NextResponse.json(
        { error: "Goong Maps REST API key is not configured. Please add NEXT_PUBLIC_GOONG_MAPS_REST_API_KEY to .env.local" },
        { status: 500 }
      )
    }

    // Log API key info (masked) for debugging
    console.log("Using Goong REST API Key:", `${GOONG_REST_API_KEY.substring(0, 10)}...${GOONG_REST_API_KEY.substring(GOONG_REST_API_KEY.length - 5)}`)

    const { searchParams } = new URL(request.url)
    const origin = searchParams.get("origin") // format: "lat,lng"
    const destination = searchParams.get("destination") // format: "lat,lng"
    const vehicle = searchParams.get("vehicle") || "car" // car, bike, foot

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      )
    }

    // Call Goong Maps Directions API
    // Format: https://rsapi.goong.io/Direction?origin={lat},{lng}&destination={lat},{lng}&vehicle={vehicle}&api_key={YOUR_API_KEY}
    const url = new URL("https://rsapi.goong.io/Direction")
    url.searchParams.append("origin", origin)
    url.searchParams.append("destination", destination)
    url.searchParams.append("vehicle", vehicle)
    url.searchParams.append("api_key", GOONG_REST_API_KEY)

    console.log("Calling Goong Directions API:", {
      url: url.toString().replace(GOONG_REST_API_KEY, "***"),
      origin,
      destination,
      vehicle,
    })

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    let data
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : null
    } catch (parseError) {
      console.error("Failed to parse Goong Directions API response:", parseError)
      return NextResponse.json(
        { error: "Invalid response from Goong Maps API" },
        { status: 500 }
      )
    }

    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      // Log the error for debugging
      console.error("Goong Directions API error:", {
        status: response.status,
        statusText: response.statusText,
        data,
        apiKey: GOONG_REST_API_KEY ? `${GOONG_REST_API_KEY.substring(0, 10)}...` : "NOT SET",
      })
      
      // Handle specific error messages
      let errorMessage = "Failed to get directions"
      if (data?.error) {
        if (typeof data.error === "string") {
          errorMessage = data.error
        } else if (data.error.message) {
          errorMessage = data.error.message
        }
      } else if (data?.message) {
        errorMessage = data.message
      }
      
      // Check for authorization error
      if (errorMessage.includes("not authorized") || errorMessage.includes("api_key") || errorMessage.includes("authorized")) {
        errorMessage = `API key không được ủy quyền cho Directions service. 
        
Hướng dẫn khắc phục:
1. Đăng nhập vào Goong Maps Dashboard: https://goong.io
2. Vào phần API Keys / Quản lý API Keys
3. Tìm REST API key của bạn
4. Đảm bảo Directions API đã được kích hoạt
5. Kiểm tra URL restrictions (nếu có) - thêm http*://localhost:3000/* và http*://*.vercel.app/*
6. Lưu thay đổi và thử lại`
      }
      
      // Check for URL restriction error
      if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
        errorMessage = `API key bị chặn bởi URL restrictions. 
        
Hướng dẫn:
1. Vào Goong Maps Dashboard > API Keys
2. Chọn REST API key của bạn
3. Trong phần URL restrictions, thêm:
   - http*://localhost:3000/*
   - http*://*.vercel.app/*
   - http*://eatit-two.vercel.app/*
4. Lưu và thử lại`
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Goong Directions API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

