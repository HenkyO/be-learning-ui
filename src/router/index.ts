import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'

// Impor komponen tata letak secara langsung (Eager Loading)
import DashboardLayout from '../layouts/DashboardLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/dashboard/DashboardView.vue')
      },
      {
        path: 'catalog',
        name: 'Catalog',
        component: () => import('../views/learning/CurriculumCatalogView.vue')
      },
      {
        path: 'learning-path/:pathId',
        name: 'LearningPath',
        component: () => import('../views/learning/LearningPathView.vue'),
        props: true
      },
      {
        // PERBAIKAN: Menggunakan parameter dinamis :moduleId untuk mencegah galat penamaan sesi kuis ganda
        path: 'quiz/:moduleId',
        name: 'Quiz',
        component: () => import('../views/assessment/QuizView.vue'),
        props: true
      },
      {
        path: 'knowledge-base',
        name: 'KnowledgeBase',
        component: () => import('../views/knowledge/KnowledgeBaseView.vue')
      },
      {
        path: 'pdf-viewer',
        name: 'PdfViewer',
        component: () => import('../views/knowledge/PdfViewerView.vue')
      },
      {
        path: 'management/course',
        name: 'CourseManagement',
        component: () => import('../views/management/CourseManagerView.vue')
      },
      {
        path: 'management/user',
        name: 'UserManagement',
        component: () => import('../views/management/UserManagementView.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/profile/ProfileView.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/auth/LoginView.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/auth/RegisterView.vue')
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/auth/ForgotPasswordView.vue')
      },
      {
        path: 'update-password',
        name: 'UpdatePassword',
        component: () => import('../views/auth/UpdatePasswordView.vue')
      }
    ]
  },
  {
    // Mengalihkan rute yang tidak dikenal kembali ke halaman utama
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard untuk Manajemen Hak Akses (Authentication & Authorization)
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.user

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Jika rute butuh login tapi pengguna belum terautentikasi, lempar ke halaman login
    next({ name: 'Login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Jika pengguna sudah login tapi mencoba mengakses halaman auth (login/register), kembalikan ke dashboard
    next({ name: 'Dashboard' })
  } else {
    // Lanjutkan navigasi jika memenuhi syarat
    next()
  }
})

// Menangani galat saat file chunk JavaScript gagal dimuat akibat versi baru telah di-deploy
router.onError((error, to) => {
  const isChunkLoadFailed = error.message.includes('Failed to fetch dynamically imported module') || 
                            error.message.includes('Importing a module script failed') ||
                            error.message.includes('text/html')

  if (isChunkLoadFailed) {
    const reloadKey = `route_reload_${to.fullPath}`
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, 'true')
      window.location.assign(to.fullPath)
    } else {
      console.error('Gagal memuat rute meskipun telah dimuat ulang:', error)
      sessionStorage.removeItem(reloadKey)
    }
  }
})

export default router