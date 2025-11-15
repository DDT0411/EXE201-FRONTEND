import { NextRequest, NextResponse } from "next/server"

const GOONG_REST_API_KEY =
  process.env.GOONG_MAPS_REST_API_KEY ||
  process.env.NEXT_PUBLIC_GOONG_MAPS_REST_API_KEY // fallback for legacy setups

// GET /api/goong/geocode
export async function GET(request: NextRequest) {
  try {
    if (!GOONG_REST_API_KEY) {
      console.error("Goong Maps REST API key is not configured")
      return NextResponse.json(
        {
          error:
            "Goong Maps REST API key is not configured. Please add GOONG_MAPS_REST_API_KEY to .env.local (server-side env).",
        },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      )
    }

    // Call Goong Maps Geocoding API
    // Format: https://rsapi.goong.io/Geocode?address={address}&api_key={YOUR_API_KEY}
    const url = new URL("https://rsapi.goong.io/Geocode")
    url.searchParams.append("address", address)
    url.searchParams.append("api_key", GOONG_REST_API_KEY)

    console.log("Calling Goong Geocoding API:", {
      url: url.toString().replace(GOONG_REST_API_KEY, "***"),
      address,
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
      console.error("Failed to parse Goong Geocoding API response:", parseError)
      return NextResponse.json(
        { error: "Invalid response from Goong Maps API" },
        { status: 500 }
      )
    }

    if (response.ok) {
      // Extract location from first result
      if (data?.results && data.results.length > 0) {
        const location = data.results[0].geometry.location
        return NextResponse.json({
          lat: location.lat,
          lng: location.lng,
          formatted_address: data.results[0].formatted_address,
        }, { status: 200 })
      } else {
        return NextResponse.json(
          { error: "No results found for this address" },
          { status: 404 }
        )
      }
    } else {
      console.error("Goong Geocoding API error:", {
        status: response.status,
        statusText: response.statusText,
        data,
      })
      
      let errorMessage = "Failed to geocode address"
      if (data?.error) {
        if (typeof data.error === "string") {
          errorMessage = data.error
        } else if (data.error.message) {
          errorMessage = data.error.message
        }
      } else if (data?.message) {
        errorMessage = data.message
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

