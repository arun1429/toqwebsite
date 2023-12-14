import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AboutusComponent, DeliveryInformationComponent, ContactUsComponent,
  ReturnPolicyComponent, TermsConditionComponent, PrivacyPolicyComponent,
  FaqComponent,BlogComponent,BlogDetailComponent
} from './index';

const routes: Routes = [
  {
    path: 'about-us',
    component: AboutusComponent
  },
  {
    path: 'delivery-information',
    component: DeliveryInformationComponent
  },
  {
    path: 'return-policy',
    component: ReturnPolicyComponent
  },
  {
    path: 'terms',
    component: TermsConditionComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'blogs',
    component: BlogComponent
  },
  {
    path: 'blog-detail/:blogId',
    component: BlogDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule { }
