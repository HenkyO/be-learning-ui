<template>
  <div class="space-y-8 animate-fade-in-up pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 mt-4">
    <div class="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10 border-b border-slate-100 pb-8">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div>
            <h2 class="text-3xl font-black text-slate-900 tracking-tight">Manajemen Pengguna & Akses</h2>
            <p class="text-slate-500 mt-2 text-sm font-medium">Tetapkan hak akses (Role) atau reset sesi ujian (Attempts) milik pegawai.</p>
          </div>
        </div>

        <div class="relative w-full md:w-72">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery" 
            @keyup.enter="handleSearch"
            placeholder="Cari Nama atau NIP..." 
            class="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-bssn-cyan focus:ring-4 focus:ring-bssn-cyan/10 outline-none transition-all shadow-sm"
          >
        </div>
      </div>

      <div class="overflow-x-auto relative z-10 border border-slate-200 rounded-2xl shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50">
            <tr class="border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-widest">
              <th class="p-5">Pegawai</th>
              <th class="p-5">Status Hak Akses</th>
              <th class="p-5 text-right">Tindakan Khusus</th>
            </tr>
          </thead>
          
          <tbody v-if="loadingUsers" class="bg-white">
            <tr>
              <td colspan="3" class="p-10 text-center">
                <svg class="animate-spin h-8 w-8 text-bssn-cyan mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="text-sm font-bold text-slate-500 mt-3">Memuat data pegawai...</p>
              </td>
            </tr>
          </tbody>

          <tbody v-else-if="users.length === 0" class="bg-white">
            <tr>
              <td colspan="3" class="p-10 text-center text-sm font-bold text-slate-500">
                Tidak ada data pegawai yang ditemukan.
              </td>
            </tr>
          </tbody>

          <tbody v-else class="text-sm font-medium text-slate-700 bg-white divide-y divide-slate-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-5">
                <p class="font-black text-slate-900 text-base mb-0.5">{{ user.full_name }}</p>
                <p class="text-xs text-slate-500 font-bold">{{ user.nip }}</p>
              </td>
              <td class="p-5">
                <select v-model="user.role" class="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all cursor-pointer">
                  <option value="Pegawai">Pegawai (Peserta Didik)</option>
                  <option value="Mentor">Mentor (Pengajar)</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </td>
              <td class="p-5 text-right flex items-center justify-end gap-3">
                <button @click="openProgressModal(user)" class="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  Lihat / Reset Progres
                </button>
                <button @click="updateRole(user.id, user.role)" class="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors">
                  Simpan Role
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-bold text-slate-500">
        <p>Menampilkan <span class="text-slate-900">{{ (currentPage - 1) * itemsPerPage + (users.length > 0 ? 1 : 0) }}</span> hingga <span class="text-slate-900">{{ (currentPage - 1) * itemsPerPage + users.length }}</span> dari <span class="text-slate-900">{{ totalUsers }}</span> pegawai</p>
        
        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="currentPage === 1 || loadingUsers" class="px-4 py-2 border-2 border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors">
            Sebelumnya
          </button>
          <div class="px-4 py-2 bg-slate-100 rounded-xl text-slate-900">
            Hal {{ currentPage }} / {{ totalPages || 1 }}
          </div>
          <button @click="nextPage" :disabled="currentPage >= totalPages || loadingUsers" class="px-4 py-2 border-2 border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors">
            Selanjutnya
          </button>
        </div>
      </div>
      
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 class="text-xl font-black text-slate-900">Progres: {{ selectedUser?.full_name }}</h3>
            <p class="text-xs font-bold text-slate-500 mt-1">Daftar percobaan ujian untuk setiap materi</p>
          </div>
          <button @click="showModal = false" class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-sm transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-8 max-h-[60vh] overflow-y-auto">
          <div v-if="loadingProgress" class="text-center py-10 font-bold text-slate-500">Memuat data...</div>
          <div v-else-if="userProgressList.length === 0" class="text-center py-10 font-bold text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
            Pegawai ini belum memulai modul apapun.
          </div>
          <div v-else class="space-y-4">
            <div v-for="prog in userProgressList" :key="prog.id" class="p-5 border-2 border-slate-100 rounded-2xl flex items-center justify-between group hover:border-slate-200 transition-colors">
              <div>
                <p class="font-bold text-slate-900 text-sm mb-1">{{ prog.modules?.title }}</p>
                <div class="flex items-center gap-3 text-xs">
                  <span :class="prog.status === 'Selesai' ? 'text-green-600 font-black' : 'text-slate-500 font-bold'">{{ prog.status }}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span :class="prog.attempts >= 2 ? 'text-red-500 font-black' : 'text-slate-500 font-bold'">Percobaan: {{ prog.attempts }} / 2</span>
                </div>
              </div>
              
              <button v-if="prog.attempts > 0" @click="resetAttempts(prog.id, prog.modules?.title)" :disabled="isResetting"
                class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-colors disabled:opacity-50 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Reset Percobaan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from '../../lib/supabaseClient'

// State Pengguna & Paginasi
const users = ref<any[]>([])
const loadingUsers = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10) // Limit jumlah data per halaman
const totalUsers = ref(0)

// State Modal
const showModal = ref(false)
const selectedUser = ref<any>(null)
const userProgressList = ref<any[]>([])
const loadingProgress = ref(false)
const isResetting = ref(false)

// Kalkulasi Total Halaman
const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage.value))

// ==========================================
// FUNGSI: TARIK DATA PENGGUNA (PAGINASI & SEARCH)
// ==========================================
const fetchUsers = async () => {
  loadingUsers.value = true
  try {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' }) // Meminta Supabase menghitung total baris

    // Implementasi Filter Pencarian
    if (searchQuery.value.trim() !== '') {
      query = query.or(`full_name.ilike.%${searchQuery.value}%,nip.ilike.%${searchQuery.value}%`)
    }

    // Kalkulasi Range Paginasi
    const from = (currentPage.value - 1) * itemsPerPage.value
    const to = from + itemsPerPage.value - 1

    query = query.order('role', { ascending: true })
                 .order('created_at', { ascending: false })
                 .range(from, to)

    const { data, count, error } = await query

    if (error) throw error
    
    users.value = data || []
    totalUsers.value = count || 0

  } catch (error: any) {
    console.error('Galat memuat pengguna:', error.message)
  } finally {
    loadingUsers.value = false
  }
}

// Navigasi Paginasi
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchUsers()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchUsers()
  }
}

// Reset ke halaman 1 setiap kali mencari
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

// Opsional: Real-time search dengan delay (Watch)
let searchTimeout: any = null
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleSearch()
  }, 500) // Delay 500ms agar tidak memborbardir database saat mengetik
})


// ==========================================
// FUNGSI: UPDATE ROLE & MANAJEMEN PROGRES
// ==========================================
const updateRole = async (id: string, newRole: string) => {
  try {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    if (error) throw error
    alert('Sukses: Hak akses diperbarui!')
  } catch (error: any) { 
    alert('Gagal: ' + error.message) 
  }
}

const openProgressModal = async (user: any) => {
  selectedUser.value = user
  showModal.value = true
  loadingProgress.value = true
  
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*, modules(title)')
      .eq('user_id', user.id)
    if (error) throw error
    userProgressList.value = data || []
  } catch (error) { 
    console.error(error) 
  } finally { 
    loadingProgress.value = false 
  }
}

const resetAttempts = async (progressId: string, moduleTitle: string) => {
  if (!window.confirm(`Yakin ingin mereset percobaan untuk materi "${moduleTitle}"?\nIni akan memungkinkan pegawai mengulang ujian.`)) return
  
  isResetting.value = true
  try {
    const { error } = await supabase
      .from('user_progress')
      .update({ attempts: 0, status: 'Sedang Dipelajari' }) 
      .eq('id', progressId)
      
    if (error) throw error
    
    // Refresh list lokal
    const p = userProgressList.value.find(x => x.id === progressId)
    if (p) { 
      p.attempts = 0; 
      p.status = 'Sedang Dipelajari' 
    }
    
  } catch (error: any) { 
    alert('Galat mereset: ' + error.message) 
  } finally { 
    isResetting.value = false 
  }
}

onMounted(() => fetchUsers())
</script>