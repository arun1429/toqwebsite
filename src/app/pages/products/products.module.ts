import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from "../../_pipes/pipes.module";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ProductsComponent } from './products/products.component';
import { Routes, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [{
  path: ":categoryId",
  component: ProductsComponent
}]

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    PipesModule,
    NgxSliderModule,
    RouterModule.forChild(routes),
    NgxPaginationModule
  ]
})
export class ProductsModule { }
