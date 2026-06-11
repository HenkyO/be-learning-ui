import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'

export const useCourseStore = defineStore('course', () => {
  const authStore = useAuthStore()

  const modules = ref<any[]>([])
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const error = ref<string | null>(null)

  // Menghitung rata-rata akumulasi progres seluruh modul yang tersedia
  const averageProgress = computed(() => {
    if (modules.value.length === 0) return 0
    const total = modules.value.reduce((sum, mod) => sum + (mod.progress || 0), 0)
    return Math.round(total / modules.value.length)
  })

  // Mengambil jalur pembelajaran (Kombinasi data modul utama dan progres spesifik milik pengguna)
  const fetchLearningPath = async (pathId?: string) => {
    isLoading.value = true
    error.value = null
    try {
      const userId = authStore.user?.id
      if (!userId) throw new Error('Pengguna tidak terautentikasi.')

      // 1. Tarik semua data modul terdaftar
      let query = supabase
        .from('modules')
        .select('id, path_id, title, description, level, prerequisite_module_id, order_index')
        .order('order_index', { ascending: true })
        
      if (pathId) {
        query = query.eq('path_id', pathId)
      }

      const { data: modulesData, error: modulesError } = await query

      if (modulesError) throw modulesError

      // 2. Tarik relasi data progres belajar milik pengguna saat ini
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('module_id, status, progress, attempts')
        .eq('user_id', userId)

      if (progressError) throw progressError

      // 3. Gabungkan struktur data modul dengan progres aktual pengguna untuk konsumsi antarmuka
      modules.value = (modulesData || []).map((mod) => {
        const userProg = (progressData || []).find((p) => p.module_id === mod.id)
        
        return {
          ...mod,
          // Jika rekaman progress belum ada di database, pasang status default awal
          status: userProg ? userProg.status : 'Belum Dimulai',
          progress: userProg ? userProg.progress : 0,
          attempts: userProg ? userProg.attempts : 0
        }
      })
    } catch (err: any) {
      console.error('Gagal mengambil data jalur pembelajaran:', err)
      error.value = err.message || 'Terjadi kesalahan internal koneksi server.'
    } finally {
      isLoading.value = false
    }
  }

  // Menginisialisasi modul baru (Membuat record baris baru pada tabel user_progress)
  const startModule = async (moduleId: string) => {
    isUpdating.value = true
    error.value = null
    try {
      const userId = authStore.user?.id
      if (!userId) throw new Error('Pengguna tidak terautentikasi.')

      // Sisipkan baris progres baru ke dalam database Supabase
      const { error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          module_id: moduleId,
          status: 'Sedang Dipelajari',
          progress: 0,
          attempts: 0
        })

      if (insertError) throw insertError

      // Lakukan pembaruan state lokal untuk menghemat bandwidth (mencegah full hit query ulang)
      const modIndex = modules.value.findIndex((m) => m.id === moduleId)
      if (modIndex !== -1) {
        modules.value[modIndex].status = 'Sedang Dipelajari'
        modules.value[modIndex].progress = 0
      }

      return true
    } catch (err: any) {
      console.error('Gagal memulai modul:', err)
      error.value = err.message || 'Gagal mengamankan penyimpanan progres baru.'
      return false
    } finally {
      isUpdating.value = false
    }
  }

  return {
    modules,
    isLoading,
    isUpdating,
    error,
    averageProgress,
    fetchLearningPath,
    startModule
  }
})