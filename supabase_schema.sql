-- =============================================================================
-- ÖZATE ÇİFTLİĞİ ERP - SUPABASE POSTGRESQL NORMALİZE VERİTABANI ŞEMASI
-- Hedef Platform: Supabase (PostgreSQL 15+)
-- Mimari: Tam İlişkisel, Normalize Tablolar, RLS ve Dış Anahtarlar (Foreign Keys)
-- =============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. ÇİFTLİK VE İŞLETME BİLGİLERİ (FARM SETTINGS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farm_settings (
    id INT PRIMARY KEY DEFAULT 1,
    name VARCHAR(255) NOT NULL DEFAULT 'Özate Büyükbaş Hayvancılık & Süt Çiftliği',
    location VARCHAR(255) DEFAULT 'Bursa, Türkiye',
    owner VARCHAR(255) DEFAULT 'Özate Ailesi',
    currency VARCHAR(10) DEFAULT 'TRY',
    active_cows INT DEFAULT 148,
    phone VARCHAR(50) DEFAULT '0532 000 00 00',
    email VARCHAR(100) DEFAULT 'info@ozateciftlik.com',
    tax_id VARCHAR(50) DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_farm_row CHECK (id = 1)
);

-- =============================================================================
-- 2. ÇİFTLİK PARAMETRELERİ & TANIMLARI (FARM PARAMETERS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farm_parameters (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- incomeCategories, expenseCategories, paddocks, breeds vb.
    item_name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category, item_name)
);

-- =============================================================================
-- 3. KASA VE BANKA HESAPLARI (ACCOUNTS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('BANK', 'CASH', 'POS')),
    iban VARCHAR(100) DEFAULT '-',
    balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. CARİ HESAPLAR - MÜŞTERİ & TEDARİKÇİ (CONTACTS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('CUSTOMER', 'SUPPLIER')),
    phone VARCHAR(50) DEFAULT '',
    balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 5. BÜYÜKBAŞ SÜRÜ VE HAYVANLAR (CATTLE ANIMALS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS cattle_animals (
    id VARCHAR(50) PRIMARY KEY,
    ear_tag VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(80) NOT NULL,
    category VARCHAR(80) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Dişi', 'Erkek')),
    paddock VARCHAR(80) NOT NULL,
    weight NUMERIC(8, 2) NOT NULL DEFAULT 0,
    yield VARCHAR(100) DEFAULT '',
    status VARCHAR(80) DEFAULT 'Sağmal (Aktif)',
    health VARCHAR(80) DEFAULT 'Mükemmel',
    dam VARCHAR(50) DEFAULT '-',
    sire VARCHAR(100) DEFAULT '-',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Büyükbaş Tartım Geçmişi (Cattle Weights)
CREATE TABLE IF NOT EXISTS cattle_weights (
    id SERIAL PRIMARY KEY,
    animal_id VARCHAR(50) NOT NULL REFERENCES cattle_animals(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight NUMERIC(8, 2) NOT NULL,
    adg VARCHAR(50) DEFAULT '',
    paddock VARCHAR(80) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Büyükbaş Sağlık ve Aşı Geçmişi (Cattle Health Logs)
CREATE TABLE IF NOT EXISTS cattle_health_logs (
    id SERIAL PRIMARY KEY,
    animal_id VARCHAR(50) NOT NULL REFERENCES cattle_animals(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    procedure VARCHAR(255) NOT NULL,
    staff VARCHAR(100) DEFAULT '',
    result VARCHAR(100) DEFAULT 'Tamamlandı',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 6. KÜÇÜKBAŞ SÜRÜ YÖNETİMİ (SHEEP ANIMALS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS sheep_animals (
    id VARCHAR(50) PRIMARY KEY,
    ear_tag VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(80) NOT NULL,
    category VARCHAR(80) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Dişi', 'Erkek')),
    barn VARCHAR(80) NOT NULL,
    weight NUMERIC(8, 2) NOT NULL DEFAULT 0,
    birth_type VARCHAR(50) DEFAULT 'Tekiz',
    status VARCHAR(80) DEFAULT 'Aktif Sürüde',
    repro_status VARCHAR(80) DEFAULT 'Boş',
    mating_date VARCHAR(50) DEFAULT '',
    mating_ram VARCHAR(100) DEFAULT '',
    est_lambing_date VARCHAR(50) DEFAULT '',
    dam VARCHAR(50) DEFAULT '-',
    sire VARCHAR(100) DEFAULT '-',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Küçükbaş Sağlık Geçmişi (Sheep Health Logs)
CREATE TABLE IF NOT EXISTS sheep_health_logs (
    id SERIAL PRIMARY KEY,
    sheep_id VARCHAR(50) NOT NULL REFERENCES sheep_animals(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    procedure VARCHAR(255) NOT NULL,
    staff VARCHAR(100) DEFAULT '',
    result VARCHAR(100) DEFAULT 'Uygulandı',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kırkım Kayıtları (Shearings)
CREATE TABLE IF NOT EXISTS sheep_shearings (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    barn VARCHAR(100) NOT NULL,
    count INT NOT NULL DEFAULT 0,
    weight NUMERIC(8, 2) NOT NULL DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Koç Katım Sezonları (Mating Seasons)
CREATE TABLE IF NOT EXISTS sheep_mating_seasons (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    barn VARCHAR(100) NOT NULL,
    ram VARCHAR(150) NOT NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. SÜT ÜRETİMİ VE TANKLAR (MILK PRODUCTION)
-- =============================================================================
CREATE TABLE IF NOT EXISTS milk_tanks (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    current_liters NUMERIC(10, 2) NOT NULL DEFAULT 0,
    capacity_liters NUMERIC(10, 2) NOT NULL DEFAULT 2000,
    temp NUMERIC(4, 1) DEFAULT 4.0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milk_productions (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    session VARCHAR(30) NOT NULL CHECK (session IN ('Sabah', 'Akşam', 'Öğle')),
    liters NUMERIC(10, 2) NOT NULL,
    tank VARCHAR(50) NOT NULL,
    fat NUMERIC(4, 2) DEFAULT 3.80,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 8. YEM VE STOK DEPOSU (INVENTORY)
-- =============================================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    min_alert NUMERIC(12, 2) NOT NULL DEFAULT 10,
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 9. FİNANS VE MUHASEBE (TRANSACTIONS & TRANSFERS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    paid_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL CHECK (status IN ('PAID', 'PARTIAL', 'UNPAID')),
    contact_id VARCHAR(50) REFERENCES contacts(id) ON DELETE SET NULL,
    account_id VARCHAR(50) REFERENCES accounts(id) ON DELETE SET NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transfers (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    from_account VARCHAR(50) NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    to_account VARCHAR(50) NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    amount NUMERIC(14, 2) NOT NULL,
    note TEXT DEFAULT 'Virman transferi',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 10. GÖREVLER VE TAKVİM (TASKS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sub_text TEXT DEFAULT '',
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(30) NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    due_date DATE NOT NULL,
    assignee VARCHAR(100) NOT NULL,
    related_animal VARCHAR(50) DEFAULT '',
    is_done BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 11. KULLANICILAR VE DENETİM İZİ (USERS & AUDIT LOGS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farm_users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(50) DEFAULT '',
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'VET', 'WORKER', 'ACCOUNTANT')),
    title VARCHAR(150) DEFAULT '',
    pin VARCHAR(20) DEFAULT '1923',
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp VARCHAR(50) NOT NULL,
    log_type VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 12. ÇEK TAKİP VE PORTFÖYÜ (CHECKS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS checks (
    id VARCHAR(50) PRIMARY KEY,
    check_number VARCHAR(80) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('INCOMING', 'OUTGOING')), -- INCOMING: Alınan Çek, OUTGOING: Verilen Çek
    amount NUMERIC(14, 2) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    drawer VARCHAR(150) NOT NULL, -- Keşideci
    bank_name VARCHAR(100) NOT NULL,
    branch_name VARCHAR(100) DEFAULT '',
    account_no VARCHAR(100) DEFAULT '',
    contact_id VARCHAR(50) REFERENCES contacts(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PORTFOLIO' 
        CHECK (status IN ('PORTFOLIO', 'COLLECTED', 'ENDORSED', 'PAID', 'BOUNCED', 'CANCELLED')),
    endorsed_to_contact_id VARCHAR(50) REFERENCES contacts(id) ON DELETE SET NULL,
    target_account_id VARCHAR(50) REFERENCES accounts(id) ON DELETE SET NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 13. KURBAN KESİM VE HİSSE YÖNETİMİ (QURBAN ANIMALS & SHARES)
-- =============================================================================
CREATE TABLE IF NOT EXISTS qurban_animals (
    id VARCHAR(50) PRIMARY KEY,
    qurban_no VARCHAR(50) NOT NULL UNIQUE, -- Örn: KB-01, KK-05
    animal_type VARCHAR(30) NOT NULL CHECK (animal_type IN ('BÜYÜKBAŞ', 'KÜÇÜKBAŞ')),
    source_animal_id VARCHAR(50) DEFAULT NULL,
    ear_tag VARCHAR(50) DEFAULT '',
    breed VARCHAR(80) DEFAULT '',
    live_weight NUMERIC(8, 2) NOT NULL DEFAULT 0,
    carcass_weight NUMERIC(8, 2) DEFAULT 0,
    total_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
    share_count INT NOT NULL DEFAULT 7,
    slaughter_day INT NOT NULL DEFAULT 1,
    slaughter_order INT DEFAULT NULL,
    slaughter_time VARCHAR(20) DEFAULT '',
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE'
        CHECK (status IN ('AVAILABLE', 'PARTIALLY_RESERVED', 'SOLD_OUT', 'SLAUGHTERED', 'COMPLETED')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qurban_shares (
    id VARCHAR(50) PRIMARY KEY,
    qurban_id VARCHAR(50) NOT NULL REFERENCES qurban_animals(id) ON DELETE CASCADE,
    share_index INT NOT NULL,
    shareholder_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    share_price NUMERIC(14, 2) NOT NULL,
    deposit_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN ('PAID', 'PARTIAL', 'UNPAID')),
    payment_method VARCHAR(50) DEFAULT 'CASH',
    check_id VARCHAR(50) REFERENCES checks(id) ON DELETE SET NULL,
    contact_id VARCHAR(50) REFERENCES contacts(id) ON DELETE SET NULL,
    proxy_given BOOLEAN NOT NULL DEFAULT FALSE,
    meat_weight NUMERIC(8, 2) DEFAULT 0,
    is_delivered BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 14. PERFORMANS İNDEKSLERİ (INDEXES)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_cattle_eartag ON cattle_animals(ear_tag);
CREATE INDEX IF NOT EXISTS idx_cattle_paddock ON cattle_animals(paddock);
CREATE INDEX IF NOT EXISTS idx_sheep_eartag ON sheep_animals(ear_tag);
CREATE INDEX IF NOT EXISTS idx_sheep_barn ON sheep_animals(barn);
CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_tx_contact ON transactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_tx_account ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_milk_date ON milk_productions(date);
CREATE INDEX IF NOT EXISTS idx_checks_due ON checks(due_date);
CREATE INDEX IF NOT EXISTS idx_checks_status ON checks(status);
CREATE INDEX IF NOT EXISTS idx_checks_contact ON checks(contact_id);
CREATE INDEX IF NOT EXISTS idx_qurban_order ON qurban_animals(slaughter_day, slaughter_order);
CREATE INDEX IF NOT EXISTS idx_qurban_shares_qurban ON qurban_shares(qurban_id);

-- =============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- =============================================================================
ALTER TABLE farm_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cattle_animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cattle_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE cattle_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheep_animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheep_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheep_shearings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheep_mating_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE qurban_animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE qurban_shares ENABLE ROW LEVEL SECURITY;

-- Anonim ve Doğrulanmış Kullanıcılar İçin İzinler (Supabase REST API İstemcisi)
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (
            'farm_settings', 'farm_parameters', 'accounts', 'contacts', 
            'cattle_animals', 'cattle_weights', 'cattle_health_logs', 
            'sheep_animals', 'sheep_health_logs', 'sheep_shearings', 'sheep_mating_seasons', 
            'milk_tanks', 'milk_productions', 'inventory_items', 'transactions', 
            'transfers', 'tasks', 'farm_users', 'audit_logs',
            'checks', 'qurban_animals', 'qurban_shares'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public full access policy" ON %I;', t);
        EXECUTE format('CREATE POLICY "Public full access policy" ON %I FOR ALL USING (true) WITH CHECK (true);', t);
    END LOOP;
END
$$;

-- =============================================================================
-- 16. BAŞLANGIÇ VERİLERİ (SEED DATA)
-- =============================================================================

-- Çiftlik Bilgisi
INSERT INTO farm_settings (id, name, location, owner, currency, active_cows)
VALUES (1, 'Özate Büyükbaş Hayvancılık & Süt Çiftliği', 'Bursa, Türkiye', 'Özate Ailesi', 'TRY', 148)
ON CONFLICT (id) DO NOTHING;

-- Parametreler
INSERT INTO farm_parameters (category, item_name, display_order) VALUES
('incomeCategories', 'Süt Satışı', 1),
('incomeCategories', 'Besi Hayvanı Satışı', 2),
('incomeCategories', 'Damızlık/Düve Satışı', 3),
('incomeCategories', 'Devlet Destekleri & Hibe', 4),
('incomeCategories', 'Gübre Satışı', 5),
('incomeCategories', 'Diğer Gelirler', 6),
('expenseCategories', 'Yem & Kaba Yem', 1),
('expenseCategories', 'Veteriner & İlaç', 2),
('expenseCategories', 'İşçilik & Maaş', 3),
('expenseCategories', 'Elektrik & Enerji', 4),
('expenseCategories', 'Akaryakıt & Mazot', 5),
('expenseCategories', 'Bakım & Onarım', 6),
('expenseCategories', 'Hayvan Alımı', 7),
('expenseCategories', 'Diğer Giderler', 8),
('contactCategories', 'Mandıra & Süt Alıcısı', 1),
('contactCategories', 'Yem Fabrikası / Tedarikçi', 2),
('contactCategories', 'Veteriner Kliniği & İlaç', 3),
('contactCategories', 'Mezbaha & Et Entegre', 4),
('contactCategories', 'Tarım Kredi / Kooperatif', 5),
('contactCategories', 'Bireysel Müşteri', 6),
('paddocks', 'Sağmal 1', 1),
('paddocks', 'Sağmal 2', 2),
('paddocks', 'Besi Bölme A', 3),
('paddocks', 'Besi Bölme B', 4),
('paddocks', 'Kuru Dönem', 5),
('paddocks', 'Buzağı Kulübeleri', 6),
('paddocks', 'Revir / Karantina', 7),
('breeds', 'Holstein', 1),
('breeds', 'Simental', 2),
('breeds', 'Montofon / Esmer', 3),
('breeds', 'Angus / Besi Melezi', 4),
('breeds', 'Yerli Kara', 5),
('animalCategories', 'Süt İneği', 1),
('animalCategories', 'Besi Danası', 2),
('animalCategories', 'Gebe Düve', 3),
('animalCategories', 'Buzağı', 4),
('animalCategories', 'Damızlık Boğa', 5),
('sheepBarns', 'Ağıl 1 (Anaç Koyunlar)', 1),
('sheepBarns', 'Ağıl 2 (Koç Bölmesi)', 2),
('sheepBarns', 'Ağıl 3 (Kuzulama & Toklular)', 3),
('sheepBarns', 'Ağıl 4 (Besi Kuzuları)', 4),
('sheepBarns', 'Ağıl 5 (Keçi & Oğlak Bölmesi)', 5),
('sheepBarns', 'Mera Sürüsü', 6),
('sheepBreeds', 'Merinos (Karacabey)', 1),
('sheepBreeds', 'Kıvırcık', 2),
('sheepBreeds', 'İvesi (Sütçü)', 3),
('sheepBreeds', 'Akkaraman', 4),
('sheepBreeds', 'Saanen Keçisi', 5),
('sheepCategories', 'Damızlık Koyun', 1),
('sheepCategories', 'Damızlık Koç', 2),
('sheepCategories', 'Sütten Kesilmiş Kuzu', 3),
('sheepCategories', 'Emziren Kuzu', 4),
('sheepCategories', 'Toklu / Şişek', 5),
('sheepCategories', 'Besi Kuzusu', 6),
('sheepCategories', 'Keçi / Teke', 7),
('stockCategories', 'Yem', 1),
('stockCategories', 'Kaba Yem', 2),
('stockCategories', 'İlaç/Aşı', 3),
('stockCategories', 'Katkı Maddesi', 4),
('stockCategories', 'Tohumlama', 5),
('stockCategories', 'Diğer', 6),
('accountTypes', 'Ziraat Bankası Ticari', 1),
('accountTypes', 'Çiftlik Nakit Kasası', 2),
('accountTypes', 'Tarım Kredi / Mazot Kartı', 3)
ON CONFLICT (category, item_name) DO NOTHING;

-- Hesaplar
INSERT INTO accounts (id, name, type, iban, balance) VALUES
('acc-1', 'Ziraat Bankası Ticari', 'BANK', 'TR45 0001 0090 1234 5678 5001', 185300.00),
('acc-2', 'Çiftlik Nakit Kasası', 'CASH', '-', 57500.00),
('acc-3', 'Tarım Kredi / Mazot Kartı', 'POS', 'TR12 0001 ...', 0.00)
ON CONFLICT (id) DO NOTHING;

-- Cariler
INSERT INTO contacts (id, name, type, phone, balance) VALUES
('ct-1', 'Sütaş Bursa Bölge Toplayıcısı', 'CUSTOMER', '0224 452 10 00', 64750.00),
('ct-2', 'Bursa Canlı Hayvan Pazarı Tüccarı', 'CUSTOMER', '0532 987 65 43', 21650.00),
('ct-3', 'Toros Yem & Rasyon Sanayi', 'SUPPLIER', '0224 888 22 11', -24800.00),
('ct-4', 'Nilüfer Çiftlik Veteriner Kliniği', 'SUPPLIER', '0533 111 22 33', -7300.00)
ON CONFLICT (id) DO NOTHING;

-- Tanklar
INSERT INTO milk_tanks (id, name, current_liters, capacity_liters, temp) VALUES
('Tank 1', 'Tank 1 (Ana Soğutma)', 1800, 2500, 3.7),
('Tank 2', 'Tank 2 (Yedek)', 500, 2000, 4.0)
ON CONFLICT (id) DO NOTHING;

-- Stoklar
INSERT INTO inventory_items (id, name, category, quantity, unit, min_alert, unit_cost) VALUES
('inv-1', 'Süt Yemi (19 Protein)', 'Yem', 140, 'Çuval (50kg)', 50, 580.00),
('inv-2', 'Yonca Balyası (1. Kalite)', 'Kaba Yem', 220, 'Balya', 80, 190.00),
('inv-3', 'Mısır Silajı Deposu', 'Kaba Yem', 28, 'Ton', 35, 2800.00),
('inv-4', 'Mastitis Tedavi ve Koruyucu Tüp', 'İlaç/Aşı', 8, 'Kutu', 10, 650.00),
('inv-5', 'Şap Aşısı Dozları', 'İlaç/Aşı', 160, 'Doz', 50, 45.00)
ON CONFLICT (id) DO NOTHING;

-- Kullanıcılar
INSERT INTO farm_users (id, name, email, phone, role, title, pin, status) VALUES
('usr-1', 'Ahmet Özate', 'admin@ozate.com', '0532 100 00 01', 'ADMIN', 'Çiftlik Sahibi & Genel Müdür', '1923', 'ACTIVE'),
('usr-2', 'Dr. Nilüfer Çetin', 'vet.nilufer@ozate.com', '0533 111 22 33', 'VET', 'Sorumlu Veteriner Hekim', '1923', 'ACTIVE'),
('usr-3', 'Mehmet Bakıcı', 'mehmet.bakici@ozate.com', '0544 222 33 44', 'WORKER', 'Baş Sağımcı & Sürü Sorumlusu', '1923', 'ACTIVE'),
('usr-4', 'Ayşe Muhasebe', 'muhasebe@ozate.com', '0535 333 44 55', 'ACCOUNTANT', 'Ön Muhasebe & Finans Uzmanı', '1923', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Çekler (Örnek Alınan ve Verilen Çekler)
INSERT INTO checks (id, check_number, type, amount, issue_date, due_date, drawer, bank_name, branch_name, account_no, contact_id, status, notes) VALUES
('chk-1', 'CK-884210', 'INCOMING', 45000.00, '2026-09-25', '2026-10-25', 'Bursa Et & Kasaplar Birliği', 'Vakıfbank', 'Heykel Şubesi', 'TR33 0001 ...', 'ct-2', 'PORTFOLIO', 'Besi hayvanı satışına mahsuben alınan vadeli müşteri çeki'),
('chk-2', 'CK-991204', 'INCOMING', 32500.00, '2026-10-01', '2026-11-15', 'Kemal Erdem (Kurban Hissesi)', 'İş Bankası', 'Nilüfer Şubesi', 'TR64 0006 ...', 'ct-1', 'PORTFOLIO', '2026 Kurbanlık 2 hisse peşinat ve bakiye çeki'),
('chk-3', 'CK-104921', 'OUTGOING', 55000.00, '2026-09-10', '2026-10-30', 'Özate Çiftliği İşletmesi', 'Ziraat Bankası', 'Bursa Ticari', 'TR45 0001 ...', 'ct-3', 'PORTFOLIO', 'Toros Yem sanayine 30 ton silaj ve yem bedeli için verilen çek')
ON CONFLICT (id) DO NOTHING;

-- Kurbanlık Hayvanlar
INSERT INTO qurban_animals (id, qurban_no, animal_type, source_animal_id, ear_tag, breed, live_weight, carcass_weight, total_price, share_count, slaughter_day, slaughter_order, slaughter_time, status, notes) VALUES
('qrb-1', 'KB-01', 'BÜYÜKBAŞ', 'an-3', 'TR1600031592', 'Simental', 610.00, 335.00, 168000.00, 7, 1, 1, '08:30', 'SOLD_OUT', 'Kapak açmış, besi kondisyonu mükemmel tosun. 7 hissesi tamamlandı.'),
('qrb-2', 'KB-02', 'BÜYÜKBAŞ', 'an-4', 'TR1600047321', 'Angus', 540.00, 305.00, 154000.00, 7, 1, 2, '09:15', 'PARTIALLY_RESERVED', 'Et ırkı Angus tosun. 5 hisse satıldı, 2 boş hisse mevcut.'),
('qrb-3', 'KK-01', 'KÜÇÜKBAŞ', 'sh-3', 'TR16-R001', 'Merinos Koç', 95.00, 48.00, 22000.00, 1, 1, 3, '10:00', 'SOLD_OUT', 'Kurbanlık vasfında iri boy Merinos damızlık koç.'),
('qrb-4', 'KK-02', 'KÜÇÜKBAŞ', 'sh-4', 'TR16-R002', 'Kıvırcık Koç', 88.00, 44.00, 19500.00, 1, 2, 1, '09:00', 'AVAILABLE', 'Bayramın 2. günü kesimi için müsait kıvırcık toklu.')
ON CONFLICT (id) DO NOTHING;

-- Kurban Hissedarları
INSERT INTO qurban_shares (id, qurban_id, share_index, shareholder_name, phone, share_price, deposit_amount, payment_status, payment_method, proxy_given, meat_weight, is_delivered, notes) VALUES
('sh-q1-1', 'qrb-1', 1, 'Hasan Hüseyin Yılmaz', '0532 234 56 78', 24000.00, 24000.00, 'PAID', 'CASH', true, 48.00, false, '1. Hisse - Vekalet bizzat alındı'),
('sh-q1-2', 'qrb-1', 2, 'Kemal Erdem', '0533 345 67 89', 24000.00, 24000.00, 'PAID', 'CHECK', true, 48.00, false, '2. Hisse - Çekle ödendi (CK-991204)'),
('sh-q1-3', 'qrb-1', 3, 'İbrahim Çelik', '0535 456 78 90', 24000.00, 10000.00, 'PARTIAL', 'TRANSFER', true, 47.50, false, '3. Hisse - Kalan 14.000 TL bayram sabahı'),
('sh-q1-4', 'qrb-1', 4, 'Mustafa Koç', '0542 567 89 01', 24000.00, 24000.00, 'PAID', 'CASH', true, 48.00, false, '4. Hisse'),
('sh-q1-5', 'qrb-1', 5, 'Fatma Demir', '0536 678 90 12', 24000.00, 12000.00, 'PARTIAL', 'CARD', true, 48.00, false, '5. Hisse'),
('sh-q1-6', 'qrb-1', 6, 'Osman Yıldız', '0555 789 01 23', 24000.00, 24000.00, 'PAID', 'TRANSFER', true, 47.50, false, '6. Hisse'),
('sh-q1-7', 'qrb-1', 7, 'Ali Rıza Aksoy', '0538 890 12 34', 24000.00, 24000.00, 'PAID', 'CASH', true, 48.00, false, '7. Hisse'),
('sh-q2-1', 'qrb-2', 1, 'Recep Aydın', '0532 901 23 45', 22000.00, 10000.00, 'PARTIAL', 'CASH', true, 0.00, false, '1. Hisse'),
('sh-q2-2', 'qrb-2', 2, 'Murat Doğan', '0533 012 34 56', 22000.00, 22000.00, 'PAID', 'TRANSFER', true, 0.00, false, '2. Hisse'),
('sh-q3-1', 'qrb-3', 1, 'Hacı Mehmet Şentürk', '0532 444 55 66', 22000.00, 22000.00, 'PAID', 'CASH', true, 48.00, false, 'Tek Hissedar (Küçükbaş)')
ON CONFLICT (id) DO NOTHING;
