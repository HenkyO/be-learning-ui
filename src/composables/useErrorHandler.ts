/**
 * useErrorHandler Composable
 * Provides centralized error handling with retry mechanism
 */

import { useErrorStore } from '../stores/errorStore'
import type { ApiError, ErrorContext } from '../types'
import { computed } from 'vue'

export const useErrorHandler = () => {
  const errorStore = useErrorStore()

  // Format error message for user display
  const formatErrorMessage = (error: Error | ApiError): string => {
    if ('message' in error && 'code' in error) {
      const apiError = error as ApiError
      switch (apiError.code) {
        case 'INVALID_CREDENTIALS':
          return 'Email atau kata sandi tidak valid. Silakan coba lagi.'
        case 'USER_NOT_FOUND':
          return 'Akun pengguna tidak ditemukan.'
        case 'EMAIL_ALREADY_EXISTS':
          return 'Email ini sudah terdaftar di sistem.'
        case 'WEAK_PASSWORD':
          return 'Kata sandi tidak cukup kuat. Gunakan minimal 8 karakter.'
        case 'NETWORK_ERROR':
          return 'Koneksi internet putus. Periksa koneksi Anda.'
        case 'SERVER_ERROR':
          return 'Server sedang bermasalah. Silakan coba lagi nanti.'
        case 'RATE_LIMITED':
          return 'Terlalu banyak percobaan. Silakan tunggu beberapa saat.'
        case 'UNAUTHORIZED':
          return 'Anda tidak memiliki akses ke resource ini.'
        case 'FORBIDDEN':
          return 'Akses ditolak.'
        case 'NOT_FOUND':
          return 'Resource tidak ditemukan.'
        default:
          return apiError.message || 'Terjadi kesalahan. Silakan coba lagi.'
      }
    }
    return error.message || 'Terjadi kesalahan yang tidak terduga.'
  }

  // Handle error
  const handleError = (
    error: Error | ApiError,
    action: string,
    resource?: string
  ): string => {
    const context: ErrorContext = {
      action,
      resource,
      error
    }

    return errorStore.addError(context)
  }

  // Retry with exponential backoff
  const retryWithBackoff = async (
    retryFn: () => Promise<any>,
    maxRetries: number = 3
  ): Promise<any> => {
    let lastError: any

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await retryFn()
      } catch (error) {
        lastError = error
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError
  }

  return {
    formatErrorMessage,
    handleError,
    retryWithBackoff,
    dismissError: errorStore.dismissError,
    clearErrors: errorStore.clearErrors,
    hasErrors: computed(() => errorStore.activeErrors.length > 0),
    currentError: computed(() => errorStore.currentError),
    activeErrors: computed(() => errorStore.activeErrors),
    canRetry: computed(() => errorStore.hasRetriableErrors)
  }
}
