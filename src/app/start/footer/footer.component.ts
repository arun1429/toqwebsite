import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { StartService } from '../start.service';
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { RootComponent } from '../../_shared/components/root/root.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent extends RootComponent implements OnInit {

  groups: any = [];
  contactUsForm: FormGroup;
  contactDetails: any;
  socialDetails: any;
  shopName: string;
  constructor(public _AS: AlertService, private _SS: StartService, private _FB: FormBuilder, 
    private routes: ActivatedRoute,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
    this.shopName = "TOQ"
    this.getAllGroups();
    this.getSocialDetails()
    this.getContactDetails();
    this.shopName  = localStorage.getItem("shopName")
    console.log("fotter shop"+localStorage.getItem("shopName"))
    localStorage.setItem("shopName",this.shopName)
    this.getAllGroups();
    this.getContactDetails();
    this.contactUsForm = this._FB.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  getContactDetails() {
    this._SS.getContactDetails(this.shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.contactDetails = data.data;
        }
      }
    )
  }
  getSocialDetails() {
    this._SS.getSocialMediaDetails(this.shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.socialDetails = data.data;
        }
      }
    )
  }
  
  getAllGroups() {
    this._SS.getGroups().subscribe(
      data => {
        if (data && data.length) {
          this.groups = data
        }
      }
    )
  }

  contactUs() {
    if (this.contactUsForm.valid) {
      this._SS.contactUs(this.contactUsForm.value,this.shopName).subscribe(
        (data: any) => {
          if (data.meta.status) {
            this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
            this.contactUsForm.reset();
            window.scrollTo(0, 0);
          }
          else {
            this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
          }
        }
      )
    }
  }

}
