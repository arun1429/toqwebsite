import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { NgxSpinnerService } from "ngx-spinner";
import { RootComponent } from '../../../_shared/components/root/root.component';
import { ProfileService } from '../../profile/profile.service';
import { HomeService } from '../../home/home.service';
import { ProductDetailsService } from "../product-details.service";
declare var $: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent extends RootComponent implements OnInit {

  productDetails: any;
  productId: string;
  ratingsByUser: number = 0;
  discountStatus = true;
  statusOff = true
  ratingArray = [
    {
      rating: 1,
      isActive: true
    },
    {
      rating: 2,
      isActive: false
    },
    {
      rating: 3,
      isActive: false
    },
    {
      rating: 4,
      isActive: false
    },
    {
      rating: 5,
      isActive: false
    }
  ];
  reviewForm: FormGroup;
  reviews: any = [];
  selectedQuanity: number = 1;
  selectedVariantIndex: number = 0;
  quoteFormGroup: FormGroup;
  currentUser: any;
  pincode: number;
  GSTPrice: any;
  offerPrise: any;
  price: any;
  discount: number;
  selectedVariantId: any;
  variantId:string;
  userId: string;
  variantName: any;
  variantRating:any;

  constructor(
    public _AS: AlertService,
    private routes: ActivatedRoute,
    private _PDS: ProductDetailsService,
    private _FB: FormBuilder,
    private _PFS: ProfileService,
    private _HS: HomeService,
    private spinnerService: NgxSpinnerService,
    private router: Router) {
    super(_AS);
    this.reviewForm = this._FB.group({
      review: ['', Validators.required],
      userName: ['', Validators.required],
      userEmailId: ['', [Validators.required, Validators.email]]
    })
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.quoteFormGroup = this._FB.group({
      quantity: ['', Validators.required],
      fullName: [this.currentUser && this.currentUser.fullName ? this.currentUser.fullName : '', Validators.required],
      userEmailId: [this.currentUser && this.currentUser.userEmailId ? this.currentUser.userEmailId : '', Validators.required],
      mobileNo: [this.currentUser && this.currentUser.mobileNo ? this.currentUser.mobileNo : '', Validators.required],
    })
  }

  ngOnInit(): void {
    this.routes.params.subscribe(
      data => {
        this.productId = data.productId;
        if (this.productId) {
          this.getProductDetails();
        }
      }
    )

    this.routes.queryParams.subscribe(res => {
      if (res.hasOwnProperty('variantId')) {
        this.selectedVariantId = res['variantId']
      }
      else {
        this.selectedVariantId = ''
      }
    })
    this.getDiscount(this.offerPrise, this.price)
  }

  imageList: any
  newImg: any;
  getProductDetails() {
    let tepmLocalStorage = localStorage.getItem('currentUser')
    if (tepmLocalStorage) {
      this.userId = JSON.parse(tepmLocalStorage).userId;
    }
    this.spinnerService.show();
    this._PDS.getProductDetails(this.productId, this.userId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.productDetails = data.data;
          console.log(this.productDetails)
          this.spinnerService.hide();
          if (this.productDetails) {
            this.productDetails.variant.map((val, i) => {
              this.variantId=val.variantId;
              this.variantRating=this.productDetails.variant[this.selectedVariantIndex].overAllRating
              if (val.variantId === this.selectedVariantId) {
                this.selectedVariantIndex = i
                this.variantName=val.variantName;
                this.variantRating=val.overAllRating;
                this.variantId=val.variantId;
                this.getReviewData();
                this.imageList = { image: val.variantImg }
                this.newImg = this.imageList.image[0];
              }
            });

            if (this.selectedVariantId === '') {
              this.selectedVariantIndex = 0
              this.variantName=this.productDetails.variant[this.selectedVariantIndex].variantName;
              this.variantId=this.productDetails.variant[this.selectedVariantIndex].variantId;
              this.variantRating=this.productDetails.variant[this.selectedVariantIndex].overAllRating
              this.getReviewData();
             if( this.newImg = this.productDetails.variant[this.selectedVariantIndex]){
                this.newImg = this.productDetails.variant[this.selectedVariantIndex].variantImg[0]
             }
            }
          }
        }
      }
    )
  }

  getReviewData(){
      this._PDS.getReview(this.productId,this.variantId).subscribe((data:any)=>{
          if(data.meta.status){
            debugger
            this.reviews=data.data;
            if(this.reviews){}
          }else{
            this.reviews=[];
          }
      });
  }



  setImg(img) {
    this.newImg = img
  }

  changeVariant(i, productDetails) {
    this.selectedVariantIndex = i;
    this.newImg = productDetails.variant[i].variantImg[0];
    this.variantId=productDetails.variant[i].variantId
    this.variantName=productDetails.variant[i].variantName;
    this.variantRating=productDetails.variant[i].overAllRating;
    this.getReviewData();
  }

  getDiscount(offerPrice, price) {

    if (offerPrice !== price) {
      this.statusOff = false
      let percentage = (offerPrice / price) * 100

      let p = (100 - percentage).toFixed(0)
      if (Number(p) !== 0) {

        this.discountStatus = true
      }
      else {
        this.discountStatus = false
      }
      return p
    } else {
      this.statusOff = true
    }
  }

  checkDiscount(price, offerPrice) {
    if (price !== offerPrice) {
      return false
    }
    else {
      return true
    }
  }

  checkPincode() {
    if (this.pincode && this.pincode.toString().length >= 6) {
      let obj = {
        pincode: this.pincode,
        productId: this.productDetails.productId,
        variantId: this.productDetails.variant[this.selectedVariantIndex].variantId,
        vendorId: this.productDetails.vendorId,
        // userId: this.currentUser.userId,
      }
      this._PDS.checkPincode(obj).subscribe(
        (data: any) => {
          if (data.meta.status) {
            this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          } else {
            this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
          }
        }, error => {
          this.alertMessage({ type: "danger", title: "Error Occured", value: error && error.error && error.error.meta.msg ? error.error.meta.msg : error.message });
        }
      )
    }
  }

  selectRating(i, index) {
    $('.remove').removeClass('svgActive')
    for (let j = 0; j <= index; j++) {
      $(`.add-new-class${j}`).addClass('svgActive');
    }
    this.ratingsByUser = i;
  }

  submitReview() {
    if (this.reviewForm.valid) {
      let reviewData = {
        productId: this.productDetails.productId,
        variantId: this.productDetails.variant[this.selectedVariantIndex].variantId,
        vendorId: this.productDetails.vendorId,
        rating: this.ratingsByUser,
        ...this.reviewForm.value
      }
      this._PDS.submitReview(reviewData).subscribe(
        (data: any) => {
          if (data.meta.status) {
            $('#myTab a[href="#info"]').tab('show');
            this.ratingsByUser = 0;
            this.reviewForm.reset();
            $('.remove').removeClass('svgActive');
            window.scrollTo(0, 0);
            this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          } else {
            this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
          }
        }
      )
    }
  }

  increaseDecreaseProductNumber(event) {
    this.selectedQuanity = Number(event.target.value);
  }

  buyNow(product) {
    const cartData = {
      categoryId: product.categoryId,
      vendorId: product.vendorId,
      productId: product.productId,
      selectQuantity: this.selectedQuanity,
      subCategoryId: product.subCategoryId,
      variantId: product.variant[this.selectedVariantIndex].variantId,
      isBuyNow: true
    };
    this._HS.addToCart(cartData).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          this.router.navigateByUrl("/userprofile/checkout")
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      },
      err => {
        this.router.navigateByUrl("/userprofile/login");
        this.alertMessage({ type: "danger", title: "Error Occured", value: "Please login first" });
      }
    );
  }

  addToCart(product) {
    const cartData = {
      categoryId: product.categoryId,
      vendorId: product.vendorId,
      productId: product.productId,
      selectQuantity: this.selectedQuanity,
      subCategoryId: product.subCategoryId,
      variantId: product.variant[this.selectedVariantIndex].variantId
    };
    this._HS.addToCart(cartData).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      },
      err => {
        this.router.navigateByUrl("/profile/login");
        this.alertMessage({ type: "danger", title: "Error Occured", value: "Please login first" });
      }
    );
  }

  addToWishList(product) {
    const body = {
      categoryId: product.categoryId,
      productId: product.productId,
      selectQuantity: 1,
      subCategoryId: product.subCategoryId,
      vendorId: product.vendorId,
      variantId: product.variant[this.selectedVariantIndex].variantId
    };
    this._PFS.addToWishList(body).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.getProductDetails();
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
        }
        // else {
        //   this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        // }
      }, error => {
        this.alertMessage({ type: "danger", title: "Error Occured", value: "Please login first" });
      }
    );
  }

  scrollDiv(ele: string) {
    $('#myTab a[href="#reviews"]').tab('show')
    let el = document.getElementById(ele);
    el.scrollIntoView({ behavior: "smooth" });
  }

  showCouponModal() {
    if (this.currentUser) {
      this.quoteFormGroup.patchValue(this.currentUser);
    }
    $('#quoteModal').modal('show');
    $('#quoteModal').on('hidden.bs.modal', (e) => {
      this.quoteFormGroup.reset();
    })
  }

  hideCouponModal() {
    $('#quoteModal').modal('hide');
  }

  getQuote() {
    if (this.quoteFormGroup.valid) {
      let obj = {
        productId: this.productDetails.productId,
        variantId: this.productDetails.variant[this.selectedVariantIndex].variantId,
        vendorId: this.productDetails.vendorId,
        deviceType: 'web',
        ...this.quoteFormGroup.value
      }
      this._PDS.getQuote(obj).subscribe(
        (data: any) => {
          if (data.meta.status) {
            this.hideCouponModal();
            this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          } else {
            this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
          }
        }, error => {
          this.alertMessage({ type: "danger", title: "Error Occured", value: "Please login first" });
        }
      )
    }
  }

  getReviewStar(div) {
    let data = []
    if(div===0){
      data=['','','','','']
    }
    if(Math.floor(div)===1){
     data=[true,'','','','']
    }
    else if(Math.floor(div)===2){
      data=[true,true,'','','']
    }
    else if(Math.floor(div)===3){
      data=[true,true,true,'','']
    }
    else if(Math.floor(div)===4){
      data=[true,true,true,true,'']

    }
    else if(Math.floor(div)===5){
      data=[true,true,true,true,true]

    }
    else {
      data=['','','','','']
    }

    return data
  }

}
