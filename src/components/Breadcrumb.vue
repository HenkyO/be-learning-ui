<template>
  <nav class="text-sm mb-4">
    <ol class="flex flex-wrap items-center gap-0">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <!-- Breadcrumb Item -->
        <router-link
          v-if="item.path"
          :to="item.path"
          class="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          {{ item.label }}
        </router-link>
        <span v-else class="text-slate-900 font-semibold">
          {{ item.label }}
        </span>

        <!-- Separator (show for all items except the last) -->
        <span v-if="index < items.length - 1" class="text-slate-400 px-2">
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  path?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<style scoped>
/* Smooth transitions for hover states */
:deep(a) {
  @apply transition-colors duration-200;
}
</style>
