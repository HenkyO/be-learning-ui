// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabaseClient'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'Otentikasi', component: () => import('../views/auth/LoginView.vue') },
      { path: 'register', name: 'Registrasi', component: () => import('../views/auth/RegisterView.vue') },
      { path: 'forgot-password', name: 'Lupa Password', component: () => import('../views/auth/ForgotPasswordView.vue') },
      { path: 'update-password', name: 'Perbarui Kata Sandi', component: () => import('../views/auth/UpdatePasswordView.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('../layouts/DashboardLayout.vue'),
    children: [
      { path: 'dashboard', name: 'Dashboard Admin', component: () => import('../views/dashboard/DashboardView.vue') },
      { path: 'learning-path', name: 'Kurikulum PKI', component: () => import('../views/learning/LearningPathView.vue') },
      { path: 'knowledge-base', name: 'Knowledge Base', component: () => import('../views/knowledge/KnowledgeBaseView.vue') },
      { path: 'pdf-viewer', name: 'Pembaca Dokumen', component: () => import('../views/knowledge/PdfViewerView.vue') },
      { path: 'assessment', name: 'Evaluasi Kompetensi', component: () => import('../views/assessment/QuizView.vue') },
      { path: 'management', name: 'Manajemen Modul', component: () => import('../views/management/CourseManagerView.vue') },
      { path: 'users', name: 'Manajemen Pengguna', component: () => import('../views/management/UserManagementView.vue') },
      { path: 'profile', name: 'Profil Pengguna', component: () => import('../views/profile/ProfileView.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Logika Proteksi Rute Terintegrasi RBAC (Role-Based Access Control)
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // 1. Pastikan sesi login ditarik dari Supabase saat muat ulang halaman
  if (!authStore.isAuthenticated) {
    await authStore.initializeSession()
  }

  const isAuthenticated = authStore.isAuthenticated
  const publicPages = ['Otentikasi', 'Registrasi', 'Lupa Password']
  const authRequired = !publicPages.includes(to.name as string)

  // 2. Proteksi Dasar: Lempar ke Login jika belum masuk
  if (authRequired && !isAuthenticated) {
    return next({ name: 'Otentikasi' })
  } 
  
  // 3. Proteksi Dasar: Lempar ke Kurikulum jika sudah masuk tapi mencoba buka halaman Login
  if (!authRequired && isAuthenticated) {
    return next({ name: 'Kurikulum PKI' })
  }

  // 4. Proteksi Elevasi Tingkat Lanjut (RBAC) untuk rute sensitif
  if (isAuthenticated && authStore.user?.id) {
    // Daftar rute yang haram diakses oleh Pegawai biasa
    const restrictedRoutes = ['Manajemen Modul', 'Manajemen Pengguna', 'Dashboard Admin']
    
    if (restrictedRoutes.includes(to.name as string)) {
      try {
        // Cek secara real-time ke database apa jabatan asli user ini
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authStore.user.id)
          .single()

        if (error || !data) throw new Error('Data profil tidak ditemukan')

        // Aturan matriks akses
        const role = data.role
        const isTryingToAccessUsers = to.name === 'Manajemen Pengguna'
        const isTryingToAccessAdminRoutes = restrictedRoutes.includes(to.name as string)

        // Hanya Administrator yang boleh buka Manajemen Pengguna
        if (isTryingToAccessUsers && role !== 'Administrator') {
          return next({ name: 'Kurikulum PKI' })
        }
        
        // Pegawai tidak boleh buka halaman Manajemen/Dashboard sama sekali
        if (role === 'Pegawai' && isTryingToAccessAdminRoutes) {
          return next({ name: 'Kurikulum PKI' })
        }
      } catch (err) {
        console.error("RBAC Security Alert:", err)
        return next({ name: 'Kurikulum PKI' })
      }
    }
  }

  // 5. Loloskan jika semua pemeriksaan aman
  next()
})

export default router