import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerAddressService } from '../../../services/customer-address.service';
import { CustomerService } from '../../../services/customer.service';
import { CustomerAddress, Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-address-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './customer-address-list.html',
  styleUrl: './customer-address-list.css'
})
export class CustomerAddressListComponent implements OnInit {
  addresses = signal<CustomerAddress[]>([]);
  customers = signal<Customer[]>([]);
  selectedCustomerId = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);

  parseInt = parseInt;

  constructor(
    private addressService: CustomerAddressService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCustomers();
    this.loadAllAddresses();
  }

  loadCustomers() {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data);
      },
      error: (err) => {
        console.error('Müşteri yükleme hatası:', err);
      }
    });
  }

  loadAllAddresses() {
    this.loading.set(true);
    this.error.set(null);
    this.addressService.getAll().subscribe({
      next: (data) => {
        this.addresses.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Adresler yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error('Adres yükleme hatası:', err);
      }
    });
  }

  filterByCustomer() {
    const custId = this.selectedCustomerId();
    if (custId === 0) {
      this.loadAllAddresses();
    } else {
      this.loading.set(true);
      this.error.set(null);
      this.addressService.getByCustomerId(custId).subscribe({
        next: (data) => {
          this.addresses.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Adresler yüklenirken bir hata oluştu.');
          this.loading.set(false);
          console.error('Adres yükleme hatası:', err);
        }
      });
    }
  }

  deleteAddress(id: number) {
    if (confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
      this.addressService.delete(id).subscribe({
        next: () => {
          this.addresses.update(addresses => addresses.filter(a => a.addressId !== id));
        },
        error: (err) => {
          alert('Silme işlemi başarısız oldu.');
          console.error('Silme hatası:', err);
        }
      });
    }
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers().find(c => c.customerId === customerId);
    return customer?.customerName || 'Bilinmiyor';
  }
}
