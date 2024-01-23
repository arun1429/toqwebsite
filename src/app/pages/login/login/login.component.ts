import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  step1Data: any;
  step: number = 1;

  constructor(private _FB: FormBuilder,private seoService: SEOService,private updateMetaTagSrv:MetakeywordsService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this._FB.group({
      mobileNo: ['', Validators.required]
    })
    this.seoService.updateCanonicalUrl('https://toq.co.in/userprofile/login')
    this.updateMetaTagSrv.getSeoContent('Login Page').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords,"https://toq.co.in/userprofile/login",data.data.imageUrl)
        }
      }
    )
  }

  step1Result(e) {
    if (e) {
      this.step = 2;
      this.step1Data = e;
    }
  }

}
