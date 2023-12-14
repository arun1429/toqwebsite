/// <reference types="@types/googlemaps" />
import { Component, NgZone, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { CheckoutService } from "../checkout.service";
import { AlertService, WidnowRefService } from "../../../_services/index";
import { CartService } from "../../cart/cart.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProfileService } from '../../profile/profile.service';
import * as moment from "moment";
import { RootComponent } from '../../../_shared/components/root/root.component';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent extends RootComponent implements OnInit {

  total: number = 0;
  cart: any = [];
  addressForm: FormGroup;
  id: any = 1;
  productDetails: any;
  shipingAddressId: any;
  billingAddressId: any;
  addNewAddress: boolean = false;
  selectedAdd: boolean = true;
  deliveryCharges: Number = 0;
  convenienceFee: Number = 0;
  totalDiscount: Number = 0;
  GSTFee: Number = 0;
  cgst: Number = 0;
  igst: Number = 0;
  sgst: Number = 0
  cartSum: Number = 0;
  productSelectedQty: any;
  paymentMethod: any;
  walletAmount: number = 0;
  remainingWalletAmount: Number;
  requiredWalletAmount: Number;
  walletAmountStatus: any;
  remainingWalletAmountStatus: Boolean = false;
  requiredWalletAmountStatus: Boolean = false;
  promoCodeDataLength: number = 0;
  addressBody: any;
  addressIndex: any;
  newAddressStatus: any;
  addressString: any;
  deliveryState: any
  deliveryCity: any
  vendorId: string

  // dateList: any = [];
  // timeList: any = [
  //   { time: '9AM-12PM', hour24: '9 - 12', isEnable: false },
  //   { time: '12PM-3PM', hour24: '12 - 15', isEnable: false },
  //   { time: '3PM-6PM', hour24: '15 - 18', isEnable: false },
  //   { time: '6PM-9PM', hour24: '18 - 21', isEnable: false }
  // ];
  // dateDisable: boolean = false;
  // selectedTime: any;
  // selectedDate: any;
  addresses: any = [];
  states: any = [];
  cities: any = [];
  appliedPromocode: any;
  geocoder: google.maps.Geocoder;
  currentId: string;
  notDeliverableItems: any = [];
  currentlng: any;
  currentlat: any;
  discountName: any;
  promocodes: any;

  constructor(
    private _CHS: CheckoutService,
    public _AS: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private _CS: CartService,
    private actRoute: ActivatedRoute,
    private zone: NgZone,
    private _PFS: ProfileService,
    private winRef: WidnowRefService
  ) {
    super(_AS)
  }

  ngOnInit(): void {
    this.geocoder = new google.maps.Geocoder();
    // let currentDate = new Date();
    // this.dateList = [...this.dateList, { date: currentDate.setDate(currentDate.getDate() + 0), isEnable: false }];
    // for (let i = 1; i < 7; i++) {
    //   this.dateList = [...this.dateList, { date: currentDate.setDate(currentDate.getDate() + 1), isEnable: false }];
    // }
    // let currentTime = new Date();
    // this.timeList.map((_, i) => {
    //   let hour24: number;
    //   hour24 = +(_.hour24.split(' ')[0]);
    //   if (hour24 < currentTime.getHours()) {
    //     _.isEnable = true;
    //     this.timeNumber = i + 2;
    //   }
    // })
    // this.dateDisable = !this.timeList.some(x => x.isEnable === false);
    // this.selectedTime = this.timeList[this.timeNumber - 1] ? this.timeList[this.timeNumber - 1]['time'] : this.timeList[0]['time'];
    // if (this.dateDisable) {
    //   this.dateList[0].isEnable = this.dateDisable;
    //   this.selectedDate = this.dateList[1]['date'];
    //   this.dateNumber = 2;
    //   this.timeList[0].isEnable = false;
    //   this.timeNumber = 1;
    // }
    // else {
    //   this.selectedDate = this.dateList[0]['date'];
    // }
    this.addressForm = this.fb.group({
      fullName: [null, Validators.compose([Validators.required])],
      mobileNo: [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      pinCode: [null, Validators.compose([Validators.required])],
      streetAddress: [null, Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      userGst: [null],
      state: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      landmark: [null],
      alternateMobileNo: [null],
      addressType: [null, Validators.compose([Validators.required])]
    });
    this.getMyWallet();
    this.getStates();
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
        this.cities = _.districts;
      }
    })
  }

  getMyWallet() {
    this._PFS.getWallet().subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.walletAmount = data.data.walletBalance;
        }
      }
    )
  }

  ngAfterViewInit() {
    this.actRoute.queryParams.subscribe(id => {
      this.getCartData();
    });
    this._CS.emitCardData().subscribe(x => {
      if (x) {
        this.getCartData();
      }
    });
    this.getAddresses();
  }

  getCartData() {
    this._CS.getCartProducts().subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.productSelectedQty = data.data.map(item => item.selectQuantity);
          this.calculations(data.data);
          this.deliveryCharges = data.deliveryCharge;
          this.convenienceFee = data.convenienceFee;
          this.GSTFee = data.gst
          this.cgst = data.cgst;
          this.igst = data.igst;
          this.sgst = data.sgst
          this.total = data.grandTotal + this.cgst + this.igst + this.sgst;
          this.cartSum = data.subTotal;
          this.checkWalletAmount(this.total);
          this.cart = data.data;
          this.vendorId = data.data[0].vendorId;
          this.totalDiscount = data.discount;
          // this.discountName=data.discountName;
          this.discountName = data.promoCodeName.discountName;
          this.appliedPromocode = data.promoCodeName;
          this.getAllPromocode(this.vendorId);
        }
        else {
          // this.router.navigate(['/']);
          this.cart = [];
          this.deliveryCharges = 0;
          this.convenienceFee = 0;
          this.cartSum = 0;
          this.total = 0;
          this.totalDiscount = 0;
          this.appliedPromocode = undefined;
          this.vendorId = undefined;
          this.cgst = 0;
          this.igst = 0;
          this.sgst = 0
        }
      }
    )
  }

  removePromocode() {
    this._CS.removePromocode().subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.appliedPromocode.discountName = '';
          this.discountName = ''
          this.totalDiscount = 0;

          if (this.id === 3) {
            this.getValidateCart();
          }
          else {
            this.getCartData()
          }
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    )
  }

  private calculations(data) {
    this.productDetails = data.map((item, i) => {
      return {
        variantId: item.variantId,
        purchageQuantity: this.productSelectedQty[i],
        productName: item.productName
      };
    });
  }

  selectedAddressIndex: number = 0;
  getAddresses(editAddressIndex?: number, isLength?: boolean) {
    editAddressIndex ? this.selectedAddressIndex = editAddressIndex : this.selectedAddressIndex = 0;
    this._CHS.getAddress().subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.addresses = data.data.address;
          if (data.data.address.length != 0) {
            this.shipingAddressId = data.data.address[isLength ? data.data.address.length - 1 : this.selectedAddressIndex].addressId;
            this.billingAddressId = data.data.address[isLength ? data.data.address.length - 1 : this.selectedAddressIndex].addressId;
            this.addressIndex = isLength ? data.data.address.length - 1 : this.selectedAddressIndex;
          }
        }
        else {
          this.addresses = [];
        }
      }
    )
  }

  // increaseDecreaseProductNumber(id, variantId, quantity, number, index, cartId) {
  //   if (this.productSelectedQty[index] === 1 && number === -1) {
  //     return;
  //   } else {
  //     this.checkProductQuantity(id, variantId, quantity, number, index, cartId);
  //   }
  // }


  increaseDecreaseQuantity(cart, quantity, selectedQuantity) {
    let q = Number(selectedQuantity) + (Number(quantity));
    this._CHS.updateQuantity(cart.productId, cart.variantId, q, cart._id).subscribe(res => {
      if (res['meta']['status']) {
        this._CS.emittedValue.next(true);
        this.ngOnInit()
      }
    })
  }

  checkProductQuantity(productId, variantId, quantity, number, index, cartId) {
    const quantityPurchased = Number(quantity) + Number(number);
    this._CHS.updateQuantity(productId, variantId, quantityPurchased, cartId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          this._CS.emittedValue.next(true);
          this.productSelectedQty[index] = quantityPurchased;
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    );
  }

  removeFromCart(productSubId) {
    this._CS.removeFromCart(productSubId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.getValidateCart();
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    );
  }

  getValidateCart() {
    this.notDeliverableItems = [];
    this._CHS.cartValidate(this.shipingAddressId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          // this.cgst=data['cgst']
          // this.igst=data['igst']
          // this.sgst=data['sgst']
          this.calculations(data.data);
          this.deliveryCharges = data.deliveryCharge;
          this.convenienceFee = data.convenienceFee;
          this.GSTFee = data.gst
          this.cgst = data.cgst;
          this.igst = data.igst;
          this.sgst = data.sgst;
          this.total = data.grandTotal + this.cgst + this.igst + this.sgst;
          this.cartSum = data.subTotal;
          this.checkWalletAmount(this.total);
          this.cart = data.data;
          this.totalDiscount = data.discount;
          // this.discountName=data.discountName;
          this.discountName = data.promoCodeName.discountName;
          this.appliedPromocode = data.promoCodeName;
          data.data.map((_) => {

            if (!_.deliveryAvailable) {
              this.notDeliverableItems = [...this.notDeliverableItems, _];
            }
          })
          if (this.notDeliverableItems.length) {
            this.showValidateModal();
          }
          else {
            this.hideValidateModal();
            this.id = this.currentId;
          }
        }
        else {
          this.hideValidateModal();
        }
      }
    )
  }

  collapse(id) {
    if (id === 3) {
      this.currentId = id;
      this.getValidateCart();
    }
    else {
      this.id = id;
    }
  }

  showValidateModal() {
    $('#validateCartModal').modal('show')
    $('#validateCartModal').on('hidden.bs.modal', (e) => {
      this.zone.run(() => {
        this.notDeliverableItems = [];
      })
    })
  }

  hideValidateModal() {
    $('#validateCartModal').modal('hide')
  }

  addAddress(body, index) {
    if (body.alternatePhone === null && body.landmark === null) {
      delete body["landmark"];
      delete body["alternatePhone"];
    } else if (body.alternatePhone === null) {
      delete body["alternatePhone"];
    } else if (body.landmark === "") {
      delete body["landmark"];
    }
    if (this.selectedAdd === true) {
      this.addressBody = body;
      this.checkPinCode(index);
    } else {
      this.addressBody = body;
      this.checkPinCode(index);
    }
  }

  selectedAddress(e, i) {
    this.selectedAdd = false;
    this.shipingAddressId = e.addressId;
    this.billingAddressId = e.addressId;
    this.addressIndex = i;
  }

  editAddressDiv(a) {
    this.selectedAdd = false;
    this.addNewAddress = true;
    this.shipingAddressId = a.addressId;
    this.billingAddressId = a.addressId;
    let findState = this.states.find(t => t.state === a.state)
    this.cities = findState.districts
    this.addressForm.patchValue(a);
    this.newAddressStatus = false;
  }

  addNewAddressOnClick() {
    this.addressForm.reset();
    this.addNewAddress = !this.addNewAddress;
    this.newAddressStatus = true;
  }

  deleteAddress(addressId) {
    this._CHS.deleteAddress(addressId).subscribe(
      (res: any) => {
        this.addressForm.reset({ city: '', state: '', country: '' });
        this.selectedAdd = true;
        if (res.meta.status) {
          this.getAddresses();
          this.alertMessage({ type: "success", title: "Success", value: res.meta.msg });
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: res.meta.msg });
        }
      }
    );
  }

  checkPaymentMethod(paymentMethod) {
    let payment_id;
    paymentMethod === 'online' ? this.initPay(this.total, paymentMethod) : this.placeOrder(paymentMethod, payment_id);
  }

  placeOrder(paymentMethod, payment_id) {
    const final = {
      paymentMethod,
      shipingAddressId: this.shipingAddressId,
      vendorId: this.cart[0].vendorId,
      deviceType: 'web',
      paymentId: payment_id
    };
    this._CHS.placeOrder(final).subscribe(
      (res: any) => {
        if (res.meta.status) {
          this.router.navigateByUrl("/profile/order-history");
          this._CS.emittedValue.next(true);
          this.alertMessage({ type: "success", title: "Success", value: res.meta.msg });
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: res.meta.msg });
        }
      }
    );
  }

  initPay(money, paymentMethod) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let options: any = {
      key: environment.rzpKey,
      amount: Number(money.toFixed(0)) * Number(100),
      currency: "INR",
      buttontext: "Pay",
      name: "On Sell On",
      "prefill.name": currentUser.fullName,
      "prefill.email": currentUser.emailId,
      "theme.color": "#F37254",
      handler: ((response, error) => {
        this.zone.run(() => {
          this.placeOrder(paymentMethod, response.razorpay_payment_id)
        })
        // this.paymentCapture(response)
        // call your backend api to verify payment signature & capture transaction
      }),
      modal: {
        ondismiss: function () {
        }
      }
    };
    var rzp1 = new this.winRef.nativeWindow.Razorpay(options);
    rzp1.open();
  }

  checkWalletAmount(totalValue) {
    let amt;
    if (totalValue <= this.walletAmount) {
      this.remainingWalletAmountStatus = true;
      this.remainingWalletAmount = Number(this.walletAmount) - Number(totalValue);
      amt = Number(this.walletAmount) - Number(totalValue);
    } else {
      this.requiredWalletAmountStatus = true;
      this.requiredWalletAmount = Number(totalValue) - Number(this.walletAmount);
      amt = Number(totalValue) - Number(this.walletAmount);
    }
    if (amt.toString() === "Nan") {
      this.checkWalletAmount(totalValue);
    }
    return amt;
  }

  addMoney() {
    this.router.navigateByUrl("/profile/wallet");
  }
  chooseLocation(event) {

    if (event.target.checked) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.currentlng = pos.coords.longitude;
        this.currentlat = pos.coords.latitude;
        this.locateMe()
      });
    } else {
      this.addressForm.patchValue({ state: "" });
      this.addressForm.patchValue({ city: "" });
      this.cities = [];
    }
  }


  showCouponModal() {
    $('#coupenModal').modal('show')
  }

  hideCouponModal() {
    $('#coupenModal').modal('hide')
  }

  getAllPromocode(vendorId: string) {
    this._CS.getAllPromocode(vendorId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.promocodes = data.data;
          // console.log('----',this.promocodes);
          this.promocodes.map((_) => {
            let upToDate = moment(_.validUpto);
            let today = moment()
            let days = upToDate.diff(today, 'days');
            _.days = days;
          })
        }
      }
    )
  }

  applyPromocode() {
    if (this.discountName) {
      this._CS.applyPromocode(this.discountName).subscribe(
        (data: any) => {
          if (data.meta.status) {
            if (this.id === 3) {
              this.getValidateCart();
            }
            else {
              this.getCartData()
            }
            this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          } else {
            this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
          }
        }
      )
    }
  }

  selectCoupon(promocode: any) {
    if (this.appliedPromocode && this.appliedPromocode.discountId !== promocode.discountId) {
      this.discountName = promocode.discountName;
      this.hideCouponModal();
    }
    else {
      this.alertMessage({ type: "info", title: "Already Applied", value: 'This promocode already applied' });
    }
  }

  locateMe() {
    this.geocoder.geocode({ 'location': { lat: this.currentlat, lng: this.currentlng } }, (results, status) => {
      // this.geocoder.geocode({ 'address': "C 6 Sector 7 Noida"}, (results, status) => {

      if (status === 'OK') {
        // console.log( results[0].address_components)
        results[0].address_components.map(el => {
          // console.log(el)
          el.types.map(l => {
            if (l === "administrative_area_level_1") {
              this.deliveryState = el.long_name
              this.addressForm.patchValue({ state: this.deliveryState })
              let findState = this.states.find(t => t.state === this.deliveryState)
              this.cities = findState.districts
            }
            if (l === 'locality') {
              this.deliveryCity = el.long_name
              this.addressForm.patchValue({ city: this.deliveryCity })
            }
          })
        })
        // results.forEach(element => {
        // element.address_components.forEach(item=>{
        // item.types.forEach(type=>{
        // if(type==='administrative_area_level_1'){
        //   console.log(item)
        //   this.deliveryState=item.long_name
        // // this.dilvereryPinCode=item.long_name
        // // this.showPinCodeDiv=false
        // console.log(this.deliveryState)
        // this.addressForm.patchValue({state:this.deliveryState})
        // }
        // if(type==='locality'){
        //   console.log(item)
        //   this.deliveryCity=item.long_name
        //   this.addressForm.patchValue({city:this.deliveryCity})
        //   console.log( this.addressForm.value)
        // // this.dilvereryPinCode=item.long_name
        // // this.showPinCodeDiv=false
        // }
        // })
        // })
        // });
      }
    });
  }
  checkPinCode(index) {
    if (this.newAddressStatus) {
      this.addressString = this.addressBody.streetAddress + " " + this.addressBody.city + " " + this.addressBody.state + " " + this.addressBody.country + " " + this.addressBody.pinCode;
      this.geocoder.geocode(
        { address: this.addressString },
        (results, status) => {
          if (status == "OK") {
            this.addressBody["coordinates"] = [
              results[0].geometry.location.lng(),
              results[0].geometry.location.lat()
            ];
            this.addressBody.isDefault = false;
            this._CHS.addAddress(this.addressBody).subscribe(res => {
              this.zone.run(() => {
                if (res["meta"]["status"]) {
                  this.alertMessage({ type: "success", title: "Success", value: res["meta"]["msg"] });
                  this.addNewAddress = false;
                  this.getAddresses(null, true);
                  this.addressForm.reset({ city: '', state: '', country: '' });
                  //run the code that should update the view
                } else {
                  this.alertMessage({ type: "danger", title: "Error Occured", value: res["meta"]["msg"] });
                }
              });
            });
          }
        }
      );
    } else {
      this.addressString = this.addressBody.streetAddress + " " + this.addressBody.city + " " + this.addressBody.state + " " + this.addressBody.country + " " + this.addressBody.pinCode;
      this.geocoder.geocode(
        { address: this.addressString },
        (results, status) => {
          if (status == "OK") {
            this.addressBody["coordinates"] = [
              results[0].geometry.location.lng(),
              results[0].geometry.location.lat()
            ];
            this.addressBody.isDefault = false;
            this.addressBody.addressId = this.billingAddressId
            this._CHS.editAddress(this.addressBody).subscribe(
              res => {
                this.zone.run(() => {
                  if (res["meta"]["status"]) {
                    this.alertMessage({ type: "success", title: "Success", value: res["meta"]["msg"] });
                    this.addNewAddress = false;
                    this.getAddresses(index);
                    this.addressForm.reset({ city: '', state: '', country: '' });
                    //run the code that should update the view
                  } else {
                    this.alertMessage({ type: "danger", title: "Error Occured", value: res["meta"]["msg"] });
                  }
                });
              }
            );
          }
        }
      );
    }
  }
  checkMinimumAmount(minimumAmount, cartSum) {
    if (minimumAmount > cartSum) {
      return true
    }
    else {
      return false
    }
  }
  getTotalAmount(total, igst, cgst, sgst) {
    let totalSum = total + igst + cgst + sgst
    return totalSum.toFixed(2)
  }
  // dateNumber: number = 1;
  // timeNumber: number = 1;
  // changeDate(dateValue, dateNumber) {
  //   let currentTime = new Date();
  //   this.selectedDate = dateValue.date;
  //   this.dateNumber = dateNumber;

  //   if (dateNumber > 1) {
  //     this.timeList.map((_) => {
  //       _.isEnable = false;
  //     })
  //     this.selectedTime = this.timeList[0]['time'];
  //     this.timeNumber = 1;
  //   }
  //   else {
  //     this.timeList.map((_, i) => {
  //       let hour24: number;
  //       hour24 = +(_.hour24.split(' ')[0]);
  //       if (hour24 < currentTime.getHours()) {
  //         _.isEnable = true;
  //         this.timeNumber = i + 2;
  //       }
  //     })
  //     this.selectedTime = this.timeList[this.timeNumber - 1]['time'];
  //   }
  // }

  // changeTime(timeValue, timeNumber) {
  //   this.timeNumber = timeNumber;
  //   this.selectedTime = timeValue.time;
  // }
  getGSTText(igst, cgst, sgst) {

    let text = ''
    if (igst !== 0 || cgst !== 0 || sgst !== 0) {
      text = "(Including GST)"
    }
    else {
      text = "(Excluding GST)"
    }
    return text
  }
}
