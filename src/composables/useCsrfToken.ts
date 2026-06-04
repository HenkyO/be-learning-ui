/**
 * useCsrfToken Composable
 * Provides CSRF token management in components
 */

import { ref, onMounted } from 'vue'
import { getCSRFManager, initCSRFProtection } from '../utils/csrfToken'
import type { Ref } from 'vue'

export const useCsrfToken = () => {
  const csrfToken: Ref<string> = ref('')
  const manager = getCSRFManager()

  // Initialize CSRF token on mount
  onMounted(() => {
    initCSRFProtection()
    csrfToken.value = manager.getToken()
  })

  // Get current token
  const getToken = (): string => {
    return manager.getToken()
  }

  // Refresh token
  const refreshToken = (): string => {
    csrfToken.value = manager.refreshToken()
    return csrfToken.value
  }

  // Validate token
  const validateToken = (token: string): boolean => {
    return manager.validateToken(token)
  }

  // Get headers for API requests
  const getHeaders = (): Record<string, string> => {
    return manager.getHeaderConfig()
  }

  // Add token to form data
  const addTokenToFormData = (formData: FormData): FormData => {
    formData.append('csrf_token', getToken())
    return formData
  }

  // Add token to request body
  const addTokenToBody = <T extends Record<string, any>>(body: T): T & { csrf_token: string } => {
    return {
      ...body,
      csrf_token: getToken()
    }
  }

  return {
    csrfToken,
    getToken,
    refreshToken,
    validateToken,
    getHeaders,
    addTokenToFormData,
    addTokenToBody
  }
}
