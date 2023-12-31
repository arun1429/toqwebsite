import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialOfferProductsRoutingModule } from './specialoffer-products-routing.module';
import { SpecialOfferProductsComponent } from './index';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [SpecialOfferProductsComponent],
  imports: [
    CommonModule,
    SpecialOfferProductsRoutingModule,
    NgxPaginationModule
  ]
})
export class SpecialOfferProductsModule { }
