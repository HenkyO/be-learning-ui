/**
 * Rate Limiter for Login Attempts
 * Prevents brute force attacks with exponential backoff
 */

import type { RateLimitConfig, RateLimitState } from '../types'

const DEFAULT_CONFIG: RateLimitConfig = {
  max_attempts: 3,
  lockout_duration_ms: 5 * 60 * 1000, // 5 minutes
  reset_duration_ms: 15 * 60 * 1000 // 15 minutes
}

class RateLimiter {
  private config: RateLimitConfig
  private attempts: Map<string, RateLimitState> = new Map()
  private storageKey = 'rate_limit_attempts'

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.loadFromStorage()
  }

  /**
   * Get current rate limit state for identifier
   */
  getState(identifier: string): RateLimitState {
    const stored = this.attempts.get(identifier)

    if (!stored) {
      return {
        attempts: 0,
        last_attempt: null,
        locked_until: null
      }
    }

    // Check if lockout has expired
    if (stored.locked_until && new Date() > stored.locked_until) {
      this.attempts.delete(identifier)
      this.saveToStorage()
      return {
        attempts: 0,
        last_attempt: null,
        locked_until: null
      }
    }

    // Check if reset duration has passed
    if (
      stored.last_attempt &&
      new Date().getTime() - stored.last_attempt.getTime() > this.config.reset_duration_ms
    ) {
      this.attempts.delete(identifier)
      this.saveToStorage()
      return {
        attempts: 0,
        last_attempt: null,
        locked_until: null
      }
    }

    return stored
  }

  /**
   * Record an attempt
   */
  recordAttempt(identifier: string): { allowed: boolean; attemptsLeft: number; lockoutUntil?: Date } {
    const state = this.getState(identifier)

    // Check if locked out
    if (state.locked_until && new Date() < state.locked_until) {
      return {
        allowed: false,
        attemptsLeft: 0,
        lockoutUntil: state.locked_until
      }
    }

    // Increment attempts
    state.attempts++
    state.last_attempt = new Date()

    // Check if max attempts exceeded
    if (state.attempts >= this.config.max_attempts) {
      state.locked_until = new Date(Date.now() + this.config.lockout_duration_ms)
      this.attempts.set(identifier, state)
      this.saveToStorage()

      return {
        allowed: false,
        attemptsLeft: 0,
        lockoutUntil: state.locked_until
      }
    }

    this.attempts.set(identifier, state)
    this.saveToStorage()

    return {
      allowed: true,
      attemptsLeft: this.config.max_attempts - state.attempts
    }
  }

  /**
   * Check if identifier is locked out
   */
  isLockedOut(identifier: string): boolean {
    const state = this.getState(identifier)
    return !!(state.locked_until && new Date() < state.locked_until)
  }

  /**
   * Get lockout time remaining in seconds
   */
  getLockoutTimeRemaining(identifier: string): number {
    const state = this.getState(identifier)

    if (!state.locked_until || new Date() > state.locked_until) {
      return 0
    }

    return Math.ceil((state.locked_until.getTime() - Date.now()) / 1000)
  }

  /**
   * Get attempts remaining
   */
  getAttemptsRemaining(identifier: string): number {
    const state = this.getState(identifier)
    return Math.max(0, this.config.max_attempts - state.attempts)
  }

  /**
   * Reset attempts for identifier
   */
  reset(identifier: string): void {
    this.attempts.delete(identifier)
    this.saveToStorage()
  }

  /**
   * Clear all attempts
   */
  clearAll(): void {
    this.attempts.clear()
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.warn('Could not clear rate limit data from storage:', error)
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const data = JSON.parse(stored) as Record<string, any>
        for (const [key, value] of Object.entries(data)) {
          this.attempts.set(key, {
            attempts: value.attempts,
            last_attempt: value.last_attempt ? new Date(value.last_attempt) : null,
            locked_until: value.locked_until ? new Date(value.locked_until) : null
          })
        }
      }
    } catch (error) {
      console.warn('Could not load rate limit data from storage:', error)
    }
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      const data: Record<string, any> = {}
      for (const [key, value] of this.attempts.entries()) {
        data[key] = {
          attempts: value.attempts,
          last_attempt: value.last_attempt?.toISOString(),
          locked_until: value.locked_until?.toISOString()
        }
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.warn('Could not save rate limit data to storage:', error)
    }
  }
}

// Create singleton instance
let rateLimiter: RateLimiter | null = null

export const getRateLimiter = (): RateLimiter => {
  if (!rateLimiter) {
    rateLimiter = new RateLimiter()
  }
  return rateLimiter
}

export const initRateLimiter = (config?: Partial<RateLimitConfig>): RateLimiter => {
  rateLimiter = new RateLimiter(config)
  return rateLimiter
}

export default RateLimiter
