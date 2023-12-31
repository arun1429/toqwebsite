import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialOfferProductsComponent } from './index';

const routes: Routes = [
  {
    path: '',
    component: SpecialOfferProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialOfferProductsRoutingModule { }
