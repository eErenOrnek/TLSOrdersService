import { Component, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { CustomerService } from '../../../services/customer.service';
import { StockService } from '../../../services/stock.service';
import { CustomerAddressService } from '../../../services/customer-address.service';
import { Order, CreateOrderDto, CreateOrderDetailDto, Customer, Stock, CustomerAddress } from '../../../models/customer.model';

interface OrderDetailForm {
  stockId: number;
  amount: number;
}

@Component({
  selector: 'app-order-form',
  imports: [RouterLink, CommonModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css'
})
export class OrderFormComponent implements OnInit {
  orderId: number | null = null;
  customerId = signal(0);
  orderNo = signal('');
  totalPrice = signal(0);
  tax = signal(0);
  deliveryAddressId = signal(0);
  invoiceAddressId = signal(0);
  isActive = signal(true);
  orderDetails = signal<OrderDetailForm[]>([]);
  
  customers = signal<Customer[]>([]);
  stocks = signal<Stock[]>([]);
  customerAddresses = signal<CustomerAddress[]>([]);
  
  loading = signal(false);
  error = signal<string | null>(null);

  parseFloat = parseFloat;
  parseInt = parseInt;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private stockService: StockService,
    private customerAddressService: CustomerAddressService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    effect(() => {
      const custId = this.customerId();
      if (custId > 0) {
        this.loadCustomerAddresses(custId);
      } else {
        this.customerAddresses.set([]);
        this.deliveryAddressId.set(0);
        this.invoiceAddressId.set(0);
      }
    });
  }

  ngOnInit() {
    this.loadCustomers();
    this.loadStocks();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.orderId = parseInt(id);
      this.loadOrder(this.orderId);
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

  loadCustomerAddresses(customerId: number) {
    this.customerAddressService.getByCustomerId(customerId).subscribe({
      next: (data) => {
        this.customerAddresses.set(data);
      },
      error: (err) => {
        console.error('Adres yükleme hatası:', err);
        this.customerAddresses.set([]);
      }
    });
  }

  loadOrder(id: number) {
    this.loading.set(true);
    this.orderService.getById(id).subscribe({
      next: (order) => {
        this.customerId.set(order.customerId);
        this.orderNo.set(order.orderNo);
        this.totalPrice.set(order.totalPrice);
        this.tax.set(order.tax);
        this.deliveryAddressId.set(order.deliveryAddressId);
        this.invoiceAddressId.set(order.invoiceAddressId);
        this.isActive.set(order.isActive);
        
        if (order.orderDetails) {
          this.orderDetails.set(order.orderDetails.map(d => ({
            stockId: d.stockId,
            amount: d.amount
          })));
        }
        
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Sipariş yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error('Sipariş yükleme hatası:', err);
      }
    });
  }

  addOrderDetail() {
    this.orderDetails.update(details => [...details, { stockId: 0, amount: 1 }]);
  }

  removeOrderDetail(index: number) {
    this.orderDetails.update(details => details.filter((_, i) => i !== index));
  }

  updateOrderDetail(index: number, field: 'stockId' | 'amount', value: number) {
    this.orderDetails.update(details => {
      const newDetails = [...details];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return newDetails;
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

    if (!this.orderNo().trim()) {
      alert('Lütfen sipariş numarası girin.');
      return;
    }

    if (this.deliveryAddressId() === 0) {
      alert('Lütfen teslimat adresi seçin.');
      return;
    }

    if (this.invoiceAddressId() === 0) {
      alert('Lütfen fatura adresi seçin.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const orderDetailsDto: CreateOrderDetailDto[] = this.orderDetails()
      .filter(d => d.stockId > 0 && d.amount > 0)
      .map(d => ({
        stockId: d.stockId,
        amount: d.amount,
        isActive: true
      }));

    if (this.orderId) {
      const order: any = {
        orderId: this.orderId,
        customerId: this.customerId(),
        orderNo: this.orderNo(),
        totalPrice: this.totalPrice(),
        tax: this.tax(),
        deliveryAddressId: this.deliveryAddressId(),
        invoiceAddressId: this.invoiceAddressId(),
        isActive: this.isActive(),
        orderDate: new Date()
      };

      this.orderService.update(this.orderId, order).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          this.error.set('Sipariş güncellenirken bir hata oluştu: ' + (err.message || err.statusText));
          this.loading.set(false);
          console.error('Güncelleme hatası:', err);
        }
      });
    } else {
      const dto: CreateOrderDto = {
        customerId: this.customerId(),
        orderNo: this.orderNo(),
        totalPrice: this.totalPrice(),
        tax: this.tax(),
        deliveryAddressId: this.deliveryAddressId(),
        invoiceAddressId: this.invoiceAddressId(),
        orderDate: new Date(),
        isActive: this.isActive(),
        orderDetails: orderDetailsDto
      };

      this.orderService.create(dto).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          this.error.set('Sipariş eklenirken bir hata oluştu: ' + (err.message || err.statusText));
          this.loading.set(false);
          console.error('Ekleme hatası:', err);
        }
      });
    }
  }
}
