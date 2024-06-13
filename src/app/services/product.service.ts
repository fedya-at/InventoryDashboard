import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'http://localhost:5092/api/Products';

  constructor(private http: HttpClient) {}

  // Fetch all products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Create a new product
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Get product by ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Update product
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadProductImage(file: File): Observable<{ imageUrl: string }> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    // Send POST request to upload endpoint
    return this.http.post<{ imageUrl: string }>(
      `${this.apiUrl}/upload`,
      formData
    );
  }
  getSortedProducts(
    sortBy: string,
    sortOrder: string = 'asc'
  ): Observable<any[]> {
    let params = new HttpParams()
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);
    return this.http.get<any[]>(`${this.apiUrl}/sorted`, { params });
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    let params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }
}
