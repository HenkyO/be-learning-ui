/**
 * useSessionTimeout Composable
 * Auto-logout after 30 minutes of inactivity
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../store/authStore'
import type { Ref } from 'vue'

interface SessionTimeoutConfig {
  inactivityTimeoutMs: number // 30 minutes
  warningTimeoutMs: number // 5 minutes before logout
  checkIntervalMs: number // Check every 1 minute
}

const DEFAULT_CONFIG: SessionTimeoutConfig = {
  inactivityTimeoutMs: 30 * 60 * 1000, // 30 minutes
  warningTimeoutMs: 25 * 60 * 1000, // 5 minutes warning
  checkIntervalMs: 1 * 60 * 1000 // Check every minute
}

export const useSessionTimeout = (config: Partial<SessionTimeoutConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const authStore = useAuthStore()

  let lastActivityTime: number = Date.now()
  let timeoutCheckInterval: ReturnType<typeof setInterval> | null = null
  let warningTimeout: ReturnType<typeof setTimeout> | null = null
  let logoutTimeout: ReturnType<typeof setTimeout> | null = null

  const isSessionActive: Ref<boolean> = ref(true)
  const showWarning: Ref<boolean> = ref(false)
  const remainingMinutes: Ref<number> = ref(0)

  // Record user activity
  const recordActivity = (): void => {
    if (!authStore.isAuthenticated) return

    lastActivityTime = Date.now()

    // Clear existing timeouts if activity detected
    if (warningTimeout) clearTimeout(warningTimeout)
    if (logoutTimeout) clearTimeout(logoutTimeout)

    showWarning.value = false

    // Set new warning timeout
    scheduleWarning()
  }

  // Schedule warning dialog
  const scheduleWarning = (): void => {
    warningTimeout = setTimeout(() => {
      if (authStore.isAuthenticated) {
        showWarning.value = true
        startCountdown()
      }
    }, finalConfig.warningTimeoutMs)

    // Schedule auto-logout
    logoutTimeout = setTimeout(() => {
      if (authStore.isAuthenticated) {
        handleSessionTimeout()
      }
    }, finalConfig.inactivityTimeoutMs)
  }

  // Start countdown timer for warning
  const startCountdown = (): void => {
    const countdownInterval = setInterval(() => {
      const timeLeft = finalConfig.inactivityTimeoutMs - (Date.now() - lastActivityTime)
      remainingMinutes.value = Math.ceil(timeLeft / 60000)

      if (remainingMinutes.value <= 0) {
        clearInterval(countdownInterval)
      }
    }, 1000)
  }

  // Extend session
  const extendSession = (): void => {
    showWarning.value = false
    recordActivity()
  }

  // Handle session timeout
  const handleSessionTimeout = async (): Promise<void> => {
    showWarning.value = false
    isSessionActive.value = false

    try {
      await authStore.logout()
    } catch (error) {
      console.error('Error during session timeout logout:', error)
    }
  }

  // Setup activity listeners
  const setupActivityListeners = (): void => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    const handleActivity = (): void => {
      recordActivity()
    }

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true })
    })
  }

  // Remove activity listeners
  const removeActivityListeners = (): void => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    const handleActivity = (): void => {
      recordActivity()
    }

    events.forEach((event) => {
      document.removeEventListener(event, handleActivity)
    })
  }

  // Initialize session timeout
  const init = (): void => {
    if (!authStore.isAuthenticated) return

    setupActivityListeners()
    recordActivity()

    // Optional: periodic check (for debugging)
    if (finalConfig.checkIntervalMs > 0) {
      timeoutCheckInterval = setInterval(() => {
        // Just monitor, actual timeout is handled by setTimeout
      }, finalConfig.checkIntervalMs)
    }
  }

  // Cleanup
  const cleanup = (): void => {
    removeActivityListeners()

    if (timeoutCheckInterval) clearInterval(timeoutCheckInterval)
    if (warningTimeout) clearTimeout(warningTimeout)
    if (logoutTimeout) clearTimeout(logoutTimeout)

    isSessionActive.value = true
    showWarning.value = false
  }

  onMounted(() => {
    if (authStore.isAuthenticated) {
      init()
    }
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    isSessionActive,
    showWarning,
    remainingMinutes,
    recordActivity,
    extendSession,
    handleSessionTimeout,
    init,
    cleanup
  }
}
