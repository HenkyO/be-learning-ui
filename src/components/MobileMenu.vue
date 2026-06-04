<template>
  <div>
    <!-- Hamburger Button - Mobile Only -->
    <button
      @click="isOpen = true"
      class="md:hidden fixed top-0 left-0 m-4 z-30 p-2 rounded-lg hover:bg-slate-100 transition-colors"
      title="Buka Menu"
    >
      <svg
        class="w-6 h-6 text-slate-900"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Overlay Backdrop -->
    <Transition name="backdrop">
      <div
        v-if="isOpen"
        @click="isOpen = false"
        class="fixed inset-0 bg-black/50 md:hidden z-25"
      />
    </Transition>

    <!-- Mobile Navigation Drawer -->
    <Transition name="slide">
      <aside
        v-if="isOpen"
        ref="drawerRef"
        class="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col md:hidden z-30 shadow-2xl"
      >
        <!-- Header with Logo -->
        <div class="h-24 flex items-center px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <div class="w-10 h-10 bg-bssn-cyan rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-cyan-900/50">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-black tracking-tight text-white">BSrE <span class="text-bssn-cyan">LMS</span></h1>
            <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Pusat Sertifikasi</p>
          </div>

          <!-- Close Button -->
          <button
            @click="isOpen = false"
            class="ml-auto p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Tutup Menu"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p class="px-4 text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Menu Utama</p>

          <template v-for="item in navigationItems" :key="item.name">
            <router-link
              v-if="hasAccess(item.roles)"
              :to="item.href"
              @click="handleMenuItemClick"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all group"
              active-class="bg-bssn-cyan text-white shadow-lg shadow-cyan-900/20"
              :class="[$route.path === item.href ? '' : 'text-slate-400 hover:bg-slate-800 hover:text-white']"
            >
              <div v-html="item.icon" class="w-5 h-5 transition-transform group-hover:scale-110"></div>
              <span>{{ item.name }}</span>
            </router-link>
          </template>
        </nav>

        <!-- Logout Button -->
        <div class="p-4 border-t border-slate-800 bg-slate-900/50">
          <button
            @click="handleLogout"
            class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 font-bold rounded-lg text-sm transition-all shadow-sm group"
          >
            <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Akhiri Sesi
          </button>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface NavigationItem {
  name: string
  href: string
  icon: string
  roles: string[]
}

interface Props {
  navigationItems: NavigationItem[]
  userRole?: string
  onLogout: () => void
}

const props = withDefaults(defineProps<Props>(), {
  userRole: 'Pegawai'
})

const emit = defineEmits<{
  'menu-item-click': [item: NavigationItem]
  'logout-click': []
}>()
const isOpen = ref(false)
const drawerRef = ref<HTMLElement | null>(null)

// Close drawer when pressing Escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

// Close drawer when clicking outside of it
const handleClickOutside = (event: MouseEvent) => {
  if (drawerRef.value && !drawerRef.value.contains(event.target as Node)) {
    const target = event.target as HTMLElement
    // Don't close if clicking on the hamburger button
    if (!target.closest('button[title="Buka Menu"]')) {
      isOpen.value = false
    }
  }
}

// Check if user has access to a menu item
const hasAccess = (allowedRoles: string[]) => {
  return allowedRoles.includes(props.userRole)
}

// Handle menu item click
const handleMenuItemClick = () => {
  // Auto-close drawer after navigation
  setTimeout(() => {
    isOpen.value = false
  }, 100)
}

// Handle logout
const handleLogout = () => {
  isOpen.value = false
  emit('logout-click')
  props.onLogout()
}

// Watch for route changes and close drawer
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Slide animation for drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Backdrop fade animation */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>
