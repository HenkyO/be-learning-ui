/**
 * Notification Store - Global Toast Management
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast, ToastType } from '../types'

export const useNotificationStore = defineStore('notification', () => {
  const toasts = ref<Map<string, Toast>>(new Map())

  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const addToast = (
    message: string,
    type: ToastType = 'info',
    duration: number = 3000,
    action?: { label: string; callback: () => void }
  ): string => {
    const id = generateId()
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      action
    }

    toasts.value.set(id, toast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string): void => {
    toasts.value.delete(id)
  }

  const success = (message: string, duration?: number): string => {
    return addToast(message, 'success', duration)
  }

  const error = (message: string, duration?: number): string => {
    return addToast(message, 'error', duration || 5000)
  }

  const warning = (message: string, duration?: number): string => {
    return addToast(message, 'warning', duration)
  }

  const info = (message: string, duration?: number): string => {
    return addToast(message, 'info', duration)
  }

  const clearAll = (): void => {
    toasts.value.clear()
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  }
})
