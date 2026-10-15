<template>
  <div 
    v-if="isOpen && record" 
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-all"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-white rounded-2xl border border-slate-200/80 shadow-2xl ring-1 ring-slate-950/5 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      @keydown.esc="$emit('close')"
    >
      <!-- Başlık Çubuğu -->
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/40 shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs">
            <!-- WhatsApp SVG İkonu -->
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 2c-5.508 0-9.986 4.477-9.986 9.984 0 1.761.458 3.479 1.332 5.002L2 22l5.161-1.353a9.92 9.92 0 004.87 1.258h.004c5.507 0 9.984-4.477 9.984-9.984 0-2.666-1.038-5.173-2.925-7.059A9.917 9.917 0 0012.031 2zm0 18.252h-.003a8.23 8.23 0 01-4.197-1.149l-.301-.179-3.118.818.832-3.039-.196-.312a8.243 8.243 0 01-1.267-4.407c0-4.552 3.704-8.256 8.256-8.256 2.206 0 4.279.86 5.839 2.421a8.204 8.204 0 012.417 5.836c0 4.553-3.704 8.256-8.26 8.256zm4.526-6.177c-.248-.124-1.468-.724-1.696-.807-.228-.083-.394-.124-.56.124-.166.248-.642.807-.787.973-.145.166-.29.187-.538.062-.249-.125-1.049-.387-1.999-1.233-.739-.659-1.238-1.474-1.383-1.722-.145-.248-.015-.382.109-.505.112-.111.248-.29.373-.435.124-.145.166-.248.249-.414.083-.166.041-.311-.021-.435-.062-.124-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.074 0 1.224.892 2.406 1.016 2.572.124.166 1.756 2.681 4.254 3.759.594.257 1.059.41 1.42.525.597.19 1.14.163 1.569.099.479-.072 1.468-.6 1.675-1.18.207-.58.207-1.077.145-1.18-.062-.104-.228-.166-.477-.29z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-slate-900 tracking-tight">
              Arıza Kaydı Eklendi!
            </h3>
            <p class="text-xs text-slate-500 font-normal mt-0.5">
              WhatsApp servisi grubuna mesaj olarak iletin
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
          title="Kapat"
        >
          <svg class="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- İçerik -->
      <div class="p-6 space-y-4">
        <!-- Bilgi Özeti Kartı -->
        <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-medium">Müşteri:</span>
            <span class="font-semibold text-slate-800">{{ record.first_name }} {{ record.last_name }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-medium">Telefon:</span>
            <span class="font-mono font-semibold text-blue-600">{{ record.phone }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-medium">Arıza:</span>
            <span class="font-medium text-slate-800 max-w-[200px] truncate" :title="record.title">{{ record.title }}</span>
          </div>
          <div class="pt-1 border-t border-slate-200/60 flex items-start justify-between gap-2">
            <span class="text-slate-500 font-medium shrink-0">Adres:</span>
            <span class="text-slate-700 text-right line-clamp-2">{{ record.address }}</span>
          </div>
        </div>

        <!-- Nasıl Çalışır Bilgilendirmesi -->
        <p class="text-[11px] text-slate-500 leading-relaxed bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/70">
          💡 <strong>Nasıl Çalışır:</strong> Aşağıdaki butona tıkladığınızda WhatsApp otomatik açılır. Tek yapmanız gereken servis grubunuzu seçip <strong>Gönder</strong> tuşuna basmaktır.
        </p>

        <!-- Mesaj Önizleme Toggle -->
        <div>
          <button 
            type="button" 
            @click="showPreview = !showPreview"
            class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>{{ showPreview ? 'Mesaj Önizlemesini Gizle' : 'Mesaj Önizlemesini Gör' }}</span>
            <span class="text-[10px]">{{ showPreview ? '▲' : '▼' }}</span>
          </button>

          <div 
            v-if="showPreview" 
            class="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto animate-in fade-in"
          >
            {{ messageText }}
          </div>
        </div>
      </div>

      <!-- Alt Butonlar (Hepsi Tam Olarak Aynı Boyutta ve Hizalı) -->
      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/40 shrink-0">
        <div class="grid grid-cols-3 gap-2.5">
          <!-- 1. Metni Kopyala -->
          <button 
            type="button"
            @click="handleCopyMessage"
            class="h-11 w-full px-2 sm:px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Mesaj metnini panoya kopyalar"
          >
            <span v-if="copied" class="text-emerald-600 font-semibold truncate">✔ Kopyalandı</span>
            <span v-else class="truncate">📋 Metni Kopyala</span>
          </button>

          <!-- 2. Kapat -->
          <button 
            type="button" 
            @click="$emit('close')"
            class="h-11 w-full px-2 sm:px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-xs flex items-center justify-center cursor-pointer whitespace-nowrap"
          >
            Kapat
          </button>

          <!-- 3. Gruba İlet -->
          <button 
            type="button" 
            @click="handleSend"
            class="h-11 w-full px-2 sm:px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
            title="WhatsApp servisi grubuna gönderir"
          >
            <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 2c-5.508 0-9.986 4.477-9.986 9.984 0 1.761.458 3.479 1.332 5.002L2 22l5.161-1.353a9.92 9.92 0 004.87 1.258h.004c5.507 0 9.984-4.477 9.984-9.984 0-2.666-1.038-5.173-2.925-7.059A9.917 9.917 0 0012.031 2zm0 18.252h-.003a8.23 8.23 0 01-4.197-1.149l-.301-.179-3.118.818.832-3.039-.196-.312a8.243 8.243 0 01-1.267-4.407c0-4.552 3.704-8.256 8.256-8.256 2.206 0 4.279.86 5.839 2.421a8.204 8.204 0 012.417 5.836c0 4.553-3.704 8.256-8.26 8.256zm4.526-6.177c-.248-.124-1.468-.724-1.696-.807-.228-.083-.394-.124-.56.124-.166.248-.642.807-.787.973-.145.166-.29.187-.538.062-.249-.125-1.049-.387-1.999-1.233-.739-.659-1.238-1.474-1.383-1.722-.145-.248-.015-.382.109-.505.112-.111.248-.29.373-.435.124-.145.166-.248.249-.414.083-.166.041-.311-.021-.435-.062-.124-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.074 0 1.224.892 2.406 1.016 2.572.124.166 1.756 2.681 4.254 3.759.594.257 1.059.41 1.42.525.597.19 1.14.163 1.569.099.479-.072 1.468-.6 1.675-1.18.207-.58.207-1.077.145-1.18-.062-.104-.228-.166-.477-.29z" />
            </svg>
            <span class="truncate">Gruba İlet</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FaultRecord } from '~/types/ticket'
import { formatWhatsAppMessage, openWhatsAppDispatch } from '~/utils/whatsapp'

const props = defineProps<{
  isOpen: boolean
  record: FaultRecord | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const showPreview = ref(false)
const copied = ref(false)

const messageText = computed(() => {
  if (!props.record) return ''
  return formatWhatsAppMessage(props.record)
})

const handleCopyMessage = () => {
  if (!props.record) return
  navigator.clipboard.writeText(messageText.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const handleSend = () => {
  if (!props.record) return
  openWhatsAppDispatch(props.record)
  emit('close')
}
</script>
