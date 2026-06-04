<template>
  <div 
    class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
    :class="{ 'hover:shadow-md hover:border-slate-300': hoverable }"
  >
    <!-- Image/Cover Slot -->
    <div v-if="$slots.cover" class="w-full aspect-video bg-slate-100 overflow-hidden">
      <slot name="cover"></slot>
    </div>

    <div class="p-5">
      <!-- Header / Title Area -->
      <div v-if="$slots.header" class="mb-3">
        <slot name="header"></slot>
      </div>

      <!-- Main Content -->
      <div class="text-slate-600 text-sm">
        <slot></slot>
      </div>

      <!-- Footer / Actions -->
      <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hoverable?: boolean
}>()
</script>
