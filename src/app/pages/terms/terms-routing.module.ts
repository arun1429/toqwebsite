import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  TermsConditionComponent
} from './index';

const routes: Routes = [
  {
    path: '',
    component: TermsConditionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsRoutingModule { }
