/**
 * JWT Token Utilities
 * Helper functions to decode and validate JWT tokens
 */

export interface DecodedToken {
  sub?: string
  email?: string
  exp?: number
  iat?: number
  iss?: string
  aud?: string
  [key: string]: any
}

/**
 * Decode JWT token without verification
 * Note: This only decodes the token, it doesn't verify the signature
 */
export function decodeJWT(token: string): DecodedToken | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (second part)
    const payload = parts[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return decoded
  } catch (error) {
    console.error("Failed to decode JWT token:", error)
    return null
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) {
    // If we can't decode or there's no exp claim, consider it expired
    return true
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000
  const currentTime = Date.now()

  // Add a 5 minute buffer to account for clock skew and network delays
  const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds

  return currentTime >= (expirationTime - bufferTime)
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpirationTime(token: string): number | null {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) {
    return null
  }

  return decoded.exp * 1000 // Convert to milliseconds
}

/**
 * Get time until token expires in milliseconds
 * Returns negative number if already expired
 */
export function getTimeUntilExpiration(token: string): number | null {
  const expirationTime = getTokenExpirationTime(token)
  if (expirationTime === null) {
    return null
  }

  return expirationTime - Date.now()
}

