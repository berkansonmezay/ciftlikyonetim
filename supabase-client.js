// =============================================================================
// ÖZATE ÇİFTLİĞİ ERP - SUPABASE İLİŞKİSEL VERİTABANI İSTEMCİSİ
// Modüler veri erişim katmanı ve PostgreSQL senkronizasyon servisi
// =============================================================================

const SUPABASE_CONFIG_KEY = 'ozate_supabase_config';

// 1. Yapılandırma Yönetimi
function getSupabaseConfig() {
  const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Supabase config parse hatası:', e);
    }
  }
  return {
    url: '',
    key: '',
    enabled: false
  };
}

function saveSupabaseConfig(url, key, enabled = true) {
  const config = { url: url.trim(), key: key.trim(), enabled };
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
      if (error.code === '42P01') {
        return { success: false, message: 'Bağlantı başarılı ancak tablolar bulunamadı. Lütfen "supabase_schema.sql" dosyasını Supabase SQL Editöründe çalıştırınız.' };
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
      tasksRes, usersRes, logsRes
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
      supabaseClient.from('audit_logs').select('*')
    ]);

    // Hata kontrolü
    if (farmRes.error && farmRes.error.code === '42P01') {
      console.warn('Tablolar henüz oluşturulmamış, schema.sql çalıştırılmalı.');
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

    console.log('✅ Supabase verileri başarıyla yüklendi.');
    return newState;
  } catch (err) {
    console.error('❌ Supabase veri çekme hatası:', err);
    return null;
  }
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
  }
};
