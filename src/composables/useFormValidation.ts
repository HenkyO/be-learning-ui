import { ref } from 'vue'
import type { Ref } from 'vue'

type FieldErrors = Record<string, string[]>
type FieldValues = Record<string, any>

interface ValidationConfig {
  [fieldName: string]: {
    required?: boolean
    email?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => boolean | string
  }
}

interface UseFormValidationReturn {
  errors: Ref<FieldErrors>
  validate: () => boolean
  validateField: (fieldName: string) => boolean
  clearErrors: () => void
  clearFieldErrors: (fieldName: string) => void
  setFieldValue: (fieldName: string, value: any) => void
  values: Ref<FieldValues>
  resetForm: () => void
}

const DEFAULT_ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Minimum length is ${min} characters`,
  maxLength: (max: number) => `Maximum length is ${max} characters`,
  pattern: 'Invalid format',
  custom: 'This field is invalid'
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function createValidators() {
  const validateRequired = (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    return value !== null && value !== undefined
  }

  const validateEmail = (value: string): boolean => {
    if (!value) return true
    return emailRegex.test(value)
  }

  const validateMinLength = (value: any, min: number): boolean => {
    if (!value) return true
    return String(value).length >= min
  }

  const validateMaxLength = (value: any, max: number): boolean => {
    if (!value) return true
    return String(value).length <= max
  }

  const validatePattern = (value: string, pattern: RegExp): boolean => {
    if (!value) return true
    return pattern.test(value)
  }

  return {
    validateRequired,
    validateEmail,
    validateMinLength,
    validateMaxLength,
    validatePattern
  }
}

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

export function useFormValidation(
  config: ValidationConfig,
  initialValues?: FieldValues
): UseFormValidationReturn {
  const errors = ref<FieldErrors>({})
  const values = ref<FieldValues>(
    initialValues || Object.keys(config).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  )

  const validators = createValidators()

  const validateField = (fieldName: string): boolean => {
    const fieldConfig = config[fieldName]
    const fieldValue = values.value[fieldName]
    const fieldErrors: string[] = []

    if (!fieldConfig) {
      return true
    }

    if (fieldConfig.required && !validators.validateRequired(fieldValue)) {
      fieldErrors.push(DEFAULT_ERROR_MESSAGES.required)
    }

    if (
      fieldConfig.email &&
      fieldValue &&
      !validators.validateEmail(fieldValue)
    ) {
      fieldErrors.push(DEFAULT_ERROR_MESSAGES.email)
    }

    if (
      fieldConfig.minLength &&
      !validators.validateMinLength(fieldValue, fieldConfig.minLength)
    ) {
      fieldErrors.push(DEFAULT_ERROR_MESSAGES.minLength(fieldConfig.minLength))
    }

    if (
      fieldConfig.maxLength &&
      !validators.validateMaxLength(fieldValue, fieldConfig.maxLength)
    ) {
      fieldErrors.push(DEFAULT_ERROR_MESSAGES.maxLength(fieldConfig.maxLength))
    }

    if (
      fieldConfig.pattern &&
      !validators.validatePattern(String(fieldValue || ''), fieldConfig.pattern)
    ) {
      fieldErrors.push(DEFAULT_ERROR_MESSAGES.pattern)
    }

    if (fieldConfig.custom) {
      const customResult = fieldConfig.custom(fieldValue)
      if (customResult === false) {
        fieldErrors.push(DEFAULT_ERROR_MESSAGES.custom)
      } else if (typeof customResult === 'string') {
        fieldErrors.push(customResult)
      }
    }

    if (fieldErrors.length > 0) {
      errors.value[fieldName] = fieldErrors
      return false
    } else {
      delete errors.value[fieldName]
      return true
    }
  }

  const debouncedValidateField = debounce(validateField, 300)

  const validate = (): boolean => {
    const allFieldNames = Object.keys(config)
    const results = allFieldNames.map(validateField)
    return results.every((isValid) => isValid)
  }

  const validateFieldDebounced = (fieldName: string) => {
    debouncedValidateField(fieldName)
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const clearFieldErrors = (fieldName: string) => {
    delete errors.value[fieldName]
  }

  const setFieldValue = (fieldName: string, value: any) => {
    values.value[fieldName] = value
    validateFieldDebounced(fieldName)
  }

  const resetForm = () => {
    values.value = initialValues || Object.keys(config).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
    clearErrors()
  }

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    clearFieldErrors,
    setFieldValue,
    values,
    resetForm
  }
}
