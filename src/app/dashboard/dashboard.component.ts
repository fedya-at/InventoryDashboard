import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CommunService, toastPayload } from '../services/commun.service';
import { IndividualConfig } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  products: Product[] | null = null; // Initialize with null or empty array

  toast!: toastPayload;

  constructor(
    private ps: ProductService,
    private cs: CommunService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts();
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

  getProducts(): void {
    this.ps.getAllProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        this.showToast('error', 'Error fetching products');
        console.error('Error fetching products:', error);
      }
    );
  }

  goToProductDetail(id: any): void {
    this.router.navigate(['/product', id]);
  }
}
