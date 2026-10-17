/**
 * ÖZATE ÇİFTLİĞİ YÖNETİM SİSTEMİ
 * İstemci Taraflı Reaktif Veri Yönetimi ve UI Kontrolörü
 * Tarih: 10 Ekim 2026
 */

// =============================================================================
// 1. BAŞLANGIÇ VERİ SETİ (SEED DATA) & LOCALSTORAGE YÖNETİMİ
// =============================================================================

const STORAGE_KEY = 'ozate_farm_data_v1';

const DEFAULT_STATE = {
  farm: {
    name: 'Özate Büyükbaş Hayvancılık & Süt Çiftliği',
    location: 'Bursa, Türkiye',
    owner: 'Özate Ailesi',
    activeCows: 148,
    currency: 'TRY'
  },
  accounts: [
    { id: 'acc-1', name: 'Ziraat Bankası Ticari', type: 'BANK', iban: 'TR45 0001 0090 1234 5678 5001', balance: 185300.00 },
    { id: 'acc-2', name: 'Çiftlik Nakit Kasası', type: 'CASH', iban: '-', balance: 57500.00 },
    { id: 'acc-3', name: 'Tarım Kredi / Mazot Kartı', type: 'POS', iban: 'TR12 0001 ...', balance: 0.00 }
  ],
  contacts: [
    { id: 'ct-1', name: 'Sütaş Bursa Bölge Toplayıcısı', type: 'CUSTOMER', phone: '0224 452 10 00', balance: 64750.00 },
    { id: 'ct-2', name: 'Bursa Canlı Hayvan Pazarı Tüccarı', type: 'CUSTOMER', phone: '0532 987 65 43', balance: 21650.00 },
    { id: 'ct-3', name: 'Toros Yem & Rasyon Sanayi', type: 'SUPPLIER', phone: '0224 888 22 11', balance: -24800.00 },
    { id: 'ct-4', name: 'Nilüfer Çiftlik Veteriner Kliniği', type: 'SUPPLIER', phone: '0533 111 22 33', balance: -7300.00 }
  ],
  animals: [
    { 
      id: 'an-1', earTag: 'TR1600019284', name: 'Sarıkız', breed: 'Simental', category: 'Süt İneği', gender: 'Dişi', paddock: 'Sağmal 1', weight: 640, yield: '32.5 L/gün', status: 'Sağmal (Aktif)', health: 'Mükemmel',
      dam: 'TR1600008412', sire: 'Wille (Simental)',
      weights: [
        { date: '2026-07-15', weight: 605, adg: '+1.30 kg/g', paddock: 'Sağmal 1' },
        { date: '2026-08-20', weight: 622, adg: '+1.40 kg/g', paddock: 'Sağmal 1' },
        { date: '2026-10-10', weight: 640, adg: '+1.45 kg/g', paddock: 'Sağmal 1' }
      ],
      healthLogs: [
        { date: '2026-09-15', procedure: 'Şap Aşısı (Sonbahar)', staff: 'Vet. Dr. Nilüfer', result: 'Başarılı' },
        { date: '2026-08-01', procedure: 'Tırnak Bakımı & Pedikür', staff: 'Çiftlik Bakım Ekibi', result: 'Tamamlandı' }
      ]
    },
    { 
      id: 'an-2', earTag: 'TR1600024810', name: 'Yıldız', breed: 'Holstein', category: 'Süt İneği', gender: 'Dişi', paddock: 'Sağmal 1', weight: 610, yield: '36.0 L/gün', status: 'Sağmal (Aktif)', health: 'Mükemmel',
      dam: 'TR1600009101', sire: 'Hoffman (Holstein)',
      weights: [
        { date: '2026-08-10', weight: 585, adg: '+1.35 kg/g', paddock: 'Sağmal 1' },
        { date: '2026-10-09', weight: 610, adg: '+1.40 kg/g', paddock: 'Sağmal 1' }
      ],
      healthLogs: [
        { date: '2026-09-15', procedure: 'Şap Aşısı', staff: 'Vet. Dr. Nilüfer', result: 'Başarılı' }
      ]
    },
    { 
      id: 'an-3', earTag: 'TR1600031592', name: 'Paşa', breed: 'Simental', category: 'Besi Danası', gender: 'Erkek', paddock: 'Besi Bölme A', weight: 590, yield: '+1.45 kg/gün', status: 'Ağır Besi', health: 'İyi',
      dam: 'TR1600003310', sire: 'Everest (Simental)',
      weights: [
        { date: '2026-07-01', weight: 480, adg: '+1.50 kg/g', paddock: 'Besi Bölme A' },
        { date: '2026-08-15', weight: 540, adg: '+1.48 kg/g', paddock: 'Besi Bölme A' },
        { date: '2026-10-08', weight: 590, adg: '+1.45 kg/g', paddock: 'Besi Bölme A' }
      ],
      healthLogs: [
        { date: '2026-08-10', procedure: 'İç-Dış Parazit İlacı', staff: 'Çiftlik Ekibi', result: 'Uygulandı' }
      ]
    },
    { 
      id: 'an-4', earTag: 'TR1600047321', name: 'Baron', breed: 'Angus', category: 'Besi Danası', gender: 'Erkek', paddock: 'Besi Bölme A', weight: 520, yield: '+1.60 kg/gün', status: 'Ağır Besi', health: 'İyi',
      dam: 'TR1600007722', sire: 'Black Angus US',
      weights: [{ date: '2026-10-05', weight: 520, adg: '+1.60 kg/g', paddock: 'Besi Bölme A' }],
      healthLogs: []
    },
    { 
      id: 'an-5', earTag: 'TR1600058194', name: 'Gül', breed: 'Montofon', category: 'Gebe Düve', gender: 'Dişi', paddock: 'Kuru Dönem', weight: 550, yield: 'Doğuma 22 Gün', status: 'Kuru Dönemde', health: 'Takipte',
      dam: 'TR1600005511', sire: 'Swiss Star',
      weights: [{ date: '2026-10-01', weight: 550, adg: '+1.10 kg/g', paddock: 'Kuru Dönem' }],
      healthLogs: [{ date: '2026-09-20', procedure: 'Kuru Dönem Mastitis Tüpü', staff: 'Vet. Dr. Nilüfer', result: 'Uygulandı' }]
    },
    { 
      id: 'an-6', earTag: 'TR1600062409', name: 'Kınalı', breed: 'Holstein', category: 'Buzağı', gender: 'Dişi', paddock: 'Buzağı Kulübeleri', weight: 78, yield: 'Süt Emzirme', status: 'Sağlıklı', health: 'Mükemmel',
      dam: 'TR1600019284', sire: 'Hoffman',
      weights: [{ date: '2026-10-07', weight: 78, adg: '+0.80 kg/g', paddock: 'Buzağı Kulübeleri' }],
      healthLogs: [{ date: '2026-10-07', procedure: 'Göbek Bağı Dezenfeksiyonu', staff: 'Bakıcı Ahmet', result: 'Temiz' }]
    }
  ],
  sheep: [
    {
      id: 'sh-1',
      earTag: 'TR16-K001',
      name: 'Kınalı Anaç',
      breed: 'Merinos',
      category: 'Damızlık Koyun',
      gender: 'Dişi',
      barn: 'Ağıl 1 (Anaç Koyunlar)',
      weight: 68.5,
      birthType: 'İkiz',
      status: 'Aktif Sürüde',
      reproStatus: 'Gebe',
      matingDate: '2026-08-15',
      matingRam: 'TR16-R001 (Koç Lider)',
      estLambingDate: '2027-01-10',
      dam: 'TR16-K012',
      sire: 'TR16-R003',
      healthLogs: [
        { date: '2026-09-01', procedure: 'Enterotoksemi (Çelerme) Aşısı', staff: 'Vet. Dr. Nilüfer', result: 'Uygulandı' },
        { date: '2026-09-20', procedure: 'İç-Dış Parazit İlaçlaması (Dectomax)', staff: 'Bakıcı Mehmet', result: 'Tamamlandı' }
      ]
    },
    {
      id: 'sh-2',
      earTag: 'TR16-K002',
      name: 'Akbaş',
      breed: 'Merinos',
      category: 'Damızlık Koyun',
      gender: 'Dişi',
      barn: 'Ağıl 1 (Anaç Koyunlar)',
      weight: 71.0,
      birthType: 'İkiz',
      status: 'Aktif Sürüde',
      reproStatus: 'Gebe',
      matingDate: '2026-08-15',
      matingRam: 'TR16-R001 (Koç Lider)',
      estLambingDate: '2027-01-10',
      dam: 'TR16-K015',
      sire: 'TR16-R001',
      healthLogs: [
        { date: '2026-09-01', procedure: 'Çelerme Aşısı', staff: 'Vet. Dr. Nilüfer', result: 'Uygulandı' }
      ]
    },
    {
      id: 'sh-3',
      earTag: 'TR16-R001',
      name: 'Koç Lider',
      breed: 'Merinos',
      category: 'Damızlık Koç',
      gender: 'Erkek',
      barn: 'Ağıl 2 (Koç Bölmesi)',
      weight: 104.0,
      birthType: 'Tekiz',
      status: 'Aktif Sürüde',
      reproStatus: 'Aşımda',
      matingDate: '2026-08-15',
      matingRam: '-',
      estLambingDate: '-',
      dam: 'TR16-K008',
      sire: 'Avusturya Merinos Damızlık',
      healthLogs: [
        { date: '2026-08-10', procedure: 'Koç Katımı Öncesi Genel Muayene & Vitamin E-Selenyum', staff: 'Vet. Dr. Nilüfer', result: 'Sperm ve Kondisyon Mükemmel' }
      ]
    },
    {
      id: 'sh-4',
      earTag: 'TR16-R002',
      name: 'Baron',
      breed: 'Kıvırcık',
      category: 'Damızlık Koç',
      gender: 'Erkek',
      barn: 'Ağıl 2 (Koç Bölmesi)',
      weight: 92.0,
      birthType: 'İkiz',
      status: 'Aktif Sürüde',
      reproStatus: 'Dinlenmede',
      matingDate: '',
      matingRam: '-',
      estLambingDate: '-',
      dam: 'TR16-K022',
      sire: 'Trakya Kıvırcık 1',
      healthLogs: []
    },
    {
      id: 'sh-5',
      earTag: 'TR16-KZ01',
      name: 'Kınalı Kuzu 1',
      breed: 'Merinos',
      category: 'Toklu / Şişek',
      gender: 'Dişi',
      barn: 'Ağıl 3 (Kuzulama & Toklular)',
      weight: 42.0,
      birthType: 'İkiz',
      status: 'Aktif Sürüde',
      reproStatus: 'Boş',
      matingDate: '',
      matingRam: '-',
      estLambingDate: '-',
      dam: 'TR16-K001',
      sire: 'TR16-R001',
      healthLogs: [
        { date: '2026-08-15', procedure: 'Çiçek Aşısı', staff: 'Vet. Dr. Nilüfer', result: 'Uygulandı' }
      ]
    },
    {
      id: 'sh-6',
      earTag: 'TR16-KZ02',
      name: 'Kınalı Kuzu 2',
      breed: 'Merinos',
      category: 'Besi Kuzusu',
      gender: 'Erkek',
      barn: 'Ağıl 4 (Besi Kuzuları)',
      weight: 46.5,
      birthType: 'İkiz',
      status: 'Aktif Sürüde',
      reproStatus: 'Besi',
      matingDate: '',
      matingRam: '-',
      estLambingDate: '-',
      dam: 'TR16-K001',
      sire: 'TR16-R001',
      healthLogs: [
        { date: '2026-09-01', procedure: 'Karma Aşı (Pasteurella)', staff: 'Vet. Dr. Nilüfer', result: 'Uygulandı' }
      ]
    },
    {
      id: 'sh-7',
      earTag: 'TR16-K003',
      name: 'Gümüş',
      breed: 'İvesi',
      category: 'Damızlık Koyun',
      gender: 'Dişi',
      barn: 'Ağıl 1 (Anaç Koyunlar)',
      weight: 64.0,
      birthType: 'Tekiz',
      status: 'Aktif Sürüde',
      reproStatus: 'Boş (Süt Verimi)',
      matingDate: '',
      matingRam: '-',
      estLambingDate: '-',
      dam: 'TR16-K030',
      sire: 'Ceylanpınar İvesi',
      healthLogs: []
    },
    {
      id: 'sh-8',
      earTag: 'TR16-KC01',
      name: 'Beyaz İnci',
      breed: 'Saanen',
      category: 'Keçi / Teke',
      gender: 'Dişi',
      barn: 'Ağıl 5 (Keçi & Oğlak Bölmesi)',
      weight: 58.0,
      birthType: 'Üçüz',
      status: 'Aktif Sürüde',
      reproStatus: 'Gebe',
      matingDate: '2026-09-01',
      matingRam: 'Saanen Teke 1',
      estLambingDate: '2027-01-28',
      dam: 'TR16-KC005',
      sire: 'Çanakkale Saanen',
      healthLogs: [
        { date: '2026-09-10', procedure: 'Oğlaklama Öncesi E-Vitol', staff: 'Vet. Dr. Nilüfer', result: 'Tamam' }
      ]
    }
  ],
  shearings: [
    { id: 'shr-1', date: '2026-05-20', barn: 'Ağıl 1 (Anaç Koyunlar)', count: 48, weight: 144, notes: 'Bahar kırkımı tamamlandı, ortalama 3.0 kg/baş yapağı alındı.' }
  ],
  matingSeasons: [
    { id: 'mat-1', date: '2026-08-15', barn: 'Ağıl 1 (Anaç Koyunlar)', ram: 'TR16-R001 (Koç Lider)', notes: 'Koç katımı başladı. Tahmini kuzulama başlangıcı: 10 Ocak 2027' }
  ],
  milkProductions: [
    { id: 'mk-1', date: '2026-10-10', session: 'Sabah', liters: 740, tank: 'Tank 1', fat: 3.85, notes: 'Sabah sağımı tamamlandı, buzağılara 30L ayrıldı.' },
    { id: 'mk-2', date: '2026-10-10', session: 'Akşam', liters: 680, tank: 'Tank 1', fat: 3.90, notes: 'Akşam sağımı tamamlandı.' },
    { id: 'mk-3', date: '2026-10-09', session: 'Sabah', liters: 730, tank: 'Tank 1', fat: 3.82, notes: 'Normal sağım.' },
    { id: 'mk-4', date: '2026-10-09', session: 'Akşam', liters: 675, tank: 'Tank 2', fat: 3.88, notes: 'Tank 2 devreye alındı.' },
    { id: 'mk-5', date: '2026-10-08', session: 'Sabah', liters: 720, tank: 'Tank 1', fat: 3.80, notes: 'Hava serin, verim iyi.' },
    { id: 'mk-6', date: '2026-10-08', session: 'Akşam', liters: 660, tank: 'Tank 1', fat: 3.86, notes: 'Rutin sağım.' }
  ],
  inventory: [
    { id: 'inv-1', name: 'Süt Yemi (19 Protein)', category: 'Yem', quantity: 140, unit: 'Çuval (50kg)', minAlert: 50, unitCost: 580.00 },
    { id: 'inv-2', name: 'Yonca Balyası (1. Kalite)', category: 'Kaba Yem', quantity: 220, unit: 'Balya', minAlert: 80, unitCost: 190.00 },
    { id: 'inv-3', name: 'Mısır Silajı Deposu', category: 'Kaba Yem', quantity: 28, unit: 'Ton', minAlert: 35, unitCost: 2800.00 },
    { id: 'inv-4', name: 'Mastitis Tedavi ve Koruyucu Tüp', category: 'İlaç/Aşı', quantity: 8, unit: 'Kutu', minAlert: 10, unitCost: 650.00 },
    { id: 'inv-5', name: 'Şap Aşısı Dozları', category: 'İlaç/Aşı', quantity: 160, unit: 'Doz', minAlert: 50, unitCost: 45.00 }
  ],
  transactions: [
    { id: 'tx-1', date: '2026-10-10', type: 'INCOME', category: 'Süt Satışı', amount: 38500.00, paidAmount: 38500.00, status: 'PAID', contactId: 'ct-1', accountId: 'acc-1', desc: 'Sütaş 2.080 Litre süt teslimat tahsilatı' },
    { id: 'tx-2', date: '2026-10-09', type: 'INCOME', category: 'Besi Hayvanı Satışı', amount: 145000.00, paidAmount: 145000.00, status: 'PAID', contactId: 'ct-2', accountId: 'acc-1', desc: 'Bursa pazarında 2 baş besi danası satışı' },
    { id: 'tx-3', date: '2026-10-08', type: 'EXPENSE', category: 'Yem & Kaba Yem', amount: 34800.00, paidAmount: 10000.00, status: 'PARTIAL', contactId: 'ct-3', accountId: 'acc-1', desc: '60 çuval süt yemi alımı (10.000 TL peşin ödendi, bakiye vadeli)' },
    { id: 'tx-4', date: '2026-10-07', type: 'EXPENSE', category: 'Veteriner & İlaç', amount: 12400.00, paidAmount: 12400.00, status: 'PAID', contactId: 'ct-4', accountId: 'acc-2', desc: 'Aylık sürü gebelik muayeneleri ve aşı temini' },
    { id: 'tx-5', date: '2026-10-05', type: 'EXPENSE', category: 'Elektrik & Enerji', amount: 8650.00, paidAmount: 8650.00, status: 'PAID', contactId: null, accountId: 'acc-1', desc: 'Sağımhane ve soğutma tankı elektrik faturası' },
    { id: 'tx-6', date: '2026-10-03', type: 'EXPENSE', category: 'İşçilik & Maaş', amount: 36000.00, paidAmount: 36000.00, status: 'PAID', contactId: null, accountId: 'acc-1', desc: 'Çiftlik çalışanları haftalık ve avans ödemeleri' }
  ],
  transfers: [
    { id: 'tr-1', date: '2026-10-04', fromAcc: 'acc-1', toAcc: 'acc-2', amount: 25000.00, note: 'Banka hesabından çiftlik kasasına nakit avans çekimi' }
  ],
  tanks: {
    'Tank 1': { name: 'Tank 1 (Ana Soğutma)', current: 1800, capacity: 2500, temp: 3.7 },
    'Tank 2': { name: 'Tank 2 (Yedek)', current: 500, capacity: 2000, temp: 4.0 }
  },
  tasks: [
    { id: 'tsk-1', title: 'Gül (TR1600025819) Kuru Dönem Aşı Takibi', sub: 'Kuru dönem 2. faz karma aşı yapılacak', category: 'HEALTH', priority: 'HIGH', dueDate: '2026-10-11', assignee: 'Dr. Nilüfer Çetin', relatedAnimal: 'TR1600025819', done: false },
    { id: 'tsk-2', title: 'Sarıkız (TR1600019284) Ultrason Gebelik Teşhisi', sub: 'Tohumlama sonrası 60. gün ultrasonik gebelik kontrolü', category: 'BREEDING', priority: 'HIGH', dueDate: '2026-10-12', assignee: 'Dr. Nilüfer Çetin', relatedAnimal: 'TR1600019284', done: false },
    { id: 'tsk-3', title: 'Mısır Silajı Kritik Stok Siparişi (28 Ton Kaldı)', sub: 'Tedarikçi Toros Yem ile irtibata geçilip 30 ton sevkiyat planlanmalı', category: 'INVENTORY', priority: 'HIGH', dueDate: '2026-10-11', assignee: 'Ahmet Özate', relatedAnimal: '', done: false },
    { id: 'tsk-4', title: 'Sütaş Vadeli Alacak Tahsilat Takibi (₺64.750)', sub: 'Eylül 2. dönem süt bedeli tahsilatı ve hesap mutabakatı', category: 'FINANCE', priority: 'MEDIUM', dueDate: '2026-10-14', assignee: 'Ayşe Muhasebe', relatedAnimal: '', done: false },
    { id: 'tsk-5', title: 'Süt Soğutma Tankı 1 Filtre & Hijyen Servisi', sub: 'Periyodik 15 günlük asidik yıkama ve filtre değişimi', category: 'MAINTENANCE', priority: 'MEDIUM', dueDate: '2026-10-15', assignee: 'Mehmet Bakıcı', relatedAnimal: '', done: false },
    { id: 'tsk-6', title: 'Buzağı Kulübeleri Dezenfeksiyon & Yeni Altlık', sub: 'Buzağı bölmeleri kuru saman takviyesi ve hijyen kireçlemesi', category: 'GENERAL', priority: 'LOW', dueDate: '2026-10-10', assignee: 'Mehmet Bakıcı', relatedAnimal: '', done: true }
  ],
  parameters: {
    incomeCategories: ['Süt Satışı', 'Besi Hayvanı Satışı', 'Damızlık/Düve Satışı', 'Devlet Destekleri & Hibe', 'Gübre Satışı', 'Diğer Gelirler'],
    expenseCategories: ['Yem & Kaba Yem', 'Veteriner & İlaç', 'İşçilik & Maaş', 'Elektrik & Enerji', 'Akaryakıt & Mazot', 'Bakım & Onarım', 'Hayvan Alımı', 'Diğer Giderler'],
    contactCategories: ['Mandıra & Süt Alıcısı', 'Yem Fabrikası / Tedarikçi', 'Veteriner Kliniği & İlaç', 'Mezbaha & Et Entegre', 'Tarım Kredi / Kooperatif', 'Bireysel Müşteri'],
    paddocks: ['Sağmal 1', 'Sağmal 2', 'Besi Bölme A', 'Besi Bölme B', 'Kuru Dönem', 'Buzağı Kulübeleri', 'Revir / Karantina'],
    breeds: ['Holstein', 'Simental', 'Montofon / Esmer', 'Angus / Besi Melezi', 'Yerli Kara'],
    animalCategories: ['Süt İneği', 'Besi Danası', 'Gebe Düve', 'Buzağı', 'Damızlık Boğa'],
    sheepBarns: ['Ağıl 1 (Anaç Koyunlar)', 'Ağıl 2 (Koç Bölmesi)', 'Ağıl 3 (Kuzulama & Toklular)', 'Ağıl 4 (Besi Kuzuları)', 'Ağıl 5 (Keçi & Oğlak Bölmesi)', 'Mera Sürüsü'],
    sheepBreeds: ['Merinos (Karacabey)', 'Kıvırcık', 'İvesi (Sütçü)', 'Akkaraman', 'Saanen Keçisi'],
    sheepCategories: ['Damızlık Koyun', 'Damızlık Koç', 'Sütten Kesilmiş Kuzu', 'Emziren Kuzu', 'Toklu / Şişek', 'Besi Kuzusu', 'Keçi / Teke'],
    stockCategories: ['Yem', 'Kaba Yem', 'İlaç/Aşı', 'Katkı Maddesi', 'Tohumlama', 'Diğer'],
    accountTypes: ['Ziraat Bankası Ticari', 'Çiftlik Nakit Kasası', 'Tarım Kredi / Mazot Kartı']
  },
  users: [
    { id: 'usr-1', name: 'Ahmet Özate', email: 'admin@ozate.com', phone: '0532 100 00 01', role: 'ADMIN', title: 'Çiftlik Sahibi & Genel Müdür', pin: '1923', status: 'ACTIVE' },
    { id: 'usr-2', name: 'Dr. Nilüfer Çetin', email: 'vet.nilufer@ozate.com', phone: '0533 111 22 33', role: 'VET', title: 'Sorumlu Veteriner Hekim', pin: '1923', status: 'ACTIVE' },
    { id: 'usr-3', name: 'Mehmet Bakıcı', email: 'mehmet.bakici@ozate.com', phone: '0544 222 33 44', role: 'WORKER', title: 'Baş Sağımcı & Sürü Sorumlusu', pin: '1923', status: 'ACTIVE' },
    { id: 'usr-4', name: 'Ayşe Muhasebe', email: 'muhasebe@ozate.com', phone: '0535 333 44 55', role: 'ACCOUNTANT', title: 'Ön Muhasebe & Finans Uzmanı', pin: '1923', status: 'ACTIVE' }
  ],
  auditLogs: [
    { id: 'log-1', timestamp: '2026-10-10 14:30', type: 'SİSTEM', user: 'Ahmet Özate', details: 'Sistem başlatıldı ve çiftlik parametreleri yüklendi.' },
    { id: 'log-2', timestamp: '2026-10-10 16:45', type: 'SÜT GİRİŞİ', user: 'Mehmet Bakıcı', details: 'Akşam sağımı: Tank 1 +1.080 L süt ilave edildi.' },
    { id: 'log-3', timestamp: '2026-10-11 09:15', type: 'FİNANS', user: 'Ayşe Muhasebe', details: 'Sütaş cari hesabına ₺64.750 vadeli süt satış faturası işlendi.' }
  ],
  checks: [
    { id: 'chk-1', checkNumber: 'CK-884210', type: 'INCOMING', amount: 45000.00, issueDate: '2026-09-25', dueDate: '2026-10-25', drawer: 'Bursa Et & Kasaplar Birliği', bankName: 'Vakıfbank', branchName: 'Heykel Şubesi', accountNo: 'TR33 0001 ...', contactId: 'ct-2', status: 'PORTFOLIO', endorsedToContactId: null, targetAccountId: null, notes: 'Besi hayvanı satışına mahsuben alınan vadeli müşteri çeki' },
    { id: 'chk-2', checkNumber: 'CK-991204', type: 'INCOMING', amount: 32500.00, issueDate: '2026-10-01', dueDate: '2026-11-15', drawer: 'Kemal Erdem (Kurban Hissesi)', bankName: 'İş Bankası', branchName: 'Nilüfer Şubesi', accountNo: 'TR64 0006 ...', contactId: 'ct-1', status: 'PORTFOLIO', endorsedToContactId: null, targetAccountId: null, notes: '2026 Kurbanlık 2 hisse peşinat ve bakiye çeki' },
    { id: 'chk-3', checkNumber: 'CK-104921', type: 'OUTGOING', amount: 55000.00, issueDate: '2026-09-10', dueDate: '2026-10-30', drawer: 'Özate Çiftliği İşletmesi', bankName: 'Ziraat Bankası', branchName: 'Bursa Ticari', accountNo: 'TR45 0001 ...', contactId: 'ct-3', status: 'PORTFOLIO', endorsedToContactId: null, targetAccountId: null, notes: 'Toros Yem sanayine 30 ton silaj ve yem bedeli için verilen çek' }
  ],
  qurbanAnimals: [
    { id: 'qrb-1', qurbanNo: 'KB-01', animalType: 'BÜYÜKBAŞ', sourceAnimalId: 'an-3', earTag: 'TR1600031592', breed: 'Simental', liveWeight: 610.00, carcassWeight: 335.00, totalPrice: 168000.00, shareCount: 7, slaughterDay: 1, slaughterOrder: 1, slaughterTime: '08:30', status: 'SOLD_OUT', notes: 'Kapak açmış, besi kondisyonu mükemmel tosun. 7 hissesi tamamlandı.' },
    { id: 'qrb-2', qurbanNo: 'KB-02', animalType: 'BÜYÜKBAŞ', sourceAnimalId: 'an-4', earTag: 'TR1600047321', breed: 'Angus', liveWeight: 540.00, carcassWeight: 305.00, totalPrice: 154000.00, shareCount: 7, slaughterDay: 1, slaughterOrder: 2, slaughterTime: '09:15', status: 'PARTIALLY_RESERVED', notes: 'Et ırkı Angus tosun. 5 hisse satıldı, 2 boş hisse mevcut.' },
    { id: 'qrb-3', qurbanNo: 'KK-01', animalType: 'KÜÇÜKBAŞ', sourceAnimalId: 'sh-3', earTag: 'TR16-R001', breed: 'Merinos Koç', liveWeight: 95.00, carcassWeight: 48.00, totalPrice: 22000.00, shareCount: 1, slaughterDay: 1, slaughterOrder: 3, slaughterTime: '10:00', status: 'SOLD_OUT', notes: 'Kurbanlık vasfında iri boy Merinos damızlık koç.' },
    { id: 'qrb-4', qurbanNo: 'KK-02', animalType: 'KÜÇÜKBAŞ', sourceAnimalId: 'sh-4', earTag: 'TR16-R002', breed: 'Kıvırcık Koç', liveWeight: 88.00, carcassWeight: 44.00, totalPrice: 19500.00, shareCount: 1, slaughterDay: 2, slaughterOrder: 1, slaughterTime: '09:00', status: 'AVAILABLE', notes: 'Bayramın 2. günü kesimi için müsait kıvırcık toklu.' }
  ],
  qurbanShares: [
    { id: 'sh-q1-1', qurbanId: 'qrb-1', shareIndex: 1, shareholderName: 'Hasan Hüseyin Yılmaz', phone: '0532 234 56 78', sharePrice: 24000.00, depositAmount: 24000.00, paymentStatus: 'PAID', paymentMethod: 'CASH', checkId: null, contactId: null, proxyGiven: true, meatWeight: 48.00, isDelivered: false, notes: '1. Hisse - Vekalet bizzat alındı' },
    { id: 'sh-q1-2', qurbanId: 'qrb-1', shareIndex: 2, shareholderName: 'Kemal Erdem', phone: '0533 345 67 89', sharePrice: 24000.00, depositAmount: 24000.00, paymentStatus: 'PAID', paymentMethod: 'CHECK', checkId: 'chk-2', contactId: 'ct-1', proxyGiven: true, meatWeight: 48.00, isDelivered: false, notes: '2. Hisse - Çekle ödendi (CK-991204)' },
    { id: 'sh-q1-3', qurbanId: 'qrb-1', shareIndex: 3, shareholderName: 'İbrahim Çelik', phone: '0535 456 78 90', sharePrice: 24000.00, depositAmount: 10000.00, paymentStatus: 'PARTIAL', paymentMethod: 'TRANSFER', checkId: null, contactId: null, proxyGiven: true, meatWeight: 47.50, isDelivered: false, notes: '3. Hisse - Kalan 14.000 TL bayram sabahı' },
    { id: 'sh-q1-4', qurbanId: 'qrb-1', shareIndex: 4, shareholderName: 'Mustafa Koç', phone: '0542 567 89 01', sharePrice: 24000.00, depositAmount: 24000.00, paymentStatus: 'PAID', paymentMethod: 'CASH', checkId: null, contactId: null, proxyGiven: true, meatWeight: 48.00, isDelivered: false, notes: '4. Hisse' },
    { id: 'sh-q1-5', qurbanId: 'qrb-1', shareIndex: 5, shareholderName: 'Fatma Demir', phone: '0536 678 90 12', sharePrice: 24000.00, depositAmount: 12000.00, paymentStatus: 'PARTIAL', paymentMethod: 'CARD', checkId: null, contactId: null, proxyGiven: true, meatWeight: 48.00, isDelivered: false, notes: '5. Hisse' },
    { id: 'sh-q1-6', qurbanId: 'qrb-1', shareIndex: 6, shareholderName: 'Osman Yıldız', phone: '0555 789 01 23', sharePrice: 24000.00, depositAmount: 24000.00, paymentStatus: 'PAID', paymentMethod: 'TRANSFER', checkId: null, contactId: null, proxyGiven: true, meatWeight: 47.50, isDelivered: false, notes: '6. Hisse' },
    { id: 'sh-q1-7', qurbanId: 'qrb-1', shareIndex: 7, shareholderName: 'Ali Rıza Aksoy', phone: '0538 890 12 34', sharePrice: 24000.00, depositAmount: 24000.00, paymentStatus: 'PAID', paymentMethod: 'CASH', checkId: null, contactId: null, proxyGiven: true, meatWeight: 48.00, isDelivered: false, notes: '7. Hisse' },
    { id: 'sh-q2-1', qurbanId: 'qrb-2', shareIndex: 1, shareholderName: 'Recep Aydın', phone: '0532 901 23 45', sharePrice: 22000.00, depositAmount: 10000.00, paymentStatus: 'PARTIAL', paymentMethod: 'CASH', checkId: null, contactId: null, proxyGiven: true, meatWeight: 0.00, isDelivered: false, notes: '1. Hisse' },
    { id: 'sh-q2-2', qurbanId: 'qrb-2', shareIndex: 2, shareholderName: 'Murat Doğan', phone: '0533 012 34 56', sharePrice: 22000.00, depositAmount: 22000.00, paymentStatus: 'PAID', paymentMethod: 'TRANSFER', checkId: null, contactId: null, proxyGiven: true, meatWeight: 0.00, isDelivered: false, notes: '2. Hisse' },
    { id: 'sh-q3-1', qurbanId: 'qrb-3', shareIndex: 1, shareholderName: 'Hacı Mehmet Şentürk', phone: '0532 444 55 66', sharePrice: 22000.00, depositAmount: 22000.00, paymentStatus: 'PAID', paymentMethod: 'CASH', checkId: null, contactId: null, proxyGiven: true, meatWeight: 48.00, isDelivered: false, notes: 'Tek Hissedar (Küçükbaş)' }
  ]
};

// Durum Değişkeni
let state = {};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      state = JSON.parse(saved);
      if (!state.tanks) state.tanks = JSON.parse(JSON.stringify(DEFAULT_STATE.tanks));
      if (!state.parameters) {
        state.parameters = JSON.parse(JSON.stringify(DEFAULT_STATE.parameters));
      } else {
        if (!Array.isArray(state.parameters.incomeCategories) || state.parameters.incomeCategories.length === 0) {
          state.parameters.incomeCategories = [...DEFAULT_STATE.parameters.incomeCategories];
        }
        if (!Array.isArray(state.parameters.expenseCategories) || state.parameters.expenseCategories.length === 0) {
          state.parameters.expenseCategories = [...DEFAULT_STATE.parameters.expenseCategories];
        }
        if (!Array.isArray(state.parameters.contactCategories) || state.parameters.contactCategories.length === 0) {
          state.parameters.contactCategories = [...DEFAULT_STATE.parameters.contactCategories];
        }
        if (!Array.isArray(state.parameters.paddocks) || state.parameters.paddocks.length === 0) {
          state.parameters.paddocks = [...DEFAULT_STATE.parameters.paddocks];
        }
        if (!Array.isArray(state.parameters.breeds) || state.parameters.breeds.length === 0) {
          state.parameters.breeds = [...DEFAULT_STATE.parameters.breeds];
        }
        if (!Array.isArray(state.parameters.animalCategories) || state.parameters.animalCategories.length === 0) {
          state.parameters.animalCategories = [...DEFAULT_STATE.parameters.animalCategories];
        }
        if (!Array.isArray(state.parameters.stockCategories) || state.parameters.stockCategories.length === 0) {
          state.parameters.stockCategories = [...DEFAULT_STATE.parameters.stockCategories];
        }
        if (!Array.isArray(state.parameters.accountTypes) || state.parameters.accountTypes.length === 0) {
          state.parameters.accountTypes = [...DEFAULT_STATE.parameters.accountTypes];
        }
        if (!Array.isArray(state.parameters.sheepBarns) || state.parameters.sheepBarns.length === 0) {
          state.parameters.sheepBarns = [...DEFAULT_STATE.parameters.sheepBarns];
        }
        if (!Array.isArray(state.parameters.sheepBreeds) || state.parameters.sheepBreeds.length === 0) {
          state.parameters.sheepBreeds = [...DEFAULT_STATE.parameters.sheepBreeds];
        }
        if (!Array.isArray(state.parameters.sheepCategories) || state.parameters.sheepCategories.length === 0) {
          state.parameters.sheepCategories = [...DEFAULT_STATE.parameters.sheepCategories];
        }
      }
      if (!Array.isArray(state.animals) || state.animals.length === 0) {
        state.animals = JSON.parse(JSON.stringify(DEFAULT_STATE.animals));
      }
      if (!Array.isArray(state.accounts) || state.accounts.length === 0) {
        state.accounts = JSON.parse(JSON.stringify(DEFAULT_STATE.accounts));
      }
      if (!Array.isArray(state.transfers) || state.transfers.length === 0) {
        state.transfers = JSON.parse(JSON.stringify(DEFAULT_STATE.transfers || []));
      }
      if (!Array.isArray(state.contacts) || state.contacts.length === 0) {
        state.contacts = JSON.parse(JSON.stringify(DEFAULT_STATE.contacts));
      }
      if (!Array.isArray(state.inventory) || state.inventory.length === 0) {
        state.inventory = JSON.parse(JSON.stringify(DEFAULT_STATE.inventory));
      }
      if (!Array.isArray(state.milkProductions) || state.milkProductions.length === 0) {
        state.milkProductions = JSON.parse(JSON.stringify(DEFAULT_STATE.milkProductions));
      }
      if (!Array.isArray(state.transactions) || state.transactions.length === 0) {
        state.transactions = JSON.parse(JSON.stringify(DEFAULT_STATE.transactions));
      }
      if (!Array.isArray(state.tasks) || state.tasks.length === 0) {
        state.tasks = JSON.parse(JSON.stringify(DEFAULT_STATE.tasks));
      }
      if (!Array.isArray(state.sheep) || state.sheep.length === 0) {
        state.sheep = JSON.parse(JSON.stringify(DEFAULT_STATE.sheep));
      }
      if (!Array.isArray(state.shearings)) {
        state.shearings = JSON.parse(JSON.stringify(DEFAULT_STATE.shearings));
      }
      if (!Array.isArray(state.matingSeasons)) {
        state.matingSeasons = JSON.parse(JSON.stringify(DEFAULT_STATE.matingSeasons));
      }
      if (!state.users || !Array.isArray(state.users) || state.users.length === 0) {
        state.users = JSON.parse(JSON.stringify(DEFAULT_STATE.users));
      }
      if (!state.auditLogs || !Array.isArray(state.auditLogs) || state.auditLogs.length === 0) {
        state.auditLogs = JSON.parse(JSON.stringify(DEFAULT_STATE.auditLogs));
      }
      if (!Array.isArray(state.checks) || state.checks.length === 0) {
        state.checks = JSON.parse(JSON.stringify(DEFAULT_STATE.checks));
      }
      if (!Array.isArray(state.qurbanAnimals) || state.qurbanAnimals.length === 0) {
        state.qurbanAnimals = JSON.parse(JSON.stringify(DEFAULT_STATE.qurbanAnimals));
      }
      if (!Array.isArray(state.qurbanShares) || state.qurbanShares.length === 0) {
        state.qurbanShares = JSON.parse(JSON.stringify(DEFAULT_STATE.qurbanShares));
      }

      // Kasa & Banka hesap adları senkronizasyonu
      if (Array.isArray(state.accounts)) {
        state.accounts.forEach(acc => {
          if (acc.name === 'Çiftlik Ana Kasası (Nakit)') {
            acc.name = 'Çiftlik Nakit Kasası';
          }
        });
        const oldGenerics = ['Nakit Kasa', 'Banka Vadesiz TL', 'Süt Avans Hesabı', 'POS / Sanal Kart'];
        const hasOld = Array.isArray(state.parameters.accountTypes) && state.parameters.accountTypes.some(t => oldGenerics.includes(t));
        if (hasOld || !Array.isArray(state.parameters.accountTypes) || state.parameters.accountTypes.length === 0) {
          state.parameters.accountTypes = state.accounts.map(a => a.name);
        } else {
          state.accounts.forEach(a => {
            if (!state.parameters.accountTypes.includes(a.name)) {
              state.parameters.accountTypes.push(a.name);
            }
          });
        }
      }
      return;
    } catch (e) {
      console.error('State parse hatası, varsayılan yükleniyor:', e);
    }
  }
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// =============================================================================
// 2. YARDIMCI BİÇİMLENDİRME FONKSİYONLARI (FORMATTERS)
// =============================================================================

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatCurrency(val) {
  if (isNaN(val)) return '₺0,00';
  return '₺' + Number(val).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
}

// =============================================================================
// 3. SAYFA VE MENÜ GEZİNİMİ (PAGE ROUTING)
// =============================================================================

const PAGE_TITLES = {
  dashboard: { title: 'Gösterge Paneli', sub: 'Özate Çiftliği Genel Durum ve Günlük Özet' },
  transactions: { title: 'Gelir & Gider Yönetimi', sub: 'Tüm finans hareketleri, tahsilatlar, ödemeler ve cari bağlantıları' },
  accounts: { title: 'Kasa ve Banka Hesapları', sub: 'Nakit varlıklar, banka hesapları ve virman transferleri' },
  contacts: { title: 'Cari Hesaplar (Müşteri & Tedarikçi)', sub: 'Mandıralar, yem fabrikaları ve veteriner bakiyeleri' },
  animals: { title: 'Büyükbaş Sürü Yönetimi', sub: 'Küpe numaraları, padok dağılımı, laktasyon ve canlı ağırlık takibi' },
  sheep: { title: 'Küçükbaş Hayvan & Sürü Yönetimi', sub: 'Koyun, koç, kuzu takibi, ağıl ve mera bölmeleri, koç katımı ve kırkım yönetimi' },
  milk: { title: 'Günlük Süt Üretimi ve Tank Yönetimi', sub: 'Sağım seansları, tank dolulukları ve kalite verileri' },
  inventory: { title: 'Yem ve Stok Deposu', sub: 'Konsantre yemler, kaba yem, ilaçlar ve kritik stok uyarıları' },
  tasks: { title: 'Görevler & İş Takvimi', sub: 'Aşı takvimi, tohumlama kontrolleri, doğum alarmları ve operasyonel görevler' },
  reports: { title: 'Çiftlik Raporları ve Analitik', sub: 'Dönemsel kâr-zarar, nakit akışı ve verimlilik raporları' },
  checks: { title: 'Çek Takip & Portföy Yönetimi', sub: 'Müşteri çekleri, verilen borç çekleri, vadesi yaklaşanlar, banka tahsilatı ve ciro işlemleri' },
  qurban: { title: 'Kurban Satış & Kesimhane Yönetimi', sub: 'Büyükbaş 1-7 hisse organizasyonu, küçükbaş kurbanlıklar, kesimhane randevu sırası ve pay teslimatı' },
  definitions: { title: 'Çiftlik Tanımları', sub: 'Gelir/gider kategorileri, müşteri/tedarikçi grupları, padoklar ve ırkları dinamik yönetin' },
  users: { title: 'Kullanıcı Yönetimi', sub: 'Sisteme giriş yapabilen yetkililer, veterinerler, bakıcılar ve erişim şifreleri' },
  settings: { title: 'Çiftlik Ayarları', sub: 'İşletme kimlik bilgileri, operasyonel para birimi ve iletişim ayarları' },
  security: { title: 'Sistem Güvenliği', sub: 'Veri tabanı yedekleme, JSON aktarımı, denetim izi ve sistem veri güvenliği' }
};

function navigateToPage(pageId) {
  if (!PAGE_TITLES[pageId]) pageId = 'dashboard';

  // Sayfaları gizle / göster
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(`view-${pageId}`);
  if (targetView) targetView.classList.add('active');

  // Sidebar linkleri
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  // Mobil alt menü
  document.querySelectorAll('.mobile-nav-item:not(.mobile-fab-item)').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  // Başlık güncelle (mevcutsa)
  const meta = PAGE_TITLES[pageId];
  const titleEl = document.getElementById('currentPageTitle');
  if (titleEl && meta) titleEl.textContent = meta.title;
  const subEl = document.getElementById('currentPageSubtitle');
  if (subEl && meta) subEl.textContent = meta.sub;

  // Sayfaya özel render işlemleri
  renderPageContent(pageId);

  // Mobil menüyü kapat
  document.getElementById('appSidebar').classList.remove('mobile-open');
}

function renderPageContent(pageId) {
  switch (pageId) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'transactions':
      renderTransactionsTable();
      break;
    case 'accounts':
      renderAccountsPage();
      break;
    case 'contacts':
      renderContactsPage();
      break;
    case 'checks':
      renderChecksPage();
      break;
    case 'animals':
      renderAnimalsTable();
      break;
    case 'sheep':
      renderSheepPage();
      break;
    case 'qurban':
      renderQurbanPage();
      break;
    case 'milk':
      renderMilkTable();
      break;
    case 'inventory':
      renderInventoryTable();
      break;
    case 'tasks':
      renderTasksPage();
      break;
    case 'reports':
      renderReportsPage();
      break;
    case 'definitions':
      renderDefinitionsPage();
      break;
    case 'users':
      renderUserListGrid();
      break;
    case 'settings':
      renderSettingsPage();
      break;
    case 'security':
      renderSecurityPage();
      break;
  }
}

// =============================================================================
// 4. GÖSTERGE PANELİ (DASHBOARD) RENDER
// =============================================================================

function renderDashboard() {
  // Finans Hesaplamaları
  let totalIncome = 0;
  let totalExpense = 0;
  state.transactions.forEach(tx => {
    if (tx.status !== 'CANCELLED') {
      if (tx.type === 'INCOME') totalIncome += tx.amount;
      if (tx.type === 'EXPENSE') totalExpense += tx.amount;
    }
  });
  const netProfit = totalIncome - totalExpense;

  // Kasa & Banka Toplamı
  const totalCash = state.accounts.reduce((acc, a) => acc + a.balance, 0);

  // Cari Alacak & Borç
  let totalReceivable = 0;
  let totalPayable = 0;
  state.contacts.forEach(c => {
    if (c.balance > 0) totalReceivable += c.balance;
    if (c.balance < 0) totalPayable += Math.abs(c.balance);
  });

  // Günlük Süt (Bugünkü veya en son sağım gününün toplamı)
  const todayIso = new Date().toISOString().split('T')[0];
  let todayMilks = (state.milkProductions || []).filter(m => m.date === todayIso);
  if (todayMilks.length === 0 && state.milkProductions && state.milkProductions.length > 0) {
    const latestDate = state.milkProductions[0].date;
    todayMilks = state.milkProductions.filter(m => m.date === latestDate);
  }
  const todayLiters = todayMilks.reduce((sum, m) => sum + (parseFloat(m.liters) || 0), 0);

  // Aktif Sürü Sayısı (Arşivdekiler hariç)
  const activeCattleCount = state.animals.filter(a => !['Satıldı', 'Kesildi', 'Zayiat', 'Öldü'].includes(a.status)).length;

  // KPI'ları Doldur
  document.getElementById('kpiNetProfit').textContent = formatCurrency(netProfit);
  document.getElementById('kpiCashBalance').textContent = formatCurrency(totalCash);
  document.getElementById('kpiMilkYield').textContent = todayLiters.toLocaleString('tr-TR') + ' L';
  document.getElementById('kpiAnimalCount').textContent = activeCattleCount + ' Baş';
  
  // Küçükbaş KPI & Sidebar Badge Güncellemesi
  const sheepCount = (state.sheep || []).length;
  const kpiSheepEl = document.getElementById('kpiSheepCount');
  if (kpiSheepEl) kpiSheepEl.textContent = sheepCount + ' Baş';
  const sidebarSheepBadge = document.getElementById('sidebarSheepCountBadge');
  if (sidebarSheepBadge) sidebarSheepBadge.textContent = sheepCount;

  const ewesCount = (state.sheep || []).filter(s => s.category === 'Damızlık Koyun').length;
  const ramsCount = (state.sheep || []).filter(s => s.category === 'Damızlık Koç').length;
  const lambsCount = (state.sheep || []).filter(s => ['Sütten Kesilmiş Kuzu', 'Emziren Kuzu', 'Toklu / Şişek', 'Besi Kuzusu'].includes(s.category)).length;
  const kpiSheepSub = document.getElementById('kpiSheepSubtext');
  if (kpiSheepSub) kpiSheepSub.textContent = `${ewesCount} Koyun • ${ramsCount} Koç • ${lambsCount} Kuzu / Toklu`;

  document.getElementById('kpiReceivables').textContent = formatCurrency(totalReceivable);
  document.getElementById('kpiPayables').textContent = formatCurrency(totalPayable);
  document.getElementById('bannerMilkToday').textContent = todayLiters.toLocaleString('tr-TR') + ' Litre';

  // Son Finansal İşlemler Tablosu
  const recentTbody = document.getElementById('dashboardRecentTbody');
  recentTbody.innerHTML = '';
  const recentTxs = [...state.transactions].reverse().slice(0, 5);
  
  recentTxs.forEach(tx => {
    const contact = state.contacts.find(c => c.id === tx.contactId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(tx.date)}</td>
      <td>
        <span class="tag-badge ${tx.type === 'INCOME' ? 'tag-income' : 'tag-expense'}">
          ${tx.type === 'INCOME' ? '↓ Gelir' : '↑ Gider'}
        </span>
        <span style="font-weight: 500; margin-left: 6px;">${tx.category}</span>
      </td>
      <td>
        <div>${tx.desc}</div>
        ${contact ? `<small style="color: var(--text-muted);">${contact.name}</small>` : ''}
      </td>
      <td style="font-weight: 700; font-family: var(--font-heading); color: ${tx.type === 'INCOME' ? 'var(--accent-success)' : 'var(--accent-danger)'}">
        ${tx.type === 'INCOME' ? '+' : '-'}${formatCurrency(tx.amount)}
      </td>
      <td>
        <span class="tag-badge ${tx.status === 'PAID' ? 'tag-paid' : (tx.status === 'PARTIAL' ? 'tag-partial' : 'tag-pending')}">
          ${tx.status === 'PAID' ? 'Tahsil Edildi' : (tx.status === 'PARTIAL' ? 'Kısmi Ödendi' : 'Bekliyor')}
        </span>
      </td>
    `;
    recentTbody.appendChild(tr);
  });

  // Görevler & Uyarılar
  const tasksList = document.getElementById('dashboardTasksList');
  if (tasksList) {
    tasksList.innerHTML = '';
    let activeTaskCount = 0;
    (state.tasks || []).forEach(t => {
      if (!t.done) activeTaskCount++;
      const div = document.createElement('div');
      const pClass = (t.priority || 'medium').toLowerCase();
      const icon = t.icon || (t.category === 'HEALTH' ? '💉' : (t.category === 'BREEDING' ? '🧬' : (t.category === 'FINANCE' ? '💰' : (t.category === 'INVENTORY' ? '📦' : '📋'))));
      div.className = `task-item priority-${pClass} ${t.done ? 'is-done' : ''}`;
      div.innerHTML = `
        <button class="task-check-btn" onclick="toggleTaskDone('${t.id}')" title="${t.done ? 'Geri Al' : 'Tamamla'}">
          ✓
        </button>
        <div class="task-icon">${icon}</div>
        <div class="task-details">
          <div class="task-title">${t.title}</div>
          <div class="task-sub">${t.sub || (t.dueDate ? 'Son Tarih: ' + formatDateTurkish(t.dueDate) : '')}</div>
        </div>
        <button class="btn btn-sm btn-ghost" onclick="openShareModal('${t.id}')" title="WhatsApp / SMS ile Paylaş" style="padding: 2px 5px; font-size: 0.75rem; color: #10B981; margin-right: 2px;">📲</button>
        <button class="btn btn-sm btn-ghost" onclick="deleteTask('${t.id}')" title="Görevi Sil" style="padding: 2px 5px; font-size: 0.7rem;">✕</button>
      `;
      tasksList.appendChild(div);
    });
    const alertBadge = document.getElementById('dashAlertCountBadge');
    if (alertBadge) alertBadge.textContent = `${activeTaskCount} Görev`;
  }

  // Dinamik Grafikleri Çiz
  renderFinanceChart();
  renderMilkChart();
}

// ----------------- DİNAMİK SVG GRAFİKLERİ -----------------
function renderFinanceChart() {
  const container = document.getElementById('financeChartContainer');
  if (!container) return;

  const months = ['Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim'];
  const data = [
    { inc: 240, exp: 180 },
    { inc: 270, exp: 195 },
    { inc: 310, exp: 210 },
    { inc: 290, exp: 205 },
    { inc: 330, exp: 225 },
    { inc: 348, exp: 220 }
  ];

  let barsHtml = '';
  data.forEach((d, i) => {
    const incHeight = Math.round((d.inc / 380) * 115);
    const expHeight = Math.round((d.exp / 380) * 115);
    barsHtml += `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1;">
        <div style="display: flex; align-items: flex-end; gap: 4px; height: 120px;">
          <div title="Gelir: ₺${d.inc}.000" style="width: 13px; height: ${incHeight}px; background: linear-gradient(180deg, #10B981, #059669); border-radius: 3px 3px 0 0; transition: height 0.3s ease;"></div>
          <div title="Gider: ₺${d.exp}.000" style="width: 13px; height: ${expHeight}px; background: linear-gradient(180deg, #E11D48, #9B1C28); border-radius: 3px 3px 0 0; transition: height 0.3s ease;"></div>
        </div>
        <span style="font-size: 0.68rem; color: var(--text-muted);">${months[i]}</span>
      </div>
    `;
  });

  container.innerHTML = barsHtml;
}

function renderMilkChart() {
  const container = document.getElementById('milkChartContainer');
  if (!container) return;

  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const milkData = [
    { morning: 710, evening: 650 },
    { morning: 725, evening: 660 },
    { morning: 730, evening: 670 },
    { morning: 720, evening: 665 },
    { morning: 740, evening: 675 },
    { morning: 735, evening: 670 },
    { morning: 740, evening: 680 }
  ];

  let barsHtml = '';
  milkData.forEach((d, i) => {
    const morningH = Math.round((d.morning / 800) * 115);
    const eveningH = Math.round((d.evening / 800) * 115);
    barsHtml += `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1;">
        <div style="display: flex; align-items: flex-end; gap: 3px; height: 120px;">
          <div title="Sabah: ${d.morning} L" style="width: 12px; height: ${morningH}px; background: linear-gradient(180deg, #3B82F6, #2563EB); border-radius: 3px 3px 0 0;"></div>
          <div title="Akşam: ${d.evening} L" style="width: 12px; height: ${eveningH}px; background: linear-gradient(180deg, #06B6D4, #0891B2); border-radius: 3px 3px 0 0;"></div>
        </div>
        <span style="font-size: 0.68rem; color: var(--text-muted);">${days[i]}</span>
      </div>
    `;
  });

  container.innerHTML = barsHtml;
}

// =============================================================================
// 5. GELİR & GİDER SAYFASI İŞLEMLERİ
// =============================================================================

function renderTransactionsTable() {
  const tbody = document.getElementById('transactionsTbody');
  if (!tbody) return;

  const typeFilter = document.getElementById('filterTxType').value;
  const statusFilter = document.getElementById('filterTxStatus').value;
  const catFilter = document.getElementById('filterTxCategory').value;

  tbody.innerHTML = '';

  const filtered = state.transactions.filter(tx => {
    if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;
    if (catFilter !== 'ALL' && tx.category !== catFilter) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">Kayıt bulunamadı.</td></tr>`;
    return;
  }

  [...filtered].reverse().forEach(tx => {
    const contact = state.contacts.find(c => c.id === tx.contactId);
    const account = state.accounts.find(a => a.id === tx.accountId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(tx.date)}</td>
      <td>
        <span class="tag-badge ${tx.type === 'INCOME' ? 'tag-income' : 'tag-expense'}">
          ${tx.type === 'INCOME' ? 'Gelir' : 'Gider'}
        </span>
      </td>
      <td style="font-weight: 600;">${tx.category}</td>
      <td>${tx.desc}</td>
      <td>${contact ? contact.name : '<span style="color:var(--text-dim);">-</span>'}</td>
      <td>${account ? account.name : '<span style="color:var(--text-dim);">-</span>'}</td>
      <td style="font-weight: 700; font-family: var(--font-heading); color: ${tx.type === 'INCOME' ? 'var(--accent-success)' : 'var(--accent-danger)'}">
        ${formatCurrency(tx.amount)}
      </td>
      <td>
        <span class="tag-badge ${tx.status === 'PAID' ? 'tag-paid' : (tx.status === 'PARTIAL' ? 'tag-partial' : 'tag-pending')}">
          ${tx.status === 'PAID' ? 'Ödendi / Alındı' : (tx.status === 'PARTIAL' ? 'Kısmi Ödendi' : 'Bekliyor')}
        </span>
      </td>
      <td style="white-space: nowrap;">
        ${tx.status !== 'PAID' ? `
          <button class="btn btn-sm ${tx.type === 'INCOME' ? 'btn-primary' : 'btn-burgundy'}" onclick="openSettlePaymentModal('${tx.id}')" title="Kısmi / Tam Ödeme Yap" style="padding: 2px 6px; font-size: 0.68rem; margin-right: 4px;">
            ${tx.type === 'INCOME' ? 'Tahsil Et' : 'Öde'}
          </button>
        ` : ''}
        <button class="btn btn-sm btn-ghost" onclick="openEditTransactionModal('${tx.id}')" title="İşlemi Düzenle" style="padding: 2px 5px; margin-right: 2px;">✏️</button>
        <button class="btn btn-sm btn-ghost" onclick="deleteTransaction('${tx.id}')" title="İşlemi Sil" style="padding: 2px 5px;">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteTransaction(txId) {
  if (confirm('Bu finans kaydını silmek istediğinize emin misiniz?')) {
    state.transactions = state.transactions.filter(t => t.id !== txId);
    saveState();
    renderTransactionsTable();
    renderDashboard();
  }
}

// =============================================================================
// 6. KASA & BANKA SAYFASI
// =============================================================================

function renderAccountsPage() {
  if (!state.accounts || !Array.isArray(state.accounts) || state.accounts.length === 0) {
    state.accounts = JSON.parse(JSON.stringify(DEFAULT_STATE.accounts));
  }
  if (!state.transfers || !Array.isArray(state.transfers)) {
    state.transfers = JSON.parse(JSON.stringify(DEFAULT_STATE.transfers || []));
  }

  const container = document.getElementById('accountsListContainer');
  if (container) {
    container.innerHTML = '';

    if (state.accounts.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2.5rem; color:var(--text-muted);">Kayıtlı kasa veya banka hesabı bulunamadı.</div>`;
    } else {
      state.accounts.forEach(acc => {
        const card = document.createElement('div');
        card.className = 'account-card';
        card.innerHTML = `
          <div class="account-header">
            <span class="account-type">${acc.type === 'BANK' ? '🏦 Banka Hesabı' : (acc.type === 'CASH' ? '💵 Nakit Kasa' : '💳 Kart/POS')}</span>
            <span class="badge positive">Aktif</span>
          </div>
          <div class="account-name">${escapeHtml(acc.name)}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 4px;">${escapeHtml(acc.iban || '-')}</div>
          <div class="account-balance text-green">${formatCurrency(acc.balance || 0)}</div>
        `;
        container.appendChild(card);
      });
    }
  }

  // Transfer Listesi
  const trTbody = document.getElementById('transfersTbody');
  if (trTbody) {
    trTbody.innerHTML = '';
    if (state.transfers.length === 0) {
      trTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">Kayıtlı virman veya transfer hareketi bulunamadı.</td></tr>`;
    } else {
      [...state.transfers].reverse().forEach(tr => {
        const fromA = state.accounts.find(a => a.id === tr.fromAcc);
        const toA = state.accounts.find(a => a.id === tr.toAcc);
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${formatDate(tr.date)}</td>
          <td>${fromA ? escapeHtml(fromA.name) : '-'}</td>
          <td>${toA ? escapeHtml(toA.name) : '-'}</td>
          <td style="font-weight: 700; color: var(--accent-blue);">${formatCurrency(tr.amount || 0)}</td>
          <td>${escapeHtml(tr.note || 'Virman transferi')}</td>
        `;
        trTbody.appendChild(row);
      });
    }
  }
}

// =============================================================================
// 7. CARİ HESAPLAR SAYFASI (LİSTE & TABLO GÖRÜNÜMÜ)
// =============================================================================

let currentContactViewMode = 'table';

function setContactViewMode(mode) {
  currentContactViewMode = mode;
  const btnTable = document.getElementById('btnContactViewTable');
  const btnCards = document.getElementById('btnContactViewCards');
  const viewTable = document.getElementById('contactsTableView');
  const viewCards = document.getElementById('contactsCardsView');

  if (mode === 'table') {
    if (btnTable) { btnTable.className = 'btn btn-sm btn-secondary'; }
    if (btnCards) { btnCards.className = 'btn btn-sm btn-ghost'; }
    if (viewTable) viewTable.style.display = 'block';
    if (viewCards) viewCards.style.display = 'none';
  } else {
    if (btnTable) { btnTable.className = 'btn btn-sm btn-ghost'; }
    if (btnCards) { btnCards.className = 'btn btn-sm btn-secondary'; }
    if (viewTable) viewTable.style.display = 'none';
    if (viewCards) viewCards.style.display = 'grid';
  }
}

function renderContactsPage() {
  if (!state.contacts) state.contacts = [];

  // 1. KPI İstatistiklerini Güncelle
  const receivables = state.contacts.filter(c => c.balance > 0).reduce((sum, c) => sum + c.balance, 0);
  const payables = state.contacts.filter(c => c.balance < 0).reduce((sum, c) => sum + Math.abs(c.balance), 0);
  const net = receivables - payables;

  const kpiRec = document.getElementById('kpiContactReceivables');
  if (kpiRec) kpiRec.textContent = formatCurrency(receivables);
  const kpiPay = document.getElementById('kpiContactPayables');
  if (kpiPay) kpiPay.textContent = formatCurrency(payables);
  const kpiNet = document.getElementById('kpiContactNet');
  if (kpiNet) {
    kpiNet.textContent = (net >= 0 ? '+' : '-') + formatCurrency(Math.abs(net));
    kpiNet.className = 'kpi-value ' + (net > 0 ? 'text-green' : (net < 0 ? 'text-danger' : ''));
  }
  const kpiTot = document.getElementById('kpiContactTotalCount');
  if (kpiTot) kpiTot.textContent = `${state.contacts.length} Cari`;

  // 2. Filtreleri Al
  const searchInput = document.getElementById('filterContactSearch');
  const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const typeSelect = document.getElementById('filterContactType');
  const typeVal = typeSelect ? typeSelect.value : 'ALL';

  const balanceSelect = document.getElementById('filterContactBalance');
  const balanceVal = balanceSelect ? balanceSelect.value : 'ALL';

  // 3. Filtreleme Uygula
  const filtered = state.contacts.filter(c => {
    if (searchVal) {
      const matchName = (c.name || '').toLowerCase().includes(searchVal);
      const matchPhone = (c.phone || '').toLowerCase().includes(searchVal);
      const matchId = (c.id || '').toLowerCase().includes(searchVal);
      if (!matchName && !matchPhone && !matchId) return false;
    }
    if (typeVal !== 'ALL' && c.type !== typeVal) return false;
    if (balanceVal === 'RECEIVABLE' && c.balance <= 0) return false;
    if (balanceVal === 'PAYABLE' && c.balance >= 0) return false;
    if (balanceVal === 'ZERO' && c.balance !== 0) return false;
    return true;
  });

  // 4. Liste / Tablo (Table) Görünümünü Doldur
  const tbody = document.getElementById('contactsTableTbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
        Arama kriterlerine uygun cari hesap kaydı bulunamadı.
      </td></tr>`;
    } else {
      filtered.forEach(c => {
        const isReceivable = c.balance > 0;
        const isPayable = c.balance < 0;
        const initials = (c.name || 'CR').split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--bg-surface-hover); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: var(--brand-primary); flex-shrink: 0;">
                ${initials}
              </div>
              <div>
                <strong style="color: var(--text-main); font-size: 0.92rem; display: block;">${c.name}</strong>
                <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${c.id}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="badge ${c.type === 'CUSTOMER' ? 'positive' : 'neutral'}" style="font-size: 0.75rem;">
              ${c.type === 'CUSTOMER' ? '👤 Müşteri (Alıcı)' : '🏭 Tedarikçi'}
            </span>
          </td>
          <td>
            ${c.phone ? `<a href="tel:${c.phone}" style="color: var(--text-main); text-decoration: none; font-size: 0.84rem; display: inline-flex; align-items: center; gap: 4px;">
              📞 <span>${c.phone}</span>
            </a>` : '<span style="color: var(--text-muted); font-size: 0.8rem;">—</span>'}
          </td>
          <td>
            <span class="badge ${isReceivable ? 'positive' : (isPayable ? 'warning' : 'neutral')}">
              ${isReceivable ? '🟢 Alacağımız Var' : (isPayable ? '🔴 Borcumuz Var' : '⚪ Bakiye Sıfır')}
            </span>
          </td>
          <td style="text-align: right;">
            <div class="${isReceivable ? 'text-green' : (isPayable ? 'text-danger' : '')}" style="font-family: var(--font-heading); font-weight: 700; font-size: 1.05rem;">
              ${isReceivable ? '+' : (isPayable ? '-' : '')}${formatCurrency(Math.abs(c.balance))}
            </div>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 6px; justify-content: flex-end; align-items: center;">
              <button class="btn btn-sm ${isReceivable ? 'btn-secondary' : 'btn-burgundy'}" style="padding: 4px 9px; font-size: 0.76rem;" onclick="openNewTransactionModal('${isReceivable ? 'INCOME' : 'EXPENSE'}', '${c.id}')" title="${isReceivable ? 'Tahsilat Al' : 'Ödeme Yap'}">
                ${isReceivable ? '💰 Tahsilat' : '💸 Ödeme'}
              </button>
              <button class="btn btn-sm btn-ghost" style="padding: 4px 8px; font-size: 0.76rem;" onclick="openContactStatementModal('${c.id}')" title="Cari Hesap Ekstresi">
                📄 Ekstre
              </button>
              <button class="btn btn-sm btn-ghost" style="padding: 4px 6px; font-size: 0.76rem; color: var(--text-muted);" onclick="openEditContactModal('${c.id}')" title="Düzenle">
                ✏️
              </button>
              <button class="btn btn-sm btn-ghost" style="padding: 4px 6px; font-size: 0.76rem; color: var(--accent-red);" onclick="deleteContact('${c.id}')" title="Sil">
                🗑️
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // 5. Kartlar Görünümünü Doldur (İkincil)
  const cardsContainer = document.getElementById('contactsCardsView');
  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    filtered.forEach(c => {
      const card = document.createElement('div');
      card.className = 'contact-card';
      const isReceivable = c.balance > 0;
      const isPayable = c.balance < 0;

      card.innerHTML = `
        <div class="account-header">
          <span class="account-type">${c.type === 'CUSTOMER' ? '👤 Müşteri (Alıcı)' : '🏭 Tedarikçi'}</span>
          <span class="badge ${isReceivable ? 'positive' : (isPayable ? 'warning' : 'neutral')}">
            ${isReceivable ? 'Alacağımız Var' : (isPayable ? 'Borcumuz Var' : 'Hesap Sıfır')}
          </span>
        </div>
        <div class="account-name">${c.name}</div>
        <div style="font-size: 0.8rem; color: var(--text-dim); margin: 6px 0;">📞 ${c.phone || '—'}</div>
        <div class="account-balance ${isReceivable ? 'text-green' : (isPayable ? 'text-danger' : '')}">
          ${formatCurrency(Math.abs(c.balance))}
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-sm btn-secondary" onclick="openNewTransactionModal('${isReceivable ? 'INCOME' : 'EXPENSE'}', '${c.id}')">
            ${isReceivable ? 'Tahsilat Al' : 'Ödeme Yap'}
          </button>
          <button class="btn btn-sm btn-ghost" onclick="openContactStatementModal('${c.id}')" title="Cari Hesap Ekstresi">
            📄 Ekstre
          </button>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
  }
}

// =============================================================================
// 7.1 ÇEK TAKİP VE PORTFÖY YÖNETİMİ
// =============================================================================

let activeCheckTab = 'ALL';

function renderChecksPage() {
  if (!state.checks) state.checks = [];

  const now = new Date();
  const in15Days = new Date();
  in15Days.setDate(in15Days.getDate() + 15);

  let portfolioTotal = 0;
  let portfolioCount = 0;
  let outgoingTotal = 0;
  let outgoingCount = 0;
  let upcomingTotal = 0;
  let upcomingCount = 0;
  let settledTotal = 0;

  state.checks.forEach(c => {
    const amt = parseFloat(c.amount) || 0;
    const due = new Date(c.dueDate);

    if (c.type === 'INCOMING' && c.status === 'PORTFOLIO') {
      portfolioTotal += amt;
      portfolioCount++;
    }
    if (c.type === 'OUTGOING' && c.status === 'PORTFOLIO') {
      outgoingTotal += amt;
      outgoingCount++;
    }
    if (c.status === 'PORTFOLIO' && due <= in15Days) {
      upcomingTotal += amt;
      upcomingCount++;
    }
    if (c.status === 'COLLECTED' || c.status === 'PAID') {
      settledTotal += amt;
    }
  });

  const kpiPortTot = document.getElementById('kpiPortfolioChecksTotal');
  if (kpiPortTot) kpiPortTot.textContent = formatCurrency(portfolioTotal);
  const kpiPortCnt = document.getElementById('kpiPortfolioChecksCount');
  if (kpiPortCnt) kpiPortCnt.textContent = portfolioCount;

  const kpiOutTot = document.getElementById('kpiOutgoingChecksTotal');
  if (kpiOutTot) kpiOutTot.textContent = formatCurrency(outgoingTotal);
  const kpiOutCnt = document.getElementById('kpiOutgoingChecksCount');
  if (kpiOutCnt) kpiOutCnt.textContent = outgoingCount;

  const kpiUpTot = document.getElementById('kpiUpcomingChecksTotal');
  if (kpiUpTot) kpiUpTot.textContent = formatCurrency(upcomingTotal);
  const kpiUpCnt = document.getElementById('kpiUpcomingChecksCount');
  if (kpiUpCnt) kpiUpCnt.textContent = upcomingCount;

  const kpiSetTot = document.getElementById('kpiSettledChecksTotal');
  if (kpiSetTot) kpiSetTot.textContent = formatCurrency(settledTotal);

  // Tab Rozetleri
  const bAll = document.getElementById('tabCheckBadgeAll');
  if (bAll) bAll.textContent = state.checks.length;
  const bInc = document.getElementById('tabCheckBadgeIncoming');
  if (bInc) bInc.textContent = state.checks.filter(c => c.type === 'INCOMING').length;
  const bOut = document.getElementById('tabCheckBadgeOutgoing');
  if (bOut) bOut.textContent = state.checks.filter(c => c.type === 'OUTGOING').length;
  const bUp = document.getElementById('tabCheckBadgeUpcoming');
  if (bUp) bUp.textContent = upcomingCount;
  const bSet = document.getElementById('tabCheckBadgeSettled');
  if (bSet) bSet.textContent = state.checks.filter(c => c.status === 'COLLECTED' || c.status === 'PAID').length;

  // Sidebar badge
  const sbCheckBadge = document.getElementById('sidebarCheckBadge');
  if (sbCheckBadge) {
    sbCheckBadge.textContent = portfolioCount + outgoingCount;
    sbCheckBadge.style.display = (portfolioCount + outgoingCount > 0) ? 'inline-block' : 'none';
  }

  renderChecksTable();
}

function switchCheckTab(tab) {
  activeCheckTab = tab;
  document.querySelectorAll('[data-check-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-check-tab') === tab);
  });
  renderChecksTable();
}

function renderChecksTable() {
  const tbody = document.getElementById('checksTbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const statusFilter = document.getElementById('filterCheckStatus')?.value || 'ALL';
  const searchTerm = (document.getElementById('filterCheckSearch')?.value || '').toLowerCase().trim();

  const now = new Date();
  const in15Days = new Date();
  in15Days.setDate(in15Days.getDate() + 15);

  const filtered = (state.checks || []).filter(c => {
    // Tab filtre
    if (activeCheckTab === 'INCOMING' && c.type !== 'INCOMING') return false;
    if (activeCheckTab === 'OUTGOING' && c.type !== 'OUTGOING') return false;
    if (activeCheckTab === 'UPCOMING') {
      const due = new Date(c.dueDate);
      if (c.status !== 'PORTFOLIO' || due > in15Days) return false;
    }
    if (activeCheckTab === 'SETTLED' && !(c.status === 'COLLECTED' || c.status === 'PAID')) return false;

    // Durum filtre
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

    // Arama
    if (searchTerm) {
      const contact = (state.contacts || []).find(ct => ct.id === c.contactId);
      const contactName = contact ? contact.name.toLowerCase() : '';
      const text = `${c.checkNumber} ${c.drawer} ${c.bankName} ${c.branchName || ''} ${c.notes || ''} ${contactName}`.toLowerCase();
      if (!text.includes(searchTerm)) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-dim);">Kriterlere uygun çek kaydı bulunamadı.</td></tr>`;
    return;
  }

  // Vade tarihine göre sırala
  filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  filtered.forEach(c => {
    const tr = document.createElement('tr');
    const contact = (state.contacts || []).find(ct => ct.id === c.contactId);
    const contactName = contact ? contact.name : (c.drawer || '—');

    const due = new Date(c.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let dueTag = '';
    if (c.status === 'PORTFOLIO') {
      if (diffDays < 0) {
        dueTag = `<span style="display:inline-block; font-size:0.68rem; color:#ef4444; font-weight:700; background:rgba(239,68,68,0.12); padding:1px 6px; border-radius:4px; margin-top:2px;">⚠️ Vadesi Geçti (${Math.abs(diffDays)} gün)</span>`;
      } else if (diffDays === 0) {
        dueTag = `<span style="display:inline-block; font-size:0.68rem; color:#f59e0b; font-weight:700; background:rgba(245,158,11,0.12); padding:1px 6px; border-radius:4px; margin-top:2px;">🔔 Bugün Doluyor</span>`;
      } else if (diffDays <= 15) {
        dueTag = `<span style="display:inline-block; font-size:0.68rem; color:#eab308; font-weight:700; background:rgba(234,179,8,0.12); padding:1px 6px; border-radius:4px; margin-top:2px;">⏰ ${diffDays} gün kaldı</span>`;
      } else {
        dueTag = `<span style="display:inline-block; font-size:0.68rem; color:var(--text-dim); margin-top:2px;">${diffDays} gün</span>`;
      }
    }

    let statusBadge = '';
    switch (c.status) {
      case 'PORTFOLIO':
        statusBadge = `<span class="badge-check portfolio">Portföyde</span>`;
        break;
      case 'COLLECTED':
        statusBadge = `<span class="badge-check collected">Tahsil Edildi</span>`;
        break;
      case 'ENDORSED':
        statusBadge = `<span class="badge-check endorsed">Ciro Edildi</span>`;
        break;
      case 'PAID':
        statusBadge = `<span class="badge-check paid">Ödendi</span>`;
        break;
      case 'BOUNCED':
        statusBadge = `<span class="badge-check bounced">Karşılıksız</span>`;
        break;
      case 'CANCELLED':
        statusBadge = `<span class="badge-check cancelled">İptal / İade</span>`;
        break;
      default:
        statusBadge = `<span class="badge-check">${c.status}</span>`;
    }

    // Aksiyon butonları
    let actionButtons = '';
    if (c.type === 'INCOMING' && c.status === 'PORTFOLIO') {
      actionButtons += `
        <button class="btn btn-sm btn-secondary" style="padding: 3px 8px; font-size: 0.74rem;" onclick="openCollectCheckModal('${c.id}')" title="Bankada Tahsil Et">
          🏦 Tahsil Et
        </button>
        <button class="btn btn-sm btn-ghost" style="padding: 3px 8px; font-size: 0.74rem;" onclick="openEndorseCheckModal('${c.id}')" title="Tedarikçiye Ciro Et">
          🔄 Ciro Et
        </button>
        <button class="btn btn-sm btn-ghost" style="padding: 3px 6px; font-size: 0.74rem; color: var(--accent-red);" onclick="markCheckBounced('${c.id}')" title="Karşılıksız İşle">
          ⚠️
        </button>
      `;
    } else if (c.type === 'OUTGOING' && c.status === 'PORTFOLIO') {
      actionButtons += `
        <button class="btn btn-sm btn-secondary" style="padding: 3px 8px; font-size: 0.74rem;" onclick="markOutgoingCheckPaid('${c.id}')" title="Bankadan Ödendi Olarak İşle">
          ✅ Ödendi İşle
        </button>
      `;
    }

    actionButtons += `
      <button class="btn btn-sm btn-ghost" style="padding: 3px 6px; font-size: 0.74rem;" onclick="openEditCheckModal('${c.id}')" title="Düzenle">
        ✏️
      </button>
      <button class="btn btn-sm btn-ghost" style="padding: 3px 6px; font-size: 0.74rem; color: var(--accent-red);" onclick="deleteCheckRecord('${c.id}')" title="Sil">
        🗑️
      </button>
    `;

    tr.innerHTML = `
      <td>
        <span class="badge" style="background: ${c.type === 'INCOMING' ? 'rgba(30, 77, 43, 0.2)' : 'rgba(123, 30, 38, 0.2)'}; color: ${c.type === 'INCOMING' ? 'var(--accent-success)' : 'var(--accent-red)'}; font-weight: 700;">
          ${c.type === 'INCOMING' ? '📥 Alınan' : '📤 Verilen'}
        </span>
      </td>
      <td><strong>${c.checkNumber}</strong></td>
      <td>
        <div><strong>${c.drawer}</strong></div>
        <div style="font-size: 0.76rem; color: var(--text-dim);">${contactName !== c.drawer ? 'Cari: ' + contactName : ''}</div>
      </td>
      <td>
        <div>${c.bankName}</div>
        <div style="font-size: 0.76rem; color: var(--text-dim);">${c.branchName || ''}</div>
      </td>
      <td>${formatDate(c.issueDate)}</td>
      <td>
        <div><strong>${formatDate(c.dueDate)}</strong></div>
        <div>${dueTag}</div>
      </td>
      <td>
        <strong style="font-size: 1.05rem; font-family: var(--font-heading); color: ${c.type === 'INCOMING' ? 'var(--accent-success)' : 'var(--accent-red)'};">
          ${formatCurrency(c.amount)}
        </strong>
      </td>
      <td>${statusBadge}</td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 4px; align-items: center; justify-content: flex-end;">
          ${actionButtons}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openNewCheckModal(defaultType = 'INCOMING') {
  const form = document.getElementById('checkForm');
  if (form) form.reset();

  document.getElementById('checkEditingId').value = '';
  document.getElementById('modalCheckTitle').textContent = 'Yeni Çek Girişi';
  document.getElementById('checkType').value = defaultType;

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('checkIssueDate').value = today;

  const dueD = new Date();
  dueD.setDate(dueD.getDate() + 30);
  document.getElementById('checkDueDate').value = dueD.toISOString().split('T')[0];

  populateCheckContactDropdown();
  openModal('modalCheck');
}

function openEditCheckModal(chkId) {
  const chk = (state.checks || []).find(c => c.id === chkId);
  if (!chk) return;

  document.getElementById('checkEditingId').value = chk.id;
  document.getElementById('modalCheckTitle').textContent = 'Çek Kaydını Düzenle';
  document.getElementById('checkType').value = chk.type;
  document.getElementById('checkNumber').value = chk.checkNumber;
  document.getElementById('checkAmount').value = chk.amount;
  document.getElementById('checkDueDate').value = chk.dueDate;
  document.getElementById('checkIssueDate').value = chk.issueDate;
  document.getElementById('checkDrawer').value = chk.drawer;
  document.getElementById('checkBankName').value = chk.bankName;
  document.getElementById('checkBranchName').value = chk.branchName || '';
  document.getElementById('checkStatus').value = chk.status;
  document.getElementById('checkNotes').value = chk.notes || '';

  populateCheckContactDropdown();
  if (chk.contactId) {
    document.getElementById('checkContact').value = chk.contactId;
  }

  openModal('modalCheck');
}

function populateCheckContactDropdown() {
  const select = document.getElementById('checkContact');
  if (!select) return;
  select.innerHTML = '<option value="">-- Cari Seçilmedi --</option>';

  (state.contacts || []).forEach(ct => {
    const opt = document.createElement('option');
    opt.value = ct.id;
    opt.textContent = `${ct.name} (${ct.type === 'CUSTOMER' ? 'Müşteri' : 'Tedarikçi'})`;
    select.appendChild(opt);
  });
}

function onCheckTypeChanged() {
  const type = document.getElementById('checkType').value;
  if (type === 'OUTGOING' && !document.getElementById('checkDrawer').value) {
    document.getElementById('checkDrawer').value = state.farm?.name || 'Özate Çiftliği';
  }
}

function handleCheckSubmit(e) {
  e.preventDefault();
  const editingId = document.getElementById('checkEditingId').value;
  const type = document.getElementById('checkType').value;
  const checkNumber = document.getElementById('checkNumber').value.trim();
  const amount = parseFloat(document.getElementById('checkAmount').value) || 0;
  const dueDate = document.getElementById('checkDueDate').value;
  const issueDate = document.getElementById('checkIssueDate').value;
  const drawer = document.getElementById('checkDrawer').value.trim();
  const bankName = document.getElementById('checkBankName').value.trim();
  const branchName = document.getElementById('checkBranchName').value.trim();
  const contactId = document.getElementById('checkContact').value || null;
  const status = document.getElementById('checkStatus').value;
  const notes = document.getElementById('checkNotes').value.trim();

  if (!state.checks) state.checks = [];

  if (editingId) {
    const chk = state.checks.find(c => c.id === editingId);
    if (chk) {
      chk.type = type;
      chk.checkNumber = checkNumber;
      chk.amount = amount;
      chk.dueDate = dueDate;
      chk.issueDate = issueDate;
      chk.drawer = drawer;
      chk.bankName = bankName;
      chk.branchName = branchName;
      chk.contactId = contactId;
      chk.status = status;
      chk.notes = notes;

      if (window.dbService && window.dbService.upsertCheck) {
        window.dbService.upsertCheck(chk);
      }
      logAudit('ÇEK GÜNCELLENDİ', `${checkNumber} no'lu çek bilgileri güncellendi (${formatCurrency(amount)})`);
    }
  } else {
    const newCheck = {
      id: 'chk-' + Date.now(),
      checkNumber,
      type,
      amount,
      dueDate,
      issueDate,
      drawer,
      bankName,
      branchName,
      contactId,
      status,
      endorsedToContactId: null,
      targetAccountId: null,
      notes
    };
    state.checks.unshift(newCheck);

    if (window.dbService && window.dbService.upsertCheck) {
      window.dbService.upsertCheck(newCheck);
    }
    logAudit('YENİ ÇEK GİRİŞİ', `${type === 'INCOMING' ? 'Alınan' : 'Verilen'} çek sisteme işlendi: ${checkNumber} - ${formatCurrency(amount)}`);
  }

  saveState();
  closeModal('modalCheck');
  renderChecksPage();
}

function openCollectCheckModal(chkId) {
  const chk = (state.checks || []).find(c => c.id === chkId);
  if (!chk) return;

  document.getElementById('collectCheckId').value = chk.id;
  document.getElementById('collectCheckSummary').textContent = `${chk.checkNumber} - ${chk.drawer} (${chk.bankName})`;
  document.getElementById('collectCheckAmount').textContent = formatCurrency(chk.amount);

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('collectDate').value = today;

  const accSelect = document.getElementById('collectAccount');
  if (accSelect) {
    accSelect.innerHTML = '';
    (state.accounts || []).forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.textContent = `${a.name} (Bakiye: ${formatCurrency(a.balance)})`;
      accSelect.appendChild(opt);
    });
  }

  openModal('modalCheckCollect');
}

function handleCheckCollectSubmit(e) {
  e.preventDefault();
  const chkId = document.getElementById('collectCheckId').value;
  const targetAccId = document.getElementById('collectAccount').value;
  const collectDate = document.getElementById('collectDate').value;

  const chk = (state.checks || []).find(c => c.id === chkId);
  if (!chk) return;

  const acc = (state.accounts || []).find(a => a.id === targetAccId);
  if (!acc) return;

  chk.status = 'COLLECTED';
  chk.targetAccountId = targetAccId;
  acc.balance = (parseFloat(acc.balance) || 0) + chk.amount;

  const newTx = {
    id: 'tx-' + Date.now(),
    date: collectDate,
    type: 'INCOME',
    category: 'Diğer Gelirler',
    amount: chk.amount,
    paidAmount: chk.amount,
    status: 'PAID',
    contactId: chk.contactId || null,
    accountId: targetAccId,
    desc: `Çek Tahsilatı: ${chk.checkNumber} (${chk.drawer} - ${chk.bankName})`
  };
  state.transactions.unshift(newTx);

  if (window.dbService) {
    if (window.dbService.upsertCheck) window.dbService.upsertCheck(chk);
    if (window.dbService.upsertAccount) window.dbService.upsertAccount(acc);
    if (window.dbService.upsertTransaction) window.dbService.upsertTransaction(newTx);
  }

  logAudit('ÇEK TAHSİL EDİLDİ', `${chk.checkNumber} no'lu çek ${acc.name} hesabına tahsil edildi (+${formatCurrency(chk.amount)})`);
  saveState();
  closeModal('modalCheckCollect');
  renderChecksPage();
  renderDashboard();
  alert(`${chk.checkNumber} no'lu çek başarıyla tahsil edildi ve ${acc.name} hesabına aktarıldı! 🎉`);
}

function openEndorseCheckModal(chkId) {
  const chk = (state.checks || []).find(c => c.id === chkId);
  if (!chk) return;

  document.getElementById('endorseCheckId').value = chk.id;
  document.getElementById('endorseCheckSummary').textContent = `${chk.checkNumber} - ${chk.drawer} (${chk.bankName})`;
  document.getElementById('endorseCheckAmount').textContent = formatCurrency(chk.amount);

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('endorseDate').value = today;

  const contactSelect = document.getElementById('endorseContact');
  if (contactSelect) {
    contactSelect.innerHTML = '<option value="">-- Tedarikçi Seçiniz --</option>';
    (state.contacts || []).filter(c => c.type === 'SUPPLIER').forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} (Mevcut Borç: ${formatCurrency(Math.abs(c.balance))})`;
      contactSelect.appendChild(opt);
    });
  }

  openModal('modalCheckEndorse');
}

function handleCheckEndorseSubmit(e) {
  e.preventDefault();
  const chkId = document.getElementById('endorseCheckId').value;
  const targetContactId = document.getElementById('endorseContact').value;
  const endorseDate = document.getElementById('endorseDate').value;

  if (!targetContactId) {
    alert('Lütfen çekin ciro edileceği tedarikçi cariyi seçiniz.');
    return;
  }

  const chk = (state.checks || []).find(c => c.id === chkId);
  if (!chk) return;

  const contact = (state.contacts || []).find(c => c.id === targetContactId);
  if (!contact) return;

  chk.status = 'ENDORSED';
  chk.endorsedToContactId = targetContactId;
  contact.balance = (parseFloat(contact.balance) || 0) + chk.amount;

  const newTx = {
    id: 'tx-' + Date.now(),
    date: endorseDate,
    type: 'EXPENSE',
    category: 'Diğer Giderler',
    amount: chk.amount,
    paidAmount: chk.amount,
    status: 'PAID',
    contactId: targetContactId,
    accountId: null,
    desc: `Çek Cirosu: ${chk.checkNumber} no'lu müşteri çeki ${contact.name} carisine devredildi.`
  };
  state.transactions.unshift(newTx);

  if (window.dbService) {
    if (window.dbService.upsertCheck) window.dbService.upsertCheck(chk);
    if (window.dbService.upsertContact) window.dbService.upsertContact(contact);
    if (window.dbService.upsertTransaction) window.dbService.upsertTransaction(newTx);
  }

  logAudit('ÇEK CİRO EDİLDİ', `${chk.checkNumber} no'lu çek ${contact.name} tedarikçisine ciro edildi (${formatCurrency(chk.amount)})`);
  saveState();
  closeModal('modalCheckEndorse');
  renderChecksPage();
  renderContactsPage();
  alert(`${chk.checkNumber} no'lu çek başarıyla ${contact.name} carisine ciro edildi ve borç bakiyesinden düşüldü! 🔄`);
}

function markOutgoingCheckPaid(chkId) {
  const chk = (state.checks || []).find(c => c.id === chkId);
  if (!chk) return;

  const defaultAcc = (state.accounts || []).find(a => a.type === 'BANK') || state.accounts[0];
  const accName = prompt(`"${chk.checkNumber}" no'lu (${formatCurrency(chk.amount)}) borç çeki bankadan ödendi olarak işaretleniyor.\nÖdemenin düşeceği banka/kasa hesabını onaylayınız:`, defaultAcc ? defaultAcc.name : 'Ziraat Bankası Ticari');
  if (!accName) return;

  const targetAcc = (state.accounts || []).find(a => a.name.toLowerCase().includes(accName.toLowerCase())) || defaultAcc;

  chk.status = 'PAID';
  chk.targetAccountId = targetAcc ? targetAcc.id : null;

  if (targetAcc) {
    targetAcc.balance = (parseFloat(targetAcc.balance) || 0) - chk.amount;
  }

  const newTx = {
    id: 'tx-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    category: 'Diğer Giderler',
    amount: chk.amount,
    paidAmount: chk.amount,
    status: 'PAID',
    contactId: chk.contactId || null,
    accountId: targetAcc ? targetAcc.id : null,
    desc: `Verilen Çek Ödemesi: ${chk.checkNumber} bankadan ödendi.`
  };
  state.transactions.unshift(newTx);

  if (window.dbService) {
    if (window.dbService.upsertCheck) window.dbService.upsertCheck(chk);
    if (targetAcc && window.dbService.upsertAccount) window.dbService.upsertAccount(targetAcc);
    if (window.dbService.upsertTransaction) window.dbService.upsertTransaction(newTx);
  }

  logAudit('VERİLEN ÇEK ÖDENDİ', `${chk.checkNumber} no'lu borç çeki bankadan ödendi (${formatCurrency(chk.amount)})`);
  saveState();
  renderChecksPage();
  renderAccountsPage();
  alert(`${chk.checkNumber} no'lu çek ödendi olarak kaydedildi!`);
}

function markCheckBounced(chkId) {
  const chk = (state.checks || []).find(c => c.id === chkId);
  if (!chk) return;

  if (!confirm(`DİKKAT: "${chk.checkNumber}" no'lu (${formatCurrency(chk.amount)}) çek KARŞILIKSIZ / PROTESTOLU olarak işaretlenecek. Onaylıyor musunuz?`)) {
    return;
  }

  chk.status = 'BOUNCED';
  if (window.dbService && window.dbService.upsertCheck) {
    window.dbService.upsertCheck(chk);
  }

  logAudit('KARŞILIKSIZ ÇEK', `⚠️ ${chk.checkNumber} no'lu çek karşılıksız çıktı (${formatCurrency(chk.amount)})`);
  saveState();
  renderChecksPage();
  alert(`Çek karşılıksız olarak işaretlendi ve risk listesine alındı.`);
}

function deleteCheckRecord(chkId) {
  const chk = (state.checks || []).find(c => c.id === chkId);
  if (!chk) return;

  if (!confirm(`"${chk.checkNumber}" numaralı çek kaydı kalıcı olarak silinecektir. Devam edilsin mi?`)) {
    return;
  }

  state.checks = state.checks.filter(c => c.id !== chkId);
  if (window.dbService && window.dbService.deleteCheck) {
    window.dbService.deleteCheck(chkId);
  }

  logAudit('ÇEK SİLİNDİ', `${chk.checkNumber} no'lu çek kaydı sistemden silindi.`);
  saveState();
  renderChecksPage();
}

function printCheckBordro() {
  window.print();
}

// =============================================================================
// 7B. KURBAN SATIŞ & KESİMHANE YÖNETİMİ MODÜLÜ
// =============================================================================

let activeQurbanView = 'CARDS'; // 'CARDS' | 'SCHEDULE' | 'SHARES_TABLE'

function renderQurbanPage() {
  if (!state.qurbanAnimals || !Array.isArray(state.qurbanAnimals) || state.qurbanAnimals.length === 0) {
    state.qurbanAnimals = JSON.parse(JSON.stringify(DEFAULT_STATE.qurbanAnimals));
  }
  if (!state.qurbanShares || !Array.isArray(state.qurbanShares) || state.qurbanShares.length === 0) {
    state.qurbanShares = JSON.parse(JSON.stringify(DEFAULT_STATE.qurbanShares));
  }

  // Aktif görünüm sekmesini kontrol et
  if (typeof activeQurbanView !== 'undefined') {
    switchQurbanView(activeQurbanView);
  }

  const typeFilter = document.getElementById('filterQurbanType')?.value || 'ALL';
  const dayFilter  = document.getElementById('filterQurbanDay')?.value  || 'ALL';
  const search     = (document.getElementById('filterQurbanSearch')?.value || '').toLowerCase().trim();

  // ── KPI Hesapla ────────────────────────────────────────────────────────────
  const animals = state.qurbanAnimals;
  const shares  = state.qurbanShares;

  const bigCount   = animals.filter(a => a.animalType === 'BÜYÜKBAŞ').length;
  const smallCount = animals.filter(a => a.animalType === 'KÜÇÜKBAŞ').length;
  const totalShares = animals.reduce((s, a) => s + (parseInt(a.shareCount) || 0), 0);
  const soldShares  = shares.length;
  const occupancy   = totalShares > 0 ? Math.round((soldShares / totalShares) * 100) : 0;

  let totalRevenue = 0, totalDeposit = 0, totalRemaining = 0;
  shares.forEach(sh => {
    const price   = parseFloat(sh.sharePrice)   || 0;
    const deposit = parseFloat(sh.depositAmount) || 0;
    totalRevenue   += price;
    totalDeposit   += deposit;
    totalRemaining += (price - deposit);
  });

  // ── KPI DOM Güncelle ───────────────────────────────────────────────────────
  const _set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  _set('kpiQurbanAnimalCount',    animals.length);
  _set('kpiQurbanTypeBreakdown',  `${bigCount} Büyükbaş, ${smallCount} Küçükbaş`);
  _set('kpiQurbanOccupancyRate',  `%${occupancy}`);
  _set('kpiQurbanSoldSharesCount', soldShares);
  _set('kpiQurbanTotalSharesCount', totalShares);
  _set('kpiQurbanRevenueTotal',   formatCurrency(totalRevenue));
  _set('kpiQurbanRemainingBalance', formatCurrency(totalRemaining));
  _set('kpiQurbanCollectedDeposit', formatCurrency(totalDeposit));

  // Sidebar rozeti
  const sbBadge = document.getElementById('sidebarQurbanBadge');
  if (sbBadge) sbBadge.textContent = `${soldShares}/${totalShares}`;

  // ── Filtreleme ─────────────────────────────────────────────────────────────
  const filtered = animals.filter(a => {
    if (typeFilter !== 'ALL' && a.animalType !== typeFilter) return false;
    if (dayFilter  !== 'ALL' && String(a.slaughterDay) !== dayFilter) return false;
    if (search) {
      const hay = `${a.qurbanNo} ${a.earTag || ''} ${a.breed || ''} ${a.notes || ''}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  // ── Görünümleri Render Et ─────────────────────────────────────────────────
  renderQurbanCards(filtered);
  renderQurbanSchedule(filtered);
  renderQurbanSharesTable(filtered);
}

function renderQurbanCards(animals) {
  const container = document.getElementById('qurbanCardsContainer');
  if (!container) return;

  if (!animals.length) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-dim);">
      <div style="font-size:3rem;margin-bottom:1rem;">🐑</div>
      <div style="font-size:1rem;font-weight:600;">Kurbanlık kaydı bulunamadı.</div>
      <div style="font-size:0.82rem;margin-top:0.5rem;">Yeni bir kurbanlık tanımlamak için "Yeni Kurbanlık Tanımla" butonuna tıklayın.</div>
    </div>`;
    return;
  }

  container.innerHTML = animals.map(a => {
    const animalShares = (state.qurbanShares || []).filter(s => s.qurbanId === a.id);
    const soldCount   = animalShares.length;
    const totalShares = parseInt(a.shareCount) || 7;
    const emptySlots  = totalShares - soldCount;
    const fillPct     = Math.round((soldCount / totalShares) * 100);

    const statusMap = {
      AVAILABLE:          { label: 'Müsait',          color: 'var(--accent-success)',  bg: 'rgba(30,77,43,0.15)' },
      PARTIALLY_RESERVED: { label: 'Kısmen Doldu',    color: '#eab308',                bg: 'rgba(234,179,8,0.15)' },
      SOLD_OUT:           { label: 'Hisse Tamam',      color: '#3b82f6',                bg: 'rgba(43,114,186,0.15)' },
      SLAUGHTERED:        { label: 'Kesildi',          color: 'var(--text-dim)',         bg: 'rgba(0,0,0,0.1)' },
    };
    const st = statusMap[a.status] || statusMap.AVAILABLE;
    const typeIcon = a.animalType === 'BÜYÜKBAŞ' ? '🐂' : '🐑';

    const shareSlots = Array.from({ length: totalShares }, (_, i) => {
      const sh = animalShares.find(s => s.shareIndex === i + 1);
      if (sh) {
        const payColor = sh.paymentStatus === 'PAID' ? 'var(--accent-success)' : sh.paymentStatus === 'PARTIAL' ? '#eab308' : 'var(--accent-red)';
        return `<div title="${sh.shareholderName} — ${sh.paymentStatus === 'PAID' ? 'Tam Ödendi' : sh.paymentStatus === 'PARTIAL' ? 'Kapora Alındı' : 'Ödeme Bekleniyor'}"
          style="flex:1;height:28px;background:${payColor};border-radius:4px;opacity:0.9;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:700;color:#fff;"
          onclick="openEditShareModal('${sh.id}')">${i + 1}</div>`;
      }
      return `<div title="${i + 1}. Hisse — Boş"
        style="flex:1;height:28px;background:var(--bg-surface-soft);border:1.5px dashed var(--border-subtle);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.65rem;color:var(--text-dim);"
        onclick="openAddShareModal('${a.id}', ${i + 1})">${i + 1}</div>`;
    }).join('');

    const shareRows = animalShares.slice(0, 3).map(sh => {
      const payBadge = sh.paymentStatus === 'PAID'
        ? `<span style="font-size:0.62rem;padding:1px 5px;border-radius:8px;background:rgba(30,77,43,0.2);color:var(--accent-success);">Tam Ödendi</span>`
        : sh.paymentStatus === 'PARTIAL'
        ? `<span style="font-size:0.62rem;padding:1px 5px;border-radius:8px;background:rgba(234,179,8,0.2);color:#eab308;">Kapora</span>`
        : `<span style="font-size:0.62rem;padding:1px 5px;border-radius:8px;background:rgba(123,30,38,0.2);color:var(--accent-red);">Bekliyor</span>`;
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:0.3rem 0;border-bottom:1px solid var(--border-subtle);font-size:0.78rem;">
        <span style="font-weight:600;">${sh.shareIndex}. ${sh.shareholderName}</span>
        <div style="display:flex;gap:6px;align-items:center;">${payBadge}
          <button onclick="openEditShareModal('${sh.id}')" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:0.75rem;padding:0 2px;" title="Düzenle">✏️</button>
          <button onclick="deleteQurbanShare('${sh.id}')" style="background:none;border:none;cursor:pointer;color:var(--accent-red);font-size:0.75rem;padding:0 2px;" title="Sil">🗑️</button>
        </div>
      </div>`;
    }).join('');

    const moreCount = animalShares.length - 3;

    return `<div class="dashboard-panel" style="padding:0;overflow:hidden;">
      <div style="padding:0.85rem 1rem 0.6rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.5rem;">${typeIcon}</span>
            <div>
              <div style="font-weight:800;font-size:1rem;">${a.qurbanNo}</div>
              <div style="font-size:0.75rem;color:var(--text-dim);">${a.breed || a.animalType} · ${a.liveWeight} kg canlı · ${a.carcassWeight ? a.carcassWeight + ' kg karkas' : '~' + Math.round(a.liveWeight * 0.55) + ' kg karkas (tahmini)'}</div>
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:0.72rem;padding:3px 8px;border-radius:8px;font-weight:700;background:${st.bg};color:${st.color};">${st.label}</span>
          <button onclick="openEditQurbanAnimalModal('${a.id}')" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:0.85rem;" title="Düzenle">✏️</button>
          <button onclick="openQurbanReceiptModal('${a.id}')" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:0.85rem;" title="Makbuz">🖨️</button>
          <button onclick="deleteQurbanAnimal('${a.id}')" style="background:none;border:none;cursor:pointer;color:var(--accent-red);font-size:0.85rem;" title="Sil">🗑️</button>
        </div>
      </div>

      <div style="padding:0.75rem 1rem;">
        <!-- Bilgi Satırı -->
        <div style="display:flex;gap:1.2rem;margin-bottom:0.75rem;font-size:0.78rem;color:var(--text-dim);">
          <span>📅 ${a.slaughterDay}. Gün Kesimi</span>
          <span>⏱️ ${a.slaughterTime || '—'}</span>
          <span>🔢 ${a.slaughterOrder ? a.slaughterOrder + '. Sıra' : '—'}</span>
          <span>💰 ${formatCurrency(parseFloat(a.totalPrice) || 0)}</span>
        </div>

        <!-- Hisse Şerit Göstergesi -->
        <div style="margin-bottom:0.65rem;">
          <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-dim);margin-bottom:4px;">
            <span>Hisse Doluluk</span>
            <span>${soldCount}/${totalShares} — %${fillPct}</span>
          </div>
          <div style="display:flex;gap:4px;">${shareSlots}</div>
        </div>

        <!-- Hissedar Listesi -->
        <div style="min-height:40px;">${shareRows}</div>
        ${moreCount > 0 ? `<div style="font-size:0.73rem;color:var(--text-dim);text-align:center;padding:0.25rem 0;">+${moreCount} hissedar daha</div>` : ''}

        <!-- Aksiyonlar -->
        <div style="margin-top:0.75rem;display:flex;gap:0.5rem;justify-content:flex-end;">
          ${emptySlots > 0 ? `<button class="btn btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="openAddShareModal('${a.id}', null)">
            ➕ Hissedar Ekle (${emptySlots} boş)
          </button>` : ''}
          <button class="btn btn-ghost" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="openQurbanReceiptModal('${a.id}')">
            🖨️ Makbuz
          </button>
        </div>
        ${a.notes ? `<div style="margin-top:0.5rem;font-size:0.73rem;color:var(--text-dim);font-style:italic;">📝 ${a.notes}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function renderQurbanSchedule(animals) {
  const container = document.getElementById('qurbanScheduleContainer');
  if (!container) return;

  const byDay = {};
  animals.forEach(a => {
    const d = a.slaughterDay || 1;
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(a);
  });

  if (!Object.keys(byDay).length) {
    container.innerHTML = `<div class="dashboard-panel" style="text-align:center;padding:2rem;color:var(--text-dim);">Kesim programı için önce kurbanlık tanımlayın.</div>`;
    return;
  }

  container.innerHTML = Object.keys(byDay).sort().map(day => {
    const dayAnimals = byDay[day].sort((a, b) => (a.slaughterOrder || 99) - (b.slaughterOrder || 99));
    const rows = dayAnimals.map(a => {
      const animalShares = (state.qurbanShares || []).filter(s => s.qurbanId === a.id);
      const soldCount = animalShares.length;
      const totalShares = parseInt(a.shareCount) || 7;
      const typeIcon = a.animalType === 'BÜYÜKBAŞ' ? '🐂' : '🐑';
      const statusColor = a.status === 'SLAUGHTERED' ? 'var(--text-dim)' : a.status === 'SOLD_OUT' ? '#3b82f6' : 'var(--accent-success)';
      return `<tr>
        <td style="font-weight:700;">${a.slaughterOrder || '—'}</td>
        <td>${a.slaughterTime || '—'}</td>
        <td>${typeIcon} ${a.qurbanNo}</td>
        <td>${a.breed || '—'} · ${a.liveWeight} kg</td>
        <td>${formatCurrency(parseFloat(a.totalPrice) || 0)}</td>
        <td><span style="font-weight:700;color:${statusColor};">${soldCount}/${totalShares}</span></td>
        <td><span style="font-size:0.72rem;padding:2px 6px;border-radius:6px;background:rgba(43,114,186,0.12);color:#3b82f6;">${a.status === 'SLAUGHTERED' ? '✅ Kesildi' : a.status === 'SOLD_OUT' ? 'Hisse Tamam' : 'Aktif'}</span></td>
        <td style="text-align:right;">
          <button onclick="openQurbanReceiptModal('${a.id}')" class="btn btn-secondary" style="font-size:0.72rem;padding:0.2rem 0.6rem;">🖨️</button>
        </td>
      </tr>`;
    }).join('');

    return `<div class="dashboard-panel" style="margin-bottom:1rem;">
      <div style="font-weight:800;font-size:0.9rem;padding:0 0 0.75rem;margin-bottom:0.75rem;border-bottom:1px solid var(--border-subtle);">
        ⏱️ Bayramın ${day}. Günü — Kesim Programı (${dayAnimals.length} Kurban)
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Sıra</th><th>Saat</th><th>Kurban No</th><th>Tür & Ağırlık</th><th>Toplam Bedel</th><th>Hisse</th><th>Durum</th><th style="text-align:right">Aksiyon</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
  }).join('');
}

function renderQurbanSharesTable(animals) {
  const tbody = document.getElementById('qurbanAllSharesTbody');
  if (!tbody) return;

  const animalIds = animals.map(a => a.id);
  const allShares = (state.qurbanShares || []).filter(s => animalIds.includes(s.qurbanId));

  if (!allShares.length) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;padding:2rem;color:var(--text-dim);">Hissedar kaydı bulunamadı.</td></tr>`;
    return;
  }

  tbody.innerHTML = allShares.map(sh => {
    const animal = (state.qurbanAnimals || []).find(a => a.id === sh.qurbanId);
    const remaining = (parseFloat(sh.sharePrice) || 0) - (parseFloat(sh.depositAmount) || 0);
    const payMap = { PAID: { l: 'Tam Ödendi', c: 'var(--accent-success)' }, PARTIAL: { l: 'Kapora', c: '#eab308' }, PENDING: { l: 'Bekliyor', c: 'var(--accent-red)' } };
    const pm = payMap[sh.paymentStatus] || payMap.PENDING;
    const methodMap = { CASH: '💵', TRANSFER: '🏦', CARD: '💳', CHECK: '📑' };
    return `<tr>
      <td style="font-weight:700;">${animal?.qurbanNo || '—'}</td>
      <td>${sh.shareIndex}. Hisse</td>
      <td style="font-weight:600;">${sh.shareholderName}</td>
      <td><a href="tel:${sh.phone}">${sh.phone}</a></td>
      <td>${formatCurrency(parseFloat(sh.sharePrice) || 0)}</td>
      <td style="color:var(--accent-success);">${formatCurrency(parseFloat(sh.depositAmount) || 0)}</td>
      <td style="color:${remaining > 0 ? 'var(--accent-red)' : 'var(--text-dim)'};">${formatCurrency(remaining)}</td>
      <td>${methodMap[sh.paymentMethod] || '—'} ${sh.paymentMethod || ''}</td>
      <td>${sh.proxyGiven ? '✅' : '❌'}</td>
      <td>${sh.meatWeight > 0 ? sh.meatWeight + ' kg' : '—'}</td>
      <td>
        <label style="cursor:pointer;display:flex;align-items:center;gap:4px;font-size:0.8rem;">
          <input type="checkbox" ${sh.isDelivered ? 'checked' : ''} onchange="toggleShareDelivery('${sh.id}', this.checked)" style="width:15px;height:15px;">
          ${sh.isDelivered ? '<span style="color:var(--accent-success);">Teslim</span>' : '<span style="color:var(--text-dim);">Bekliyor</span>'}
        </label>
      </td>
      <td style="text-align:right;white-space:nowrap;">
        <span style="font-size:0.7rem;padding:2px 6px;border-radius:6px;font-weight:700;background:${pm.c}22;color:${pm.c};">${pm.l}</span>
        <button onclick="openEditShareModal('${sh.id}')" class="btn btn-ghost" style="font-size:0.72rem;padding:0.2rem 0.5rem;margin-left:4px;">✏️</button>
        <button onclick="deleteQurbanShare('${sh.id}')" class="btn btn-ghost" style="font-size:0.72rem;padding:0.2rem 0.5rem;color:var(--accent-red);">🗑️</button>
      </td>
    </tr>`;
  }).join('');
}

function switchQurbanView(view) {
  activeQurbanView = view;
  document.querySelectorAll('[data-qurban-view]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-qurban-view') === view);
  });
  const cards   = document.getElementById('qurbanCardsContainer');
  const schedule = document.getElementById('qurbanScheduleContainer');
  const table   = document.getElementById('qurbanSharesTableContainer');
  if (cards)    cards.style.display    = view === 'CARDS'        ? 'grid' : 'none';
  if (schedule) schedule.style.display = view === 'SCHEDULE'     ? 'block' : 'none';
  if (table)    table.style.display    = view === 'SHARES_TABLE' ? 'block' : 'none';
}

// ── Kurbanlık Hayvan Formu ─────────────────────────────────────────────────

function openNewQurbanAnimalModal() {
  document.getElementById('qurbanAnimalEditingId').value = '';
  document.getElementById('modalQurbanAnimalTitle').textContent = 'Yeni Kurbanlık Tanımla';
  document.getElementById('qurbanAnimalForm').reset();
  document.getElementById('qurbanSlaughterTime').value = '09:00';

  // Mevcut hayvanları doldur
  const srcSelect = document.getElementById('qurbanSourceAnimal');
  if (srcSelect) {
    const animals = [...(state.animals || []), ...(state.sheep || [])];
    srcSelect.innerHTML = '<option value="">-- Manuel Olarak Gir --</option>' +
      animals.map(a => `<option value="${a.id}" data-type="${a.earTag ? (state.animals?.includes(a) ? 'BIG' : 'SMALL') : 'BIG'}"
        data-tag="${a.earTag || ''}" data-breed="${a.breed || ''}" data-weight="${a.weight || 0}">
        ${a.earTag || a.id} — ${a.name || ''} (${a.breed || ''}, ${a.weight || 0} kg)
      </option>`).join('');
  }
  calculateQurbanEstimates();
  openModal('modalQurbanAnimal');
}

function openEditQurbanAnimalModal(animalId) {
  const a = (state.qurbanAnimals || []).find(x => x.id === animalId);
  if (!a) return;

  openNewQurbanAnimalModal(); // formu temizle + hayvanları doldur
  document.getElementById('qurbanAnimalEditingId').value = animalId;
  document.getElementById('modalQurbanAnimalTitle').textContent = 'Kurbanlık Düzenle — ' + a.qurbanNo;

  document.getElementById('qurbanAnimalType').value      = a.animalType;
  document.getElementById('qurbanAnimalNo').value        = a.qurbanNo;
  document.getElementById('qurbanEarTag').value          = a.earTag || '';
  document.getElementById('qurbanBreed').value           = a.breed || '';
  document.getElementById('qurbanLiveWeight').value      = a.liveWeight || '';
  document.getElementById('qurbanTotalPrice').value      = a.totalPrice || '';
  document.getElementById('qurbanShareCount').value      = String(a.shareCount || 7);
  document.getElementById('qurbanSlaughterDay').value    = String(a.slaughterDay || 1);
  document.getElementById('qurbanSlaughterOrder').value  = a.slaughterOrder || '';
  document.getElementById('qurbanSlaughterTime').value   = a.slaughterTime || '09:00';
  document.getElementById('qurbanNotes').value           = a.notes || '';
  calculateQurbanEstimates();
}

function onQurbanTypeChanged() {
  const type = document.getElementById('qurbanAnimalType').value;
  const shareSelect = document.getElementById('qurbanShareCount');
  if (type === 'KÜÇÜKBAŞ') {
    shareSelect.value = '1';
    shareSelect.disabled = true;
  } else {
    shareSelect.disabled = false;
    if (shareSelect.value === '1') shareSelect.value = '7';
  }
  calculateQurbanEstimates();
}

function onQurbanSourceAnimalSelected() {
  const sel = document.getElementById('qurbanSourceAnimal');
  const opt = sel?.options[sel.selectedIndex];
  if (!opt || !opt.value) return;
  document.getElementById('qurbanEarTag').value  = opt.getAttribute('data-tag') || '';
  document.getElementById('qurbanBreed').value   = opt.getAttribute('data-breed') || '';
  document.getElementById('qurbanLiveWeight').value = opt.getAttribute('data-weight') || '';
  calculateQurbanEstimates();
}

function calculateQurbanEstimates() {
  const weight     = parseFloat(document.getElementById('qurbanLiveWeight')?.value) || 0;
  const totalPrice = parseFloat(document.getElementById('qurbanTotalPrice')?.value) || 0;
  const shares     = parseInt(document.getElementById('qurbanShareCount')?.value) || 7;

  const carcass   = Math.round(weight * 0.55);
  const meatShare = shares > 0 ? Math.round((carcass / shares) * 10) / 10 : 0;
  const priceShare = shares > 0 ? Math.round(totalPrice / shares) : 0;

  const _set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  _set('qurbanEstCarcass',    `~${carcass} kg`);
  _set('qurbanEstShareMeat',  `~${meatShare} kg`);
  _set('qurbanEstSharePrice', formatCurrency(priceShare));
}

function handleQurbanAnimalSubmit(e) {
  e.preventDefault();
  if (!state.qurbanAnimals) state.qurbanAnimals = [];

  const editingId = document.getElementById('qurbanAnimalEditingId').value;
  const liveWeight = parseFloat(document.getElementById('qurbanLiveWeight').value) || 0;

  const data = {
    animalType:     document.getElementById('qurbanAnimalType').value,
    qurbanNo:       document.getElementById('qurbanAnimalNo').value.trim().toUpperCase(),
    sourceAnimalId: document.getElementById('qurbanSourceAnimal').value || null,
    earTag:         document.getElementById('qurbanEarTag').value.trim(),
    breed:          document.getElementById('qurbanBreed').value.trim(),
    liveWeight:     liveWeight,
    carcassWeight:  Math.round(liveWeight * 0.55 * 10) / 10,
    totalPrice:     parseFloat(document.getElementById('qurbanTotalPrice').value) || 0,
    shareCount:     parseInt(document.getElementById('qurbanShareCount').value) || 7,
    slaughterDay:   parseInt(document.getElementById('qurbanSlaughterDay').value) || 1,
    slaughterOrder: parseInt(document.getElementById('qurbanSlaughterOrder').value) || null,
    slaughterTime:  document.getElementById('qurbanSlaughterTime').value,
    notes:          document.getElementById('qurbanNotes').value.trim(),
  };

  // Durumu otomatik güncelle
  const soldShares = (state.qurbanShares || []).filter(s => s.qurbanId === editingId || (!editingId)).length;
  data.status = data.shareCount <= soldShares ? 'SOLD_OUT' : soldShares > 0 ? 'PARTIALLY_RESERVED' : 'AVAILABLE';

  if (editingId) {
    const idx = state.qurbanAnimals.findIndex(a => a.id === editingId);
    if (idx > -1) {
      data.status = state.qurbanAnimals[idx].status; // durumu koru
      state.qurbanAnimals[idx] = { ...state.qurbanAnimals[idx], ...data };
    }
    logAudit('KURBAN GÜNCELLENDİ', `${data.qurbanNo} kurbanlık bilgileri güncellendi`);
  } else {
    data.id = `qrb-${Date.now()}`;
    data.status = 'AVAILABLE';
    state.qurbanAnimals.push(data);
    logAudit('KURBAN EKLENDİ', `${data.qurbanNo} kurbanlık tanımlandı (${formatCurrency(data.totalPrice)})`);
  }

  saveState();
  closeModal('modalQurbanAnimal');
  renderQurbanPage();
  showToastNotification(`${data.qurbanNo} kurbanlık kaydedildi ✅`);
}

function deleteQurbanAnimal(animalId) {
  const a = (state.qurbanAnimals || []).find(x => x.id === animalId);
  if (!a) return;
  const shareCount = (state.qurbanShares || []).filter(s => s.qurbanId === animalId).length;
  if (!confirm(`${a.qurbanNo} kurbanlık ve bağlı ${shareCount} hissedar kaydı silinecek. Emin misiniz?`)) return;
  state.qurbanAnimals = state.qurbanAnimals.filter(x => x.id !== animalId);
  state.qurbanShares  = (state.qurbanShares || []).filter(s => s.qurbanId !== animalId);
  logAudit('KURBAN SİLİNDİ', `${a.qurbanNo} ve bağlı hisseler silindi`);
  saveState();
  renderQurbanPage();
  showToastNotification(`${a.qurbanNo} silindi.`);
}

// ── Hissedar Formu ─────────────────────────────────────────────────────────

function openAddShareModal(animalId, shareIndex) {
  if (!state.qurbanAnimals) return;
  const animal = state.qurbanAnimals.find(a => a.id === animalId);
  if (!animal) return;

  // Boş bir slot bul
  const existingShares = (state.qurbanShares || []).filter(s => s.qurbanId === animalId);
  const totalShares = parseInt(animal.shareCount) || 7;

  if (existingShares.length >= totalShares) {
    showToastNotification('Bu kurbanlık için tüm hisseler dolu!');
    return;
  }

  let nextIndex = shareIndex;
  if (!nextIndex) {
    const usedIndexes = existingShares.map(s => s.shareIndex);
    for (let i = 1; i <= totalShares; i++) {
      if (!usedIndexes.includes(i)) { nextIndex = i; break; }
    }
  }

  document.getElementById('qurbanShareEditingId').value   = '';
  document.getElementById('qurbanShareAnimalId').value    = animalId;
  document.getElementById('modalQurbanShareTitle').textContent = `Hissedar Ekle — ${animal.qurbanNo}`;
  document.getElementById('qurbanShareAnimalHeader').textContent = `${animal.qurbanNo} · ${animal.breed || animal.animalType} · ${animal.liveWeight} kg`;
  document.getElementById('qurbanShareIndexDisplay').textContent = `${nextIndex}. Hisse`;
  document.getElementById('qurbanShareForm').reset();
  document.getElementById('shareDeposit').value = '0';

  // Hisse bedelini otomatik doldur
  const pricePerShare = Math.round((parseFloat(animal.totalPrice) || 0) / totalShares);
  document.getElementById('sharePrice').value = pricePerShare;
  calculateShareRemaining();
  document.getElementById('shareCheckGroup').style.display = 'none';
  openModal('modalQurbanShare');
}

function openEditShareModal(shareId) {
  const sh = (state.qurbanShares || []).find(s => s.id === shareId);
  if (!sh) return;
  const animal = (state.qurbanAnimals || []).find(a => a.id === sh.qurbanId);

  document.getElementById('qurbanShareEditingId').value   = shareId;
  document.getElementById('qurbanShareAnimalId').value    = sh.qurbanId;
  document.getElementById('modalQurbanShareTitle').textContent = `Hissedar Düzenle — ${animal?.qurbanNo || ''}`;
  document.getElementById('qurbanShareAnimalHeader').textContent = `${animal?.qurbanNo || ''} · ${animal?.breed || ''} · ${animal?.liveWeight || ''} kg`;
  document.getElementById('qurbanShareIndexDisplay').textContent = `${sh.shareIndex}. Hisse`;

  document.getElementById('shareholderName').value      = sh.shareholderName;
  document.getElementById('shareholderPhone').value     = sh.phone || '';
  document.getElementById('sharePrice').value           = sh.sharePrice || '';
  document.getElementById('shareDeposit').value         = sh.depositAmount || 0;
  document.getElementById('sharePaymentMethod').value   = sh.paymentMethod || 'CASH';
  document.getElementById('shareMeatWeight').value      = sh.meatWeight || '';
  document.getElementById('shareProxyGiven').checked    = !!sh.proxyGiven;
  document.getElementById('shareIsDelivered').checked   = !!sh.isDelivered;
  document.getElementById('shareNotes').value           = sh.notes || '';

  const checkGroup = document.getElementById('shareCheckGroup');
  checkGroup.style.display = sh.paymentMethod === 'CHECK' ? 'block' : 'none';
  if (sh.paymentMethod === 'CHECK') {
    document.getElementById('shareCheckNumber').value = sh.checkId || '';
  }
  calculateShareRemaining();
  openModal('modalQurbanShare');
}

function calculateShareRemaining() {
  const price   = parseFloat(document.getElementById('sharePrice')?.value) || 0;
  const deposit = parseFloat(document.getElementById('shareDeposit')?.value) || 0;
  const remaining = price - deposit;
  const el = document.getElementById('shareRemainingDisplay');
  if (el) {
    el.textContent = formatCurrency(remaining);
    el.style.color = remaining > 0 ? 'var(--accent-red)' : 'var(--accent-success)';
  }
}

function onSharePaymentMethodChanged() {
  const method = document.getElementById('sharePaymentMethod')?.value;
  const checkGroup = document.getElementById('shareCheckGroup');
  if (checkGroup) checkGroup.style.display = method === 'CHECK' ? 'block' : 'none';
}

function handleQurbanShareSubmit(e) {
  e.preventDefault();
  if (!state.qurbanShares) state.qurbanShares = [];

  const editingId = document.getElementById('qurbanShareEditingId').value;
  const animalId  = document.getElementById('qurbanShareAnimalId').value;
  const animal    = (state.qurbanAnimals || []).find(a => a.id === animalId);

  // Hisse numarasını belirle
  let shareIndex;
  if (editingId) {
    shareIndex = (state.qurbanShares.find(s => s.id === editingId) || {}).shareIndex || 1;
  } else {
    const existingIndexes = state.qurbanShares.filter(s => s.qurbanId === animalId).map(s => s.shareIndex);
    for (let i = 1; i <= (parseInt(animal?.shareCount) || 7); i++) {
      if (!existingIndexes.includes(i)) { shareIndex = i; break; }
    }
    shareIndex = shareIndex || (existingIndexes.length + 1);
  }

  const price   = parseFloat(document.getElementById('sharePrice').value) || 0;
  const deposit = parseFloat(document.getElementById('shareDeposit').value) || 0;
  const payStatus = deposit >= price ? 'PAID' : deposit > 0 ? 'PARTIAL' : 'PENDING';

  const data = {
    qurbanId:        animalId,
    shareIndex,
    shareholderName: document.getElementById('shareholderName').value.trim(),
    phone:           document.getElementById('shareholderPhone').value.trim(),
    sharePrice:      price,
    depositAmount:   deposit,
    paymentStatus:   payStatus,
    paymentMethod:   document.getElementById('sharePaymentMethod').value,
    checkId:         document.getElementById('sharePaymentMethod').value === 'CHECK' ? document.getElementById('shareCheckNumber').value.trim() : null,
    meatWeight:      parseFloat(document.getElementById('shareMeatWeight').value) || 0,
    proxyGiven:      document.getElementById('shareProxyGiven').checked,
    isDelivered:     document.getElementById('shareIsDelivered').checked,
    notes:           document.getElementById('shareNotes').value.trim(),
  };

  if (editingId) {
    const idx = state.qurbanShares.findIndex(s => s.id === editingId);
    if (idx > -1) state.qurbanShares[idx] = { ...state.qurbanShares[idx], ...data };
    logAudit('HİSSEDAR GÜNCELLENDİ', `${data.shareholderName} hisse bilgileri güncellendi`);
  } else {
    data.id = `sh-q-${Date.now()}`;
    data.contactId = null;
    state.qurbanShares.push(data);
    logAudit('HİSSEDAR EKLENDİ', `${animal?.qurbanNo || ''} ${shareIndex}. hisse: ${data.shareholderName} (${formatCurrency(price)})`);
  }

  // Hayvanın durumunu güncelle
  if (animal) {
    const soldCount = state.qurbanShares.filter(s => s.qurbanId === animalId).length;
    const totalShares = parseInt(animal.shareCount) || 7;
    animal.status = soldCount >= totalShares ? 'SOLD_OUT' : soldCount > 0 ? 'PARTIALLY_RESERVED' : 'AVAILABLE';
  }

  saveState();
  closeModal('modalQurbanShare');
  renderQurbanPage();
  showToastNotification(`${data.shareholderName} hissedar kaydedildi ✅`);
}

function toggleShareDelivery(shareId, isDelivered) {
  const sh = (state.qurbanShares || []).find(s => s.id === shareId);
  if (!sh) return;
  sh.isDelivered = isDelivered;
  logAudit('ET TESLİMATI', `${sh.shareholderName} pay teslimi ${isDelivered ? 'tamamlandı' : 'geri alındı'}`);
  saveState();
  renderQurbanPage();
  showToastNotification(isDelivered ? `${sh.shareholderName} — Pay teslim edildi ✅` : 'Teslimat geri alındı.');
}

function deleteQurbanShare(shareId) {
  const sh = (state.qurbanShares || []).find(s => s.id === shareId);
  if (!sh) return;
  if (!confirm(`${sh.shareholderName} hissedar kaydı silinecek. Emin misiniz?`)) return;
  state.qurbanShares = state.qurbanShares.filter(s => s.id !== shareId);

  // Hayvan durumunu güncelle
  const animal = (state.qurbanAnimals || []).find(a => a.id === sh.qurbanId);
  if (animal) {
    const soldCount = state.qurbanShares.filter(s => s.qurbanId === animal.id).length;
    const totalShares = parseInt(animal.shareCount) || 7;
    animal.status = soldCount >= totalShares ? 'SOLD_OUT' : soldCount > 0 ? 'PARTIALLY_RESERVED' : 'AVAILABLE';
  }

  logAudit('HİSSEDAR SİLİNDİ', `${sh.shareholderName} ${sh.shareIndex}. hisse silindi`);
  saveState();
  renderQurbanPage();
  showToastNotification(`${sh.shareholderName} hissedar kaydı silindi.`);
}

// ── Makbuz & Yazdırma ──────────────────────────────────────────────────────

function openQurbanReceiptModal(animalId) {
  const animal = (state.qurbanAnimals || []).find(a => a.id === animalId);
  if (!animal) return;

  const animalShares = (state.qurbanShares || [])
    .filter(s => s.qurbanId === animalId)
    .sort((a, b) => a.shareIndex - b.shareIndex);

  const farmName = state.farm?.name || 'Özate Çiftliği';
  const today    = new Date().toLocaleDateString('tr-TR');
  const methodLabel = { CASH: 'Nakit', TRANSFER: 'Havale', CARD: 'Kart', CHECK: 'Çek' };
  const typeIcon = animal.animalType === 'BÜYÜKBAŞ' ? '🐂' : '🐑';

  const shareRows = animalShares.map(sh => {
    const remaining = (parseFloat(sh.sharePrice) || 0) - (parseFloat(sh.depositAmount) || 0);
    return `<tr style="border-bottom:1px solid #ddd;">
      <td style="padding:6px 8px;">${sh.shareIndex}</td>
      <td style="padding:6px 8px;font-weight:600;">${sh.shareholderName}</td>
      <td style="padding:6px 8px;">${sh.phone}</td>
      <td style="padding:6px 8px;text-align:right;">${formatCurrency(parseFloat(sh.sharePrice) || 0)}</td>
      <td style="padding:6px 8px;text-align:right;color:green;">${formatCurrency(parseFloat(sh.depositAmount) || 0)}</td>
      <td style="padding:6px 8px;text-align:right;color:${remaining > 0 ? 'red' : 'green'};">${formatCurrency(remaining)}</td>
      <td style="padding:6px 8px;">${methodLabel[sh.paymentMethod] || '—'}</td>
      <td style="padding:6px 8px;text-align:center;">${sh.proxyGiven ? '✅' : '❌'}</td>
      <td style="padding:6px 8px;text-align:center;">${sh.isDelivered ? '✅ Teslim' : '⏳'}</td>
    </tr>`;
  }).join('');

  const totalPrice   = animalShares.reduce((s, sh) => s + (parseFloat(sh.sharePrice) || 0), 0);
  const totalDeposit = animalShares.reduce((s, sh) => s + (parseFloat(sh.depositAmount) || 0), 0);
  const totalRemain  = totalPrice - totalDeposit;

  document.getElementById('qurbanReceiptPrintArea').innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;border-bottom:2px solid #333;padding-bottom:1rem;">
      <div style="font-size:1.4rem;font-weight:900;letter-spacing:0.05em;">${farmName}</div>
      <div style="font-size:0.85rem;color:#666;">Kurban Hisse & Kesim Sıra Belgesi · ${today}</div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:1rem;padding:0.75rem;background:#f5f5f5;border-radius:6px;">
      <div><strong>Kurban No:</strong> ${typeIcon} ${animal.qurbanNo}</div>
      <div><strong>Tür:</strong> ${animal.animalType}</div>
      <div><strong>Irk:</strong> ${animal.breed || '—'}</div>
      <div><strong>Canlı Ağ.:</strong> ${animal.liveWeight} kg</div>
      <div><strong>Toplam Bedel:</strong> ${formatCurrency(parseFloat(animal.totalPrice) || 0)}</div>
    </div>
    <div style="margin-bottom:0.5rem;font-weight:700;font-size:0.85rem;">
      ⏱️ Kesim: Bayramın ${animal.slaughterDay}. Günü · ${animal.slaughterTime || ''} · ${animal.slaughterOrder ? animal.slaughterOrder + '. Sıra' : ''}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:0.82rem;margin-bottom:1rem;">
      <thead>
        <tr style="background:#333;color:#fff;">
          <th style="padding:6px 8px;">No</th>
          <th style="padding:6px 8px;">Hissedar</th>
          <th style="padding:6px 8px;">Telefon</th>
          <th style="padding:6px 8px;text-align:right;">Bedel</th>
          <th style="padding:6px 8px;text-align:right;">Kapora</th>
          <th style="padding:6px 8px;text-align:right;">Kalan</th>
          <th style="padding:6px 8px;">Ödeme</th>
          <th style="padding:6px 8px;text-align:center;">Vekalet</th>
          <th style="padding:6px 8px;text-align:center;">Teslimat</th>
        </tr>
      </thead>
      <tbody>${shareRows}</tbody>
      <tfoot>
        <tr style="background:#f0f0f0;font-weight:800;">
          <td colspan="3" style="padding:6px 8px;">TOPLAM (${animalShares.length} Hisse)</td>
          <td style="padding:6px 8px;text-align:right;">${formatCurrency(totalPrice)}</td>
          <td style="padding:6px 8px;text-align:right;color:green;">${formatCurrency(totalDeposit)}</td>
          <td style="padding:6px 8px;text-align:right;color:${totalRemain > 0 ? 'red' : 'green'};">${formatCurrency(totalRemain)}</td>
          <td colspan="3"></td>
        </tr>
      </tfoot>
    </table>
    ${animal.notes ? `<div style="font-size:0.8rem;color:#666;font-style:italic;border-top:1px dashed #ccc;padding-top:0.5rem;">📝 ${animal.notes}</div>` : ''}
    <div style="margin-top:1.5rem;font-size:0.7rem;color:#999;text-align:center;">Belge ${today} tarihinde oluşturulmuştur.</div>
  `;
  openModal('modalQurbanReceipt');
}

function printQurbanSlaughterSchedule() {
  window.print();
}

function printReceiptElement(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const win = window.open('', '_blank', 'width=800,height=600');
  win.document.write(`<!DOCTYPE html><html><head><title>Kurban Belgesi</title>
    <style>body{font-family:system-ui,sans-serif;margin:0;padding:1rem;} @media print{body{margin:0;}}</style>
    </head><body>${el.innerHTML}</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 300);
}

// =============================================================================
// 8. BÜYÜKBAŞ SÜRÜ SAYFASI

// =============================================================================

function renderAnimalsTable() {
  const tbody = document.getElementById('animalsTbody');
  if (!tbody) return;

  const padFilter = document.getElementById('filterAnimalPaddock')?.value || 'ALL';
  const catFilter = document.getElementById('filterAnimalCategory')?.value || 'ALL';
  const breedFilter = document.getElementById('filterAnimalBreed')?.value || 'ALL';
  const statusFilter = document.getElementById('filterAnimalStatus')?.value || 'ACTIVE';

  tbody.innerHTML = '';

  const filtered = state.animals.filter(a => {
    if (padFilter !== 'ALL' && a.paddock !== padFilter) return false;
    if (catFilter !== 'ALL' && a.category !== catFilter) return false;
    if (breedFilter !== 'ALL' && a.breed !== breedFilter) return false;
    if (statusFilter === 'ACTIVE') {
      if (a.status === 'Satıldı' || a.status === 'Kesildi' || a.status === 'Zayiat' || a.status === 'Öldü') return false;
    } else if (statusFilter !== 'ALL') {
      if (a.status !== statusFilter) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 2rem; color:var(--text-muted);">Kayıtlı hayvan bulunamadı.</td></tr>`;
    return;
  }

  filtered.forEach(a => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.onclick = (e) => {
      if (e.target.tagName !== 'BUTTON') {
        openAnimalDetailModal(a.id);
      }
    };
    tr.innerHTML = `
      <td style="font-weight: 700; font-family: monospace; color: var(--ozate-burgundy);">
        <span onclick="openAnimalDetailModal('${a.id}'); event.stopPropagation();" style="text-decoration: underline dotted; cursor: pointer;">
          ${a.earTag}
        </span>
      </td>
      <td style="font-weight: 600;">${a.name || '-'}</td>
      <td>${a.breed}</td>
      <td><span class="tag-badge" style="background: rgba(30,77,43,0.15); color: var(--ozate-green-accent);">${a.category}</span></td>
      <td>${a.gender === 'Dişi' ? '♀ Dişi' : '♂ Erkek'}</td>
      <td><strong>${a.paddock}</strong></td>
      <td>${a.weight} kg</td>
      <td style="font-weight: 600; color: var(--accent-blue);">${a.yield}</td>
      <td><span class="badge positive">${a.health}</span></td>
      <td><button class="btn btn-sm btn-ghost" onclick="openAnimalDetailModal('${a.id}'); event.stopPropagation();">Detay / İncele 🔍</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// =============================================================================
// 8.5. KÜÇÜKBAŞ SÜRÜ SAYFASI & FONKSİYONLARI
// =============================================================================

let currentDossierSheepId = null;

function renderSheepBarnOptions() {
  const barns = state.parameters?.sheepBarns || DEFAULT_STATE.parameters.sheepBarns;
  
  // Filtre Ağıl Select
  const filterBarn = document.getElementById('filterSheepBarn');
  if (filterBarn) {
    const curVal = filterBarn.value;
    filterBarn.innerHTML = '<option value="ALL">Tüm Ağıllar</option>';
    barns.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      filterBarn.appendChild(opt);
    });
    if (curVal && (curVal === 'ALL' || barns.includes(curVal))) {
      filterBarn.value = curVal;
    }
  }

  // Yeni Kayıt Modalındaki Ağıl Select
  const modalBarn = document.getElementById('shBarn');
  if (modalBarn) {
    modalBarn.innerHTML = '';
    barns.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      modalBarn.appendChild(opt);
    });
  }

  // Koç Katımı Modalı Ağıl Select
  const matingBarn = document.getElementById('matingBarn');
  if (matingBarn) {
    matingBarn.innerHTML = '';
    barns.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      matingBarn.appendChild(opt);
    });
  }

  // Kırkım Modalı Ağıl Select
  const shearingBarn = document.getElementById('shearingBarn');
  if (shearingBarn) {
    shearingBarn.innerHTML = '';
    barns.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      shearingBarn.appendChild(opt);
    });
  }

  // Toplu Transfer Hedef & Kaynak Ağıllar
  const bulkFrom = document.getElementById('bulkFromBarn');
  if (bulkFrom) {
    const cur = bulkFrom.value;
    bulkFrom.innerHTML = '<option value="ALL">Tüm Ağıllar</option>';
    barns.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      bulkFrom.appendChild(opt);
    });
    if (cur) bulkFrom.value = cur;
  }

  const bulkTo = document.getElementById('bulkToBarn');
  if (bulkTo) {
    bulkTo.innerHTML = '';
    barns.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      bulkTo.appendChild(opt);
    });
  }
}

function renderSheepPage() {
  renderSheepBarnOptions();
  renderSheepKPIs();
  renderSheepTable();
}

function renderSheepKPIs() {
  const sheepList = state.sheep || [];
  const total = sheepList.length;
  const ewes = sheepList.filter(s => s.category === 'Damızlık Koyun');
  const pregnant = ewes.filter(s => s.reproStatus === 'Gebe').length;
  const rams = sheepList.filter(s => s.category === 'Damızlık Koç').length;
  const lambs = sheepList.filter(s => ['Sütten Kesilmiş Kuzu', 'Emziren Kuzu', 'Toklu / Şişek', 'Besi Kuzusu'].includes(s.category));

  let totalWeight = 0;
  sheepList.forEach(s => { totalWeight += Number(s.weight || 0); });
  const avgWeight = total > 0 ? (totalWeight / total).toFixed(1) : 0;

  const kpiTotal = document.getElementById('kpiSheepTotal');
  if (kpiTotal) kpiTotal.textContent = `${total} Baş`;
  const kpiTotalSub = document.getElementById('kpiSheepTotalSub');
  if (kpiTotalSub) kpiTotalSub.textContent = `Sürü ort. ağırlık: ${avgWeight} kg`;

  const kpiEwes = document.getElementById('kpiSheepEwes');
  if (kpiEwes) kpiEwes.textContent = `${ewes.length} Baş`;
  const kpiEwesFooter = kpiEwes?.parentElement?.querySelector('.kpi-subtext');
  if (kpiEwesFooter) kpiEwesFooter.textContent = `${pregnant} Gebe • ${ewes.length - pregnant} Boş/Laktasyon`;

  const kpiRams = document.getElementById('kpiSheepRams');
  if (kpiRams) kpiRams.textContent = `${rams} Baş`;
  const kpiRamsFooter = kpiRams?.parentElement?.querySelector('.kpi-subtext');
  if (kpiRamsFooter) {
    const ratio = rams > 0 ? `1:${Math.round(ewes.length / rams)}` : '0';
    kpiRamsFooter.textContent = `${ratio} Koç katım oranı`;
  }

  const kpiLambs = document.getElementById('kpiSheepLambs');
  if (kpiLambs) kpiLambs.textContent = `${lambs.length} Baş`;

  // Sol menü badge güncelle
  const sidebarBadge = document.getElementById('sidebarSheepCountBadge');
  if (sidebarBadge) sidebarBadge.textContent = total;
}

function renderSheepTable() {
  const tbody = document.getElementById('sheepTbody');
  if (!tbody) return;

  const barnFilter = document.getElementById('filterSheepBarn')?.value || 'ALL';
  const catFilter = document.getElementById('filterSheepCategory')?.value || 'ALL';
  const breedFilter = document.getElementById('filterSheepBreed')?.value || 'ALL';
  const reproFilter = document.getElementById('filterSheepRepro')?.value || 'ALL';

  tbody.innerHTML = '';

  const sheepList = state.sheep || [];
  const filtered = sheepList.filter(s => {
    if (s.status === 'Satıldı' || s.status === 'Kesildi' || s.status === 'Zayiat' || s.status === 'Öldü') return false;
    if (barnFilter !== 'ALL' && s.barn !== barnFilter) return false;
    if (catFilter !== 'ALL' && s.category !== catFilter) return false;
    if (breedFilter !== 'ALL' && !s.breed.toLowerCase().includes(breedFilter.toLowerCase())) return false;
    if (reproFilter !== 'ALL') {
      if (reproFilter === 'Gebe' && s.reproStatus !== 'Gebe') return false;
      if (reproFilter === 'Aşımda' && s.reproStatus !== 'Aşımda') return false;
      if (reproFilter === 'Boş' && !s.reproStatus?.includes('Boş')) return false;
      if (reproFilter === 'Kuzuladı' && s.reproStatus !== 'Kuzuladı') return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 2rem; color:var(--text-muted);">Filtreye uygun küçükbaş hayvan bulunamadı.</td></tr>`;
    return;
  }

  filtered.forEach(s => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.onclick = (e) => {
      if (e.target.tagName !== 'BUTTON') {
        openSheepDetailModal(s.id);
      }
    };

    let reproBadge = `<span class="badge" style="background: rgba(100,116,139,0.2); color: var(--text-dim);">${s.reproStatus || 'Takipte'}</span>`;
    if (s.reproStatus === 'Gebe') {
      reproBadge = `<span class="badge" style="background: rgba(16,185,129,0.18); color: var(--accent-success);">🤰 Gebe</span>`;
    } else if (s.reproStatus === 'Aşımda') {
      reproBadge = `<span class="badge" style="background: rgba(37,99,235,0.18); color: var(--accent-blue);">🐑 Aşımda</span>`;
    } else if (s.reproStatus === 'Besi') {
      reproBadge = `<span class="badge" style="background: rgba(245,158,11,0.18); color: var(--accent-gold);">🌾 Besi</span>`;
    }

    tr.innerHTML = `
      <td style="font-weight: 700; font-family: monospace; color: var(--ozate-green-accent);">
        <span onclick="openSheepDetailModal('${s.id}'); event.stopPropagation();" style="text-decoration: underline dotted; cursor: pointer;">
          ${s.earTag}
        </span>
      </td>
      <td style="font-weight: 600;">${s.name || '-'}</td>
      <td><strong>${s.breed}</strong></td>
      <td><span class="tag-badge" style="background: rgba(30,77,43,0.15); color: var(--ozate-green-accent);">${s.category}</span></td>
      <td>${s.gender === 'Dişi' ? '♀ Dişi' : '♂ Erkek'}</td>
      <td><strong>${s.barn}</strong></td>
      <td style="font-weight:700;">${s.weight} kg</td>
      <td><span style="font-size: 0.78rem; color: var(--text-muted);">${s.birthType || 'İkiz'}</span></td>
      <td>${reproBadge}</td>
      <td><button class="btn btn-sm btn-ghost" onclick="openSheepDetailModal('${s.id}'); event.stopPropagation();">Detay 🔍</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function openNewSheepModal() {
  const form = document.getElementById('sheepForm');
  if (form) form.reset();
  renderSheepBarnOptions();
  openModal('modalSheep');
}

function handleSheepCategoryChange(category) {
  const genderEl = document.getElementById('shGender');
  if (!genderEl) return;
  if (category === 'Damızlık Koç' || category === 'Besi Kuzusu') {
    genderEl.value = 'Erkek';
  } else if (category === 'Damızlık Koyun' || category === 'Toklu / Şişek') {
    genderEl.value = 'Dişi';
  }
}

function handleSheepSubmit(e) {
  e.preventDefault();
  const earTag = document.getElementById('shEarTag').value.trim();
  const name = document.getElementById('shName').value.trim();
  const breed = document.getElementById('shBreed').value;
  const category = document.getElementById('shCategory').value;
  const barn = document.getElementById('shBarn').value;
  const gender = document.getElementById('shGender').value;
  const weight = parseFloat(document.getElementById('shWeight').value) || 45;
  const birthType = document.getElementById('shBirthType').value;
  const dam = document.getElementById('shDam').value.trim();
  const sire = document.getElementById('shSire').value.trim();
  const health = document.getElementById('shHealth').value.trim();

  // Küpe no mükerrer kontrolü
  if ((state.sheep || []).some(s => s.earTag.toUpperCase() === earTag.toUpperCase())) {
    alert(`"${earTag}" küpe numarasına sahip küçükbaş hayvan zaten kayıtlı!`);
    return;
  }

  const newSheep = {
    id: 'sh-' + Date.now(),
    earTag,
    name: name || `${breed} ${category}`,
    breed,
    category,
    gender,
    barn,
    weight,
    birthType,
    status: 'Aktif Sürüde',
    reproStatus: (gender === 'Dişi' && category === 'Damızlık Koyun') ? 'Boş' : (category === 'Damızlık Koç' ? 'Dinlenmede' : 'Gelişimde'),
    dam,
    sire,
    healthLogs: health ? [{ date: new Date().toISOString().split('T')[0], procedure: health, staff: 'Sürü Sorumlusu', result: 'Kaydedildi' }] : []
  };

  if (!state.sheep) state.sheep = [];
  state.sheep.unshift(newSheep);
  saveState();
  logAudit('KÜÇÜKBAŞ EKLEME', `${earTag} (${name || breed}) küçükbaş sürüye kaydedildi.`);
  closeModal('modalSheep');
  renderSheepPage();
  renderDashboard();
  alert(`${earTag} sürüye başarıyla eklendi.`);
}

function openSheepDetailModal(sheepId) {
  const sheep = (state.sheep || []).find(s => s.id === sheepId);
  if (!sheep) return;
  currentDossierSheepId = sheep.id;

  document.getElementById('sheepDossierModalTitle').textContent = `🐑 Küçükbaş Künyesi (${sheep.earTag})`;
  document.getElementById('sheepDossierTag').textContent = sheep.earTag;
  document.getElementById('sheepDossierName').textContent = sheep.name || sheep.category;
  document.getElementById('sheepDossierStatus').textContent = sheep.status || 'Aktif Sürüde';
  document.getElementById('sheepDossierBarn').textContent = sheep.barn;
  document.getElementById('sheepDossierBreed').textContent = `${sheep.breed}`;
  document.getElementById('sheepDossierCategory').textContent = `${sheep.category} / ${sheep.gender === 'Dişi' ? '♀ Dişi' : '♂ Erkek'}`;
  document.getElementById('sheepDossierWeight').textContent = `${sheep.weight} kg`;
  document.getElementById('sheepDossierBirthType').textContent = `${sheep.birthType || 'İkiz'} Doğumlu`;

  // Üreme ve Koç Katımı Kartı
  const reproBox = document.getElementById('sheepDossierReproBox');
  if (reproBox) {
    if (sheep.gender === 'Dişi') {
      const isPreg = sheep.reproStatus === 'Gebe';
      reproBox.innerHTML = `
        <strong>🐑 Üreme &amp; Gebelik Bilgileri:</strong><br>
        • Durum: <span style="font-weight:700; color:${isPreg ? 'var(--accent-success)' : 'var(--text-main)'};">${sheep.reproStatus || 'Boş / Aşımda Değil'}</span><br>
        • Koç Katım Tarihi: <strong>${sheep.matingDate ? formatDate(sheep.matingDate) : 'Kayıt Yok'}</strong><br>
        • Katılan Koç: <strong>${sheep.matingRam || '-'}</strong><br>
        • Tahmini Kuzulama: <strong style="color:var(--accent-gold);">${sheep.estLambingDate ? formatDate(sheep.estLambingDate) : '-'}</strong> (148 Günlük Gebelik Esası)<br>
        • Soyağacı: Ana: ${sheep.dam || 'TR16-K012'} | Baba (Koç): ${sheep.sire || 'TR16-R001'}
      `;
    } else {
      reproBox.innerHTML = `
        <strong>♂ Damızlık Koç / Teke Bilgileri:</strong><br>
        • Durum: <strong>${sheep.reproStatus || 'Aktif'}</strong><br>
        • Aşım Performansı: <strong>Damızlık Sürü Lideri (1:10 Koç Katım Oranı)</strong><br>
        • Soyağacı: Ana: ${sheep.dam || '-'} | Baba: ${sheep.sire || '-'}
      `;
    }
  }

  // Sağlık Geçmişi
  const healthTbody = document.getElementById('sheepDossierHealthTbody');
  if (healthTbody) {
    healthTbody.innerHTML = '';
    const logs = sheep.healthLogs || [];
    if (logs.length === 0) {
      healthTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:0.6rem;">Kayıtlı aşı veya parazit müdahalesi yok.</td></tr>`;
    } else {
      logs.slice().reverse().forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${formatDate(l.date)}</td>
          <td><strong>${l.procedure}</strong></td>
          <td>${l.staff || 'Veteriner'}</td>
          <td><span class="badge positive">${l.result || 'Tamamlandı'}</span></td>
        `;
        healthTbody.appendChild(tr);
      });
    }
  }

  // Kuzulama butonu görünürlüğü
  const lambingBtn = document.getElementById('btnSheepLambingAction');
  if (lambingBtn) {
    lambingBtn.style.display = sheep.gender === 'Dişi' ? 'inline-block' : 'none';
  }

  openModal('modalSheepDetail');
}

function recordSheepLambingPrompt() {
  const sheep = (state.sheep || []).find(s => s.id === currentDossierSheepId);
  if (!sheep) return;

  const countStr = prompt(`${sheep.earTag} (${sheep.name}) için dünyaya gelen kuzu sayısını girin (1: Tekiz, 2: İkiz, 3: Üçüz):`, '2');
  if (!countStr) return;
  const count = parseInt(countStr) || 1;

  // Ana koyunun durumunu güncelle
  sheep.reproStatus = 'Kuzuladı (Laktasyon)';
  saveState();

  // Otomatik yavru kuzu kayıtları oluştur
  for (let i = 1; i <= count; i++) {
    const lambEarTag = `TR16-KZ${Math.floor(100 + Math.random() * 900)}`;
    const lamb = {
      id: 'sh-' + Date.now() + '-' + i,
      earTag: lambEarTag,
      name: `${sheep.name || 'Anaç'} Kuzusu ${i}`,
      breed: sheep.breed,
      category: 'Emziren Kuzu',
      gender: i % 2 === 0 ? 'Erkek' : 'Dişi',
      barn: sheep.barn,
      weight: 3.8,
      birthType: count === 1 ? 'Tekiz' : (count === 2 ? 'İkiz' : 'Üçüz'),
      status: 'Aktif Sürüde',
      reproStatus: 'Emzirmede',
      dam: sheep.earTag,
      sire: sheep.matingRam || 'Sürü Koçu',
      healthLogs: [
        { date: new Date().toISOString().split('T')[0], procedure: 'Göbek kordonu antiseptiği & Ağız sütü (Kolostrum) alımı', staff: 'Çiftlik Ekibi', result: 'Başarılı' }
      ]
    };
    state.sheep.unshift(lamb);
  }

  saveState();
  logAudit('KUZULAMA DOĞUM KAYDI', `${sheep.earTag} doğumu kaydoldu: ${count} baş yeni kuzu sürüye katıldı.`);
  closeModal('modalSheepDetail');
  renderSheepPage();
  renderDashboard();
  alert(`Tebrikler! ${sheep.earTag} için ${count} baş kuzu sürüye başarıyla eklendi.`);
}

function deleteSheepPrompt() {
  const sheep = (state.sheep || []).find(s => s.id === currentDossierSheepId);
  if (!sheep) return;

  const reason = prompt(`${sheep.earTag} (${sheep.name || sheep.breed}) sürüden çıkarılıyor.\nNedenini girin (Satıldı / Kesildi / Zayiat):`, 'Satıldı');
  if (!reason) return;

  const priceStr = prompt(`Varsa satış bedelini giriniz (₺) (Örn: 12500, yoksa 0):`, '12500');
  const price = parseFloat(priceStr) || 0;

  if (price > 0 && !reason.toLowerCase().includes('ölüm') && !reason.toLowerCase().includes('zayiat')) {
    const cust = (state.contacts || []).find(c => c.type === 'CUSTOMER') || state.contacts[0];
    const acc = (state.accounts || [])[0];
    state.transactions.unshift({
      id: 'tx-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'INCOME',
      category: 'Besi Hayvanı Satışı',
      amount: price,
      paidAmount: price,
      status: 'PAID',
      contactId: cust ? cust.id : 'ct-2',
      accountId: acc ? acc.id : 'acc-1',
      desc: `${sheep.earTag} - ${sheep.category} (${sheep.breed}) Küçükbaş Çıkış / Satış: ${reason}`
    });
    if (acc) acc.balance = (acc.balance || 0) + price;
  }

  // PRD 5.6: Kalıcı silmek yerine arşivle
  sheep.status = reason;
  sheep.exitDate = new Date().toISOString().split('T')[0];
  sheep.exitPrice = price;

  // Supabase senkronizasyonu
  if (typeof dbService !== 'undefined' && dbService.upsertSheep) {
    dbService.upsertSheep(sheep);
  }

  saveState();
  logAudit('KÜÇÜKBAŞ ÇIKIŞ', `${sheep.earTag} (${sheep.name || sheep.breed}) sürüden çıkarıldı. Neden: ${reason}${price > 0 ? `, Bedel: ₺${price.toLocaleString('tr-TR')}` : ''}`);
  closeModal('modalSheepDetail');
  renderSheepPage();
  renderDashboard();
  renderTransactionsTable();
  renderAccountsPage();
  alert(`${sheep.earTag} sürüden çıkarıldı ve arşivlendi. (Durum: ${reason})`);
}

// ----------------- KOÇ KATIMI (AŞIM) İŞLEMLERİ -----------------
function openMatingSeasonModal() {
  const form = document.getElementById('formMatingSeason');
  if (form) form.reset();
  renderSheepBarnOptions();

  // Damızlık koçları doldur
  const ramSelect = document.getElementById('matingRam');
  if (ramSelect) {
    ramSelect.innerHTML = '';
    const rams = (state.sheep || []).filter(s => s.category === 'Damızlık Koç');
    if (rams.length === 0) {
      ramSelect.innerHTML = '<option value="Sürü Lideri Koç">Sürü Lideri Koç (Genel)</option>';
    } else {
      rams.forEach(r => {
        const opt = document.createElement('option');
        opt.value = `${r.earTag} (${r.name || r.breed})`;
        opt.textContent = `${r.earTag} - ${r.name || r.breed} (${r.weight} kg)`;
        ramSelect.appendChild(opt);
      });
    }
  }

  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('matingDate');
  if (dateInput) dateInput.value = today;

  openModal('modalMatingSeason');
}

function handleMatingSeasonSubmit(e) {
  e.preventDefault();
  const date = document.getElementById('matingDate').value;
  const barn = document.getElementById('matingBarn').value;
  const ram = document.getElementById('matingRam').value;
  const notes = document.getElementById('matingNotes').value.trim();

  // Tahmini doğum tarihi hesapla (+148 gün)
  const matingD = new Date(date);
  matingD.setDate(matingD.getDate() + 148);
  const estCalv = matingD.toISOString().split('T')[0];

  // Hedef ağıldaki damızlık koyunların gebelik / koç katım durumunu güncelle
  let updatedCount = 0;
  (state.sheep || []).forEach(s => {
    if (s.barn === barn && s.gender === 'Dişi' && s.category === 'Damızlık Koyun') {
      s.reproStatus = 'Gebe';
      s.matingDate = date;
      s.matingRam = ram;
      s.estLambingDate = estCalv;
      updatedCount++;
    }
  });

  if (!state.matingSeasons) state.matingSeasons = [];
  state.matingSeasons.unshift({
    id: 'mat-' + Date.now(),
    date,
    barn,
    ram,
    notes,
    estLambingDate: estCalv
  });

  // Görevler takvimine otomatik kuzulama hazırlık görevi ekle
  if (!state.tasks) state.tasks = [];
  state.tasks.unshift({
    id: 'tsk-' + Date.now(),
    title: `🐑 ${barn} Kuzulama Dönemi Başlangıcı (${updatedCount} Anaç)`,
    sub: `Koç katımı sonrası 148. gün. Doğumhane hazırlığı ve kolostrum kontrolü`,
    category: 'BREEDING',
    priority: 'HIGH',
    dueDate: estCalv,
    assignee: 'Dr. Nilüfer Çetin',
    relatedAnimal: barn,
    done: false
  });

  saveState();
  logAudit('KOÇ KATIMI BAŞLATILDI', `${barn} için ${ram} ile koç katımı başladı. ${updatedCount} koyun takvime alındı.`);
  closeModal('modalMatingSeason');
  renderSheepPage();
  renderDashboard();
  alert(`Koç katımı başarıyla başlatıldı!\n${barn} ağılındaki ${updatedCount} anaç koyun için tahmini kuzulama tarihi: ${formatDate(estCalv)} olarak takvime işlendi.`);
}

// ----------------- KIRKIM İŞLEMLERİ -----------------
function openShearingModal() {
  const form = document.getElementById('formShearing');
  if (form) form.reset();
  renderSheepBarnOptions();

  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('shearingDate');
  if (dateInput) dateInput.value = today;

  openModal('modalShearing');
}

function handleShearingSubmit(e) {
  e.preventDefault();
  const date = document.getElementById('shearingDate').value;
  const barn = document.getElementById('shearingBarn').value;
  const count = parseInt(document.getElementById('shearingCount').value) || 0;
  const weight = parseFloat(document.getElementById('shearingWeight').value) || 0;
  const notes = document.getElementById('shearingNotes').value.trim();

  if (!state.shearings) state.shearings = [];
  state.shearings.unshift({
    id: 'shr-' + Date.now(),
    date,
    barn,
    count,
    weight,
    notes
  });

  // Stok deposuna otomatik yün ekle
  const existingWool = (state.inventory || []).find(i => i.name.toLowerCase().includes('yün') || i.name.toLowerCase().includes('yapağı'));
  if (existingWool) {
    existingWool.quantity += weight;
  } else {
    state.inventory.push({
      id: 'inv-' + Date.now(),
      name: 'Kırkım Yünü / Yapağı',
      category: 'Diğer',
      quantity: weight,
      unit: 'kg',
      minAlert: 20,
      unitCost: 45.00
    });
  }

  saveState();
  logAudit('KIRKIM KAYDI', `${barn} ağılında ${count} baş küçükbaş kırkıldı. ${weight} kg yün depoya kaydedildi.`);
  closeModal('modalShearing');
  renderSheepPage();
  alert(`${barn} ağılında ${count} baş kırkım ve ${weight} kg yün hasadı başarıyla depoya işlendi.`);
}

// ----------------- TOPLU AĞIL TRANSFERİ -----------------
function openBulkBarnTransferModal() {
  renderSheepBarnOptions();
  renderBulkSheepList();
  openModal('modalBulkBarnTransfer');
}

function renderBulkSheepList() {
  const container = document.getElementById('bulkSheepListContainer');
  if (!container) return;

  const fromBarn = document.getElementById('bulkFromBarn')?.value || 'ALL';
  const sheepList = (state.sheep || []).filter(s => fromBarn === 'ALL' || s.barn === fromBarn);

  if (sheepList.length === 0) {
    container.innerHTML = '<div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.8rem;">Bu ağılda kayıtlı küçükbaş bulunmuyor.</div>';
    updateBulkSheepSelectionCount();
    return;
  }

  let html = '';
  sheepList.forEach(s => {
    html += `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:0.4rem 0.6rem; border-bottom:1px solid var(--border-subtle); font-size:0.8rem;">
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; flex:1;">
          <input type="checkbox" class="bulk-sheep-item-cb" value="${s.id}" onchange="updateBulkSheepSelectionCount()">
          <span style="font-family:monospace; font-weight:700; color:var(--ozate-green-accent);">${s.earTag}</span>
          <span style="font-weight:600;">${s.name || '-'}</span>
          <span style="color:var(--text-dim); font-size:0.75rem;">(${s.breed}, ${s.category})</span>
        </label>
        <span style="font-size:0.72rem; color:var(--text-muted);">${s.barn}</span>
      </div>
    `;
  });
  container.innerHTML = html;
  updateBulkSheepSelectionCount();
}

function toggleBulkSelectAllSheep(checked) {
  document.querySelectorAll('.bulk-sheep-item-cb').forEach(cb => {
    cb.checked = checked;
  });
  updateBulkSheepSelectionCount();
}

function updateBulkSheepSelectionCount() {
  const checked = document.querySelectorAll('.bulk-sheep-item-cb:checked').length;
  const countEl = document.getElementById('bulkSheepSelectionCount');
  if (countEl) countEl.textContent = `${checked} küçükbaş seçili`;
}

function executeBulkBarnTransfer() {
  const checkedBoxes = Array.from(document.querySelectorAll('.bulk-sheep-item-cb:checked'));
  if (checkedBoxes.length === 0) {
    alert('Lütfen transfer edilecek en az bir küçükbaş hayvan seçin.');
    return;
  }

  const targetBarn = document.getElementById('bulkToBarn').value;
  const ids = checkedBoxes.map(cb => cb.value);

  ids.forEach(id => {
    const s = (state.sheep || []).find(sh => sh.id === id);
    if (s) s.barn = targetBarn;
  });

  saveState();
  logAudit('TOPLU AĞIL TRANSFERİ', `${ids.length} baş küçükbaş "${targetBarn}" ağılına nakledildi.`);
  closeModal('modalBulkBarnTransfer');
  renderSheepPage();
  alert(`${ids.length} baş küçükbaş başarıyla "${targetBarn}" ağılına nakledildi.`);
}

function exportSheepCsv() {
  const sheepList = state.sheep || [];
  if (sheepList.length === 0) {
    alert('Dışa aktarılacak küçükbaş kaydı bulunmuyor.');
    return;
  }

  let csv = 'Kupe_No;Isim;Irk;Kategori;Cinsiyet;Agil_Bolme;Canli_Agirlik_kg;Dogum_Tipi;Ureme_Durumu;Koc_Katim_Tarihi;Katilan_Koc;Tahmini_Kuzulama;Ana;Baba\n';
  sheepList.forEach(s => {
    csv += `"${s.earTag}";"${s.name || ''}";"${s.breed}";"${s.category}";"${s.gender}";"${s.barn}";"${s.weight}";"${s.birthType || ''}";"${s.reproStatus || ''}";"${s.matingDate || ''}";"${s.matingRam || ''}";"${s.estLambingDate || ''}";"${s.dam || ''}";"${s.sire || ''}"\n`;
  });

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ozate_Ciftligi_Kucukbas_Suru_Listesi_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// =============================================================================

function renderMilkTable() {
  const tbody = document.getElementById('milkTbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.milkProductions.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(m.date)}</td>
      <td><span class="tag-badge" style="background: rgba(37,99,235,0.15); color: var(--accent-blue);">${m.session} Sağımı</span></td>
      <td style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${m.liters.toLocaleString('tr-TR')} Litre</td>
      <td>%${m.fat ? m.fat.toFixed(2) : '-'}</td>
      <td><strong>${m.tank}</strong></td>
      <td style="color: var(--text-muted);">${m.notes || '-'}</td>
    `;
    tbody.appendChild(tr);
  });

  renderTankIndicators();
}

// =============================================================================
// 10. YEM VE STOK DEPOSU SAYFASI
// =============================================================================

function renderInventoryTable() {
  const tbody = document.getElementById('inventoryTbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.inventory.forEach(item => {
    const isCritical = item.quantity <= item.minAlert;
    const totalVal = item.quantity * item.unitCost;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 700;">${item.name}</td>
      <td><span class="tag-badge">${item.category}</span></td>
      <td style="font-weight: 700; font-size: 1rem; color: ${isCritical ? 'var(--accent-danger)' : 'var(--text-main)'};">
        ${item.quantity.toLocaleString('tr-TR')}
      </td>
      <td>${item.unit}</td>
      <td style="color: var(--text-dim);">${item.minAlert} ${item.unit}</td>
      <td>${formatCurrency(item.unitCost)}</td>
      <td style="font-weight: 600;">${formatCurrency(totalVal)}</td>
      <td>
        <span class="badge ${isCritical ? 'warning' : 'positive'}">
          ${isCritical ? '⚠️ Kritik Seviye!' : 'Yeterli'}
        </span>
      </td>
      <td style="white-space: nowrap;">
        <button class="btn btn-sm btn-primary" onclick="openNewStockModal('${item.id}')" style="margin-right: 4px;">+ Giriş Yap</button>
        <button class="btn btn-sm btn-secondary" onclick="openConsumeStockModal('${item.id}')">- Tüketim Düş</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =============================================================================
// 10b. GÖREVLER, İŞ TAKVİMİ & HATIRLATMALAR SAYFASI (PRD 5.9)
// =============================================================================

let currentTaskViewMode = 'list';
let editingTaskId = null;

function setTaskViewMode(mode) {
  currentTaskViewMode = mode;
  const btnList = document.getElementById('btnTaskViewList');
  const btnCal = document.getElementById('btnTaskViewCalendar');
  const viewTable = document.getElementById('tasksTableView');
  const viewCal = document.getElementById('tasksCalendarView');

  if (mode === 'list') {
    if (btnList) btnList.className = 'btn btn-sm btn-secondary';
    if (btnCal) btnCal.className = 'btn btn-sm btn-ghost';
    if (viewTable) viewTable.style.display = 'block';
    if (viewCal) viewCal.style.display = 'none';
  } else {
    if (btnList) btnList.className = 'btn btn-sm btn-ghost';
    if (btnCal) btnCal.className = 'btn btn-sm btn-secondary';
    if (viewTable) viewTable.style.display = 'none';
    if (viewCal) viewCal.style.display = 'block';
  }
}

function getTaskCategoryLabel(category) {
  switch (category) {
    case 'HEALTH': return { text: '💉 Aşı & Sağlık', class: 'warning' };
    case 'BREEDING': return { text: '🧬 Tohumlama & Gebelik', class: 'positive' };
    case 'BIRTH': return { text: '🍼 Doğum & Buzağı', class: 'neutral' };
    case 'MAINTENANCE': return { text: '⚙️ Bakım & Servis', class: 'neutral' };
    case 'FINANCE': return { text: '💰 Finans & Vade', class: 'positive' };
    case 'INVENTORY': return { text: '📦 Yem & Stok', class: 'warning' };
    default: return { text: '📋 Genel İş', class: 'neutral' };
  }
}

function getTaskPriorityBadge(priority) {
  switch (priority) {
    case 'HIGH': return '<span class="badge danger" style="font-size:0.7rem;">🔴 Yüksek</span>';
    case 'MEDIUM': return '<span class="badge warning" style="font-size:0.7rem;">🟡 Orta</span>';
    default: return '<span class="badge neutral" style="font-size:0.7rem;">🔵 Normal</span>';
  }
}

function getTaskDueInfo(dueDate, isDone) {
  if (isDone) return { text: 'Tamamlandı', class: 'text-muted', badge: 'neutral' };
  const todayStr = new Date().toISOString().split('T')[0];
  if (dueDate === todayStr) {
    return { text: '🟡 Bugün!', class: 'text-warning font-bold', badge: 'warning' };
  } else if (dueDate < todayStr) {
    const diffDays = Math.round((new Date(todayStr) - new Date(dueDate)) / (1000 * 60 * 60 * 24));
    return { text: `🔴 ${diffDays} gün gecikti!`, class: 'text-danger font-bold', badge: 'danger' };
  } else {
    const diffDays = Math.round((new Date(dueDate) - new Date(todayStr)) / (1000 * 60 * 60 * 24));
    return { text: `${formatDateTurkish(dueDate)} (${diffDays} gün kaldı)`, class: 'text-main', badge: 'neutral' };
  }
}

function renderTasksPage() {
  if (!state.tasks) state.tasks = [];

  const todayStr = new Date().toISOString().split('T')[0];
  const next7DaysStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // 1. KPI İstatistikleri
  const overdueCount = state.tasks.filter(t => !t.done && t.dueDate < todayStr).length;
  const todayCount = state.tasks.filter(t => !t.done && t.dueDate === todayStr).length;
  const upcomingCount = state.tasks.filter(t => !t.done && t.dueDate > todayStr && t.dueDate <= next7DaysStr).length;
  const completedCount = state.tasks.filter(t => t.done).length;
  const pendingTotal = state.tasks.filter(t => !t.done).length;

  const kOver = document.getElementById('kpiTasksOverdue');
  if (kOver) kOver.textContent = overdueCount;
  const kToday = document.getElementById('kpiTasksToday');
  if (kToday) kToday.textContent = todayCount;
  const kUp = document.getElementById('kpiTasksUpcoming');
  if (kUp) kUp.textContent = upcomingCount;
  const kComp = document.getElementById('kpiTasksCompleted');
  if (kComp) kComp.textContent = completedCount;

  // Sol menü rozeti güncelle
  const badgeEl = document.getElementById('badgePendingTasksCount');
  if (badgeEl) {
    badgeEl.textContent = pendingTotal;
    badgeEl.style.display = pendingTotal > 0 ? 'inline-block' : 'none';
  }

  // 2. Sorumlu Personel dropdown seçeneklerini güncelle (Filtre ve Modal)
  const assigneeSelect = document.getElementById('filterTaskAssignee');
  if (assigneeSelect && assigneeSelect.options.length <= 1) {
    const currentVal = assigneeSelect.value;
    assigneeSelect.innerHTML = '<option value="ALL">Tüm Personel</option>';
    if (state.users) {
      state.users.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.name;
        opt.textContent = `${u.name} (${u.title || u.role})`;
        assigneeSelect.appendChild(opt);
      });
    }
    assigneeSelect.value = currentVal || 'ALL';
  }

  // 3. Filtreleri Oku
  const searchInput = document.getElementById('filterTaskSearch');
  const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const statusSelect = document.getElementById('filterTaskStatus');
  const statusVal = statusSelect ? statusSelect.value : 'PENDING';

  const catSelect = document.getElementById('filterTaskCategory');
  const catVal = catSelect ? catSelect.value : 'ALL';

  const assSelect = document.getElementById('filterTaskAssignee');
  const assVal = assSelect ? assSelect.value : 'ALL';

  // 4. Filtreleme
  const filtered = state.tasks.filter(t => {
    if (searchVal) {
      const matchTitle = (t.title || '').toLowerCase().includes(searchVal);
      const matchSub = (t.sub || '').toLowerCase().includes(searchVal);
      const matchAssignee = (t.assignee || '').toLowerCase().includes(searchVal);
      const matchAnimal = (t.relatedAnimal || '').toLowerCase().includes(searchVal);
      if (!matchTitle && !matchSub && !matchAssignee && !matchAnimal) return false;
    }
    if (statusVal === 'PENDING' && t.done) return false;
    if (statusVal === 'OVERDUE' && (t.done || t.dueDate >= todayStr)) return false;
    if (statusVal === 'COMPLETED' && !t.done) return false;
    if (catVal !== 'ALL' && t.category !== catVal) return false;
    if (assVal !== 'ALL' && t.assignee !== assVal) return false;
    return true;
  });

  // Tarihe göre sırala (Önce gecikenler ve bugünkiler)
  filtered.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (a.dueDate || '').localeCompare(b.dueDate || '');
  });

  // 5. Liste Tablosunu Render Et
  const tbody = document.getElementById('tasksTableTbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
        Arama kriterlerine uygun görev veya hatırlatma kaydı bulunamadı.
      </td></tr>`;
    } else {
      filtered.forEach(t => {
        const catInfo = getTaskCategoryLabel(t.category);
        const dueInfo = getTaskDueInfo(t.dueDate, t.done);
        const prioBadge = getTaskPriorityBadge(t.priority);

        const tr = document.createElement('tr');
        if (t.done) tr.style.opacity = '0.65';

        tr.innerHTML = `
          <td style="text-align: center;">
            <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTaskDone('${t.id}')" style="cursor: pointer; width: 18px; height: 18px; accent-color: var(--brand-primary);" title="${t.done ? 'Görevi Tekrar Aktif Yap' : 'Görevi Tamamlandı Olarak İşaretle'}">
          </td>
          <td>
            <div style="font-weight: 700; ${t.done ? 'text-decoration: line-through; color: var(--text-muted);' : 'color: var(--text-main);'} font-size: 0.92rem;">
              ${t.title}
            </div>
            ${t.sub ? `<div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 2px;">${t.sub}</div>` : ''}
            ${t.relatedAnimal ? `<span class="badge neutral" style="font-size: 0.7rem; margin-top: 4px; display: inline-block;">🐮 Küpe: ${t.relatedAnimal}</span>` : ''}
          </td>
          <td>
            <span class="badge ${catInfo.class}" style="font-size: 0.75rem;">${catInfo.text}</span>
          </td>
          <td>
            <div class="${dueInfo.class}" style="font-size: 0.85rem; font-weight: 600;">
              ${dueInfo.text}
            </div>
            <div style="font-size: 0.72rem; color: var(--text-dim);">${formatDateTurkish(t.dueDate)}</div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--bg-surface-hover); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: var(--brand-primary); border: 1px solid var(--border-subtle);">
                ${(t.assignee || 'ÇK').substring(0, 2).toUpperCase()}
              </div>
              <span style="font-size: 0.82rem; color: var(--text-main);">${t.assignee || 'Atanmadı'}</span>
            </div>
          </td>
          <td>
            ${prioBadge}
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 6px; justify-content: flex-end; align-items: center;">
              <button class="btn btn-sm ${t.done ? 'btn-ghost' : 'btn-secondary'}" style="padding: 4px 8px; font-size: 0.75rem;" onclick="toggleTaskDone('${t.id}')">
                ${t.done ? '↩️ Geri Al' : '✅ Tamamla'}
              </button>
              ${!t.done ? `<button class="btn btn-sm btn-ghost" style="padding: 4px 7px; font-size: 0.75rem;" onclick="postponeTask('${t.id}', 3)" title="Son tarihi 3 gün sonraya ertele">
                ⏰ +3 Gün
              </button>` : ''}
              <button class="btn btn-sm btn-ghost" style="padding: 4px 6px; font-size: 0.75rem; color: var(--text-muted);" onclick="openEditTaskModal('${t.id}')" title="Düzenle">
                ✏️
              </button>
              <button class="btn btn-sm btn-ghost" style="padding: 4px 6px; font-size: 0.75rem; color: var(--accent-red);" onclick="deleteTask('${t.id}')" title="Sil">
                🗑️
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // 6. Takvim Panosu (Calendar View) Render Et
  renderTasksCalendarGrid(filtered, todayStr);
}

function renderTasksCalendarGrid(tasks, todayStr) {
  const calGrid = document.getElementById('tasksCalendarGrid');
  if (!calGrid) return;
  calGrid.innerHTML = '';

  const groups = [
    { id: 'today', title: '🟡 Bugün Yapılacaklar', filter: t => !t.done && t.dueDate === todayStr, color: '#f59e0b' },
    { id: 'overdue', title: '🔴 Geciken / Acil', filter: t => !t.done && t.dueDate < todayStr, color: 'var(--accent-red)' },
    { id: 'thisWeek', title: '🔵 Bu Hafta Yaklaşan', filter: t => !t.done && t.dueDate > todayStr, color: 'var(--brand-primary)' },
    { id: 'done', title: '🟢 Tamamlananlar', filter: t => t.done, color: 'var(--accent-green)' }
  ];

  groups.forEach(g => {
    const colTasks = tasks.filter(g.filter);
    const colEl = document.createElement('div');
    colEl.style.cssText = `background: var(--bg-surface); border: 1px solid var(--border-subtle); border-top: 4px solid ${g.color}; border-radius: var(--radius-md); padding: 0.85rem; box-shadow: var(--shadow-sm);`;

    colEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border-subtle);">
        <strong style="font-size: 0.88rem;">${g.title}</strong>
        <span class="badge" style="background: var(--bg-surface-hover);">${colTasks.length}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${colTasks.length === 0 ? `<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; padding: 1rem;">Bu grupta görev yok</div>` : ''}
      </div>
    `;

    const listDiv = colEl.querySelector('div:last-child');
    colTasks.forEach(t => {
      const card = document.createElement('div');
      card.style.cssText = `background: var(--bg-surface-hover); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.65rem; font-size: 0.8rem;`;
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 6px;">
          <strong style="${t.done ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${t.title}</strong>
          ${getTaskPriorityBadge(t.priority)}
        </div>
        <div style="font-size: 0.72rem; color: var(--text-dim); margin: 4px 0;">📅 ${formatDateTurkish(t.dueDate)} · 👤 ${t.assignee || 'Atanmadı'}</div>
        <div style="display: flex; justify-content: flex-end; gap: 4px; margin-top: 6px;">
          <button class="btn btn-sm btn-ghost" style="padding: 2px 6px; font-size: 0.7rem;" onclick="toggleTaskDone('${t.id}')">${t.done ? '↩️ Geri Al' : '✅ Tamamla'}</button>
          <button class="btn btn-sm btn-ghost" style="padding: 2px 5px; font-size: 0.7rem;" onclick="openEditTaskModal('${t.id}')">✏️</button>
        </div>
      `;
      listDiv.appendChild(card);
    });

    calGrid.appendChild(colEl);
  });
}

function formatDateTurkish(dateStr) {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${parts[2]} ${months[monthIdx] || parts[1]} ${parts[0]}`;
}

function toggleTaskDone(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.done = !task.done;
  saveState();
  renderTasksPage();
  renderDashboard();
}

function postponeTask(taskId, days = 3) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  const current = new Date(task.dueDate || new Date());
  current.setDate(current.getDate() + days);
  task.dueDate = current.toISOString().split('T')[0];
  saveState();
  renderTasksPage();
  renderDashboard();
  alert(`"${task.title}" görevi ${days} gün sonraya (${formatDateTurkish(task.dueDate)}) ertelendi.`);
}

function deleteTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  if (!confirm(`"${task.title}" görevini silmek istediğinizden emin misiniz?`)) return;
  state.tasks = state.tasks.filter(t => t.id !== taskId);
  saveState();
  renderTasksPage();
  renderDashboard();
}

function openNewTaskModal() {
  editingTaskId = null;
  const titleEl = document.getElementById('modalTaskTitle');
  if (titleEl) titleEl.textContent = 'Yeni Görev / Hatırlatma Ekle';

  document.getElementById('taskTitle').value = '';
  document.getElementById('taskCategory').value = 'HEALTH';
  document.getElementById('taskPriority').value = 'MEDIUM';
  document.getElementById('taskDueDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('taskNotes').value = '';

  // Personel ve hayvan seçeneklerini doldur
  populateTaskUsersAndAnimalsSelect();

  openModal('modalTask');
}

function openEditTaskModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  editingTaskId = taskId;

  const titleEl = document.getElementById('modalTaskTitle');
  if (titleEl) titleEl.textContent = 'Görevi Düzenle';

  document.getElementById('taskTitle').value = task.title || '';
  document.getElementById('taskCategory').value = task.category || 'GENERAL';
  document.getElementById('taskPriority').value = task.priority || 'MEDIUM';
  document.getElementById('taskDueDate').value = task.dueDate || new Date().toISOString().split('T')[0];
  document.getElementById('taskNotes').value = task.sub || '';

  populateTaskUsersAndAnimalsSelect();

  const assSelect = document.getElementById('taskAssignee');
  if (assSelect && task.assignee) assSelect.value = task.assignee;

  const anSelect = document.getElementById('taskRelatedAnimal');
  if (anSelect && task.relatedAnimal) anSelect.value = task.relatedAnimal;

  openModal('modalTask');
}

function populateTaskUsersAndAnimalsSelect() {
  const assSelect = document.getElementById('taskAssignee');
  if (assSelect) {
    assSelect.innerHTML = '';
    if (state.users && state.users.length > 0) {
      state.users.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.name;
        opt.textContent = `${u.name} (${u.title || u.role})`;
        assSelect.appendChild(opt);
      });
    } else {
      const opt = document.createElement('option');
      opt.value = 'Çiftlik Ekibi';
      opt.textContent = 'Çiftlik Ekibi';
      assSelect.appendChild(opt);
    }
  }

  const anSelect = document.getElementById('taskRelatedAnimal');
  if (anSelect) {
    anSelect.innerHTML = '<option value="">— Genel Çiftlik Görevi (Hayvan Seçilmedi) —</option>';
    if (state.animals && state.animals.length > 0) {
      state.animals.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.earTag;
        opt.textContent = `${a.earTag} - ${a.name || 'İsimsiz'} (${a.paddock || 'Genel'})`;
        anSelect.appendChild(opt);
      });
    }
  }
}

function handleTaskSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const category = document.getElementById('taskCategory').value;
  const priority = document.getElementById('taskPriority').value;
  const dueDate = document.getElementById('taskDueDate').value;
  const assignee = document.getElementById('taskAssignee').value;
  const relatedAnimal = document.getElementById('taskRelatedAnimal').value;
  const notes = document.getElementById('taskNotes').value.trim();

  if (editingTaskId) {
    const task = state.tasks.find(t => t.id === editingTaskId);
    if (task) {
      task.title = title;
      task.category = category;
      task.priority = priority;
      task.dueDate = dueDate;
      task.assignee = assignee;
      task.relatedAnimal = relatedAnimal;
      task.sub = notes;
    }
    editingTaskId = null;
  } else {
    const newTask = {
      id: 'tsk-' + Date.now(),
      title,
      category,
      priority,
      dueDate,
      assignee,
      relatedAnimal,
      sub: notes,
      done: false
    };
    if (!state.tasks) state.tasks = [];
    state.tasks.unshift(newTask);
  }

  saveState();
  closeModal('modalTask');
  renderTasksPage();
  renderDashboard();
}

function generateAutoTaskReminders() {
  let createdCount = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Kritik Stok Kontrolü
  if (state.inventory) {
    state.inventory.forEach(item => {
      if (item.quantity <= item.minAlert) {
        const exists = state.tasks.some(t => t.category === 'INVENTORY' && t.title.includes(item.name) && !t.done);
        if (!exists) {
          state.tasks.unshift({
            id: 'tsk-auto-' + Date.now() + Math.random().toString(36).substr(2, 4),
            title: `Kritik Stok Uyarısı: ${item.name} (${item.quantity} ${item.unit} kaldı)`,
            sub: `Minimum limit ${item.minAlert} ${item.unit}. Tedarikçiyle irtibata geçilip sipariş verilmeli.`,
            category: 'INVENTORY',
            priority: 'HIGH',
            dueDate: todayStr,
            assignee: 'İşletme Yöneticisi',
            relatedAnimal: '',
            done: false
          });
          createdCount++;
        }
      }
    });
  }

  // 2. Bekleyen Cari Borç/Alacak Vade Kontrolü
  if (state.contacts) {
    state.contacts.forEach(c => {
      if (c.balance < -10000) {
        const exists = state.tasks.some(t => t.category === 'FINANCE' && t.title.includes(c.name) && !t.done);
        if (!exists) {
          state.tasks.unshift({
            id: 'tsk-auto-' + Date.now() + Math.random().toString(36).substr(2, 4),
            title: `Ödeme Vadesi: ${c.name} (${formatCurrency(Math.abs(c.balance))})`,
            sub: 'Tedarikçi vadesi yaklaşan borç ödemesi için bütçe planlaması yapılmalı.',
            category: 'FINANCE',
            priority: 'MEDIUM',
            dueDate: todayStr,
            assignee: 'Ayşe Muhasebe',
            relatedAnimal: '',
            done: false
          });
          createdCount++;
        }
      }
    });
  }

  saveState();
  renderTasksPage();
  renderDashboard();

  if (createdCount > 0) {
    alert(`Sistem başarıyla tarandı. Kritik stok ve ödemeler için ${createdCount} yeni hatırlatma takvime eklendi.`);
  } else {
    alert('Sistem tarandı. Tüm stok ve ödeme hatırlatmaları zaten güncel ve takvimde mevcut.');
  }
}

// =============================================================================
// 11. RAPORLAR SAYFASI
// =============================================================================

let currentReportTab = 'finance';

function renderReportsPage() {
  // KPI özet hesaplaması
  let income = 0;
  let expense = 0;
  (state.transactions || []).forEach(t => {
    if (t.status !== 'CANCELLED') {
      if (t.type === 'INCOME') income += t.amount;
      if (t.type === 'EXPENSE') expense += t.amount;
    }
  });

  const net = income - expense;
  const animalCount = (state.animals || []).length;
  const perAnimal = animalCount > 0 ? (net / animalCount) : 0;

  const elInc = document.getElementById('repTotalIncome');
  const elExp = document.getElementById('repTotalExpense');
  const elNet = document.getElementById('repNetResult');
  const elPer = document.getElementById('repPerAnimalProfit');

  if (elInc) elInc.textContent = formatCurrency(income);
  if (elExp) elExp.textContent = formatCurrency(expense);
  if (elNet) elNet.textContent = formatCurrency(net);
  if (elPer) elPer.textContent = formatCurrency(perAnimal) + ' / Baş';

  // Maliyet Dağılım Çubukları
  renderReportCostBreakdown();

  // Aktif sekme içeriğini render et
  renderActiveReportContent();
}

function renderReportCostBreakdown() {
  const breakdownContainer = document.getElementById('reportCostBreakdown');
  if (!breakdownContainer) return;

  const categories = [
    { name: 'Yem & Kaba Yem', percent: 58, color: '#D97706' },
    { name: 'İşçilik & Personel', percent: 22, color: '#2563EB' },
    { name: 'Veteriner & Aşı/Sağlık', percent: 11, color: '#7C3AED' },
    { name: 'Elektrik, Mazot & Enerji', percent: 9, color: '#DC2626' }
  ];

  let html = '';
  categories.forEach(cat => {
    html += `
      <div class="cost-row">
        <div class="cost-row-header">
          <span><strong>${cat.name}</strong></span>
          <span style="font-weight: 700;">%${cat.percent}</span>
        </div>
        <div class="cost-bar-bg">
          <div class="cost-bar-fill" style="width: ${cat.percent}%; background-color: ${cat.color};"></div>
        </div>
      </div>
    `;
  });

  breakdownContainer.innerHTML = html;
}

function switchReportTab(tab) {
  currentReportTab = tab;
  document.querySelectorAll('#reportNavTabs [data-report-tab]').forEach(btn => {
    const isAct = btn.getAttribute('data-report-tab') === tab;
    btn.className = `btn btn-sm ${isAct ? 'btn-secondary active' : 'btn-ghost'}`;
  });

  // Finans harici sekmelerde maliyet grafiğini gizle/göster
  const costPanel = document.getElementById('reportCostBreakdownPanel');
  if (costPanel) {
    costPanel.style.display = (tab === 'finance') ? 'block' : 'none';
  }

  renderActiveReportContent();
}

function applyReportQuickRange(range) {
  const startInput = document.getElementById('repFilterStartDate');
  const endInput = document.getElementById('repFilterEndDate');
  if (!startInput || !endInput) return;

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;

  if (range === 'ALL') {
    startInput.value = '';
    endInput.value = '';
  } else if (range === 'THIS_MONTH') {
    startInput.value = `${now.getFullYear()}-${pad(now.getMonth()+1)}-01`;
    endInput.value = todayStr;
  } else if (range === 'LAST_MONTH') {
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    startInput.value = `${prevMonthDate.getFullYear()}-${pad(prevMonthDate.getMonth()+1)}-01`;
    endInput.value = `${lastDayPrevMonth.getFullYear()}-${pad(lastDayPrevMonth.getMonth()+1)}-${pad(lastDayPrevMonth.getDate())}`;
  } else if (range === 'THIS_YEAR') {
    startInput.value = `${now.getFullYear()}-01-01`;
    endInput.value = todayStr;
  }

  renderActiveReportContent();
}

function getReportDateFilteredData(list, dateField = 'date') {
  if (!Array.isArray(list)) return [];
  const start = document.getElementById('repFilterStartDate')?.value;
  const end = document.getElementById('repFilterEndDate')?.value;

  return list.filter(item => {
    const itemDate = item[dateField];
    if (!itemDate) return true;
    if (start && itemDate < start) return false;
    if (end && itemDate > end) return false;
    return true;
  });
}

function renderActiveReportContent() {
  const thead = document.getElementById('reportDynamicThead');
  const tbody = document.getElementById('reportDynamicTbody');
  const tfoot = document.getElementById('reportDynamicTfoot');
  const title = document.getElementById('reportTitleHeader');
  const sub = document.getElementById('reportSubtitleHeader');
  const badge = document.getElementById('repRecordCountBadge');

  if (!tbody || !thead) return;
  thead.innerHTML = '';
  tbody.innerHTML = '';
  if (tfoot) tfoot.innerHTML = '';

  if (currentReportTab === 'finance') {
    if (title) title.textContent = '💰 Finansal Kâr / Zarar & Nakit Akış Tablosu';
    if (sub) sub.textContent = 'Gelirler, giderler, cari hesap bağlantıları ve tahsilat durumları';

    const txs = getReportDateFilteredData(state.transactions || [], 'date');
    if (badge) badge.textContent = `${txs.length} İşlem`;

    thead.innerHTML = `
      <tr>
        <th>Tarih</th>
        <th>Tür</th>
        <th>Kategori</th>
        <th>Açıklama</th>
        <th>Cari Hesap</th>
        <th>Kasa / Banka</th>
        <th style="text-align: right;">Tutar</th>
        <th>Ödeme Durumu</th>
      </tr>
    `;

    if (txs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--text-muted);">Seçili tarih aralığında finans kaydı bulunamadı.</td></tr>`;
      return;
    }

    let totInc = 0, totExp = 0;
    [...txs].reverse().forEach(t => {
      if (t.type === 'INCOME') totInc += t.amount;
      if (t.type === 'EXPENSE') totExp += t.amount;
      const c = (state.contacts || []).find(con => con.id === t.contactId);
      const a = (state.accounts || []).find(acc => acc.id === t.accountId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(t.date)}</td>
        <td><span class="tag-badge ${t.type === 'INCOME' ? 'tag-income' : 'tag-expense'}">${t.type === 'INCOME' ? 'Gelir' : 'Gider'}</span></td>
        <td><strong>${escapeHtml(t.category)}</strong></td>
        <td>${escapeHtml(t.desc || '-')}</td>
        <td>${c ? escapeHtml(c.name) : '-'}</td>
        <td>${a ? escapeHtml(a.name) : '-'}</td>
        <td style="text-align: right; font-weight:700; color:${t.type === 'INCOME' ? 'var(--accent-success)' : 'var(--accent-danger)'}">${formatCurrency(t.amount)}</td>
        <td><span class="tag-badge ${t.status === 'PAID' ? 'tag-paid' : 'tag-pending'}">${t.status === 'PAID' ? 'Tamamlandı' : 'Bekliyor'}</span></td>
      `;
      tbody.appendChild(tr);
    });

    if (tfoot) {
      tfoot.innerHTML = `
        <tr style="font-weight:700; background:var(--bg-surface-hover);">
          <td colspan="6">DÖNEM TOPLAMLARI (Gelir: ${formatCurrency(totInc)} | Gider: ${formatCurrency(totExp)})</td>
          <td style="text-align:right; color:${totInc >= totExp ? 'var(--accent-success)' : 'var(--accent-danger)'}">Net: ${formatCurrency(totInc - totExp)}</td>
          <td></td>
        </tr>
      `;
    }
  } else if (currentReportTab === 'cattle') {
    if (title) title.textContent = '🐄 Büyükbaş Sürü Envanteri & Verim Raporu';
    if (sub) sub.textContent = 'Küpe numaraları, padok yerleşimi, canlı ağırlık ve süt verim performansı';

    const animals = state.animals || [];
    if (badge) badge.textContent = `${animals.length} Büyükbaş`;

    thead.innerHTML = `
      <tr>
        <th>Küpe No</th>
        <th>Hayvan Adı</th>
        <th>Irk</th>
        <th>Kategori</th>
        <th>Cinsiyet</th>
        <th>Bulunduğu Padok</th>
        <th style="text-align: right;">Canlı Ağırlık (kg)</th>
        <th>Verim Durumu</th>
        <th>Sağlık</th>
      </tr>
    `;

    if (animals.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--text-muted);">Kayıtlı büyükbaş hayvan bulunamadı.</td></tr>`;
      return;
    }

    let totWeight = 0;
    animals.forEach(a => {
      totWeight += (Number(a.weight) || 0);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700; font-family:monospace; color:var(--ozate-burgundy);">${escapeHtml(a.earTag)}</td>
        <td>${escapeHtml(a.name || '-')}</td>
        <td>${escapeHtml(a.breed)}</td>
        <td><span class="tag-badge" style="background: rgba(30,77,43,0.15); color: var(--ozate-green-accent);">${escapeHtml(a.category)}</span></td>
        <td>${escapeHtml(a.gender)}</td>
        <td><strong>${escapeHtml(a.paddock)}</strong></td>
        <td style="text-align: right; font-weight:700;">${a.weight || 0} kg</td>
        <td>${escapeHtml(a.yield || '-')}</td>
        <td>${escapeHtml(a.health || 'Sağlıklı')}</td>
      `;
      tbody.appendChild(tr);
    });

    if (tfoot) {
      const avg = animals.length > 0 ? (totWeight / animals.length).toFixed(1) : 0;
      tfoot.innerHTML = `
        <tr style="font-weight:700; background:var(--bg-surface-hover);">
          <td colspan="6">TOPLAM SÜRÜ: ${animals.length} BAŞ</td>
          <td style="text-align:right;">Ort: ${avg} kg (Toplam: ${totWeight.toLocaleString('tr-TR')} kg)</td>
          <td colspan="2"></td>
        </tr>
      `;
    }
  } else if (currentReportTab === 'sheep') {
    if (title) title.textContent = '🐑 Küçükbaş Sürü & Üreme Durum Raporu';
    if (sub) sub.textContent = 'Koyun, koç, kuzu varlığı, ağıl dağılımı, gebelik ve laktasyon durumu';

    const sheep = state.sheep || [];
    if (badge) badge.textContent = `${sheep.length} Küçükbaş`;

    thead.innerHTML = `
      <tr>
        <th>Küpe No</th>
        <th>Ad / Tanım</th>
        <th>Irk</th>
        <th>Kategori</th>
        <th>Cinsiyet</th>
        <th>Ağıl / Mera</th>
        <th style="text-align: right;">Ağırlık (kg)</th>
        <th>Üreme Durumu</th>
        <th>Sağlık Notu</th>
      </tr>
    `;

    if (sheep.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--text-muted);">Kayıtlı küçükbaş hayvan bulunamadı.</td></tr>`;
      return;
    }

    let totWeight = 0;
    sheep.forEach(s => {
      totWeight += (Number(s.weight) || 0);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700; font-family:monospace; color:var(--ozate-green);">${escapeHtml(s.earTag)}</td>
        <td>${escapeHtml(s.name || '-')}</td>
        <td>${escapeHtml(s.breed)}</td>
        <td><span class="tag-badge" style="background: rgba(43,114,186,0.15); color: #2563EB;">${escapeHtml(s.category)}</span></td>
        <td>${escapeHtml(s.gender)}</td>
        <td><strong>${escapeHtml(s.barn || '-')}</strong></td>
        <td style="text-align: right; font-weight:700;">${s.weight || 0} kg</td>
        <td><span class="badge ${s.reproStatus === 'Gebe' ? 'positive' : 'neutral'}">${escapeHtml(s.reproStatus || '-')}</span></td>
        <td>${escapeHtml(s.health || 'Rutin Takip')}</td>
      `;
      tbody.appendChild(tr);
    });

    if (tfoot) {
      const avg = sheep.length > 0 ? (totWeight / sheep.length).toFixed(1) : 0;
      tfoot.innerHTML = `
        <tr style="font-weight:700; background:var(--bg-surface-hover);">
          <td colspan="6">KÜÇÜKBAŞ TOPLAM: ${sheep.length} BAŞ</td>
          <td style="text-align:right;">Ort: ${avg} kg (Toplam: ${totWeight.toLocaleString('tr-TR')} kg)</td>
          <td colspan="2"></td>
        </tr>
      `;
    }
  } else if (currentReportTab === 'milk') {
    if (title) title.textContent = '🥛 Günlük Süt Üretim & Tank Raporu';
    if (sub) sub.textContent = 'Sağım seansları, tank transferleri, yağ oranları ve günlük toplam üretim';

    const milks = getReportDateFilteredData(state.milkProductions || [], 'date');
    if (badge) badge.textContent = `${milks.length} Sağım Kaydı`;

    thead.innerHTML = `
      <tr>
        <th>Tarih</th>
        <th>Sağım Seansı</th>
        <th style="text-align: right;">Üretim (Litre)</th>
        <th>Yağ Oranı (%)</th>
        <th>Depolanan Tank</th>
        <th>Notlar / Açıklama</th>
      </tr>
    `;

    if (milks.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">Seçili tarih aralığında süt üretim kaydı bulunamadı.</td></tr>`;
      return;
    }

    let totLiters = 0;
    [...milks].reverse().forEach(m => {
      totLiters += (Number(m.liters) || 0);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(m.date)}</td>
        <td><span class="tag-badge" style="background: rgba(37,99,235,0.15); color: var(--accent-blue);">${escapeHtml(m.session)} Sağımı</span></td>
        <td style="text-align: right; font-weight:700; font-size:1rem; color:var(--text-main);">${(Number(m.liters) || 0).toLocaleString('tr-TR')} L</td>
        <td>%${m.fat ? Number(m.fat).toFixed(2) : '-'}</td>
        <td><strong>${escapeHtml(m.tank || '-')}</strong></td>
        <td>${escapeHtml(m.notes || '-')}</td>
      `;
      tbody.appendChild(tr);
    });

    if (tfoot) {
      tfoot.innerHTML = `
        <tr style="font-weight:700; background:var(--bg-surface-hover);">
          <td colspan="2">DÖNEM TOPLAM SÜT ÜRETİMİ</td>
          <td style="text-align:right; color:var(--accent-blue); font-size:1.05rem;">${totLiters.toLocaleString('tr-TR')} Litre</td>
          <td colspan="3"></td>
        </tr>
      `;
    }
  } else if (currentReportTab === 'inventory') {
    if (title) title.textContent = '🌾 Yem & Depo Stok Maliyet Raporu';
    if (sub) sub.textContent = 'Kaba yem, konsantre yem ve ilaçların stok miktarları, birim maliyetleri ve depo toplam değeri';

    const items = state.inventory || [];
    if (badge) badge.textContent = `${items.length} Kalem Stok`;

    thead.innerHTML = `
      <tr>
        <th>Malzeme / Yem Adı</th>
        <th>Kategori</th>
        <th style="text-align: right;">Mevcut Miktar</th>
        <th>Birim</th>
        <th style="text-align: right;">Birim Maliyet</th>
        <th style="text-align: right;">Toplam Değer</th>
        <th>Kritik Eşik Uyarısı</th>
      </tr>
    `;

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">Depoda kayıtlı stok kalemi bulunamadı.</td></tr>`;
      return;
    }

    let totInvValue = 0;
    items.forEach(it => {
      const q = Number(it.quantity) || 0;
      const c = Number(it.unitCost) || 0;
      const totalVal = q * c;
      totInvValue += totalVal;
      const isCritical = q <= (Number(it.minAlert) || 0);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;">${escapeHtml(it.name)}</td>
        <td><span class="tag-badge">${escapeHtml(it.category)}</span></td>
        <td style="text-align: right; font-weight:700; color:${isCritical ? 'var(--accent-danger)' : 'var(--text-main)'};">${q.toLocaleString('tr-TR')}</td>
        <td>${escapeHtml(it.unit)}</td>
        <td style="text-align: right;">${formatCurrency(c)}</td>
        <td style="text-align: right; font-weight:700; color:var(--accent-green);">${formatCurrency(totalVal)}</td>
        <td>${isCritical ? '<span class="badge danger">⚠️ Kritik Seviye Altında</span>' : '<span class="badge positive">Normal</span>'}</td>
      `;
      tbody.appendChild(tr);
    });

    if (tfoot) {
      tfoot.innerHTML = `
        <tr style="font-weight:700; background:var(--bg-surface-hover);">
          <td colspan="5">TOPLAM DEPO VARLIK DEĞERİ</td>
          <td style="text-align:right; color:var(--accent-green); font-size:1.05rem;">${formatCurrency(totInvValue)}</td>
          <td></td>
        </tr>
      `;
    }
  } else if (currentReportTab === 'qurban') {
    if (title) title.textContent = '🕌 Kurban Satış, Hisse & Kesimhane Raporu';
    if (sub) sub.textContent = 'Kurbanlıklar, hisse doluluk oranları, tahsilat, kapora ve kesimhane sırası dökümü';

    const qAnimals = state.qurbanAnimals || [];
    const qShares = state.qurbanShares || [];
    if (badge) badge.textContent = `${qAnimals.length} Kurbanlık / ${qShares.length} Hisse`;

    thead.innerHTML = `
      <tr>
        <th>Kurban No</th>
        <th>Tür</th>
        <th>Küpe No / Irk</th>
        <th style="text-align: right;">Canlı Ağırlık</th>
        <th style="text-align: right;">Toplam Tutar</th>
        <th>Hisse Sayısı</th>
        <th>Satılan Hisse</th>
        <th>Kesim Günü & Sıra</th>
        <th>Durum</th>
      </tr>
    `;

    if (qAnimals.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--text-muted);">Kayıtlı kurbanlık bulunamadı.</td></tr>`;
      return;
    }

    let totQurbanVal = 0;
    qAnimals.forEach(qa => {
      const animalShares = qShares.filter(s => s.qurbanId === qa.id);
      const totalShares = parseInt(qa.shareCount) || 7;
      totQurbanVal += (Number(qa.totalPrice) || 0);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700; color:var(--brand-primary); font-family:monospace;">${escapeHtml(qa.qurbanNo)}</td>
        <td>${qa.animalType === 'BÜYÜKBAŞ' ? '🐂 Büyükbaş' : '🐑 Küçükbaş'}</td>
        <td>${escapeHtml(qa.earTag || '-')} (${escapeHtml(qa.breed || '-')})</td>
        <td style="text-align: right; font-weight:600;">${qa.liveWeight || 0} kg</td>
        <td style="text-align: right; font-weight:700; color:var(--accent-success);">${formatCurrency(qa.totalPrice || 0)}</td>
        <td>${totalShares} Hisse</td>
        <td><strong>${animalShares.length} / ${totalShares}</strong> (%${Math.round((animalShares.length/totalShares)*100)})</td>
        <td>${qa.slaughterDay ? `${qa.slaughterDay}. Gün` : '-'} ${qa.slaughterOrder ? `(Sıra: ${qa.slaughterOrder})` : ''}</td>
        <td><span class="tag-badge ${qa.status === 'SOLD_OUT' ? 'tag-paid' : 'tag-partial'}">${escapeHtml(qa.status || 'AVAILABLE')}</span></td>
      `;
      tbody.appendChild(tr);
    });

    if (tfoot) {
      tfoot.innerHTML = `
        <tr style="font-weight:700; background:var(--bg-surface-hover);">
          <td colspan="4">TOPLAM KURBANLIK SATIŞ DEĞERİ</td>
          <td style="text-align:right; color:var(--accent-success);">${formatCurrency(totQurbanVal)}</td>
          <td colspan="4">Satılan: ${qShares.length} Hisse</td>
        </tr>
      `;
    }
  }
}

// -----------------------------------------------------------------------------
// Rapor Dışa Aktarma: EXCEL / CSV İNDİRME
// -----------------------------------------------------------------------------
function exportCurrentReportExcel() {
  const table = document.getElementById('reportDynamicTable');
  if (!table) return;

  const titleHeader = document.getElementById('reportTitleHeader')?.textContent || 'ciftlik_raporu';
  const cleanTitle = titleHeader.replace(/[^a-zA-Z0-9ığüşöçİĞÜŞÖÇ_ -]/g, '').trim().replace(/\s+/g, '_').toLowerCase();
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `ozate_${cleanTitle}_${dateStr}.csv`;

  const rows = [];
  // Başlıklar
  const theadRows = table.querySelectorAll('thead tr');
  theadRows.forEach(tr => {
    const row = [];
    tr.querySelectorAll('th').forEach(th => {
      row.push(th.textContent.trim());
    });
    if (row.length) rows.push(row);
  });

  // Veri satırları
  const tbodyRows = table.querySelectorAll('tbody tr');
  tbodyRows.forEach(tr => {
    const row = [];
    tr.querySelectorAll('td').forEach(td => {
      row.push(td.textContent.trim().replace(/\s+/g, ' '));
    });
    if (row.length) rows.push(row);
  });

  // Toplam satırları
  const tfootRows = table.querySelectorAll('tfoot tr');
  tfootRows.forEach(tr => {
    const row = [];
    tr.querySelectorAll('td').forEach(td => {
      row.push(td.textContent.trim().replace(/\s+/g, ' '));
    });
    if (row.length) rows.push(row);
  });

  if (rows.length === 0) {
    alert('Dışa aktarılacak rapor satırı bulunamadı.');
    return;
  }

  exportToCsv(filename, rows);
  showToastNotification(`"${filename}" Excel/CSV dosyası başarıyla indirildi.`);
}

// -----------------------------------------------------------------------------
// Rapor Dışa Aktarma: PDF / YAZDIRMA
// -----------------------------------------------------------------------------
function printCurrentReportPdf() {
  const printArea = document.getElementById('reportPrintableArea');
  if (!printArea) {
    window.print();
    return;
  }

  const farmName = (state.farm && state.farm.name) ? state.farm.name : 'Özate Çiftliği';
  const titleText = document.getElementById('reportTitleHeader')?.textContent || 'Çiftlik Raporu';
  const subtitleText = document.getElementById('reportSubtitleHeader')?.textContent || '';
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const win = window.open('', '_blank');
  if (!win) {
    window.print();
    return;
  }

  const tableHtml = printArea.querySelector('.table-responsive')?.innerHTML || '';

  win.document.write(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>${farmName} - ${titleText}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 25px; margin: 0; }
        .print-header { border-bottom: 2px solid #1E4D2B; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .print-title { font-size: 1.4rem; font-weight: 800; color: #1E4D2B; margin: 0; }
        .print-sub { font-size: 0.85rem; color: #64748b; margin-top: 4px; }
        .print-date { font-size: 0.8rem; color: #64748b; text-align: right; }
        table { width: 100%; border-collapse: collapse; font-size: 0.82rem; margin-top: 10px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
        th { background: #f8fafc; font-weight: 700; color: #0f172a; }
        tfoot tr td { background: #f1f5f9; font-weight: 700; }
        .print-footer { margin-top: 30px; font-size: 0.75rem; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <div>
          <h1 class="print-title">${farmName}</h1>
          <div class="print-sub"><strong>${titleText}</strong> - ${subtitleText}</div>
        </div>
        <div class="print-date">
          <div>Rapor Tarihi: ${dateStr}</div>
          <div>Sistem: Özate Çiftlik Yönetimi</div>
        </div>
      </div>
      <div>
        ${tableHtml}
      </div>
      <div class="print-footer">
        Bu rapor Özate Çiftlik Yönetim Sistemi tarafından otomatik oluşturulmuştur.
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      <\/script>
    </body>
    </html>
  `);
  win.document.close();
}

// =============================================================================
// 12. DIALOG / MODAL YÖNETİMİ
// =============================================================================

function openModal(id) {
  const dlg = document.getElementById(id);
  if (dlg && typeof dlg.showModal === 'function') {
    dlg.showModal();
  }
}

function closeModal(id) {
  const dlg = document.getElementById(id);
  if (dlg && typeof dlg.close === 'function') {
    dlg.close();
  }
}

// Gelir/Gider Modal Açılışı
function populateTxCategories(type, selectedCategory = null) {
  const catSelect = document.getElementById('txCategory');
  if (!catSelect) return;
  catSelect.innerHTML = '';
  const cats = type === 'INCOME' 
    ? (state.parameters?.incomeCategories || DEFAULT_STATE.parameters.incomeCategories)
    : (state.parameters?.expenseCategories || DEFAULT_STATE.parameters.expenseCategories);
  
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    if (selectedCategory && selectedCategory === c) opt.selected = true;
    catSelect.appendChild(opt);
  });
}

function populateTxContacts(preselectContactId = null) {
  const contactSelect = document.getElementById('txContact');
  if (!contactSelect) return;
  contactSelect.innerHTML = '<option value="">-- Cari Seçilmedi (Peşin) --</option>';
  state.contacts.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.type === 'CUSTOMER' ? 'Müşteri' : 'Tedarikçi'})`;
    if (preselectContactId === c.id) opt.selected = true;
    contactSelect.appendChild(opt);
  });
}

function openNewTransactionModal(type, preselectContactId = null) {
  const dlg = document.getElementById('modalTransaction');
  const editingInput = document.getElementById('txEditingId');
  if (editingInput) editingInput.value = '';

  const submitBtn = document.getElementById('txSubmitBtn');
  if (submitBtn) submitBtn.textContent = 'Kaydet';

  document.getElementById('txType').value = type;
  document.getElementById('txModalTitle').textContent = type === 'INCOME' ? 'Yeni Gelir Kaydı Ekle' : 'Yeni Gider Kaydı Ekle';
  document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('txAmount').value = '';
  document.getElementById('txDescription').value = '';

  populateTxCategories(type);
  populateTxContacts(preselectContactId);
  populateAccountDropdowns();

  openModal('modalTransaction');
}

function openEditTransactionModal(txId) {
  const tx = state.transactions.find(t => t.id === txId);
  if (!tx) return;

  const editingInput = document.getElementById('txEditingId');
  if (editingInput) editingInput.value = tx.id;

  const submitBtn = document.getElementById('txSubmitBtn');
  if (submitBtn) submitBtn.textContent = 'Değişiklikleri Güncelle';

  populateAccountDropdowns();
  document.getElementById('txType').value = tx.type;
  document.getElementById('txModalTitle').textContent = tx.type === 'INCOME' ? 'Gelir Kaydını Düzenle' : 'Gider Kaydını Düzenle';
  document.getElementById('txDate').value = tx.date;
  document.getElementById('txAmount').value = tx.amount;
  document.getElementById('txAccount').value = tx.accountId || (state.accounts[0] ? state.accounts[0].id : 'acc-1');
  document.getElementById('txStatus').value = tx.status;
  document.getElementById('txDescription').value = tx.desc || '';

  populateTxCategories(tx.type, tx.category);
  populateTxContacts(tx.contactId);

  openModal('modalTransaction');
}

function handleTransactionSubmit(e) {
  e.preventDefault();
  const editingId = document.getElementById('txEditingId') ? document.getElementById('txEditingId').value : '';
  const type = document.getElementById('txType').value;
  const date = document.getElementById('txDate').value;
  const category = document.getElementById('txCategory').value;
  const amount = parseFloat(document.getElementById('txAmount').value) || 0;
  const accountId = document.getElementById('txAccount').value;
  const contactId = document.getElementById('txContact').value || null;
  const status = document.getElementById('txStatus').value;
  const desc = document.getElementById('txDescription').value || `${category} kaydı`;

  if (amount <= 0) {
    alert('Geçerli bir tutar giriniz.');
    return;
  }

  // Düzenleme Modu
  if (editingId) {
    const existingTx = state.transactions.find(t => t.id === editingId);
    if (existingTx) {
      // Önceki bakiye etkisini geri al
      if (existingTx.status === 'PAID') {
        const oldAcc = state.accounts.find(a => a.id === existingTx.accountId);
        if (oldAcc) {
          if (existingTx.type === 'INCOME') oldAcc.balance -= existingTx.amount;
          if (existingTx.type === 'EXPENSE') oldAcc.balance += existingTx.amount;
        }
      }
      if (existingTx.contactId && existingTx.status === 'PENDING') {
        const oldC = state.contacts.find(con => con.id === existingTx.contactId);
        if (oldC) {
          if (existingTx.type === 'INCOME') oldC.balance -= existingTx.amount;
          if (existingTx.type === 'EXPENSE') oldC.balance += existingTx.amount;
        }
      }

      // Yeni değerleri uygula
      existingTx.date = date;
      existingTx.category = category;
      existingTx.amount = amount;
      existingTx.paidAmount = status === 'PAID' ? amount : (status === 'PARTIAL' ? amount / 2 : 0);
      existingTx.status = status;
      existingTx.contactId = contactId;
      existingTx.accountId = accountId;
      existingTx.desc = desc;

      // Yeni bakiye etkisini uygula
      if (status === 'PAID') {
        const newAcc = state.accounts.find(a => a.id === accountId);
        if (newAcc) {
          if (type === 'INCOME') newAcc.balance += amount;
          if (type === 'EXPENSE') newAcc.balance -= amount;
        }
      }
      if (contactId && status === 'PENDING') {
        const newC = state.contacts.find(con => con.id === contactId);
        if (newC) {
          if (type === 'INCOME') newC.balance += amount;
          if (type === 'EXPENSE') newC.balance -= amount;
        }
      }

      saveState();
      closeModal('modalTransaction');
      renderTransactionsTable();
      renderAccountsPage();
      renderContactsPage();
      renderDashboard();
      showToastNotification('Finans kaydı başarıyla güncellendi.');
      return;
    }
  }

  // Yeni Kayıt Modu
  const newTx = {
    id: 'tx-' + Date.now(),
    date,
    type,
    category,
    amount,
    paidAmount: status === 'PAID' ? amount : (status === 'PARTIAL' ? amount / 2 : 0),
    status,
    contactId,
    accountId,
    desc
  };

  state.transactions.unshift(newTx);

  // Kasa / Banka Bakiyesi Güncelleme
  if (status === 'PAID') {
    const acc = state.accounts.find(a => a.id === accountId);
    if (acc) {
      if (type === 'INCOME') acc.balance += amount;
      if (type === 'EXPENSE') acc.balance -= amount;
    }
  }

  // Cari Bakiye Güncelleme
  if (contactId) {
    const c = state.contacts.find(con => con.id === contactId);
    if (c) {
      if (type === 'INCOME' && status === 'PENDING') c.balance += amount;
      if (type === 'EXPENSE' && status === 'PENDING') c.balance -= amount;
    }
  }

  saveState();
  closeModal('modalTransaction');
  renderTransactionsTable();
  renderDashboard();
}

// Virman Transferi
function openTransferModal() {
  populateAccountDropdowns();
  document.getElementById('trDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('trAmount').value = '';
  document.getElementById('trNote').value = '';
  openModal('modalTransfer');
}

function handleTransferSubmit(e) {
  e.preventDefault();
  const fromAccId = document.getElementById('trFrom').value;
  const toAccId = document.getElementById('trTo').value;
  const amount = parseFloat(document.getElementById('trAmount').value) || 0;
  const date = document.getElementById('trDate').value;
  const note = document.getElementById('trNote').value || 'Hesaplar arası virman';

  if (fromAccId === toAccId) {
    alert('Kaynak ve hedef hesap aynı olamaz.');
    return;
  }

  const fromAcc = state.accounts.find(a => a.id === fromAccId);
  const toAcc = state.accounts.find(a => a.id === toAccId);

  if (!fromAcc || !toAcc || amount <= 0) {
    alert('Lütfen geçerli bir tutar giriniz.');
    return;
  }

  if (fromAcc.balance < amount) {
    if (!confirm('Kaynak hesap bakiyesi bu transfer için yetersiz görünüyor. Devam edilsin mi?')) return;
  }

  fromAcc.balance -= amount;
  toAcc.balance += amount;

  state.transfers.push({
    id: 'tr-' + Date.now(),
    date,
    fromAcc: fromAccId,
    toAcc: toAccId,
    amount,
    note
  });

  saveState();
  closeModal('modalTransfer');
  renderAccountsPage();
  renderDashboard();
}

// Yeni Hayvan & Dinamik Seçenekler
function populateAnimalDropdowns(selectedPaddock = null, selectedBreed = null, selectedCat = null) {
  const breedSel = document.getElementById('anBreed');
  const catSel = document.getElementById('anCategory');
  const padSel = document.getElementById('anPaddock');

  if (breedSel) {
    breedSel.innerHTML = '';
    (state.parameters?.breeds || DEFAULT_STATE.parameters.breeds).forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      if (selectedBreed && selectedBreed === b) opt.selected = true;
      breedSel.appendChild(opt);
    });
  }

  if (catSel) {
    catSel.innerHTML = '';
    (state.parameters?.animalCategories || DEFAULT_STATE.parameters.animalCategories).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      if (selectedCat && selectedCat === c) opt.selected = true;
      catSel.appendChild(opt);
    });
  }

  if (padSel) {
    padSel.innerHTML = '';
    (state.parameters?.paddocks || DEFAULT_STATE.parameters.paddocks).forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p + ' Padoğu';
      if (selectedPaddock && selectedPaddock === p) opt.selected = true;
      padSel.appendChild(opt);
    });
  }
}

function openNewAnimalModal() {
  document.getElementById('anEarTag').value = 'TR16' + Math.floor(10000000 + Math.random() * 90000000);
  document.getElementById('anName').value = '';
  document.getElementById('anWeight').value = '550';
  populateAnimalDropdowns();
  openModal('modalAnimal');
}

function handleAnimalSubmit(e) {
  e.preventDefault();
  const earTag = document.getElementById('anEarTag').value.trim();
  const name = document.getElementById('anName').value.trim();
  const breed = document.getElementById('anBreed').value;
  const category = document.getElementById('anCategory').value;
  const paddock = document.getElementById('anPaddock').value;
  const weight = parseFloat(document.getElementById('anWeight').value) || 500;

  state.animals.push({
    id: 'an-' + Date.now(),
    earTag,
    name,
    breed,
    category,
    gender: category === 'Besi Danası' ? 'Erkek' : 'Dişi',
    paddock,
    weight,
    yield: category === 'Süt İneği' ? '28.0 L/gün' : '+1.40 kg/gün',
    status: 'Aktif',
    health: 'Mükemmel'
  });

  saveState();
  logAudit('YENİ HAYVAN', `${earTag} - ${name} (${breed}, ${category}, ${paddock}) sürüye eklendi.`);
  closeModal('modalAnimal');
  renderAnimalsTable();
  renderDashboard();
}

// Sağım Verisi
function openNewMilkModal() {
  document.getElementById('mkDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('mkLiters').value = '720';
  document.getElementById('mkFat').value = '3.85';
  openModal('modalMilk');
}

function handleMilkSubmit(e) {
  e.preventDefault();
  const date = document.getElementById('mkDate').value;
  const session = document.getElementById('mkSession').value;
  const liters = parseFloat(document.getElementById('mkLiters').value) || 0;
  const tank = document.getElementById('mkTank').value;
  const fat = parseFloat(document.getElementById('mkFat').value) || 3.8;
  const notes = document.getElementById('mkNotes').value;

  state.milkProductions.unshift({
    id: 'mk-' + Date.now(),
    date,
    session,
    liters,
    tank,
    fat,
    notes
  });

  if (state.tanks && state.tanks[tank]) {
    state.tanks[tank].current = Math.min(state.tanks[tank].capacity, state.tanks[tank].current + liters);
  }

  saveState();
  logAudit('SÜT GİRİŞİ', `${tank} deposuna ${liters} L (${session}) sağım sütü ilave edildi.`);
  closeModal('modalMilk');
  renderMilkTable();
  renderTankIndicators();
  renderDashboard();
}

// Cari Ekleme & Düzenleme
let pendingContactCallback = null;
let editingContactId = null;

function openNewContactModal(preselectedType = 'CUSTOMER', callback = null) {
  editingContactId = null;
  pendingContactCallback = callback;
  const modal = document.getElementById('modalContact');
  if (modal) {
    const title = modal.querySelector('h3');
    if (title) title.textContent = 'Yeni Cari Hesap Kartı';
  }
  document.getElementById('ctName').value = '';
  document.getElementById('ctPhone').value = '';
  if (preselectedType) {
    document.getElementById('ctType').value = preselectedType;
  }
  openModal('modalContact');
}

function openEditContactModal(contactId) {
  const contact = state.contacts.find(c => c.id === contactId);
  if (!contact) return;
  editingContactId = contactId;
  const modal = document.getElementById('modalContact');
  if (modal) {
    const title = modal.querySelector('h3');
    if (title) title.textContent = 'Cari Hesap Bilgilerini Düzenle';
  }
  document.getElementById('ctName').value = contact.name || '';
  document.getElementById('ctPhone').value = contact.phone || '';
  document.getElementById('ctType').value = contact.type || 'CUSTOMER';
  openModal('modalContact');
}

function deleteContact(contactId) {
  const contact = state.contacts.find(c => c.id === contactId);
  if (!contact) return;
  if (!confirm(`"${contact.name}" isimli cari hesap kaydını silmek istediğinizden emin misiniz?`)) return;
  state.contacts = state.contacts.filter(c => c.id !== contactId);
  saveState();
  renderContactsPage();
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('ctName').value.trim();
  const type = document.getElementById('ctType').value;
  const phone = document.getElementById('ctPhone').value.trim();

  if (editingContactId) {
    const existing = state.contacts.find(c => c.id === editingContactId);
    if (existing) {
      existing.name = name;
      existing.type = type;
      existing.phone = phone;
    }
    editingContactId = null;
  } else {
    const newContact = {
      id: 'ct-' + Date.now(),
      name,
      type,
      phone,
      balance: 0.00
    };

    state.contacts.push(newContact);

    if (typeof pendingContactCallback === 'function') {
      const cb = pendingContactCallback;
      pendingContactCallback = null;
      cb(newContact);
    }
  }

  saveState();
  closeModal('modalContact');
  renderContactsPage();
}

// Stok Tüketimi
function openConsumeStockModal(preselectedId = null) {
  const select = document.getElementById('csItem');
  select.innerHTML = '';
  state.inventory.forEach(inv => {
    const opt = document.createElement('option');
    opt.value = inv.id;
    opt.textContent = `${inv.name} (Mevcut: ${inv.quantity} ${inv.unit})`;
    if (preselectedId === inv.id) opt.selected = true;
    select.appendChild(opt);
  });
  document.getElementById('csQuantity').value = '10';
  openModal('modalConsumeStock');
}

function handleConsumeSubmit(e) {
  e.preventDefault();
  const invId = document.getElementById('csItem').value;
  const qty = parseFloat(document.getElementById('csQuantity').value) || 0;
  const paddock = document.getElementById('csPaddock').value;

  const item = state.inventory.find(i => i.id === invId);
  if (item && qty > 0) {
    item.quantity = Math.max(0, item.quantity - qty);
    saveState();
    closeModal('modalConsumeStock');
    renderInventoryTable();
    alert(`${item.name} stoktan ${qty} ${item.unit} düşüldü (${paddock}).`);
  }
}

// =============================================================================
// YENİ ENTEGRASYONLAR: 5 KRİTİK ÇİFTLİK YÖNETİM FONKSİYONU
// =============================================================================

// -----------------------------------------------------------------------------
// A. HAYVAN DETAY DOSYASI / ÇEKMECESİ (ANIMAL DOSSIER DRAWER)
// -----------------------------------------------------------------------------
let currentDossierAnimalId = null;

function switchDossierTab(tabId) {
  document.querySelectorAll('#modalAnimalDetail .dialog-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('#modalAnimalDetail .dialog-tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

function openAnimalDetailModal(animalId) {
  const animal = state.animals.find(a => a.id === animalId);
  if (!animal) return;
  currentDossierAnimalId = animal.id;
  populateExitDropdowns();

  // Başlık & Hero Alanı
  document.getElementById('dossierModalTitle').textContent = `Hayvan Künyesi (${animal.earTag})`;
  document.getElementById('dossierTag').textContent = animal.earTag;
  document.getElementById('dossierName').textContent = animal.name ? animal.name : animal.category;
  document.getElementById('dossierStatus').textContent = animal.status || 'Aktif';
  document.getElementById('dossierPaddock').textContent = (animal.paddock || 'Genel') + ' Padoğu';

  // Sekme 1: Genel & Soyağacı
  document.getElementById('dossierBreed').textContent = animal.breed || '-';
  document.getElementById('dossierCategory').textContent = `${animal.category} / ${animal.gender}`;
  document.getElementById('dossierWeight').textContent = `${animal.weight} kg`;
  document.getElementById('dossierYield').textContent = animal.yield || '-';
  document.getElementById('dossierDam').textContent = animal.dam || 'TR1600008412';
  document.getElementById('dossierSire').textContent = animal.sire || 'Wille (Avusturya Simental)';

  // Üreme & Tohumlama Özeti
  const reproBox = document.getElementById('dossierReproductionBox');
  if (reproBox) {
    if (animal.gender === 'Dişi') {
      const insemDate = animal.inseminationDate ? formatDate(animal.inseminationDate) : '14.05.2026';
      const insemSire = animal.inseminationSire || (animal.breed === 'Holstein' ? 'Hoffman (ABD)' : 'Wille (Avusturya)');
      const pregStatus = animal.pregnancyStatus || 'Gebe (Pozitif)';
      const calvingEst = animal.calvingEstimate || '18.02.2027';
      reproBox.innerHTML = `
        ℹ️ <strong>Üreme & Tohumlama Durumu:</strong><br>
        • Son Tohumlama: <strong>${insemDate}</strong> (${insemSire})<br>
        • Gebelik Muayenesi: <strong style="color:var(--accent-success);">${pregStatus}</strong><br>
        • Tahmini Doğum: <strong>${calvingEst}</strong> (Laktasyon: ${animal.lactation || '2. Dönem'})
      `;
    } else {
      reproBox.innerHTML = `
        ℹ️ <strong>Besi & Gelişim Takibi:</strong><br>
        • Besi Grubu: <strong>${animal.paddock}</strong> (Ağır Besi Rasyonu)<br>
        • Günlük Canlı Ağırlık Artışı (ADG): <strong style="color:var(--accent-blue);">${animal.yield || '+1.45 kg/gün'}</strong><br>
        • Hedef Kesim Ağırlığı: <strong>680 kg</strong> (Tahmini Randıman: %58.5)
      `;
    }
  }

  // Sekme 2: Tartım Geçmişi Tablosu
  const weightTbody = document.getElementById('dossierWeightTbody');
  weightTbody.innerHTML = '';
  const weights = animal.weights || [];
  if (weights.length === 0) {
    weightTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:1rem;">Kayıtlı tartım geçmişi yok.</td></tr>`;
  } else {
    weights.slice().reverse().forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(w.date)}</td>
        <td style="font-weight:700;">${w.weight} kg</td>
        <td style="color:var(--accent-success); font-weight:600;">${w.adg || '-'}</td>
        <td>${w.paddock || animal.paddock}</td>
      `;
      weightTbody.appendChild(tr);
    });
  }

  // Sekme 3: Sağlık & Aşı Geçmişi Tablosu
  const healthTbody = document.getElementById('dossierHealthTbody');
  healthTbody.innerHTML = '';
  const logs = animal.healthLogs || [];
  if (logs.length === 0) {
    healthTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:1rem;">Kayıtlı aşı / sağlık müdahalesi yok.</td></tr>`;
  } else {
    logs.forEach(h => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(h.date)}</td>
        <td style="font-weight:600;">${h.procedure}</td>
        <td>${h.staff || 'Veteriner'}</td>
        <td><span class="badge positive">${h.result || 'Tamamlandı'}</span></td>
        <td>
          <button class="btn btn-sm btn-ghost" onclick="openShareVaccineModal('${animal.id}', '${h.procedure}')" title="Hekim/Sahibe Bildir" style="padding: 2px 5px; font-size: 0.72rem; color: #10B981;">📲 Bildir</button>
        </td>
      `;
      healthTbody.appendChild(tr);
    });
  }

  // Sekme 4 Formunu Sıfırla
  const exitPriceEl = document.getElementById('exitPrice');
  if (exitPriceEl) exitPriceEl.value = '';

  // Varsayılan ilk sekmeyi göster
  switchDossierTab('tab-overview');
  openModal('modalAnimalDetail');
}

function handleAddWeightSubmit(e) {
  e.preventDefault();
  if (!currentDossierAnimalId) return;
  const animal = state.animals.find(a => a.id === currentDossierAnimalId);
  if (!animal) return;

  const input = document.getElementById('newWeightVal');
  const newW = parseFloat(input.value);
  if (!newW || newW <= 0) return;

  if (!animal.weights) animal.weights = [];
  const today = new Date().toISOString().split('T')[0];

  let adg = '+1.40 kg/g';
  if (animal.weights.length > 0) {
    const last = animal.weights[animal.weights.length - 1];
    const diff = newW - last.weight;
    adg = (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' kg';
  }

  animal.weights.push({
    date: today,
    weight: newW,
    adg,
    paddock: animal.paddock
  });
  animal.weight = newW;
  input.value = '';

  saveState();
  openAnimalDetailModal(animal.id);
  renderAnimalsTable();
  renderDashboard();
}

function handleAddHealthSubmit(e) {
  e.preventDefault();
  if (!currentDossierAnimalId) return;
  const animal = state.animals.find(a => a.id === currentDossierAnimalId);
  if (!animal) return;

  const proc = document.getElementById('newHealthProcedure').value.trim();
  const staff = document.getElementById('newHealthStaff').value.trim() || 'Vet. Dr. Nilüfer';
  if (!proc) return;

  if (!animal.healthLogs) animal.healthLogs = [];
  const today = new Date().toISOString().split('T')[0];

  animal.healthLogs.unshift({
    date: today,
    procedure: proc,
    staff,
    result: 'Uygulandı'
  });

  document.getElementById('newHealthProcedure').value = '';
  saveState();
  openAnimalDetailModal(animal.id);
}

function populateExitDropdowns() {
  const contactSelect = document.getElementById('exitContactId');
  const accountSelect = document.getElementById('exitAccountId');
  if (contactSelect) {
    const customers = (state.contacts || []).filter(c => c.type === 'CUSTOMER');
    const list = customers.length > 0 ? customers : (state.contacts || []);
    contactSelect.innerHTML = list.map(c => `<option value="${c.id}">${c.name} (${c.phone || 'Tel yok'})</option>`).join('');
  }
  if (accountSelect) {
    accountSelect.innerHTML = (state.accounts || []).map(a => `<option value="${a.id}">${a.name} (Bakiye: ₺${(a.balance || 0).toLocaleString('tr-TR')})</option>`).join('');
  }
}

function toggleExitFinanceFields() {
  const reason = document.getElementById('exitReason')?.value;
  const financeRow = document.getElementById('exitFinanceRow');
  const priceInput = document.getElementById('exitPrice');
  if (financeRow) {
    financeRow.style.display = (reason === 'DECEASED') ? 'none' : 'flex';
  }
  if (priceInput && reason === 'DECEASED') {
    priceInput.value = '0';
  }
}

function handleAnimalExitSubmit(e) {
  e.preventDefault();
  if (!currentDossierAnimalId) return;
  const animal = state.animals.find(a => a.id === currentDossierAnimalId);
  if (!animal) return;

  const reason = document.getElementById('exitReason').value;
  const price = parseFloat(document.getElementById('exitPrice').value) || 0;
  const contactId = document.getElementById('exitContactId')?.value || 'ct-2';
  const accountId = document.getElementById('exitAccountId')?.value || 'acc-1';

  const reasonMap = {
    SOLD: 'Canlı Hayvan Satışı',
    SLAUGHTERED: 'Kesimhane Sevk',
    DECEASED: 'Zayiat / Ölüm'
  };
  const reasonText = reasonMap[reason] || reason;

  if (!confirm(`${animal.earTag} (${animal.name || animal.breed}) için sürüden çıkış işlemi onaylansın mı? (${reasonText})`)) {
    return;
  }

  if (price > 0 && (reason === 'SOLD' || reason === 'SLAUGHTERED')) {
    state.transactions.unshift({
      id: 'tx-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'INCOME',
      category: reason === 'SLAUGHTERED' ? 'Kesimhane / Karkas Satışı' : 'Besi Hayvanı Satışı',
      amount: price,
      paidAmount: price,
      status: 'PAID',
      contactId: contactId,
      accountId: accountId,
      desc: `${animal.earTag} - ${animal.name || ''} (${animal.breed}) ${reasonText}`
    });
    const acc = state.accounts.find(a => a.id === accountId);
    if (acc) acc.balance += price;

    // Cari alacak / bakiye
    const ct = state.contacts.find(c => c.id === contactId);
    if (ct) {
      ct.balance = (ct.balance || 0) + price;
    }
  }

  // PRD 5.6: Kalıcı silme yerine arşivle (Geçmiş ve soyağacı korunur)
  animal.status = reason === 'SOLD' ? 'Satıldı' : (reason === 'SLAUGHTERED' ? 'Kesildi' : 'Zayiat');
  animal.exitDate = new Date().toISOString().split('T')[0];
  animal.exitReason = reasonText;
  animal.exitPrice = price;

  // Supabase senkronizasyonu
  if (typeof dbService !== 'undefined' && dbService.upsertCattle) {
    dbService.upsertCattle(animal);
  }

  saveState();
  logAudit('SÜRÜDEN ÇIKIŞ', `${animal.earTag} (${animal.name || animal.breed}) sürüden çıkarıldı. Neden: ${reasonText}${price > 0 ? `, Bedel: ₺${price.toLocaleString('tr-TR')}` : ''}`);
  closeModal('modalAnimalDetail');
  renderAnimalsTable();
  renderDashboard();
  renderTransactionsTable();
  renderAccountsPage();
  alert(`${animal.earTag} çıkış işlemi tamamlandı. Durum: ${animal.status} olarak arşivlendi.`);
}


// -----------------------------------------------------------------------------
// B. KISMİ ÖDEME & TAHSİLAT KAPATMA (PARTIAL PAYMENT / SETTLEMENT)
// -----------------------------------------------------------------------------
function openSettlePaymentModal(txId) {
  const tx = state.transactions.find(t => t.id === txId);
  if (!tx) return;

  const paid = tx.paidAmount || (tx.status === 'PAID' ? tx.amount : 0);
  const remaining = Math.max(0, tx.amount - paid);

  document.getElementById('settleTxId').value = tx.id;
  document.getElementById('settleContactId').value = tx.contactId || '';
  document.getElementById('settleTotalAmount').textContent = formatCurrency(tx.amount);
  document.getElementById('settlePaidAmount').textContent = formatCurrency(paid);
  document.getElementById('settleRemainingAmount').textContent = formatCurrency(remaining);

  const titleEl = document.getElementById('settleModalTitle');
  const btnEl = document.getElementById('settleSubmitBtn');
  if (tx.type === 'INCOME') {
    titleEl.textContent = `Alacak Tahsilatı Yap (${tx.category})`;
    btnEl.textContent = 'Tahsilatı Onayla ve Kasaya İşle';
    btnEl.className = 'btn btn-primary';
  } else {
    titleEl.textContent = `Borç / Fatura Ödemesi Yap (${tx.category})`;
    btnEl.textContent = 'Ödemeyi Onayla ve Bakiyeden Düş';
    btnEl.className = 'btn btn-burgundy';
  }

  const payInput = document.getElementById('settlePayAmount');
  payInput.value = remaining.toFixed(2);
  payInput.max = remaining;

  document.getElementById('settleDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('settleNote').value = '';

  // Hesap Seçenekleri
  populateAccountDropdowns();
  if (state.accounts && state.accounts.length > 0) {
    document.getElementById('settleAccount').value = state.accounts[0].id;
  }

  openModal('modalSettlePayment');
}

function handleSettleSubmit(e) {
  e.preventDefault();
  const txId = document.getElementById('settleTxId').value;
  const payAmount = parseFloat(document.getElementById('settlePayAmount').value) || 0;
  const payDate = document.getElementById('settleDate').value;
  const accId = document.getElementById('settleAccount').value;
  const note = document.getElementById('settleNote').value.trim();

  const tx = state.transactions.find(t => t.id === txId);
  if (!tx || payAmount <= 0) return;

  const currentPaid = tx.paidAmount || (tx.status === 'PAID' ? tx.amount : 0);
  const newPaid = currentPaid + payAmount;
  tx.paidAmount = Math.min(tx.amount, newPaid);

  if (tx.paidAmount >= tx.amount - 0.01) {
    tx.status = 'PAID';
    tx.paidAmount = tx.amount;
  } else {
    tx.status = 'PARTIAL';
  }

  // Hesap Bakiyesini Güncelle
  const acc = state.accounts.find(a => a.id === accId);
  if (acc) {
    if (tx.type === 'INCOME') {
      acc.balance += payAmount;
    } else {
      acc.balance -= payAmount;
    }
  }

  // Cari Bakiyesini Güncelle
  if (tx.contactId) {
    const contact = state.contacts.find(c => c.id === tx.contactId);
    if (contact) {
      if (tx.type === 'INCOME') {
        contact.balance = Math.max(0, contact.balance - payAmount);
      } else {
        // Tedarikçi borcu negatiftir: -24800 + 10000 = -14800
        contact.balance += payAmount;
      }
    }
  }

  if (note) {
    tx.desc += ` [${formatDate(payDate)}: ${formatCurrency(payAmount)} ödendi - ${note}]`;
  }

  saveState();
  closeModal('modalSettlePayment');
  renderTransactionsTable();
  renderDashboard();
  renderAccountsPage();
  renderContactsPage();
  alert(`İşlem başarıyla kaydedildi! Kalan bakiye: ${formatCurrency(tx.amount - tx.paidAmount)}`);
}


// -----------------------------------------------------------------------------
// C. DEPOYA YENİ STOK GİRİŞİ MODALI (STOCK ENTRY)
// -----------------------------------------------------------------------------
function openNewStockModal(preselectedId = null) {
  openStockEntryModal(preselectedId);
}

function openStockEntryModal(preselectedId = null) {
  const itemSelect = document.getElementById('stkItemSelect');
  itemSelect.innerHTML = '';

  state.inventory.forEach(i => {
    const opt = document.createElement('option');
    opt.value = i.id;
    opt.textContent = `${i.name} (${i.unit}) - Mevcut: ${i.quantity}`;
    if (preselectedId === i.id) opt.selected = true;
    itemSelect.appendChild(opt);
  });

  const newOpt = document.createElement('option');
  newOpt.value = '__NEW__';
  newOpt.textContent = '✨ + Yeni Ürün / Yem / İlaç Tanımla...';
  itemSelect.appendChild(newOpt);

  // Tedarikçiler
  const suppSelect = document.getElementById('stkSupplier');
  suppSelect.innerHTML = '';
  state.contacts.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.type === 'SUPPLIER' ? 'Tedarikçi' : 'Müşteri'})`;
    suppSelect.appendChild(opt);
  });

  document.getElementById('stkQuantity').value = '10';
  populateStockCategoryDropdown();
  handleStockItemChange(itemSelect.value);
  openModal('modalStockEntry');
}

function handleStockItemChange(val) {
  const newFields = document.getElementById('stkNewItemFields');
  if (val === '__NEW__') {
    newFields.style.display = 'block';
    document.getElementById('stkUnitCost').value = '100';
  } else {
    newFields.style.display = 'none';
    const item = state.inventory.find(i => i.id === val);
    if (item) {
      document.getElementById('stkUnitCost').value = item.unitCost;
    }
  }
  calculateStockCost();
}

function calculateStockCost() {
  const qty = parseFloat(document.getElementById('stkQuantity').value) || 0;
  const cost = parseFloat(document.getElementById('stkUnitCost').value) || 0;
  document.getElementById('stkTotalCost').value = formatCurrency(qty * cost);
}

function handleStockEntrySubmit(e) {
  e.preventDefault();
  const itemVal = document.getElementById('stkItemSelect').value;
  const qty = parseFloat(document.getElementById('stkQuantity').value) || 0;
  const unitCost = parseFloat(document.getElementById('stkUnitCost').value) || 0;
  const suppId = document.getElementById('stkSupplier').value;
  const createExp = document.getElementById('stkCreateExpense').checked;

  if (qty <= 0) return;

  let targetItem = null;
  if (itemVal === '__NEW__') {
    const name = document.getElementById('stkNewName').value.trim();
    const category = document.getElementById('stkNewCategory').value;
    const unit = document.getElementById('stkNewUnit').value;
    const minAlert = parseFloat(document.getElementById('stkNewMinAlert').value) || 20;

    if (!name) {
      alert('Lütfen yeni ürünün adını giriniz.');
      return;
    }

    targetItem = {
      id: 'inv-' + Date.now(),
      name,
      category,
      quantity: qty,
      unit,
      minAlert,
      unitCost
    };
    state.inventory.push(targetItem);
  } else {
    targetItem = state.inventory.find(i => i.id === itemVal);
    if (!targetItem) return;
    targetItem.quantity += qty;
    targetItem.unitCost = unitCost;
  }

  const totalCost = qty * unitCost;

  if (createExp && totalCost > 0) {
    state.transactions.unshift({
      id: 'tx-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'EXPENSE',
      category: targetItem.category === 'İlaç/Aşı' ? 'Veteriner & İlaç' : 'Yem & Kaba Yem',
      amount: totalCost,
      paidAmount: totalCost,
      status: 'PAID',
      contactId: suppId || 'ct-3',
      accountId: 'acc-1',
      desc: `${targetItem.name} stok girişi (${qty} ${targetItem.unit})`
    });

    const acc = state.accounts.find(a => a.id === 'acc-1');
    if (acc) acc.balance -= totalCost;
  }

  saveState();
  closeModal('modalStockEntry');
  renderInventoryTable();
  renderDashboard();
  renderTransactionsTable();
  alert(`${targetItem.name} için ${qty} ${targetItem.unit} girişi depoya işlendi.`);
}


// -----------------------------------------------------------------------------
// D. MANDIRAYA SÜT TESLİMATI (SATIŞA DÖNÜŞTÜRME - MILK SHIPMENT)
// -----------------------------------------------------------------------------
function openMilkShipmentModal(preselectedTank = 'Tank 1') {
  const tankSelect = document.getElementById('shpTank');
  tankSelect.innerHTML = '';

  const tankKeys = Object.keys(state.tanks || {});
  tankKeys.forEach(k => {
    const t = state.tanks[k];
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = `${t.name || k} (Mevcut: ${t.current.toLocaleString('tr-TR')} L / ${t.capacity.toLocaleString('tr-TR')} L)`;
    if (k === preselectedTank) opt.selected = true;
    tankSelect.appendChild(opt);
  });

  // Müşteriler (Mandıralar)
  const custSelect = document.getElementById('shpCustomer');
  custSelect.innerHTML = '';
  state.contacts.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.type === 'CUSTOMER' ? 'Müşteri' : 'Tedarikçi'})`;
    custSelect.appendChild(opt);
  });

  handleShipmentTankChange(tankSelect.value || preselectedTank);
  openModal('modalMilkShipment');
}

function handleShipmentTankChange(tankKey) {
  const tank = state.tanks ? state.tanks[tankKey] : null;
  const currentLiters = tank ? tank.current : 1000;

  const litersInput = document.getElementById('shpLiters');
  litersInput.max = currentLiters;
  litersInput.value = Math.min(currentLiters, 1800);

  calculateShipmentTotal();
}

function calculateShipmentTotal() {
  const liters = parseFloat(document.getElementById('shpLiters').value) || 0;
  const unitPrice = parseFloat(document.getElementById('shpUnitPrice').value) || 0;
  const total = liters * unitPrice;
  document.getElementById('shpTotalAmount').value = formatCurrency(total);
}

function handleMilkShipmentSubmit(e) {
  e.preventDefault();
  const tankKey = document.getElementById('shpTank').value;
  const liters = parseFloat(document.getElementById('shpLiters').value) || 0;
  const customerId = document.getElementById('shpCustomer').value;
  const unitPrice = parseFloat(document.getElementById('shpUnitPrice').value) || 18.50;
  const status = document.getElementById('shpStatus').value; // PENDING veya PAID

  const tank = state.tanks ? state.tanks[tankKey] : null;
  if (!tank) return;

  if (liters <= 0) {
    alert('Lütfen geçerli bir teslimat litresi giriniz.');
    return;
  }

  if (liters > tank.current) {
    alert(`Seçilen tankta yalnızca ${tank.current} Litre süt bulunmaktadır.`);
    return;
  }

  // Tanktan sütü düş
  tank.current = Math.max(0, tank.current - liters);

  const totalAmount = liters * unitPrice;
  const customer = state.contacts.find(c => c.id === customerId);

  // Otomatik Gelir Kaydı Oluştur
  const newTx = {
    id: 'tx-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    type: 'INCOME',
    category: 'Süt Satışı',
    amount: totalAmount,
    paidAmount: status === 'PAID' ? totalAmount : 0,
    status: status === 'PAID' ? 'PAID' : 'PENDING',
    contactId: customerId,
    accountId: status === 'PAID' ? 'acc-1' : null,
    desc: `${tankKey} deposundan ${liters.toLocaleString('tr-TR')} Litre süt teslimatı ve satışı (${unitPrice.toFixed(2)} ₺/L)`
  };
  state.transactions.unshift(newTx);

  if (status === 'PAID') {
    const acc = state.accounts.find(a => a.id === 'acc-1');
    if (acc) acc.balance += totalAmount;
  } else {
    if (customer) {
      customer.balance += totalAmount;
    }
  }

  saveState();
  closeModal('modalMilkShipment');
  renderMilkTable();
  renderTankIndicators();
  renderDashboard();
  renderTransactionsTable();
  renderContactsPage();
  renderAccountsPage();

  alert(`🚚 ${liters.toLocaleString('tr-TR')} Litre süt ${customer ? customer.name : 'mandıraya'} teslim edildi.\n${formatCurrency(totalAmount)} tutarında satış faturası kesildi.`);
}

function renderTankIndicators() {
  const container = document.getElementById('tankGridContainer');
  if (!container || !state.tanks) return;

  container.innerHTML = '';
  Object.keys(state.tanks).forEach(key => {
    const t = state.tanks[key];
    const pct = Math.min(100, Math.round((t.current / t.capacity) * 100));
    const card = document.createElement('div');
    card.className = 'tank-card';
    card.innerHTML = `
      <div class="tank-header">
        <span class="tank-name">${t.name || key}</span>
        <span class="badge ${pct > 80 ? 'warning' : 'positive'}">${pct > 80 ? 'Dolmak Üzere' : 'Aktif Soğutma'}</span>
      </div>
      <div class="tank-gauge-wrapper">
        <div class="tank-progress-bar">
          <div class="tank-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="tank-meta">
          <span class="tank-val">${t.current.toLocaleString('tr-TR')} L / ${t.capacity.toLocaleString('tr-TR')} L Kapasite</span>
          <span class="tank-percent" style="font-weight:700;">%${pct} Dolu</span>
        </div>
      </div>
      <div class="tank-details" style="align-items: center; margin-top: 0.5rem;">
        <div>
          <span>Sıcaklık: <strong>${t.temp} °C</strong></span>
          <span style="margin-left: 8px;">Yağ: <strong>%3.88</strong></span>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="openMilkShipmentModal('${key}')" style="padding: 3px 8px; font-size: 0.72rem;">
          🚚 Süt Satışı Yap
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}


// -----------------------------------------------------------------------------
// E. ÇİFTLİK AYARLARI VE JSON VERİ YEDEKLEME / GERİ YÜKLEME
// -----------------------------------------------------------------------------
function openSettingsModal() {
  navigateToPage('settings');
}

function renderSettingsPage() {
  if (state.farm) {
    const fn = document.getElementById('setFarmName');
    const on = document.getElementById('setOwnerName');
    const loc = document.getElementById('setLocation');
    const cur = document.getElementById('setCurrency');
    const tax = document.getElementById('setTaxId');
    const ph = document.getElementById('setPhone');
    const em = document.getElementById('setEmail');
    if (fn) fn.value = state.farm.name || 'Özate Büyükbaş Hayvancılık & Süt Çiftliği';
    if (on) on.value = state.farm.owner || 'Özate Ailesi';
    if (loc) loc.value = state.farm.location || 'Bursa, Türkiye';
    if (cur) cur.value = state.farm.currency || 'TRY';
    if (tax) tax.value = state.farm.taxId || '';
    if (ph) ph.value = state.farm.phone || '';
    if (em) em.value = state.farm.email || '';
  }

  // Supabase Ayarları Arayüzü
  if (typeof initSupabaseSettingsUI === 'function') {
    initSupabaseSettingsUI();
  }

  // Menü ve Modül Görünürlüğü Arayüzü
  renderMenuVisibilityPanel();
}

function renderSecurityPage() {
  // Canlı sayaçlar
  const statAnimals = document.getElementById('settingsStatAnimals');
  if (statAnimals) statAnimals.textContent = `${state.animals ? state.animals.length : 0} Baş`;

  const statTx = document.getElementById('settingsStatTx');
  if (statTx) statTx.textContent = `${state.transactions ? state.transactions.length : 0} Kayıt`;

  const statMilk = document.getElementById('settingsStatMilk');
  if (statMilk) statMilk.textContent = `${state.milkProductions ? state.milkProductions.length : 0} Kayıt`;

  const statContacts = document.getElementById('settingsStatContacts');
  if (statContacts) statContacts.textContent = `${state.contacts ? state.contacts.length : 0} Cari`;

  // Sistem Denetim & Güvenlik Günlüğünü Listele
  renderAuditLogs();
}

function logAudit(type, details, user = null) {
  if (!state.auditLogs) state.auditLogs = [];
  const currentUser = user || (state.currentUser ? state.currentUser.name : 'Ahmet Özate');
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  state.auditLogs.unshift({
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp,
    type,
    user: currentUser,
    details
  });

  if (state.auditLogs.length > 200) state.auditLogs.pop();
  saveState();
  renderAuditLogs();
}

function renderAuditLogs() {
  const tbody = document.getElementById('settingsAuditLogTbody');
  if (!tbody) return;
  if (!state.auditLogs || state.auditLogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Kayıtlı denetim veya işlem günlüğü bulunmuyor.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.auditLogs.map(log => `
    <tr>
      <td style="color: var(--text-muted); font-family: monospace; font-size: 0.75rem;">${log.timestamp}</td>
      <td><span class="badge" style="background: rgba(59, 130, 246, 0.15); color: var(--brand-primary); border: 1px solid rgba(59, 130, 246, 0.3); font-size: 0.7rem; font-weight: 700;">${log.type}</span></td>
      <td style="font-weight: 600;">${log.user}</td>
      <td style="color: var(--text-primary);">${log.details}</td>
    </tr>
  `).join('');
}

function clearAuditLogs() {
  if (confirm('Sistem denetim ve işlem günlüğünü temizlemek istediğinizden emin misiniz?')) {
    state.auditLogs = [];
    saveState();
    renderAuditLogs();
    alert('İşlem günlüğü temizlendi.');
  }
}

function handleSaveSettings(e) {
  if (e) e.preventDefault();
  if (!state.farm) state.farm = {};
  const fn = document.getElementById('setFarmName');
  const on = document.getElementById('setOwnerName');
  const loc = document.getElementById('setLocation');
  const cur = document.getElementById('setCurrency');
  const tax = document.getElementById('setTaxId');
  const ph = document.getElementById('setPhone');
  const em = document.getElementById('setEmail');

  if (fn) state.farm.name = fn.value.trim();
  if (on) state.farm.owner = on.value.trim();
  if (loc) state.farm.location = loc.value.trim();
  if (cur) state.farm.currency = cur.value;
  if (tax) state.farm.taxId = tax.value.trim();
  if (ph) state.farm.phone = ph.value.trim();
  if (em) state.farm.email = em.value.trim();

  saveState();
  logAudit('SİSTEM AYARLARI', 'Çiftlik işletme unvan ve parametre ayarları güncellendi.');
  alert('Çiftlik işletme ayarları başarıyla kaydedildi.');
}

// =============================================================================
// SUPABASE BULUT AYARLARI VE KULLANICI ETKİLEŞİMİ
// =============================================================================

function initSupabaseSettingsUI() {
  if (typeof getSupabaseConfig !== 'function') return;
  const cfg = getSupabaseConfig();
  const urlEl = document.getElementById('inputSupabaseUrl');
  const keyEl = document.getElementById('inputSupabaseKey');
  const enEl = document.getElementById('inputSupabaseEnabled');
  const statusEl = document.getElementById('supabaseSettingsStatus');

  if (urlEl) urlEl.value = cfg.url || '';
  if (keyEl) keyEl.value = cfg.key || '';
  if (enEl) enEl.value = cfg.enabled ? 'true' : 'false';

  if (statusEl) {
    if (cfg.enabled && cfg.url) {
      statusEl.className = 'badge positive';
      statusEl.textContent = '🟢 Aktif Yapılandırıldı';
    } else {
      statusEl.className = 'badge warning';
      statusEl.textContent = '🟡 Yerel Mod (Offline)';
    }
  }
}

async function handleSaveSupabaseConfig(e) {
  if (e) e.preventDefault();
  const urlEl = document.getElementById('inputSupabaseUrl');
  const keyEl = document.getElementById('inputSupabaseKey');
  const enEl = document.getElementById('inputSupabaseEnabled');

  const url = urlEl ? urlEl.value.trim() : '';
  const key = keyEl ? keyEl.value.trim() : '';
  const enabled = enEl ? enEl.value === 'true' : false;

  if (enabled && (!url || !key)) {
    alert('Bulut senkronizasyonunu aktif etmek için lütfen URL ve Anon Key alanlarını doldurunuz.');
    return;
  }

  saveSupabaseConfig(url, key, enabled);
  initSupabaseSettingsUI();
  showToastNotification('Supabase bulut veritabanı ayarları kaydedildi.');

  if (enabled) {
    const res = await testSupabaseConnection(url, key);
    if (res.success) {
      showToastNotification('✅ ' + res.message);
      if (confirm('Supabase bağlantısı doğrulandı. Bulut veritabanındaki verileri şimdi yüklemek ister misiniz?')) {
        await handleFetchFromSupabase();
      }
    } else {
      alert('⚠️ ' + res.message);
    }
  }
}

async function handleTestSupabaseConnection() {
  const urlEl = document.getElementById('inputSupabaseUrl');
  const keyEl = document.getElementById('inputSupabaseKey');
  const url = urlEl ? urlEl.value.trim() : '';
  const key = keyEl ? keyEl.value.trim() : '';

  showToastNotification('🔌 Supabase bağlantısı test ediliyor...');
  const res = await testSupabaseConnection(url, key);
  if (res.success) {
    alert('✅ BAĞLANTI BAŞARILI!\n\n' + res.message + (res.farmName ? `\nİşletme: ${res.farmName}` : ''));
  } else {
    alert('❌ BAĞLANTI BAŞARISIZ:\n\n' + res.message);
  }
}

async function handleFetchFromSupabase() {
  showToastNotification('🔄 Bulut verileri çekiliyor...');
  const cloudState = await fetchCompleteFarmFromSupabase();
  if (cloudState) {
    state = cloudState;
    saveState();
    const cur = window.location.hash.replace('#', '') || 'dashboard';
    navigateToPage(cur);
    syncAllDropdowns();
    showToastNotification('✅ Tüm çiftlik verileri Supabase bulut veritabanından güncellendi.');
  } else {
    alert('Bulut verileri çekilemedi. Bağlantı ayarlarınızı veya internetinizi kontrol ediniz.');
  }
}

async function handlePushToSupabase() {
  if (!confirm('Mevcut tüm çiftlik verileriniz (hayvanlar, süt verileri, stoklar, cariler vb.) Supabase bulut veritabanına aktarılacak.\n\nDevam etmek istiyor musunuz?')) {
    return;
  }
  showToastNotification('🚀 Veriler buluta aktarılıyor...');
  try {
    const res = await pushCompleteFarmToSupabase(state);
    showToastNotification('✅ ' + res.message);
    alert('✅ TEBRİKLER!\n' + res.message);
  } catch (err) {
    alert('❌ Senkronizasyon Hatası:\n' + err.message);
  }
}

function exportDataBackupJson() {
  const exportPayload = {
    meta: {
      application: 'Özate Çiftliği Yönetim Sistemi',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      counts: {
        animals: state.animals.length,
        transactions: state.transactions.length,
        milkRecords: state.milkProductions.length,
        inventoryItems: state.inventory.length
      }
    },
    state: state
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `ozate_ciftlik_yedek_${dateStr}.json`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importDataBackupJson(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      const incomingState = parsed.state ? parsed.state : parsed;

      if (!incomingState.animals || !incomingState.transactions) {
        alert('Hata: Geçersiz yedek dosyası formatı. animals veya transactions alanı bulunamadı.');
        return;
      }

      if (confirm(`Yedek dosyasında ${incomingState.animals.length} adet hayvan ve ${incomingState.transactions.length} adet finans kaydı bulundu. Mevcut sistem verileri bu yedekle güncellensin mi?`)) {
        state = incomingState;
        if (!state.tanks) state.tanks = JSON.parse(JSON.stringify(DEFAULT_STATE.tanks));
        saveState();
        closeModal('modalSettings');
        renderDashboard();
        renderAnimalsTable();
        renderTransactionsTable();
        renderMilkTable();
        renderInventoryTable();
        renderAccountsPage();
        renderContactsPage();
        alert('✅ Yedek başarıyla geri yüklendi! Tüm çiftlik verileriniz güncellendi.');
      }
    } catch (err) {
      alert('Yedek dosyası okunurken hata oluştu: ' + err.message);
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function resetToDefaultData() {
  if (confirm('⚠️ DİKKAT: Tüm mevcut veriler silinecek ve sistem fabrika ayarlarına döndürülecektir. Emin misiniz?')) {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
    closeModal('modalSettings');
    renderDashboard();
    renderAnimalsTable();
    renderTransactionsTable();
    renderMilkTable();
    renderInventoryTable();
    renderAccountsPage();
    renderContactsPage();
    alert('Sistem başlangıç verileriyle başarıyla sıfırlandı.');
  }
}

// -----------------------------------------------------------------------------
// F. BARKOD / RFID KÜPE TARAYICI (BARCODE / RFID SCANNER)
// -----------------------------------------------------------------------------
function openQrScannerModal() {
  const manualInput = document.getElementById('scannerManualInput');
  if (manualInput) manualInput.value = '';

  const chipsContainer = document.getElementById('scannerQuickChips');
  if (chipsContainer) {
    chipsContainer.innerHTML = '';
    state.animals.slice(0, 6).forEach(a => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scanner-chip-btn';
      btn.textContent = `${a.earTag} (${a.name || a.category})`;
      btn.onclick = () => handleScanSuccess(a.earTag);
      chipsContainer.appendChild(btn);
    });
  }

  openModal('modalQrScanner');
}

function handleScanSuccess(earTag) {
  if (!earTag) return;
  const tag = earTag.trim().toUpperCase();
  const animal = state.animals.find(a => a.earTag.toUpperCase() === tag || (a.name && a.name.toUpperCase() === tag));
  
  if (animal) {
    closeModal('modalQrScanner');
    navigateToPage('animals');
    openAnimalDetailModal(animal.id);
  } else {
    alert(`"${earTag}" küpe numarasına sahip hayvan kaydı bulunamadı.`);
  }
}

// -----------------------------------------------------------------------------
// G. WHATSAPP & SMS BİLDİRİM / PAYLAŞIM MERKEZİ (NOTIFICATIONS)
// -----------------------------------------------------------------------------
let currentShareData = {
  title: '',
  sub: '',
  recipientPhone: '05331112233',
  recipientName: 'Vet. Dr. Nilüfer Kliniği'
};

function openShareModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  currentShareData.title = task.title;
  currentShareData.sub = task.sub;

  const defaultRecipient = '05331112233|Vet. Dr. Nilüfer Kliniği';
  const recSelect = document.getElementById('shareRecipientSelect');
  if (recSelect) recSelect.value = defaultRecipient;

  updateShareMessageText('05331112233', 'Vet. Dr. Nilüfer Kliniği');
  openModal('modalNotificationShare');
}

function openShareVaccineModal(animalId, procedure) {
  const animal = state.animals.find(a => a.id === animalId);
  const animalName = animal ? `${animal.name || ''} (${animal.earTag})` : 'Büyükbaş Hayvan';
  currentShareData.title = `${animalName} için ${procedure} İşlemi`;
  currentShareData.sub = `Padok: ${animal ? animal.paddock : '-'}. Rutin aşı ve sağlık kontrolü zamanı gelmiştir.`;

  const defaultRecipient = '05331112233|Vet. Dr. Nilüfer Kliniği';
  const recSelect = document.getElementById('shareRecipientSelect');
  if (recSelect) recSelect.value = defaultRecipient;

  updateShareMessageText('05331112233', 'Vet. Dr. Nilüfer Kliniği');
  openModal('modalNotificationShare');
}

function handleRecipientChange(val) {
  const parts = val.split('|');
  const phone = parts[0];
  const name = parts[1] || '';
  updateShareMessageText(phone, name);
}

function updateShareMessageText(phone, recipientName) {
  currentShareData.recipientPhone = phone;
  currentShareData.recipientName = recipientName;

  const farmName = (state.farm && state.farm.name) ? state.farm.name : 'Özate Çiftliği';
  const text = `📢 *${farmName} - Görev & Aşı Bildirimi*\n` +
    `👤 *Sayın:* ${recipientName}\n` +
    `📌 *Konu:* ${currentShareData.title}\n` +
    `📝 *Detay:* ${currentShareData.sub}\n` +
    `📅 *Tarih:* ${formatDate(new Date().toISOString().split('T')[0])}\n` +
    `⚠️ Bilgilerinize sunar, hayırlı çalışmalar dileriz.`;

  const msgEl = document.getElementById('shareMessageText');
  if (msgEl) msgEl.value = text;
}

function sendViaWhatsApp() {
  const text = document.getElementById('shareMessageText').value;
  const phone = currentShareData.recipientPhone.replace(/[^0-9]/g, '');
  const cleanPhone = phone.startsWith('0') ? '90' + phone.substring(1) : (phone.startsWith('90') ? phone : '90' + phone);
  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function sendViaSms() {
  const text = document.getElementById('shareMessageText').value;
  const phone = currentShareData.recipientPhone;
  const url = `sms:${phone}?body=${encodeURIComponent(text)}`;
  window.location.href = url;
}

function copyShareText() {
  const text = document.getElementById('shareMessageText').value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert('📋 Mesaj metni panoya kopyalandı! WhatsApp veya SMS ile yapıştırabilirsiniz.');
    });
  } else {
    alert('Mesaj panoya kopyalandı.');
  }
}

// -----------------------------------------------------------------------------
// H. KULLANICI ROLÜ & YETKİLENDİRME (RBAC - ROLE-BASED ACCESS CONTROL)
// -----------------------------------------------------------------------------
let currentRole = localStorage.getItem('ozate_user_role') || 'ADMIN';

function setUserRole(role) {
  currentRole = role;
  localStorage.setItem('ozate_user_role', role);
  applyRolePermissions();
  
  const roleNames = {
    ADMIN: '👑 Çiftlik Yöneticisi',
    VET: '🩺 Veteriner Hekim',
    WORKER: '👨‍🌾 Bakıcı / Personel'
  };
  // Rol değişikliği sessizce uygulanır — alert gösterilmez
}

function applyRolePermissions() {
  const roleSelect = document.getElementById('userRoleSelect');
  if (roleSelect) roleSelect.value = currentRole;

  const txNav = document.querySelector('.nav-link[data-page="transactions"]');
  const accNav = document.querySelector('.nav-link[data-page="accounts"]');
  const checksNav = document.querySelector('.nav-link[data-page="checks"]');
  const repNav = document.querySelector('.nav-link[data-page="reports"]');
  const usersNav = document.querySelector('.nav-link[data-page="users"]');
  const defsNav = document.querySelector('.nav-link[data-page="definitions"]');
  const settingsNav = document.getElementById('nav-settings');
  const securityNav = document.querySelector('.nav-link[data-page="security"]');
  const openSettingsBtn = document.getElementById('openSettingsBtn');

  // Önce tüm kısıtlamaları sıfırla (ADMIN varsayılan)
  const allNavs = [txNav, accNav, checksNav, repNav, usersNav, defsNav, settingsNav, securityNav];
  allNavs.forEach(el => {
    if (el) { el.style.opacity = '1'; el.style.display = 'flex'; }
  });
  if (openSettingsBtn) openSettingsBtn.style.display = '';

  if (currentRole === 'WORKER') {
    if (txNav) txNav.style.opacity = '0.45';
    if (accNav) accNav.style.opacity = '0.45';
    if (checksNav) checksNav.style.display = 'none';
    if (repNav) repNav.style.display = 'none';
    if (usersNav) usersNav.style.display = 'none';
    if (defsNav) defsNav.style.display = 'none';
    if (settingsNav) settingsNav.style.display = 'none';
    if (securityNav) securityNav.style.display = 'none';
    if (openSettingsBtn) openSettingsBtn.style.display = 'none';
  } else if (currentRole === 'VET') {
    if (txNav) txNav.style.opacity = '0.7';
    if (accNav) accNav.style.display = 'none';
    if (checksNav) checksNav.style.display = 'none';
    if (repNav) repNav.style.display = 'none';
    if (usersNav) usersNav.style.display = 'none';
    if (defsNav) defsNav.style.display = 'none';
    if (settingsNav) settingsNav.style.display = 'none';
    if (securityNav) securityNav.style.display = 'none';
    if (openSettingsBtn) openSettingsBtn.style.display = 'none';
  }
  // ADMIN: tüm menüler zaten sıfırlandı, hepsi görünür
}

// -----------------------------------------------------------------------------
// I. OTURUM VE ÇIKIŞ YÖNETİMİ (SESSION & LOGOUT)
// -----------------------------------------------------------------------------
function checkUserSession() {
  const sessionStr = localStorage.getItem('ozate_session');
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      const nameEl = document.getElementById('headerUserName');
      const avatarEl = document.getElementById('headerUserAvatar');
      const roleSelect = document.getElementById('userRoleSelect');
      if (nameEl && session.name) nameEl.textContent = session.name;
      if (avatarEl) {
        avatarEl.textContent = session.role === 'VET' ? '🩺' : (session.role === 'WORKER' ? '👨‍🌾' : '👑');
      }
      if (roleSelect && session.role) {
        roleSelect.value = session.role;
        setUserRole(session.role);
      }
    } catch(e) {}
  }
}

// =============================================================================
// EKRANA SIĞDIR (FIT TO SCREEN / FULLSCREEN) YÖNETİMİ
// =============================================================================

function toggleFitToScreen() {
  const isFullScreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  const isFitClass = document.body.classList.contains('fit-to-screen');

  if (!isFullScreen && !isFitClass) {
    // Ekrana sığdırma ve tam ekran moduna geç
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
    document.body.classList.add('fit-to-screen');
    localStorage.setItem('ozate_fit_screen', 'true');
    updateFitScreenUI(true);
    showToastNotification('Ekrana sığdırma (tam ekran) modu aktif edildi.');
  } else {
    // Normal ekrana geri dön
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    document.body.classList.remove('fit-to-screen');
    localStorage.setItem('ozate_fit_screen', 'false');
    updateFitScreenUI(false);
    showToastNotification('Normal ekran görünümüne dönüldü.');
  }
}

function updateFitScreenUI(isFit) {
  const btn = document.getElementById('btnFitScreen');
  const icon = document.getElementById('iconFitScreen');
  const text = document.getElementById('textFitScreen');
  if (!btn) return;

  if (isFit) {
    btn.classList.add('active');
    btn.title = 'Normal Ekrana Dön (Esc / F11)';
    if (text) text.textContent = 'Normal';
    if (icon) {
      icon.innerHTML = `<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>`;
    }
  } else {
    btn.classList.remove('active');
    btn.title = 'Ekrana Sığdır / Tam Ekran (F11)';
    if (text) text.textContent = 'Sığdır';
    if (icon) {
      icon.innerHTML = `<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`;
    }
  }
}

// Fullscreen olaylarını dinle (ESC veya F11 ile çıkış yapıldığında senkronizasyon)
document.addEventListener('fullscreenchange', () => {
  const isFullScreen = !!document.fullscreenElement;
  if (!isFullScreen) {
    document.body.classList.remove('fit-to-screen');
    localStorage.setItem('ozate_fit_screen', 'false');
    updateFitScreenUI(false);
  } else {
    document.body.classList.add('fit-to-screen');
    localStorage.setItem('ozate_fit_screen', 'true');
    updateFitScreenUI(true);
  }
});

function handleLogout() {
  if (confirm('Oturumu kapatmak ve giriş ekranına dönmek istediğinize emin misiniz?')) {
    localStorage.removeItem('ozate_session');
    window.location.href = 'login.html';
  }
}

// =============================================================================
// 13. CSV / EXCEL DIŞA AKTARMA (EXPORT)
// =============================================================================

function exportToCsv(filename, rows) {
  const processRow = function (row) {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      let innerValue = row[j] === null || row[j] === undefined ? '' : row[j].toString();
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) finalVal += ';';
      finalVal += result;
    }
    return finalVal + '\r\n';
  };

  let csvFile = '\uFEFF'; // Excel Türkçe karakter desteği için UTF-8 BOM
  for (let i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function exportTransactionsCsv() {
  const rows = [
    ['Tarih', 'İşlem Türü', 'Kategori', 'Açıklama', 'Cari Hesap', 'Tutar (TL)', 'Ödeme Durumu']
  ];
  state.transactions.forEach(t => {
    const c = state.contacts.find(con => con.id === t.contactId);
    rows.push([
      formatDate(t.date),
      t.type === 'INCOME' ? 'Gelir' : 'Gider',
      t.category,
      t.desc,
      c ? c.name : 'Peşin',
      t.amount.toString(),
      t.status
    ]);
  });
  exportToCsv('ozate_ciftlik_gelir_gider_raporu.csv', rows);
}

function exportAnimalsCsv() {
  const rows = [
    ['Küpe No', 'İsim', 'Irk', 'Kategori', 'Cinsiyet', 'Padok', 'Canlı Ağırlık (kg)', 'Verim Durumu', 'Sağlık']
  ];
  state.animals.forEach(a => {
    rows.push([
      a.earTag,
      a.name || '',
      a.breed,
      a.category,
      a.gender,
      a.paddock,
      a.weight.toString(),
      a.yield,
      a.health
    ]);
  });
  exportToCsv('ozate_ciftlik_suru_listesi.csv', rows);
}

// =============================================================================
// 13b. PARAMETRELER & DEĞİŞKENLER YÖNETİMİ (KATEGORİ, PADOK, IRK, STOK TÜRLERİ)
// =============================================================================

function showToastNotification(msg) {
  let toast = document.getElementById('appToastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToastNotice';
    toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:#1E4D2B; color:#FFFFFF; padding:10px 18px; border-radius:8px; font-size:0.8rem; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,0.35); z-index:99999; display:none; transition:opacity 0.25s ease; border: 1px solid rgba(255,255,255,0.2);';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 250);
  }, 3200);
}

// Hızlı Kategori & Değişken Ekleme Fonksiyonları
function quickAddCategoryFromTx() {
  const type = document.getElementById('txType').value;
  const paramKey = type === 'INCOME' ? 'incomeCategories' : 'expenseCategories';
  const label = type === 'INCOME' ? 'Yeni Gelir Kategorisi' : 'Yeni Gider Kategorisi';
  const name = prompt(`${label} adını giriniz (Örn. Slaj Satışı, Arsa Kirası, Gübre Geliri vb.):`);
  if (!name || !name.trim()) return;
  const cleanName = name.trim();
  if (!state.parameters[paramKey].includes(cleanName)) {
    state.parameters[paramKey].push(cleanName);
    saveState();
  }
  populateTxCategories(type, cleanName);
  showToastNotification(`"${cleanName}" kategorisi listeye eklendi ve seçildi.`);
}

function quickAddContactFromTx() {
  const currentType = document.getElementById('txType').value;
  const defaultCtType = currentType === 'INCOME' ? 'CUSTOMER' : 'SUPPLIER';
  openNewContactModal(defaultCtType, (newCt) => {
    populateTxContacts(newCt.id);
    showToastNotification(`"${newCt.name}" cari kartı oluşturuldu ve seçildi.`);
  });
}

function quickAddContactFromMilk() {
  openNewContactModal('CUSTOMER', (newCt) => {
    const custSelect = document.getElementById('shpCustomer');
    if (custSelect) {
      const opt = document.createElement('option');
      opt.value = newCt.id;
      opt.textContent = `${newCt.name} (Müşteri)`;
      opt.selected = true;
      custSelect.appendChild(opt);
    }
    showToastNotification(`"${newCt.name}" mandıra alıcısı eklendi ve seçildi.`);
  });
}

function quickAddContactFromStock() {
  openNewContactModal('SUPPLIER', (newCt) => {
    const suppSelect = document.getElementById('stkSupplier');
    if (suppSelect) {
      const opt = document.createElement('option');
      opt.value = newCt.id;
      opt.textContent = `${newCt.name} (Tedarikçi)`;
      opt.selected = true;
      suppSelect.appendChild(opt);
    }
    showToastNotification(`"${newCt.name}" tedarikçisi eklendi ve seçildi.`);
  });
}

function quickAddPaddockFromAnimal() {
  const name = prompt('Yeni Padok / Bölme adını giriniz (Örn. Sağmal 3, Genç Düve Padoğu, Tecrit Bölmesi):');
  if (!name || !name.trim()) return;
  const cleanName = name.trim();
  if (!state.parameters.paddocks.includes(cleanName)) {
    state.parameters.paddocks.push(cleanName);
    saveState();
  }
  populateAnimalDropdowns(cleanName, null, null);
  renderAnimalFilterPaddocks();
  showToastNotification(`"${cleanName}" padoğu tanımlandı ve seçildi.`);
}

function quickAddBreedFromAnimal() {
  const name = prompt('Yeni Hayvan Irkı adını giriniz (Örn. Belçika Mavisi, Şarole, Brown Swiss):');
  if (!name || !name.trim()) return;
  const cleanName = name.trim();
  if (!state.parameters.breeds.includes(cleanName)) {
    state.parameters.breeds.push(cleanName);
    saveState();
  }
  populateAnimalDropdowns(null, cleanName, null);
  showToastNotification(`"${cleanName}" ırkı tanımlandı ve seçildi.`);
}

function quickAddAnimalCategoryFromAnimal() {
  const name = prompt('Yeni Hayvan Türü/Kategorisi giriniz (Örn. Besi Danası, Damızlık Boğa, Gebe Düve):');
  if (!name || !name.trim()) return;
  const cleanName = name.trim();
  if (!state.parameters.animalCategories.includes(cleanName)) {
    state.parameters.animalCategories.push(cleanName);
    saveState();
  }
  populateAnimalDropdowns(null, null, cleanName);
  showToastNotification(`"${cleanName}" türü tanımlandı ve seçildi.`);
}

function quickAddStockCategoryFromStock() {
  const name = prompt('Yeni Stok Kategorisi giriniz (Örn. Sıvı Gübre, Tohumluk, Temizlik & Hijyen):');
  if (!name || !name.trim()) return;
  const cleanName = name.trim();
  if (!state.parameters.stockCategories.includes(cleanName)) {
    state.parameters.stockCategories.push(cleanName);
    saveState();
  }
  populateStockCategoryDropdown(cleanName);
  showToastNotification(`"${cleanName}" stok türü listeye eklendi.`);
}

function populateStockCategoryDropdown(selectedVal = null) {
  const catSel = document.getElementById('stkNewCategory');
  if (!catSel) return;
  catSel.innerHTML = '';
  (state.parameters?.stockCategories || DEFAULT_STATE.parameters.stockCategories).forEach(sc => {
    const opt = document.createElement('option');
    opt.value = sc;
    opt.textContent = sc;
    if (selectedVal && selectedVal === sc) opt.selected = true;
    catSel.appendChild(opt);
  });
}

function renderAnimalFilterPaddocks() {
  const sel = document.getElementById('filterAnimalPaddock');
  if (!sel) return;
  const currentVal = sel.value;
  sel.innerHTML = '<option value="ALL">Tüm Padoklar</option>';
  (state.parameters?.paddocks || DEFAULT_STATE.parameters.paddocks).forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = `${p} Padoğu`;
    if (currentVal === p) opt.selected = true;
    sel.appendChild(opt);
  });
}

// =============================================================================
// 13b. TANIMLAR & PARAMETRELER (DEĞİŞKENLER) YÖNETİMİ
// =============================================================================

let currentDefTab = 'income';

const PARAM_TAB_CONFIG = {
  income: {
    key: 'incomeCategories',
    title: 'Gelir Kategorileri',
    subtitle: 'Finansal gelir işlemlerinde ve faturalandırmada seçilen kategoriler',
    placeholder: 'Yeni Gelir Kategorisi (Örn. Saman Satışı, Gübre Geliri...)',
    icon: '💰'
  },
  expense: {
    key: 'expenseCategories',
    title: 'Gider Kategorileri',
    subtitle: 'Çiftlik harcamaları ve gider fişlerinde kullanılan gider grupları',
    placeholder: 'Yeni Gider Kategorisi (Örn. Akaryakıt & Mazot, Tohumlama Bedeli...)',
    icon: '💸'
  },
  contacts: {
    key: 'contactCategories',
    title: 'Müşteri & Tedarikçi Grupları',
    subtitle: 'Cari kartlarda kullanılan sektör ve müşteri/tedarikçi sınıflandırmaları',
    placeholder: 'Yeni Cari Türü (Örn. Mandıra & Süt Alıcısı, Yem Fabrikası...)',
    icon: '👥'
  },
  paddocks: {
    key: 'paddocks',
    title: 'Padoklar & Ahır Bölmeleri',
    subtitle: 'Çiftlik içi sürü yerleşim padokları, revir ve ahır bölümleri',
    placeholder: 'Yeni Padok Adı (Örn. Sağmal 3, Buzağı Bölmesi...)',
    icon: '🏡'
  },
  breeds: {
    key: 'breeds',
    title: 'Büyükbaş Hayvan Irkları',
    subtitle: 'Sürüye hayvan kaydederken ve pasaport takibinde kullanılan ırklar',
    placeholder: 'Yeni Irk (Örn. Limuzin, Brown Swiss, Şarole...)',
    icon: '🐄'
  },
  animalCats: {
    key: 'animalCategories',
    title: 'Sürü Hayvan Türleri',
    subtitle: 'Hayvanların fizyolojik ve işletme içi durum sınıflandırması',
    placeholder: 'Yeni Tür (Örn. Süt İneği, Besi Danası, Damızlık Boğa...)',
    icon: '🏷️'
  },
  stockCats: {
    key: 'stockCategories',
    title: 'Stok & Yem Kategorileri',
    subtitle: 'Depodaki kaba yem, konsantre yem ve tıbbi malzeme kategorileri',
    placeholder: 'Yeni Stok Türü (Örn. Hijyen & Dezenfektan, Mineral Blok...)',
    icon: '🌾'
  },
  accountTypes: {
    key: 'accountTypes',
    title: 'Kasa & Banka Hesapları',
    subtitle: 'Nakit kasa, banka hesapları ve finansal varlık hesapları',
    placeholder: 'Yeni Kasa / Banka Adı (Örn. Vakıfbank Ticari, Küçükbaş Kasası...)',
    icon: '💳'
  },
  sheepBarns: {
    key: 'sheepBarns',
    title: 'Küçükbaş Ağılları & Bölmeleri',
    subtitle: 'Koyun, koç, kuzu ve keçi ağıl bölmeleri ve mera hatları',
    placeholder: 'Yeni Ağıl Bölmesi (Örn. Ağıl 6, Doğumhane Ağılı...)',
    icon: '🐑'
  },
  sheepBreeds: {
    key: 'sheepBreeds',
    title: 'Küçükbaş Irkları',
    subtitle: 'Merinos, Kıvırcık, İvesi, Saanen gibi küçükbaş ırk tanımları',
    placeholder: 'Yeni Küçükbaş Irkı (Örn. Sakız, Kangal Akkaraman...)',
    icon: '🏷️'
  }
};

// Definitions Sayfasını Render Et
function renderDefinitionsPage() {
  // Tüm sekme sayaç rozetlerini güncelle
  Object.keys(PARAM_TAB_CONFIG).forEach(tab => {
    const cfg = PARAM_TAB_CONFIG[tab];
    const badge = document.getElementById(`defBadge-${tab}`);
    if (badge) {
      const count = (state.parameters && state.parameters[cfg.key]) ? state.parameters[cfg.key].length : 0;
      badge.textContent = count;
    }
  });

  // Aktif sekmeyi render et
  setDefinitionTab(currentDefTab);
}

// Sekme Değiştir
function setDefinitionTab(tab) {
  if (!PARAM_TAB_CONFIG[tab]) tab = 'income';
  currentDefTab = tab;

  // Sekme butonlarını güncelle
  document.querySelectorAll('.def-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  const cfg = PARAM_TAB_CONFIG[tab];
  const titleEl = document.getElementById('defActiveTitle');
  const subEl = document.getElementById('defActiveSubtitle');
  const inputEl = document.getElementById('defNewInput');
  const searchEl = document.getElementById('defSearchInput');

  if (titleEl) titleEl.textContent = `${cfg.icon} ${cfg.title}`;
  if (subEl) subEl.textContent = cfg.subtitle;
  if (inputEl) inputEl.placeholder = cfg.placeholder;
  if (searchEl) searchEl.value = '';

  renderDefinitionItems(tab);
}

// Tanım Öğelerini Listele
function renderDefinitionItems(tab, filter = '') {
  const cfg = PARAM_TAB_CONFIG[tab];
  if (!cfg) return;

  const container = document.getElementById('defItemsContainer');
  if (!container) return;
  container.innerHTML = '';

  let list = (state.parameters && state.parameters[cfg.key]) ? [...state.parameters[cfg.key]] : [];
  
  if (filter && filter.trim()) {
    const q = filter.trim().toLowerCase();
    list = list.filter(item => item.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔍</p>
        <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">Kayıt bulunamadı</p>
        <p style="font-size: 0.78rem;">${filter ? 'Aramanıza uygun tanım bulunamadı.' : 'Bu kategoride henüz tanımlı bir değişken yok. Yukarıdaki kutudan hemen ekleyebilirsiniz.'}</p>
      </div>
    `;
    return;
  }

  // Her öğeyi oluştur
  list.forEach((item) => {
    const actualIndex = (state.parameters[cfg.key] || []).indexOf(item);
    const usageCount = calculateParamUsage(cfg.key, item);

    const row = document.createElement('div');
    row.className = 'def-item-row';
    row.innerHTML = `
      <div class="def-item-info">
        <span style="font-size: 1rem;">${cfg.icon}</span>
        <div>
          <span class="def-item-title">${escapeHtml(item)}</span>
          ${usageCount > 0 ? `<span class="def-item-tag" style="margin-left: 8px;">${usageCount} kayıtta kullanımda</span>` : ''}
        </div>
      </div>
      <div class="def-item-actions">
        <button type="button" class="btn btn-xs btn-outline" onclick="editDefinitionItem('${tab}', ${actualIndex})" title="Düzenle">
          ✏️ Düzenle
        </button>
        <button type="button" class="btn btn-xs btn-danger" onclick="deleteDefinitionItem('${tab}', ${actualIndex})" title="Sil">
          🗑️ Sil
        </button>
      </div>
    `;
    container.appendChild(row);
  });
}

// Parametre Kullanım Sayısını Hesapla
function calculateParamUsage(key, val) {
  let count = 0;
  if (!val) return 0;
  
  if (key === 'incomeCategories' || key === 'expenseCategories') {
    (state.transactions || []).forEach(tx => {
      if (tx.category === val) count++;
    });
  } else if (key === 'paddocks') {
    (state.animals || []).forEach(an => {
      if (an.paddock === val) count++;
    });
  } else if (key === 'breeds') {
    (state.animals || []).forEach(an => {
      if (an.breed === val) count++;
    });
  } else if (key === 'animalCategories') {
    (state.animals || []).forEach(an => {
      if (an.category === val) count++;
    });
  } else if (key === 'stockCategories') {
    (state.inventory || []).forEach(stk => {
      if (stk.category === val) count++;
    });
  } else if (key === 'accountTypes') {
    const acc = (state.accounts || []).find(a => a.name === val);
    if (acc) {
      (state.transactions || []).forEach(tx => {
        if (tx.accountId === acc.id) count++;
      });
      (state.transfers || []).forEach(tr => {
        if (tr.fromAcc === acc.id || tr.toAcc === acc.id) count++;
      });
    }
  }
  return count;
}

// Yeni Tanım Ekle
function handleDefinitionAdd(e) {
  e.preventDefault();
  const inputEl = document.getElementById('defNewInput');
  const val = inputEl ? inputEl.value.trim() : '';
  if (!val) return;

  const cfg = PARAM_TAB_CONFIG[currentDefTab];
  if (!cfg) return;

  if (!state.parameters[cfg.key]) state.parameters[cfg.key] = [];
  
  if (state.parameters[cfg.key].some(item => item.toLowerCase() === val.toLowerCase())) {
    alert(`"${val}" zaten bu listede mevcut!`);
    return;
  }

  state.parameters[cfg.key].push(val);

  // Kasa & Banka Hesabı eklendiğinde state.accounts ile senkronize et
  if (currentDefTab === 'accountTypes') {
    if (!state.accounts) state.accounts = [];
    const isCash = /kasa|nakit/i.test(val);
    const isCard = /kart|pos|kredi/i.test(val);
    const accType = isCash ? 'CASH' : (isCard ? 'POS' : 'BANK');
    const existingAcc = state.accounts.find(a => a.name.toLowerCase() === val.toLowerCase());
    if (!existingAcc) {
      state.accounts.push({
        id: 'acc-' + Date.now(),
        name: val,
        type: accType,
        iban: isCash ? '-' : 'TR00 0000 ...',
        balance: 0.00
      });
      renderAccountsPage();
    }
  }

  saveState();
  inputEl.value = '';
  
  renderDefinitionsPage();
  syncAllDropdowns();
  showToastNotification(`"${val}" başarıyla eklendi ve sistem genelinde aktif edildi.`);
}

// Tanım Düzenle
function editDefinitionItem(tab, index) {
  const cfg = PARAM_TAB_CONFIG[tab];
  if (!cfg) return;

  const list = state.parameters[cfg.key] || [];
  const currentVal = list[index];
  if (!currentVal) return;

  const newVal = prompt(`"${currentVal}" tanımını güncellemek için yeni adı giriniz:`, currentVal);
  if (newVal === null) return;
  const cleanVal = newVal.trim();
  if (!cleanVal || cleanVal === currentVal) return;

  if (list.some((item, i) => i !== index && item.toLowerCase() === cleanVal.toLowerCase())) {
    alert(`"${cleanVal}" zaten bu listede mevcut!`);
    return;
  }

  list[index] = cleanVal;

  // Kasa & Banka adı güncellendiğinde state.accounts ile senkronize et
  if (tab === 'accountTypes' && Array.isArray(state.accounts)) {
    const acc = state.accounts.find(a => a.name === currentVal);
    if (acc) {
      acc.name = cleanVal;
      renderAccountsPage();
    }
  }

  saveState();

  renderDefinitionsPage();
  syncAllDropdowns();
  showToastNotification(`"${currentVal}" adı "${cleanVal}" olarak güncellendi.`);
}

// Tanım Sil
function deleteDefinitionItem(tab, index) {
  const cfg = PARAM_TAB_CONFIG[tab];
  if (!cfg) return;

  const list = state.parameters[cfg.key] || [];
  const item = list[index];
  if (!item) return;

  const usage = calculateParamUsage(cfg.key, item);
  let msg = `"${item}" tanımını silmek istediğinize emin misiniz?`;
  if (usage > 0) {
    msg += `\n⚠️ DİKKAT: Bu tanım çiftlikte ${usage} adet aktif kayıtta kullanılmaktadır.`;
  }

  // Hesap silinirken bakiye kontrolü
  let accToDelete = null;
  if (tab === 'accountTypes' && Array.isArray(state.accounts)) {
    accToDelete = state.accounts.find(a => a.name === item);
    if (accToDelete && Math.abs(accToDelete.balance) > 0.01) {
      msg += `\n⚠️ UYARI: Bu hesabın bakiyesi ${formatCurrency(accToDelete.balance)} tutarındadır. Silinirse bakiye sıfırlanacaktır.`;
    }
  }

  if (!confirm(msg)) return;

  list.splice(index, 1);
  if (accToDelete) {
    state.accounts = state.accounts.filter(a => a.id !== accToDelete.id);
    renderAccountsPage();
  }

  saveState();

  renderDefinitionsPage();
  syncAllDropdowns();
  showToastNotification(`"${item}" tanımı listeden silindi.`);
}

// Canlı Arama Filtresi
function filterDefinitionList(query) {
  renderDefinitionItems(currentDefTab, query);
}

// Ekleme Kutusuna Odaklan
function focusDefAddInput() {
  const input = document.getElementById('defNewInput');
  if (input) {
    input.focus();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Dinamik Kasa ve Banka Dropdown'larını Doldur
function populateAccountDropdowns() {
  if (!state.accounts || !Array.isArray(state.accounts)) return;

  // 1. Gelir / Gider Ekle (txAccount)
  const txAcc = document.getElementById('txAccount');
  if (txAcc) {
    const curVal = txAcc.value;
    txAcc.innerHTML = state.accounts.map(a => 
      `<option value="${a.id}">${a.type === 'BANK' ? '🏦' : (a.type === 'CASH' ? '💵' : '💳')} ${escapeHtml(a.name)}</option>`
    ).join('');
    if (curVal && state.accounts.some(a => a.id === curVal)) {
      txAcc.value = curVal;
    }
  }

  // 2. Virman Transferi (trFrom & trTo)
  const trFrom = document.getElementById('trFrom');
  const trTo = document.getElementById('trTo');
  if (trFrom && trTo) {
    const curFrom = trFrom.value;
    const curTo = trTo.value;
    const opts = state.accounts.map(a => 
      `<option value="${a.id}">${a.type === 'BANK' ? '🏦' : (a.type === 'CASH' ? '💵' : '💳')} ${escapeHtml(a.name)}</option>`
    ).join('');
    trFrom.innerHTML = opts;
    trTo.innerHTML = opts;
    if (curFrom && state.accounts.some(a => a.id === curFrom)) trFrom.value = curFrom;
    if (curTo && state.accounts.some(a => a.id === curTo)) trTo.value = curTo;
    else if (state.accounts.length > 1) trTo.value = state.accounts[1].id;
  }

  // 3. Borç / Alacak Kapatma (settleAccount)
  const settleAcc = document.getElementById('settleAccount');
  if (settleAcc) {
    const curVal = settleAcc.value;
    settleAcc.innerHTML = state.accounts.map(a => 
      `<option value="${a.id}">${a.type === 'BANK' ? '🏦' : (a.type === 'CASH' ? '💵' : '💳')} ${escapeHtml(a.name)} (${formatCurrency(a.balance)})</option>`
    ).join('');
    if (curVal && state.accounts.some(a => a.id === curVal)) {
      settleAcc.value = curVal;
    }
  }
}

// Tüm Dropdown'ları ve Form Seçicilerini Senkronize Et
function syncAllDropdowns() {
  populateAccountDropdowns();
  renderAnimalFilterPaddocks();
  if (typeof populateAnimalDropdowns === 'function') {
    populateAnimalDropdowns();
  }
  if (typeof populateStockCategoryDropdown === 'function') {
    populateStockCategoryDropdown();
  }
  const txType = document.getElementById('txType');
  if (txType && typeof populateTxCategories === 'function') {
    populateTxCategories(txType.value);
  }
}

// Varsayılanlara Sıfırla
function resetDefaultParameters() {
  if (!confirm('Tüm çiftlik parametreleri (gelir/gider kategorileri, padoklar, ırklar, stok türleri) sistem varsayılanlarına sıfırlansın mı?\n\nKendi eklediğiniz özel tanımlar temizlenecektir.')) {
    return;
  }
  state.parameters = JSON.parse(JSON.stringify(DEFAULT_STATE.parameters));
  saveState();
  renderDefinitionsPage();
  syncAllDropdowns();
  showToastNotification('Tüm parametreler başarıyla varsayılan fabrika ayarlarına sıfırlandı.');
}

// Modal Uyumluluğu
let currentParamTab = 'income';

function openParametersModal(tab = 'income') {
  window.location.hash = 'definitions';
  navigateToPage('definitions');
  setDefinitionTab(tab);
}

function switchParamTab(tab) {
  setDefinitionTab(tab);
}

// =============================================================================
// 13c. ÇİFTLİK PERSONELİ & KULLANICI YÖNETİMİ
// =============================================================================

function openUserManagementModal() {
  // Artık modal yerine sayfa olarak açılıyor
  navigateToPage('users');
}

function renderUserListGrid() {
  const tbody = document.getElementById('usersTbody');
  const countBadge = document.getElementById('userCountSummaryBadge');
  if (!tbody) return;

  const allUsers = state.users || [];

  // KPI istatistikleri
  const totalEl = document.getElementById('kpiUsersTotal');
  const activeEl = document.getElementById('kpiUsersActive');
  const adminEl = document.getElementById('kpiUsersAdmin');
  const vetEl = document.getElementById('kpiUsersVet');
  if (totalEl) totalEl.textContent = allUsers.length;
  if (activeEl) activeEl.textContent = allUsers.filter(u => u.status === 'ACTIVE').length;
  if (adminEl) adminEl.textContent = allUsers.filter(u => u.role === 'ADMIN').length;
  if (vetEl) vetEl.textContent = allUsers.filter(u => u.role === 'VET').length;

  // Filtrele
  const roleFilter = (document.getElementById('filterUserRole') || {}).value || '';
  const statusFilter = (document.getElementById('filterUserStatus') || {}).value || '';

  let users = allUsers;
  if (roleFilter) users = users.filter(u => u.role === roleFilter);
  if (statusFilter) users = users.filter(u => u.status === statusFilter);

  if (countBadge) countBadge.textContent = `Kayıtlı Personel: ${users.length} kişi`;

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">Kriterlere uygun personel bulunamadı.</td></tr>`;
    return;
  }

  const roleMeta = {
    ADMIN: { label: 'Yönetici', emoji: '👑', color: 'var(--ozate-burgundy)' },
    VET: { label: 'Veteriner', emoji: '🩺', color: '#0284c7' },
    WORKER: { label: 'Bakıcı / Sağımcı', emoji: '👨‍🌾', color: 'var(--ozate-green)' },
    ACCOUNTANT: { label: 'Ön Muhasebe', emoji: '💼', color: '#d97706' }
  };

  tbody.innerHTML = users.map(u => {
    const r = roleMeta[u.role] || { label: u.role, emoji: '👤', color: 'var(--text-muted)' };
    const statusColor = u.status === 'ACTIVE' ? 'var(--accent-success)' : 'var(--accent-danger)';
    const statusLabel = u.status === 'ACTIVE' ? '● Aktif' : '○ Pasif';
    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-surface-hover); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">${r.emoji}</div>
            <strong style="font-size: 0.85rem;">${u.name}</strong>
          </div>
        </td>
        <td style="color: var(--text-muted); font-size: 0.8rem;">${u.title || r.label}</td>
        <td>
          <span class="tag-badge" style="background: rgba(0,0,0,0.12); color: ${r.color}; border: 1px solid rgba(255,255,255,0.08); font-size: 0.7rem; font-weight: 700; white-space: nowrap;">
            ${r.emoji} ${r.label}
          </span>
        </td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${u.email}</td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${u.phone || '—'}</td>
        <td>
          <span style="font-family: monospace; background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 2px 7px; border-radius: 4px; font-size: 0.75rem; letter-spacing: 2px;">••••</span>
        </td>
        <td>
          <span style="color: ${statusColor}; font-size: 0.75rem; font-weight: 700;">${statusLabel}</span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button type="button" class="btn btn-sm btn-ghost" onclick="openEditUserModal('${u.id}')" title="Personeli Düzenle" style="padding: 3px 8px; font-size: 0.72rem;">✏️ Düzenle</button>
          <button type="button" class="btn btn-sm btn-ghost" onclick="deleteUser('${u.id}')" title="Personeli Sil" style="padding: 3px 8px; font-size: 0.72rem; color: var(--accent-danger); margin-left: 2px;">🗑️ Sil</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openNewUserModal() {
  document.getElementById('usrEditingId').value = '';
  document.getElementById('usrFormTitle').textContent = 'Yeni Personel / Kullanıcı Ekle';
  document.getElementById('usrSubmitBtn').textContent = 'Personeli Kaydet';

  document.getElementById('usrName').value = '';
  document.getElementById('usrTitle').value = '';
  document.getElementById('usrEmail').value = '';
  document.getElementById('usrPhone').value = '';
  document.getElementById('usrRole').value = 'WORKER';
  document.getElementById('usrPin').value = '1923';
  document.getElementById('usrStatus').value = 'ACTIVE';

  openModal('modalUserForm');
}

function openEditUserModal(userId) {
  const u = (state.users || []).find(user => user.id === userId);
  if (!u) return;

  document.getElementById('usrEditingId').value = u.id;
  document.getElementById('usrFormTitle').textContent = `Personeli Düzenle (${u.name})`;
  document.getElementById('usrSubmitBtn').textContent = 'Değişiklikleri Güncelle';

  document.getElementById('usrName').value = u.name;
  document.getElementById('usrTitle').value = u.title || '';
  document.getElementById('usrEmail').value = u.email;
  document.getElementById('usrPhone').value = u.phone || '';
  document.getElementById('usrRole').value = u.role || 'WORKER';
  document.getElementById('usrPin').value = u.pin || '1923';
  document.getElementById('usrStatus').value = u.status || 'ACTIVE';

  openModal('modalUserForm');
}

function handleUserSubmit(e) {
  e.preventDefault();
  const editingId = document.getElementById('usrEditingId').value;
  const name = document.getElementById('usrName').value.trim();
  const title = document.getElementById('usrTitle').value.trim();
  const email = document.getElementById('usrEmail').value.trim();
  const phone = document.getElementById('usrPhone').value.trim();
  const role = document.getElementById('usrRole').value;
  const pin = document.getElementById('usrPin').value.trim();
  const status = document.getElementById('usrStatus').value;

  if (!state.users) state.users = [];

  if (editingId) {
    const existing = state.users.find(u => u.id === editingId);
    if (existing) {
      existing.name = name;
      existing.title = title;
      existing.email = email;
      existing.phone = phone;
      existing.role = role;
      existing.pin = pin;
      existing.status = status;
      showToastNotification(`"${name}" personel bilgileri güncellendi.`);
    }
  } else {
    // Check if email already used
    if (state.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      alert(`"${email}" e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut.`);
      return;
    }

    state.users.push({
      id: 'usr-' + Date.now(),
      name,
      title,
      email,
      phone,
      role,
      pin,
      status
    });
    showToastNotification(`"${name}" sisteme yeni personel olarak kaydedildi.`);
  }

  saveState();
  closeModal('modalUserForm');
  renderUserListGrid();
}

function deleteUser(userId) {
  const user = (state.users || []).find(u => u.id === userId);
  if (!user) return;

  if (state.users.length <= 1) {
    alert('Sistemde en az 1 yetkili kullanıcı bulunmalıdır. Bu personeli silemezsiniz.');
    return;
  }

  if (confirm(`"${user.name}" personelini sistemden silmek istediğinize emin misiniz?`)) {
    state.users = state.users.filter(u => u.id !== userId);
    saveState();
    renderUserListGrid();
    showToastNotification(`"${user.name}" sistemden kaldırıldı.`);
  }
}

// =============================================================================
// 14. 5 EKSİK MODÜL: YENİ HESAP, CARİ EKSTRESİ, TOPLU PADOK, RASYON, MALİYET
// =============================================================================

// -----------------------------------------------------------------------------
// M1. YENİ KASA / BANKA HESABI EKLEME
// -----------------------------------------------------------------------------
function openNewAccountModal() {
  const form = document.getElementById('formNewAccount');
  if (form) form.reset();
  document.getElementById('accBalance').value = '0';
  openModal('modalNewAccount');
}

function handleNewAccountSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('accName').value.trim();
  const type = document.getElementById('accType').value;
  const iban = document.getElementById('accIban').value.trim() || '-';
  const balance = parseFloat(document.getElementById('accBalance').value) || 0;

  if (!name) return;

  const newAcc = {
    id: 'acc-' + Date.now(),
    name,
    type,
    iban,
    balance
  };

  state.accounts.push(newAcc);
  if (!state.parameters) state.parameters = {};
  if (!Array.isArray(state.parameters.accountTypes)) state.parameters.accountTypes = [];
  if (!state.parameters.accountTypes.includes(name)) {
    state.parameters.accountTypes.push(name);
  }
  saveState();
  closeModal('modalNewAccount');
  renderAccountsPage();
  renderDefinitionsPage();
  syncAllDropdowns();
  renderDashboard();
  showToastNotification(`"${name}" hesabı sisteme eklendi.`);
}

// -----------------------------------------------------------------------------
// M2. CARİ HESAP EKSTRESİ (HAREKET DÖKÜMÜ)
// -----------------------------------------------------------------------------
function openContactStatementModal(contactId = null) {
  const sel = document.getElementById('statementContactSelect');
  sel.innerHTML = '';
  state.contacts.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.type === 'CUSTOMER' ? '👤' : '🏭'} ${c.name}`;
    if (contactId && contactId === c.id) opt.selected = true;
    sel.appendChild(opt);
  });

  const selectedId = contactId || (state.contacts[0] ? state.contacts[0].id : null);
  if (selectedId) renderContactStatement(selectedId);

  openModal('modalContactStatement');
}

function renderContactStatement(contactId) {
  const contact = state.contacts.find(c => c.id === contactId);
  if (!contact) return;

  document.getElementById('statementModalTitle').textContent = `📄 Cari Ekstre: ${contact.name}`;

  // Cari'ye ait işlemleri filtrele ve tarihe göre sırala
  const contactTxs = state.transactions
    .filter(tx => tx.contactId === contactId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Özet kartları
  let totalDebit = 0;   // Borç (bize olan giderler)
  let totalCredit = 0;  // Alacak (bizden olan gelirler)
  contactTxs.forEach(tx => {
    if (tx.type === 'INCOME') totalCredit += tx.amount;
    if (tx.type === 'EXPENSE') totalDebit += tx.amount;
  });
  const netBalance = totalCredit - totalDebit;

  const summaryCards = document.getElementById('statementSummaryCards');
  summaryCards.innerHTML = `
    <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:8px; padding:0.85rem; text-align:center;">
      <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Toplam Alacak (Gelir)</div>
      <div style="font-size:1.15rem; font-weight:700; color:var(--accent-success); font-family:var(--font-heading);">${formatCurrency(totalCredit)}</div>
    </div>
    <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:8px; padding:0.85rem; text-align:center;">
      <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Toplam Borç (Gider)</div>
      <div style="font-size:1.15rem; font-weight:700; color:var(--accent-danger); font-family:var(--font-heading);">${formatCurrency(totalDebit)}</div>
    </div>
    <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:8px; padding:0.85rem; text-align:center;">
      <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Net Bakiye</div>
      <div style="font-size:1.15rem; font-weight:700; color:${netBalance >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'}; font-family:var(--font-heading);">${formatCurrency(Math.abs(netBalance))} ${netBalance >= 0 ? '↑ Alacak' : '↓ Borç'}</div>
    </div>
  `;

  // Ekstre Tablosu - kümülatif bakiye
  const tbody = document.getElementById('statementTbody');
  tbody.innerHTML = '';

  if (contactTxs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:var(--text-muted);">Bu cari hesaba ait kayıtlı hareket bulunmamaktadır.</td></tr>`;
    return;
  }

  let runningBalance = 0;
  contactTxs.forEach(tx => {
    if (tx.type === 'INCOME') runningBalance += tx.amount;
    if (tx.type === 'EXPENSE') runningBalance -= tx.amount;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(tx.date)}</td>
      <td style="font-size:0.8rem; max-width:200px;">${tx.desc}</td>
      <td><span class="tag-badge">${tx.category}</span></td>
      <td style="color:var(--accent-danger); font-weight:600;">${tx.type === 'EXPENSE' ? formatCurrency(tx.amount) : '-'}</td>
      <td style="color:var(--accent-success); font-weight:600;">${tx.type === 'INCOME' ? formatCurrency(tx.amount) : '-'}</td>
      <td style="font-weight:700; font-family:var(--font-heading); color:${runningBalance >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'};">
        ${formatCurrency(Math.abs(runningBalance))} ${runningBalance >= 0 ? '↑' : '↓'}
      </td>
      <td>
        <span class="tag-badge ${tx.status === 'PAID' ? 'tag-paid' : (tx.status === 'PARTIAL' ? 'tag-partial' : 'tag-pending')}">
          ${tx.status === 'PAID' ? 'Kapandı' : (tx.status === 'PARTIAL' ? 'Kısmi' : 'Açık')}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

let _statementContactIdForExport = null;
function exportStatementCsv() {
  const selEl = document.getElementById('statementContactSelect');
  const contactId = selEl ? selEl.value : null;
  const contact = state.contacts.find(c => c.id === contactId);
  const contactName = contact ? contact.name : 'Cari';

  const txs = state.transactions
    .filter(tx => tx.contactId === contactId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let runningBalance = 0;
  const rows = [['Tarih', 'Açıklama', 'Kategori', 'Borç (TL)', 'Alacak (TL)', 'Bakiye (TL)', 'Durum']];
  txs.forEach(tx => {
    if (tx.type === 'INCOME') runningBalance += tx.amount;
    if (tx.type === 'EXPENSE') runningBalance -= tx.amount;
    rows.push([
      formatDate(tx.date),
      tx.desc,
      tx.category,
      tx.type === 'EXPENSE' ? tx.amount.toString() : '0',
      tx.type === 'INCOME' ? tx.amount.toString() : '0',
      runningBalance.toFixed(2),
      tx.status
    ]);
  });

  exportToCsv(`ozate_ekstre_${contactName.replace(/\s/g, '_')}.csv`, rows);
}

// -----------------------------------------------------------------------------
// M3. TOPLU PADOK TRANSFERİ
// -----------------------------------------------------------------------------
function openBulkPaddockTransferModal() {
  const paddocks = state.parameters?.paddocks || DEFAULT_STATE.parameters.paddocks;

  // Kaynak padok filtre
  const fromSel = document.getElementById('bulkFromPaddock');
  fromSel.innerHTML = '<option value="ALL">Tüm Padoklar</option>';
  paddocks.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    fromSel.appendChild(opt);
  });

  // Hedef padok
  const toSel = document.getElementById('bulkToPaddock');
  toSel.innerHTML = '';
  paddocks.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    toSel.appendChild(opt);
  });

  document.getElementById('bulkSelectAll').checked = false;
  renderBulkAnimalList();
  openModal('modalBulkPaddockTransfer');
}

function renderBulkAnimalList() {
  const fromPaddock = document.getElementById('bulkFromPaddock').value;
  const container = document.getElementById('bulkAnimalListContainer');
  const countEl = document.getElementById('bulkSelectionCount');
  container.innerHTML = '';

  const animals = fromPaddock === 'ALL'
    ? state.animals
    : state.animals.filter(a => a.paddock === fromPaddock);

  if (animals.length === 0) {
    container.innerHTML = '<div style="font-size:0.78rem; color:var(--text-muted); padding:0.5rem;">Bu padokta kayıtlı hayvan bulunamadı.</div>';
    countEl.textContent = '0 hayvan seçili';
    return;
  }

  animals.forEach(a => {
    const row = document.createElement('label');
    row.style.cssText = 'display:flex; align-items:center; gap:8px; padding:6px 4px; border-bottom:1px solid var(--border-subtle); cursor:pointer; font-size:0.8rem;';
    row.innerHTML = `
      <input type="checkbox" class="bulk-animal-cb" value="${a.id}" onchange="updateBulkCount()" style="accent-color:var(--ozate-burgundy);">
      <span style="font-family:monospace; font-weight:700; color:var(--ozate-burgundy); font-size:0.75rem;">${a.earTag}</span>
      <span>${a.name || a.category}</span>
      <span class="tag-badge" style="margin-left:auto; font-size:0.65rem;">${a.paddock}</span>
    `;
    container.appendChild(row);
  });

  updateBulkCount();
}

function toggleBulkSelectAll(checked) {
  document.querySelectorAll('.bulk-animal-cb').forEach(cb => { cb.checked = checked; });
  updateBulkCount();
}

function updateBulkCount() {
  const selected = document.querySelectorAll('.bulk-animal-cb:checked').length;
  const total = document.querySelectorAll('.bulk-animal-cb').length;
  document.getElementById('bulkSelectionCount').textContent = `${selected} / ${total} hayvan seçili`;
}

function executeBulkPaddockTransfer() {
  const targetPaddock = document.getElementById('bulkToPaddock').value;
  if (!targetPaddock) { alert('Hedef padok seçiniz.'); return; }

  const selectedIds = [...document.querySelectorAll('.bulk-animal-cb:checked')].map(cb => cb.value);
  if (selectedIds.length === 0) {
    alert('Lütfen taşımak istediğiniz hayvanları seçin.');
    return;
  }

  if (!confirm(`${selectedIds.length} hayvan "${targetPaddock}" padoğuna taşınsın mı?`)) return;

  let movedCount = 0;
  selectedIds.forEach(id => {
    const animal = state.animals.find(a => a.id === id);
    if (animal) {
      animal.paddock = targetPaddock;
      movedCount++;
    }
  });

  saveState();
  closeModal('modalBulkPaddockTransfer');
  renderAnimalsTable();
  showToastNotification(`${movedCount} hayvan "${targetPaddock}" padoğuna başarıyla taşındı.`);
}

// -----------------------------------------------------------------------------
// M4. RASYON / PADOK TÜKETİM TAKİBİ
// -----------------------------------------------------------------------------
function openRationModal() {
  document.getElementById('rationDate').value = new Date().toISOString().split('T')[0];

  // Padok listesi
  const padSel = document.getElementById('rationPaddock');
  padSel.innerHTML = '';
  (state.parameters?.paddocks || DEFAULT_STATE.parameters.paddocks).forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    padSel.appendChild(opt);
  });

  // Stok kalemleri
  const itemSel = document.getElementById('rationItem');
  itemSel.innerHTML = '';
  state.inventory.forEach(inv => {
    const opt = document.createElement('option');
    opt.value = inv.id;
    opt.textContent = `${inv.name} (Mevcut: ${inv.quantity} ${inv.unit})`;
    itemSel.appendChild(opt);
  });

  if (state.inventory.length > 0) {
    handleRationItemChange(state.inventory[0].id);
  }

  document.getElementById('rationQuantity').value = '5';
  document.getElementById('rationNotes').value = '';
  document.getElementById('rationStockImpact').textContent = '-';
  document.getElementById('rationCostCalc').textContent = '-';

  openModal('modalRation');
}

function handleRationItemChange(invId) {
  const item = state.inventory.find(i => i.id === invId);
  if (!item) return;
  document.getElementById('rationUnit').value = item.unit;
  updateRationCalc();
}

function updateRationCalc() {
  const invId = document.getElementById('rationItem').value;
  const qty = parseFloat(document.getElementById('rationQuantity').value) || 0;
  const item = state.inventory.find(i => i.id === invId);
  if (!item) return;

  const cost = qty * item.unitCost;
  document.getElementById('rationStockImpact').textContent = `-${qty} ${item.unit}`;
  document.getElementById('rationCostCalc').textContent = formatCurrency(cost);
}

function handleRationSubmit(e) {
  e.preventDefault();
  const date = document.getElementById('rationDate').value;
  const paddock = document.getElementById('rationPaddock').value;
  const invId = document.getElementById('rationItem').value;
  const qty = parseFloat(document.getElementById('rationQuantity').value) || 0;
  const notes = document.getElementById('rationNotes').value.trim();

  if (qty <= 0) { alert('Geçerli bir miktar giriniz.'); return; }

  const item = state.inventory.find(i => i.id === invId);
  if (!item) return;

  if (qty > item.quantity) {
    if (!confirm(`Stokta yalnızca ${item.quantity} ${item.unit} mevcut. Yine de devam edilsin mi?`)) return;
  }

  item.quantity = Math.max(0, item.quantity - qty);

  // Tüketim kaydı olarak expense transaction oluştur
  const cost = qty * item.unitCost;
  if (cost > 0) {
    state.transactions.unshift({
      id: 'tx-' + Date.now(),
      date,
      type: 'EXPENSE',
      category: item.category === 'İlaç/Aşı' ? 'Veteriner & İlaç' : 'Yem & Kaba Yem',
      amount: cost,
      paidAmount: cost,
      status: 'PAID',
      contactId: null,
      accountId: 'acc-1',
      desc: `[Rasyon] ${paddock} Padoğu - ${item.name}: ${qty} ${item.unit}${notes ? ' | ' + notes : ''}`
    });

    const acc = state.accounts.find(a => a.id === 'acc-1');
    if (acc) acc.balance -= cost;
  }

  saveState();
  closeModal('modalRation');
  renderInventoryTable();
  renderTransactionsTable();
  renderDashboard();
  showToastNotification(`${paddock} için ${qty} ${item.unit} ${item.name} tüketimi işlendi.`);
}

// -----------------------------------------------------------------------------
// M5. MALİYET ANALİZİ & BÜTÇE PLANLAMA
// -----------------------------------------------------------------------------
function openCostAnalysisModal() {
  renderCostAnalysis();
  openModal('modalCostAnalysis');
}

function renderCostAnalysis() {
  let totalIncome = 0, totalExpense = 0;
  const expenseByCategory = {};
  const incomeByCategory = {};

  state.transactions.forEach(tx => {
    if (tx.status === 'CANCELLED') return;
    if (tx.type === 'INCOME') {
      totalIncome += tx.amount;
      incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + tx.amount;
    }
    if (tx.type === 'EXPENSE') {
      totalExpense += tx.amount;
      expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
    }
  });

  const netProfit = totalIncome - totalExpense;
  const animalCount = state.animals.length || 1;
  const profitPerAnimal = netProfit / animalCount;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

  // KPI kartları
  const kpisEl = document.getElementById('costAnalysisKpis');
  kpisEl.innerHTML = `
    <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:8px; padding:0.85rem; text-align:center;">
      <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Toplam Gelir</div>
      <div style="font-size:1rem; font-weight:700; color:var(--accent-success); font-family:var(--font-heading);">${formatCurrency(totalIncome)}</div>
    </div>
    <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:8px; padding:0.85rem; text-align:center;">
      <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Toplam Gider</div>
      <div style="font-size:1rem; font-weight:700; color:var(--accent-danger); font-family:var(--font-heading);">${formatCurrency(totalExpense)}</div>
    </div>
    <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:8px; padding:0.85rem; text-align:center;">
      <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Net Kâr / Zarar</div>
      <div style="font-size:1rem; font-weight:700; color:${netProfit >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'}; font-family:var(--font-heading);">${formatCurrency(netProfit)}</div>
    </div>
    <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:8px; padding:0.85rem; text-align:center;">
      <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Kâr Marjı</div>
      <div style="font-size:1rem; font-weight:700; color:var(--accent-blue); font-family:var(--font-heading);">%${profitMargin}</div>
    </div>
  `;

  // Gider kategorisi dağılımı
  const expColors = ['#DC2626', '#D97706', '#7C3AED', '#2563EB', '#059669', '#C2410C', '#0891B2', '#BE185D'];
  const expContainer = document.getElementById('costCategoryBreakdown');
  expContainer.innerHTML = '';
  const expEntries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  expEntries.forEach(([cat, amt], idx) => {
    const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : 0;
    expContainer.innerHTML += `
      <div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:3px;">
          <span style="color:var(--text-main);">${cat}</span>
          <span style="font-weight:700;">${formatCurrency(amt)} <span style="color:var(--text-muted);">(%${pct})</span></span>
        </div>
        <div style="height:6px; background:var(--bg-surface); border-radius:3px;">
          <div style="width:${pct}%; height:100%; background:${expColors[idx % expColors.length]}; border-radius:3px; transition:width 0.4s;"></div>
        </div>
      </div>
    `;
  });
  if (expEntries.length === 0) expContainer.innerHTML = '<div style="font-size:0.78rem; color:var(--text-muted);">Gider kaydı bulunamadı.</div>';

  // Gelir kategorisi dağılımı
  const incColors = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#065F46'];
  const incContainer = document.getElementById('incomeCategoryBreakdown');
  incContainer.innerHTML = '';
  const incEntries = Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]);
  incEntries.forEach(([cat, amt], idx) => {
    const pct = totalIncome > 0 ? ((amt / totalIncome) * 100).toFixed(1) : 0;
    incContainer.innerHTML += `
      <div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:3px;">
          <span style="color:var(--text-main);">${cat}</span>
          <span style="font-weight:700;">${formatCurrency(amt)} <span style="color:var(--text-muted);">(%${pct})</span></span>
        </div>
        <div style="height:6px; background:var(--bg-surface); border-radius:3px;">
          <div style="width:${pct}%; height:100%; background:${incColors[idx % incColors.length]}; border-radius:3px; transition:width 0.4s;"></div>
        </div>
      </div>
    `;
  });
  if (incEntries.length === 0) incContainer.innerHTML = '<div style="font-size:0.78rem; color:var(--text-muted);">Gelir kaydı bulunamadı.</div>';

  // Karlılık tablosu
  const profEl = document.getElementById('costProfitabilityTable');
  const milkAnimals = state.animals.filter(a => a.category === 'Süt İneği').length;
  const besiAnimals = state.animals.filter(a => a.category === 'Besi Danası').length;
  const totalMilkLiters = state.milkProductions.reduce((s, m) => s + m.liters, 0);
  const avgDailyMilk = state.milkProductions.length > 0 ? (totalMilkLiters / state.milkProductions.length).toFixed(0) : 0;
  const inventoryTotalValue = state.inventory.reduce((s, i) => s + (i.quantity * i.unitCost), 0);

  profEl.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem;">
      <div>
        <div style="font-size:0.65rem; color:var(--text-dim); margin-bottom:3px;">Süt İneği Sayısı</div>
        <div style="font-weight:700; font-size:1rem;">${milkAnimals} Baş</div>
      </div>
      <div>
        <div style="font-size:0.65rem; color:var(--text-dim); margin-bottom:3px;">Besi Danası Sayısı</div>
        <div style="font-weight:700; font-size:1rem;">${besiAnimals} Baş</div>
      </div>
      <div>
        <div style="font-size:0.65rem; color:var(--text-dim); margin-bottom:3px;">Ort. Günlük Süt (Seans)</div>
        <div style="font-weight:700; font-size:1rem;">${Number(avgDailyMilk).toLocaleString('tr-TR')} L</div>
      </div>
      <div>
        <div style="font-size:0.65rem; color:var(--text-dim); margin-bottom:3px;">Hayvan Başı Net Kâr</div>
        <div style="font-weight:700; font-size:1rem; color:${profitPerAnimal >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'};">${formatCurrency(profitPerAnimal)}</div>
      </div>
      <div>
        <div style="font-size:0.65rem; color:var(--text-dim); margin-bottom:3px;">Stok Depo Değeri</div>
        <div style="font-weight:700; font-size:1rem; color:var(--accent-blue);">${formatCurrency(inventoryTotalValue)}</div>
      </div>
      <div>
        <div style="font-size:0.65rem; color:var(--text-dim); margin-bottom:3px;">Kâr Marjı</div>
        <div style="font-weight:700; font-size:1rem; color:var(--accent-blue);">%${profitMargin}</div>
      </div>
    </div>
  `;

  // Bütçe önerisi
  const suggEl = document.getElementById('costBudgetSuggestion');
  const topExpense = expEntries[0];
  const topExpenseNote = topExpense
    ? `En büyük gider kalemi <strong>${topExpense[0]}</strong> (${formatCurrency(topExpense[1])}). Bu kalemin optimize edilmesi kârlılığı artırabilir.`
    : 'Gider verisi analiz edilemiyor.';
  const nextMonthBudget = totalExpense * 1.05;
  suggEl.innerHTML = `
    <div style="font-size:0.8rem; font-weight:700; color:var(--ozate-green-accent); margin-bottom:8px;">📋 Otomatik Bütçe Önerisi</div>
    <ul style="font-size:0.78rem; color:var(--text-main); line-height:1.7; padding-left:1.2rem; margin:0;">
      <li>${topExpenseNote}</li>
      <li>Mevcut gider trendi baz alındığında gelecek ay tahmini bütçe: <strong style="color:var(--accent-blue);">${formatCurrency(nextMonthBudget)}</strong></li>
      <li>Kâr marjını %${(parseFloat(profitMargin) + 5).toFixed(1)}'e çıkarmak için giderleri <strong style="color:var(--accent-danger);">${formatCurrency(totalExpense * 0.05)}</strong> azaltmak yeterli.</li>
      ${netProfit < 0 ? '<li style="color:var(--accent-danger);">⚠️ DİKKAT: Dönem zararla kapanıyor. Gelir artırıcı aksiyonlar alınması önerilir.</li>' : ''}
    </ul>
  `;
}

function exportCostAnalysisCsv() {
  const expenseByCategory = {};
  const incomeByCategory = {};
  let totalIncome = 0, totalExpense = 0;

  state.transactions.forEach(tx => {
    if (tx.type === 'INCOME') { totalIncome += tx.amount; incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + tx.amount; }
    if (tx.type === 'EXPENSE') { totalExpense += tx.amount; expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount; }
  });

  const rows = [['Kategori', 'Tür', 'Tutar (TL)', 'Oran (%)']];
  Object.entries(incomeByCategory).forEach(([cat, amt]) => {
    rows.push([cat, 'Gelir', amt.toFixed(2), ((amt / totalIncome) * 100).toFixed(1)]);
  });
  Object.entries(expenseByCategory).forEach(([cat, amt]) => {
    rows.push([cat, 'Gider', amt.toFixed(2), ((amt / totalExpense) * 100).toFixed(1)]);
  });
  rows.push(['', '', '', '']);
  rows.push(['TOPLAM GELİR', '', totalIncome.toFixed(2), '100']);
  rows.push(['TOPLAM GİDER', '', totalExpense.toFixed(2), '100']);
  rows.push(['NET KÂR / ZARAR', '', (totalIncome - totalExpense).toFixed(2), '']);

  exportToCsv(`ozate_maliyet_analizi_${new Date().toISOString().split('T')[0]}.csv`, rows);
}

// =============================================================================
// 14b. ACİL ÖNCELİK 1: SUNİ TOHUMLAMA, CSV İÇE AKTARMA & PARAMETRE MODÜLLERİ
// =============================================================================

// 1. Suni Tohumlama & Biyolojik Gebelik Takvimi Modalı
function openInseminationModal() {
  const select = document.getElementById('insemAnimal');
  if (select) {
    select.innerHTML = '';
    const femaleCattle = state.animals.filter(a => a.gender === 'Dişi' || a.category === 'Süt İneği' || a.category === 'Gebe Düve');
    if (femaleCattle.length === 0) {
      select.innerHTML = '<option value="">Tohumlanabilecek dişi hayvan bulunamadı</option>';
    } else {
      femaleCattle.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = `${a.earTag} - ${a.name || a.category} (${a.breed} / ${a.paddock}) [Durum: ${a.status || 'Aktif'}]`;
        select.appendChild(opt);
      });
    }
  }

  const dateInput = document.getElementById('insemDate');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  calculateCalvingEstimate();
  openModal('modalInsemination');
}

function calculateCalvingEstimate() {
  const dateVal = document.getElementById('insemDate')?.value;
  if (!dateVal) return;

  const insemDate = new Date(dateVal);
  if (isNaN(insemDate.getTime())) return;

  const addDays = (base, days) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const heatDate = addDays(insemDate, 21);
  const ultraDate = addDays(insemDate, 60);
  const dryDate = addDays(insemDate, 220);
  const calvingDate = addDays(insemDate, 280);

  const elHeat = document.getElementById('calcReturnHeatDate');
  const elUltra = document.getElementById('calcUltrasoundDate');
  const elDry = document.getElementById('calcDryOffDate');
  const elCalving = document.getElementById('calcCalvingDate');

  if (elHeat) elHeat.textContent = `${formatDate(heatDate)} (Tekrar Kızgınlık Kontrolü)`;
  if (elUltra) elUltra.textContent = `${formatDate(ultraDate)} (Gebelik Testi / Ultrason)`;
  if (elDry) elDry.textContent = `${formatDate(dryDate)} (Süt Sağımını Kes & Kuruya Al)`;
  if (elCalving) elCalving.textContent = `🎯 ${formatDate(calvingDate)} (Beklenen Buzağılama)`;
}

function handleInseminationSubmit(e) {
  e.preventDefault();
  const animalId = document.getElementById('insemAnimal')?.value;
  const insemDate = document.getElementById('insemDate')?.value;
  const method = document.getElementById('insemMethod')?.value || 'Suni Tohumlama';
  const sire = document.getElementById('insemSire')?.value || '';
  const vet = document.getElementById('insemVet')?.value || 'Dr. Nilüfer Çetin';
  const notes = document.getElementById('insemNotes')?.value || '';

  if (!animalId || !insemDate || !sire) {
    alert('Lütfen hayvan, tohumlama tarihi ve boğa/sperm kodunu eksiksiz doldurunuz.');
    return;
  }

  const animal = state.animals.find(a => a.id === animalId);
  if (!animal) {
    alert('Seçilen hayvan sistemde bulunamadı.');
    return;
  }

  const addDays = (base, days) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const heatDate = addDays(insemDate, 21);
  const ultraDate = addDays(insemDate, 60);
  const dryDate = addDays(insemDate, 220);
  const calvingDate = addDays(insemDate, 280);

  animal.status = 'Tohumlandı (Gebe Adayı)';
  animal.sire = sire;
  if (!animal.healthLogs) animal.healthLogs = [];
  animal.healthLogs.push({
    date: insemDate,
    procedure: `Suni Tohumlama: ${sire} (${method})${notes ? ' - ' + notes : ''}`,
    staff: vet,
    result: 'Uygulandı'
  });

  if (!state.tasks) state.tasks = [];
  const tag = animal.earTag;

  state.tasks.unshift({
    id: 'tsk-' + Date.now() + '-1',
    title: `${tag} - 21. Gün Kızgınlık Tekrarı Kontrolü`,
    sub: `${animal.name || animal.breed} tohumlandı (${sire}). Kızgınlık belirtisi var mı gözlemle.`,
    category: 'BREEDING',
    priority: 'HIGH',
    dueDate: heatDate,
    assignee: vet,
    relatedAnimal: tag,
    done: false
  });

  state.tasks.unshift({
    id: 'tsk-' + Date.now() + '-2',
    title: `${tag} - Ultrason Gebelik Muayenesi (60. Gün)`,
    sub: `Rektal muayene / ultrason ile kesin gebelik tespiti yapılacak.`,
    category: 'HEALTH',
    priority: 'HIGH',
    dueDate: ultraDate,
    assignee: vet,
    relatedAnimal: tag,
    done: false
  });

  state.tasks.unshift({
    id: 'tsk-' + Date.now() + '-3',
    title: `${tag} - Kuruya Alma & Sağımı Kesme (220. Gün)`,
    sub: `Doğuma 60 gün kala sağım kesilecek ve kuru dönem rasyonuna geçirilecek.`,
    category: 'HEALTH',
    priority: 'MEDIUM',
    dueDate: dryDate,
    assignee: 'Mehmet Bakıcı',
    relatedAnimal: tag,
    done: false
  });

  state.tasks.unshift({
    id: 'tsk-' + Date.now() + '-4',
    title: `🎉 ${tag} - Tahmini Buzağılama & Doğum (280. Gün)`,
    sub: `Doğum padoğuna sevk edilecek. Baba: ${sire}.`,
    category: 'BREEDING',
    priority: 'HIGH',
    dueDate: calvingDate,
    assignee: vet,
    relatedAnimal: tag,
    done: false
  });

  saveState();
  logAudit('SUNİ TOHUMLAMA', `${tag} (${animal.name || animal.breed}) tohumlandı. Boğa: ${sire}, Yöntem: ${method}, Tahmini Doğum: ${calvingDate}`);

  closeModal('modalInsemination');
  renderAnimalsTable();
  renderTasksTable();
  renderDashboard();
  showToastNotification(`✅ ${tag} için suni tohumlama kaydı ve 4 gebelik takvim görevi başarıyla oluşturuldu.`);
}

// 2. CSV / Excel Toplu İçe Aktarma Modülü
let currentImportType = 'animals';
let parsedImportData = [];

function openImportModal(type = 'animals') {
  currentImportType = type;
  parsedImportData = [];
  switchImportType(type);

  const previewArea = document.getElementById('importPreviewArea');
  if (previewArea) previewArea.style.display = 'none';

  const confirmBtn = document.getElementById('btnConfirmImport');
  if (confirmBtn) confirmBtn.disabled = true;

  const fileInput = document.getElementById('csvFileInput');
  if (fileInput) fileInput.value = '';

  openModal('modalImport');
}

function switchImportType(type) {
  currentImportType = type;
  const btnAnimals = document.getElementById('btnImportTabAnimals');
  const btnContacts = document.getElementById('btnImportTabContacts');
  const descEl = document.getElementById('importTemplateDesc');

  if (btnAnimals && btnContacts) {
    if (type === 'animals') {
      btnAnimals.className = 'btn btn-sm btn-secondary';
      btnContacts.className = 'btn btn-sm btn-ghost';
      if (descEl) descEl.textContent = 'Hayvan küpe no, ad, ırk, kategori, cinsiyet, padok ve ağırlık sütunlarını içerir.';
    } else {
      btnAnimals.className = 'btn btn-sm btn-ghost';
      btnContacts.className = 'btn btn-sm btn-secondary';
      if (descEl) descEl.textContent = 'Cari ünvan, cari türü (CUSTOMER/SUPPLIER), telefon ve bakiye sütunlarını içerir.';
    }
  }

  const previewArea = document.getElementById('importPreviewArea');
  if (previewArea) previewArea.style.display = 'none';
  const confirmBtn = document.getElementById('btnConfirmImport');
  if (confirmBtn) confirmBtn.disabled = true;
  parsedImportData = [];
}

function downloadImportSampleCsv() {
  let filename = '';
  let csvContent = '\uFEFF';

  if (currentImportType === 'animals') {
    filename = 'ozate_hayvan_yukleme_sablonu.csv';
    csvContent += 'Küpe No;Hayvan Adı;Irk;Kategori;Cinsiyet;Padok;Canlı Ağırlık (kg);Durum\r\n';
    csvContent += 'TR16-000101;Sarıkız;Holstein;Süt İneği;Dişi;Sağmal 1;640;Sağmal (Aktif)\r\n';
    csvContent += 'TR16-000102;Tosun Paşa;Simental;Besi Danası;Erkek;Besi Bölme A;520;Besi (Aktif)\r\n';
    csvContent += 'TR16-000103;Nazlı;Montofon;Gebe Düve;Dişi;Kuru Dönem;480;Gebe Düve\r\n';
  } else {
    filename = 'ozate_cari_yukleme_sablonu.csv';
    csvContent += 'Cari Adı / Ünvanı;Tür;Telefon;Başlangıç Bakiyesi (TL)\r\n';
    csvContent += 'Bursa Süt Üreticileri Birliği;CUSTOMER;0224 220 00 00;15000\r\n';
    csvContent += 'Marmara Yem Sanayi A.Ş.;SUPPLIER;0224 440 11 22;-8500\r\n';
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function handleCsvFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    parseAndPreviewCsv(text);
  };
  reader.readAsText(file, 'UTF-8');
}

function parseAndPreviewCsv(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) {
    alert('Hata: CSV dosyasında en az bir başlık ve bir veri satırı bulunmalıdır.');
    return;
  }

  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delimiter).map(h => h.replace(/^["']|["']$/g, '').trim());

  parsedImportData = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map(c => c.replace(/^["']|["']$/g, '').trim());
    if (cols.length >= 2 && cols.some(c => c !== '')) {
      parsedImportData.push(cols);
    }
  }

  if (parsedImportData.length === 0) {
    alert('Hata: CSV dosyasında geçerli veri satırı bulunamadı.');
    return;
  }

  const thead = document.getElementById('importPreviewThead');
  const tbody = document.getElementById('importPreviewTbody');
  const countEl = document.getElementById('importPreviewCount');
  const previewArea = document.getElementById('importPreviewArea');
  const confirmBtn = document.getElementById('btnConfirmImport');

  if (thead) {
    thead.innerHTML = '<tr>' + headers.map(h => `<th>${escapeHtml(h)}</th>`).join('') + '</tr>';
  }
  if (tbody) {
    tbody.innerHTML = '';
    parsedImportData.slice(0, 8).forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = row.map(c => `<td>${escapeHtml(c)}</td>`).join('');
      tbody.appendChild(tr);
    });
    if (parsedImportData.length > 8) {
      const moreTr = document.createElement('tr');
      moreTr.innerHTML = `<td colspan="${headers.length}" style="text-align:center; color:var(--text-muted); font-style:italic;">... ve ${parsedImportData.length - 8} satır daha</td>`;
      tbody.appendChild(moreTr);
    }
  }

  if (countEl) countEl.textContent = `${parsedImportData.length} Satır Okundu`;
  if (previewArea) previewArea.style.display = 'block';
  if (confirmBtn) confirmBtn.disabled = false;
}

function confirmExecuteImport() {
  if (parsedImportData.length === 0) {
    alert('İçe aktarılacak veri bulunamadı.');
    return;
  }

  let importedCount = 0;

  if (currentImportType === 'animals') {
    parsedImportData.forEach((row, idx) => {
      const earTag = row[0] || `TR16-IMP-${Date.now().toString().slice(-4)}${idx}`;
      if (state.animals.some(a => a.earTag === earTag)) return;

      const newAnimal = {
        id: 'an-' + Date.now() + '-' + idx,
        earTag: earTag,
        name: row[1] || '',
        breed: row[2] || 'Holstein',
        category: row[3] || 'Süt İneği',
        gender: row[4] || 'Dişi',
        paddock: row[5] || 'Sağmal 1',
        weight: parseFloat(row[6]) || 500,
        yield: '28 L/gün',
        status: row[7] || 'Sağmal (Aktif)',
        health: 'İyi',
        dam: '-',
        sire: '-',
        weights: [{ date: new Date().toISOString().split('T')[0], weight: parseFloat(row[6]) || 500, adg: '+0.8 kg/gün', paddock: row[5] || 'Sağmal 1' }],
        healthLogs: [{ date: new Date().toISOString().split('T')[0], procedure: 'İşletmeye Toplu Giriş (CSV)', staff: 'Sistem', result: 'Kabul Edildi' }]
      };
      state.animals.push(newAnimal);
      importedCount++;
    });

    saveState();
    logAudit('CSV İÇE AKTARMA', `${importedCount} adet büyükbaş hayvan CSV dosyasından sisteme aktarıldı.`);
    renderAnimalsTable();
    renderDashboard();
    closeModal('modalImport');
    showToastNotification(`🎉 ${importedCount} adet hayvan başarıyla çiftlik sürüsüne eklendi!`);
  } else {
    parsedImportData.forEach((row, idx) => {
      const name = row[0];
      if (!name) return;
      if (state.contacts.some(c => c.name.toLowerCase() === name.toLowerCase())) return;

      const newContact = {
        id: 'ct-' + Date.now() + '-' + idx,
        name: name,
        type: (row[1] && row[1].toUpperCase().includes('SUP')) ? 'SUPPLIER' : 'CUSTOMER',
        phone: row[2] || '',
        balance: parseFloat(row[3]) || 0
      };
      state.contacts.push(newContact);
      importedCount++;
    });

    saveState();
    logAudit('CSV İÇE AKTARMA', `${importedCount} adet cari hesap CSV dosyasından aktarıldı.`);
    renderContactsTable();
    populateAccountDropdowns();
    closeModal('modalImport');
    showToastNotification(`🎉 ${importedCount} adet cari hesap başarıyla rehbere eklendi!`);
  }
}

// 3. Parametre Ekleme Formu
function handleParamAdd(e) {
  e.preventDefault();
  const input = document.getElementById('paramNewInput');
  const val = input ? input.value.trim() : '';
  if (!val) return;

  const catKey = (typeof currentParamCategory !== 'undefined' && currentParamCategory) 
    ? currentParamCategory 
    : ((typeof currentDefTab !== 'undefined' && PARAM_TAB_CONFIG[currentDefTab]) ? PARAM_TAB_CONFIG[currentDefTab].key : 'incomeCategories');

  if (!state.parameters) state.parameters = {};
  if (!state.parameters[catKey]) state.parameters[catKey] = [];

  if (state.parameters[catKey].includes(val)) {
    alert('Bu tanım zaten listede mevcut.');
    return;
  }

  state.parameters[catKey].push(val);
  saveState();
  logAudit('TANIM EKLEME', `[${catKey}] kategorisine yeni tanım eklendi: "${val}"`);

  if (input) input.value = '';
  
  if (typeof renderParametersModalItems === 'function') renderParametersModalItems(catKey);
  if (typeof renderDefinitionsPage === 'function') renderDefinitionsPage();
  if (typeof syncAllDropdowns === 'function') syncAllDropdowns();

  showToastNotification(`✅ "${val}" başarıyla tanımlara eklendi.`);
}

// =============================================================================
// 14c. MENÜ VE MODÜL GÖRÜNÜRLÜĞÜ YÖNETİMİ (SADELEŞTİRME & ÖZELLEŞTİRME)
// =============================================================================

const MENU_VISIBILITY_KEY = 'ozate_menu_visibility';

const APP_MENU_MODULES = [
  { id: 'dashboard', name: 'Gösterge Paneli', icon: '📊', desc: 'Genel özet, KPI ve günlük çiftlik durumu', core: true },
  { id: 'transactions', name: 'Gelir & Gider', icon: '💰', desc: 'Günlük finans defteri ve kasa hareketleri' },
  { id: 'accounts', name: 'Kasa & Bankalar', icon: '🏦', desc: 'Ziraat bankası, nakit kasası ve virmanlar' },
  { id: 'contacts', name: 'Cari & Müşteriler', icon: '👥', desc: 'Sütaş, toplayıcı ve yem tedarikçi carileri' },
  { id: 'checks', name: 'Çek Takip & Portföy', icon: '🧾', desc: 'Çek portföyü, vade takibi ve ciro işlemleri' },
  { id: 'animals', name: 'Büyükbaş Sürü', icon: '🐄', desc: 'İnek, düve, dana ve buzağı kartları' },
  { id: 'sheep', name: 'Küçükbaş Sürü', icon: '🐑', desc: 'Koyun, keçi, koç katımı ve kırkım takibi' },
  { id: 'qurban', name: 'Kurban Satış & Kesim', icon: '⭐', desc: 'Kurban sipariş, tahsilat ve kesim takibi' },
  { id: 'milk', name: 'Süt Üretimi', icon: '🥛', desc: 'Sabah/akşam sağımı ve soğutma tankları' },
  { id: 'inventory', name: 'Yem & Stok Deposu', icon: '📦', desc: 'Silaj, yonca, yem ve aşı kritik stokları' },
  { id: 'tasks', name: 'Görevler & Takvim', icon: '📅', desc: 'Aşı, tohumlama ve operasyonel iş listesi' },
  { id: 'reports', name: 'Raporlar & Analiz', icon: '📈', desc: 'Dönemsel kâr-zarar ve maliyet analitiği' },
  { id: 'users', name: 'Kullanıcı Yönetimi', icon: '👤', desc: 'Çiftlik personeli, PIN ve yetkilendirme' },
  { id: 'definitions', name: 'Çiftlik Tanımları', icon: '🏷️', desc: 'Padok, ırk ve kategori parametreleri' },
  { id: 'settings', name: 'Çiftlik Ayarları', icon: '⚙️', desc: 'Çiftlik profili ve bulut ayarları', core: true },
  { id: 'security', name: 'Sistem Güvenliği', icon: '🛡️', desc: 'Veri yedeği (JSON) ve denetim logları' }
];

function getMenuVisibilityConfig() {
  const saved = localStorage.getItem(MENU_VISIBILITY_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch(e) {}
  }
  // Varsayılan: Sol menüdeki TÜM başlıklar tamamen görünür
  const def = {};
  APP_MENU_MODULES.forEach(m => {
    def[m.id] = true;
  });
  return def;
}

function setMenuVisibility(menuId, isVisible) {
  const cfg = getMenuVisibilityConfig();
  cfg[menuId] = isVisible;
  localStorage.setItem(MENU_VISIBILITY_KEY, JSON.stringify(cfg));
  applyMenuVisibility();
  renderMenuVisibilityPanel();
  showToastNotification(`Menü görünürlüğü güncellendi: ${isVisible ? 'Görünür' : 'Gizlendi'}`);
}

function resetDefaultMenuVisibility() {
  localStorage.removeItem(MENU_VISIBILITY_KEY);
  applyMenuVisibility();
  renderMenuVisibilityPanel();
  showToastNotification('Menü ayarları varsayılana sıfırlandı.');
}

function applyMenuVisibility() {
  const cfg = getMenuVisibilityConfig();

  // Önce tüm bilinen nav-link'leri göster (temiz başlangıç)
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    // Sadece applyRolePermissions tarafından yönetilmeyenler için reset
    link.style.display = 'flex';
  });

  APP_MENU_MODULES.forEach(m => {
    const isVisible = cfg[m.id] !== false;
    
    // Sidebar linki
    const navLink = document.getElementById('nav-' + m.id);
    if (navLink) {
      navLink.style.display = isVisible ? 'flex' : 'none';
    }

    // Mobil alt bardaki buton (varsa)
    const mobileBtn = document.querySelector(`.mobile-nav-item[data-page="${m.id}"]`);
    if (mobileBtn) {
      mobileBtn.style.display = isVisible ? 'flex' : 'none';
    }
  });

  // Rol kısıtlamalarını yeniden uygula (menü görünürlüğü sonrası)
  applyRolePermissions();

  // Eğer şu an aktif olan sayfa gizlendiyse dashboard'a yönlendir
  const currentHash = window.location.hash.replace('#', '') || 'dashboard';
  if (cfg[currentHash] === false) {
    navigateToPage('dashboard');
  }
}

function openMenuCustomizeModal() {
  renderMenuCheckboxesInContainer('modalMenuCheckboxesContainer');
  openModal('modalMenuCustomize');
}

function toggleAllMenus(showAll = true) {
  const cfg = {};
  APP_MENU_MODULES.forEach(m => {
    cfg[m.id] = showAll;
  });
  localStorage.setItem(MENU_VISIBILITY_KEY, JSON.stringify(cfg));
  applyMenuVisibility();
  renderMenuVisibilityPanel();
  renderMenuCheckboxesInContainer('modalMenuCheckboxesContainer');
  showToastNotification(showAll ? 'Tüm menü başlıkları görünür yapıldı.' : 'Seçilenler güncellendi.');
}

function renderMenuCheckboxesInContainer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const cfg = getMenuVisibilityConfig();

  APP_MENU_MODULES.forEach(m => {
    const isChecked = cfg[m.id] !== false;
    const isCore = !!m.core;

    const row = document.createElement('label');
    row.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: var(--radius-md);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      cursor: ${isCore ? 'default' : 'pointer'};
      user-select: none;
      transition: background 0.15s ease, border-color 0.15s ease;
    `;

    row.innerHTML = `
      <input type="checkbox" id="chk_${containerId}_${m.id}" ${isChecked ? 'checked' : ''} ${isCore ? 'disabled' : ''} 
        onchange="setMenuVisibility('${m.id}', this.checked)" 
        style="width: 17px; height: 17px; accent-color: var(--brand-primary); cursor: ${isCore ? 'default' : 'pointer'};">
      <span style="font-size: 1.15rem; line-height: 1;">${m.icon}</span>
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 600; font-size: 0.8rem; color: var(--text-main); display: flex; align-items: center; gap: 5px;">
          <span>${m.name}</span>
          ${isCore ? '<span class="tag-badge" style="font-size: 0.58rem; padding: 1px 4px; opacity: 0.8;">Zorunlu</span>' : ''}
        </div>
        <div style="font-size: 0.67rem; color: var(--text-muted);">${m.desc}</div>
      </div>
    `;

    container.appendChild(row);
  });
}

function renderMenuVisibilityPanel() {
  renderMenuCheckboxesInContainer('menuVisibilityOptionsContainer');
}

// =============================================================================
// 15. EVENT LISTENERS VE BAŞLANGIÇ


document.addEventListener('DOMContentLoaded', () => {
  loadState();
  applyMenuVisibility(); // applyRolePermissions'ı da içeride çağırır
  checkUserSession();
  renderAnimalFilterPaddocks();
  populateAccountDropdowns();

  // Supabase Bulut Veritabanı Başlatma & Arka Plan Senkronizasyonu
  if (typeof initSupabaseClient === 'function') {
    initSupabaseClient();
    if (typeof fetchCompleteFarmFromSupabase === 'function' && typeof getSupabaseConfig === 'function' && getSupabaseConfig().enabled) {
      fetchCompleteFarmFromSupabase().then(cloudState => {
        if (cloudState && Array.isArray(cloudState.animals) && cloudState.animals.length > 0) {
          state = cloudState;
          saveState();
          const cur = window.location.hash.replace('#', '') || 'dashboard';
          navigateToPage(cur);
          syncAllDropdowns();
          console.log('☁️ Supabase bulut verileriyle sayfa güncellendi.');
        }
      }).catch(e => console.warn('Supabase arka plan çekme hatası:', e));
    }
  }

  // Ekrana sığdırma tercihi kontrolü
  if (localStorage.getItem('ozate_fit_screen') === 'true') {
    document.body.classList.add('fit-to-screen');
    updateFitScreenUI(true);
  }

  // URL Hash yönlendirmesi
  const initialHash = window.location.hash.replace('#', '') || 'dashboard';
  navigateToPage(initialHash);

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    navigateToPage(hash || 'dashboard');
  });

  // Sidebar Tıklamaları
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const page = link.dataset.page;
      if (!page) return;
      e.preventDefault();
      window.location.hash = page;
      navigateToPage(page);
    });
  });

  // Mobil Alt Bar Tıklamaları
  document.querySelectorAll('.mobile-nav-item:not(.mobile-fab-item)').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      window.location.hash = page;
      navigateToPage(page);
    });
  });

  // Hızlı İşlem Butonları (+ Hızlı İşlem ve Mobil Fab)
  const quickActionBtn = document.getElementById('openQuickActionBtn');
  if (quickActionBtn) {
    quickActionBtn.addEventListener('click', () => openModal('modalQuickAction'));
  }

  const mobileFab = document.getElementById('mobileQuickFab');
  if (mobileFab) {
    mobileFab.addEventListener('click', () => openModal('modalQuickAction'));
  }

  // Mobil Hamburger Menü
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      document.getElementById('appSidebar').classList.toggle('mobile-open');
    });
  }

  // Tema Değiştirici ve Senkronizasyonu
  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('ozate_theme', theme);

    const btnDark = document.getElementById('themeBtnDark');
    const btnLight = document.getElementById('themeBtnLight');
    if (btnDark) btnDark.classList.toggle('active', theme === 'dark');
    if (btnLight) btnLight.classList.toggle('active', theme === 'light');
  }

  const savedTheme = localStorage.getItem('ozate_theme') || 'dark';
  setTheme(savedTheme);

  const themeBtnDark = document.getElementById('themeBtnDark');
  if (themeBtnDark) {
    themeBtnDark.addEventListener('click', () => setTheme('dark'));
  }

  const themeBtnLight = document.getElementById('themeBtnLight');
  if (themeBtnLight) {
    themeBtnLight.addEventListener('click', () => setTheme('light'));
  }

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Tablo Filtreleri
  const txFilterIds = ['filterTxType', 'filterTxStatus', 'filterTxCategory'];
  txFilterIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderTransactionsTable);
  });

  const anFilterIds = ['filterAnimalPaddock', 'filterAnimalCategory', 'filterAnimalBreed'];
  anFilterIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderAnimalsTable);
  });

  // CSV Dışa Aktar Butonları
  const expTx = document.getElementById('exportTransactionsCsvBtn');
  if (expTx) expTx.addEventListener('click', exportTransactionsCsv);

  const expAn = document.getElementById('exportAnimalsCsvBtn');
  if (expAn) expAn.addEventListener('click', exportAnimalsCsv);

  // Genel Arama
  const globalSearch = document.getElementById('globalSearchInput');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderTransactionsTable();
        renderAnimalsTable();
        return;
      }
      // Hangi sayfadaysak orada filtreleme yap
      const currentView = document.querySelector('.page-view.active');
      if (currentView && currentView.id === 'view-animals') {
        const rows = document.querySelectorAll('#animalsTbody tr');
        rows.forEach(r => {
          r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      } else if (currentView && currentView.id === 'view-sheep') {
        const rows = document.querySelectorAll('#sheepTbody tr');
        rows.forEach(r => {
          r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      } else if (currentView && currentView.id === 'view-transactions') {
        const rows = document.querySelectorAll('#transactionsTbody tr');
        rows.forEach(r => {
          r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      }
    });
  }

  // Service Worker Kaydı (PWA Çevrimdışı Desteği)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
      console.log('Özate PWA Service Worker devrede.');
    }).catch(err => {
      console.log('Service Worker kaydı atlandı:', err);
    });
  }
});
