import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CheckoutComponent } from './index';


@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }
