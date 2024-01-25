import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WishListComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  {
    path: '',
    component: WishListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishListRoutingModule { }
