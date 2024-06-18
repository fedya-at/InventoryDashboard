import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IndividualConfig } from 'ngx-toastr';
import { CommunService, toastPayload } from '../services/commun.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  addProductForm: FormGroup;
  selectedProduct: Product | null = null;
  selectedProductToDelete: Product | null = null; // Add this line
  toast!: toastPayload;
  selectedFile: File | null = null;
  sortCriteria: string = '';
  sortOrder: string = 'asc';

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private cs: CommunService
  ) {
    this.addProductForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      tagId: [''],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  showToast(type: string, message: string) {
    this.toast = {
      message: message,
      title: '',
      type: type,
      ic: {
        timeOut: 5000,
        closeButton: true,
      } as IndividualConfig,
    };
    this.cs.showToast(this.toast);
  }

  loadProducts(): void {
    if (this.sortCriteria) {
      this.productService
        .getSortedProducts(this.sortCriteria, this.sortOrder)
        .subscribe(
          (data: Product[]) => {
            this.products = data;
            this.totalItems = this.products.length; // Set total items for pagination
          },
          (error) => {
            this.showToast(
              'error',
              'Error fetching products: ' + error.message
            );
          }
        );
    } else {
      this.productService.getAllProducts().subscribe(
        (data: Product[]) => {
          this.products = data;
          this.totalItems = this.products.length; // Set total items for pagination
        },
        (error) => {
          this.showToast('error', 'Error fetching products: ' + error.message);
        }
      );
    }
  }

  editProduct(id: number): void {
    this.router.navigate(['/edit-product', id]);
  }
  onSearch(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.productService.searchProducts(searchTerm).subscribe(
        (data: Product[]) => {
          this.products = data;
          this.totalItems = this.products.length; // Update total items for pagination
        },
        (error) => {
          console.error('Error searching products', error);
        }
      );
    } else {
      this.loadProducts();
    }
  }
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.showToast('success', `Product with id ${id} deleted successfully`);
        this.loadProducts(); // Refresh the product list after deletion
      },
      (error) => {
        this.showToast('error', 'Error deleting product: ' + error.message);
      }
    );
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  getCurrentPageProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(startIndex, startIndex + this.pageSize);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.addProductForm.valid && this.selectedFile) {
      const productData = this.addProductForm.value as Product;

      // Upload image first
      this.productService.uploadProductImage(this.selectedFile).subscribe(
        (response) => {
          // Set imageUrl in productData with the received URL
          productData.imageUrl = response.imageUrl;

          // Add product with updated imageUrl
          this.productService.createProduct(productData).subscribe(
            () => {
              console.log('Product added successfully');
            },
            (error) => {
              console.error('Error adding product', error);
            }
          );
        },
        (error) => {
          console.error('Error uploading image', error);
        }
      );
    }
  }

  onProductSelect(event: Event, product: Product): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedProduct = product;
    } else {
      this.selectedProduct = null;
    }
  }

  sortProducts(criteria: string): void {
    if (this.sortCriteria === criteria) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortCriteria = criteria;
      this.sortOrder = 'asc';
    }
    this.loadProducts();
  }
  convertToCSV(products: Product[]): string {
    const headers = [
      'ID',
      'Name',
      'Description',
      'Price',
      'Stock',
      'Image URL',
      'Tag ID',
    ];
    const csvRows = [headers.join(',')];

    products.forEach((product) => {
      const values = [
        product.id,
        product.name,
        product.description,
        product.price,
        product.stock,
        product.imageUrl,
        product.tagId,
      ];
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }
  downloadCSV(): void {
    const csvData = this.convertToCSV(this.products);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'products.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
