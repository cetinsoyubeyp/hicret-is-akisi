import { ref, computed } from 'vue'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { FaultRecord, CreateFaultRecordDto, UpdateFaultRecordDto } from '~/types/ticket'

const STORAGE_KEY = 'hicret_fault_records_archive_v2'

export const useFaultRecords = () => {
  const config = useRuntimeConfig()
  const records = ref<FaultRecord[]>([])
  const isLoading = ref<boolean>(false)
  const isSupabaseConnected = ref<boolean>(false)
  
  let supabase: SupabaseClient | null = null
  let isRealtimeSubscribed = false

  const initClient = () => {
    if (supabase) return

    const url = (config.public.supabaseUrl as string)?.trim() || ''
    const key = (config.public.supabaseKey as string)?.trim() || ''

    if (url && key) {
      try {
        supabase = createClient(url, key)
        isSupabaseConnected.value = true
      } catch (err) {
        console.warn('Supabase istemci başlatılamadı, yerel bellek kullanılıyor:', err)
        isSupabaseConnected.value = false
      }
    } else {
      isSupabaseConnected.value = false
    }
  }

  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Eski test/mock verilerini filtrele
          records.value = Array.isArray(parsed) 
            ? parsed.filter((r: any) => !['rec-1', 'rec-2', 'rec-3'].includes(r.id))
            : []
          return
        } catch (e) {
          console.error('Yerel veri ayrıştırılamadı:', e)
        }
      }
      records.value = []
    }
  }

  const saveToLocalStorage = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
    }
  }

  const setupRealtime = () => {
    if (supabase && !isRealtimeSubscribed && import.meta.client) {
      try {
        supabase
          .channel('fault_records_channel')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'fault_records' }, async () => {
            // Arka planda sessizce listeyi güncelle
            if (supabase) {
              const { data } = await supabase
                .from('fault_records')
                .select('*')
                .order('created_at', { ascending: false })
              if (data) {
                records.value = data as FaultRecord[]
                saveToLocalStorage()
              }
            }
          })
          .subscribe()
        isRealtimeSubscribed = true
      } catch (err) {
        console.warn('Realtime aboneliği başlatılamadı:', err)
      }
    }
  }

  const fetchRecords = async () => {
    isLoading.value = true
    initClient()

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('fault_records')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) {
          records.value = data as FaultRecord[]
          saveToLocalStorage()
          setupRealtime()
        }
      } catch (err) {
        console.warn('Supabase veri çekme hatası, yerel bellek kullanılıyor:', err)
        loadFromLocalStorage()
      } finally {
        isLoading.value = false
      }
    } else {
      loadFromLocalStorage()
      isLoading.value = false
    }
  }

  const createRecord = async (dto: CreateFaultRecordDto): Promise<FaultRecord> => {
    isLoading.value = true
    initClient()

    const newRecord: FaultRecord = {
      ...dto,
      id: 'rec-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      created_at: new Date().toISOString()
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('fault_records')
          .insert([
            {
              title: dto.title.trim(),
              address: dto.address.trim(),
              phone: dto.phone.trim(),
              phone_optional: dto.phone_optional ? dto.phone_optional.trim() : null,
              first_name: dto.first_name.trim(),
              last_name: dto.last_name.trim()
            }
          ])
          .select()
          .single()

        if (error) throw error
        records.value.unshift(data as FaultRecord)
        return data as FaultRecord
      } catch (err) {
        records.value.unshift(newRecord)
        saveToLocalStorage()
        return newRecord
      } finally {
        isLoading.value = false
      }
    } else {
      records.value.unshift(newRecord)
      saveToLocalStorage()
      isLoading.value = false
      return newRecord
    }
  }

  const updateRecord = async (id: string, updates: UpdateFaultRecordDto): Promise<FaultRecord | null> => {
    isLoading.value = true
    initClient()

    const index = records.value.findIndex(r => r.id === id)
    if (index === -1) {
      isLoading.value = false
      return null
    }

    const current = records.value[index]
    const updatedRecord: FaultRecord = {
      ...current,
      title: updates.title !== undefined ? updates.title.trim() : current.title,
      address: updates.address !== undefined ? updates.address.trim() : current.address,
      phone: updates.phone !== undefined ? updates.phone.trim() : current.phone,
      phone_optional: updates.phone_optional !== undefined ? (updates.phone_optional ? updates.phone_optional.trim() : '') : current.phone_optional,
      first_name: updates.first_name !== undefined ? updates.first_name.trim() : current.first_name,
      last_name: updates.last_name !== undefined ? updates.last_name.trim() : current.last_name
    }

    if (supabase) {
      try {
        const payload: any = {}
        if (updates.title !== undefined) payload.title = updates.title.trim()
        if (updates.address !== undefined) payload.address = updates.address.trim()
        if (updates.phone !== undefined) payload.phone = updates.phone.trim()
        if (updates.phone_optional !== undefined) payload.phone_optional = updates.phone_optional ? updates.phone_optional.trim() : null
        if (updates.first_name !== undefined) payload.first_name = updates.first_name.trim()
        if (updates.last_name !== undefined) payload.last_name = updates.last_name.trim()

        const { data, error } = await supabase
          .from('fault_records')
          .update(payload)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        if (data) {
          records.value[index] = data as FaultRecord
          saveToLocalStorage()
          return data as FaultRecord
        }
      } catch (err) {
        console.warn('Supabase güncelleme hatası, yerel bellek güncelleniyor:', err)
        records.value[index] = updatedRecord
        saveToLocalStorage()
        return updatedRecord
      } finally {
        isLoading.value = false
      }
    }

    records.value[index] = updatedRecord
    saveToLocalStorage()
    isLoading.value = false
    return updatedRecord
  }

  const deleteRecord = async (id: string) => {
    initClient()
    records.value = records.value.filter(r => r.id !== id)

    if (supabase) {
      try {
        await supabase.from('fault_records').delete().eq('id', id)
      } catch (err) {
        console.error('Silme hatası:', err)
      }
    }

    saveToLocalStorage()
  }

  const totalCount = computed(() => records.value.length)

  return {
    records,
    isLoading,
    totalCount,
    isSupabaseConnected,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord
  }
}

