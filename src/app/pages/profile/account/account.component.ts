import { Component, OnInit } from '@angular/core';
import { ProfileService } from "../profile.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertService, UserService } from "../../../_services/index";
import { Router } from "@angular/router";
import { RootComponent } from '../../../_shared/components/root/root.component';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
interface User {
  fullName: string;
  mobileNo: string;
  loginType: string;
  emailId: string;
  userId: string;
  token: string;
  profilePic: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent extends RootComponent implements OnInit {

  editForm: FormGroup;
  userData: any;
  mobileNumber=''
  constructor(
    private _PFS: ProfileService,
    private fb: FormBuilder,
    public _AS: AlertService,
    private router: Router,
    private _US: UserService
  ) {
    super(_AS);
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      fullName: [null, Validators.compose([Validators.required])],
      gender: [""],
      mobileNo: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      userEmailId: [null, Validators.compose([Validators.required, Validators.email])]
    });
    this.getProfileData();
  }

  getProfileData() {
    this._PFS.getprofile().subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.userData = data.data;
          this.mobileNumber=data.data.mobileNo;
          if(this.userData.mobileNo && this.userData.mobileNo!=''){
            this.editForm.patchValue({mobileNo:this.userData.mobileNo});
            this.editForm.controls.mobileNo.disable();
          }else{
            this.editForm.controls.mobileNo.enable();
            this.editForm.patchValue({mobileNo:''});
          }
          this.editForm.patchValue(data.data);
        }
      }
    )
  }

  edit() {
    if(this.editForm.valid){
      let newData = {
        fullName: this.editForm.value.fullName,
        gender: this.editForm.value.gender,
        userEmailId: this.editForm.value.userEmailId,
        mobileNo: this.editForm.value.mobileNo
      }
      this._PFS.updateProfile(newData).subscribe(
        (data: any) => {
          if (data.meta.status) {
            this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
            if (data["data"].isLogin === false) {
              localStorage.removeItem('currentUser');
              this.router.navigateByUrl("/userprofile/login");
            }
            else {
              let currentUser = JSON.parse(localStorage.getItem("currentUser"))
              const user: User = {
                emailId: data.data.userEmailId,
                fullName: data.data.fullName,
                mobileNo: data.data.mobileNo,
                loginType: data.data.loginType,
                userId: data.data.userId,
                token: currentUser.token,
                profilePic: data.data.profilePic ? data.data.profilePic : 'https://res.cloudinary.com/appindia/image/upload/v1567572166/uploads/profile_d7wqbt.svg'
              };
              this.afterUpdate(user);
              this.getProfileData();
            }
  
          } else {
            this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
          }
        }
      );
    } else {
      this.alertMessage({ type: "danger", title: "Error Occured", value:'Fields are required and mobile number shoulb be 10 digits' });
    }
    
  }

  afterUpdate(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    this._US.updateUser(true, user);
  }

}
