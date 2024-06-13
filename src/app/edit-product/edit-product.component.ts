import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  addProductForm: FormGroup;
  productId: string = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.addProductForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      tagId: [''],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product: Product) => {
        this.addProductForm.patchValue(product);
      },
      (error) => {
        console.error('Error loading product', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.addProductForm.valid) {
      const productData = this.addProductForm.value as Product;

      if (this.selectedFile) {
        this.productService.uploadProductImage(this.selectedFile).subscribe(
          (response) => {
            productData.imageUrl = response.imageUrl;

            this.updateProduct(productData);
          },
          (error) => {
            console.error('Error uploading image', error);
          }
        );
      } else {
        this.updateProduct(productData);
      }
    }
  }

  updateProduct(product: Product): void {
    this.productService.updateProduct(this.productId, product).subscribe(
      () => {
        console.log('Product updated successfully');
        this.router.navigate(['/products']);
      },
      (error) => {
        console.error('Error updating product', error);
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
