import { Component, OnInit } from '@angular/core';
import { AlertService, UserService } from 'src/app/_services';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { CheckoutService } from '../../checkout/checkout.service';
import { CartService } from '../cart.service';
import * as moment from "moment";
import { Router } from '@angular/router';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
declare var $: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent extends RootComponent implements OnInit {

  carts: any = [];
  lastSavedCart :any = []
  cartSum: number = 0;
  total: number = 0;
  totalDiscount: Number = 0;
  deliveryCharges: Number = 0;
  convenienceFee: Number = 0;
  Cgst:Number=0;
  Igst:Number=0;
  discountName: string;
  appliedPromocode: any;
  promocodes: any = [];
  // cartDataLength: number = 0;
  currentUser: any;
  vendorId: string;

  constructor(
    public _AS: AlertService,
    private _CS: CartService,
    private _US: UserService,
    private _route:Router,
    private _CHS: CheckoutService,private updateMetaTagSrv:MetakeywordsService,private seoService: SEOService) {
    super(_AS)
  }

  ngOnInit(): void {
    localStorage.setItem("currentPageNumber","1")
    this._CS.emitCardData().subscribe(x => {
      if (x) {
        this.getCartItems();
      }
    });
    this.seoService.updateCanonicalUrl('https://toq.co.in//userprofile/cart')
    this.updateMetaTagSrv.getSeoContent('Cart Page').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords,"https://toq.co.in/userprofile/cart",data.data.imageUrl)
        }
      }
    )
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser){
      this.getCartItems();
    }else {
       this.lastSavedCart = []
       this.lastSavedCart =   JSON.parse(localStorage.getItem("lastSavedCart"))
       if(this.lastSavedCart.length !=0){
        for(let i=0; i<this.lastSavedCart.length;i++){
          this.cartSum = Number(this.cartSum + this.lastSavedCart[i].totalDiscountedPrice)
        }
        this.total = this.cartSum
      }
        
  }
   
  }

  getCartItems() {
    this._US.getAuth().subscribe(res => {
      if (res) {
        this._CS.getCartProducts().subscribe(
          (data: any) => {
            if (data.meta.status) {
              this.vendorId = data.data[0].vendorId
              this.getAllPromocode(this.vendorId);
              this.carts = data.data;
              localStorage.setItem("totalCartCount" , data.data.length.toString())
              this.deliveryCharges = data.deliveryCharge;
              this.convenienceFee = data.convenienceFee;
              this.cartSum = data.subTotal;
              this.total = data.grandTotal;
              this.Cgst=data.cgst;
              this.Igst=data.igst
              this.totalDiscount = data.discount;
              this.appliedPromocode = data.promoCodeName;
            }
            else {
           //   this._route.navigate(['/']);
              this.vendorId = undefined;
              this.carts = [];
              this.deliveryCharges = 0;
              localStorage.setItem("totalCartCount" , "0")
              this.convenienceFee = 0;
              this.cartSum = 0;
              this.total = 0;
              this.totalDiscount = 0;
              this.appliedPromocode = undefined;
              this.Cgst=0;
              this.Igst=0;
            }
          }
        )
      }
    })
  }

  getAllPromocode(vendorId: string) {
    this._CS.getAllPromocode(vendorId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.promocodes = data.data;
          console.log('----',this.promocodes);
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

  selectCoupon(promocode: any) {
    if (this.appliedPromocode && this.appliedPromocode.discountId !== promocode.discountId) {
      this.discountName = promocode.discountName;
      this.hideCouponModal();
    }
    else {
      this.alertMessage({ type: "info", title: "Already Applied", value: 'This promocode already applied' });
    }
  }

  increaseDecreaseProductNumber(event, id, variantId, cartId) {
    let selectedQuanity = Number(event.target.value);
    this.checkProductQuantity(id, variantId, selectedQuanity, cartId);
  }

  checkProductQuantity(productId, variantId, selectedQuanity, cartId) {
    const quantityPurchased = Number(selectedQuanity);
    this._CHS.updateQuantity(productId, variantId, quantityPurchased, cartId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this._CS.emittedValue.next(true);
        } else {
          this._CS.emittedValue.next(true);
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    );
  }

  removeFromCart(productSubId) {
    this._CS.removeFromCart(productSubId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.total = 0;
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
        } else {
          this._route.navigate(['/']);
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    );
  }
  removeFromCartLocal(variantId) {
    var lastSavedCartNew = []
    if(this.lastSavedCart){
      for(let i=0; i<this.lastSavedCart.length;i++){
        if(this.lastSavedCart[i].variantId != variantId){
          lastSavedCartNew.push(this.lastSavedCart[i])
        }
      }
      this.lastSavedCart = lastSavedCartNew
      localStorage.setItem("lastSavedCart" , JSON.stringify(lastSavedCartNew))
      this.cartSum = 0
     for(let i=0; i<this.lastSavedCart.length;i++){
       this.cartSum = Number(this.cartSum + this.lastSavedCart[i].totalDiscountedPrice)
     }
     this.total = this.cartSum
    }
  }
  applyPromocode() {
    if (this.discountName) {
      this._CS.applyPromocode(this.discountName).subscribe(
        (data: any) => {
          if (data.meta.status) {
            this.getCartItems();
            this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          } else {
            this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
          }
        }
      )
    }
  }

  removePromocode() {
    this._CS.removePromocode().subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.getCartItems();
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    )
  }

  showCouponModal() {
    $('#coupenModal').modal('show')
  }

  hideCouponModal() {
    $('#coupenModal').modal('hide')
  }

  increaseDecreaseQuantity(cart,quantity,selectedQuantity){
    let q=Number(selectedQuantity)+(Number(quantity))
     this._CHS.updateQuantity(cart.productId,cart.variantId,q,cart._id).subscribe(res=>{
       if(res['meta']['status']){
        this._CS.emittedValue.next(true);
         this.ngOnInit()
       }
     })

  }

}
