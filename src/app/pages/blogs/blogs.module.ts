import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import {
 BlogComponent,BlogDetailComponent
} from './index';

@NgModule({
  declarations: [BlogComponent,BlogDetailComponent],
  imports: [
    CommonModule,
    BlogsRoutingModule
  ]
})
export class BlogsModule { }
