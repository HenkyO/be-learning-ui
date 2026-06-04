<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
    
    <div class="h-14 bg-slate-800 text-white flex items-center justify-between px-4 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-2 hover:bg-slate-700 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <span class="font-medium text-sm truncate max-w-md">{{ docTitle }}</span>
      </div>
      
      <div class="flex items-center gap-4">
        <a :href="docUrl" target="_blank" download class="flex items-center gap-2 bg-bssn-cyan hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span class="hidden sm:inline">Unduh Berkas</span>
        </a>
      </div>
    </div>

    <div class="flex-1 overflow-hidden bg-slate-200">
      <iframe v-if="docUrl" :src="docUrl" class="w-full h-full border-none bg-white" title="Penampil Dokumen"></iframe>
      <div v-else class="w-full h-full flex items-center justify-center text-slate-500 font-bold">
        URL Dokumen tidak ditemukan atau tidak valid.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const docUrl = computed(() => route.query.url as string || '')
const docTitle = computed(() => route.query.title as string || 'Dokumen Materi')
</script>