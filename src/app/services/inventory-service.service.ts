import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryServiceService {
  apiUrl = 'http://localhost:5092/api';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Category`);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/Category/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/Category`, category);
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/Category/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Category/${id}`);
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Category/upload`, formData);
  }
  getImagePaths(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Category/image-paths`);
  }

  // CRUD operations for Export

  getAllExports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Export`);
  }

  getExportById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Export/${id}`);
  }

  createExport(exportData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Export`, exportData);
  }

  updateExport(id: string, exportData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Export/${id}`, exportData);
  }

  deleteExport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Export/${id}`);
  }

  // CRUD operations for Import

  getAllImports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Import`);
  }

  getImportById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Import/${id}`);
  }

  createImport(importData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Import`, importData);
  }

  updateImport(id: string, importData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Import/${id}`, importData);
  }

  deleteImport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Import/${id}`);
  }

  // CRUD operations for Inventory

  getAllInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Inventory`);
  }

  getInventoryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Inventory/${id}`);
  }

  createInventory(inventoryData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Inventory`, inventoryData);
  }

  updateInventory(id: string, inventoryData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Inventory/${id}`, inventoryData);
  }

  deleteInventory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Inventory/${id}`);
  }
}
