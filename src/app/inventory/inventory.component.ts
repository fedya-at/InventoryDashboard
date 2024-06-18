import { Component, OnInit } from '@angular/core';
import { InventoryServiceService } from '../services/inventory-service.service';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { NgForm } from '@angular/forms';
import { environment } from '../models/environment';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  imageUrlBase = environment.imageUrl; // Base URL for images

  categories$: Observable<any[]>;
  category: Category = {
    id: '',
    nameCategory: '',
    descriptionCategory: '',
    imageUrlCategory: '',
  };
  imageName: string = '';
  selectedFile: File | null = null;
  imageUrl: string | null = null;

  constructor(private inventoryService: InventoryServiceService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categories$ = this.inventoryService.getAllCategories();
    this.categories$.subscribe((categories) => {
      console.log('Categories:', categories); // Log categories array
    });
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile); // Add logging
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.inventoryService.uploadFile(formData).subscribe(
        (response) => {
          console.log('Upload response:', response); // Log the response

          this.imageUrl = response.imageUrl; // Assuming `imageUrl` is the correct property returned
          console.log('Image URL:', this.imageUrl);

          // Set the image URL directly to category
          this.category.imageUrlCategory = this.imageUrl;

          console.log('Category data before creation:', this.category); // Log the data

          this.inventoryService.createCategory(this.category).subscribe(
            () => {
              form.resetForm();
              this.selectedFile = null;
              this.imageUrl = null;
            },
            (error) => {
              // Handle error
              console.error('Error creating category:', error);
            }
          );
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }
}
