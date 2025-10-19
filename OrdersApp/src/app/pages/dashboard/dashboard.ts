import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../services/reports.service';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../models/customer.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  statistics = signal<any>({ totalCustomers: 0, totalStocks: 0, totalOrders: 0, totalRevenue: 0 });
  
  // Report data
  stocks = signal<Stock[]>([]);
  selectedStockId = signal<number>(0);
  reportData = signal<any>(null);
  reportType = signal<string>('');
  loading = signal(false);
  
  // For customer name search
  customerNameSearch = signal<string>('TLS');
  
  // For city search
  citySearch = signal<string>('İstanbul');

  parseFloat = parseFloat;
  parseInt = parseInt;

  constructor(
    private reportsService: ReportsService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.loadStatistics();
    this.loadStocks();
  }

  loadStatistics() {
    this.reportsService.getStatistics().subscribe({
      next: (data) => {
        this.statistics.set(data);
      },
      error: (err) => {
        console.error('İstatistik yükleme hatası:', err);
      }
    });
  }

  loadStocks() {
    this.stockService.getAll().subscribe({
      next: (data) => {
        this.stocks.set(data);
      },
      error: (err) => {
        console.error('Stok yükleme hatası:', err);
      }
    });
  }

  // 1. Ürünü alan müşteriler
  getCustomersByStock() {
    if (this.selectedStockId() === 0) {
      alert('Lütfen bir ürün seçin.');
      return;
    }

    this.loading.set(true);
    this.reportType.set('customersByStock');
    
    this.reportsService.getCustomersByStock(this.selectedStockId()).subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Rapor hatası:', err);
        this.loading.set(false);
        alert('Rapor oluşturulurken bir hata oluştu.');
      }
    });
  }

  // 2. Çoklu ürün alan müşteriler
  getCustomersWithMultipleItems() {
    this.loading.set(true);
    this.reportType.set('multipleItems');
    
    this.reportsService.getCustomersWithMultipleItems().subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Rapor hatası:', err);
        this.loading.set(false);
        alert('Rapor oluşturulurken bir hata oluştu.');
      }
    });
  }

  // 3. Farklı adresli müşteriler
  getCustomersDifferentAddresses() {
    this.loading.set(true);
    this.reportType.set('differentAddresses');
    
    this.reportsService.getCustomersDifferentAddresses().subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Rapor hatası:', err);
        this.loading.set(false);
        alert('Rapor oluşturulurken bir hata oluştu.');
      }
    });
  }

  // 4. Müşteriye göre siparişler
  getOrdersByCustomerName() {
    if (!this.customerNameSearch().trim()) {
      alert('Lütfen müşteri adı girin.');
      return;
    }

    this.loading.set(true);
    this.reportType.set('ordersByCustomer');
    
    this.reportsService.getOrdersByCustomerName(this.customerNameSearch()).subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Rapor hatası:', err);
        this.loading.set(false);
        alert('Rapor oluşturulurken bir hata oluştu.');
      }
    });
  }

  // 5. Şehre göre sipariş sayısı
  getOrderCountByCity() {
    if (!this.citySearch().trim()) {
      alert('Lütfen şehir adı girin.');
      return;
    }

    this.loading.set(true);
    this.reportType.set('ordersByCity');
    
    this.reportsService.getOrderCountByCity(this.citySearch()).subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Rapor hatası:', err);
        this.loading.set(false);
        alert('Rapor oluşturulurken bir hata oluştu.');
      }
    });
  }

  closeReport() {
    this.reportData.set(null);
    this.reportType.set('');
  }
}
