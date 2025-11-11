export interface RegisterParams {
  UserName: string
  Email: string
  Password: string
  ConfirmPassword: string
}

export interface LoginParams {
  Email: string
  Password: string
}

export interface LoginResponse {
  token: string
  user: {
    userId: number
    userName: string
    email: string
    roleId: number
    roleName: string
  }
}

export interface ApiError {
  statuscodes: number
  message: string
}

export interface UserProfile {
  id: number
  roleName: string
  userImage: string | null
  createAt: string
  updateAt: string
  isVegetarian: boolean
  isActive: boolean
  userName: string
  email: string
  password: string
  phoneNumber: string
  userAddress: string
  preference: string
  dislike: string
  allergy: string
  diet: string
}

export interface UpdateUserProfileParams {
  userroleid?: number
  image?: File | null
  UserName: string
  Email: string
  Password: string
  PhoneNumber: string
  UserAddress: string
  Preference?: string
  Dislike?: string
  Allergy?: string
  Diet?: string
}

export interface UserLocation {
  userLatitude: number
  userLongitude: number
  lastLocationUpdate?: string
}

// Register API - Using Next.js API route to avoid CORS
export async function registerUser(params: RegisterParams): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserName: params.UserName,
        Email: params.Email,
        Password: params.Password,
        ConfirmPassword: params.ConfirmPassword,
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return true
    } else if (response.status === 400 || response.status === 409) {
      throw new Error(data.message || "Registration failed")
    } else {
      throw new Error(data.message || "Registration failed. Please try again.")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Login API - Using Next.js API route to avoid CORS
export async function loginUser(params: LoginParams): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: params.Email,
        Password: params.Password,
      }),
    })

    const data = await response.json()

    if (response.ok && data.token) {
      return data as LoginResponse
    } else {
      throw new Error(data.message || "Login failed. Please check your credentials.")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Logout API - Using Next.js API route to avoid CORS
export async function logoutUser(token: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Logout failed")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Change Password API
export interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export async function changePassword(params: ChangePasswordParams, token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/auth/change-password?OldPassword=${encodeURIComponent(params.oldPassword)}&NewPassword=${encodeURIComponent(params.newPassword)}&ConfirmPassword=${encodeURIComponent(params.confirmPassword)}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Change password failed")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Forgot Password API - Using Next.js API route to avoid CORS
export async function forgotPassword(email: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/auth/forgot-password?Email=${encodeURIComponent(email)}`, {
      method: "POST",
      headers: {
        Accept: "*/*",
      },
    })

    const data = await response.json()

    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Failed to send reset email")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Verify Reset Token API
export async function verifyResetToken(token: string, email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/auth/verify-reset-token?Token=${encodeURIComponent(token)}&Email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
      }
    )

    const data = await response.json()

    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Token verification failed")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Reset Password API
export interface ResetPasswordParams {
  token: string
  email: string
  newPassword: string
  confirmPassword: string
}

export async function resetPassword(params: ResetPasswordParams): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/auth/reset-password?Token=${encodeURIComponent(params.token)}&Email=${encodeURIComponent(params.email)}&NewPassword=${encodeURIComponent(params.newPassword)}&ConfirmPassword=${encodeURIComponent(params.confirmPassword)}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
      }
    )

    const data = await response.json()

    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Reset password failed")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Password validation
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!/^[A-Z]/.test(password)) {
    errors.push("Password must start with an uppercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Get user profile by ID - Using Next.js API route to avoid CORS
export async function getUserProfile(userId: number, token: string): Promise<UserProfile> {
  try {
    const response = await fetch(`/api/user/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    })

    const data = await response.json()

    if (response.ok) {
      return data as UserProfile
    } else {
      throw new Error(data.message || "Failed to fetch user profile")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Update user profile by ID - Using Next.js API route to avoid CORS
export async function updateUserProfile(
  userId: number,
  params: UpdateUserProfileParams,
  token: string
): Promise<boolean> {
  try {
    const formData = new FormData()
    
    // Add all required fields
    formData.append("UserName", params.UserName)
    formData.append("Email", params.Email)
    formData.append("Password", params.Password)
    formData.append("PhoneNumber", params.PhoneNumber)
    formData.append("UserAddress", params.UserAddress)
    
    // Add optional fields
    if (params.Preference) {
      formData.append("Preference", params.Preference)
    }
    if (params.Dislike) {
      formData.append("Dislike", params.Dislike)
    }
    if (params.Allergy) {
      formData.append("Allergy", params.Allergy)
    }
    if (params.Diet) {
      formData.append("Diet", params.Diet)
    }
    if (params.userroleid !== undefined) {
      formData.append("userroleid", params.userroleid.toString())
    }
    if (params.image) {
      formData.append("image", params.image)
    }

    const response = await fetch(`/api/user/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
      body: formData,
    })

    const data = await response.json()

    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Failed to update user profile")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get user location - Using Next.js API route to avoid CORS
export async function getUserLocation(token: string): Promise<UserLocation> {
  try {
    const response = await fetch(`/api/user/location`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    })

    const data = await response.json()

    if (response.ok) {
      return data as UserLocation
    } else {
      throw new Error(data.message || "Failed to fetch user location")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Update user location - Using Next.js API route to avoid CORS
export async function updateUserLocation(
  location: { userLatitude: number; userLongitude: number },
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/user/location`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    })

    const data = await response.json()

    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Failed to update user location")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

export interface Tag {
  tagID: number
  tagName: string
  tagImg: string
}

export interface Dish {
  id: number
  dishName: string
  dishImage: string
  dishDescription: string
  dishPrice: number
  isVegan: boolean
}

export interface DishesResponse {
  totalIteams: number
  result: Dish[]
}

// Get tags - Using Next.js API route to avoid CORS
export async function getTags(token?: string): Promise<Tag[]> {
  try {
    const headers: HeadersInit = {
      Accept: "*/*",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`/api/tag/tags`, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (response.ok) {
      return data as Tag[]
    } else {
      throw new Error(data.message || "Failed to fetch tags")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get dishes - Using Next.js API route to avoid CORS
export async function getDishes(params?: {
  sort?: number
  price?: number
  search?: string
  token?: string
}): Promise<DishesResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.sort !== undefined) {
      queryParams.append("sort", params.sort.toString())
    }
    if (params?.price !== undefined) {
      queryParams.append("price", params.price.toString())
    }
    if (params?.search) {
      queryParams.append("search", params.search)
    }

    const queryString = queryParams.toString()
    const url = `/api/dish/dishes${queryString ? `?${queryString}` : ""}`

    const headers: HeadersInit = {
      Accept: "*/*",
    }

    if (params?.token) {
      headers.Authorization = `Bearer ${params.token}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (response.ok) {
      return data as DishesResponse
    } else {
      throw new Error(data.message || "Failed to fetch dishes")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

export interface DishDetail {
  id: number
  dishName: string
  dishImage: string
  dishDescription: string
  dishPrice: number
  isVegan: boolean
  // Optional restaurant location info (backend will add later)
  restaurantName?: string
  restaurantAddress?: string
  latitude?: number
  longitude?: number
}

export interface Restaurant {
  id: number
  tagName: string
  restaurantImg: string
  resName: string
  resAddress: string
  starRating: number
  resPhoneNumber: number | null
  openingHours: string
  latitude: number
  longitude: number
  dishes: DishDetail[]
  // For nearby/distance responses
  distanceFromUser?: number
  distanceDisplay?: string
}

export interface TagWithRestaurants {
  tagID: number
  tagName: string
  tagImg: string
  restaurants: Array<{
    id: number
    restaurantImg: string
    starRating: number
    resName: string
    resAddress: string
    resPhoneNumber: number | null
    openingHours: string
  }>
}

export interface NearbyRestaurantsResponse {
  totalItems: number
  radiusKm: number
  userLocation: {
    userLatitude: number
    userLongitude: number
  }
  restaurants: Restaurant[]
}

export interface DistanceRestaurantsResponse {
  totalItems: number
  userLocation: {
    userLatitude: number
    userLongitude: number
  }
  restaurants: Restaurant[]
}

export interface Rating {
  id: number
  userName: string
  restaurantName: string
  createAt: string
  star: number
  comment: string
}

export interface RatingsListResponse {
  totalIteams: number
  result: Rating[]
}

// Get dish detail - Using Next.js API route to avoid CORS
export async function getDishDetail(id: number, token?: string): Promise<DishDetail> {
  try {
    const headers: HeadersInit = {
      Accept: "*/*",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`/api/dish/dishes/${id}`, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (response.ok) {
      return data as DishDetail
    } else {
      throw new Error(data.message || "Failed to fetch dish detail")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get restaurant detail - Using Next.js API route to avoid CORS
export async function getRestaurantDetail(id: number, token?: string): Promise<Restaurant> {
  try {
    const headers: HeadersInit = {
      Accept: "*/*",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`/api/restaurant/restaurants/${id}`, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (response.ok) {
      return data as Restaurant
    } else {
      throw new Error(data.message || "Failed to fetch restaurant detail")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get nearby restaurants - Using Next.js API route to avoid CORS
export async function getNearbyRestaurants(params?: { radiusKm?: number }, token?: string): Promise<NearbyRestaurantsResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.radiusKm !== undefined) {
      queryParams.append("radiusKm", params.radiusKm.toString())
    }

    const queryString = queryParams.toString()
    const url = `/api/restaurant/nearby${queryString ? `?${queryString}` : ""}`

    const headers: HeadersInit = {
      Accept: "*/*",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (response.ok) {
      return data as NearbyRestaurantsResponse
    } else {
      throw new Error(data.message || "Failed to fetch nearby restaurants")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get restaurants by distance - Using Next.js API route to avoid CORS
export async function getRestaurantsByDistance(params?: { search?: string }, token?: string): Promise<DistanceRestaurantsResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.search) {
      queryParams.append("search", params.search)
    }

    const queryString = queryParams.toString()
    const url = `/api/restaurant/distance${queryString ? `?${queryString}` : ""}`

    const headers: HeadersInit = {
      Accept: "*/*",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (response.ok) {
      return data as DistanceRestaurantsResponse
    } else {
      throw new Error(data.message || "Failed to fetch restaurants by distance")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get tag with restaurants - Using Next.js API route to avoid CORS
export async function getTagWithRestaurants(id: number, token?: string): Promise<TagWithRestaurants> {
  try {
    const headers: HeadersInit = {
      Accept: "*/*",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`/api/tag/tags/${id}`, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (response.ok) {
      return data as TagWithRestaurants
    } else {
      throw new Error(data.message || "Failed to fetch tag with restaurants")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get ratings - Using Next.js API route to avoid CORS
export async function getRatings(id: number, token?: string): Promise<Rating[]> {
  try {
    const headers: HeadersInit = {
      Accept: "*/*",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`/api/rating/ratings/${id}`, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (response.ok) {
      // If single rating, return as array
      return Array.isArray(data) ? data : [data]
    } else {
      throw new Error(data.message || "Failed to fetch ratings")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get restaurant ratings list - Using Next.js API route to avoid CORS
// Note: Ratings are public, so we don't send token for GET requests
export async function getRestaurantRatings(
  restaurantId: number,
  token?: string
): Promise<RatingsListResponse> {
  try {
    // Ratings are public, don't send token for GET request
    const headers: HeadersInit = {
      Accept: "*/*",
    }

    const response = await fetch(`/api/rating/restaurants/${restaurantId}/ratings`, {
      method: "GET",
      headers,
    })

    const data = await response.json()
    if (response.ok) {
      return data as RatingsListResponse
    } else {
      // Return empty result instead of throwing for non-critical errors
      if (response.status === 401 || response.status === 403) {
        console.warn("Failed to fetch ratings, returning empty result")
        return { result: [], totalIteams: 0 }
      }
      throw new Error(data.message || "Failed to fetch restaurant ratings")
    }
  } catch (error) {
    if (error instanceof Error) {
      // For network errors or other issues, return empty result
      console.error("Error fetching restaurant ratings:", error)
      return { result: [], totalIteams: 0 }
    }
    return { result: [], totalIteams: 0 }
  }
}

// Create a rating for a restaurant - Using Next.js API route to avoid CORS
export async function createRestaurantRating(
  restaurantId: number,
  rating: { star: number; comment: string },
  token: string
): Promise<{ message: string }> {
  try {
    const response = await fetch(`/api/rating/restaurants/${restaurantId}/ratings`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rating),
    })

    const data = await response.json()
    if (response.ok) {
      return data as { message: string }
    } else {
      throw new Error(data.message || "Failed to create rating")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

export interface FoodSuggestion {
  suggestion: string
  restaurantImg: string
  resName: string
  resAddress: string
  distanceDisplay: string | null
}

// Get food suggestion - Using Next.js API route to avoid CORS
export async function getFoodSuggestion(radiusKm?: number, token?: string): Promise<FoodSuggestion> {
  try {
    const headers: HeadersInit = {
      Accept: "*/*",
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`/api/foodsuggestion`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        radiusKm: radiusKm || 20,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // Normalize API response: some backends return { suggestions: [...] }
      // while older implementations returned a single FoodSuggestion object.
      // If suggestions array exists, map first item to FoodSuggestion shape.
      if (data && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        const s = data.suggestions[0]
        return {
          suggestion: s.dishName || s.suggestion || "",
          restaurantImg: s.restaurantImg || "",
          resName: s.resName || s.restaurantName || "",
          resAddress: s.resAddress || s.restaurantAddress || "",
          distanceDisplay: s.distanceDisplay || null,
        } as FoodSuggestion
      }

      // If API returned a single object matching our shape, return it directly
      if (data && (data.suggestion || data.restaurantImg || data.resName)) {
        return data as FoodSuggestion
      }

      // Unknown shape
      throw new Error("Failed to get food suggestion: unexpected response shape")
    } else {
      throw new Error(data.message || "Failed to get food suggestion")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Payment types
export interface PremiumCheckout {
  checkoutUrl: string
  qrCode: string
  orderCode: number
}

export interface PaymentHistoryItem {
  paymentId: number
  orderCode: number
  amount: number
  description: string
  status: string
  paymentType: string
  premiumExpiryDate: string | null
  createdAt: string
  paidAt: string | null
}

export interface PaymentHistoryResponse {
  payments: PaymentHistoryItem[]
}

export interface PremiumStatusResponse {
  hasPremium: boolean
  expiryDate: string | null
}

export interface PaymentSuccessResponse {
  success: boolean
  message: string
  orderCode: string
  status: string
}

// Admin Payment types
export interface Payment {
  paymentId: number
  userId: number
  orderCode: number
  amount: number
  description: string
  status: string
  paymentType: string
  premiumExpiryDate: string | null
  createdAt: string
  paidAt: string | null
}

export interface PaymentsResponse {
  totalItems: number
  payments: Payment[]
}

// Create premium payment - Using Next.js API route to avoid CORS
export async function createPremiumPayment(
  params: { ReturnUrl?: string; CancelUrl?: string },
  token: string
): Promise<PremiumCheckout> {
  try {
    const query = new URLSearchParams()
    if (params.ReturnUrl) query.append("ReturnUrl", params.ReturnUrl)
    if (params.CancelUrl) query.append("CancelUrl", params.CancelUrl)
    const url = `/api/payment/premium${query.toString() ? `?${query.toString()}` : ""}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) return data as PremiumCheckout
    throw new Error(data.message || "Failed to create premium payment")
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

export async function getPaymentHistory(token: string): Promise<PaymentHistoryResponse> {
  try {
    const response = await fetch(`/api/payment/history`, {
      method: "GET",
      headers: { Accept: "*/*", Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    if (response.ok) return data as PaymentHistoryResponse
    throw new Error(data.message || "Failed to fetch payment history")
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

export async function getPremiumStatus(token: string): Promise<PremiumStatusResponse> {
  try {
    const response = await fetch(`/api/payment/premium-status`, {
      method: "GET",
      headers: { Accept: "*/*", Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    if (response.ok) return data as PremiumStatusResponse
    
    // If unauthorized (401), user doesn't have premium - return default
    if (response.status === 401 || response.status === 403) {
      return { hasPremium: false, expiryDate: null }
    }
    
    throw new Error(data.message || "Failed to fetch premium status")
  } catch (error) {
    if (error instanceof Error) {
      // If it's already an Error, check if it's a network error
      // For network errors or other issues, assume no premium
      if (error.message.includes("Network") || error.message.includes("Failed to fetch")) {
        return { hasPremium: false, expiryDate: null }
      }
      throw error
    }
    // For any other errors, return default (no premium)
    return { hasPremium: false, expiryDate: null }
  }
}

// Get all payments (Admin only)
export async function getAllPayments(token: string): Promise<PaymentsResponse> {
  try {
    // Try calling backend API directly first (bypass Next.js API route)
    // This helps debug if the issue is with Next.js API route or backend
    const config = await import("@/lib/config").then(m => m.config)
    const directUrl = `${config.apiBaseUrl}/Payment/payments`
    
    console.log("Trying direct API call to:", directUrl)
    
    try {
      const directResponse = await fetch(directUrl, {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (directResponse.ok) {
        const directData = await directResponse.json()
        console.log("Direct API call successful!")
        return directData as PaymentsResponse
      } else {
        const directData = await directResponse.json().catch(() => ({}))
        console.log("Direct API call failed:", directResponse.status, directData)
      }
    } catch (directError) {
      console.log("Direct API call error (will try Next.js route):", directError)
    }
    
    // Fallback to Next.js API route
    const response = await fetch(`/api/admin/payments`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return data as PaymentsResponse
    } else {
      // Check if token is expired
      if (data?.tokenExpired || (data?.message && data.message.includes("expired"))) {
        console.error("Token expired when fetching payments. User needs to login again.")
        // Don't return empty list for expired token - let it throw so user knows to login
        throw new Error("Token expired. Please login again.")
      }
      // Handle unauthorized/not found errors gracefully
      if (response.status === 401 || response.status === 403) {
        console.warn("Unauthorized to fetch payments (status:", response.status, "), returning empty list")
        return { totalItems: 0, payments: [] }
      }
      if (response.status === 404) {
        console.warn("Payments endpoint not found, returning empty list")
        return { totalItems: 0, payments: [] }
      }
      // For other errors, check if message indicates authorization issue
      const errorMessage = data?.message || "Failed to fetch payments"
      if (errorMessage.includes("Not Authorize") || errorMessage.includes("Unauthorized") || errorMessage.includes("Not Authorized")) {
        console.warn("Authorization error:", errorMessage, "- returning empty list")
        return { totalItems: 0, payments: [] }
      }
      throw new Error(errorMessage)
    }
  } catch (error) {
    if (error instanceof Error) {
      // If it's an authorization/not found error, return empty list instead of throwing
      if (error.message.includes("Unauthorized") || 
          error.message.includes("Not Authorize") || 
          error.message.includes("Not Authorized") ||
          error.message.includes("Resource Not Found") ||
          error.message.includes("Not Found")) {
        console.warn("Error fetching payments:", error.message, "- returning empty list")
        return { totalItems: 0, payments: [] }
      }
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

export async function getPaymentSuccess(orderCode: string, token: string): Promise<PaymentSuccessResponse> {
  try {
    const response = await fetch(`/api/payment/success?orderCode=${encodeURIComponent(orderCode)}`, {
      method: "GET",
      headers: { Accept: "*/*", Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    if (response.ok) return data as PaymentSuccessResponse
    throw new Error(data.message || "Failed to fetch payment success result")
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

// Favorite types
export interface Favorite {
  id: number
  userName: string
  dishName: string
  restaurantName: string
}

export interface AddFavoriteParams {
  dishid: number
  restaurantid: number
}

// Get favorites - Using Next.js API route to avoid CORS
export async function getFavorites(token: string): Promise<Favorite[]> {
  try {
    const response = await fetch(`/api/favorite/favorites`, {
      method: "GET",
      headers: { Accept: "*/*", Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    if (response.ok) return data as Favorite[]
    throw new Error(data.message || "Failed to fetch favorites")
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

// Add favorite - Using Next.js API route to avoid CORS
export async function addFavorite(params: AddFavoriteParams, token: string): Promise<boolean> {
  try {
    const formData = new FormData()
    formData.append("dishid", params.dishid.toString())
    formData.append("restaurantid", params.restaurantid.toString())

    const response = await fetch(`/api/favorite/favorites`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    const data = await response.json()
    if (response.ok) return data === true
    throw new Error(data.message || "Failed to add favorite")
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

// Admin API functions
export type AdminUser = UserProfile

export interface AdminUsersResponse {
  pageSize: number
  pageNumber: number
  pageCount: number
  data: AdminUser[]
}

// Get all users (Admin only) with pagination
export async function getAllUsers(
  token: string,
  params?: { pageNumber?: number; pageSize?: number }
): Promise<AdminUsersResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.pageNumber !== undefined) {
      queryParams.append("pagenumber", params.pageNumber.toString())
    }
    if (params?.pageSize !== undefined) {
      queryParams.append("pazesize", params.pageSize.toString())
    }

    const url = `/api/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return data as AdminUsersResponse
    } else {
      throw new Error(data.message || "Failed to fetch users")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get all restaurants (Admin only)
export async function getAllRestaurants(token: string): Promise<{ totalIteams: number; result: Restaurant[] }> {
  try {
    const response = await fetch(`/api/admin/restaurants`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return data as { totalIteams: number; result: Restaurant[] }
    } else {
      throw new Error(data.message || "Failed to fetch restaurants")
    }
  } catch (error) {
    if (error instanceof Error) {
      console.warn("Admin endpoint not available, returning empty array")
      return { totalIteams: 0, result: [] }
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get all dishes (Admin only)
export async function getAllDishes(token: string): Promise<DishesResponse> {
  try {
    const response = await fetch(`/api/admin/dishes`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return data as DishesResponse
    } else {
      // Fallback to regular dishes endpoint
      return await getDishes({ token })
    }
  } catch (error) {
    if (error instanceof Error) {
      // Fallback to regular dishes endpoint
      try {
        return await getDishes({ token })
      } catch {
        return { totalIteams: 0, result: [] }
      }
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get all ratings (Admin only)
export async function getAllRatings(token: string): Promise<RatingsListResponse> {
  try {
    const response = await fetch(`/api/admin/ratings`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return data as RatingsListResponse
    } else {
      throw new Error(data.message || "Failed to fetch ratings")
    }
  } catch (error) {
    if (error instanceof Error) {
      console.warn("Admin endpoint not available, returning empty array")
      return { result: [], totalIteams: 0 }
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Delete user (Admin only)
export async function deleteUser(userId: number, token: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Failed to delete user")
    }
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

// Delete restaurant (Admin only)
export async function deleteRestaurant(restaurantId: number, token: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/restaurants/${restaurantId}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Failed to delete restaurant")
    }
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

// Delete dish (Admin only)
export async function deleteDish(dishId: number, token: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/dishes/${dishId}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Failed to delete dish")
    }
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

// Delete tag (Admin only)
export async function deleteTag(tagId: number, token: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/tags/${tagId}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Failed to delete tag")
    }
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

// Delete rating (Admin only)
export async function deleteRating(ratingId: number, token: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/ratings/${ratingId}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (response.ok) {
      return true
    } else {
      throw new Error(data.message || "Failed to delete rating")
    }
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Network error. Please check your connection.")
  }
}

