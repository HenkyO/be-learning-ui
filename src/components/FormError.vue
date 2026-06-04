<template>
  <transition name="fade">
    <div
      v-if="hasErrors"
      :class="[
        'rounded-lg border p-4 mb-4',
        'bg-red-50 border-red-200 text-red-700'
      ]"
      role="alert"
    >
      <div class="flex items-start justify-between gap-3">
        <!-- Icon and Message -->
        <div class="flex items-start gap-3">
          <!-- Error Icon -->
          <div class="flex-shrink-0 w-5 h-5 mt-0.5 text-red-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>

          <!-- Messages Container -->
          <div class="flex-1">
            <!-- Single Message or Primary Message -->
            <p v-if="displayMessages.length > 0" class="text-sm font-medium">
              {{ displayMessages[0] }}
            </p>

            <!-- Additional Messages as Badges -->
            <div
              v-if="displayMessages.length > 1"
              class="flex flex-wrap gap-2 mt-2"
            >
              <span
                v-for="(msg, index) in displayMessages.slice(1)"
                :key="index"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                {{ msg }}
              </span>
            </div>
          </div>
        </div>

        <!-- Dismiss Button -->
        <button
          v-if="dismissible"
          @click="handleDismiss"
          class="flex-shrink-0 text-red-600 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss error"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message?: string | string[]
  type?: 'error' | 'warning' | 'info'
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  dismissible: false
})

const emit = defineEmits<{
  dismiss: []
}>()

const displayMessages = computed(() => {
  if (!props.message) return []
  if (Array.isArray(props.message)) {
    return props.message.filter(msg => msg && msg.trim())
  }
  return props.message.trim() ? [props.message] : []
})

const hasErrors = computed(() => displayMessages.value.length > 0)

const handleDismiss = () => {
  emit('dismiss')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
