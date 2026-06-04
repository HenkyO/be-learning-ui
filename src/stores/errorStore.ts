/**
 * Centralized Error Handler Store
 * Manages all application errors with retry logic
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ApiError, ErrorContext } from '../types'

export interface StoredError {
  id: string
  context: ErrorContext
  timestamp: Date
  retryCount: number
  maxRetries: number
  retriable: boolean
  dismissed: boolean
}

export const useErrorStore = defineStore('error', () => {
  const errors = ref<Map<string, StoredError>>(new Map())
  const currentError = ref<StoredError | null>(null)

  // Generate unique error ID
  const generateErrorId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Check if error is retriable
  const isRetriableError = (error: Error | ApiError): boolean => {
    if ('status' in error) {
      const apiError = error as ApiError
      return [408, 429, 500, 502, 503, 504].includes(apiError.status || 0)
    }
    const message = error.message.toLowerCase()
    return message.includes('timeout') || message.includes('network')
  }

  // Add error to store
  const addError = (context: ErrorContext, maxRetries: number = 3): string => {
    const id = generateErrorId()
    const error: StoredError = {
      id,
      context,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries,
      retriable: isRetriableError(context.error),
      dismissed: false
    }

    errors.value.set(id, error)
    currentError.value = error

    console.error(`[Error ${id}]`, context)

    return id
  }

  // Retry error
  const retryError = async (
    errorId: string,
    retryFn: () => Promise<any>
  ): Promise<{ success: boolean; result?: any }> => {
    const error = errors.value.get(errorId)

    if (!error) {
      return { success: false }
    }

    if (error.retryCount >= error.maxRetries) {
      error.retriable = false
      return { success: false }
    }

    try {
      error.retryCount++
      const result = await retryFn()
      errors.value.delete(errorId)
      currentError.value = null
      return { success: true, result }
    } catch (err) {
      return { success: false }
    }
  }

  // Dismiss error
  const dismissError = (errorId: string): void => {
    const error = errors.value.get(errorId)
    if (error) {
      error.dismissed = true
      if (currentError.value?.id === errorId) {
        currentError.value = null
      }
    }
  }

  // Clear all errors
  const clearErrors = (): void => {
    errors.value.clear()
    currentError.value = null
  }

  // Get all active errors
  const activeErrors = computed(() => {
    return Array.from(errors.value.values()).filter((e) => !e.dismissed)
  })

  // Check if there are any retriable errors
  const hasRetriableErrors = computed(() => {
    return activeErrors.value.some((e) => e.retriable && e.retryCount < e.maxRetries)
  })

  return {
    errors,
    currentError,
    activeErrors,
    hasRetriableErrors,
    addError,
    retryError,
    dismissError,
    clearErrors,
    isRetriableError
  }
})
