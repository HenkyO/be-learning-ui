<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Mobile Navigation Menu -->
    <MobileMenu
      :navigationItems="navigation"
      :userRole="authStore.userProfile?.role || 'Pegawai'"
      :onLogout="handleLogout"
    />
    
    <aside class="w-72 bg-slate-900 text-white flex flex-col hidden md:flex fixed h-full z-20 shadow-2xl">
      <div class="h-24 flex items-center px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div class="w-10 h-10 bg-bssn-cyan rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-cyan-900/50">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <h1 class="text-xl font-black tracking-tight text-white">BSrE <span class="text-bssn-cyan">LMS</span></h1>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pusat Sertifikasi</p>
        </div>
      </div>

      <nav class="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p class="px-4 text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Menu Utama</p>
        
        <template v-for="item in navigation" :key="item.name">
          <router-link v-if="hasAccess(item.roles)" :to="item.href" 
            class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group"
            active-class="bg-bssn-cyan text-white shadow-lg shadow-cyan-900/20"
            :class="[$route.path === item.href ? '' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
            <div v-html="item.icon" class="w-5 h-5 transition-transform group-hover:scale-110"></div>
            {{ item.name }}
          </router-link>
        </template>
      </nav>

      <div class="p-4 border-t border-slate-800 bg-slate-900/50">
        <button @click="handleLogout" class="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 font-bold rounded-xl text-sm transition-all shadow-sm group">
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Akhiri Sesi
        </button>
      </div>
    </aside>

    <main class="flex-1 md:ml-72 flex flex-col min-h-screen relative">
      
      <header class="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex flex-col justify-center px-6 sm:px-10 sticky top-0 z-10 shadow-sm">
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-black text-slate-800 hidden sm:block">{{ currentRouteName }}</h2>
          </div>

          <div class="flex items-center gap-4">
            <div class="hidden sm:block text-right">
              <p class="text-sm font-black text-slate-900">{{ authStore.userProfile?.full_name || 'Memuat Data...' }}</p>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ authStore.userProfile?.role || 'Pegawai' }}</p>
            </div>
            
            <div @click="$router.push('/profile')" class="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg shadow-slate-900/20 border-2 border-white ring-2 ring-slate-100 cursor-pointer hover:scale-105 transition-transform" title="Buka Profil Pengguna">
              {{ userInitials }}
            </div>
          </div>
        </div>
        
        <!-- Breadcrumb Navigation -->
        <Breadcrumb v-if="breadcrumbItems.length > 0" :items="breadcrumbItems" class="mt-2" />
      </header>

      <div class="p-6 sm:p-10 flex-1 overflow-x-hidden">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import MobileMenu from '../components/MobileMenu.vue'
import Breadcrumb from '../components/Breadcrumb.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const currentRouteName = computed(() => route.name)

// Breadcrumb configuration based on routes
const breadcrumbItems = computed(() => {
  const breadcrumbs: Array<{ label: string; path?: string }> = []
  
  breadcrumbs.push({ label: 'Dashboard', path: '/' })
  
  if (route.path === '/learning-path') {
    breadcrumbs.push({ label: 'Kurikulum PKI' })
  } else if (route.path.startsWith('/management/course')) {
    breadcrumbs.push({ label: 'Manajemen Modul' })
  } else if (route.path.startsWith('/management/user')) {
    breadcrumbs.push({ label: 'Manajemen Pengguna' })
  } else if (route.path === '/profile') {
    breadcrumbs.push({ label: 'Profil Pengguna' })
  } else if (route.path.startsWith('/quiz')) {
    breadcrumbs.push({ label: 'Penilaian' })
    if (route.name === 'Quiz') {
      breadcrumbs.push({ label: 'Kuis' })
    }
  } else if (route.path.startsWith('/knowledge-base') || route.path.startsWith('/pdf-viewer')) {
    breadcrumbs.push({ label: 'Basis Pengetahuan' })
  }
  
  return breadcrumbs
})

// Logika Kalkulasi Inisial Secara Otomatis
const userInitials = computed(() => {
  const name = authStore.userProfile?.full_name
  if (!name) return '?'
  
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

// Matriks Otorisasi Akses Menu
const navigation = [
  { 
    name: 'Dashboard Admin', 
    href: '/', 
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>', 
    roles: ['Administrator'] 
  },
  { 
    name: 'Kurikulum PKI', 
    href: '/learning-path', 
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>', 
    roles: ['Administrator', 'Mentor', 'Pegawai'] 
  },
  { 
    name: 'Manajemen Modul', 
    href: '/management/course', 
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>', 
    roles: ['Administrator', 'Mentor'] 
  },
  { 
    name: 'Manajemen Pengguna', 
    href: '/management/user', 
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>', 
    roles: ['Administrator'] 
  }
]

// Fungsi untuk mengecek apakah user boleh melihat menu tersebut
const hasAccess = (allowedRoles: string[]) => {
  const currentRole = authStore.userProfile?.role
  if (!currentRole) return false // Sembunyikan menu jika profil belum dimuat
  return allowedRoles.includes(currentRole)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>