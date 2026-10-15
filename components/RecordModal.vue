<template>
  <div 
    v-if="record" 
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-all"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xl ring-1 ring-slate-950/5 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      <!-- Modal Başlığı -->
      <div class="px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40 shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-slate-900 tracking-tight">
              Arıza Kayıt Detayı
            </h3>
            <p class="text-xs text-slate-500 font-normal mt-0.5">
              Müşteri iletişim ve servis bilgileri
            </p>
          </div>
        </div>
        
        <button 
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center"
          title="Kapat"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal İçeriği -->
      <div class="p-6 space-y-4 overflow-y-auto flex-1">
        
        <!-- Arıza Başlığı -->
        <div>
          <div class="text-[12px] font-medium text-slate-400 uppercase tracking-wider">Arıza Başlığı</div>
          <div class="text-base font-semibold text-slate-900 mt-1">
            {{ record.title }}
          </div>
        </div>

        <!-- Müşteri ve Telefon Bilgileri -->
        <div class="grid grid-cols-2 gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200/70">
          <div>
            <div class="text-[12px] font-medium text-slate-400">Müşteri</div>
            <div class="text-sm font-semibold text-slate-900 mt-0.5">
              {{ record.first_name }} {{ record.last_name }}
            </div>
          </div>
          <div>
            <div class="text-[12px] font-medium text-slate-400">Telefon (No)</div>
            <div class="text-sm font-semibold text-blue-600 font-mono mt-0.5">
              {{ record.phone }}
            </div>
            <div v-if="record.phone_optional" class="text-xs text-slate-500 font-mono mt-0.5">
              Ops: {{ record.phone_optional }}
            </div>
          </div>
        </div>

        <!-- Adres -->
        <div class="bg-slate-50/60 p-4 rounded-xl border border-slate-200/70">
          <div class="text-[12px] font-medium text-slate-400 flex items-center justify-between">
            <span>Servis Adresi</span>
            <button 
              @click="copyText(record.address, 'Adres')" 
              class="text-blue-600 hover:underline text-xs font-semibold"
            >
              Kopyala
            </button>
          </div>
          <div class="text-sm text-slate-700 mt-1 font-normal leading-relaxed">
            {{ record.address }}
          </div>
        </div>

        <!-- Tarih -->
        <div class="text-xs text-slate-400 pt-1 flex items-center justify-between font-mono">
          <span>Kayıt Tarihi: {{ new Date(record.created_at).toLocaleString('tr-TR') }}</span>
        </div>

      </div>

      <!-- Alt Butonlar -->
      <div class="bg-slate-50/40 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
        <button 
          @click="shareViaWhatsApp"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer"
        >
          <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12.031 2c-5.508 0-9.986 4.477-9.986 9.984 0 1.761.458 3.479 1.332 5.002L2 22l5.161-1.353a9.92 9.92 0 004.87 1.258h.004c5.507 0 9.984-4.477 9.984-9.984 0-2.666-1.038-5.173-2.925-7.059A9.917 9.917 0 0012.031 2zm0 18.252h-.003a8.23 8.23 0 01-4.197-1.149l-.301-.179-3.118.818.832-3.039-.196-.312a8.243 8.243 0 01-1.267-4.407c0-4.552 3.704-8.256 8.256-8.256 2.206 0 4.279.86 5.839 2.421a8.204 8.204 0 012.417 5.836c0 4.553-3.704 8.256-8.26 8.256zm4.526-6.177c-.248-.124-1.468-.724-1.696-.807-.228-.083-.394-.124-.56.124-.166.248-.642.807-.787.973-.145.166-.29.187-.538.062-.249-.125-1.049-.387-1.999-1.233-.739-.659-1.238-1.474-1.383-1.722-.145-.248-.015-.382.109-.505.112-.111.248-.29.373-.435.124-.145.166-.248.249-.414.083-.166.041-.311-.021-.435-.062-.124-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.074 0 1.224.892 2.406 1.016 2.572.124.166 1.756 2.681 4.254 3.759.594.257 1.059.41 1.42.525.597.19 1.14.163 1.569.099.479-.072 1.468-.6 1.675-1.18.207-.58.207-1.077.145-1.18-.062-.104-.228-.166-.477-.29z" />
          </svg>
          <span>WhatsApp Grubuna İlet</span>
        </button>

        <button 
          @click="$emit('close')"
          class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
          Kapat
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { FaultRecord } from '~/types/ticket'
import { openWhatsAppDispatch } from '~/utils/whatsapp'

const props = defineProps<{
  record: FaultRecord | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const copyText = (text: string, label: string) => {
  navigator.clipboard.writeText(text)
  alert(`${label} kopyalandı!`)
}

const shareViaWhatsApp = () => {
  if (!props.record) return
  openWhatsAppDispatch(props.record)
}
</script>
