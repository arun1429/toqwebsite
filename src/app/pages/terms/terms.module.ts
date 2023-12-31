import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-routing.module';
import {
 TermsConditionComponent
} from './index';

@NgModule({
  declarations: [ TermsConditionComponent],
  imports: [
    CommonModule,
    TermsRoutingModule
  ]
})
export class TermsModule { }
