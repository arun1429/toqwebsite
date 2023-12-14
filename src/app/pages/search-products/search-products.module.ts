import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchProductsRoutingModule } from './search-products-routing.module';
import { SearchProductsComponent } from './index';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [SearchProductsComponent],
  imports: [
    CommonModule,
    SearchProductsRoutingModule,
    NgxPaginationModule
  ]
})
export class SearchProductsModule { }
