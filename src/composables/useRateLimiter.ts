/**
 * useRateLimiter Composable
 * Provides rate limiting in components
 */

import { ref, computed } from 'vue'
import { getRateLimiter } from '../utils/rateLimiter'
import type { Ref } from 'vue'

export const useRateLimiter = (identifier: string = 'login') => {
  const limiter = getRateLimiter()

  const isLocked: Ref<boolean> = ref(false)
  const attemptsRemaining: Ref<number> = ref(limiter.getAttemptsRemaining(identifier))
  const lockoutTimeRemaining: Ref<number> = ref(0)
  let countdownInterval: ReturnType<typeof setInterval> | null = null

  const updateState = (): void => {
    isLocked.value = limiter.isLockedOut(identifier)
    attemptsRemaining.value = limiter.getAttemptsRemaining(identifier)
    lockoutTimeRemaining.value = Math.max(0, limiter.getLockoutTimeRemaining(identifier))
  }

  const recordAttempt = (): boolean => {
    const result = limiter.recordAttempt(identifier)
    updateState()

    if (!result.allowed && result.lockoutUntil) {
      startCountdown()
    }

    return result.allowed
  }

  const startCountdown = (): void => {
    if (countdownInterval) clearInterval(countdownInterval)

    countdownInterval = setInterval(() => {
      lockoutTimeRemaining.value = Math.max(0, limiter.getLockoutTimeRemaining(identifier))

      if (lockoutTimeRemaining.value <= 0) {
        if (countdownInterval) clearInterval(countdownInterval)
        countdownInterval = null
        updateState()
      }
    }, 1000)
  }

  const reset = (): void => {
    if (countdownInterval) clearInterval(countdownInterval)
    limiter.reset(identifier)
    updateState()
  }

  const getFormattedLockoutTime = (): string => {
    const minutes = Math.floor(lockoutTimeRemaining.value / 60)
    const seconds = lockoutTimeRemaining.value % 60

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  const getStatus = () => {
    return {
      isLocked: isLocked.value,
      attemptsRemaining: attemptsRemaining.value,
      lockoutTimeRemaining: lockoutTimeRemaining.value
    }
  }

  updateState()

  return {
    isLocked: computed(() => isLocked.value),
    attemptsRemaining: computed(() => attemptsRemaining.value),
    lockoutTimeRemaining: computed(() => lockoutTimeRemaining.value),
    recordAttempt,
    reset,
    getFormattedLockoutTime,
    getStatus,
    updateState
  }
}
