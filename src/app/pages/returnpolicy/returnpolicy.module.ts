import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnPolicyRoutingModule } from './returnpolicy-routing.module';
import {
  ReturnPolicyComponent
} from './index';

@NgModule({
  declarations: [ReturnPolicyComponent],
  imports: [
    CommonModule,
    ReturnPolicyRoutingModule
  ]
})
export class ReturnPolicyModule { }
