<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-slate-50 selection:bg-bssn-cyan selection:text-white">
    <!-- Left Side: Branding / LMS Context -->
    <div class="hidden md:flex md:w-1/2 lg:w-3/5 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-bssn-cyan/20 via-blue-500/10 to-transparent rounded-full -mr-[400px] -mt-[400px] pointer-events-none blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full -ml-20 -mb-20 pointer-events-none blur-2xl"></div>

      <!-- Logo Area -->
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-bssn-cyan to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <span class="text-2xl font-black text-white">B</span>
        </div>
        <span class="text-2xl font-black text-white tracking-tight">Be Learning</span>
      </div>

      <!-- Hero Text -->
      <div class="relative z-10 max-w-xl my-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full text-bssn-cyan text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
          Platform Edukasi
        </div>
        <h1 class="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
          Bangun Kompetensi <span class="text-transparent bg-clip-text bg-gradient-to-r from-bssn-cyan to-blue-400">Keamanan Informasi</span> Anda
        </h1>
        <p class="text-slate-400 text-lg font-medium leading-relaxed">
          Akses kurikulum berstandar industri, pelajari infrastruktur kunci publik, dan tingkatkan keahlian Anda di Balai Besar Sertifikasi Elektronik.
        </p>
      </div>

      <!-- Footer Area -->
      <div class="relative z-10 text-slate-500 text-sm font-medium">
        &copy; {{ new Date().getFullYear() }} BSrE - BSSN. All rights reserved.
      </div>
    </div>

    <!-- Right Side: Form / Content Area -->
    <div class="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 sm:p-12 relative">
      <!-- Mobile Background Elements -->
      <div class="md:hidden absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-100 to-slate-50 -z-10"></div>
      <div class="md:hidden absolute -right-20 -top-20 w-40 h-40 bg-bssn-cyan/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div class="w-full max-w-md animate-fade-in-up">
        <!-- Form Content Slot (Router View) -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>