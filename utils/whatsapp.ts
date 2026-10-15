import type { FaultRecord } from '~/types/ticket'

/**
 * Arıza kaydını WhatsApp grubuna veya ustaya iletilmek üzere 
 * emojili, temiz ve Google Maps navigasyon bağlantılı standart formata dönüştürür.
 */
export const formatWhatsAppMessage = (record: FaultRecord): string => {
  const dateFormatted = record.created_at 
    ? new Date(record.created_at).toLocaleString('tr-TR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : new Date().toLocaleString('tr-TR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })

  const lines = [
    '🚨 *YENİ ARIZA KAYDI - HİCRET TEKNİK SERVİS*',
    '',
    `👤 *Müşteri:* ${record.first_name} ${record.last_name}`,
    `🔧 *Arıza:* ${record.title}`,
    `📞 *Telefon:* ${record.phone}`
  ]

  if (record.phone_optional && record.phone_optional.trim()) {
    lines.push(`📞 *Opsiyonel Tel:* ${record.phone_optional.trim()}`)
  }

  lines.push(`📍 *Servis Adresi:* ${record.address}`)
  lines.push(`📅 *Kayıt Tarihi:* ${dateFormatted}`)

  if (record.address && record.address.trim()) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(record.address.trim())}`
    lines.push(`🗺️ *Navigasyon / Harita:* ${mapsUrl}`)
  }

  return lines.join('\n')
}

/**
 * WhatsApp Deeplink oluşturur. Telefon numarası verilmediğinde WhatsApp otomatik olarak 
 * "Kişi veya Grup Seç" ekranı ile açılır, teknisyen grubu seçip tek tıkla gönderebilir.
 */
export const getWhatsAppShareUrl = (record: FaultRecord): string => {
  const message = formatWhatsAppMessage(record)
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
}

/**
 * WhatsApp'ı yeni sekmede/uygulamada açar.
 */
export const openWhatsAppDispatch = (record: FaultRecord): void => {
  if (typeof window !== 'undefined') {
    const url = getWhatsAppShareUrl(record)
    window.open(url, '_blank')
  }
}
