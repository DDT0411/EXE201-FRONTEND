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
      return data as FoodSuggestion
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
    throw new Error(data.message || "Failed to fetch premium status")
  } catch (error) {
    if (error instanceof Error) throw error
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

