import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { CustomerListComponent } from './pages/customers/customer-list/customer-list';
import { CustomerFormComponent } from './pages/customers/customer-form/customer-form';
import { CustomerAddressListComponent } from './pages/customer-addresses/customer-address-list/customer-address-list';
import { CustomerAddressFormComponent } from './pages/customer-addresses/customer-address-form/customer-address-form';
import { StockListComponent } from './pages/stocks/stock-list/stock-list';
import { StockFormComponent } from './pages/stocks/stock-form/stock-form';
import { OrderListComponent } from './pages/orders/order-list/order-list';
import { OrderFormComponent } from './pages/orders/order-form/order-form';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/new', component: CustomerFormComponent },
      { path: 'customers/edit/:id', component: CustomerFormComponent },
      { path: 'customer-addresses', component: CustomerAddressListComponent },
      { path: 'customer-addresses/new', component: CustomerAddressFormComponent },
      { path: 'customer-addresses/edit/:id', component: CustomerAddressFormComponent },
      { path: 'stocks', component: StockListComponent },
      { path: 'stocks/new', component: StockFormComponent },
      { path: 'stocks/edit/:id', component: StockFormComponent },
      { path: 'orders', component: OrderListComponent },
      { path: 'orders/new', component: OrderFormComponent },
      { path: 'orders/edit/:id', component: OrderFormComponent }
    ]
  }
];

