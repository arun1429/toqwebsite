import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishListRoutingModule } from './wishlist-routing.module';
import { FormsModule } from '@angular/forms';
import { WishListComponent } from './wishlist/wishlist.component';


@NgModule({
  declarations: [WishListComponent],
  imports: [
    CommonModule,
    WishListRoutingModule,
    FormsModule
  ]
})
export class WishListModule { }
