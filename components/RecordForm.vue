<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-all"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-white rounded-2xl border border-slate-200/80 shadow-2xl ring-1 ring-slate-950/5 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      @keydown.esc="$emit('close')"
    >
      <!-- Modal Başlığı (Modern, Soft ve Uyumlu) -->
      <div class="px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40 shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
            <svg v-if="!isEditMode" class="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <svg v-else class="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-slate-900 tracking-tight">
              {{ isEditMode ? 'Arıza Kaydını Düzenle' : 'Yeni Arıza Kaydı' }}
            </h3>
            <p class="text-xs text-slate-500 font-normal mt-0.5">
              {{ isEditMode ? 'Müşteri ve servis arıza detaylarını güncelleyin' : 'Müşteri ve servis arıza detaylarını arşive ekleyin' }}
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
          title="Kapat (Esc)"
        >
          <svg class="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form (Kaydırılabilir alan + Sabit alt buton çubuğu) -->
      <form @submit.prevent="handleSubmit" class="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        <!-- Form Alanları (Dengeli, Ferah ve İhtiyaç Halinde Kaydırılabilir) -->
        <div class="p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 overscroll-contain">
          
          <!-- 1. Satır: İsim & Soyisim -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[13px] font-medium text-slate-700 mb-1.5">
                İsim
              </label>
              <div class="relative">
                <input 
                  v-model="form.first_name"
                  ref="firstNameInput"
                  type="text" 
                  placeholder="Örn: Ahmet" 
                  class="w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm rounded-xl px-3.5 py-2.5 transition-all shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-sans"
                  :class="{ 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/10': errors.first_name }"
                />
              </div>
              <p v-if="errors.first_name" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <span>•</span> {{ errors.first_name }}
              </p>
            </div>

            <div>
              <label class="block text-[13px] font-medium text-slate-700 mb-1.5">
                Soyisim
              </label>
              <div class="relative">
                <input 
                  v-model="form.last_name"
                  type="text" 
                  placeholder="Örn: Yılmaz" 
                  class="w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm rounded-xl px-3.5 py-2.5 transition-all shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-sans"
                  :class="{ 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/10': errors.last_name }"
                />
              </div>
              <p v-if="errors.last_name" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <span>•</span> {{ errors.last_name }}
              </p>
            </div>
          </div>

          <!-- 2. Satır: Telefon No (ve Toggle) & Arıza Başlığı -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            
            <!-- Sol: No (Telefon) + Toggle -->
            <div>
              <label class="block text-[13px] font-medium text-slate-700 mb-1.5">
                Telefon (No)
              </label>
              <div class="relative">
                <input 
                  v-model="form.phone"
                  type="tel" 
                  placeholder="05XX XXX XX XX" 
                  class="w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm font-mono rounded-xl px-3.5 py-2.5 transition-all shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  :class="{ 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/10': errors.phone }"
                />
              </div>
              <p v-if="errors.phone" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <span>•</span> {{ errors.phone }}
              </p>

              <!-- Opsiyonel No Toggle Anahtarı -->
              <div class="mt-2.5">
                <label class="inline-flex items-center gap-2 cursor-pointer select-none group">
                  <div class="relative">
                    <input 
                      type="checkbox" 
                      v-model="showOptionalPhone" 
                      class="sr-only peer"
                    />
                    <div class="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                    <div class="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-3 shadow-sm"></div>
                  </div>
                  <span class="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    İkinci numara ekle <span class="text-slate-400 font-normal">(Opsiyonel)</span>
                  </span>
                </label>

                <!-- Toggle Açıldığında Beliren İkinci Numara Girişi -->
                <div 
                  v-if="showOptionalPhone" 
                  class="mt-2 animate-in fade-in slide-in-from-top-1 duration-150 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70"
                >
                  <label class="block text-[11px] font-medium text-slate-500 mb-1">
                    Opsiyonel Telefon / Sabit Hat
                  </label>
                  <input 
                    v-model="form.phone_optional"
                    type="tel" 
                    placeholder="0212 XXX XX XX veya 05XX..." 
                    class="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-xs font-mono rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            <!-- Sağ: Arıza Başlığı -->
            <div>
              <label class="block text-[13px] font-medium text-slate-700 mb-1.5">
                Arıza Başlığı
              </label>
              <div class="relative">
                <input 
                  v-model="form.title"
                  type="text" 
                  placeholder="Örn: Kombi ateşlemiyor, E01 arızası" 
                  class="w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm rounded-xl px-3.5 py-2.5 transition-all shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-sans"
                  :class="{ 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/10': errors.title }"
                />
              </div>
              <p v-if="errors.title" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <span>•</span> {{ errors.title }}
              </p>
              <p class="text-[11px] text-slate-400 mt-2 font-normal">
                Cihaz ve bildirilen ana şikayeti kısaca belirtin.
              </p>
            </div>

          </div>

          <!-- 3. Satır: Adres (Canlı Otomatik Tamamlama & Akıllı Doldurma) -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-[13px] font-medium text-slate-700">
                Servis Adresi
              </label>

              <!-- Akıllı Tamamla Butonu -->
              <button 
                v-if="form.address && form.address.trim().length >= 3"
                type="button"
                @click="autoEnrichAddress"
                :disabled="isSearchingAddress"
                class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg transition-all active:scale-[0.98]"
                title="Yazdığınız eksik adresi otomatik tamamlar"
              >
                <span v-if="isSearchingAddress" class="animate-spin text-[10px]">⏳</span>
                <span v-else>✨</span>
                <span>Akıllı Tamamla</span>
              </button>
            </div>

            <div class="relative">
              <textarea 
                v-model="form.address"
                @input="handleAddressInput"
                @focus="showSuggestions = suggestions.length > 0"
                rows="3"
                placeholder="Örn: çamlıkule 250 sk veya açık adres..." 
                class="w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm rounded-xl px-3.5 py-2.5 transition-all shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-sans resize-y leading-relaxed"
                :class="{ 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/10': errors.address }"
              ></textarea>
            </div>

            <!-- Adres Tamamlama Başarı / Bilgi Rozeti -->
            <p v-if="addressFeedback" class="mt-1.5 text-xs text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in">
              <span>✔</span> {{ addressFeedback }}
            </p>

            <p v-if="errors.address" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <span>•</span> {{ errors.address }}
            </p>

            <!-- Canlı Öneri Listesi (Menü içinde genişleyen, taşmayan ve rahatça kaydırılabilen panel) -->
            <div 
              v-if="showSuggestions && suggestions.length > 0"
              class="mt-2.5 bg-slate-50/90 border border-blue-200/90 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div class="px-3.5 py-2 bg-blue-50/70 border-b border-blue-100/80 text-xs font-semibold text-blue-900 flex items-center justify-between">
                <span class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  📍 Önerilen Adresler (Seçmek için dokunun):
                </span>
                <button 
                  type="button" 
                  @click="showSuggestions = false" 
                  class="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-0.5 rounded-md hover:bg-blue-100/70 transition-colors"
                >
                  ✕ Kapat
                </button>
              </div>

              <!-- Kaydırılabilir Öneri İçeriği -->
              <div class="max-h-48 overflow-y-auto divide-y divide-slate-100 overscroll-contain">
                <button 
                  v-for="(sug, index) in suggestions" 
                  :key="index"
                  type="button"
                  @mousedown.prevent="selectSuggestion(sug)"
                  @click="selectSuggestion(sug)"
                  class="w-full text-left px-3.5 py-2.5 hover:bg-white transition-colors flex items-start gap-2.5 group cursor-pointer"
                >
                  <div class="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg class="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                      {{ sug.fullText }}
                    </div>
                    <div class="text-[11px] text-slate-400 mt-0.5 truncate">
                      {{ [sug.district, sug.city, sug.state].filter(Boolean).join(' • ') }}
                    </div>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>

        <!-- Alt Buton Çubuğu (Geniş, Modern ve Sabit) -->
        <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-end space-x-3 bg-slate-50/40 shrink-0">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium active:scale-[0.99] transition-all shadow-sm cursor-pointer"
          >
            Vazgeç
          </button>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
          >
            <svg v-if="!isSubmitting && !isEditMode" class="w-4 h-4 shrink-0 text-blue-100" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <svg v-else-if="!isSubmitting && isEditMode" class="w-4 h-4 shrink-0 text-blue-100" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span v-if="isSubmitting" class="flex items-center gap-1.5">
              <span class="animate-spin text-xs">⏳</span> Kaydediliyor...
            </span>
            <span v-else>{{ isEditMode ? 'Değişiklikleri Kaydet' : 'Kaydet ve Arşive Ekle' }}</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import type { FaultRecord, CreateFaultRecordDto, UpdateFaultRecordDto } from '~/types/ticket'

const props = defineProps<{
  isOpen: boolean
  recordToEdit?: FaultRecord | null
  createAction: (dto: CreateFaultRecordDto) => Promise<any>
  updateAction?: (id: string, dto: UpdateFaultRecordDto) => Promise<any>
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', record: any): void
  (e: 'updated', record: any): void
}>()

const isEditMode = computed(() => !!props.recordToEdit)

const firstNameInput = ref<HTMLInputElement | null>(null)
const isSubmitting = ref(false)
const showOptionalPhone = ref(false)

// Akıllı Adres Arama & Tamamlama Durumu
const suggestions = ref<any[]>([])
const showSuggestions = ref(false)
const isSearchingAddress = ref(false)
const addressFeedback = ref('')
let searchTimer: any = null

const handleAddressInput = () => {
  if (searchTimer) clearTimeout(searchTimer)

  const query = form.address.trim()
  if (query.length < 3) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  searchTimer = setTimeout(async () => {
    isSearchingAddress.value = true
    try {
      const res = await $fetch<any>('/api/address-suggest', {
        params: { q: query }
      })
      if (res && res.suggestions && res.suggestions.length > 0) {
        suggestions.value = res.suggestions
        showSuggestions.value = true
      } else {
        suggestions.value = []
        showSuggestions.value = false
      }
    } catch (e) {
      console.error('Adres arama hatası:', e)
    } finally {
      isSearchingAddress.value = false
    }
  }, 250)
}

const selectSuggestion = (sug: any) => {
  form.address = sug.fullText
  suggestions.value = []
  showSuggestions.value = false
  addressFeedback.value = 'Adres otomatik tamamlandı'
  setTimeout(() => { addressFeedback.value = '' }, 2500)
}

const autoEnrichAddress = async () => {
  const query = form.address.trim()
  if (query.length < 2) return

  isSearchingAddress.value = true
  try {
    const res = await $fetch<any>('/api/address-suggest', {
      params: { q: query }
    })
    if (res && res.suggestions && res.suggestions.length > 0) {
      form.address = res.suggestions[0].fullText
      suggestions.value = []
      showSuggestions.value = false
      addressFeedback.value = 'Adres resmi formata dönüştürüldü'
      setTimeout(() => { addressFeedback.value = '' }, 2500)
    } else {
      addressFeedback.value = 'Eşleşen resmi adres bulunamadı, lütfen mahalle veya sokak adını kontrol edin'
      setTimeout(() => { addressFeedback.value = '' }, 3500)
    }
  } catch (e) {
    console.error('Akıllı tamamlama hatası:', e)
  } finally {
    isSearchingAddress.value = false
  }
}

const form = reactive<CreateFaultRecordDto>({
  title: '',
  address: '',
  phone: '',
  phone_optional: '',
  first_name: '',
  last_name: ''
})

const errors = reactive({
  title: '',
  address: '',
  phone: '',
  first_name: '',
  last_name: ''
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.recordToEdit) {
      form.title = props.recordToEdit.title || ''
      form.address = props.recordToEdit.address || ''
      form.phone = props.recordToEdit.phone || ''
      form.phone_optional = props.recordToEdit.phone_optional || ''
      form.first_name = props.recordToEdit.first_name || ''
      form.last_name = props.recordToEdit.last_name || ''
      showOptionalPhone.value = !!props.recordToEdit.phone_optional
    } else {
      form.title = ''
      form.address = ''
      form.phone = ''
      form.phone_optional = ''
      form.first_name = ''
      form.last_name = ''
      showOptionalPhone.value = false
    }
    nextTick(() => {
      firstNameInput.value?.focus()
    })
  } else {
    suggestions.value = []
    showSuggestions.value = false
  }
})

const validate = (): boolean => {
  let isValid = true
  errors.title = ''
  errors.address = ''
  errors.phone = ''
  errors.first_name = ''
  errors.last_name = ''

  if (!form.first_name.trim()) {
    errors.first_name = 'Müşteri adı zorunludur'
    isValid = false
  }

  if (!form.last_name.trim()) {
    errors.last_name = 'Müşteri soyadı zorunludur'
    isValid = false
  }

  if (!form.phone.trim()) {
    errors.phone = 'Telefon numarası zorunludur'
    isValid = false
  }

  if (!form.title.trim()) {
    errors.title = 'Arıza başlığı zorunludur'
    isValid = false
  }

  if (!form.address.trim()) {
    errors.address = 'Servis adresi zorunludur'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  try {
    if (isEditMode.value && props.recordToEdit && props.updateAction) {
      const updated = await props.updateAction(props.recordToEdit.id, {
        title: form.title,
        address: form.address,
        phone: form.phone,
        phone_optional: showOptionalPhone.value ? form.phone_optional : '',
        first_name: form.first_name,
        last_name: form.last_name
      })
      emit('updated', updated)
    } else {
      const created = await props.createAction({
        title: form.title,
        address: form.address,
        phone: form.phone,
        phone_optional: showOptionalPhone.value ? form.phone_optional : '',
        first_name: form.first_name,
        last_name: form.last_name
      })
      emit('created', created)
    }

    emit('close')

    // Form alanlarını sıfırla
    form.title = ''
    form.address = ''
    form.phone = ''
    form.phone_optional = ''
    form.first_name = ''
    form.last_name = ''
    showOptionalPhone.value = false
  } catch (err) {
    console.error('Kayıt/Güncelleme hatası:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>
