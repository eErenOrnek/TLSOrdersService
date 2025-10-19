import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerAddress, CreateCustomerAddressDto } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerAddressService {
  private apiUrl = `${environment.apiUrl}/CustomerAddresses`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<CustomerAddress[]> {
    return this.http.get<CustomerAddress[]>(this.apiUrl);
  }

  getById(id: number): Observable<CustomerAddress> {
    return this.http.get<CustomerAddress>(`${this.apiUrl}/${id}`);
  }

  getByCustomerId(customerId: number): Observable<CustomerAddress[]> {
    return this.http.get<CustomerAddress[]>(`${this.apiUrl}/Customer/${customerId}`);
  }

  create(address: CreateCustomerAddressDto): Observable<CustomerAddress> {
    return this.http.post<CustomerAddress>(this.apiUrl, address);
  }

  update(id: number, address: CustomerAddress): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, address);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
