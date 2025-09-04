// src/lib/auth.ts - Authentication utilities with js-cookie
import Cookies from 'js-cookie'

export interface User {
    id: string
    email: string
    role: 'user' | 'admin'
}

export interface AuthContext {
    isAuthenticated: boolean
    user: User | null
    token: string | null
}

// Cookie helper functions using js-cookie
export const getCookie = (name: string): string | null => {
    return Cookies.get(name) || null
}

export const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes) => {
    // Default options: expires in 7 days, secure in production
    const defaultOptions: Cookies.CookieAttributes = {
        expires: 7, // 7 days
        path: '/',
            sameSite: 'none',
        secure: true, // Only secure in production
        ...options // Allow overriding defaults
    }

    Cookies.set(name, value, defaultOptions)
}

export const removeCookie = (name: string) => {
    Cookies.remove(name, { path: '/' })
}

// Alias for removeCookie (since you had deleteCookie in your original)
export const deleteCookie = (name: string) => {
    removeCookie(name)
}

// Mock function to validate token
export const validateToken = async (token: string): Promise<User | null> => {
    try {
        // In real app, this would be an API call
        if (token === 'user-token') {
            return { id: '1', email: 'user@example.com', role: 'user' }
        }
        if (token === 'admin-token') {
            return { id: '2', email: 'admin@example.com', role: 'admin' }
        }
        return null
    } catch {
        return null
    }
}

// Create auth context - just check if token exists
export const createAuthContext = (): AuthContext => {
    const token = getCookie('token')

    return {
        isAuthenticated: !!token,
        user: null, // We don't need user data for simple token check
        token,
    }
}

// Additional helper functions for common auth operations
export const login = (token: string, options?: Cookies.CookieAttributes) => {
    setCookie('token', token, options)
}

export const logout = () => {
    removeCookie('token')
    // Optional: redirect to login page
    // window.location.href = '/login'
}

export const isAuthenticated = (): boolean => {
    return !!getCookie('token')
}

// For refresh token scenarios
export const setRefreshToken = (refreshToken: string, options?: Cookies.CookieAttributes) => {
    setCookie('refreshToken', refreshToken, {
        expires: 30, // Refresh tokens typically last longer
        httpOnly: false, // Note: js-cookie can't set httpOnly, you'd need server-side for that
        ...options
    })
}

export const getRefreshToken = (): string | null => {
    return getCookie('refreshToken')
}

export const removeRefreshToken = () => {
    removeCookie('refreshToken')
}

// Token expiry helper
export const setTokenWithExpiry = (token: string, expiryInDays = 7) => {
    setCookie('token', token, {
        expires: expiryInDays,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    })
}

// Check if token exists and is not expired (js-cookie handles expiry automatically)
export const hasValidToken = (): boolean => {
    const token = getCookie('token')
    return !!token // If js-cookie returns it, it's not expired
}

export const getAllCookiesAsString = (): string => {
    const allCookies = Cookies.get() // Gets all cookies as an object

    // Convert object to cookie header string format
    return Object.entries(allCookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ')
}
