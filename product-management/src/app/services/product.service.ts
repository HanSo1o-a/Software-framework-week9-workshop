import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  add(p: Product): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, p);
  }

  update(_id: string, p: Partial<Product>): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${_id}`, p);
  }

  remove(_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${_id}`);
  }
}