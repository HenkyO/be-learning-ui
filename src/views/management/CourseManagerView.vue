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
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Judul Materi</label>
              <input type="text" v-model="courseTitle" placeholder="Ketik judul modul..." class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Urutan Modul</label>
                <input type="number" min="1" v-model="moduleOrder" class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Tingkatan</label>
                <select v-model="courseLevel" class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                <span>Modul Prasyarat (Opsional)</span>
              </label>
              <select v-model="prerequisiteId" class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
                <option :value="null">-- Tidak Ada Prasyarat --</option>
                <option v-for="mod in availablePrerequisites" :key="mod.id" :value="mod.id">
                  [{{ mod.level }}] {{ mod.title }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Deskripsi Singkat</label>
              <textarea rows="4" v-model="courseDescription" placeholder="Jelaskan tujuan pembelajaran materi ini..." class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all"></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Dokumen Fisik</label>
              
              <div v-if="editingModuleId && existingStoragePath && existingStoragePath !== 'pending-upload-storage'" class="mb-3 px-4 py-3 bg-cyan-50 text-cyan-800 rounded-xl text-xs font-bold border border-cyan-100 flex flex-col gap-1 shadow-sm">
                <span class="text-slate-500">Materi yang terlampir saat ini:</span>
                <span class="font-mono text-[11px] truncate">{{ existingStoragePath.split('/').pop() }}</span>
              </div>

              <div class="relative group border-2 border-slate-200 border-dashed rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-bssn-cyan transition-all flex flex-col items-center justify-center min-h-[140px] cursor-pointer overflow-hidden">
                <input type="file" @change="handleFileSelect" accept=".pdf,video/mp4" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20">
                <div v-if="!selectedFile" class="flex flex-col items-center pointer-events-none relative z-10">
                  <div class="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:text-bssn-cyan transition-all">
                    <svg class="w-6 h-6 text-slate-400 group-hover:text-bssn-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  </div>
                  <p class="text-xs text-slate-500 font-bold">{{ editingModuleId ? 'Unggah file baru' : 'Pilih file PDF/Video' }}</p>
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
              <h3 class="text-xl font-black text-slate-800">Rumusan Bank Soal Dinamis</h3>
              <button @click="addQuestion" class="text-xs font-black text-bssn-cyan bg-cyan-50 border border-cyan-100 px-4 py-2.5 rounded-xl hover:bg-cyan-100 transition-all flex items-center gap-2 shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                Tambah Soal
              </button>
            </div>

            <div class="space-y-6">
              <div v-for="(q, index) in questions" :key="index" class="bg-slate-50/80 p-8 rounded-2xl border-2 border-slate-100 relative space-y-5 group hover:border-slate-200 transition-colors">
                
                <button v-if="questions.length > 1" @click="removeQuestion(index)" title="Hapus Soal" class="absolute top-6 right-6 text-slate-300 hover:text-red-500 bg-white hover:bg-red-50 p-2 rounded-lg border border-slate-100 transition-all shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
                
                <div class="flex items-center gap-3">
                  <span class="bg-slate-900 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">Soal #{{ index + 1 }}</span>
                </div>
                
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Pertanyaan Ujian</label>
                  <textarea v-model="q.text" rows="2" placeholder="Tuliskan deskripsi pertanyaan..." class="w-full border-2 border-slate-200 bg-white rounded-xl py-3 px-4 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all shadow-sm"></textarea>
                </div>

                <div class="space-y-4 pt-2 border-t border-slate-200/60 mt-4 pt-4">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-black text-slate-500 uppercase tracking-widest block">Opsi Jawaban & Kunci</label>
                    <button @click="addOption(index)" class="text-xs font-bold text-bssn-cyan hover:text-cyan-700 bg-white px-3 py-1.5 rounded-lg border border-cyan-100 shadow-sm transition-all">+ Tambah Opsi</button>
                  </div>
                  
                  <div class="grid grid-cols-1 gap-3">
                    <div v-for="(opt, optIndex) in q.options" :key="optIndex" 
                      :class="[
                        'flex items-center gap-3 bg-white p-2 rounded-xl border-2 transition-all shadow-sm relative overflow-hidden',
                        opt.is_correct ? 'border-green-400 bg-green-50/50' : 'border-slate-100 focus-within:border-bssn-cyan focus-within:ring-4 focus-within:ring-bssn-cyan/10'
                      ]">
                      
                      <input type="radio" :name="'correct_ans_' + index" :checked="opt.is_correct" @change="setCorrectOption(index, optIndex)" title="Tandai sebagai jawaban benar" class="w-5 h-5 text-green-500 focus:ring-green-500 border-slate-300 ml-3 cursor-pointer shrink-0">
                      
                      <div class="relative w-full flex items-center pr-2">
                        <span class="text-xs font-black w-8 text-center select-none" :class="opt.is_correct ? 'text-green-600' : 'text-slate-400'">{{ String.fromCharCode(65 + optIndex) }}</span>
                        
                        <input type="text" v-model="opt.text" placeholder="Ketik kalimat opsi jawaban..." class="w-full py-2.5 pr-10 bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 outline-none">
                        
                        <button v-if="q.options.length > 2" @click="removeOption(index, optIndex)" title="Hapus opsi ini" class="absolute right-0 text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
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
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        <h3 class="text-xl font-black text-slate-800">
          {{ showArchived ? 'Arsip Kumpulan Modul (Terhapus)' : 'Daftar Modul Aktif' }}
        </h3>
        <button @click="toggleArchivedMode" 
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-all duration-300 flex items-center gap-2 shadow-sm',
            showArchived ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          ]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!showArchived" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ showArchived ? 'Tampilkan Modul Aktif' : 'Lihat Arsip Modul' }}
        </button>
      </div>

      <div v-if="isFetching" class="flex justify-center items-center py-20">
        <svg class="animate-spin h-10 w-10 text-bssn-cyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>

      <div v-else-if="modulesList.length === 0" class="text-center py-16">
        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        </div>
        <p class="text-slate-500 font-bold">{{ showArchived ? 'Tidak ada modul di dalam arsip.' : 'Basis data modul kosong.' }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b-2 border-slate-100">
              <th class="p-5 text-xs font-black text-slate-500 uppercase tracking-widest rounded-tl-2xl">Urutan & Level</th>
              <th class="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Informasi Materi</th>
              <th class="p-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right rounded-tr-2xl">Tindakan Khusus</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="mod in modulesList" :key="mod.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-5">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 shadow-sm">{{ mod.order_index || '-' }}</span>
                  <span :class="[
                    'px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider',
                    mod.level === 'Basic' ? 'bg-green-50 text-green-700 border border-green-100' :
                    mod.level === 'Intermediate' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    'bg-purple-50 text-purple-700 border border-purple-100'
                  ]">{{ mod.level }}</span>
                </div>
              </td>
              <td class="p-5">
                <h4 class="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
                  {{ mod.title }}
                  <span v-if="mod.prerequisite_id" title="Memiliki Prasyarat" class="text-amber-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </span>
                </h4>
                <p class="text-xs text-slate-500 font-medium line-clamp-1 max-w-md">{{ mod.description }}</p>
              </td>
              <td class="p-5 text-right flex items-center justify-end gap-2">
                <button v-if="!showArchived" @click="startEdit(mod)" class="px-4 py-2 bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 text-blue-600 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  Edit Modul
                </button>
                <button v-if="!showArchived" @click="deleteModule(mod)" :disabled="isDeleting" class="px-4 py-2 bg-white border-2 border-red-100 hover:border-red-500 hover:bg-red-50 text-red-500 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Hapus
                </button>
                <button v-if="showArchived" @click="restoreModule(mod)" :disabled="isRestoring" class="px-4 py-2 bg-white border-2 border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-600 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121 12h-4.5"></path></svg>
                  Pulihkan
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
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabaseClient'

interface QuizOption { text: string; is_correct: boolean; }
interface QuizQuestion { text: string; options: QuizOption[]; }

const activeTab = ref('add')

const editingModuleId = ref<string | null>(null)
const existingStoragePath = ref('')
const courseLevel = ref('Basic')
const courseTitle = ref('')
const courseDescription = ref('')
const moduleOrder = ref(1)
const prerequisiteId = ref<string | null>(null) 

const isSaving = ref(false)
const uploadStatus = ref('Simpan ke Database')
const selectedFile = ref<File | null>(null)

const modulesList = ref<any[]>([])
const isFetching = ref(false)
const isDeleting = ref(false)
const showArchived = ref(false)
const isRestoring = ref(false)

const questions = ref<QuizQuestion[]>([
  { 
    text: '', 
    options: [
      { text: '', is_correct: true },
      { text: '', is_correct: false },
      { text: '', is_correct: false },
      { text: '', is_correct: false }
    ]
  }
])

const availablePrerequisites = computed(() => {
  return modulesList.value.filter(m => !m.is_deleted && m.id !== editingModuleId.value)
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

const toggleArchivedMode = () => {
  showArchived.value = !showArchived.value
  fetchModules()
}

const addQuestion = () => {
  questions.value.push({ 
    text: '', 
    options: [
      { text: '', is_correct: true },
      { text: '', is_correct: false }
    ]
  })
}

const removeQuestion = (index: number) => questions.value.splice(index, 1)

const addOption = (qIndex: number) => {
  questions.value[qIndex].options.push({ text: '', is_correct: false })
}

const removeOption = (qIndex: number, optIndex: number) => {
  const q = questions.value[qIndex]
  if (q.options.length > 2) {
    if (q.options[optIndex].is_correct) {
      q.options[0].is_correct = true
    }
    q.options.splice(optIndex, 1)
  } else {
    alert('Minimal harus tersisa 2 opsi jawaban (contoh: Benar/Salah).')
  }
}

const setCorrectOption = (qIndex: number, optIndex: number) => {
  questions.value[qIndex].options.forEach((opt, idx) => {
    opt.is_correct = (idx === optIndex)
  })
}

const resetForm = () => {
  editingModuleId.value = null
  courseTitle.value = ''
  courseDescription.value = ''
  courseLevel.value = 'Basic'
  moduleOrder.value = 1
  prerequisiteId.value = null
  selectedFile.value = null
  existingStoragePath.value = ''
  questions.value = [{ 
    text: '', 
    options: [
      { text: '', is_correct: true }, { text: '', is_correct: false }, { text: '', is_correct: false }, { text: '', is_correct: false }
    ]
  }]
  uploadStatus.value = 'Simpan ke Database'
}

const startEdit = async (mod: any) => {
  editingModuleId.value = mod.id
  courseTitle.value = mod.title
  courseDescription.value = mod.description
  courseLevel.value = mod.level
  moduleOrder.value = mod.order_index || 1
  prerequisiteId.value = mod.prerequisite_id || null
  existingStoragePath.value = mod.storage_path || 'pending-upload-storage'
  selectedFile.value = null

  const { data: qData } = await supabase.from('questions').select('*').eq('module_id', mod.id)
  if (qData && qData.length > 0) {
    questions.value = qData.map(q => ({
      text: q.question_text,
      options: q.options && q.options.length > 0 
        ? q.options 
        : [{ text: '', is_correct: true }, { text: '', is_correct: false }] 
    }))
  } else {
    questions.value = [{ text: '', options: [{ text: '', is_correct: true }, { text: '', is_correct: false }] }]
  }
  
  activeTab.value = 'add'
}

const handleSave = async () => {
  if (!courseTitle.value || !courseDescription.value) {
    alert('Aksi ditolak: Lengkapi Judul dan Deskripsi Modul.')
    return
  }

  for (const [i, q] of questions.value.entries()) {
    if (!q.text.trim()) {
      alert(`Validasi Gagal: Pertanyaan Soal #${i + 1} masih kosong.`); return
    }
    if (q.options.some(opt => !opt.text.trim())) {
      alert(`Validasi Gagal: Terdapat kalimat opsi jawaban yang kosong pada Soal #${i + 1}.`); return
    }
    if (!q.options.some(opt => opt.is_correct)) {
      alert(`Validasi Gagal: Anda belum menentukan satu pun jawaban benar untuk Soal #${i + 1}.`); return
    }
  }

  isSaving.value = true
  let finalFileUrl = editingModuleId.value ? existingStoragePath.value : 'pending-upload-storage' 

  try {
    if (selectedFile.value) {
      if (editingModuleId.value && existingStoragePath.value && existingStoragePath.value !== 'pending-upload-storage') {
        try {
          const oldFileName = existingStoragePath.value.split('/').pop()
          if (oldFileName) await supabase.storage.from('course-media').remove([oldFileName])
        } catch (storageErr) {}
      }

      uploadStatus.value = 'Mengunggah Media...'
      const fileExt = selectedFile.value.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('course-media').upload(fileName, selectedFile.value)
      if (uploadError) throw uploadError

      // PERUBAHAN KEAMANAN: Hapus getPublicUrl, cukup simpan nama filenya saja
      finalFileUrl = fileName
    }

    uploadStatus.value = 'Menulis Database...'
    let moduleIdToUse = editingModuleId.value

    const payload = {
      title: courseTitle.value,
      level: courseLevel.value,
      description: courseDescription.value,
      storage_path: finalFileUrl,
      order_index: moduleOrder.value,
      prerequisite_id: prerequisiteId.value
    }

    if (editingModuleId.value) {
      const { error: updateError } = await supabase.from('modules').update(payload).eq('id', editingModuleId.value)
      if (updateError) throw updateError
      await supabase.from('questions').delete().eq('module_id', editingModuleId.value)
    } else {
      const { data: moduleData, error: moduleError } = await supabase.from('modules').insert([payload]).select().single()
      if (moduleError) throw moduleError
      moduleIdToUse = moduleData.id
    }

    const questionsToInsert = questions.value.map(q => ({
      module_id: moduleIdToUse,
      question_text: q.text,
      options: q.options 
    }))

    const { error: questionsError } = await supabase.from('questions').insert(questionsToInsert)
    if (questionsError) throw questionsError

    alert(editingModuleId.value ? 'Modul & Soal Dinamis berhasil diperbarui!' : 'Sukses! Kurikulum baru berhasil direkam.')
    resetForm()
    fetchModules() 

    if (editingModuleId.value) {
      switchToListTab() 
    }

  } catch (error: any) {
    alert('Gagal memproses data: ' + error.message)
  } finally {
    isSaving.value = false
    uploadStatus.value = 'Simpan ke Database'
  }
}

const switchToListTab = () => activeTab.value = 'list'

const fetchModules = async () => {
  isFetching.value = true
  try {
    let query = supabase.from('modules').select('*')
    
    if (showArchived.value) {
      query = query.eq('is_deleted', true)
    } else {
      query = query.neq('is_deleted', true).or('is_deleted.is.null') // Also handle nulls in case of legacy rows
    }

    const { data, error } = await query.order('order_index', { ascending: true }).order('created_at', { ascending: false })
    
    if (error) throw error
    modulesList.value = data || []
  } catch (error) {
    console.error("Galat memuat daftar:", error)
  } finally {
    isFetching.value = false
  }
}

const deleteModule = async (mod: any) => {
  if (!window.confirm(`Yakin ingin mengarsipkan modul "${mod.title}"?`)) return
  isDeleting.value = true
  try {
    const { error } = await supabase.from('modules').update({ is_deleted: true }).eq('id', mod.id)
    if (error) throw error
    fetchModules()
  } catch (error: any) { alert('Galat: ' + error.message) } finally { isDeleting.value = false }
}

const restoreModule = async (mod: any) => {
  if (!window.confirm(`Yakin memulihkan modul "${mod.title}"?`)) return
  isRestoring.value = true
  try {
    const { error } = await supabase.from('modules').update({ is_deleted: false }).eq('id', mod.id)
    if (error) throw error
    fetchModules()
  } catch (error: any) { alert('Galat: ' + error.message) } finally { isRestoring.value = false }
}

onMounted(() => fetchModules())
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
</style>