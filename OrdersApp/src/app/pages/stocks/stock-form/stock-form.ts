import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../services/stock.service';
import { Stock, CreateStockDto } from '../../../models/customer.model';

@Component({
  selector: 'app-stock-form',
  imports: [RouterLink, CommonModule],
  templateUrl: './stock-form.html',
  styleUrl: './stock-form.css'
})
export class StockFormComponent implements OnInit {
  stockId: number | null = null;
  stockName = signal('');
  unit = signal('');
  price = signal(0);
  barcode = signal('');
  isActive = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);

  parseFloat = parseFloat;

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.stockId = parseInt(id);
      this.loadStock(this.stockId);
    }
  }

  loadStock(id: number) {
    this.loading.set(true);
    this.stockService.getById(id).subscribe({
      next: (stock) => {
        this.stockName.set(stock.stockName);
        this.unit.set(stock.unit);
        this.price.set(stock.price);
        this.barcode.set(stock.barcode);
        this.isActive.set(stock.isActive);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Stok yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error('Stok yükleme hatası:', err);
      }
    });
  }

  save(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (!this.stockName().trim()) {
      alert('Lütfen stok adını girin.');
      return;
    }

    if (!this.unit().trim()) {
      alert('Lütfen birim girin.');
      return;
    }

    if (this.price() <= 0) {
      alert('Lütfen geçerli bir fiyat girin.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.stockId) {
      const stock: Stock = {
        stockId: this.stockId,
        stockName: this.stockName(),
        unit: this.unit(),
        price: this.price(),
        barcode: this.barcode(),
        isActive: this.isActive()
      };

      this.stockService.update(this.stockId, stock).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/stocks']);
        },
        error: (err) => {
          this.error.set('Stok güncellenirken bir hata oluştu: ' + (err.message || err.statusText));
          this.loading.set(false);
          console.error('Güncelleme hatası:', err);
        }
      });
    } else {
      const dto: CreateStockDto = {
        stockName: this.stockName(),
        unit: this.unit(),
        price: this.price(),
        barcode: this.barcode(),
        isActive: this.isActive()
      };

      this.stockService.create(dto).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/stocks']);
        },
        error: (err) => {
          this.error.set('Stok eklenirken bir hata oluştu: ' + (err.message || err.statusText));
          this.loading.set(false);
          console.error('Ekleme hatası:', err);
        }
      });
    }
  }
}
