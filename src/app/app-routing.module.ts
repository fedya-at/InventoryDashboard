import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ProductsComponent } from './products/products.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'reports',
    component: AnalyticsComponent,
    data: { breadcrumb: 'Reports' },
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { breadcrumb: 'Products' },
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    data: { breadcrumb: 'Inventory' },
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    data: { breadcrumb: 'Product Details' },
  },
  {
    path: 'edit-product/:id',
    component: EditProductComponent,
    data: { breadcrumb: 'Edit Product' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
