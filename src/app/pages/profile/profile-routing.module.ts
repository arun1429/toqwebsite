import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AccountComponent, AddressComponent, OrderHistoryComponent, SideNavComponent,
  WalletComponent,  OrderDetailComponent
} from './index';
import { NotificationComponent } from './notification/notification.component';
const routes: Routes = [
  {
    path: "",
    component: SideNavComponent,
    children: [
      {
        path: 'order-history',
        component: OrderHistoryComponent,
      },
      {
        path: 'notifications',
        component: NotificationComponent
      },
      {
        path: 'wallet',
        component: WalletComponent
      },
      {
        path: 'address',
        component: AddressComponent
      },
      {
        path: 'account',
        component: AccountComponent
      },
      {
        path: 'detail',
        component: OrderDetailComponent
      },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
