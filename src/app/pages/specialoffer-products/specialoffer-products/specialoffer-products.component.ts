import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { CartService } from '../../cart/cart.service';
import { SpecialOfferProductsService } from "../specialoffer-products.service";
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
import { GlobalService } from '../../cart/global.service';
@Component({
  selector: 'app-specialoffer-products',
  templateUrl: './specialoffer-products.component.html',
  styleUrls: ['./specialoffer-products.component.css']
})
export class SpecialOfferProductsComponent extends RootComponent implements OnInit {

  products: any = [];
  shopName: string;
  currentPageNumber: 1;
  discountStatus:boolean
  offerPrise:any;
  currentUser: any;
  price:any
  constructor(
    private routes: ActivatedRoute,
    public _AS: AlertService,
    private globalSrv: GlobalService,
    private _SPS: SpecialOfferProductsService,
    private _CS: CartService,private seoService: SEOService,private updateMetaTagSrv:MetakeywordsService,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
    this.shopName = "TOQ"
    this.shopName  = localStorage.getItem("shopName")
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getAllProducts(this.shopName);
    this.updateMetaTagSrv.getSeoContent('Special Offer Products').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords,"https://toq.co.in/specialofferproducts"+data.categorySlug,data.data.imageUrl)
        }
      }
    )
    this.seoService.updateCanonicalUrl('https://toq.co.in/specialofferproducts')
  }

  getAllProducts(shopName) {
    this._SPS.getVendorSalesProducts(shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.products = data.data;
          } else {
            this.products = []
        }
      }
    )
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
        selectQuantity: 1,
        subCategoryId: product.subCategoryId,
        variantId: product.variantId,
        personalisedMessage: "",
        cardType :  "",
        giftTo :  "",
        giftFrom : "",
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
       console.log(" lastSavedCart : "+JSON.stringify(lastSavedCart))
       if(lastSavedCart != null  && lastSavedCart.length != 0){
        var checkLastIndex = -1;
        for(let i=0; i<lastSavedCart.length;i++){
         if(lastSavedCart[i].variantId == product.variantId){
         checkLastIndex = i
         break;
         }
        }
        if(checkLastIndex != -1){
          lastSavedCart[checkLastIndex].selectQuantity =  1
        }else {
          lastSavedCart.push({
            categoryId: product.categoryId,
        vendorId: product.vendorId,
        productId: product.productId,
        variantImg:  product.variantImg,
        productName: product.productName,
        brand: product.brand,
        selectQuantity: 1,
        subCategoryId: product.subCategoryId,
        variantId: product.variantId,
        offerPrice: product.offerPrice,
        totalDiscountedPrice: Number(product.offerPrice),
        personalisedMessage: "",
        cardType :  "",
        giftTo :  "",
        giftFrom : "",
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
        variantImg:  product.variantImg,
        productName: product.productName,
        brand: product.brand,
        selectQuantity: 1,
        subCategoryId: product.subCategoryId,
        variantId: product.variantId,
        offerPrice: product.offerPrice,
        totalDiscountedPrice: Number(product.offerPrice),
        personalisedMessage: "",
        cardType :  "",
        giftTo :  "",
        giftFrom : "",
        })
        console.log("lastSavedCart.length 1: "+JSON.stringify(lastSavedCart.length))
        this.globalSrv.theItem = lastSavedCart.length.toString()
        await localStorage.setItem("lastSavedCart" , JSON.stringify(lastSavedCart))
      }
      }
    }
    }
  
  getDiscount(offerPrice,price){
    
    let percentage=(offerPrice/price)*100
    
    let p= (100-percentage).toFixed(0)
    if(Number(p)!==0){
     
      this.discountStatus=true
    }
    else{
      this.discountStatus=false
    }
    return p

  }

}
