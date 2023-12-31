import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellingProductsRoutingModule } from './selling-products-routing.module';
import { SellingProductsComponent } from './index';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [SellingProductsComponent],
  imports: [
    CommonModule,
    SellingProductsRoutingModule,
    NgxPaginationModule
  ]
})
export class SellingProductsModule { }
