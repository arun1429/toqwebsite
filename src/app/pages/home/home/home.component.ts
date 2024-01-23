import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { HomeService } from "../home.service";
import { RootComponent } from '../../../_shared/components/root/root.component';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
import { GlobalService } from '../../cart/global.service';
import { CartService } from '../../cart/cart.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends RootComponent implements OnInit, AfterViewInit {
  shopName: string;
  products: any = [];
  categories: any = [];
  stock: number = 0;
  discountStatus: boolean;
  statusOff: boolean;
  banners: any = [];
  brandAmbass: any = [];
  bannerCarouselOption: OwlOptions = {
    animateOut: 'fadeOut',
    autoplay: true,
    loop: false,
    rewind: true,
    nav: false,
    autoplaySpeed: 1000,
    autoplayTimeout: 10000,
    items: 1,
    autoHeight: true,
    dots: true,
    navText: ['<i class="ion-chevron-left"></i>', '<i class="ion-chevron-right"></i>'],
  }
  productCarouselOption: OwlOptions = {
    autoplay: true,
    loop: true,
    nav: true,
    margin:20,
    autoplaySpeed: 1000,
    autoplayTimeout: 10000,
    items: 3,
    dots: false,
    navText: ['<i class="ion-ios-arrow-back"></i>', '<i class="ion-ios-arrow-forward"></i>'],
    responsive: {
      0: {
        items: 2,
      },
      768: {
        items: 2,
      },
      992: {
        items: 4,
      },

    }
  }
  productCarouseloption2: OwlOptions = {
    autoplay: true,
    loop: true,
    nav: true,
    margin: 20,
    autoplaySpeed: 1000,
    autoplayTimeout: 10000,
    items: 4,
    dots: false,
    navText: ['<i class="ion-ios-arrow-back"></i>', '<i class="ion-ios-arrow-forward"></i>'],
    responsive: {
      0: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
      1200: {
        items: 4,
      },
    }
  }
  categoryCarouselOption: OwlOptions = {
    autoplay: true,
    loop: true,
    margin: 20,
    nav: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 10000,
    items: 3,
    dots: false,
    navText: ['<i class="ion-ios-arrow-back"></i>', '<i class="ion-ios-arrow-forward"></i>'],
    responsive: {
      0: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 3,
      },
    }
  }
  currentUser: any;
  latestProducts: any = [];
  salesProducts: any = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    public _AS: AlertService,
    private globalSrv: GlobalService,
    private _PS: HomeService,
    private _CS: CartService,
    private updateMetaTagSrv:MetakeywordsService,
    private routes: ActivatedRoute,private seoService: SEOService,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
    this.shopName = "TOQ"
    localStorage.setItem("shopName",this.shopName)
    localStorage.setItem("currentPageNumber","1")
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getVendorBanners();
    this.getVendorAmbass();
    this.getVendorCategory();
    this.getVendorBestProducts();
    this.getVendorLatestProducts();
    this.getVendorSalesProducts();
    this.updateMetaTagSrv.getSeoContent('Home').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords,"https://toq.co.in/",data.data.imageUrl)
        }
      }
    )
    this.seoService.updateCanonicalUrl('https://toq.co.in/')
  }
  ngAfterViewInit() {
    this.outOfStock();
    this.cdr.detectChanges();
  }
  getVendorBanners() {
    this._PS.getVendorBanners(this.shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.banners = data.data;
        } else {
          this.banners =[]
        }
      }
    )
  }
  getVendorAmbass() {
    this._PS.getVendorBrandAmbassador(this.shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.brandAmbass = data.data;
        } else {
          this.brandAmbass =[]
        }
      }
    )
  }
  getDiscount(offerPrice,price){
    
    if(offerPrice !== price){
      this.statusOff=false
    let percentage=(offerPrice/price)*100
    
    let p= (100-percentage).toFixed(0)
    if(Number(p)!==0){
     
      this.discountStatus=true
    }
    else{
      this.discountStatus=false
    }
    return p
  }else{
    this.statusOff=true
  }
}
  outOfStock() {
    if (this.stock !== 0) {
      this.stock = 0;
    } else {
      this.stock = 1;
    }
  }
  getVendorBestProducts() {
    this._PS.getVendorBestProducts(this.shopName).subscribe(
      (data: any) => {
        console.log("data : "+JSON.stringify(data))
        if (data.meta.status) {
          this.products = data.data;
        } else {
          this.products = []
        }
      }
    )
  }

  getVendorCategory() {
    
    this._PS.getVendorCategory(this.shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.categories = data.data;
        } else {
          this.categories = []
        }
      }
    )
  }

  getVendorLatestProducts() {
    this._PS.getVendorLatestProducts(this.shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.latestProducts = data.data;
        } else {
          this.latestProducts =[]
        }
      }
    )
  }
  getVendorSalesProducts() {
    this._PS.getVendorSalesProducts(this.shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.salesProducts = data.data;
        } else {
          this.salesProducts = []
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
       if(lastSavedCart.length !=0){
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

  trackByProductId(index: number, product: any): string {
    return product.productId;
}

}
