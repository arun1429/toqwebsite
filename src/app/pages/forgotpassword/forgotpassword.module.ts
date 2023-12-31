import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { ForgotPasswordRoutingModule } from './forgotpassword-routing.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule
  ]
})
export class ForgotPasswordModule { }
