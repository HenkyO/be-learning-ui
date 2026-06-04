<template>
  <div class="w-full" :aria-valuenow="clampedProgress" aria-valuemin="0" aria-valuemax="100" role="progressbar">
    <div v-if="showLabel" class="flex justify-between items-center mb-1.5">
      <span class="text-sm font-medium text-slate-700">
        <slot name="label">{{ label }}</slot>
      </span>
      <span class="text-sm font-semibold text-slate-900">{{ clampedProgress }}%</span>
    </div>
    
    <div 
      class="w-full bg-slate-100 rounded-full overflow-hidden" 
      :class="[heightClass]"
    >
      <div 
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="[colorClass]"
        :style="{ width: `${clampedProgress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  progress: number
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
}>(), {
  progress: 0,
  label: 'Progress',
  showLabel: false,
  size: 'md',
  color: 'primary'
})

// Ensure progress is always between 0 and 100
const clampedProgress = computed(() => {
  return Math.min(Math.max(Math.round(props.progress), 0), 100)
})

// Dynamic height based on size prop
const heightClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-1.5'
    case 'lg': return 'h-4'
    case 'md': 
    default: return 'h-2.5'
  }
})

// Dynamic color class mapping based on Tailwind
const colorClass = computed(() => {
  switch (props.color) {
    case 'success': return 'bg-emerald-500'
    case 'warning': return 'bg-amber-500'
    case 'danger': return 'bg-rose-500'
    case 'primary': 
    default: return 'bg-blue-600' // Assuming blue as default primary
  }
})
</script>
