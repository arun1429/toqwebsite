import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PipesModule } from "../../_pipes/pipes.module";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxPaginationModule } from 'ngx-pagination';

const routes:Routes=[{
  path:"",
  component:HomeComponent
}]  



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CarouselModule,
    PipesModule,
    NgxSliderModule,
    NgxPaginationModule
  ]
})
export class HomeModule { }
