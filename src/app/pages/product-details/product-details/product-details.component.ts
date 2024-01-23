import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { NgxSpinnerService } from "ngx-spinner";
import { RootComponent } from '../../../_shared/components/root/root.component';
import { ProfileService } from '../../profile/profile.service';
import { HomeService } from '../../home/home.service';
import { ProductDetailsService } from "../product-details.service";
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalService } from '../../cart/global.service';
import { CartService } from '../../cart/cart.service';
import { GlobalWishService } from '../../cart/globalwish.service';
declare var $: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent extends RootComponent implements OnInit {
  productDetails: any;
  productId: string;
  variantSlug: string;
  ratingsByUser: number = 0;
  discountStatus = true;
  statusOff = true
  isWishListStatus: boolean = false
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
  cartTypeArray = [
    {
      cardType: "Best Wishes",
      cardName: "Best Wishes"
    },
    {
      cardType: "Merry Christmas",
      cardName: "Merry Christmas"
    },
    {
      cardType: "Happy New Year",
      cardName: "Happy New Year"
    },
    {
      cardType: "Happy Birthday",
      cardName: "Happy Birthday"
    },
    {
      cardType: "Love You",
      cardName: "Love You"
    },
    {
      cardType: "Happy Anniversary",
      cardName: "Happy Anniversary"
    },
    {
      cardType: "Congratulations",
      cardName: "Congratulations"
    },
    {
      cardType: "Sorry",
      cardName: "Sorry"
    },
    {
      cardType: "Thankyou",
      cardName: "Thankyou"
    },
    {
      cardType: "Wedding Wishes",
      cardName: "Wedding Wishes"
    },
    {
      cardType: "Bridesmaids Proposal",
      cardName: "Bridesmaids Proposal"
    },
  ];
  reviewForm: FormGroup;
  reviews: any = [];
  selectedQuanity: number = 1;
  selectedIndexCard: number = 0;
  personalisedMessage: String = "";
  cardType: String = "";
  giftTo: String= "";
  giftFrom: String = "";
  selectedVariantIndex: number = 0;
  quoteFormGroup: FormGroup;
  currentUser: any;
  pincode: number;
  GSTPrice: any;
  offerPrise: any;
  price: any;
  discount: number;
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
    private globalSrv: GlobalService,
    private globalWishSrv: GlobalWishService,
    private _CS: CartService,private seoService: SEOService,private updateMetaTagSrv:MetakeywordsService,
    private spinnerService: NgxSpinnerService,
    private router: Router) {
    super(_AS);
    this.reviewForm = this._FB.group({
      review: ['', Validators.required],
      userName: ['', Validators.required],
      userEmailId: ['', [Validators.required, Validators.email]]
    })
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(" this.currentUser : "+ this.currentUser)
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
        this.variantSlug = data.variantSlug;
        if (this.variantSlug) {
          this.getProductDetailsBySlug();
          this.seoService.updateCanonicalUrl('https://toq.co.in/product-details/'+this.variantSlug)
        }
      }
    )
    this.getDiscount(this.offerPrise, this.price)
  }

  imageList: any
  newImg: any;
  getProductDetailsBySlug() {
    let tepmLocalStorage = localStorage.getItem('currentUser')
    if (tepmLocalStorage) {
      this.userId = JSON.parse(tepmLocalStorage).userId;
    }
    this.spinnerService.show();
    this._PDS.getProductDetailBySlug(this.variantSlug, this.userId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.productDetails = data.data;
          this.productId = data.data.productId
          this.isWishListStatus=  data.data.wishListStatus
          if(data.data.categoryId == "65aaba800af25e301ddb5094"){
            this.cardType = "Best Wishes";
          }
          console.log(this.productDetails)
          this.spinnerService.hide();
          if (this.productDetails) {
            this.productDetails.variant.map((val, i) => {
              this.variantId=val.variantId;
              this.variantRating=this.productDetails.variant[this.selectedVariantIndex].overAllRating
              if (val.variantSlug === this.variantSlug) {
                this.selectedVariantIndex = i
                this.variantName=val.variantName;
                this.variantRating=val.overAllRating;
                this.variantId=val.variantId;
                this.getReviewData();
                this.imageList = { image: val.variantImg }
                this.newImg = this.imageList.image[0];

                this.updateMetaTagSrv.getSeoContent(data.data.productName).subscribe(
                  (data: any) => {
                    if (data.meta.status) {
                      this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords,"https://toq.co.in/product-details/"+this.variantSlug,data.data.imageUrl)
                    }
                  }
                )
              }
            });
          }
        }
      }
    )
  }
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
          this.isWishListStatus=  data.data.wishListStatus
          if(data.data.categoryId == "65aaba800af25e301ddb5094"){
            this.cardType = "Best Wishes";
          }
          console.log(this.productDetails)
          this.spinnerService.hide();
          if (this.productDetails) {
            this.productDetails.variant.map((val, i) => {
              this.variantId=val.variantId;
              this.variantRating=this.productDetails.variant[this.selectedVariantIndex].overAllRating
              if (val.variantSlug === this.variantSlug) {
                this.selectedVariantIndex = i
                this.variantName=val.variantName;
                this.variantRating=val.overAllRating;
                this.variantId=val.variantId;
                this.getReviewData();
                this.imageList = { image: val.variantImg }
                this.newImg = this.imageList.image[0];
              }
            });
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
    this.router.navigateByUrl("/product-details/"+productDetails.variant[i].variantSlug);
  }
  changeCartType(i,cartDetails) {
    this.selectedIndexCard = i
    this.cardType = cartDetails[i].cardType;
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
  changePerMessage(event) {
    this.personalisedMessage = event.target.value;
  }
  changeGiftTo(event) {
    this.giftTo = event.target.value;
  }
  changeGiftFrom(event) {
    this.giftFrom = event.target.value;
  }
  buyNow(product : any) {
    if(this.currentUser){
      var totalCartCount =   localStorage.getItem("totalCartCount")
      if(product.subCategoryId == '65ab57a30af25e301ddb52f8' && totalCartCount == "0"){
        this.alertMessage({ type: "danger", title: "No item in cart ", value: "Please add any different product to add empty gift box" });
      }else {
    const cartData = {
      categoryId: product.categoryId,
      vendorId: product.vendorId,
      productId: product.productId,
      selectQuantity: this.selectedQuanity,
      subCategoryId: product.subCategoryId,
      variantId: product.variant[this.selectedVariantIndex].variantId,
      isBuyNow: true,
      personalisedMessage: this.personalisedMessage,
      cardType :this.cardType,
      giftTo : this.giftTo,
      giftFrom :this.giftFrom
    };
    this._CS.addToCart(cartData).subscribe(
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
    }else {
      this.router.navigateByUrl("/userprofile/login");
        this.alertMessage({ type: "danger", title: "Error Occured", value: "Please login first" });
    }
  }

  async addToCart(product :any) {
    console.log(" this.currentUser : "+this.currentUser)
    if(this.currentUser){
      var totalCartCount =   localStorage.getItem("totalCartCount")
      if(product.subCategoryId == '65ab57a30af25e301ddb52f8' && totalCartCount == "0"){
        this.alertMessage({ type: "danger", title: "No item in cart ", value: "Please add any different product to add empty gift box" });
      }else {

      const cartData = {
        categoryId: product.categoryId,
        vendorId: product.vendorId,
        productId: product.productId,
        selectQuantity: this.selectedQuanity,
        subCategoryId: product.subCategoryId,
        variantId: product.variant[this.selectedVariantIndex].variantId,
        personalisedMessage: this.personalisedMessage,
        cardType :this.cardType,
        giftTo : this.giftTo,
        giftFrom :this.giftFrom
      };
      this._CS.addToCart(cartData).subscribe(
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
    }else {
      var lastSavedCart = []
       lastSavedCart =   JSON.parse(localStorage.getItem("lastSavedCart"))
      if(lastSavedCart.length !=0){
        var checkLastIndex = -1;
        for(let i=0; i<lastSavedCart.length;i++){
         if(lastSavedCart[i].variantId == product.variant[this.selectedVariantIndex].variantId){
         checkLastIndex = i
         break;
         }
        }
        if(checkLastIndex != -1){
          lastSavedCart[checkLastIndex].selectQuantity =  this.selectedQuanity
        }else {
          lastSavedCart.push({
            categoryId: product.categoryId,
            vendorId: product.vendorId,
            productId: product.productId,
            variantImg:  product.variant[this.selectedVariantIndex].variantImg,
            productName: product.productName,
            brand: product.brand,
            selectQuantity: this.selectedQuanity,
            subCategoryId: product.subCategoryId,
            variantId: product.variant[this.selectedVariantIndex].variantId,
            offerPrice: product.variant[this.selectedVariantIndex].offerPrice,
            totalDiscountedPrice: Number(product.variant[this.selectedVariantIndex].offerPrice * this.selectedQuanity),
            personalisedMessage: this.personalisedMessage,
            cardType :this.cardType,
            giftTo : this.giftTo,
            giftFrom :this.giftFrom,
            
          })
        }
        console.log("lastSavedCart.length 1: "+JSON.stringify(lastSavedCart.length))
        this.globalSrv.theItem = lastSavedCart.length.toString()
        await localStorage.setItem("lastSavedCart" , JSON.stringify(lastSavedCart))
    
      }else {
        lastSavedCart = []
        if(product.subCategoryId == '65ab57a30af25e301ddb52f8'){
          this.alertMessage({ type: "danger", title: "No item in cart ", value: "Please add any different product to add empty gift box" });
        }else {
        lastSavedCart.push({
          categoryId: product.categoryId,
            vendorId: product.vendorId,
            productId: product.productId,
            variantImg:  product.variant[this.selectedVariantIndex].variantImg,
            productName: product.productName,
            brand: product.brand,
            selectQuantity: this.selectedQuanity,
            subCategoryId: product.subCategoryId,
            variantId: product.variant[this.selectedVariantIndex].variantId,
            offerPrice: product.variant[this.selectedVariantIndex].offerPrice,
            totalDiscountedPrice: Number(product.variant[this.selectedVariantIndex].offerPrice * this.selectedQuanity),
        })
        console.log("lastSavedCart.length 1: "+JSON.stringify(lastSavedCart.length))
        this.globalSrv.theItem = lastSavedCart.length.toString()
        await localStorage.setItem("lastSavedCart" , JSON.stringify(lastSavedCart))
      }
    }
      }
      
    }
   
    async addToWishList(product :any) {
    console.log(" this.currentUser : "+this.currentUser)
    if(this.currentUser){
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
        }, error => {
        }
      );
    }else {
      var lastSavedWish = []
      lastSavedWish =   JSON.parse(localStorage.getItem("lastSavedWish"))
      if(lastSavedWish == null  || lastSavedWish.length == 0){
        lastSavedWish = []
        lastSavedWish.push({
          categoryId: product.categoryId,
          productId: product.productId,
          selectQuantity: 1,
          subCategoryId: product.subCategoryId,
          vendorId: product.vendorId,
          variantId: product.variant[this.selectedVariantIndex].variantId
        })
        console.log("lastSavedWish.length 1: "+JSON.stringify(lastSavedWish.length))
        this.globalWishSrv.theItem = lastSavedWish.length.toString()
        this.isWishListStatus =true
        await localStorage.setItem("lastSavedWish" , JSON.stringify(lastSavedWish))
      }else {
        var checkLastIndex = -1;
        for(let i=0; i<lastSavedWish.length;i++){
         if(lastSavedWish[i].variantId == product.variant[this.selectedVariantIndex].variantId){
         checkLastIndex = i
         break;
         }
        }
        console.log("checkLastIndex : "+checkLastIndex)
        if(checkLastIndex == -1){
          lastSavedWish.push({
            categoryId: product.categoryId,
        productId: product.productId,
        selectQuantity: 1,
        subCategoryId: product.subCategoryId,
        vendorId: product.vendorId,
        variantId: product.variant[this.selectedVariantIndex].variantId
          })
          this.isWishListStatus =true
        }else{
          this.isWishListStatus =false
          lastSavedWish.splice(checkLastIndex, 1)
        }
        console.log("lastSavedWish.length 1: "+JSON.stringify(lastSavedWish.length))
        this.globalWishSrv.theItem = lastSavedWish.length.toString()
        await localStorage.setItem("lastSavedWish" , JSON.stringify(lastSavedWish))
       
      }
      }
      
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
