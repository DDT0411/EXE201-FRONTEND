"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { isTokenExpired, getTimeUntilExpiration } from "@/lib/jwt-utils"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/toast"

export interface User {
  userId: number
  userName: string
  email: string
  roleId: number
  roleName: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const expirationCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    
    // Clear interval if exists
    if (expirationCheckIntervalRef.current) {
      clearInterval(expirationCheckIntervalRef.current)
      expirationCheckIntervalRef.current = null
    }
  }, [])

  // Check token expiration and auto-logout if expired
  const checkTokenExpiration = useCallback(() => {
    if (!token) {
      return
    }

    if (isTokenExpired(token)) {
      console.warn("Token expired - auto-logging out")
      logout()
      
      // Show toast notification
      const language = localStorage.getItem("language") || "vi"
      toast.error(
        language === "vi"
          ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          : "Session expired. Please login again."
      )
      
      // Redirect to login page
      if (typeof window !== "undefined") {
        router.push("/login")
      }
    }
  }, [token, logout, router])

  useEffect(() => {
    // Load user and token from localStorage on mount
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      try {
        // Check if token is expired before setting it
        if (isTokenExpired(storedToken)) {
          console.warn("Stored token is expired - clearing authentication")
          localStorage.removeItem("auth_token")
          localStorage.removeItem("auth_user")
          setIsLoading(false)
          return
        }

        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        // Clear invalid data
        console.error("Failed to load auth data:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Listen for token-expired events from API calls
  useEffect(() => {
    const handleTokenExpiredEvent = () => {
      console.warn("Token expired event received - auto-logging out")
      logout()
      
      // Show toast notification
      const language = localStorage.getItem("language") || "vi"
      toast.error(
        language === "vi"
          ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          : "Session expired. Please login again."
      )
      
      // Redirect to login page
      if (typeof window !== "undefined") {
        router.push("/login")
      }
    }

    window.addEventListener("token-expired", handleTokenExpiredEvent)
    return () => {
      window.removeEventListener("token-expired", handleTokenExpiredEvent)
    }
  }, [logout, router])

  // Set up periodic token expiration check
  useEffect(() => {
    if (token) {
      // Check immediately
      checkTokenExpiration()

      // Set up interval to check every minute
      expirationCheckIntervalRef.current = setInterval(() => {
        checkTokenExpiration()
      }, 60 * 1000) // Check every minute

      // Also check when token is about to expire (within 5 minutes)
      const timeUntilExpiration = getTimeUntilExpiration(token)
      let timeout: NodeJS.Timeout | null = null
      if (timeUntilExpiration && timeUntilExpiration > 0) {
        // Set a timeout to check right before expiration
        timeout = setTimeout(() => {
          checkTokenExpiration()
        }, Math.max(0, timeUntilExpiration - 5 * 60 * 1000)) // 5 minutes before expiration
      }

      return () => {
        if (expirationCheckIntervalRef.current) {
          clearInterval(expirationCheckIntervalRef.current)
        }
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    } else {
      // Clear interval if no token
      if (expirationCheckIntervalRef.current) {
        clearInterval(expirationCheckIntervalRef.current)
        expirationCheckIntervalRef.current = null
      }
    }
  }, [token, checkTokenExpiration])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem("auth_token", newToken)
    localStorage.setItem("auth_user", JSON.stringify(newUser))
    // Check if this is first login (no onboarding_completed flag)
    const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${newUser.userId}`)
    if (!hasCompletedOnboarding) {
      // First login, will show onboarding
      localStorage.setItem(`onboarding_completed_${newUser.userId}`, "false")
    }
  }


  // Helper function to clear token when it's expired or invalid
  const clearExpiredToken = useCallback(() => {
    console.warn("Token expired or invalid - clearing authentication")
    logout()
  }, [logout])

  const isAuthenticated = !!token && !!user

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    clearExpiredToken,
  }
}

