import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticRoutingModule } from './static-routing.module';
import {
  AboutusComponent, DeliveryInformationComponent, ContactUsComponent,
  ReturnPolicyComponent, TermsConditionComponent, PrivacyPolicyComponent,
  FaqComponent,BlogComponent,BlogDetailComponent
} from './index';

@NgModule({
  declarations: [AboutusComponent, DeliveryInformationComponent, ReturnPolicyComponent, TermsConditionComponent, PrivacyPolicyComponent, ContactUsComponent, FaqComponent,BlogComponent,BlogDetailComponent],
  imports: [
    CommonModule,
    StaticRoutingModule
  ]
})
export class StaticModule { }
