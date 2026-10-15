<template>
  <div class="min-h-screen bg-slate-50/60 flex flex-col font-sans selection:bg-brand-blue-500 selection:text-white">
    <!-- Header -->
    <AppHeader />

    <!-- Ana Gövde -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      
      <!-- Üst Başlık & Yeni Kayıt Butonu Barı -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div class="flex items-center space-x-3.5">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                Arıza Kayıt Arşivi
              </h1>
              <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                {{ totalCount }} Kayıt
              </span>
            </div>
            <p class="text-xs text-slate-500 font-normal mt-0.5">
              Teknik servis müşteri ve arıza kayıt havuzu
            </p>
          </div>
        </div>

        <!-- Yeni Kayıt Butonu (Menüyü / Modalı Açar) -->
        <button 
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <svg class="w-4 h-4 shrink-0 text-white" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span class="whitespace-nowrap">Yeni Arıza Kaydı Oluştur</span>
        </button>
      </div>

      <!-- Sütunları Net Ayrılmış Arıza Kayıt Tablosu -->
      <section>
        <RecordList 
          :records="records" 
          :delete-action="deleteRecord" 
          @view="openRecordDetail" 
          @edit="openEditModal"
        />
      </section>

    </main>

    <!-- Yeni Arıza Kaydı Giriş / Düzenleme Modalı -->
    <RecordForm 
      :is-open="isFormModalOpen"
      :record-to-edit="recordToEdit"
      :create-action="createRecord"
      :update-action="updateRecord"
      @close="closeFormModal"
      @created="handleRecordCreated"
      @updated="handleRecordUpdated"
    />

    <!-- Kayıt Detay Modalı -->
    <RecordModal 
      :record="selectedRecord" 
      @close="selectedRecord = null" 
    />

    <!-- WhatsApp Grubuna İletim Modalı -->
    <WhatsAppDispatchModal 
      :is-open="isWhatsAppModalOpen"
      :record="whatsAppModalRecord"
      @close="isWhatsAppModalOpen = false"
    />

    <!-- Sade Footer -->
    <footer class="bg-white/80 border-t border-slate-100 py-4 mt-12">
      <div class="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
        Hicret Teknik Servis • Arıza Kayıt Arşivi
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FaultRecord } from '~/types/ticket'
import { useFaultRecords } from '~/composables/useFaultRecords'

const {
  records,
  totalCount,
  createRecord,
  updateRecord,
  deleteRecord,
  fetchRecords
} = useFaultRecords()

const isFormModalOpen = ref(false)
const recordToEdit = ref<FaultRecord | null>(null)
const selectedRecord = ref<FaultRecord | null>(null)

// WhatsApp Gruba İletim Modalı Durumu
const whatsAppModalRecord = ref<FaultRecord | null>(null)
const isWhatsAppModalOpen = ref(false)

const openCreateModal = () => {
  recordToEdit.value = null
  isFormModalOpen.value = true
}

const openEditModal = (record: FaultRecord) => {
  selectedRecord.value = null // Detay açıksa kapat
  recordToEdit.value = record
  isFormModalOpen.value = true
}

const closeFormModal = () => {
  isFormModalOpen.value = false
  recordToEdit.value = null
}

const openRecordDetail = (record: FaultRecord) => {
  selectedRecord.value = record
}

const handleRecordCreated = (record: FaultRecord) => {
  // Kayıt başarıyla eklendi -> WhatsApp iletme onay penceresini aç
  if (record) {
    whatsAppModalRecord.value = record
    isWhatsAppModalOpen.value = true
  }
}

const handleRecordUpdated = (record: FaultRecord) => {
  // Kayıt başarıyla güncellendi
}

onMounted(() => {
  fetchRecords()
})
</script>
