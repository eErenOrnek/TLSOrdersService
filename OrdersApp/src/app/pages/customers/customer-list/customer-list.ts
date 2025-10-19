import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerListComponent implements OnInit {
  customers = signal<Customer[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading.set(true);
    this.error.set(null);
    
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Müşteriler yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error('Müşteri yükleme hatası:', err);
      }
    });
  }

  deleteCustomer(id: number) {
    if (confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      this.customerService.delete(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err) => {
          alert('Müşteri silinirken bir hata oluştu.');
          console.error('Silme hatası:', err);
        }
      });
    }
  }
}
