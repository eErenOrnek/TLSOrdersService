import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetail, CreateOrderDetailDto } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {
  private apiUrl = `${environment.apiUrl}/OrderDetails`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(this.apiUrl);
  }

  getById(id: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/${id}`);
  }

  getByOrderId(orderId: number): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/Order/${orderId}`);
  }

  create(orderDetail: CreateOrderDetailDto & { orderId: number }): Observable<OrderDetail> {
    return this.http.post<OrderDetail>(this.apiUrl, orderDetail);
  }

  update(id: number, orderDetail: OrderDetail): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, orderDetail);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
