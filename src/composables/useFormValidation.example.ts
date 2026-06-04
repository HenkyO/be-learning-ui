/**
 * USAGE EXAMPLES for useFormValidation composable
 * 
 * This file demonstrates various use cases for the form validation composable.
 */

import { useFormValidation } from './useFormValidation'

// ============================================================================
// Example 1: Basic login form
// ============================================================================
export function useLoginForm() {
  return useFormValidation({
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minLength: 8
    }
  })
}

// ============================================================================
// Example 2: Registration form with custom validation
// ============================================================================
export function useRegistrationForm() {
  return useFormValidation(
    {
      username: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_-]+$/ // alphanumeric, underscore, dash only
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minLength: 8,
        custom: (value: string) => {
          // Password must contain at least one uppercase, one lowercase, and one number
          const hasUpper = /[A-Z]/.test(value)
          const hasLower = /[a-z]/.test(value)
          const hasNumber = /[0-9]/.test(value)

          if (!hasUpper || !hasLower || !hasNumber) {
            return 'Password must contain uppercase, lowercase, and numbers'
          }
          return true
        }
      },
      passwordConfirm: {
        required: true,
        minLength: 8
      },
      terms: {
        required: true,
        custom: (value: boolean) => {
          if (!value) {
            return 'You must agree to the terms'
          }
          return true
        }
      }
    },
    {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      terms: false
    }
  )
}

// ============================================================================
// Example 3: Profile form with optional fields
// ============================================================================
export function useProfileForm() {
  return useFormValidation(
    {
      firstName: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      lastName: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      bio: {
        maxLength: 500 // optional field
      },
      phone: {
        pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/ // optional but if provided, must be valid
      },
      website: {
        custom: (value: string) => {
          if (!value) return true // optional
          try {
            new URL(value)
            return true
          } catch {
            return 'Please enter a valid URL'
          }
        }
      }
    },
    {
      firstName: '',
      lastName: '',
      bio: '',
      phone: '',
      website: ''
    }
  )
}

// ============================================================================
// Example 4: Product form with cross-field validation
// ============================================================================
export function useProductForm() {
  return useFormValidation(
    {
      name: {
        required: true,
        minLength: 3,
        maxLength: 100
      },
      description: {
        required: true,
        minLength: 10,
        maxLength: 1000
      },
      price: {
        required: true,
        custom: (value: string | number) => {
          const num = parseFloat(String(value))
          if (isNaN(num) || num <= 0) {
            return 'Price must be a positive number'
          }
          if (num > 1000000) {
            return 'Price cannot exceed 1,000,000'
          }
          return true
        }
      },
      quantity: {
        required: true,
        custom: (value: string | number) => {
          const num = parseInt(String(value))
          if (isNaN(num) || num < 0) {
            return 'Quantity must be a non-negative number'
          }
          return true
        }
      },
      category: {
        required: true,
        custom: (value: string) => {
          const validCategories = ['electronics', 'clothing', 'food', 'books']
          if (!validCategories.includes(value)) {
            return 'Please select a valid category'
          }
          return true
        }
      }
    },
    {
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: ''
    }
  )
}

// ============================================================================
// Example 5: Vue component usage
// ============================================================================
/*
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Email field -->
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        v-model="email"
        @input="setFieldValue('email', $event.target.value)"
        :class="{ error: errors.email }"
      />
      <div v-if="errors.email" class="error-messages">
        <p v-for="error in errors.email" :key="error">{{ error }}</p>
      </div>
    </div>

    <!-- Password field -->
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        v-model="password"
        @input="setFieldValue('password', $event.target.value)"
        :class="{ error: errors.password }"
      />
      <div v-if="errors.password" class="error-messages">
        <p v-for="error in errors.password" :key="error">{{ error }}</p>
      </div>
    </div>

    <button type="submit">Login</button>
  </form>
</template>

<script setup lang="ts">
import { useLoginForm } from '@/composables/useFormValidation.example'

const { errors, validate, setFieldValue, values } = useLoginForm()
const email = computed(() => values.value.email)
const password = computed(() => values.value.password)

const handleSubmit = async () => {
  if (validate()) {
    // Form is valid, submit
    console.log('Form data:', values.value)
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input.error {
  border-color: #dc3545;
}

.error-messages {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-messages p {
  margin: 0;
}
</style>
*/
