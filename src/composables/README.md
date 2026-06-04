# Vue 3 Composables

Reusable composition API composables for the BeLearning UI.

## useFormValidation

A comprehensive, reusable form validation composable for Vue 3 applications with support for multiple validation rules, real-time validation with debouncing, and user-friendly error messages.

### Features

- ✅ Reactive validation state for form fields
- ✅ Support for multiple validation rules per field
- ✅ Real-time validation with 300ms debounce
- ✅ Multiple error messages per field
- ✅ Built-in validators: email, required, minLength, maxLength, pattern
- ✅ Custom validation function support
- ✅ Single field and batch validation
- ✅ Error clearing and form reset capabilities

### Basic Usage

```typescript
import { useFormValidation } from '@/composables/useFormValidation'

export default {
  setup() {
    const { errors, validate, setFieldValue, values } = useFormValidation({
      email: { required: true, email: true },
      password: { required: true, minLength: 8 }
    })

    const handleSubmit = () => {
      if (validate()) {
        console.log('Form submitted:', values.value)
      }
    }

    return { errors, setFieldValue, values, handleSubmit }
  }
}
```

### API Reference

#### `useFormValidation(config, initialValues?)`

**Parameters:**

- `config` (ValidationConfig): Configuration object defining validation rules for each field
- `initialValues` (FieldValues, optional): Initial values for form fields

**Returns:**

```typescript
{
  errors: Ref<FieldErrors>,           // Reactive object with field errors (keyed by field name)
  values: Ref<FieldValues>,           // Reactive object with current field values
  validate: () => boolean,            // Validate all fields, returns true if valid
  validateField: (fieldName: string) => boolean, // Validate single field
  setFieldValue: (fieldName, value) => void,    // Update field value with debounced validation
  clearErrors: () => void,            // Clear all errors
  clearFieldErrors: (fieldName) => void, // Clear errors for specific field
  resetForm: () => void               // Reset form to initial values and clear errors
}
```

### Validation Rules

#### Built-in Validators

```typescript
{
  fieldName: {
    required: true,           // Field cannot be empty
    email: true,              // Valid email format required
    minLength: 8,             // Minimum character length
    maxLength: 50,            // Maximum character length
    pattern: /^[a-z]+$/,      // RegExp pattern match
    custom: (value) => {...}  // Custom validation function
  }
}
```

#### Custom Validation

Custom validators can return:
- `true`: validation passes
- `false`: validation fails with default message
- `string`: validation fails with custom error message

```typescript
{
  password: {
    custom: (value: string) => {
      const hasUpper = /[A-Z]/.test(value)
      const hasLower = /[a-z]/.test(value)
      const hasNumber = /[0-9]/.test(value)

      if (!hasUpper || !hasLower || !hasNumber) {
        return 'Password must contain uppercase, lowercase, and numbers'
      }
      return true
    }
  }
}
```

### Usage Examples

#### Example 1: Login Form

```typescript
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input
        v-model="values.email"
        @input="setFieldValue('email', $event.target.value)"
        type="email"
        placeholder="Email"
      />
      <span v-if="errors.email" class="error">{{ errors.email[0] }}</span>
    </div>

    <div>
      <input
        v-model="values.password"
        @input="setFieldValue('password', $event.target.value)"
        type="password"
        placeholder="Password"
      />
      <span v-if="errors.password" class="error">{{ errors.password[0] }}</span>
    </div>

    <button type="submit">Login</button>
  </form>
</template>

<script setup lang="ts">
import { useFormValidation } from '@/composables/useFormValidation'

const { errors, validate, setFieldValue, values } = useFormValidation({
  email: { required: true, email: true },
  password: { required: true, minLength: 8 }
})

const handleSubmit = () => {
  if (validate()) {
    // Submit form
    console.log('Logging in with:', values.value)
  }
}
</script>

<style scoped>
.error {
  color: #dc3545;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.25rem;
}
</style>
```

#### Example 2: Registration Form with Complex Validation

```typescript
const { errors, validate, setFieldValue, values } = useFormValidation(
  {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_-]+$/,
      custom: (value: string) => {
        // Check if username already exists (would call API)
        if (reservedUsernames.includes(value)) {
          return 'This username is already taken'
        }
        return true
      }
    },
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minLength: 8,
      custom: (value: string) => {
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
      custom: (value: string) => {
        if (value !== values.value.password) {
          return 'Passwords do not match'
        }
        return true
      }
    },
    agreeTerms: {
      custom: (value: boolean) => {
        if (!value) return 'You must agree to the terms'
        return true
      }
    }
  },
  {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agreeTerms: false
  }
)
```

#### Example 3: Multiple Error Messages

```typescript
<template>
  <div v-if="errors.email" class="error-messages">
    <p v-for="(error, index) in errors.email" :key="index">
      • {{ error }}
    </p>
  </div>
</template>
```

The composable automatically collects all validation errors for a field. For example, if a field fails both `required` and `email` validations, both error messages will be included.

### Debouncing Behavior

The `setFieldValue` method uses debouncing to avoid excessive validation calls:

```typescript
// Validates after 300ms of inactivity
setFieldValue('email', event.target.value)

// Immediate validation (useful for explicit checks)
validateField('email')

// Batch validation (no debounce)
validate()
```

### Form State Management

```typescript
const { values, validate, resetForm, clearErrors } = useFormValidation(config)

// Get all form values
console.log(values.value)

// Validate all fields at once
const isValid = validate()

// Reset to initial state
resetForm()

// Clear all errors without resetting values
clearErrors()
```

### Advanced: Cross-Field Validation

```typescript
const { values, validate, setFieldValue } = useFormValidation({
  startDate: {
    required: true,
    custom: (value: string) => {
      if (new Date(value) > new Date(values.value.endDate)) {
        return 'Start date must be before end date'
      }
      return true
    }
  },
  endDate: {
    required: true,
    custom: (value: string) => {
      if (new Date(value) < new Date(values.value.startDate)) {
        return 'End date must be after start date'
      }
      return true
    }
  }
})
```

### TypeScript Support

Full TypeScript support with type-safe configuration:

```typescript
import { useFormValidation } from '@/composables/useFormValidation'

// Type-safe field access
const { errors, values } = useFormValidation({
  email: { required: true, email: true },
  age: { required: true }
})

// Values are strongly typed
values.value.email // string
values.value.age   // any

// Errors are strongly typed
errors.value.email // string[] | undefined
```

### Performance Considerations

1. **Debouncing**: Real-time validation is debounced at 300ms to prevent excessive validation checks during user input
2. **Selective Validation**: Use `validateField()` for single field validation instead of `validate()` when appropriate
3. **Lazy Validation**: Only validate fields that have been interacted with to improve UX
4. **Custom Validators**: Keep custom validation logic lightweight; avoid heavy operations

### Common Patterns

#### Disable Submit Button While Validating

```typescript
<button :disabled="Object.keys(errors).length > 0">Submit</button>
```

#### Show Validation Status During Input

```typescript
<div class="form-field">
  <input 
    :value="values.email"
    @input="setFieldValue('email', $event.target.value)"
  />
  <span v-if="errors.email" class="error">✗ {{ errors.email[0] }}</span>
  <span v-else-if="values.email" class="success">✓ Valid email</span>
</div>
```

#### Pre-populate and Edit Forms

```typescript
const { values, resetForm } = useFormValidation(config, {
  email: 'user@example.com',
  name: 'John Doe'
})

// Reset to pre-populated values
resetForm()
```

### Error Messages

Default error messages are customizable through the validator functions. The composable includes built-in messages for:

- **required**: "This field is required"
- **email**: "Please enter a valid email address"
- **minLength**: "Minimum length is {n} characters"
- **maxLength**: "Maximum length is {n} characters"
- **pattern**: "Invalid format"
- **custom**: "This field is invalid"

---

For more examples, see `useFormValidation.example.ts`
