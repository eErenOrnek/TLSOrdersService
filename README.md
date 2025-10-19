## Kurulum

Projeyi klonladıktan sonra aşağıdaki adımları takip edin.

### Veritabanı Ayarları

OrdersService klasörü altında appsettings.json dosyası oluşturun. Örnek dosyayı kopyalayabilirsiniz:

```bash
cd OrdersService
copy appsettings.example.json appsettings.json
```

appsettings.json dosyasını açın ve kendi SQL Server bilgilerinizi girin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=OrdersDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True"
  }
}
```

Veritabanını oluşturmak için migration çalıştırın:

```bash
dotnet ef database update
```

Backend'i çalıştırın:

```bash
dotnet run
```

### Frontend Kurulumu

OrdersApp klasörüne gidin ve paketleri yükleyin:

```bash
cd OrdersApp
npm install
```

Angular uygulamasını başlatın:

```bash
npm start
```

Uygulama http://localhost:4200 adresinde çalışacak. Backend http://localhost:5224 portunda API sunuyor.
