import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

//Interceptors
import { HttpErrorInterceptor, HttpHeadersInterceptor } from "./_interceptors/index";

// Shared Module
import { SharedModule } from "./_shared/shared.module";

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';


const routes: Routes = [{
  path: "",
  loadChildren: () => import("./start/start.module").then(m => m.StartModule)
}]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    SharedModule,
    SocialLoginModule
  ],
  providers: [
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },{
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
            '273057408962-h8cnc3e8s9cbpg6h2la8c49qf9hjc4jl.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }

    

    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
