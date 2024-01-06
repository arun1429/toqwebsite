import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { Routes, RouterModule } from '@angular/router';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner"; 

import { NgxImageZoomModule } from 'ngx-image-zoom';

const routes: Routes = [{
  path: ":variantSlug",
  component: ProductDetailsComponent
}]

@NgModule({
  declarations: [ProductDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PinchZoomModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    NgxImageZoomModule,
  ]
})
export class ProductDetailsModule { }
