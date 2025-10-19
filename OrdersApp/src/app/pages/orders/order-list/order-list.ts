import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/customer.model';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderListComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.error.set(null);
    
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Siparişler yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error('Sipariş yükleme hatası:', err);
      }
    });
  }

  deleteOrder(id: number) {
    if (confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
      this.orderService.delete(id).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (err) => {
          alert('Sipariş silinirken bir hata oluştu.');
          console.error('Silme hatası:', err);
        }
      });
    }
  }
}
