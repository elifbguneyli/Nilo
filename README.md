# Nilo

Çocuklara diş temizliği alışkanlığını interaktif oyunlarla kazandıran bir uygulama.

Nilo, 2 dakikalık diş fırçalama rutinini 6 bölgeye ayırıp her bölge için eğlenceli bir sayaç ve
canlı bir maskot gösterir. Çocuklar sabah/akşam fırçalama görevlerini tamamladıkça yıldız ve rozet
kazanır, günlük seri (streak) biriktirir. Ebeveynler, basit bir matematik sorusuyla korunan ayrı bir
panelden çocuklarının haftalık ilerlemesini görebilir.

Bu, [Nurto](https://apps.apple.com/us/app/nurto/id6805225277) uygulamasından ilham alan, tamamen
Türkçe bir alternatiftir. İlk sürüm sadece diş fırçalama deneyimine odaklanır.

> Not: Uygulama gerçek fırçalama hareketini algılamaz; sayaç ve animasyonlar sadece 2 dakikalık
> süreyi eğlenceli hale getirmek içindir, fırçalama tekniğini doğrulamaz.

## Özellikler

- 👶 Birden fazla çocuk profili (isim + karakter seçimi)
- 🪥 Sabah/akşam fırçalama görevleri, 6 bölgeli 2 dakikalık yönlendirmeli oyun
- ✨ Her bölgede dişin kademeli olarak parlayıp temizlendiğini gösteren animasyon, bölge
  tamamlandığında kısa bir kutlama efekti
- ⭐ Yıldız ödülleri ve rozet koleksiyonu
- 🏡 **Nilo'nun Evi**: sahip olunan şapka/gözlük Nilo'ya takılır, çiçek/mobilya/oyuncak gibi
  eşyalar odaya yerleştirilip kaldırılabilir (4 dekorasyon yuvası)
- 🛍️ **Yıldız Mağazası**: sabit fiyatlı, kategorilere ayrılmış bir eşya kataloğu (şapka, gözlük,
  çiçek, mobilya, oyuncak, özel eşya); gerçek para, reklam veya şans tabanlı ödül yok
- 🔥 Günlük fırçalama serisi takibi
- 👪 Matematik sorusuyla korunan ebeveyn paneli, haftalık ilerleme takvimi
- 📱 Tamamen tarayıcıda, `localStorage` ile çalışır — hesap veya sunucu gerekmez

## Yıldız Ekonomisi

Her çocuğun ilerlemesinde iki ayrı yıldız sayısı tutulur:

- **`totalStars`** — çocuğun ömür boyu kazandığı toplam yıldız. Sadece artar; rozetler ve
  "toplam kazanılan" başarımlar bu sayıya göre açılır.
- **`starBalance`** — harcanabilir bakiye. Fırçalama tamamlandıkça `totalStars` ile birlikte artar,
  mağazadan eşya alındıkça yalnızca bu sayı azalır (`totalStars` hiç etkilenmez).

Günün ilk fırçalama seansı 1 yıldız, aynı gün tamamlanan ikinci seans (sabah+akşam ikisi birden)
2 yıldız kazandırır — bu ödül kuralı değişmedi, sadece artık her iki sayaca birden yansıyor.

Eski kayıtlarla (henüz `starBalance` alanı olmayan `localStorage` verisiyle) açılan bir cihazda,
uygulama ilk yüklemede `starBalance`'ı o çocuğun o anki `totalStars` değerine eşitler ve bunu bir
kerede diske yazar; bu geçiş yalnızca bir kez çalışır, aynı veri bir daha "taze" bir migration
görmez. Satın almalar (`purchasedItemIds`) ve odadaki görünür eşyalar (`placedItemIds`) her çocuk
profili için ayrı ayrı saklanır; tekrarlanan tıklama, sayfa yenileme veya zaten tamamlanmış bir
seansı tekrar oynama, fazladan yıldız ya da aynı eşyanın ikinci kez satın alınmasına yol açmaz.

## Teknolojiler

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Framer Motion](https://motion.dev/)

## Geliştirme

```bash
npm install
npm run dev      # geliştirme sunucusu
npm run build    # production build
npm run lint      # lint kontrolü
```

## Netlify'a Dağıtım

Repo kökünde `netlify.toml` zaten yapılandırılmış: build komutu `npm run build`, yayın klasörü
`dist`, ve React Router'ın istemci taraflı rotalarının çalışması için tüm istekleri
`index.html`'e yönlendiren bir SPA kuralı içerir. Netlify'da "New site from Git" ile bu repoyu
bağlamak yeterlidir, ekstra ayar gerekmez.
