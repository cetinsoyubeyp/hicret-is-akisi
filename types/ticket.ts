export interface FaultRecord {
  id: string
  title: string            // Arıza Başlığı
  address: string          // Adres
  phone: string            // No (Birincil İletişim)
  phone_optional?: string  // Opsiyonel No (İkincil İletişim)
  first_name: string       // İsim
  last_name: string        // Soyisim
  created_at: string
}

export type CreateFaultRecordDto = Omit<FaultRecord, 'id' | 'created_at'>
export type UpdateFaultRecordDto = Partial<CreateFaultRecordDto>
