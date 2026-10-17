// =============================================================================
// ÖZATE ÇİFTLİĞİ ERP - SUPABASE İLİŞKİSEL VERİTABANI İSTEMCİSİ
// Modüler veri erişim katmanı ve PostgreSQL senkronizasyon servisi
// =============================================================================

const SUPABASE_CONFIG_KEY = 'ozate_supabase_config';

const DEFAULT_SUPABASE_URL = 'https://tzzlqpdpyixezuxpwygc.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_bUd0XME2t7QMwpNrut0yQg_Yf0YMHjb';

// 1. Yapılandırma Yönetimi
function getSupabaseConfig() {
  const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        url: parsed.url || DEFAULT_SUPABASE_URL,
        key: parsed.key || DEFAULT_SUPABASE_KEY,
        enabled: parsed.enabled !== undefined ? parsed.enabled : true
      };
    } catch (e) {
      console.warn('Supabase config parse hatası:', e);
    }
  }
  return {
    url: DEFAULT_SUPABASE_URL,
    key: DEFAULT_SUPABASE_KEY,
    enabled: true
  };
}

function saveSupabaseConfig(url, key, enabled = true) {
  const config = { 
    url: (url || DEFAULT_SUPABASE_URL).trim(), 
    key: (key || DEFAULT_SUPABASE_KEY).trim(), 
    enabled 
  };
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
  initSupabaseClient();
  return config;
}

let supabaseClient = null;

// 2. İstemciyi Başlat
function initSupabaseClient() {
  const cfg = getSupabaseConfig();
  if (cfg.enabled && cfg.url && cfg.key && window.supabase && window.supabase.createClient) {
    try {
      supabaseClient = window.supabase.createClient(cfg.url, cfg.key);
      console.log('✅ Supabase bağlantısı başlatıldı:', cfg.url);
      updateSupabaseStatusBadge(true);
      return true;
    } catch (err) {
      console.error('❌ Supabase başlatma hatası:', err);
      updateSupabaseStatusBadge(false, err.message);
      return false;
    }
  }
  supabaseClient = null;
  updateSupabaseStatusBadge(false, 'Bağlantı henüz yapılandırılmadı (Yerel Mod)');
  return false;
}

// 3. Bağlantı Testi
async function testSupabaseConnection(url = null, key = null) {
  const targetUrl = url || (getSupabaseConfig().url);
  const targetKey = key || (getSupabaseConfig().key);

  if (!targetUrl || !targetKey) {
    return { success: false, message: 'Lütfen Supabase Proje URL ve Anon Key giriniz.' };
  }

  if (!window.supabase || !window.supabase.createClient) {
    return { success: false, message: 'Supabase JS kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol ediniz.' };
  }

  try {
    const testClient = window.supabase.createClient(targetUrl, targetKey);
    const { data, error } = await testClient.from('farm_settings').select('id, name').limit(1);

    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return { 
          success: false, 
          isSchemaMissing: true,
          message: 'Supabase bağlantısı ve API anahtarı DOĞRULANDI! 🎉\n\nAncak veritabanında henüz tablolar oluşturulmamış.\nLütfen Supabase Dashboard > SQL Editor sekmesinde "supabase_schema.sql" dosyasını çalıştırınız.' 
        };
      }
      return { success: false, message: `Supabase Hatası (${error.code || 'Bilinmiyor'}): ${error.message}` };
    }

    return { 
      success: true, 
      message: 'Supabase PostgreSQL veritabanı bağlantısı başarıyla doğrulandı!',
      farmName: data && data[0] ? data[0].name : null
    };
  } catch (e) {
    return { success: false, message: 'Bağlantı hatası: ' + e.message };
  }
}

// 4. Durum Rozeti Güncelleyici
function updateSupabaseStatusBadge(isConnected, msg = '') {
  const badge = document.getElementById('supabaseStatusBadge');
  if (badge) {
    if (isConnected) {
      badge.className = 'badge positive';
      badge.innerHTML = '🟢 Supabase Bağlı';
      badge.title = 'Veriler bulut PostgreSQL veritabanıyla senkronize';
    } else {
      badge.className = 'badge warning';
      badge.innerHTML = '🟡 Yerel Mod (Offline)';
      badge.title = msg || 'Veriler tarayıcınızın yerel hafızasında saklanıyor';
    }
  }
}

// =============================================================================
// 5. BULUTTAN TÜM VERİLERİ ÇEK (FETCH COMPLETE STATE)
// =============================================================================
async function fetchCompleteFarmFromSupabase() {
  if (!supabaseClient) return null;

  try {
    console.log('🔄 Supabase bulut veritabanından çiftlik verileri çekiliyor...');

    // Paralel sorgular
    const [
      farmRes, paramsRes, accRes, contactRes,
      cattleRes, cattleWeightsRes, cattleHealthRes,
      sheepRes, sheepHealthRes, shearingsRes, matingRes,
      tanksRes, milkRes, inventoryRes, txRes, trRes,
      tasksRes, usersRes, logsRes,
      checksRes, qurbanRes, qurbanSharesRes
    ] = await Promise.all([
      supabaseClient.from('farm_settings').select('*').limit(1),
      supabaseClient.from('farm_parameters').select('*').order('display_order', { ascending: true }),
      supabaseClient.from('accounts').select('*'),
      supabaseClient.from('contacts').select('*'),
      supabaseClient.from('cattle_animals').select('*'),
      supabaseClient.from('cattle_weights').select('*'),
      supabaseClient.from('cattle_health_logs').select('*'),
      supabaseClient.from('sheep_animals').select('*'),
      supabaseClient.from('sheep_health_logs').select('*'),
      supabaseClient.from('sheep_shearings').select('*'),
      supabaseClient.from('sheep_mating_seasons').select('*'),
      supabaseClient.from('milk_tanks').select('*'),
      supabaseClient.from('milk_productions').select('*'),
      supabaseClient.from('inventory_items').select('*'),
      supabaseClient.from('transactions').select('*'),
      supabaseClient.from('transfers').select('*'),
      supabaseClient.from('tasks').select('*'),
      supabaseClient.from('farm_users').select('*'),
      supabaseClient.from('audit_logs').select('*'),
      supabaseClient.from('checks').select('*'),
      supabaseClient.from('qurban_animals').select('*'),
      supabaseClient.from('qurban_shares').select('*')
    ]);

    // Hata kontrolü: Herhangi bir temel tablo hatası varsa veya tablolar henüz yoksa null dön
    const hasAnyError = [farmRes, paramsRes, accRes, contactRes, cattleRes, sheepRes, milkRes, inventoryRes, txRes, tasksRes]
      .some(res => res && res.error);
    if (hasAnyError) {
      console.warn('Supabase bulut tabloları henüz hazır değil veya erişilemiyor. Yerel veriler kullanılıyor.');
      return null;
    }

    // Eğer bulutta henüz hiç hayvan kaydı yoksa (boş veritabanı), yerel verileri ezme
    if (!cattleRes.data || cattleRes.data.length === 0) {
      console.log('ℹ️ Supabase bulut veritabanında henüz hayvan kaydı yok, yerel veriler korunuyor.');
      return null;
    }

    // State nesnesini normalize tablolardan oluştur
    const newState = {
      farm: farmRes.data && farmRes.data[0] ? {
        name: farmRes.data[0].name,
        location: farmRes.data[0].location,
        owner: farmRes.data[0].owner,
        activeCows: farmRes.data[0].active_cows,
        currency: farmRes.data[0].currency,
        phone: farmRes.data[0].phone,
        email: farmRes.data[0].email,
        taxId: farmRes.data[0].tax_id
      } : DEFAULT_STATE.farm,

      parameters: {},
      accounts: (accRes.data || []).map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        iban: a.iban,
        balance: parseFloat(a.balance) || 0
      })),

      contacts: (contactRes.data || []).map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        phone: c.phone,
        balance: parseFloat(c.balance) || 0
      })),

      animals: (cattleRes.data || []).map(an => ({
        id: an.id,
        earTag: an.ear_tag,
        name: an.name,
        breed: an.breed,
        category: an.category,
        gender: an.gender,
        paddock: an.paddock,
        weight: parseFloat(an.weight) || 0,
        yield: an.yield,
        status: an.status,
        health: an.health,
        dam: an.dam,
        sire: an.sire,
        weights: (cattleWeightsRes.data || [])
          .filter(w => w.animal_id === an.id)
          .map(w => ({ date: w.date, weight: parseFloat(w.weight), adg: w.adg, paddock: w.paddock })),
        healthLogs: (cattleHealthRes.data || [])
          .filter(h => h.animal_id === an.id)
          .map(h => ({ date: h.date, procedure: h.procedure, staff: h.staff, result: h.result }))
      })),

      sheep: (sheepRes.data || []).map(sh => ({
        id: sh.id,
        earTag: sh.ear_tag,
        name: sh.name,
        breed: sh.breed,
        category: sh.category,
        gender: sh.gender,
        barn: sh.barn,
        weight: parseFloat(sh.weight) || 0,
        birthType: sh.birth_type,
        status: sh.status,
        reproStatus: sh.repro_status,
        matingDate: sh.mating_date,
        matingRam: sh.mating_ram,
        estLambingDate: sh.est_lambing_date,
        dam: sh.dam,
        sire: sh.sire,
        healthLogs: (sheepHealthRes.data || [])
          .filter(h => h.sheep_id === sh.id)
          .map(h => ({ date: h.date, procedure: h.procedure, staff: h.staff, result: h.result }))
      })),

      shearings: (shearingsRes.data || []).map(s => ({
        id: s.id,
        date: s.date,
        barn: s.barn,
        count: s.count,
        weight: parseFloat(s.weight),
        notes: s.notes
      })),

      matingSeasons: (matingRes.data || []).map(m => ({
        id: m.id,
        date: m.date,
        barn: m.barn,
        ram: m.ram,
        notes: m.notes
      })),

      tanks: {},
      milkProductions: (milkRes.data || []).map(m => ({
        id: m.id,
        date: m.date,
        session: m.session,
        liters: parseFloat(m.liters),
        tank: m.tank,
        fat: parseFloat(m.fat),
        notes: m.notes
      })),

      inventory: (inventoryRes.data || []).map(i => ({
        id: i.id,
        name: i.name,
        category: i.category,
        quantity: parseFloat(i.quantity),
        unit: i.unit,
        minAlert: parseFloat(i.min_alert),
        unitCost: parseFloat(i.unit_cost)
      })),

      transactions: (txRes.data || []).map(t => ({
        id: t.id,
        date: t.date,
        type: t.type,
        category: t.category,
        amount: parseFloat(t.amount),
        paidAmount: parseFloat(t.paid_amount),
        status: t.status,
        contactId: t.contact_id,
        accountId: t.account_id,
        desc: t.description
      })),

      transfers: (trRes.data || []).map(t => ({
        id: t.id,
        date: t.date,
        fromAcc: t.from_account,
        toAcc: t.to_account,
        amount: parseFloat(t.amount),
        note: t.note
      })),

      tasks: (tasksRes.data || []).map(t => ({
        id: t.id,
        title: t.title,
        sub: t.sub_text,
        category: t.category,
        priority: t.priority,
        dueDate: t.due_date,
        assignee: t.assignee,
        relatedAnimal: t.related_animal,
        done: t.is_done
      })),

      users: (usersRes.data || []).map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        title: u.title,
        pin: u.pin,
        status: u.status
      })),

      auditLogs: (logsRes.data || []).map(l => ({
        id: l.id,
        timestamp: l.timestamp,
        type: l.log_type,
        user: l.user_name,
        details: l.details
      })),

      checks: (checksRes && checksRes.data ? checksRes.data : []).map(c => ({
        id: c.id,
        checkNumber: c.check_number,
        type: c.type,
        amount: parseFloat(c.amount) || 0,
        issueDate: c.issue_date,
        dueDate: c.due_date,
        drawer: c.drawer,
        bankName: c.bank_name,
        branchName: c.branch_name || '',
        accountNo: c.account_no || '',
        contactId: c.contact_id || null,
        status: c.status || 'PORTFOLIO',
        endorsedToContactId: c.endorsed_to_contact_id || null,
        targetAccountId: c.target_account_id || null,
        notes: c.notes || ''
      })),

      qurbanAnimals: (qurbanRes && qurbanRes.data ? qurbanRes.data : []).map(q => ({
        id: q.id,
        qurbanNo: q.qurban_no,
        animalType: q.animal_type,
        sourceAnimalId: q.source_animal_id || null,
        earTag: q.ear_tag || '',
        breed: q.breed || '',
        liveWeight: parseFloat(q.live_weight) || 0,
        carcassWeight: parseFloat(q.carcass_weight) || 0,
        totalPrice: parseFloat(q.total_price) || 0,
        shareCount: parseInt(q.share_count) || 7,
        slaughterDay: parseInt(q.slaughter_day) || 1,
        slaughterOrder: q.slaughter_order ? parseInt(q.slaughter_order) : null,
        slaughterTime: q.slaughter_time || '',
        status: q.status || 'AVAILABLE',
        notes: q.notes || ''
      })),

      qurbanShares: (qurbanSharesRes && qurbanSharesRes.data ? qurbanSharesRes.data : []).map(s => ({
        id: s.id,
        qurbanId: s.qurban_id,
        shareIndex: parseInt(s.share_index) || 1,
        shareholderName: s.shareholder_name,
        phone: s.phone,
        sharePrice: parseFloat(s.share_price) || 0,
        depositAmount: parseFloat(s.deposit_amount) || 0,
        paymentStatus: s.payment_status || 'UNPAID',
        paymentMethod: s.payment_method || 'CASH',
        checkId: s.check_id || null,
        contactId: s.contact_id || null,
        proxyGiven: !!s.proxy_given,
        meatWeight: parseFloat(s.meat_weight) || 0,
        isDelivered: !!s.is_delivered,
        notes: s.notes || ''
      }))
    };

    // Tankları formatla
    (tanksRes.data || []).forEach(t => {
      newState.tanks[t.id] = {
        name: t.name,
        current: parseFloat(t.current_liters),
        capacity: parseFloat(t.capacity_liters),
        temp: parseFloat(t.temp)
      };
    });
    if (Object.keys(newState.tanks).length === 0) {
      newState.tanks = JSON.parse(JSON.stringify(DEFAULT_STATE.tanks));
    }

    // Parametreleri grupla
    if (paramsRes.data && paramsRes.data.length > 0) {
      paramsRes.data.forEach(p => {
        if (!newState.parameters[p.category]) newState.parameters[p.category] = [];
        newState.parameters[p.category].push(p.item_name);
      });
    } else {
      newState.parameters = JSON.parse(JSON.stringify(DEFAULT_STATE.parameters));
    }

    // Buluttan boş gelen alt modül dizilerini (eğer henüz buluta aktarılmamışsa) varsayılan verilerle koru
    if (!newState.transfers || newState.transfers.length === 0) {
      newState.transfers = JSON.parse(JSON.stringify(DEFAULT_STATE.transfers || []));
    }
    if (!newState.qurbanAnimals || newState.qurbanAnimals.length === 0) {
      newState.qurbanAnimals = JSON.parse(JSON.stringify(DEFAULT_STATE.qurbanAnimals || []));
    }
    if (!newState.qurbanShares || newState.qurbanShares.length === 0) {
      newState.qurbanShares = JSON.parse(JSON.stringify(DEFAULT_STATE.qurbanShares || []));
    }
    if (!newState.checks || newState.checks.length === 0) {
      newState.checks = JSON.parse(JSON.stringify(DEFAULT_STATE.checks || []));
    }
    if (!newState.accounts || newState.accounts.length === 0) {
      newState.accounts = JSON.parse(JSON.stringify(DEFAULT_STATE.accounts || []));
    }

    console.log('✅ Supabase verileri başarıyla yüklendi.');
    return newState;
  } catch (err) {
    console.error('❌ Supabase veri çekme hatası:', err);
    return null;
  }
}

// =============================================================================
// 5.1 TÜM LOKAL VERİLERİ BULUTA GÖNDER / YEDEKLE (PUSH COMPLETE STATE)
// =============================================================================
async function pushCompleteFarmToSupabase(localState) {
  if (!supabaseClient) {
    initSupabaseClient();
    if (!supabaseClient) throw new Error('Supabase istemcisi aktif değil. Lütfen bağlantı ayarlarını kontrol ediniz.');
  }

  const s = localState || window.state;
  if (!s) throw new Error('Yedeklenecek yerel veri bulunamadı.');

  console.log('🚀 Yerel çiftlik verileri Supabase bulut veritabanına aktarılıyor...');

  // 1. Çiftlik Ayarları
  if (s.farm) {
    await supabaseClient.from('farm_settings').upsert({
      id: 1,
      name: s.farm.name || 'Özate Büyükbaş Hayvancılık & Süt Çiftliği',
      location: s.farm.location || 'Bursa, Türkiye',
      owner: s.farm.owner || 'Özate Ailesi',
      currency: s.farm.currency || 'TRY',
      active_cows: parseInt(s.farm.activeCows, 10) || 0,
      phone: s.farm.phone || '',
      email: s.farm.email || '',
      updated_at: new Date().toISOString()
    });
  }

  // 2. Parametreler
  if (s.parameters) {
    const paramRows = [];
    Object.entries(s.parameters).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        items.forEach((item, idx) => {
          paramRows.push({ category, item_name: item, display_order: idx + 1 });
        });
      }
    });
    if (paramRows.length > 0) {
      await supabaseClient.from('farm_parameters').upsert(paramRows, { onConflict: 'category,item_name' });
    }
  }

  // 3. Hesaplar
  if (Array.isArray(s.accounts) && s.accounts.length > 0) {
    await supabaseClient.from('accounts').upsert(s.accounts.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      iban: a.iban || '-',
      balance: a.balance || 0
    })));
  }

  // 4. Cariler
  if (Array.isArray(s.contacts) && s.contacts.length > 0) {
    await supabaseClient.from('contacts').upsert(s.contacts.map(c => ({
      id: c.id,
      name: c.name,
      type: c.type,
      phone: c.phone || '',
      balance: c.balance || 0
    })));
  }

  // 5. Büyükbaş Hayvanlar
  if (Array.isArray(s.animals) && s.animals.length > 0) {
    await supabaseClient.from('cattle_animals').upsert(s.animals.map(an => ({
      id: an.id,
      ear_tag: an.earTag,
      name: an.name || '',
      breed: an.breed || '',
      category: an.category || '',
      gender: an.gender || 'Dişi',
      birth_date: an.birthDate || null,
      paddock: an.paddock || '',
      weight: parseFloat(an.weight) || 0,
      status: an.status || 'Aktif',
      repro_status: an.reproStatus || 'Boş',
      last_calving_date: an.lastCalvingDate || null,
      insemination_date: an.inseminationDate || null,
      est_calving_date: an.estCalvingDate || null,
      dam: an.dam || '',
      sire: an.sire || ''
    })));
  }

  // 6. Küçükbaş Hayvanlar
  if (Array.isArray(s.sheep) && s.sheep.length > 0) {
    await supabaseClient.from('sheep_animals').upsert(s.sheep.map(sh => ({
      id: sh.id,
      ear_tag: sh.earTag,
      name: sh.name || '',
      breed: sh.breed || '',
      category: sh.category || '',
      gender: sh.gender || 'Dişi',
      barn: sh.barn || '',
      weight: parseFloat(sh.weight) || 0,
      birth_type: sh.birthType || 'Tekiz',
      status: sh.status || 'Aktif',
      repro_status: sh.reproStatus || 'Boş',
      mating_date: sh.matingDate || null,
      mating_ram: sh.matingRam || '',
      est_lambing_date: sh.estLambingDate || null,
      dam: sh.dam || '',
      sire: sh.sire || ''
    })));
  }

  // 7. Tanklar
  if (s.tanks && typeof s.tanks === 'object') {
    const tankRows = Object.entries(s.tanks).map(([id, t]) => ({
      id,
      name: t.name,
      current_liters: t.current || 0,
      capacity_liters: t.capacity || 2000,
      temp: t.temp || 4.0
    }));
    if (tankRows.length > 0) {
      await supabaseClient.from('milk_tanks').upsert(tankRows);
    }
  }

  // 8. Süt Sağım Verileri
  if (Array.isArray(s.milkProductions) && s.milkProductions.length > 0) {
    await supabaseClient.from('milk_productions').upsert(s.milkProductions.map(m => ({
      id: m.id,
      date: m.date,
      session: m.session,
      liters: m.liters,
      tank: m.tank,
      fat: m.fat || 3.80,
      notes: m.notes || ''
    })));
  }

  // 9. Stok Kalemleri
  if (Array.isArray(s.inventory) && s.inventory.length > 0) {
    await supabaseClient.from('inventory_items').upsert(s.inventory.map(i => ({
      id: i.id,
      name: i.name,
      category: i.category,
      quantity: i.quantity,
      unit: i.unit,
      min_alert: i.minAlert || 10,
      unit_cost: i.unitCost || 0
    })));
  }

  // 10. Finansal İşlemler
  if (Array.isArray(s.transactions) && s.transactions.length > 0) {
    await supabaseClient.from('financial_transactions').upsert(s.transactions.map(t => ({
      id: t.id,
      date: t.date,
      type: t.type,
      category: t.category,
      description: t.desc || '',
      amount: t.amount,
      account_id: t.account || null,
      contact_id: t.contact || null,
      invoice_no: t.invoiceNo || ''
    })));
  }

  // 11. Görevler
  if (Array.isArray(s.tasks) && s.tasks.length > 0) {
    await supabaseClient.from('tasks').upsert(s.tasks.map(t => ({
      id: t.id,
      title: t.title,
      sub_text: t.sub || '',
      category: t.category,
      priority: t.priority,
      due_date: t.dueDate,
      assignee: t.assignee,
      related_animal: t.relatedAnimal || '',
      is_done: !!t.done
    })));
  }

  // 12. Kullanıcılar
  if (Array.isArray(s.users) && s.users.length > 0) {
    await supabaseClient.from('farm_users').upsert(s.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      title: u.title,
      pin: u.pin,
      status: u.status
    })));
  }

  // 13. Çekler
  if (Array.isArray(s.checks) && s.checks.length > 0) {
    await supabaseClient.from('checks').upsert(s.checks.map(c => ({
      id: c.id,
      check_number: c.checkNumber,
      type: c.type,
      amount: c.amount,
      issue_date: c.issueDate,
      due_date: c.dueDate,
      drawer: c.drawer,
      bank_name: c.bankName,
      branch_name: c.branchName || '',
      account_no: c.accountNo || '',
      contact_id: c.contactId || null,
      status: c.status || 'PORTFOLIO',
      endorsed_to_contact_id: c.endorsedToContactId || null,
      target_account_id: c.targetAccountId || null,
      notes: c.notes || ''
    })));
  }

  // 14. Kurbanlık Hayvanlar
  if (Array.isArray(s.qurbanAnimals) && s.qurbanAnimals.length > 0) {
    await supabaseClient.from('qurban_animals').upsert(s.qurbanAnimals.map(q => ({
      id: q.id,
      qurban_no: q.qurbanNo,
      animal_type: q.animalType,
      source_animal_id: q.sourceAnimalId || null,
      ear_tag: q.earTag || '',
      breed: q.breed || '',
      live_weight: q.liveWeight || 0,
      carcass_weight: q.carcassWeight || 0,
      total_price: q.totalPrice || 0,
      share_count: q.shareCount || 7,
      slaughter_day: q.slaughterDay || 1,
      slaughter_order: q.slaughterOrder || null,
      slaughter_time: q.slaughterTime || '',
      status: q.status || 'AVAILABLE',
      notes: q.notes || ''
    })));
  }

  // 15. Kurban Hissedarları
  if (Array.isArray(s.qurbanShares) && s.qurbanShares.length > 0) {
    await supabaseClient.from('qurban_shares').upsert(s.qurbanShares.map(qs => ({
      id: qs.id,
      qurban_id: qs.qurbanId,
      share_index: qs.shareIndex,
      shareholder_name: qs.shareholderName,
      phone: qs.phone,
      share_price: qs.sharePrice || 0,
      deposit_amount: qs.depositAmount || 0,
      payment_status: qs.paymentStatus || 'UNPAID',
      payment_method: qs.paymentMethod || 'CASH',
      check_id: qs.checkId || null,
      contact_id: qs.contactId || null,
      proxy_given: !!qs.proxyGiven,
      meat_weight: qs.meatWeight || 0,
      is_delivered: !!qs.isDelivered,
      notes: qs.notes || ''
    })));
  }

  console.log('✅ Tüm çiftlik verileri Supabase bulut veritabanına başarıyla senkronize edildi.');
  return { success: true, message: 'Tüm yerel veriler Supabase bulutuna başarıyla aktarıldı.' };
}

// =============================================================================
// 6. TEKİL VARLIKLARI BULUTA KAYDET / SİL (ATOMIC UPSERT & DELETE)
// =============================================================================
const dbService = {
  // Hesap İşlemleri
  async upsertAccount(acc) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('accounts').upsert({
        id: acc.id,
        name: acc.name,
        type: acc.type,
        iban: acc.iban || '-',
        balance: acc.balance || 0
      });
    } catch (e) { console.error('Supabase upsertAccount hatası:', e); }
  },

  async deleteAccount(accId) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('accounts').delete().eq('id', accId);
    } catch (e) { console.error('Supabase deleteAccount hatası:', e); }
  },

  // Cari İşlemleri
  async upsertContact(c) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('contacts').upsert({
        id: c.id,
        name: c.name,
        type: c.type,
        phone: c.phone || '',
        balance: c.balance || 0
      });
    } catch (e) { console.error('Supabase upsertContact hatası:', e); }
  },

  async deleteContact(cId) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('contacts').delete().eq('id', cId);
    } catch (e) { console.error('Supabase deleteContact hatası:', e); }
  },

  // Finans Hareketleri
  async upsertTransaction(tx) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('transactions').upsert({
        id: tx.id,
        date: tx.date,
        type: tx.type,
        category: tx.category,
        amount: tx.amount,
        paid_amount: tx.paidAmount || (tx.status === 'PAID' ? tx.amount : 0),
        status: tx.status,
        contact_id: tx.contactId || null,
        account_id: tx.accountId || null,
        description: tx.desc || ''
      });
    } catch (e) { console.error('Supabase upsertTransaction hatası:', e); }
  },

  async deleteTransaction(txId) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('transactions').delete().eq('id', txId);
    } catch (e) { console.error('Supabase deleteTransaction hatası:', e); }
  },

  // Virman Transferi
  async insertTransfer(tr) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('transfers').insert({
        id: tr.id,
        date: tr.date,
        from_account: tr.fromAcc,
        to_account: tr.toAcc,
        amount: tr.amount,
        note: tr.note || ''
      });
    } catch (e) { console.error('Supabase insertTransfer hatası:', e); }
  },

  // Büyükbaş Hayvan
  async upsertCattle(an) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('cattle_animals').upsert({
        id: an.id,
        ear_tag: an.earTag,
        name: an.name,
        breed: an.breed,
        category: an.category,
        gender: an.gender,
        paddock: an.paddock,
        weight: an.weight || 0,
        yield: an.yield || '',
        status: an.status || 'Sağmal (Aktif)',
        health: an.health || 'Mükemmel',
        dam: an.dam || '-',
        sire: an.sire || '-'
      });
    } catch (e) { console.error('Supabase upsertCattle hatası:', e); }
  },

  async deleteCattle(anId) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('cattle_animals').delete().eq('id', anId);
    } catch (e) { console.error('Supabase deleteCattle hatası:', e); }
  },

  // Süt Üretim Kaydı
  async insertMilkProduction(m) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('milk_productions').insert({
        id: m.id,
        date: m.date,
        session: m.session,
        liters: m.liters,
        tank: m.tank,
        fat: m.fat || 3.80,
        notes: m.notes || ''
      });
    } catch (e) { console.error('Supabase insertMilkProduction hatası:', e); }
  },

  // Stok Kaydı
  async upsertInventory(inv) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('inventory_items').upsert({
        id: inv.id,
        name: inv.name,
        category: inv.category,
        quantity: inv.quantity,
        unit: inv.unit,
        min_alert: inv.minAlert || 10,
        unit_cost: inv.unitCost || 0,
        updated_at: new Date().toISOString()
      });
    } catch (e) { console.error('Supabase upsertInventory hatası:', e); }
  },

  // Görev
  async upsertTask(tsk) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('tasks').upsert({
        id: tsk.id,
        title: tsk.title,
        sub_text: tsk.sub || '',
        category: tsk.category,
        priority: tsk.priority,
        due_date: tsk.dueDate,
        assignee: tsk.assignee,
        related_animal: tsk.relatedAnimal || '',
        is_done: !!tsk.done
      });
    } catch (e) { console.error('Supabase upsertTask hatası:', e); }
  },

  // Parametre Senkronizasyonu
  async syncParameters(category, items) {
    if (!supabaseClient || !Array.isArray(items)) return;
    try {
      // Önce mevcutları sil ve yenileri ekle
      await supabaseClient.from('farm_parameters').delete().eq('category', category);
      const rows = items.map((name, idx) => ({
        category,
        item_name: name,
        display_order: idx + 1
      }));
      if (rows.length > 0) {
        await supabaseClient.from('farm_parameters').insert(rows);
      }
    } catch (e) { console.error('Supabase syncParameters hatası:', e); }
  },

  // Çek İşlemleri
  async upsertCheck(chk) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('checks').upsert({
        id: chk.id,
        check_number: chk.checkNumber,
        type: chk.type,
        amount: chk.amount,
        issue_date: chk.issueDate,
        due_date: chk.dueDate,
        drawer: chk.drawer,
        bank_name: chk.bankName,
        branch_name: chk.branchName || '',
        account_no: chk.accountNo || '',
        contact_id: chk.contactId || null,
        status: chk.status || 'PORTFOLIO',
        endorsed_to_contact_id: chk.endorsedToContactId || null,
        target_account_id: chk.targetAccountId || null,
        notes: chk.notes || ''
      });
    } catch (e) { console.error('Supabase upsertCheck hatası:', e); }
  },

  async deleteCheck(chkId) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('checks').delete().eq('id', chkId);
    } catch (e) { console.error('Supabase deleteCheck hatası:', e); }
  },

  // Kurbanlık Hayvan İşlemleri
  async upsertQurbanAnimal(qa) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('qurban_animals').upsert({
        id: qa.id,
        qurban_no: qa.qurbanNo,
        animal_type: qa.animalType,
        source_animal_id: qa.sourceAnimalId || null,
        ear_tag: qa.earTag || '',
        breed: qa.breed || '',
        live_weight: qa.liveWeight || 0,
        carcass_weight: qa.carcassWeight || 0,
        total_price: qa.totalPrice || 0,
        share_count: qa.shareCount || 7,
        slaughter_day: qa.slaughterDay || 1,
        slaughter_order: qa.slaughterOrder || null,
        slaughter_time: qa.slaughterTime || '',
        status: qa.status || 'AVAILABLE',
        notes: qa.notes || ''
      });
    } catch (e) { console.error('Supabase upsertQurbanAnimal hatası:', e); }
  },

  async deleteQurbanAnimal(qaId) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('qurban_animals').delete().eq('id', qaId);
    } catch (e) { console.error('Supabase deleteQurbanAnimal hatası:', e); }
  },

  // Kurban Hissedar İşlemleri
  async upsertQurbanShare(qs) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('qurban_shares').upsert({
        id: qs.id,
        qurban_id: qs.qurbanId,
        share_index: qs.shareIndex,
        shareholder_name: qs.shareholderName,
        phone: qs.phone,
        share_price: qs.sharePrice || 0,
        deposit_amount: qs.depositAmount || 0,
        payment_status: qs.paymentStatus || 'UNPAID',
        payment_method: qs.paymentMethod || 'CASH',
        check_id: qs.checkId || null,
        contact_id: qs.contactId || null,
        proxy_given: !!qs.proxyGiven,
        meat_weight: qs.meatWeight || 0,
        is_delivered: !!qs.isDelivered,
        notes: qs.notes || ''
      });
    } catch (e) { console.error('Supabase upsertQurbanShare hatası:', e); }
  },

  async deleteQurbanShare(qsId) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('qurban_shares').delete().eq('id', qsId);
    } catch (e) { console.error('Supabase deleteQurbanShare hatası:', e); }
  }
};

