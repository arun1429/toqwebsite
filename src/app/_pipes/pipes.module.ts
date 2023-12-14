import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe, SortingPipe } from './index';

@NgModule({
  declarations: [FilterPipe, SortingPipe],
  imports: [
    CommonModule
  ],
  exports:[SortingPipe, FilterPipe]
})
export class PipesModule { }
