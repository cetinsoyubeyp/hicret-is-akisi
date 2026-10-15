# Hicret İş Akışı - Teknoloji Yığını ve Mimari Dökümantasyonu (technologies.md)

Bu döküman, Hicret İş Akışı Teknik Servis Arıza Kayıt Arşivi'nin kullandığı teknolojileri, mimari kararları, klasör yapısını ve veri şemasını açıklar.

---

## 🛠️ Temel Teknoloji Yığını

### 1. Frontend & Framework
- **Framework:** [Nuxt 3](https://nuxt.com/) (Vue 3 tabanlı tam yığın meta-framework)
  - Composition API (`<script setup>`) ile reaktif veri yönetimi
  - Modal menü ve dialog etkileşimi
- **Stil & Arayüz:** [Tailwind CSS](https://tailwindcss.com/)
  - Soft SaaS arayüz tasarımı (`rounded-xl` / `rounded-2xl`, yumuşak gölgeler)
  - **Net Dikey Sütun Ayrımı:** Tablo sütunları arasında belirgin dikey çizgiler (`border-r border-slate-200`) ile karışıklık önlenmiştir.
  - **Renk Paleti:**
    - Saf Beyaz (`#FFFFFF`) ve Soft Arka Plan (`bg-slate-50/60`)
    - Kurumsal & Soft Mavi (`#2563EB`) - Birincil kayıt butonu ve kopyalama bağlantıları
    - Soft Kırmızı Vurgular (`#DC2626`) - Zorunlu alan işaretleri ve silme aksiyonları
- **Tipografi:**
  - `Plus Jakarta Sans`: Kurumsal arayüz ve gövde metinleri
  - `JetBrains Mono`: Telefon numaraları, sıra numaraları ve tarih göstergeleri

### 2. Veritabanı & Backend (BaaS)
- **Veritabanı:** [Supabase](https://supabase.com/) & Yerel Ön Bellek (LocalStorage)
  - İstemci: `@supabase/supabase-js`
  - Arşiv verileri hem Supabase üzerinde hem de çevrimdışı kullanım için yerel depolamada saklanır.

### 3. Akıllı Adres Tamamlama & Coğrafi Veri (Geocoder)
- **Motor:** Photon (OpenStreetMap Türkiye Veritabanı) & Nominatim Fallback
- **API Rotası:** `/server/api/address-suggest.get.ts`
- **Maliyet & Hız:** 0 TL (Tamamen ücretsiz, API key veya kredi kartı gerektirmez), ~100ms yanıt süresi.
- **Kabiliyet:** Harf harf canlı öneri listesi ve eksik mahalle/sokak/ilçe/il bilgilerini anında resmi formatta tamamlama.
- **Arayüz Mimarisi:** Menü dışına taşmayan, form akışıyla uyumlu ve bağımsız kaydırma çubuğuna (`max-h-48 overflow-y-auto`) sahip iç panel düzeni.

---

## 🗄️ Arşiv Veri Modeli (Data Schema)

### Tablo: `fault_records` (Arıza Kayıt Arşivi)
| Kolon Adı | Veri Tipi | Açıklama |
|---|---|---|
| `id` | `UUID` / `String` | Benzersiz kayıt tanımlayıcı (Primary Key) |
| `first_name` | `TEXT` | **İsim** (Zorunlu) |
| `last_name` | `TEXT` | **Soyisim** (Zorunlu) |
| `phone` | `TEXT` | **No** - Birincil İletişim Numarası (Zorunlu) |
| `phone_optional` | `TEXT` | **Opsiyonel No** - İkincil İletişim Numarası |
| `title` | `TEXT` | **Arıza Başlığı** (Zorunlu) |
| `address` | `TEXT` | **Adres** (Zorunlu) |
| `created_at` | `TIMESTAMPTZ` | Kayıt oluşturulma tarihi |

---

## 📁 Proje Bileşen Mimarisi

```
hicretisakisi/
├── components/
│   ├── AppHeader.vue            # Kurumsal soft logo ve başlık
│   ├── RecordForm.vue           # Geniş (max-w-2xl), ferah modal menü ve opsiyonel telefon toggle anahtarı
│   ├── RecordList.vue           # Sütunları net çizgilerle ayrılmış arşiv tablosu (1-tıkla WhatsApp butonu)
│   ├── RecordModal.vue          # Arşiv kayıt detay ve WhatsApp iletim penceresi
│   └── WhatsAppDispatchModal.vue# Kayıt sonrası 1-tıkla WhatsApp grubuna yönlendirme modalı
├── composables/
│   └── useFaultRecords.ts       # Yalın arşiv veri yönetimi ve Supabase/LocalStorage entegrasyonu
├── utils/
│   └── whatsapp.ts              # Emojili kurumsal mesaj şablonu, harita linki ve Deeplink üretimi
├── types/
│   └── ticket.ts                # Yalın FaultRecord TypeScript tipi
├── app.vue                      # Arşiv kontrol barı (+ Yeni Kayıt butonu), modal orkestrasyonu
├── task.md                      # Planlanan ve yapılacak görevler listesi
├── completed.md                 # Tamamlanan işler kronolojik günlüğü
└── technologies.md              # Teknoloji ve mimari dökümanı (Bu dosya)
```

---

## 🚀 Çalıştırma Talimatları

```bash
# Geliştirme sunucusunu başlatmak için:
npm run dev

# Canlı derleme testi için:
npm run build
```
