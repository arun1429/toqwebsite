import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { RootComponent } from 'src/app/_shared/components/root/root.component';
import { RegisterService } from '../register.service';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends RootComponent implements OnInit {

  registerFormGroup: FormGroup;

  constructor(
    public _AS: AlertService,
    private _FB: FormBuilder,
    private _RS: RegisterService,
    private router: Router
  ) {
    super(_AS);
    this.registerFormGroup = this._FB.group({
      userName: ['', ''],
      userEmailId: ['', ''],
      shopName: ['TOQ', ''],
      mobileNo: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
  }

  register() {
    if (this.registerFormGroup.valid) {
      this._RS.register(this.registerFormGroup.value).subscribe(
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
