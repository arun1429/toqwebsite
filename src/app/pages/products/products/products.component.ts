import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { CartService } from '../../cart/cart.service';
import { ProductsService } from "../products.service";
import { Options } from '@angular-slider/ngx-slider';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { CheckoutService } from '../../checkout/checkout.service';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
import { GlobalService } from '../../cart/global.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],

})
export class ProductsComponent extends RootComponent implements OnInit,OnDestroy, AfterViewInit {
  offerPrise: any;
  price: any;
  groupId: string;
  categoryId: string;
  categorySlug:string;
  products: any = [];
  categories: any = [];
  selectedIndex: number = -1;
  sortingType: boolean;
  sortingElement: string;
  //stock: number = 0;
  minPrice: number = 0;
  states:any=[]
  maxPrice: number = 3000;
  options: Options = {
    floor: 0,
    step: 100,
    minRange: 500,
    ceil: 3000
  };
  filterCity=''
  currentPageNumber = 1;
  discountStatus: boolean;
  statusOff: boolean;
  currentUser: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    public _AS: AlertService,
    private globalSrv: GlobalService,
    private _PS: ProductsService,
    private routes: ActivatedRoute,
    private _CS: CartService,private seoService: SEOService,private updateMetaTagSrv:MetakeywordsService,
    private _CHS: CheckoutService,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
   var currentPage =  localStorage.getItem("currentPageNumber")
   console.log("currentPage: "+currentPage)
   if(currentPage != null){
     this.currentPageNumber = Number(currentPage)
   }
    this.routes.params.subscribe(
      data => {
        this.categorySlug = data.categorySlug;
       this.getProductBySlug(data.categorySlug)
        this.getAllCategories();
        this.seoService.updateCanonicalUrl("https://toq.co.in/"+data.categorySlug)
        this.updateMetaTagSrv.getSeoContent('Product Page').subscribe(
          (data: any) => {
            if (data.meta.status) {
              this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords,"https://toq.co.in/"+data.categorySlug,data.data.imageUrl)
            }
          }
        )
      }
    ) 
    this.getStates();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   
  }
  ngOnDestroy(): void{
    console.log("ondes :called ")
    localStorage.setItem("currentPageNumber",this.currentPageNumber.toString())
  }
  selectCity(event){
    this.filterCity=event.target.value
    this._PS.getProductByGroupIdState(this.groupId,event.target.value).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.products = data.data;
          this.getMaxPrice();
        } else {
          this.products =[]
        }
      }
    )
    this.currentPageNumber=1
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

  ngAfterViewInit() {
    //this.outOfStock();
    this.cdr.detectChanges();
  }

  checkSelectedIndex(indexValue: number) {
    this.selectedIndex = indexValue;
  }

  sort(key, status) {
    this.sortingType = status;
    this.sortingElement = key;
  }

  // outOfStock() {
  //   if (this.stock !== 0) {
  //     this.stock = 0;
  //   } else {
  //     this.stock = 1;
  //   }
  // }

  getAllCategories() {
    this._PS.getAllCategoriesByGroupId(this.groupId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.categories = data.data;
        }
      }
    )
  }

  getProductsByGroupId() {
    this._PS.getProductByGroupId(this.groupId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.products = data.data;
          this.getMaxPrice();
        } else {
          this.products = []
        }
      }
    )
  }

  getProductByCategoryId(subCategorySlug: string, indexValue?: number) {
    // let obj = {
    //   id: categoryId
    // }
    // this._PS.getProductBycatIdSubCatId(obj).subscribe(
    //   (data: any) => {
    //     if (data.meta.status) {
    //       this.products = data.data;
    //       this.selectedIndex = indexValue;
    //       this.getMaxPrice();
    //     } else {
    //       this.products = []
    //     }
    //   }
    // )
    this.router.navigateByUrl("/products/"+subCategorySlug);
  }
  getProductBySlug(categorySlug: string) {
    let obj = {
      id: categorySlug
    }
    this._PS.getProductBySlug(obj).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.products = data.data;
          this.getMaxPrice();
          if(this.products.size !=0){
            this.categoryId = this.products[0].categoryId
            this.groupId = this.products[0].groupId
            this.getAllCategories()
          }
        } else {
          this.products =[]
        }
      }
    )
  }

  getMaxPrice() {
    let priceArray: any = [];
    this.products.map(data => {
      priceArray.push(data.offerPrice);
    });
    priceArray.sort();
    this.zone.run(() => {
      this.options = {
        floor: 0,
        step: 100,
        minRange: 500,
        ceil: 3000
      }
      this.minPrice = 0;
      this.maxPrice =3000;
      this.options = {
        floor: 0,
        step: 100,
        minRange: 500,
        ceil: 3000
      }
      console.log(priceArray)
      //this.minPrice = Math.min(...priceArray)
      //this.minPrice = 0
      this.maxPrice = 3000
      this.cdr.detectChanges();
    })
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
