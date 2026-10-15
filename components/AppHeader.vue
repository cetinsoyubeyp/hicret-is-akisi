<template>
  <header class="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Left: Kurumsal, Soft ve Tatlı Logo & Başlık -->
        <div class="flex items-center space-x-3">
          <!-- Tatlı & Kurumsal Soft Logo -->
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue-500 via-blue-600 to-brand-red-500 p-0.5 shadow-soft flex items-center justify-center">
            <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <svg class="w-5 h-5 text-brand-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          </div>

          <!-- Başlık & Açıklama -->
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-base font-bold tracking-tight text-slate-800">
                Hicret <span class="text-brand-blue-600 font-extrabold">Servis</span>
              </span>
              <span class="w-1.5 h-1.5 rounded-full bg-brand-red-500 inline-block"></span>
            </div>
            <p class="text-xs text-slate-400 font-medium">
              Teknik Servis Arıza Takip
            </p>
          </div>
        </div>

        <!-- Right: Sade & Temiz Durum -->
        <div class="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            Ekip Paneli
          </span>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Minimalist, sade ve temiz header bileşeni
</script>
