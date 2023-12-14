import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StepOneComponent } from './login/step-one/step-one.component';
import { StepTwoComponent } from './login/step-two/step-two.component';

const routes: Routes = [{
  path: "",
  component: LoginComponent
}]

@NgModule({
  declarations: [LoginComponent, StepOneComponent, StepTwoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
