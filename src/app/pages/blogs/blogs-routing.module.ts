import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
BlogComponent,BlogDetailComponent
} from './index';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent
  },
  {
    path: 'blog-detail/:blogId',
    component: BlogDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
