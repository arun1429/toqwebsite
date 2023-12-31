import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';
import { AlertService, UserService } from 'src/app/_services';
import { RootComponent } from '../../../../_shared/components/root/root.component';
import { LoginService } from "../../login.service";

import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
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
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent extends RootComponent implements OnInit {

  loginForm: FormGroup;
  @Output() step1Data = new EventEmitter();

  constructor(
    private _FB: FormBuilder,
    public _AS: AlertService,
    private _LGS: LoginService,
    private _US: UserService,
    private router: Router,
    private authService: SocialAuthService
  ) {
    super(_AS);
  }

  ngOnInit(): void {
    this.loginForm = this._FB.group({
      loginId: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.authService.authState.subscribe(res=>{
      let obj={
        loginType:'google',
        userName:res.firstName,
        lastName:res.lastName,
        fullName:res.firstName+" "+res.lastName,
        oauth_uid:res.id,
        userEmailId:res.email,
        mobileNumber:"",
        deviceToken:""
      }
      this._LGS.socialLogin(obj).subscribe(res=>{
        if(res['meta']['status']){
          const user: User = {
            fullName: res['data'] && res['data'].fullName ? res['data'].fullName : 'Guest',
            mobileNo: res['data'].mobileNo,
            loginType: res['data'].loginType,
            userId: res['data'].userId,
            token: res['token'],
            userEmailId:res['data'].userEmailId,
            profilePic: res['data'].profilePic ? res['data'].profilePic : 'https://res.cloudinary.com/appindia/image/upload/v1567572166/uploads/profile_d7wqbt.svg'
          };
          this.afterLogin1(user);
        }
      })
    })
  }


  afterLogin1(user) {
    this.setLocalStorage1(user);
    this._US.updateUser(true, user);
    this.router.navigateByUrl("/");
  }

  setLocalStorage1(user: any) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }


  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
  }

  signOut(): void {
    this.authService.signOut();
  }





  login() {
    if (this.loginForm.valid) {
      this._LGS.login(this.loginForm.value).subscribe(
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
            // this.step1Data.emit({...this.loginForm.value,otp:data.otp});
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

}
