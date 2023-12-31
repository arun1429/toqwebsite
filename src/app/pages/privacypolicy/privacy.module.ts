import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyRoutingModule } from './privacy-routing.module';
import {
  PrivacyPolicyComponent
} from './index';

@NgModule({
  declarations: [ PrivacyPolicyComponent],
  imports: [
    CommonModule,
    PrivacyRoutingModule
  ]
})
export class PrivacyModule { }
