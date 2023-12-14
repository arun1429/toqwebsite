import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartComponent } from './start/start.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Shared Module
import { SharedModule } from "../_shared/shared.module";

const routes: Routes = [
  {
    path: "",
    component: StartComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("../pages/home/home.module").then(m => m.HomeModule)
      },
      {
        path: "userprofile/login",
        loadChildren: () => import("../pages/login/login.module").then(m => m.LoginModule)
      },
      {
        path: "userprofile/register",
        loadChildren: () => import("../pages/register/register.module").then(m => m.RegisterModule)
      },
      {
        path: "products",
        loadChildren: () => import("../pages/products/products.module").then(m => m.ProductsModule)
      },
      {
        path: "product-details",
        loadChildren: () => import("../pages/product-details/product-details.module").then(m => m.ProductDetailsModule)
      },
      {
        path: "userprofile/search",
        loadChildren: () => import("../pages/search-products/search-products.module").then(m => m.SearchProductsModule)
      },
      {
        path: "userprofile/cart",
        loadChildren: () => import("../pages/cart/cart.module").then(m => m.CartModule)
      },
      {
        path: "userprofile/checkout",
        loadChildren: () => import("../pages/checkout/checkout.module").then(m => m.CheckoutModule)
      },
      {
        path: "profile",
        loadChildren: () => import("../pages/profile/profile.module").then(m => m.ProfileModule)
      },
      {
        path: "static",
        loadChildren: () => import("../pages/static/static.module").then(m => m.StaticModule)
      }
    ]
  }
]


@NgModule({
  declarations: [StartComponent, HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class StartModule { }
