import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';
import { AlertService, UserService } from 'src/app/_services';
import { RootComponent } from '../../../../_shared/components/root/root.component';
import { LoginService } from '../../login.service';

interface User {
  mobileNo: string;
  loginType: string;
  userId: string;
  token: string;
  fullName: string;
  profilePic: string;
  userEmailId: string;
}

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent extends RootComponent implements OnInit {

  otpForm: FormGroup;
  @Input() step1Data: any;

  constructor(
    private _FB: FormBuilder,
    private router: Router,
    public _AS: AlertService,
    private _LGS: LoginService,
    private _US: UserService) {
    super(_AS);
  }

  ngOnInit(): void {
    this.otpForm = this._FB.group({
      otp: [this.step1Data.otp, Validators.required]
    })
  }

  otpVerify() {
    if (this.otpForm.valid) {
      const otpData = {
        ...this.otpForm.value,
        mobileNo: +this.step1Data.mobileNo
      };
      this._LGS.otpVerify(otpData).subscribe(
        (data: any) => {
          if (data.meta.status) {
            const user: User = {
              fullName: data.data && data.data.fullName ? data.data.fullName : 'Guest',
              mobileNo: data.data.mobileNo,
              loginType: data.data.loginType,
              userId: data.data.userId,
              token: data.token,
              userEmailId: data.data.userEmailId,
              profilePic: data.data.profilePic ? data.data.profilePic : 'https://res.cloudinary.com/appindia/image/upload/v1567572166/uploads/profile_d7wqbt.svg'
            };
            this.afterLogin(user);
            this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          } else {
            this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
          }
        }
      )
    }
  }

  afterLogin(user) {
    this.setLocalStorage(user);
    this._US.updateUser(true, user);
    this.router.navigateByUrl("/");
  }

  setLocalStorage(user: any) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  login() {
    this._LGS.login(this.step1Data).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.otpForm.patchValue({ otp: data.otp });
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    )
  }

}
