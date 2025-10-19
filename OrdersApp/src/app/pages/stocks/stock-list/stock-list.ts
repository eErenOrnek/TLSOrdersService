import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../services/stock.service';
import { Stock } from '../../../models/customer.model';

@Component({
  selector: 'app-stock-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css'
})
export class StockListComponent implements OnInit {
  stocks = signal<Stock[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.loading.set(true);
    this.error.set(null);
    
    this.stockService.getAll().subscribe({
      next: (data) => {
        this.stocks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Stoklar yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error('Stok yükleme hatası:', err);
      }
    });
  }

  deleteStock(id: number) {
    if (confirm('Bu stoğu silmek istediğinizden emin misiniz?')) {
      this.stockService.delete(id).subscribe({
        next: () => {
          this.loadStocks();
        },
        error: (err) => {
          alert('Stok silinirken bir hata oluştu.');
          console.error('Silme hatası:', err);
        }
      });
    }
  }
}
