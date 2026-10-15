-- ==============================================================================
-- HİCRET TEKNİK SERVİS - POSTGRESQL / SUPABASE VERİTABANI ŞEMASI
-- ==============================================================================
-- Bu SQL kodunu Supabase Dashboard > SQL Editor alanına yapıştırıp "Run" butonuna basarak
-- veritabanı tablosunu, indeksleri ve izinleri 5 saniyede otomatik oluşturabilirsiniz.

-- 1. Arıza Kayıtları Tablosu (fault_records)
CREATE TABLE IF NOT EXISTS fault_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,                  -- Müşteri Adı
    last_name TEXT NOT NULL,                   -- Müşteri Soyadı
    phone TEXT NOT NULL,                       -- No (Telefon)
    phone_optional TEXT,                       -- Opsiyonel No (İkinci Telefon / Sabit Hat)
    title TEXT NOT NULL,                       -- Arıza Başlığı
    address TEXT NOT NULL,                     -- Servis Adresi
    created_at TIMESTAMPTZ DEFAULT NOW(),      -- Kayıt Tarihi
    updated_at TIMESTAMPTZ DEFAULT NOW()       -- Güncellenme Tarihi
);

-- 2. Hızlı Arama ve Sıralama İndeksleri
CREATE INDEX IF NOT EXISTS idx_fault_records_created_at ON fault_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fault_records_phone ON fault_records(phone);
CREATE INDEX IF NOT EXISTS idx_fault_records_name ON fault_records(first_name, last_name);

-- 3. Otomatik Güncelleme Zamanı (updated_at trigger)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_fault_records_updated_at ON fault_records;
CREATE TRIGGER set_fault_records_updated_at
BEFORE UPDATE ON fault_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Satır Düzeyi Güvenlik (Row Level Security - RLS)
ALTER TABLE fault_records ENABLE ROW LEVEL SECURITY;

-- Anonim ve giriş yapmış tüm istemcilerin okuma, ekleme, güncelleme ve silme yapabilmesine izin veren politika
DROP POLICY IF EXISTS "Public full access policy" ON fault_records;
DROP POLICY IF EXISTS "Enable all access for anon and authenticated" ON fault_records;

CREATE POLICY "Enable all access for anon and authenticated" ON fault_records
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 5. Canlı Senkronizasyon (Supabase Realtime - Çoklu Cihaz Anlık Güncelleme)
-- Bir cihazda arıza eklendiğinde veya silindiğinde diğer tüm ekranlar anında güncellenir.
ALTER PUBLICATION supabase_realtime ADD TABLE fault_records;
