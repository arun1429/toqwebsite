import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CheckoutComponent } from './index';
import { NgxSpinnerModule } from "ngx-spinner"; 

@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }
