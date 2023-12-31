import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellingProductsComponent } from './index';

const routes: Routes = [
  {
    path: '',
    component: SellingProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellingProductsRoutingModule { }
