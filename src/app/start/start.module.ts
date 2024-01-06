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
        path: "userprofile/forgotpassword",
        loadChildren: () => import("../pages/forgotpassword/forgotpassword.module").then(m => m.ForgotPasswordModule)
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
        path: "bestsellingproducts",
        loadChildren: () => import("../pages/selling-products/selling-products.module").then(m => m.SellingProductsModule)
      },
      {
        path: "newarrivalproducts",
        loadChildren: () => import("../pages/newarrival-products/newarrival-products.module").then(m => m.NewarrivalProductsModule)
      },
      {
        path: "specialofferproducts",
        loadChildren: () => import("../pages/specialoffer-products/specialoffer-products.module").then(m => m.SpecialOfferProductsModule)
      },
      {
        path: "about-us",
        loadChildren: () => import("../pages/aboutus/aboutus.module").then(m => m.AboutusModule)
      },
      {
        path: "delivery-information",
        loadChildren: () => import("../pages/deliveryinfo/delivery.module").then(m => m.DeliveryModule)
      },
      {
        path: "return-policy",
        loadChildren: () => import("../pages/returnpolicy/returnpolicy.module").then(m => m.ReturnPolicyModule)
      },
      {
        path: "terms-conditions",
        loadChildren: () => import("../pages/terms/terms.module").then(m => m.TermsModule)
      },
      {
        path: "privacy-policy",
        loadChildren: () => import("../pages/privacypolicy/privacy.module").then(m => m.PrivacyModule)
      },
      {
        path: "faq",
        loadChildren: () => import("../pages/faq/faq.module").then(m => m.FaqModule)
      },
      {
        path: "contact-us",
        loadChildren: () => import("../pages/contactus/contactus.module").then(m => m.ContactUsModule)
      },
      {
        path: "blogs",
        loadChildren: () => import("../pages/blogs/blogs.module").then(m => m.BlogsModule)
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
