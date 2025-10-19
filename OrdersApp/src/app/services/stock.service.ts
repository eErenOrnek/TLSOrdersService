import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock, CreateStockDto } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/Stocks`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  getById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`);
  }

  getByBarcode(barcode: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/Barcode/${barcode}`);
  }

  create(stock: CreateStockDto): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock);
  }

  update(id: number, stock: Stock): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, stock);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
