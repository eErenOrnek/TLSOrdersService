export interface Customer {
  customerId: number;
  customerName: string;
  isActive: boolean;
  addresses?: CustomerAddress[];
  orders?: Order[];
}

export interface CustomerAddress {
  addressId: number;
  customerId: number;
  addressType: string;
  country: string;
  city: string;
  town: string;
  address: string;
  email: string;
  phone: string;
  postalCode: string;
  isActive: boolean;
  customer?: Customer;
}

export interface Stock {
  stockId: number;
  stockName: string;
  unit: string;
  price: number;
  barcode: string;
  isActive: boolean;
  orderDetails?: OrderDetail[];
}

export interface Order {
  orderId: number;
  customerId: number;
  orderDate: Date;
  orderNo: string;
  totalPrice: number;
  tax: number;
  deliveryAddressId: number;
  invoiceAddressId: number;
  isActive: boolean;
  customer?: Customer;
  deliveryAddress?: CustomerAddress;
  invoiceAddress?: CustomerAddress;
  orderDetails?: OrderDetail[];
}

export interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  stockId: number;
  amount: number;
  isActive: boolean;
  order?: Order;
  stock?: Stock;
}

// DTOs for creating/updating
export interface CreateCustomerDto {
  customerName: string;
  isActive?: boolean;
}

export interface CreateCustomerAddressDto {
  customerId: number;
  addressType: string;
  country: string;
  city: string;
  town: string;
  address: string;
  email: string;
  phone: string;
  postalCode: string;
  isActive?: boolean;
}

export interface CreateStockDto {
  stockName: string;
  unit: string;
  price: number;
  barcode: string;
  isActive?: boolean;
}

export interface CreateOrderDto {
  customerId: number;
  orderNo: string;
  totalPrice: number;
  tax: number;
  deliveryAddressId: number;
  invoiceAddressId: number;
  orderDate?: Date;
  isActive?: boolean;
  orderDetails?: CreateOrderDetailDto[];
}

export interface CreateOrderDetailDto {
  stockId: number;
  amount: number;
  isActive?: boolean;
}
