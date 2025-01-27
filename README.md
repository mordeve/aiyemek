# Günün Yemeği 🍽️

Modern yapay zeka teknolojisi ile günlük yemek önerileri sunan bir web platformu.

## 🌟 Özellikler

- 🤖 Google Gemini AI ile otomatik yemek önerileri
- 🌅 Günlük sabah, öğle ve akşam yemekleri
- 🎨 Modern ve kullanıcı dostu arayüz
- 🔄 Her gün 00:00'da otomatik içerik güncellemesi
- 📱 Mobil uyumlu tasarım
- 🔍 SEO optimizasyonu

## 🛠️ Teknoloji Stack

### Frontend
- Next.js 14 (React Framework)
- Tailwind CSS (Styling)
- TypeScript
- Framer Motion (Animasyonlar)

### Backend
- Node.js
- Express.js
- MongoDB (Veritabanı)
- Google Gemini AI API
- Docker

## 🚀 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/gununyemegi_com.git
cd gununyemegi_com
```

2. Gerekli paketleri yükleyin:
```bash
# Backend için
cd backend
npm install

# Frontend için
cd ../frontend
npm install
```

3. Çevre değişkenlerini ayarlayın:
```bash
# Backend (.env)
GEMINI_API_KEY=your_api_key
MONGODB_URI=your_mongodb_uri
PORT=3001

# Frontend (.env)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Uygulamayı başlatın:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 🌐 Deployment

- Frontend: Vercel
- Backend: DigitalOcean
- Domain: gununyemegi.com
- SSL: Let's Encrypt

## 📈 SEO Optimizasyonu

- Meta etiketleri optimizasyonu
- Sayfa hızı optimizasyonu
- Mobil uyumluluk
- Semantik HTML yapısı
- Sitemap.xml ve robots.txt
- Yapısal veri (Schema.org)
- Open Graph meta etiketleri

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

Website - [www.gununtarifi.com](https://www.gununtarifi.com)