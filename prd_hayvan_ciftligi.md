# Hayvan Çiftliği Yönetim Uygulaması
## Ürün Gereksinimleri, Rakip Analizi ve Teknik Yol Haritası

**Belge tarihi:** 10 Ekim 2026  
**Belge türü:** Ürün gereksinimleri / başlangıç teknik taslağı  
**Platformlar:** Web, mobil web ve isteğe bağlı yerel mobil uygulama  
**Dil ve bölge:** Türkçe, Türkiye; varsayılan para birimi TRY (₺)

---

## 1. Proje özeti

Hayvan çiftliğinin gelir-gider, hayvan varlığı, üretim, stok, borç-alacak, bakım ve günlük operasyon kayıtlarını tek yerde tutan; bilgisayar, tablet ve telefondan kullanılabilen bir uygulama geliştirilecektir.

Temel amaç yalnızca muhasebe kaydı tutmak değil, işletme sahibinin şu sorulara hızlı yanıt almasını sağlamaktır:

- Bu ay ne kadar gelir elde ettim, ne kadar harcadım?
- En yüksek gider kalemlerim neler?
- Hangi müşteriden tahsilat bekliyorum, hangi tedarikçiye borcum var?
- Yem, ilaç ve diğer kritik stoklardan ne kadar kaldı?
- Hayvan alım-satımından ve üretimden elde edilen sonuç nedir?
- Hangi görevler, aşılar, kontroller veya ödemeler yaklaşıyor?
- İşletmenin dönemsel kârlılığı ve nakit durumu nasıl değişiyor?

> **Kapsam notu:** Hayvan türü ve işletme modeli henüz netleşmediğinden sistem; büyükbaş, küçükbaş ve kanatlı gibi türlere uyarlanabilir tasarlanmalıdır. İlk sürümde seçilen hayvan türüne göre ayrıntılı alanlar açılabilir.

## 2. Ürün hedefleri

1. Günlük kayıtları sahada telefondan hızlıca girebilmek.
2. Tüm kayıtları web ve mobilde aynı veri kaynağından eşzamanlı görüntülemek.
3. Gelir, gider, tahsilat, ödeme ve stok hareketlerini birbirine bağlamak.
4. Hayvan veya sürü bazında maliyet ve gelir analizi sunmak.
5. Tarih aralığına, kategoriye, hayvana/sürüye ve ödeme durumuna göre rapor almak.
6. Birden fazla çalışan için rol ve yetki tanımlamak.
7. İnternet bağlantısının zayıf olduğu çiftlik ortamlarında veri kaybı riskini azaltmak.
8. Excel/PDF dışa aktarma ve mevcut Excel kayıtlarını içe aktarma olanağı sağlamak.

## 3. Benzer uygulamalar ve rakip analizi

Aşağıdaki inceleme, ürünlerin kamuya açık web sayfaları ve uygulama mağazası açıklamalarına dayanır. Özellikler üretici beyanlarıdır; bu belge bağımsız ürün testi veya satın alma tavsiyesi değildir. Fiyatlar ve paketler değişebileceği için burada sabit fiyat karşılaştırması yapılmamıştır.

### 3.1 Türkiye'deki örnekler

| Ürün | Kamuya açık açıklamalarda öne çıkanlar | Ürün için çıkarım |
|---|---|---|
| **Akıllı Sürü** | Hayvan ve küpe kayıtları, sağlık/üreme, süt ve performans, gelir-gider, stok, ekip rolleri, raporlar ve web paneli | Operasyonel modüller finans ile aynı kayıtta ilişkilendirilmeli. [Google Play](https://play.google.com/store/apps/details?hl=tr&id=com.akillisuru.app) |
| **ÇiftlikPro: Süt & Hayvan Takip** | Hayvan defteri, süt üretimi ve geliri, veteriner kayıtları, yem giderleri, alım-satım ve kâr/zarar raporları; çevrimdışı çalışma iddiası | Günlük veri girişi az adımlı olmalı; süt ve hayvan satışları finans kaydıyla bağlanmalı. [Google Play](https://play.google.com/store/apps/details?hl=tr&id=com.deveciyazilim.ciftliktakip) |
| **Ahırım Cebimde** | Sürü, üreme, süt, sağlık, yem/rasyon, gelir-gider, Excel aktarımı ve farklı ekip rolleri | Hayvan başı yem maliyeti ve süt geliri gibi otomatik hesaplar değerli olabilir. [App Store](https://apps.apple.com/tr/app/ah%C4%B1r%C4%B1m-cebimde/id6779227305) |
| **Benim Çiftliğim** | Büyükbaş takibi, süt/üretim analitiği, gebelik/doğum, sağlık, padok ve finans | Sade finans ekranına ek olarak hayvan ve padok bağlamı sağlanmalı. [Ürün sitesi](https://benimciftligim.net/tr/buyukbas-hayvancilik) |
| **SürüPlus** | Hayvan kayıtları, sağlık, doğum/üreme, süt, gelir-gider ve raporlar; web ve mobil erişim, çevrimdışı kayıt iddiası | Web-mobil deneyimi ve internet yokken kayıt tutma önemli bir farklılaştırıcı olabilir. [Ürün sitesi](https://suruyonetimi.app/) |
| **CowMaster / CowPro** | Gelir-gider, dönemsel kârlılık, borç-alacak, web ve mobil erişim; ürün sayfalarında çevrimdışı çalışma da vurgulanıyor | Tahsilat/ödeme takibi ve finansal dönem karşılaştırmaları çekirdek özellik olmalı. [CowMaster](https://www.suru-yonetimi.com/) · [CowPro](https://suruyonetimi.tr/) |

### 3.2 Uluslararası örnekler

| Ürün | Kamuya açık açıklamalarda öne çıkanlar | Ürün için çıkarım |
|---|---|---|
| **Farmbrite** | Çiftlik muhasebesi, özelleştirilebilir gelir-gider kategorileri, nakit akışı, kâr-zarar, bütçe, makbuz ekleme, stok ve hayvan yönetimi; bazı kayıtları çevrimdışı kullanma özellikleri | Özelleştirilebilir hesap kategorileri, belge ekleri, bütçe ve raporlama düşünülmeli. [Özellikler](https://www.farmbrite.com/features) · [Muhasebe](https://www.farmbrite.com/accounting) |
| **CattleMax** | Büyükbaş kayıtları, hayvan alım-satımı, finansal gelir-gider, kategori bazlı raporlar, ekipman, takvim ve görevler; web tabanlı mobil erişim | Hayvan satın alma ve satış işlemleri hayvan envanteriyle otomatik ilişkilendirilmeli. [Finans kayıtları](https://help.cattlemax.com/article/525-ranch-related-financial-record-keeping) · [Ürün sitesi](https://www.cattlemax.com/) |

### 3.3 Rakiplerden çıkan ortak beklentiler

- Hayvan, üretim, stok ve finans kayıtlarının birbirinden kopuk olmaması.
- Mobil cihazdan hızlı veri girişi.
- Gelir-gider kategorileri ve dönemsel raporlar.
- Hayvan başına veya grup bazında maliyet/kârlılık hesabı.
- Aşı, doğum, görev, ödeme ve stok için hatırlatmalar.
- Ekip üyeleri için ayrı hesaplar ve yetkiler.
- Excel/PDF aktarımı ve yedekleme.
- Zayıf internet koşullarında kullanılabilirlik.

### 3.4 Önerilen konumlandırma

İlk sürümde her şeyi aynı anda geliştirmek yerine **finans ve günlük işletme kayıtlarını güçlü şekilde birleştiren, kullanımı kolay bir çiftlik yönetim aracı** hedeflenmelidir. Hayvan sağlığı ve üreme takibi, işletmenin türüne göre aşamalı olarak derinleştirilebilir.

Önerilen farklılaştırıcılar:
- Türkiye'deki küçük ve orta ölçekli işletmelere uygun Türkçe arayüz.
- Nakit hareketi ile tahakkuk eden gelir/gideri ayrı göstermek.
- Bir finans kaydını hayvan, sürü, üretim dönemi, tedarikçi veya müşteriyle ilişkilendirmek.
- İnternet yokken kayıt alıp bağlantı gelince eşitlemek (teknik olarak doğrulandıktan sonra).
- Kullanıcıya gereksiz karmaşık muhasebe terimleri göstermeyen hızlı kayıt ekranları.

## 4. Kullanıcı rolleri ve yetkiler

| Rol | Temel yetkiler |
|---|---|
| İşletme sahibi | Tüm kayıtlar, raporlar, kullanıcılar, ayarlar ve dışa aktarma |
| Yönetici | Günlük operasyon, finans ve stok; hassas ayarlar için kısıtlanabilir |
| Muhasebeci | Finans, cari hesaplar, belge ve raporlar; hayvan sağlık verileri için sınırlı erişim |
| Çiftlik çalışanı | Kendisine izin verilen hayvan, üretim, stok ve görev kayıtları |
| Veteriner / danışman | İzin verilmiş hayvan sağlık, tedavi ve kontrol kayıtları |
| Salt okunur kullanıcı | İzin verilen ekranları görüntüleme, kayıt değiştirememe |

Yetkiler işletme bazında tanımlanmalı; kullanıcı sadece üyesi olduğu işletmenin verilerini görebilmelidir. Finans kayıtlarını silme veya değiştirme işlemleri denetim günlüğüne yazılmalıdır.

## 5. Fonksiyonel gereksinimler

### 5.1 Gösterge paneli

Girişte aşağıdaki özetler gösterilmelidir:

- Bugünkü gelir ve gider.
- İçinde bulunulan ayın toplam gelir, gider ve net sonucu.
- Nakit/banka bakiyeleri.
- Vadesi geçmiş alacaklar ve ödemeler.
- Kritik seviyedeki stoklar.
- Hayvan sayısı ve son dönemdeki değişimler.
- Yaklaşan aşı, doğum, veteriner kontrolü ve görevler.
- Son işlemler ve hızlı işlem kısayolları.

Grafiklerin yanında sayısal değerler de gösterilmeli; tarih aralığı kolay değiştirilebilmelidir.

### 5.2 Gelir yönetimi

Gelir kaydı alanları:

- İşletme ve kayıt numarası.
- İşlem tarihi ve varsa vade/tahsilat tarihi.
- Gelir kategorisi.
- Açıklama.
- Tutar, para birimi ve varsa KDV/vergi bilgisi.
- Müşteri/cari hesap.
- Tahsilat durumu: tahsil edildi, kısmi tahsil edildi, bekliyor, iptal.
- Tahsilat yöntemi: nakit, banka, kart, diğer.
- İlgili hayvan, sürü, üretim dönemi veya faaliyet.
- Fatura/makbuz/fiş eki.
- Oluşturan kullanıcı ve zaman damgası.

Önerilen gelir kategorileri:
- Süt ve süt ürünleri satışı.
- Hayvan satışı.
- Et/karkas satışı.
- Yumurta veya diğer ürün satışı.
- Yavru hayvan satışı.
- Gübre ve yan ürün geliri.
- Devlet desteği/hibe.
- Diğer gelirler.

### 5.3 Gider yönetimi

Gider kaydı alanları gelir kaydıyla tutarlı olmalıdır. Ayrıca tedarikçi, gider merkezi, stok kalemi ve varsa ilgili hayvan/sürü seçilebilmelidir.

Önerilen gider kategorileri:
- Yem ve kaba yem.
- Veteriner, ilaç ve aşı.
- Tohumlama ve üreme.
- İşçilik ve maaş.
- Elektrik, su, yakıt ve enerji.
- Bakım-onarım ve ekipman.
- Hayvan alımı.
- Nakliye, komisyon ve kesim.
- Altlık, temizlik ve sarf malzemesi.
- Kira, sigorta ve idari giderler.
- Vergi, harç ve banka masrafları.
- Diğer giderler.

**Önemli muhasebe kuralı:** Bir giderin kaydedilmesi, mutlaka aynı anda ödeme yapıldığı anlamına gelmemelidir. “Gider oluştu” ve “ödeme yapıldı” ayrı durumlar olmalı; kısmi ödemeler desteklenmelidir.

### 5.4 Kasa, banka ve nakit akışı

- Birden fazla kasa ve banka hesabı tanımlama.
- Hesaplar arası transfer kaydı.
- Tahsilat ve ödeme işlemlerini gelir/gider kaydıyla eşleştirme.
- Günlük kasa hareketleri.
- Açılış bakiyesi ve dönem sonu bakiyesi.
- Planlanan ve gerçekleşen nakit akışı.
- Mükerrer işlem kontrolü.
- Tarih ve hesap bazında hareket dökümü.

Hesaplar arası transfer, toplam gelir veya gider sayılmamalıdır; yalnızca varlıkların hesaplar arasında hareketidir.

### 5.5 Cari hesaplar: müşteri ve tedarikçi

- Müşteri/tedarikçi kartı, iletişim ve vergi bilgileri.
- Fatura/işlem bazında borç-alacak bakiyesi.
- Vade tarihi, kısmi tahsilat ve kısmi ödeme.
- Vadesi yaklaşan ve geçmiş işlemler.
- Cari ekstre ve mutabakat için dışa aktarma.
- Notlar ve dosya ekleri.

### 5.6 Hayvan ve sürü yönetimi

Hayvan türüne göre değiştirilebilir kayıt alanları:

- Küpe/kimlik numarası ve benzersiz kayıt kodu.
- Tür, ırk, cinsiyet, doğum tarihi veya tahmini yaş.
- İşletmeye giriş tarihi, giriş türü ve alış bedeli.
- Sürü/grup, padok veya konum.
- Canlı ağırlık ve ölçüm geçmişi.
- Sağlık, aşı, tedavi ve veteriner ziyaretleri.
- Üreme, gebelik, doğum ve yavru kayıtları (ilgili türlerde).
- Üretim verileri (ör. süt, yumurta veya ağırlık artışı).
- Satış, kesim, ölüm veya işletmeden çıkış tarihi ve nedeni.
- Hayvanla ilişkili gelir, gider ve ek belgeler.

Hayvan alımında hayvan kartı ile finans gideri; satışta hayvan çıkışı ile gelir kaydı birbiriyle ilişkilendirilmelidir. Aynı işlem iki kez finans kaydı oluşturmamalıdır.

### 5.7 Üretim takibi

İşletme türüne göre açılıp kapatılabilen alt modüller:

- Süt: günlük/sağım bazlı miktar, kalite, satış miktarı ve birim fiyat.
- Besi: periyodik ağırlık, yem tüketimi ve canlı ağırlık artışı.
- Küçükbaş: sürü hareketleri, doğum ve yavru kayıtları.
- Kanatlı: yumurta/üretim miktarı, fire ve satış.
- Ürün satışı: müşteri, miktar, birim, birim fiyat, indirim ve toplam.

Üretimden otomatik gelir oluşturulacaksa, otomatik kayıtların kullanıcı tarafından kontrol edilebilir olması ve aynı satışın iki kez kaydedilmesini önleyen kurallar bulunması gerekir.

### 5.8 Stok ve depo yönetimi

- Yem, ilaç, aşı, altlık, sarf malzemesi ve diğer ürün kartları.
- Birim ve birim dönüşümü (kg, ton, litre, adet, çuval vb.).
- Depo/konum ve mevcut miktar.
- Alım, tüketim, fire, iade ve sayım düzeltmesi.
- Minimum stok seviyesi ve uyarı.
- Parti/son kullanma tarihi (özellikle ilaç ve aşı için).
- Tüketimi hayvan, sürü veya üretim dönemiyle ilişkilendirme.
- Stok alımının gider/tedarikçi kaydıyla ilişkilendirilmesi.

Stok alımı ile gider kaydı arasındaki ilişki tasarlanmalı; aynı alımın hem manuel gider hem otomatik stok gideri olarak iki kere sayılması engellenmelidir.

### 5.9 Görev, takvim ve bildirimler

- Görev başlığı, açıklama, sorumlu kullanıcı ve son tarih.
- Tek seferlik veya tekrarlanan görevler.
- Aşı, tedavi, gebelik kontrolü, doğum, bakım ve ekipman servisi hatırlatmaları.
- Vadesi yaklaşan alacak/borç bildirimleri.
- Kritik stok uyarıları.
- Uygulama içi bildirim; sonraki aşamada e-posta veya push bildirimleri.
- Tamamlandı/ertelendi durumları ve işlem geçmişi.

### 5.10 Raporlama ve dışa aktarma

İlk sürümde asgari raporlar:

1. Günlük/aylık/yıllık gelir-gider özeti.
2. Kategori bazında gelir-gider dağılımı.
3. Dönemsel kâr/zarar özeti.
4. Nakit akışı ve kasa/banka hareketleri.
5. Müşteri ve tedarikçi cari ekstresi.
6. Vadesi geçmiş alacaklar ve borçlar.
7. Hayvan alım-satım raporu.
8. Hayvan/sürü bazında maliyet ve gelir.
9. Stok durumu ve kritik stoklar.
10. Üretim miktarı ve üretimden elde edilen gelir.
11. Kullanıcı işlem geçmişi.

Filtreler: tarih aralığı, işletme, kategori, kullanıcı, ödeme durumu, hayvan/sürü, müşteri/tedarikçi ve kasa/banka hesabı.

Çıktılar: Excel/CSV ve yazdırılabilir PDF. Vergi beyannamesi veya yasal muhasebe çıktısı olarak sunulacak raporlar, mali müşavir ve Türkiye mevzuatı açısından ayrıca doğrulanmalıdır.

### 5.11 Dosya ve belge yönetimi

- Fiş, fatura, makbuz, sözleşme, veteriner raporu ve fotoğraf ekleme.
- Dosyayı işlem/hayvan/cari hesap ile ilişkilendirme.
- Yetkiye göre görüntüleme ve indirme.
- Dosya türü ve boyut sınırı; güvenli dosya tarama ve saklama politikası.

### 5.12 Ayarlar ve veri yönetimi

- İşletme bilgileri, para birimi, tarih biçimi ve varsayılan dönem.
- Gelir/gider kategorileri ve özel alanlar.
- Başlangıç kasa/banka bakiyeleri.
- Excel şablonuyla içe aktarma ve hatalı satır raporu.
- Excel/CSV/PDF dışa aktarma.
- Yedekleme, geri yükleme ve veri saklama politikası.
- İşlem geçmişi ve silme yerine iptal/ters kayıt yaklaşımı.

## 6. İş kuralları ve hesaplama ilkeleri

- **Dönem net sonucu =** seçilen dönemdeki gelirler − seçilen dönemdeki giderler. Bunun muhasebesel kârla aynı anlama gelmeyebileceği arayüzde açıklanmalıdır.
- **Nakit akışı =** gerçekleşen tahsilatlar − gerçekleşen ödemeler; tahakkuk eden ama ödenmeyen işlemler ayrı gösterilmelidir.
- Kısmi ödeme/tahsilat toplamı, işlem tutarını aşamaz; aşan tutar açıkça ele alınmalıdır.
- İptal edilen veya ters kayıtla kapatılan işlemler raporlarda tutarlı şekilde gösterilmelidir.
- Her finans kaydı bir işletmeye ve bir kategoriye bağlı olmalıdır.
- Tutar, tarih, para birimi ve kayıt sahibi gibi zorunlu alanlar doğrulanmalıdır.
- Tarih aralığına göre raporlar aynı filtrelerle aynı sonuçları üretmelidir.
- Hayvan satıldığında hayvan durumu güncellenmeli; satış geliri ile hayvan çıkış kaydı ilişkilendirilmelidir.
- Stok miktarı eksiye düşecekse kullanıcı uyarılmalı; izin politikası işletme ayarına bağlanabilir.
- Veri değişiklikleri kullanıcı, zaman ve önceki/yeni değerleriyle denetim izine alınmalıdır.

## 7. Ekran haritası ve gezinme

### Web navigasyonu

- Gösterge Paneli
- Gelirler
- Giderler
- Kasa ve Bankalar
- Cari Hesaplar
- Hayvanlar / Sürüler
- Üretim
- Stok ve Depolar
- Görevler ve Takvim
- Raporlar
- Kullanıcılar ve Yetkiler
- Ayarlar

### Mobil alt menü önerisi

- Ana Sayfa
- Kayıtlar
- **+ Yeni İşlem**
- Hayvanlar
- Daha Fazla

Mobilde “+ Yeni İşlem” üzerinden gelir, gider, tahsilat, ödeme, süt/üretim, stok tüketimi ve hayvan olayı hızlıca eklenebilmelidir.

## 8. UX/UI gereksinimleri

- Öncelik mobil kullanım: büyük dokunma alanları, az yazı, kısa formlar.
- Responsive tasarım: telefon, tablet, masaüstü.
- En sık kullanılan işlemler en fazla birkaç etkileşimle erişilebilir olmalı.
- Formlarda akıllı varsayılanlar ve son kullanılan kategori/hesap önerileri.
- Türkçe sayı biçimi: `1.250,50 ₺`; tarih biçimi `GG.AA.YYYY`.
- Kaydedildi, hata oluştu, çevrimdışı ve senkronizasyon bekliyor durumları açıkça gösterilmeli.
- Renk tek başına anlam taşımamalı; metin/ikonla desteklenmeli.
- Grafiklerin erişilebilir metinsel karşılıkları bulunmalı.
- Silme gibi geri alınması zor işlemler onay istemeli; mümkün olduğunda arşivleme/iptal tercih edilmeli.

## 9. Teknik mimari önerisi

### 9.1 Önerilen yaklaşım

Başlangıç için **responsive web uygulaması + API + ilişkisel veritabanı** önerilir. Bu, aynı uygulamanın telefon tarayıcısında ve masaüstünde kullanılmasını sağlar. Uygulama kullanım alışkanlıkları ve çevrimdışı gereksinimi doğrulandıktan sonra PWA veya yerel mobil uygulama eklenebilir.

Örnek teknoloji seçenekleri (kesin karar değildir):
- Frontend: React/Next.js veya ASP.NET Core MVC/Razor tabanlı responsive arayüz.
- Backend: ASP.NET Core Web API veya ekip yetkinliğine göre eşdeğer bir API altyapısı.
- Veritabanı: PostgreSQL veya Microsoft SQL Server.
- Kimlik doğrulama: güvenli oturum/JWT yaklaşımı; MFA yönetici hesapları için değerlendirilebilir.
- Dosya saklama: özel erişimli nesne depolama.
- Raporlar: sunucu tarafında filtrelenmiş sorgular ve Excel/PDF üretimi.
- Dağıtım: otomatik yedeklemeli bulut veya yönetilen sunucu.

Teknoloji seçimi, ekibin mevcut becerileri, barındırma maliyeti, çevrimdışı ihtiyaçlar ve bakım kapasitesiyle kesinleştirilmelidir.

### 9.2 Veri modeli taslağı

Ana tablolar/varlıklar:

- `Tenant` / `Farm` — işletme
- `User`, `FarmUser`, `Role`, `Permission`
- `Animal`, `AnimalGroup`, `AnimalEvent`, `HealthRecord`, `BreedingRecord`, `ProductionRecord`
- `IncomeExpenseTransaction` veya ayrı `Income` / `Expense`
- `Payment`, `CashAccount`, `BankAccount`, `Transfer`
- `Contact` — müşteri/tedarikçi
- `InvoiceDocument`, `Attachment`
- `Product`, `StockLocation`, `StockMovement`, `StockLot`
- `Task`, `Reminder`, `Notification`
- `Category`, `AuditLog`, `ImportJob`

Finans modeli için işlem kaydı ile ödeme kaydını ayrı tutmak; kısmi ödeme ve vade yönetimini kolaylaştırır. İleride çift taraflı muhasebe gerekecekse model profesyonel muhasebe danışmanlığıyla genişletilmelidir.

### 9.3 Çoklu işletme ve veri izolasyonu

Bir kullanıcı birden fazla çiftliğe erişebilecekse her iş kaydı `FarmId` gibi bir işletme anahtarıyla ilişkilendirilmelidir. Sunucu, gelen istekteki işletme kimliğinin kullanıcıya ait olduğunu her zaman doğrulamalıdır. Yalnızca arayüzde işletme filtresi uygulamak güvenlik için yeterli değildir.

### 9.4 Çevrimdışı çalışma

Çevrimdışı kullanım bir gereksinim olarak kabul edilirse:
- Mobil tarayıcıda yerel kuyrukta tutulacak kayıtlar belirlenmeli.
- Her kayıt benzersiz istemci kimliği ve zaman damgası taşımalı.
- Bağlantı geldiğinde eşitleme ve çakışma çözüm kuralları uygulanmalı.
- Finans kayıtlarında sessizce üzerine yazma yapılmamalı.
- Kullanıcıya eşitleme bekleyen ve başarısız kayıtlar gösterilmeli.
- Bu özellik ayrıca test edilmeden “tam çevrimdışı destek” olarak vaat edilmemeli.

## 10. Güvenlik, gizlilik ve yedekleme

- HTTPS zorunlu olmalı.
- Parolalar güvenli, güncel parola hash algoritmasıyla saklanmalı.
- Sunucu tarafı rol/yetki kontrolü yapılmalı.
- İşletmeler arası veri sızıntısını önlemek için otomatik erişim testleri eklenmeli.
- Finans kayıtlarında oluşturma/değiştirme/iptal geçmişi tutulmalı.
- Günlük otomatik yedekleme ve düzenli geri yükleme testi planlanmalı.
- Hassas dosyalara süreli/izinli erişim uygulanmalı.
- Oturum süresi, parola sıfırlama ve kullanıcı erişimini iptal etme akışları bulunmalı.
- Kişisel veriler için KVKK kapsamı, aydınlatma metni, veri saklama/silme ve erişim süreçleri hukuk/uyum danışmanlığıyla değerlendirilmelidir.
- Uygulama güvenliği, bağımlılık güncellemeleri, loglarda hassas veri maskeleme ve olay müdahale süreci planlanmalıdır.

## 11. MVP kapsamı ve geliştirme aşamaları

### Aşama 1 — MVP

İlk kullanılabilir sürümün amacı finans ve temel işletme görünürlüğüdür.

- Giriş/çıkış ve işletme profili.
- Rol bazlı temel yetkiler.
- Gelir-gider kayıtları ve kategoriler.
- Kasa/banka, tahsilat/ödeme ve kısmi ödeme.
- Müşteri/tedarikçi cari hesapları.
- Basit hayvan/sürü kartları ve hayvan alım-satımı.
- Gösterge paneli ve temel finans raporları.
- Mobil uyumlu arayüz.
- Excel/CSV dışa aktarma.
- Denetim günlüğü ve otomatik yedekleme.

### Aşama 2 — Operasyon modülleri

- Stok/depo ve minimum stok uyarıları.
- Üretim takibi (süt, besi, yumurta veya seçilen türe uygun modül).
- Görev, takvim ve bildirimler.
- Belge/fotoğraf ekleri.
- Excel içe aktarma.
- Hayvan/sürü bazlı maliyet analizi.

### Aşama 3 — Gelişmiş özellikler

- Çevrimdışı kayıt ve güvenilir senkronizasyon.
- PWA veya yerel mobil uygulama.
- Gelişmiş bütçe ve nakit akışı tahmini.
- Gelişmiş rapor tasarlayıcı.
- Barkod/RFID veya harici sistem entegrasyonları.
- Muhasebe/e-belge entegrasyonları (uygunluk ve teknik erişim doğrulandıktan sonra).

## 12. Kabul kriterleri

MVP tamamlandı sayılmadan önce:

- Kullanıcı telefon ve masaüstünden aynı kaydı görebilmeli.
- Yetkisiz kullanıcı başka işletmenin kayıtlarını hiçbir API üzerinden okuyamamalı veya değiştirememeli.
- Gelir/gider, tahsilat/ödeme ve kasa bakiyesi test senaryolarında doğru hesaplanmalı.
- Kısmi ödeme, vadesi geçmiş işlem ve iptal senaryoları çalışmalı.
- Rapor toplamları, aynı filtrelerle işlem listesi toplamlarıyla eşleşmeli.
- Hayvan alım-satımı ilişkili finans kaydını çift oluşturmamalı.
- Excel dışa aktarma Türkçe karakterleri ve tarih/tutar biçimlerini korumalı.
- Telefon ekranında temel işlemler yatay kaydırma gerektirmeden tamamlanabilmeli.
- Yedekten geri yükleme prosedürü test edilmiş olmalı.
- Önemli değişiklikler denetim günlüğünde görülebilmeli.

## 13. Test senaryoları

1. Gelir kaydı oluşturma, düzenleme ve iptal.
2. Gider oluşturup daha sonra kısmi ödeme yapma.
3. Birden fazla tahsilatla faturanın kapatılması.
4. Kasa ile banka arasında transfer ve gelir/gider toplamına etkisinin olmaması.
5. Hayvan alımı ve satımının hayvan durumu ile finans raporuna doğru yansıması.
6. Yem satın alımının stok ve gider kayıtlarıyla ilişkilendirilmesi; çift kayıt oluşmaması.
7. Stok kritik seviyeye indiğinde uyarı.
8. Mobilde zayıf bağlantı ve yeniden deneme davranışı.
9. Farklı rollerin ekran ve API erişimleri.
10. Excel dışa aktarma/içe aktarma ve hatalı satırların raporlanması.
11. Farklı tarih aralıkları, ay sonu ve yıl sonu raporları.
12. Yedek geri yükleme ve denetim günlüğü kontrolü.

## 14. Riskler ve önlemler

| Risk | Önlem |
|---|---|
| Kapsamın çok genişlemesi | MVP'yi finans, cari hesap, temel hayvan kartı ve raporlarla sınırlamak |
| Çiftlikte internetin zayıf olması | Çevrimdışı gereksinimini erken doğrulamak; gerekiyorsa ayrı iş paketi yapmak |
| Aynı işlemin iki kez kaydedilmesi | Üretim, stok ve finans arasında açık bağlantı kuralları ve idempotent API işlemleri |
| Kullanıcının kayıt girmeyi zor bulması | Hızlı giriş, varsayılanlar, kısa formlar ve saha testi |
| Yanlış kâr/zarar yorumu | Nakit akışı ile tahakkuk kayıtlarını ayrı göstermek; rapor tanımlarını açıklamak |
| Veri kaybı | Otomatik yedekleme, geri yükleme testleri ve dışa aktarma |
| Yetkisiz finansal erişim | Sunucu tarafı yetki kontrolü, denetim günlüğü ve işletme bazlı izolasyon |
| Mevzuata uyumsuz raporlama | Yasal muhasebe/e-belge kapsamını mali müşavirle ayrıca doğrulamak |

## 15. Proje başlangıcında netleştirilmesi gereken sorular

Geliştirmeye başlamadan önce şu konular kararlaştırılmalıdır:

1. Çiftlikte hangi hayvan türleri bulunuyor: büyükbaş, küçükbaş, kanatlı veya karma?
2. İşletme süt üretimi, besi, damızlık, yumurta veya bunların birleşimi mi?
3. Yaklaşık kaç hayvan ve kaç kullanıcı olacak?
4. İlk sürümde yalnızca gelir-gider mi, yoksa hayvan/üretim/stok takibi de zorunlu mu?
5. İnternetin olmadığı alanlarda kayıt girmek zorunlu mu?
6. Web uygulaması yeterli mi, yoksa App Store/Google Play'de yerel mobil uygulama da isteniyor mu?
7. Fatura/e-belge, banka hareketi veya mevcut muhasebe yazılımı entegrasyonu gerekli mi?
8. Mevcut Excel dosyaları içe aktarılacak mı?
9. Birden fazla çiftlik/şube yönetilecek mi?
10. Uygulama yalnızca tek işletme için mi geliştirilecek, yoksa farklı işletmelerin kayıt olabildiği abonelikli bir SaaS ürünü mü olacak?

## 16. Kaynaklar

Kaynaklar 10 Ekim 2026 tarihinde erişilebilen kamuya açık ürün sayfaları ve uygulama mağazası açıklamalarıdır. Özellikler ve kullanılabilirlik zaman içinde değişebilir.

### Türkiye
- Akıllı Sürü — https://play.google.com/store/apps/details?hl=tr&id=com.akillisuru.app
- ÇiftlikPro: Süt & Hayvan Takip — https://play.google.com/store/apps/details?hl=tr&id=com.deveciyazilim.ciftliktakip
- Ahırım Cebimde — https://apps.apple.com/tr/app/ah%C4%B1r%C4%B1m-cebimde/id6779227305
- Benim Çiftliğim — https://benimciftligim.net/tr/buyukbas-hayvancilik
- SürüPlus — https://suruyonetimi.app/
- CowMaster — https://www.suru-yonetimi.com/
- CowPro — https://suruyonetimi.tr/

### Uluslararası
- Farmbrite özellikleri — https://www.farmbrite.com/features
- Farmbrite muhasebe — https://www.farmbrite.com/accounting
- Farmbrite hayvan yönetimi — https://www.farmbrite.com/livestock
- CattleMax finans kayıtları — https://help.cattlemax.com/article/525-ranch-related-financial-record-keeping
- CattleMax — https://www.cattlemax.com/

---

## Önerilen sonraki adım

Önce yukarıdaki 10 başlangıç sorusunu yanıtlayıp kapsamı sabitleyin. Ardından ekran taslakları, ayrıntılı kullanıcı hikâyeleri, veritabanı şeması, API sözleşmeleri ve sprint planı hazırlanabilir.
