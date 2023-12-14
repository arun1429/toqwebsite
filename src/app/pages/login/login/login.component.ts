import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  step1Data: any;
  step: number = 1;

  constructor(private _FB: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this._FB.group({
      mobileNo: ['', Validators.required]
    })
  }

  step1Result(e) {
    if (e) {
      this.step = 2;
      this.step1Data = e;
    }
  }

}
