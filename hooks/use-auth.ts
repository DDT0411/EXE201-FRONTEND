"use client"

import { useState, useEffect } from "react"

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

  useEffect(() => {
    // Load user and token from localStorage on mount
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

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

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  const isAuthenticated = !!token && !!user

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
  }
}

