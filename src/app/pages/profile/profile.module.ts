import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgxPaginationModule } from 'ngx-pagination';
import {
  AccountComponent, AddressComponent, OrderHistoryComponent,
  SideNavComponent, WalletComponent, WishlistComponent, OrderDetailComponent
} from './index';
import { AddAddressComponent } from './address/add-address/add-address.component';
import { AddressListComponent } from './address/address-list/address-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NotificationComponent } from './notification/notification.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [AccountComponent, AddressComponent, OrderHistoryComponent, SideNavComponent, WalletComponent, WishlistComponent, OrderDetailComponent, AddAddressComponent, AddressListComponent, NotificationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    ProfileRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    NgxSpinnerModule,
  ]
})
export class ProfileModule { }
