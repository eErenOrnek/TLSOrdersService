import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerAddressService } from '../../../services/customer-address.service';
import { CustomerService } from '../../../services/customer.service';
import { CustomerAddress, Customer, CreateCustomerAddressDto } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-address-form',
  imports: [RouterLink, CommonModule],
  templateUrl: './customer-address-form.html',
  styleUrl: './customer-address-form.css'
})
export class CustomerAddressFormComponent implements OnInit {
  addressId: number | null = null;
  customerId = signal(0);
  addressType = signal('Teslimat');
  country = signal('');
  city = signal('');
  town = signal('');
  address = signal('');
  email = signal('');
  phone = signal('');
  postalCode = signal('');
  isActive = signal(true);
  
  customers = signal<Customer[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  parseInt = parseInt;

  constructor(
    private addressService: CustomerAddressService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCustomers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.addressId = parseInt(id);
      this.loadAddress(this.addressId);
    }
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

  loadAddress(id: number) {
    this.loading.set(true);
    this.addressService.getById(id).subscribe({
      next: (address) => {
        this.customerId.set(address.customerId);
        this.addressType.set(address.addressType);
        this.country.set(address.country);
        this.city.set(address.city);
        this.town.set(address.town);
        this.address.set(address.address);
        this.email.set(address.email);
        this.phone.set(address.phone);
        this.postalCode.set(address.postalCode);
        this.isActive.set(address.isActive);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Adres yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error('Adres yükleme hatası:', err);
      }
    });
  }

  save(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (this.customerId() === 0) {
      alert('Lütfen müşteri seçin.');
      return;
    }

    if (!this.country().trim() || !this.city().trim() || !this.address().trim()) {
      alert('Lütfen zorunlu alanları doldurun.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.addressId) {
      // Güncelleme
      const address: any = {
        addressId: this.addressId,
        customerId: this.customerId(),
        addressType: this.addressType(),
        country: this.country(),
        city: this.city(),
        town: this.town(),
        address: this.address(),
        email: this.email(),
        phone: this.phone(),
        postalCode: this.postalCode(),
        isActive: this.isActive()
      };

      this.addressService.update(this.addressId, address).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/customer-addresses']);
        },
        error: (err) => {
          this.error.set('Güncelleme sırasında bir hata oluştu.');
          this.loading.set(false);
          console.error('Güncelleme hatası:', err);
        }
      });
    } else {
      // Yeni kayıt
      const dto: CreateCustomerAddressDto = {
        customerId: this.customerId(),
        addressType: this.addressType(),
        country: this.country(),
        city: this.city(),
        town: this.town(),
        address: this.address(),
        email: this.email(),
        phone: this.phone(),
        postalCode: this.postalCode(),
        isActive: this.isActive()
      };

      this.addressService.create(dto).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/customer-addresses']);
        },
        error: (err) => {
          this.error.set('Kayıt sırasında bir hata oluştu.');
          this.loading.set(false);
          console.error('Kayıt hatası:', err);
        }
      });
    }
  }
}
