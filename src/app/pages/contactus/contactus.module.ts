import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactUsRoutingModule } from './contactus-routing.module';
import {
   ContactUsComponent
} from './index';

@NgModule({
  declarations: [ ContactUsComponent],
  imports: [
    CommonModule,
    ContactUsRoutingModule
  ]
})
export class ContactUsModule { }
