import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewarrivalProductsRoutingModule } from './newarrival-products-routing.module';
import { NewarrivalProductsComponent } from './index';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [NewarrivalProductsComponent],
  imports: [
    CommonModule,
    NewarrivalProductsRoutingModule,
    NgxPaginationModule
  ]
})
export class NewarrivalProductsModule { }
