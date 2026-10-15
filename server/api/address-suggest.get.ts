export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawSearchText = (query.q as string || '').trim()

  if (!rawSearchText || rawSearchText.length < 2) {
    return { suggestions: [] }
  }

  // 1. Türkçe adres kelimelerini temizleyip arama motorunun en iyi anlayacağı anahtar kelimeleri çıkar
  // Örn: "çamlıkule mahallesi 250 sk no 12" -> "çamlıkule 250"
  const cleanQuery = (text: string): string => {
    return text
      .replace(/\b(mahallesi|mahallle|mah\.|mah)\b/gi, '')
      .replace(/\b(sokağı|sokak|soka|sk\.|sk|sok)\b/gi, '')
      .replace(/\b(caddesi|cadde|cad\.|cad)\b/gi, '')
      .replace(/\b(bulvarı|bulvar|blv\.|blv)\b/gi, '')
      .replace(/\b(no\s*:\s*\d+|no\s+\d+|kapı\s+no\s*\d+)/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Kapı no varsa yakala (Örn: "no: 12" veya "no 5")
  const doorMatch = rawSearchText.match(/\b(?:no\s*:\s*|no\s+|kapı\s+no\s*|\#\s*)(\d+[a-zA-Z]?)\b/i)
  const doorNumber = doorMatch ? doorMatch[1] : ''

  const cleaned = cleanQuery(rawSearchText)
  const searchQuery = cleaned.length >= 2 ? cleaned : rawSearchText

  const results: any[] = []

  // 2. Photon Geocoder üzerinden sorgula (Hızlı ve Ücretsiz, Türkiye merkez koordinat bias'lı)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=39.0&lon=35.0&limit=6`
    
    const response = await fetch(photonUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'HicretServis/1.0'
      }
    })

    if (response.ok) {
      const data = await response.json()
      const features = data.features || []

      for (const f of features) {
        const p = f.properties || {}

        // Sadece Türkiye lokasyonlarını al
        if (p.countrycode && p.countrycode.toUpperCase() !== 'TR') {
          continue
        }

        const mahalle = p.district ? (p.district.includes('Mah') ? p.district : `${p.district} Mah.`) : ''
        
        let sokak = p.street || p.name || ''
        if (doorNumber) {
          sokak += ` No: ${doorNumber}`
        } else if (p.housenumber) {
          sokak += ` No: ${p.housenumber}`
        }

        const ilce = p.city || ''
        const il = (p.state && p.state !== p.city) ? p.state : ''

        // Format: Mahalle, Sokak, İlçe / İl
        const parts: string[] = []
        if (mahalle) parts.push(mahalle)
        if (sokak && sokak !== mahalle && sokak !== p.district) parts.push(sokak)
        if (ilce) parts.push(ilce)
        if (il) parts.push(il)

        const fullAddress = parts.filter(Boolean).join(', ')

        if (fullAddress) {
          results.push({
            fullText: fullAddress,
            title: sokak || mahalle,
            district: mahalle,
            city: ilce,
            state: il,
            postcode: p.postcode || ''
          })
        }
      }
    }
  } catch (err) {
    console.error('Photon sorgu hatası:', err)
  }

  // 3. Eğer Photon az sonuç verdiyse veya sonuç bulamadıysa Nominatim ile dene (Yedek Güçlü Motor)
  if (results.length === 0) {
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(rawSearchText)}&format=json&addressdetails=1&limit=4&countrycodes=tr`
      const nomRes = await fetch(nomUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HicretServis/1.0 (hicret.teknik.servis@gmail.com)'
        }
      })

      if (nomRes.ok) {
        const nomData = await nomRes.json()
        for (const item of nomData) {
          const addr = item.address || {}
          const mahalle = addr.suburb || addr.neighbourhood ? `${addr.suburb || addr.neighbourhood} Mah.` : ''
          let sokak = addr.road || ''
          if (doorNumber) sokak += ` No: ${doorNumber}`
          const ilce = addr.town || addr.city_district || addr.district || ''
          const il = addr.province || addr.city || addr.state || ''

          const parts = [mahalle, sokak, ilce, il].filter(Boolean)
          const fullAddress = parts.join(', ')

          if (fullAddress) {
            results.push({
              fullText: fullAddress,
              title: sokak || mahalle,
              district: mahalle,
              city: ilce,
              state: il,
              postcode: addr.postcode || ''
            })
          }
        }
      }
    } catch (err) {
      console.error('Nominatim fallback hatası:', err)
    }
  }

  // Yinelenen adresleri temizle
  const unique = results.filter((item, index, self) =>
    index === self.findIndex((t) => t.fullText.toLowerCase() === item.fullText.toLowerCase())
  )

  return { suggestions: unique }
})
