<template>
  <div class="space-y-8 animate-fade-in-up pb-16 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
    
    <div class="bg-slate-900 p-10 lg:p-12 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 mt-4">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-bssn-cyan/20 to-transparent rounded-full -mr-[150px] -mt-[150px] pointer-events-none blur-3xl"></div>
      
      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full text-bssn-cyan text-xs font-extrabold tracking-widest uppercase mb-5 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          Pusat Kendali Kurikulum
        </div>
        <h2 class="text-4xl font-black text-white tracking-tight mb-2">Manajemen <span class="text-transparent bg-clip-text bg-gradient-to-r from-bssn-cyan to-blue-400">Modul & Evaluasi</span></h2>
        <p class="text-slate-400 text-sm font-medium max-w-2xl leading-relaxed">
          Tambah materi pembelajaran baru, perbarui bank soal, atau kelola modul yang sudah ada di sistem pusat.
        </p>
      </div>

      <div class="relative z-10 bg-slate-800/50 backdrop-blur-xl p-2 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row gap-2 shrink-0 shadow-lg">
        <button @click="activeTab = 'add'" 
          :class="[
            'px-6 py-3 rounded-xl text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'add' ? 'bg-bssn-cyan text-white shadow-lg shadow-cyan-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          ]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          {{ editingModuleId ? 'Mode Edit Modul' : 'Tambah Modul' }}
        </button>
        <button @click="switchToListTab" 
          :class="[
            'px-6 py-3 rounded-xl text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'list' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          ]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          Daftar Modul Aktif
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'add'" class="animate-fade-in-up">
      <div class="flex flex-col sm:flex-row items-center justify-end gap-3 mb-6">
        <button v-if="editingModuleId" @click="resetForm" 
          class="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          Batal Edit
        </button>
        <button @click="handleSave" :disabled="isSaving" 
          class="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <svg v-if="isSaving" class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
          {{ isSaving ? uploadStatus : (editingModuleId ? 'Simpan Perubahan' : 'Simpan ke Database') }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6 relative overflow-hidden">
            <div v-if="editingModuleId" class="absolute top-0 inset-x-0 h-1 bg-bssn-cyan"></div>
            <h3 class="text-xl font-black text-slate-800 border-b border-slate-100 pb-4">Informasi Kurikulum</h3>
            
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Tingkatan Kompetensi</label>
              <select v-model="courseLevel" class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
                <option value="Basic">Level 1 - Basic (Konsep Dasar PKI, Trust)</option>
                <option value="Intermediate">Level 2 - Intermediate (Sistem CA, RA, OCSP)</option>
                <option value="Advanced">Level 3 - Advanced (Manajemen HSM, Remote Signing)</option>
              </select>
            </div>
            
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Judul Materi</label>
              <input type="text" v-model="courseTitle" placeholder="Ketik judul modul..." 
                class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Deskripsi Singkat</label>
              <textarea rows="4" v-model="courseDescription" placeholder="Jelaskan tujuan pembelajaran materi ini..." 
                class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all"></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Dokumen Fisik</label>
              <div v-if="editingModuleId && existingStoragePath && existingStoragePath !== 'pending-upload-storage'" class="mb-3 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-bold border border-cyan-100 flex items-center justify-between">
                <span>Materi saat ini sudah terlampir.</span>
                <a :href="existingStoragePath" target="_blank" class="underline hover:text-cyan-900">Lihat File</a>
              </div>

              <div class="relative group border-2 border-slate-200 border-dashed rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-bssn-cyan transition-all flex flex-col items-center justify-center min-h-[140px] cursor-pointer overflow-hidden">
                <input type="file" @change="handleFileSelect" accept=".pdf,video/mp4" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20">
                
                <div v-if="!selectedFile" class="flex flex-col items-center pointer-events-none relative z-10">
                  <div class="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:text-bssn-cyan transition-all">
                    <svg class="w-6 h-6 text-slate-400 group-hover:text-bssn-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  </div>
                  <p class="text-xs text-slate-500 font-bold">{{ editingModuleId ? 'Unggah file baru untuk mengganti' : 'Pilih file PDF atau Video' }}</p>
                  <p class="text-[10px] text-slate-400 mt-1">Maks. 50MB</p>
                </div>
                
                <div v-else class="flex flex-col items-center pointer-events-none relative z-10">
                  <div class="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center mb-3 text-bssn-cyan">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <p class="text-xs text-slate-700 font-black max-w-[200px] truncate">{{ selectedFile.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-5">
              <h3 class="text-xl font-black text-slate-800">Rumusan Bank Soal</h3>
              <button @click="addQuestion" class="text-xs font-black text-bssn-cyan bg-cyan-50 border border-cyan-100 px-4 py-2.5 rounded-xl hover:bg-cyan-100 transition-all flex items-center gap-2 shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                Tambah Soal Baru
              </button>
            </div>

            <div class="space-y-6">
              <div v-for="(q, index) in questions" :key="index" class="bg-slate-50/80 p-8 rounded-2xl border-2 border-slate-100 relative space-y-5 group hover:border-slate-200 transition-colors">
                
                <button v-if="questions.length > 1" @click="removeQuestion(index)" class="absolute top-6 right-6 text-slate-300 hover:text-red-500 bg-white hover:bg-red-50 p-2 rounded-lg border border-slate-100 transition-all shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
                
                <div class="flex items-center gap-3">
                  <span class="bg-slate-900 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">Soal #{{ index + 1 }}</span>
                </div>
                
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Pertanyaan Ujian</label>
                  <textarea v-model="q.text" rows="2" placeholder="Tuliskan deskripsi pertanyaan..." class="w-full border-2 border-slate-200 bg-white rounded-xl py-3 px-4 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all shadow-sm"></textarea>
                </div>

                <div class="space-y-4 pt-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest block">Opsi Jawaban & Kunci</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="opt in ['A', 'B', 'C', 'D']" :key="opt" class="flex items-center gap-3 bg-white p-2 rounded-xl border-2 border-slate-100 focus-within:border-bssn-cyan focus-within:ring-4 focus-within:ring-bssn-cyan/10 transition-all shadow-sm">
                      <input type="radio" :name="'correct_ans_' + index" :value="opt" v-model="q.correct" class="w-5 h-5 text-green-500 focus:ring-green-500 border-slate-300 ml-2 cursor-pointer">
                      <div class="relative w-full flex items-center">
                        <span class="text-xs font-black text-slate-400 w-6 text-center select-none">{{ opt }}</span>
                        <input type="text" v-model="q[opt.toLowerCase() as keyof typeof q]" placeholder="Ketik opsi..." class="w-full py-2 pr-4 bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 outline-none">
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'list'" class="animate-fade-in-up bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
      <div v-if="isFetching" class="flex justify-center items-center py-20">
        <svg class="animate-spin h-10 w-10 text-bssn-cyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>

      <div v-else-if="modulesList.length === 0" class="text-center py-16">
        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        </div>
        <p class="text-slate-500 font-bold">{{ showArchived ? 'Tidak ada modul di dalam arsip.' : 'Basis data modul kosong. Belum ada kurikulum yang ditambahkan.' }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b-2 border-slate-100">
              <th class="p-5 text-xs font-black text-slate-500 uppercase tracking-widest rounded-tl-2xl">Kompetensi</th>
              <th class="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Informasi Materi</th>
              <th class="p-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right rounded-tr-2xl">Tindakan Khusus</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="mod in modulesList" :key="mod.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-5">
                <span :class="[
                  'px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider',
                  mod.level === 'Basic' ? 'bg-green-50 text-green-700 border border-green-100' :
                  mod.level === 'Intermediate' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                  'bg-purple-50 text-purple-700 border border-purple-100'
                ]">{{ mod.level }}</span>
              </td>
              <td class="p-5">
                <h4 class="text-sm font-black text-slate-900 mb-1">{{ mod.title }}</h4>
                <p class="text-xs text-slate-500 font-medium line-clamp-1 max-w-md">{{ mod.description }}</p>
              </td>
              <td class="p-5 text-right flex items-center justify-end gap-2">
                <button @click="startEdit(mod)" class="px-4 py-2 bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 text-blue-600 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  Edit Modul
                </button>
                <button @click="deleteModule(mod)" :disabled="isDeleting" class="px-4 py-2 bg-white border-2 border-red-100 hover:border-red-500 hover:bg-red-50 text-red-500 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../lib/supabaseClient'

const activeTab = ref('add')

// State Form Modul
const editingModuleId = ref<string | null>(null)
const existingStoragePath = ref('')
const courseLevel = ref('Basic')
const courseTitle = ref('')
const courseDescription = ref('')
const isSaving = ref(false)
const uploadStatus = ref('Simpan ke Database')
const selectedFile = ref<File | null>(null)

// State Daftar Modul
const modulesList = ref<any[]>([])
const isFetching = ref(false)
const isDeleting = ref(false)

const questions = ref([
  { text: '', a: '', b: '', c: '', d: '', correct: 'A' }
])

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

const addQuestion = () => questions.value.push({ text: '', a: '', b: '', c: '', d: '', correct: 'A' })
const removeQuestion = (index: number) => questions.value.splice(index, 1)

// ==========================================
// FUNGSI: RESET FORMULIR
// ==========================================
const resetForm = () => {
  editingModuleId.value = null
  courseTitle.value = ''
  courseDescription.value = ''
  courseLevel.value = 'Basic'
  selectedFile.value = null
  existingStoragePath.value = ''
  questions.value = [{ text: '', a: '', b: '', c: '', d: '', correct: 'A' }]
  uploadStatus.value = 'Simpan ke Database'
}

// ==========================================
// FUNGSI: INISIASI MODE EDIT
// ==========================================
const startEdit = async (mod: any) => {
  editingModuleId.value = mod.id
  courseTitle.value = mod.title
  courseDescription.value = mod.description
  courseLevel.value = mod.level
  existingStoragePath.value = mod.storage_path || 'pending-upload-storage'
  selectedFile.value = null

  // Tarik data soal dari database
  const { data: qData } = await supabase.from('questions').select('*').eq('module_id', mod.id)
  if (qData && qData.length > 0) {
    questions.value = qData.map(q => ({
      text: q.question_text,
      a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d,
      correct: q.correct_answer
    }))
  } else {
    questions.value = [{ text: '', a: '', b: '', c: '', d: '', correct: 'A' }]
  }
  
  activeTab.value = 'add'
}

// ==========================================
// FUNGSI: SIMPAN ATAU PERBARUI MODUL
// ==========================================
const handleSave = async () => {
  if (!courseTitle.value || !courseDescription.value) {
    alert('Aksi ditolak: Lengkapi Judul dan Deskripsi.')
    return
  }

  for (const [i, q] of questions.value.entries()) {
    if (!q.text || !q.a || !q.b || !q.c || !q.d) {
      alert(`Validasi Gagal: Soal #${i + 1} belum lengkap.`)
      return
    }
  }

  isSaving.value = true
  // Gunakan storage lama sebagai default jika sedang mode Edit
  let finalFileUrl = editingModuleId.value ? existingStoragePath.value : 'pending-upload-storage' 

  try {
    // 1. Eksekusi Upload File (Hanya jika ada file baru yang dipilih)
    if (selectedFile.value) {
      uploadStatus.value = 'Mengunggah Media...'
      const fileExt = selectedFile.value.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('course-media').upload(fileName, selectedFile.value)
      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('course-media').getPublicUrl(fileName)
      finalFileUrl = publicUrlData.publicUrl
    }

    uploadStatus.value = 'Menulis Database...'
    
    let moduleIdToUse = editingModuleId.value

    if (editingModuleId.value) {
      // LOGIKA UPDATE: Perbarui modul yang ada tanpa merusak relasi
      const { error: updateError } = await supabase.from('modules').update({
        title: courseTitle.value,
        level: courseLevel.value,
        description: courseDescription.value,
        storage_path: finalFileUrl
      }).eq('id', editingModuleId.value)
      
      if (updateError) throw updateError

      // Hapus soal lama dan ganti dengan form soal yang baru direvisi (aman untuk progres)
      await supabase.from('questions').delete().eq('module_id', editingModuleId.value)

    } else {
      // LOGIKA INSERT: Buat modul baru
      const { data: moduleData, error: moduleError } = await supabase.from('modules').insert([{
        title: courseTitle.value,
        level: courseLevel.value,
        description: courseDescription.value,
        storage_path: finalFileUrl
      }]).select().single()
      
      if (moduleError) throw moduleError
      moduleIdToUse = moduleData.id
    }

    // 3. Masukkan Bank Soal
    const questionsToInsert = questions.value.map(q => ({
      module_id: moduleIdToUse,
      question_text: q.text,
      option_a: q.a, option_b: q.b, option_c: q.c, option_d: q.d,
      correct_answer: q.correct
    }))

    const { error: questionsError } = await supabase.from('questions').insert(questionsToInsert)
    if (questionsError) throw questionsError

    alert(editingModuleId.value ? 'Modul berhasil diperbarui!' : 'Sukses! Modul baru berhasil direkam.')
    resetForm()
    
    if (editingModuleId.value) {
      switchToListTab() // Kembali ke daftar jika selesai edit
    }

  } catch (error: any) {
    alert('Gagal memproses data: ' + error.message)
  } finally {
    isSaving.value = false
    uploadStatus.value = 'Simpan ke Database'
  }
}

// ==========================================
// FUNGSI: TARIK DAFTAR MODUL
// ==========================================
const switchToListTab = () => {
  activeTab.value = 'list'
  fetchModules()
}

const fetchModules = async () => {
  isFetching.value = true
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .neq('is_deleted', true)
      .order('created_at', { ascending: false })
      
    if (error) throw error
    modulesList.value = data || []
  } catch (error) {
    console.error("Galat memuat daftar:", error)
  } finally {
    isFetching.value = false
  }
}

// ==========================================
// FUNGSI: HAPUS MODUL (SOFT DELETE)
// ==========================================
const deleteModule = async (mod: any) => {
  if (!window.confirm(`Yakin ingin mengarsipkan modul "${mod.title}"?\nModul akan disembunyikan, tetapi rekam jejak kelulusan pegawai akan tetap tersimpan.`)) return

  isDeleting.value = true
  try {
    // Soft delete: flag as deleted instead of dropping records
    const { error } = await supabase
      .from('modules')
      .update({ is_deleted: true })
      .eq('id', mod.id)

    if (error) throw error

    alert('Modul telah diarsipkan.')
    fetchModules()
  } catch (error: any) {
    alert('Galat mengarsipkan modul: ' + error.message)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
</style>