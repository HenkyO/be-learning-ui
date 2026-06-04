<template>
  <div class="fixed bottom-0 right-0 z-50 p-6 space-y-3 max-w-md pointer-events-none">
    <transition-group name="toast" tag="div" class="space-y-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'p-4 rounded-lg shadow-lg border backdrop-blur-md pointer-events-auto',
          'animate-slideIn transition-all duration-300',
          toast.type === 'success' && 'bg-green-50 border-green-200 text-green-800',
          toast.type === 'error' && 'bg-red-50 border-red-200 text-red-800',
          toast.type === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-800',
          toast.type === 'info' && 'bg-blue-50 border-blue-200 text-blue-800'
        ]"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div :class="[
              'flex-shrink-0 w-5 h-5 mt-0.5',
              toast.type === 'success' && 'text-green-600',
              toast.type === 'error' && 'text-red-600',
              toast.type === 'warning' && 'text-yellow-600',
              toast.type === 'info' && 'text-blue-600'
            ]">
              <svg v-if="toast.type === 'success'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg v-else-if="toast.type === 'error'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <svg v-else-if="toast.type === 'warning'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0-11a9 9 0 110 18 9 9 0 010-18z"></path>
              </svg>
              <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>

            <!-- Message -->
            <div class="flex-1">
              <p class="text-sm font-medium">{{ toast.message }}</p>
            </div>
          </div>

          <!-- Close Button -->
          <button
            @click="notificationStore.removeToast(toast.id)"
            class="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Action Button -->
        <div v-if="toast.action" class="mt-3 flex gap-2">
          <button
            @click="() => { toast.action!.callback(); notificationStore.removeToast(toast.id) }"
            class="text-xs font-semibold px-3 py-1 rounded-lg"
            :class="[
              toast.type === 'success' && 'bg-green-200 hover:bg-green-300 text-green-900',
              toast.type === 'error' && 'bg-red-200 hover:bg-red-300 text-red-900',
              toast.type === 'warning' && 'bg-yellow-200 hover:bg-yellow-300 text-yellow-900',
              toast.type === 'info' && 'bg-blue-200 hover:bg-blue-300 text-blue-900'
            ]"
          >
            {{ toast.action.label }}
          </button>
        </div>

        <!-- Progress Bar -->
        <div v-if="toast.duration && toast.duration > 0" class="mt-2 h-1 rounded-full overflow-hidden" :class="[
          toast.type === 'success' && 'bg-green-200',
          toast.type === 'error' && 'bg-red-200',
          toast.type === 'warning' && 'bg-yellow-200',
          toast.type === 'info' && 'bg-blue-200'
        ]">
          <div
            :class="[
              'h-full',
              toast.type === 'success' && 'bg-green-600',
              toast.type === 'error' && 'bg-red-600',
              toast.type === 'warning' && 'bg-yellow-600',
              toast.type === 'info' && 'bg-blue-600'
            ]"
            :style="{
              animation: `shrink ${toast.duration || 3000}ms linear`
            }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '../stores/notificationStore'

const notificationStore = useNotificationStore()
const toasts = computed(() => Array.from(notificationStore.toasts.values()))
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
