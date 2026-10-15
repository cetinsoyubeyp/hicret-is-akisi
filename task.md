# Hicret İş Akışı - Yapılacaklar Listesi (task.md)

Bu dosya, teknik servis iş akışı ve arıza takip yönetim sistemi için planlanan ve yürütülecek görevleri listeler.

---

## 📍 Aşama 2.10: WhatsApp İletim Modalı Buton Boyutlarının Eşitlenmesi (TAMAMLANDI)
- [x] Kullanıcının talebi ve ilettiği ekran görüntüsü doğrultusunda:
  - [x] `components/WhatsAppDispatchModal.vue` altındaki üç buton ("Metni Kopyala", "Kapat", "Gruba İlet") `grid grid-cols-3 gap-2.5` mimarisine alındı.
  - [x] Tüm butonlar eşit yükseklik (`h-11`), eşit genişlik (%33.33) ve aynı köşe yuvarlaklığı (`rounded-xl`) ile milimetrik eşitlendi.
  - [x] Buton metinlerinin alt satıra kırılması (`line-wrap`) engellendi (`whitespace-nowrap`), modal genişliği `max-w-lg` yapılarak ferah bir görünüm sağlandı.
- [x] `npm run build` ile 0 hata derleme doğrulaması yapıldı.

---

## 📍 Aşama 2.9: Mockup Verilerin Temizlenmesi, Supabase Kurulumu ve Vercel Dağıtım Hazırlığı (TAMAMLANDI)
- [x] Tüm sahte (mockup) test verileri kod tabanından tamamen kaldırıldı (`composables/useFaultRecords.ts`):
  - [x] `INITIAL_ARCHIVE_RECORDS` silindi; `records.value` varsayılan olarak boş liste `[]` yapıldı.
  - [x] Tarayıcı yerel hafızasındaki (LocalStorage) eski mock ID'ler (`rec-1`, `rec-2`, `rec-3`) otomatik filtrelendi/temizlendi.
  - [x] Supabase Realtime desteği eklendi (`setupRealtime`): Çoklu cihazda veya telefonda kayıt eklendiğinde liste anında canlı senkronize olur.
- [x] Güncel ve yalınlaştırılmış Supabase PostgreSQL şema dosyası hazırlandı (`supabase/schema.sql`):
  - [x] 6 temel alan: `first_name`, `last_name`, `phone`, `phone_optional`, `title`, `address` + `id`, `created_at`, `updated_at`.
  - [x] Hızlı arama indeksleri (telefon, isim, tarih).
  - [x] Row Level Security (RLS) politikaları ve Realtime yayını (`supabase_realtime`) yapılandırıldı.
- [x] Ortam değişkenleri ve yapılandırma:
  - [x] `nuxt.config.ts`: Hem standart `SUPABASE_URL` / `SUPABASE_KEY` hem de Vercel/Nuxt `NUXT_PUBLIC_SUPABASE_...` formatları desteklendi.
  - [x] Açıklayıcı `.env.example` hazırlandı.
- [x] Git & Vercel Yapılandırması:
  - [x] Standart ve güvenli `.gitignore` dosyası oluşturuldu (`.env`, `node_modules`, `.output` vb. korundu).
  - [x] `git init` ile proje kök dizini bağımsız Git repository olarak yapılandırıldı.
  - [x] `npm run build` ile 0 hata derleme doğrulaması yapıldı.

---

## 📍 Aşama 2.8: WhatsApp Grubuna 1-Tıkla İletim (Yöntem 3 - 0 TL & Sıfır Kurulum) (TAMAMLANDI)
- [x] Ortak WhatsApp mesaj biçimlendirme ve iletme aracı oluşturuldu (`utils/whatsapp.ts`):
  - [x] Emojili, kurumsal ve sahada ustaya özel Google Maps navigasyon bağlantılı standart mesaj şablonu:
    - 🚨 *YENİ ARIZA KAYDI - HİCRET TEKNİK SERVİS*
    - 👤 *Müşteri:* İsim Soyisim
    - 🔧 *Arıza:* Arıza Başlığı
    - 📞 *Telefon:* Telefon No (+ Varsa Opsiyonel Sabit/Cep)
    - 📍 *Servis Adresi:* Açık Adres
    - 📅 *Kayıt Tarihi:* Gün/Ay/Yıl Saat
    - 🗺️ *Navigasyon / Harita:* Doğrudan Google Maps rota/navigasyon bağlantısı
  - [x] Evrensel WhatsApp Deeplink altyapısı (`openWhatsAppDispatch`): Telefon numarası olmadan açıldığında WhatsApp doğrudan "Kişi veya Grup Seç" ekranı ile açılır, usta/sekreter sadece servis grubuna dokunup gönderir.
- [x] Yeni kayıt oluşturulduğunda otomatik beliren şık WhatsApp İletim Modalı (`components/WhatsAppDispatchModal.vue`):
  - [x] Arıza kaydı eklendiğinde hemen açılır, özet bilgiler ve opsiyonel mesaj önizlemesi sunar.
  - [x] Doğrudan kullanıcı tıklaması (`click`) ile tetiklendiği için modern tarayıcıların popup engelleyicisine (popup blocker) takılmaz.
  - [x] Tek tıkla "📲 WhatsApp Grubuna İlet" butonu, "Metni Kopyala" ve "Kapat" seçenekleri.
- [x] `components/RecordList.vue` tablosundaki "İşlem" sütununa tek tıkla doğrudan WhatsApp grubuna iletme butonu (yeşil WhatsApp ikonu) entegre edildi.
- [x] `components/RecordModal.vue` detay penceresindeki buton "📲 WhatsApp Grubuna İlet" olarak güncellendi ve ortak `utils/whatsapp.ts` formatı ile senkronize edildi.
- [x] `npm run build` ile 0 hata derleme doğrulaması yapıldı.

---

## 📍 Aşama 2.7: Servis Notu Alanının Sistemden Tamamen Kaldırılması (TAMAMLANDI)
- [x] Kullanıcı talebi doğrultusunda "Servis Notu / Yapılan İşlem (Opsiyonel)" tüm bileşen ve tiplerden kaldırıldı:
  - [x] `components/RecordForm.vue`: Servis Notu metin alanı ve ilgili form/güncelleme mantığı kaldırıldı.
  - [x] `components/RecordModal.vue`: Servis notu kartı ve WhatsApp mesajına eklenen not satırı temizlendi.
  - [x] `components/RecordList.vue`: Tablodaki servis notu rozetleri (📝 Notlu), arama çubuğundaki "not ile ara" ifadesi ve arama filtresindeki not kontrolü kaldırıldı.
  - [x] `composables/useFaultRecords.ts`: Mock veriler, `createRecord` ve `updateRecord` içindeki not atamaları kaldırıldı.
  - [x] `types/ticket.ts`: `FaultRecord` tipinden `notes` alanı temizlendi.
- [x] `npm run build` ile 0 hata derleme doğrulaması yapıldı.

---

## 📍 Aşama 2.6: Detay Penceresi Sadeleştirme (Düzenle Butonunun Kaldırılması) (TAMAMLANDI)
- [x] Kullanıcı talebi doğrultusunda:
  - [x] `RecordModal.vue` detay penceresindeki "Düzenle" butonu kaldırıldı.
  - [x] Kayıt düzenleme işlemi yalnızca tablodaki "İşlem" sütunundaki mavi kalem butonu (✏️) üzerinden yapılacak şekilde sadeleştirildi.
  - [x] Detay penceresi sadece bilgi okuma ve "WhatsApp ile Paylaş" odaklı tutuldu.
- [x] `npm run build` ile 0 hata derleme doğrulaması yapıldı.

---

## 📍 Aşama 2.5: Hızlı Kayıt Düzenleme ve Servis Notu (TAMAMLANDI)
- [x] Kayıt düzenleme altyapısı kuruldu:
  - [x] `types/ticket.ts` içine `UpdateFaultRecordDto` ve `notes?: string` eklendi.
  - [x] `composables/useFaultRecords.ts` içerisine `updateRecord` fonksiyonu yazıldı (Supabase & LocalStorage tam senkronizasyon).
  - [x] `RecordForm.vue` hem yeni kayıt hem de mevcut kaydı düzenleme (Edit Mode) desteğine kavuşturuldu.
  - [x] Servis Notu / Yapılan İşlem metin alanı eklendi.
  - [x] `RecordModal.vue` detay penceresinde servis notu vurgulandı, WhatsApp mesaj metnine dahil edildi ve "✏️ Düzenle" butonu eklendi.
  - [x] `RecordList.vue` tablosunda "İşlem" sütununa tek tıkla düzenleme butonu (✏️) ve tabloda servis notu rozeti (📝) entegre edildi.

---

## 📍 Aşama 2.4: Hızlı Tarih Filtresi (Direkt Tarih & Tarih Aralığı) (TAMAMLANDI)
- [x] Soft hap (pill) butonlarla hızlı filtreleme eklendi:
  - [x] `Tümü`, `Bugün`, `Dün`, `Bu Hafta`, `Bu Ay` önayarları geliştirildi.
  - [x] **Özel Tarih Seçici:** Hem "Belirli Bir Gün" tek takvim seçimi hem de "Tarih Aralığı" (Başlangıç - Bitiş) desteği eklendi.
  - [x] Filtreyi tek tıkla sıfırlama butonu ve filtrelenen kayıt sayısı göstergesi eklendi.
- [x] `npm run build` ile 0 hata derleme doğrulaması yapıldı.

---

## 📍 Aşama 2.3: Vite `#app-manifest` Çakışma Önlemi ve Geliştirici Sunucusu İyileştirmesi (TAMAMLANDI)
- [x] Arka planda `build` çalışırken açık olan `nuxt dev` sunucusunun `.nuxt/dist` temizliği kaynaklı yaşadığı anlık `#app-manifest` çözümleme çakışması incelendi.
- [x] `nuxt.config.ts` dosyasına `experimental: { appManifest: false }` yapılandırması eklenerek Vite ön-dönüşüm (pre-transform) hataları tamamen engellendi.

---

## 📍 Aşama 2.2: Adres Öneri Listesi Taşma ve Kaydırma (Scroll) Çözümü (TAMAMLANDI)
- [x] Modal içerisindeki taşma ve kaydırma problemi giderildi:
  - [x] Menü dışına taşan `absolute` dropdown yapısı kaldırıldı; yerine textarea'nın hemen altında form akışında yer alan ve taşmayan iç panel (`inline panel`) mimarisi kuruldu.
  - [x] Öneri paneline özel kaydırma çubuğu (`max-h-48 overflow-y-auto overscroll-contain`) eklendi, çoklu sokak/mahalle önerilerinin rahatça kaydırılması sağlandı.
  - [x] Modal penceresi dikey ekranlara duyarlı hale getirildi (`max-h-[92vh] flex flex-col`), başlık ve alt butonlar (`shrink-0`) sabitlenip gövde alanı kaydırılabilir (`overflow-y-auto flex-1`) yapıldı.
- [x] `npm run build` ile 0 hata derleme doğrulaması yapıldı.

---

## 📍 Aşama 2.1: Adres Tamamlama Motoru Hata Düzeltmesi ve Güçlendirme (TAMAMLANDI)
- [x] Adres tamamlama servisinin çalışmama nedeninin tespiti ve giderilmesi:
  - [x] Photon API'sinde `lang=tr` parametresinin 400 Bad Request hatası döndürdüğü tespit edildi ve kaldırıldı.
  - [x] Arama metnindeki gereksiz Türkçe dolgu kelimelerini ("mahallesi", "sk", "sokak") temizleyen akıllı normalizer yazıldı (`çamlıkule mahallesi 250 sk` -> `çamlıkule 250`).
  - [x] Sonuç bulunamaması durumuna karşı OpenStreetMap Nominatim yedek motoru eklendi.
  - [x] Arayüzde önerilere tıklamayı kesinleştiren `@mousedown.prevent` ve anlık "Adres otomatik tamamlandı" bildirim rozeti entegre edildi.
- [x] Derleme testi (`npm run build`) 0 hata ile doğrulandı.

---

## 📍 Aşama 2.0: Akıllı ve Hızlı Otomatik Adres Tamamlama (TAMAMLANDI)
- [x] Nuxt Nitro API katmanında `/server/api/address-suggest.get.ts` rotası geliştirildi.
- [x] Photon / OpenStreetMap Türkiye veritabanı entegrasyonu sağlandı.
- [x] Canlı açılır öneri dropdown listesi ve "✨ Akıllı Tamamla" butonu eklendi.

---

## 🛠️ Aşama 1.10: SVG Boyutlandırma ve Buton Orantı Düzeltmesi (TAMAMLANDI)
- [x] Buton içi SVG ikonlarının fiziksel boyutlandırılması ve buton kenar boşlukları tamamlandı.

---

## 🎨 Aşama 1.9: Zorunlu İşaretlerin Kaldırılması ve Buton Boşluklarının İyileştirilmesi (TAMAMLANDI)
- [x] Kırmızı zorunlu alan noktaları (`bg-rose-500`) temizlendi.
- [x] Modal ve tablo buton boşlukları ferahlatıldı.

---

## 💎 Aşama 1.8: Modal Menü Tasarımı, Renk Uyumu, Tipografi ve Border Revizyonu (TAMAMLANDI)
- [x] Modal menü tasarımı modern SaaS estetiğiyle yenilendi.
- [x] İnce borderlar, yumuşak gölgeler ve iOS tarzı toggle entegre edildi.

---

## 📐 Aşama 1.7: Modal Menü Genişletme ve Kompakt Toggle Özelliği (TAMAMLANDI)
- [x] Pencere genişliği `max-w-2xl` seviyesine çıkarıldı ve iç boşluklar ferahlatıldı.
- [x] No altına opsiyonel no toggle anahtarı eklendi.

---

## 📦 Aşama 1.6: Kayıt Arşivi ve Modal Menüye Geçiş (TAMAMLANDI)
- [x] Öncelik ve durum mekanizmaları kaldırıldı (saf arşiv yapısı).
- [x] "+ Yeni Arıza Kaydı Oluştur" butonu ve modal menü açılışı eklendi.
- [x] Tablo net dikey sütun çizgileri (`border-r`) ile yapılandırıldı.

---

## 🎨 Aşama 1.5: Kullanıcı Arayüzü Sadeleştirme ve Soft Tasarım Revizyonu (TAMAMLANDI)
- [x] Soft SaaS temasına geçildi, gereksiz teknik kalabalıklar temizlendi, kurumsal soft logo eklendi.

---

## 🎯 Aşama 1: Çekirdek Altyapı ve Veri Alanları (TAMAMLANDI)
- [x] Zorunlu 6 alan (Arıza Başlığı, Adres, No, Opsiyonel No, İsim, Soyisim) yapılandırıldı.
- [x] Nuxt 3 + Vue 3 + Tailwind CSS altyapısı ve Supabase/LocalStorage hibrit veri yapısı kuruldu.

---

## 🚀 Aşama 3: Sıradaki Geliştirmeler (Backlog)
- [ ] Arşiv kayıtlarını Excel / CSV olarak dışa aktarma (Export)
- [ ] Tek Tıkla Kurumsal "Servis Fişi / Çıktısı" (PDF / Yazdır)
- [ ] Tekrarlayan müşteri / cihaz geçmişi takibi
- [ ] Toplu kayıt silme veya arşivleme desteği
