import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { Customer, CreateCustomerDto } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  imports: [RouterLink, CommonModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css'
})
export class CustomerFormComponent implements OnInit {
  customerId: number | null = null;
  customerName = signal('');
  isActive = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.customerId = parseInt(id);
      this.loadCustomer(this.customerId);
    }
  }

  loadCustomer(id: number) {
    this.loading.set(true);
    this.customerService.getById(id).subscribe({
      next: (customer) => {
        this.customerName.set(customer.customerName);
        this.isActive.set(customer.isActive);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Müşteri yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error('Müşteri yükleme hatası:', err);
      }
    });
  }

  save(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (!this.customerName().trim()) {
      alert('Lütfen müşteri adını girin.');
      return;
    }

    console.log('Save başladı, customerId:', this.customerId);
    this.loading.set(true);
    this.error.set(null);

    if (this.customerId) {
      // Güncelleme
      const customer: Customer = {
        customerId: this.customerId,
        customerName: this.customerName(),
        isActive: this.isActive()
      };

      console.log('Güncelleme yapılıyor:', customer);

      this.customerService.update(this.customerId, customer).subscribe({
        next: (response) => {
          console.log('Güncelleme next callback çalıştı, response:', response);
          this.loading.set(false);
          console.log('Navigate ediliyor...');
          this.router.navigate(['/customers']).then(success => {
            console.log('Navigate sonucu:', success);
          });
        },
        error: (err) => {
          console.error('Güncelleme hatası detay:', err);
          this.error.set('Müşteri güncellenirken bir hata oluştu: ' + (err.message || err.statusText));
          this.loading.set(false);
        },
        complete: () => {
          console.log('Güncelleme complete çalıştı');
        }
      });
    } else {
      // Yeni kayıt
      const dto: CreateCustomerDto = {
        customerName: this.customerName(),
        isActive: this.isActive()
      };

      console.log('Yeni kayıt yapılıyor:', dto);

      this.customerService.create(dto).subscribe({
        next: (response) => {
          console.log('Kayıt başarılı:', response);
          this.loading.set(false);
          this.router.navigate(['/customers']).then(success => {
            console.log('Navigate sonucu:', success);
          });
        },
        error: (err) => {
          console.error('Ekleme hatası detay:', err);
          this.error.set('Müşteri eklenirken bir hata oluştu: ' + (err.message || err.statusText));
          this.loading.set(false);
        },
        complete: () => {
          console.log('Ekleme complete çalıştı');
        }
      });
    }
  }
}
