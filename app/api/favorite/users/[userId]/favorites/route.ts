import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/favorite/users/[userId]/favorites
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    
    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = { Accept: "*/*" }
    if (authHeader) headers.Authorization = authHeader

    const upstream = await fetch(`${API_BASE_URL}/Favorite/users/${userId}/favorites`, {
      method: "GET",
      headers,
    })
    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
    
    // Log the raw response for debugging
    if (Array.isArray(data) && data.length > 0) {
      console.log("Favorite API raw response sample:", JSON.stringify(data[0], null, 2))
      console.log("All keys in favorite item:", Object.keys(data[0]))
    }
    
    // Clean up image URLs if present and map fields
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item: any) => {
        if (item.dishImg) {
          item.dishImg = item.dishImg.replace(config.imageUrlPrefix, "")
        }
        
        // IMPORTANT: Backend might return:
        // Option 1: { id: favoriteId, dishId: dishId } - id is favoriteId, dishId is separate ✅
        // Option 2: { id: dishId } - id is dishId (no separate dishId field) ✅
        // Option 3: { id: favoriteId } - id is favoriteId, no dishId (PROBLEM!) ❌
        // Option 4: { id: favoriteId, dishId: null/undefined } - id is favoriteId, dishId missing ❌
        
        // Strategy: Always preserve the original id as favoriteId for deletion
        const originalId = item.id
        
        // Check for dishId in various possible field names
        const dishIdValue = item.dishId || item.dishID || item.dish_id || item.dishID || 
                           (item.dish && item.dish.id) || // Nested dish object
                           (item.dishDto && item.dishDto.id) // Nested dishDto object
        
        // Check if dishId exists and is valid
        const hasDishId = dishIdValue !== undefined && dishIdValue !== null && dishIdValue !== ""
        
        if (hasDishId && dishIdValue !== originalId) {
          // Backend returned dishId separately - this is the correct case
          item.favoriteId = originalId // Original id is favoriteId
          item.dishId = dishIdValue // Use the separate dishId
          item.id = dishIdValue // Set id to dishId for linking to food detail page
          console.log(`✅ Mapped favorite: favoriteId=${originalId}, dishId=${dishIdValue}`)
        } else if (hasDishId && dishIdValue === originalId) {
          // dishId exists but equals id - assume id is dishId (backward compatibility)
          item.favoriteId = originalId // For deletion, use id as favoriteId
          item.dishId = originalId
          item.id = originalId
          console.log(`⚠️ Mapped favorite: id=${originalId} (assuming it's dishId, no separate favoriteId)`)
        } else {
          // No dishId found - this is a problem!
          // The id is likely favoriteId, but we don't have dishId
          // We need to find dishId from dishName or other fields
          // For now, log error and keep original id
          item.favoriteId = originalId
          // Try to find dishId from dishName by searching in dishes list
          // But this requires additional API call, so we'll mark it as missing
          item.dishId = undefined
          item.id = originalId // Keep original id, but this might be favoriteId!
          console.error(`❌ CRITICAL: Favorite item has id=${originalId} but no dishId found!`, {
            item: JSON.stringify(item, null, 2),
            availableFields: Object.keys(item)
          })
          console.warn(`⚠️ This favorite cannot link to food detail page! Backend should return dishId.`)
        }
      })
    }
    
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Get user favorites error:", error)
    return NextResponse.json({ statuscodes: 500, message: "Internal server error" }, { status: 500 })
  }
}

