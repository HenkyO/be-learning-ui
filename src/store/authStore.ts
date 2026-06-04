// src/store/authStore.ts
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'
import { getRateLimiter } from '../utils/rateLimiter'
import { getCSRFManager } from '../utils/csrfToken'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile as UserProfileType } from '../types'

export interface UserProfile extends UserProfileType {
  id: string
  full_name: string
  nip: string
  role: 'Administrator' | 'Mentor' | 'Pegawai'
  email: string
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    userProfile: null as UserProfile | null,
    isAuthenticated: false,
    isInitialized: false,
    inactivityTimer: null as ReturnType<typeof setTimeout> | null,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const rateLimiter = getRateLimiter()
        if (rateLimiter.isLockedOut(email)) {
          const timeRemaining = rateLimiter.getLockoutTimeRemaining(email)
          throw new Error(`Akun terkunci. Coba lagi dalam ${timeRemaining} detik.`)
        }

        const csrfManager = getCSRFManager()
        csrfManager.getToken()

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          rateLimiter.recordAttempt(email)
          throw error
        }

        if (data.session) {
          rateLimiter.reset(email)
          await this.handleSessionUpdate(data.session)
          csrfManager.refreshToken()
        }
      } catch (error: any) {
        this.error = error.message || 'Login gagal. Silakan coba lagi.'
        console.error('Login error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(email: string, password: string, fullName: string, nip: string) {
      this.isLoading = true
      this.error = null

      try {
        const csrfManager = getCSRFManager()
        csrfManager.getToken()

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              nip: nip
            }
          }
        })

        if (error) throw error

        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: fullName,
            nip: nip,
            role: 'Pegawai',
            email: email
          })
        }

        return data
      } catch (error: any) {
        this.error = error.message || 'Pendaftaran gagal. Silakan coba lagi.'
        console.error('Register error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchProfile(userId: string) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) throw error
        this.userProfile = data as UserProfile
      } catch (error) {
        console.error('Galat menarik profil:', error)
        this.userProfile = null
        this.error = 'Gagal memuat profil pengguna'
      }
    },

    async initializeSession() {
      if (this.isInitialized) return

      try {
        const { data: { session } } = await supabase.auth.getSession()
        await this.handleSessionUpdate(session)

        supabase.auth.onAuthStateChange(async (_event, session) => {
          await this.handleSessionUpdate(session)
        })
      } catch (error) {
        console.error('Session initialization error:', error)
        this.error = 'Gagal menginisialisasi sesi'
      } finally {
        this.isInitialized = true
      }
    },

    async handleSessionUpdate(session: Session | null) {
      if (session?.user) {
        this.user = session.user
        this.isAuthenticated = true
        if (!this.userProfile || this.userProfile.id !== session.user.id) {
          await this.fetchProfile(session.user.id)
        }
        this.startInactivityTimer()
      } else {
        this.clearState()
      }
    },

    startInactivityTimer() {
      if (this.inactivityTimer) {
        window.clearTimeout(this.inactivityTimer)
      }

      if (this.isAuthenticated) {
        this.inactivityTimer = window.setTimeout(() => {
          console.warn('Sesi berakhir karena tidak ada aktivitas.')
          this.logout(true)
        }, SESSION_TIMEOUT_MS)
      }
    },

    clearState() {
      this.user = null
      this.userProfile = null
      this.isAuthenticated = false
      this.error = null
      this.isLoading = false
      if (this.inactivityTimer) {
        window.clearTimeout(this.inactivityTimer)
        this.inactivityTimer = null
      }
    },

    async logout(autoLoggedOut = false) {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearState()

        if (autoLoggedOut) {
          alert('Sesi Anda telah berakhir secara otomatis karena tidak ada aktivitas selama 30 menit. Silakan masuk kembali.')
          window.location.href = '/login'
        }
      }
    }
  }
})
