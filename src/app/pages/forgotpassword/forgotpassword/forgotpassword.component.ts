import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { RootComponent } from 'src/app/_shared/components/root/root.component';
import { ForgotPasswordService } from '../forgotpassword.service';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotPasswordComponent extends RootComponent implements OnInit {

  forgotpasswordFormGroup: FormGroup;
  verifyFormGroup: FormGroup;
  step: number = 1;
  constructor(
    public _AS: AlertService,
    private _FB: FormBuilder,
    private _RS: ForgotPasswordService,
    private router: Router,private updateMetaTagSrv:MetakeywordsService,private seoService: SEOService
  ) {
    super(_AS);
    this.forgotpasswordFormGroup = this._FB.group({
      mobileNo: ['', Validators.required],
    })
    this.verifyFormGroup = this._FB.group({
      mobileNo: ['', Validators.required],
      otp: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.updateMetaTagSrv.getSeoContent('Forgot Password').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords,"https://toq.co.in/forgot-password"+data.categorySlug,data.data.imageUrl)
        }
      }
    )
    this.seoService.updateCanonicalUrl('https://toq.co.in/forgot-password')
  }

  sendOtp() {
    if (this.forgotpasswordFormGroup.valid) {
      this._RS.sendOtp(this.forgotpasswordFormGroup.value).subscribe(
        (data: any) => {
          if (data.meta.status) {
             this.step = 2
             this.verifyFormGroup.patchValue({ otp: data.otp})
            this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          } else {
            this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
          }
        }
      )
    }
  }
  setnewPassword() {
    if (this.verifyFormGroup.valid) {
      if(this.verifyFormGroup.value.newPassword === this.verifyFormGroup.value.confirmPassword){
        this._RS.setnewPassword(this.verifyFormGroup.value).subscribe(
          (data: any) => {
            if (data.meta.status) {
              this.router.navigate(['/userprofile/login']);
              this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
            } else {
              this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
            }
          }
        )
      }
      }
      
  }
}
