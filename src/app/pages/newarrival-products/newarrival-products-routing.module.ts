import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewarrivalProductsComponent } from './index';

const routes: Routes = [
  {
    path: '',
    component: NewarrivalProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewarrivalProductsRoutingModule { }
