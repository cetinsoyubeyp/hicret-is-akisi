<template>
  <div class="space-y-3.5">
    <!-- Üst Arama ve Tarih Filtreleme Barı -->
    <div class="space-y-2.5">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <!-- Arama Çubuğu -->
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4 shrink-0 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="İsim, telefon, arıza veya adres ile arşivde ara..." 
            class="w-full bg-white border border-slate-200/90 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2.5 transition-all shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-sans"
          />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Hızlı Tarih Filtre Butonları (Pills) -->
        <div class="flex items-center flex-wrap gap-1.5">
          <button
            type="button"
            @click="setDatePreset('all')"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="datePreset === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'"
          >
            Tümü
          </button>
          <button
            type="button"
            @click="setDatePreset('today')"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="datePreset === 'today' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'"
          >
            Bugün
          </button>
          <button
            type="button"
            @click="setDatePreset('yesterday')"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="datePreset === 'yesterday' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'"
          >
            Dün
          </button>
          <button
            type="button"
            @click="setDatePreset('this_week')"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="datePreset === 'this_week' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'"
          >
            Bu Hafta
          </button>
          <button
            type="button"
            @click="setDatePreset('this_month')"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="datePreset === 'this_month' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'"
          >
            Bu Ay
          </button>
          <button
            type="button"
            @click="toggleCustomDate"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="datePreset === 'custom' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'"
          >
            <svg class="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Tarih Seç</span>
            <svg class="w-3 h-3 shrink-0 opacity-70" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div class="ml-auto text-xs text-slate-500 font-medium pl-2">
            Gösterilen: <span class="font-semibold text-slate-800">{{ filteredRecords.length }}</span> kayıt
          </div>
        </div>
      </div>

      <!-- Özel Tarih Seçici Alt Paneli (Direkt Tarih veya Tarih Aralığı) -->
      <div 
        v-if="datePreset === 'custom'" 
        class="bg-white border border-blue-200/80 rounded-xl p-3 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 flex flex-wrap items-center justify-between gap-3"
      >
        <div class="flex items-center gap-3 sm:gap-4 flex-wrap">
          <!-- Mod Seçimi (Tek Tarih vs Tarih Aralığı) -->
          <div class="inline-flex bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              @click="customDateMode = 'single'"
              class="px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer"
              :class="customDateMode === 'single' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Belirli Bir Gün
            </button>
            <button
              type="button"
              @click="customDateMode = 'range'"
              class="px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer"
              :class="customDateMode === 'range' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Tarih Aralığı
            </button>
          </div>

          <!-- Belirli Bir Gün Seçimi -->
          <div v-if="customDateMode === 'single'" class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-medium">Tarih:</span>
            <input 
              v-model="customSingleDate" 
              type="date" 
              class="bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-mono transition-all"
            />
          </div>

          <!-- Tarih Aralığı Seçimi -->
          <div v-else class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-slate-500 font-medium">Başlangıç:</span>
            <input 
              v-model="customStartDate" 
              type="date" 
              class="bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-mono transition-all"
            />
            <span class="text-xs text-slate-400">➔</span>
            <span class="text-xs text-slate-500 font-medium">Bitiş:</span>
            <input 
              v-model="customEndDate" 
              type="date" 
              class="bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-mono transition-all"
            />
          </div>
        </div>

        <!-- Filtreyi Temizle -->
        <button
          type="button"
          @click="resetDateFilter"
          class="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Filtreyi Sıfırla ✕
        </button>
      </div>
    </div>

    <!-- Sütunları Net Ayrılmış Arşiv Tablosu -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <!-- Boş Durum -->
      <div v-if="filteredRecords.length === 0" class="py-14 px-4 text-center">
        <div class="w-11 h-11 mx-auto mb-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-slate-800">Kayıt Bulunamadı</h3>
        <p class="text-xs text-slate-400 mt-0.5">
          Seçili arama veya tarih kriterine uygun bir arıza kaydı bulunmuyor.
        </p>
        <button 
          v-if="searchQuery || datePreset !== 'all'"
          @click="searchQuery = ''; resetDateFilter()"
          class="mt-3 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
        >
          Filtreleri Temizle
        </button>
      </div>

      <!-- Tablo (Net Sütun Çizgileriyle) -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200/80">
              <th class="py-3 px-3.5 border-r border-slate-200/80 w-12 text-center font-mono">#</th>
              <th class="py-3 px-4 border-r border-slate-200/80 min-w-[150px]">Müşteri</th>
              <th class="py-3 px-4 border-r border-slate-200/80 min-w-[200px]">Arıza Başlığı</th>
              <th class="py-3 px-4 border-r border-slate-200/80 min-w-[140px]">No (Telefon)</th>
              <th class="py-3 px-4 border-r border-slate-200/80 min-w-[130px]">Opsiyonel No</th>
              <th class="py-3 px-4 border-r border-slate-200/80 min-w-[220px]">Adres</th>
              <th class="py-3 px-4 border-r border-slate-200/80 whitespace-nowrap min-w-[110px]">Kayıt Tarihi</th>
              <th class="py-3 px-4 text-center whitespace-nowrap w-36">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
            <tr 
              v-for="(record, index) in filteredRecords" 
              :key="record.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- Sıra No -->
              <td class="py-3.5 px-3.5 text-center text-slate-400 font-mono border-r border-slate-200/80 bg-slate-50/30">
                {{ index + 1 }}
              </td>

              <!-- Müşteri (İsim - Soyisim) -->
              <td class="py-3.5 px-4 border-r border-slate-200/80 font-semibold text-slate-900 whitespace-nowrap">
                {{ record.first_name }} {{ record.last_name }}
              </td>

              <!-- Arıza Başlığı -->
              <td class="py-3.5 px-4 border-r border-slate-200/80 font-medium text-slate-800">
                {{ record.title }}
              </td>

              <!-- No (Telefon) -->
              <td class="py-3.5 px-4 border-r border-slate-200/80 whitespace-nowrap">
                <div class="flex items-center space-x-1.5">
                  <a 
                    :href="`tel:${cleanPhone(record.phone)}`" 
                    class="font-semibold text-blue-600 hover:text-blue-700 hover:underline font-mono"
                  >
                    {{ record.phone }}
                  </a>
                  <button 
                    @click="copyText(record.phone, 'Telefon')"
                    class="text-slate-400 hover:text-slate-600 p-0.5 transition-colors cursor-pointer"
                    title="Kopyala"
                  >
                    <svg class="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </button>
                </div>
              </td>

              <!-- Opsiyonel No -->
              <td class="py-3.5 px-4 border-r border-slate-200/80 whitespace-nowrap text-slate-500 font-mono">
                <span v-if="record.phone_optional">{{ record.phone_optional }}</span>
                <span v-else class="text-slate-300">-</span>
              </td>

              <!-- Adres -->
              <td class="py-3.5 px-4 border-r border-slate-200/80 max-w-[260px]">
                <div class="text-slate-600 line-clamp-2 leading-relaxed" :title="record.address">
                  {{ record.address }}
                </div>
                <div class="mt-1 flex items-center space-x-2 text-[11px]">
                  <button 
                    @click="copyText(record.address, 'Adres')" 
                    class="text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    Kopyala
                  </button>
                  <span class="text-slate-300">•</span>
                  <a 
                    :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(record.address)}`" 
                    target="_blank" 
                    class="text-slate-400 hover:text-slate-700 hover:underline"
                  >
                    Harita
                  </a>
                </div>
              </td>

              <!-- Kayıt Tarihi -->
              <td class="py-3.5 px-4 border-r border-slate-200/80 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                {{ formatDate(record.created_at) }}
              </td>

              <!-- İşlem (Detay, Düzenle, Sil) -->
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <div class="inline-flex items-center space-x-1">
                  <!-- Detay Gör -->
                  <button 
                    @click="$emit('view', record)"
                    class="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 transition-colors cursor-pointer"
                    title="Detay Görüntüle"
                  >
                    <svg class="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <!-- WhatsApp Grubuna İlet (1-Tık) -->
                  <button 
                    @click="handleSendWhatsApp(record)"
                    class="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/60 transition-colors cursor-pointer"
                    title="WhatsApp Grubuna İlet"
                  >
                    <svg class="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 2c-5.508 0-9.986 4.477-9.986 9.984 0 1.761.458 3.479 1.332 5.002L2 22l5.161-1.353a9.92 9.92 0 004.87 1.258h.004c5.507 0 9.984-4.477 9.984-9.984 0-2.666-1.038-5.173-2.925-7.059A9.917 9.917 0 0012.031 2zm0 18.252h-.003a8.23 8.23 0 01-4.197-1.149l-.301-.179-3.118.818.832-3.039-.196-.312a8.243 8.243 0 01-1.267-4.407c0-4.552 3.704-8.256 8.256-8.256 2.206 0 4.279.86 5.839 2.421a8.204 8.204 0 012.417 5.836c0 4.553-3.704 8.256-8.26 8.256zm4.526-6.177c-.248-.124-1.468-.724-1.696-.807-.228-.083-.394-.124-.56.124-.166.248-.642.807-.787.973-.145.166-.29.187-.538.062-.249-.125-1.049-.387-1.999-1.233-.739-.659-1.238-1.474-1.383-1.722-.145-.248-.015-.382.109-.505.112-.111.248-.29.373-.435.124-.145.166-.248.249-.414.083-.166.041-.311-.021-.435-.062-.124-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.074 0 1.224.892 2.406 1.016 2.572.124.166 1.756 2.681 4.254 3.759.594.257 1.059.41 1.42.525.597.19 1.14.163 1.569.099.479-.072 1.468-.6 1.675-1.18.207-.58.207-1.077.145-1.18-.062-.104-.228-.166-.477-.29z" />
                    </svg>
                  </button>

                  <!-- Düzenle -->
                  <button 
                    @click="$emit('edit', record)"
                    class="p-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100 text-blue-600 border border-blue-200/60 transition-colors cursor-pointer"
                    title="Kaydı Düzenle"
                  >
                    <svg class="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <!-- Sil -->
                  <button 
                    @click="confirmDelete(record)"
                    class="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                    title="Kaydı Sil"
                  >
                    <svg class="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Kopyalama Bildirimi (Toast) -->
    <div 
      v-if="toastMessage" 
      class="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl flex items-center gap-2 animate-in fade-in"
    >
      <span class="text-emerald-400">✔</span>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FaultRecord } from '~/types/ticket'
import { openWhatsAppDispatch } from '~/utils/whatsapp'

const props = defineProps<{
  records: FaultRecord[]
  deleteAction: (id: string) => Promise<void>
}>()

const emit = defineEmits<{
  (e: 'view', record: FaultRecord): void
  (e: 'edit', record: FaultRecord): void
}>()

const searchQuery = ref('')
const toastMessage = ref('')

const handleSendWhatsApp = (record: FaultRecord) => {
  openWhatsAppDispatch(record)
  toastMessage.value = 'WhatsApp grubu açılıyor...'
  setTimeout(() => {
    toastMessage.value = ''
  }, 2500)
}

type DatePreset = 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom'
const datePreset = ref<DatePreset>('all')
const customDateMode = ref<'single' | 'range'>('single')
const customSingleDate = ref('')
const customStartDate = ref('')
const customEndDate = ref('')

const setDatePreset = (preset: DatePreset) => {
  datePreset.value = preset
}

const toggleCustomDate = () => {
  if (datePreset.value === 'custom') {
    datePreset.value = 'all'
  } else {
    datePreset.value = 'custom'
  }
}

const resetDateFilter = () => {
  datePreset.value = 'all'
  customSingleDate.value = ''
  customStartDate.value = ''
  customEndDate.value = ''
}

const filteredRecords = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  const today = new Date()

  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayStr = getLocalDateString(today)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = getLocalDateString(yesterday)

  const dayOfWeek = today.getDay() || 7 // Pazartesi = 1, Pazar = 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek - 1))
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()

  return props.records.filter(r => {
    // 1. Arama Metni Filtresi
    let matchQuery = true
    if (q) {
      const matchTitle = r.title.toLowerCase().includes(q)
      const matchName = `${r.first_name} ${r.last_name}`.toLowerCase().includes(q)
      const matchPhone = r.phone.toLowerCase().includes(q) || (r.phone_optional && r.phone_optional.toLowerCase().includes(q))
      const matchAddress = r.address.toLowerCase().includes(q)
      matchQuery = matchTitle || matchName || matchPhone || matchAddress
    }

    if (!matchQuery) return false

    // 2. Tarih Filtresi
    if (datePreset.value === 'all') return true

    const recDate = new Date(r.created_at)
    const recDateStr = getLocalDateString(recDate)

    if (datePreset.value === 'today') {
      return recDateStr === todayStr
    }
    if (datePreset.value === 'yesterday') {
      return recDateStr === yesterdayStr
    }
    if (datePreset.value === 'this_week') {
      return recDate >= monday && recDate <= sunday
    }
    if (datePreset.value === 'this_month') {
      return recDate.getFullYear() === currentYear && recDate.getMonth() === currentMonth
    }
    if (datePreset.value === 'custom') {
      if (customDateMode.value === 'single') {
        if (!customSingleDate.value) return true
        return recDateStr === customSingleDate.value
      } else {
        if (customStartDate.value && recDateStr < customStartDate.value) return false
        if (customEndDate.value && recDateStr > customEndDate.value) return false
        return true
      }
    }

    return true
  })
})

const cleanPhone = (phone: string): string => {
  return phone.replace(/[^\d+]/g, '')
}

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const copyText = (text: string, label: string) => {
  navigator.clipboard.writeText(text)
  toastMessage.value = `${label} kopyalandı.`
  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

const confirmDelete = async (record: FaultRecord) => {
  if (confirm(`"${record.first_name} ${record.last_name}" kaydını silmek istediğinize emin misiniz?`)) {
    await props.deleteAction(record.id)
  }
}
</script>
