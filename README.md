# Ekonomik Analiz - Yetenek vs. SaaS Karar Destek Aracı

Bu proje, bir işveren veya karar verici olarak dışarıdan yazılım hizmetleri (SaaS abonelikleri) satın almak ile tam zamanlı bir çalışan (yetenek) işe almak arasındaki maliyet ve performans karşılaştırmasını yapmanızı sağlayan profesyonel bir Karar Destek Sistemidir.

Aynı zamanda iş arayan yeteneklerin, şirketlere kendilerini işe almanın mevcut SaaS hizmetlerini kullanmaktan daha maliyet etkin ve verimli olduğunu kanıtlamalarına yardımcı olacak veriye dayalı bir argüman sunmak için de kullanılabilir.

## 🚀 Özellikler

- **Maliyet Analizi:** Aylık maliyetler, yıllık sabit giderler, donanım ve eğitim maliyetlerini hesaba katarak 12 aylık projeksiyon çıkarır.
- **Performans Analizi:** Görev örtüşmesi (kapsam) ve performans başına maliyet hesabı yapar.
- **Otomatik Tavsiye:** Girilen verilere göre hangi seçeneğin daha mantıklı olduğuna dair çıkarım yapar.
- **Görselleştirme:** Dinamik grafikler ile maliyetin zaman içindeki değişimini gösterir (Başa baş noktası tespiti).

## 🛠️ Teknolojiler

- **Backend:** Python, FastAPI, Pydantic
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Chart.js (veya benzeri grafik kütüphanesi)

## 📦 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz.

### 1. Gereksinimler

- Bilgisayarınızda **Python 3.8+** sürümünün yüklü olduğundan emin olun.

### 2. Projeyi İndirme (Clone)

Projeyi bilgisayarınıza indirin veya klonlayın:
```bash
git clone <repository-url>
cd ekonomik_analiz
```

### 3. Sanal Ortam Oluşturma (Önerilen)

Projeye özel bir Python sanal ortamı oluşturmak bağımlılık çakışmalarını önler:

**Windows için:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux için:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Gerekli Kütüphanelerin Yüklenmesi

Projenin çalışması için gereken Python kütüphanelerini `requirements.txt` dosyasından yükleyin:

```bash
pip install -r requirements.txt
```
*(Bu komut `fastapi`, `uvicorn`, `pydantic` ve `python-multipart` gibi kütüphaneleri kuracaktır.)*

### 5. Uygulamayı Başlatma

Backend sunucusunu başlatmak için ana dizindeyken şu komutu çalıştırın:

```bash
python backend/main.py
```

### 6. Tarayıcıda Görüntüleme

Uygulama başarıyla başladıktan sonra web tarayıcınızı açın ve aşağıdaki adrese gidin:

**[http://localhost:8004](http://localhost:8004)**

Arayüz karşınıza çıkacak ve analiz formunu doldurarak hemen kullanmaya başlayabileceksiniz.
