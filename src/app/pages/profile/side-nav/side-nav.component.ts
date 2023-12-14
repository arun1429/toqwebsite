import { Component, OnInit } from '@angular/core';
import { AlertService, UserService } from "../../../_services/index";
import { Observable } from "rxjs";
import { StartService } from 'src/app/start/start.service';
import { Router } from '@angular/router';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { ProfileService } from '../profile.service';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent extends RootComponent implements OnInit {
  carts: any = [];

  user: any;
  files: File;
  imgURL: any;

  constructor(
    private _US: UserService,
    private _SS: StartService,
    public _AS: AlertService,
    private router: Router,
    private _PS: ProfileService
  ) {
    super(_AS);
  }

  ngOnInit() {
    this._US.getUser().subscribe(data => {
      if (data) {
        if (data && data.fullName) {
          this.user = data;
          this.imgURL = this.user.profilePic;
        }
      }
    });
  }

  logout() {
    let getCurrentUser=JSON.parse(localStorage.getItem('currentUser'))
    if(getCurrentUser.loginType==='google'){
      //this.authService.signOut()
      // this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
      this.carts = [];
      this._US.updateUser(false, null);
      localStorage.removeItem('currentUser');
      setTimeout(()=>{
        this.router.navigate(['/userprofile/login']).then(()=>{
         
          location.reload()
        });
      },200)
     
    }
    else{
    this._SS.logout().subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          this.carts = [];
          this._US.updateUser(false, null);
          localStorage.removeItem('currentUser');
          this.router.navigate(['/userprofile/login']);
        }
        else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    )
    }
    // this._SS.logout().subscribe(
    //   (data: any) => {
    //     if (data.meta.status) {
    //       this._US.updateUser(false, null);
    //       this._CS.emittedValue.next(true);
    //       localStorage.removeItem('currentUser');
    //       this.router.navigate(['/userprofile/login']);
    //       this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
    //     } else {
    //       this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
    //     }
    //   }
    // )
  }

  fileUpload(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.files = e.target.files[0];
    }
  }

  uploadProfilePic() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let formData = new FormData();
    formData.append("profilePic", this.files);
    this._PS.updateProfile(formData).subscribe(
      (data: any) => {
        if (data.meta.status) {
          currentUser.profilePic = data.data.profilePic;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          this._US.updateUser(true, currentUser);
          this.files = <File>undefined;
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    )
  }

}
