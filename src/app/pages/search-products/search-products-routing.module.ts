import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchProductsComponent } from './index';

const routes: Routes = [
  {
    path: '',
    component: SearchProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchProductsRoutingModule { }
