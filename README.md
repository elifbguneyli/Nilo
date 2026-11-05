# Nilo

Çocuklara diş temizliği alışkanlığını interaktif oyunlarla kazandıran bir uygulama.

Nilo, 2 dakikalık diş fırçalama rutinini 6 bölgeye ayırıp her bölge için eğlenceli bir sayaç ve
canlı bir maskot gösterir. Çocuklar sabah/akşam fırçalama görevlerini tamamladıkça yıldız ve rozet
kazanır, günlük seri (streak) biriktirir. Ebeveynler, basit bir matematik sorusuyla korunan ayrı bir
panelden çocuklarının haftalık ilerlemesini görebilir.

Bu, [Nurto](https://apps.apple.com/us/app/nurto/id6805225277) uygulamasından ilham alan, tamamen
Türkçe bir alternatiftir. İlk sürüm sadece diş fırçalama deneyimine odaklanır.

## Özellikler

- 👶 Birden fazla çocuk profili (isim + karakter seçimi)
- 🪥 Sabah/akşam fırçalama görevleri, 6 bölgeli 2 dakikalık yönlendirmeli oyun
- ⭐ Yıldız ödülleri ve rozet koleksiyonu
- 🔥 Günlük fırçalama serisi takibi
- 👪 Matematik sorusuyla korunan ebeveyn paneli, haftalık ilerleme takvimi
- 📱 Tamamen tarayıcıda, `localStorage` ile çalışır — hesap veya sunucu gerekmez

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
