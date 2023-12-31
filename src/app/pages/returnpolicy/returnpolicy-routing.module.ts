import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ReturnPolicyComponent
} from './index';

const routes: Routes = [
  {
    path: '',
    component: ReturnPolicyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnPolicyRoutingModule { }
