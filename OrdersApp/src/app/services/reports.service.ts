import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/Reports`;

  constructor(private http: HttpClient) { }

  getCustomersByStock(stockId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/CustomersByStock/${stockId}`);
  }

  getCustomersWithMultipleItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/CustomersWithMultipleItems`);
  }

  getCustomersDifferentAddresses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/CustomersDifferentAddresses`);
  }

  getOrdersByCustomerName(customerName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/OrdersByCustomerName/${customerName}`);
  }

  getOrderCountByCity(city: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/OrderCountByCity/${city}`);
  }

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Statistics`);
  }
}
