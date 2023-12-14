import { Component, OnInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertService } from "../../../../_services/index";
import { HomeService } from 'src/app/pages/home/home.service';
import { RootComponent } from '../../../../_shared/components/root/root.component';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent extends RootComponent implements OnInit {

  addressForm: FormGroup;
  selectedAdd: boolean = false;
  addressString: any;
  @Output() emitSuccessFlagForAddress = new EventEmitter();
  @Input() address: any;
  geocoder: google.maps.Geocoder;
  states: any = [];
  cities: any = [];

  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    public _AS: AlertService,
    private _CHS: HomeService
  ) {
    super(_AS);
  }

  ngOnInit(): void {

  //  this.getStates();

    this.geocoder = new google.maps.Geocoder();
    this.addressForm = this.fb.group({
      fullName: [null, Validators.compose([Validators.required])],
      mobileNo: [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      pinCode: [null, Validators.compose([Validators.required])],
      streetAddress: [null, Validators.compose([Validators.required])],
      userGst:[null],
      city: ['',  Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      landmark: [null],
      alternateMobileNo: [null, Validators.compose([Validators.minLength(10), Validators.maxLength(10)])],
      addressType: [null, Validators.compose([Validators.required])]
    });
    if (this.address) {
      console.log(this.address)
      this._CHS.getStates().subscribe(
        (data: any) => {
          if (data && data.states) {
            this.states = data.states;
            this.states.map((_) => {
              if (this.address.state === _.state) {
                this.cities = _.districts;
              }
            })
            this.selectedAddress(this.address);
          }
        }
      )
    }
    else{
      this.getStates()
    }
    this.addressForm.controls.state.valueChanges.subscribe(data=>{

    })
  }

  getStates() {
    this._CHS.getStates().subscribe(
      (data: any) => {
        if (data && data.states) {
          this.states = data.states;
        }
      }
    )
  }

  chnageState(e) {
    this.states.map((_) => {
      if (e.target.value === _.state) {
        console.log(_)
        this.cities = _.districts;
      }
    })
  }

  selectedAddress(e) {
    this.addressForm.setValue({
      fullName: e.fullName,
      mobileNo: e.mobileNo,
      pinCode: e.pinCode,
      streetAddress: e.streetAddress,
      city: e.city,
      state: e.state,
      userGst:e.userGst,
      country: e.country,
      landmark: e.landmark,
      alternateMobileNo: e.alternateMobileNo,
      addressType: e.addressType
    });
    this.selectedAdd = true;
  }

  actionOnAddress(body) {
    const obj = this.formatObj(body);
    this.checkPinCode(obj);
  }

  checkPinCode(obj) {
    if (this.selectedAdd === false) {
      this.addressString = obj.streetAddress + " " + obj.city + " " + obj.state + " " + obj.country + " " + obj.pinCode;
      this.geocoder.geocode({ address: this.addressString }, (results, status) => {
        if (status == "OK") {
          obj["coordinates"] = [
            results[0].geometry.location.lng(),
            results[0].geometry.location.lat()
          ];
          obj.isDefault = false;
          this._CHS.addAddress(obj).subscribe(
            (data: any) => {
              this.zone.run(() => {
                if (data.meta.status == true) {
                  this.addressForm.reset();
                  this.emitValue();
                  this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
                } else {
                  this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
                }
              });
            }
          );
        }
      });
    }
    else {
      this.addressString = obj.streetAddress + " " + obj.city + " " + obj.state + " " + obj.country + " " + obj.pinCode;
      this.geocoder.geocode({ address: this.addressString }, (results, status) => {
        if (status == "OK") {
          obj["coordinates"] = [
            results[0].geometry.location.lng(),
            results[0].geometry.location.lat()
          ];
          obj.isDefault = false;
          obj.addressId = this.address.addressId
          this._CHS.editAddress(obj).subscribe(
            (data: any) => {
              this.zone.run(() => {
                if (data.meta.status == true) {
                  this.addressForm.reset();
                  this.emitValue();
                  this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
                } else {
                  this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
                }
              });
            }
          );
        }
      }
      );
    }
  }

  formatObj = body => {
    Object.keys(body).forEach(o => {
      if (body[o] == null || body[o] == undefined || body[o] == "") {
        delete body[o];
      }
    });
    return body;
  };

  emitValue() {
    this.selectedAdd = false;
    this.addressForm.reset();
    this.emitSuccessFlagForAddress.emit(true);
  }

}
