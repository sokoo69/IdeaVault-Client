'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authClient } from '@/utils/auth-client'
import toast from 'react-hot-toast'
import api from '@/utils/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user
    ? {
        uid: session.user.id,
        name: session.user.name,
        email: session.user.email,
        photoURL: session.user.image || '',
      }
    : null

  const loading = isPending

  const registerWithEmail = async (name, email, password, photoURL) => {
    try {
      const result = await authClient.signUp.email(
        { name, email, password, image: photoURL || undefined },
        {
          onSuccess: () => toast.success('Account created successfully!'),
          onError: (ctx) => toast.error(ctx.error.message || 'Registration failed'),
        }
      )
      return { success: !result.error }
    } catch (err) {
      toast.error(err.message || 'Registration failed')
      return { success: false }
    }
  }

  const loginWithEmail = async (email, password) => {
    try {
      const result = await authClient.signIn.email(
        { email, password },
        {
          onSuccess: () => toast.success('Welcome back!'),
          onError: (ctx) => toast.error(ctx.error.message || 'Login failed'),
        }
      )
      return { success: !result.error }
    } catch (err) {
      toast.error(err.message || 'Login failed')
      return { success: false }
    }
  }

  const loginWithGoogle = async (redirectUrl = '/') => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      const callbackURL = `${origin}${redirectUrl}`
      await authClient.signIn.social(
        { provider: 'google', callbackURL },
        {
          onError: (ctx) => toast.error(ctx.error.message || 'Google login failed'),
        }
      )
      return { success: true }
    } catch (err) {
      toast.error(err.message || 'Google login failed')
      return { success: false }
    }
  }

  const logout = async () => {
    try {
      await authClient.signOut()
      toast.success('Logged out successfully!')
    } catch (err) {
      toast.error('Logout failed')
    }
  }

  const updateUserProfile = async (updates) => {
    try {
      await api.put('/users/profile', {
        name: updates.name,
        image: updates.photoURL,
      })
      toast.success('Profile updated!')
      return { success: true }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
      return { success: false }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      session,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
