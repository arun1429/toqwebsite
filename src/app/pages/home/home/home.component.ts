import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { HomeService } from "../home.service";
import { Options } from '@angular-slider/ngx-slider';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
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
  latestProducts: any = [];
  salesProducts: any = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    public _AS: AlertService,
    private _PS: HomeService,private updateMetaTagSrv:MetakeywordsService,
    private routes: ActivatedRoute,private seoService: SEOService,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
    this.shopName = "TOQ"
    localStorage.setItem("shopName",this.shopName)
    this.getVendorBanners();
    this.getVendorAmbass();
    this.getVendorCategory();
    this.getVendorBestProducts();
    this.getVendorLatestProducts();
    this.getVendorSalesProducts();
    this.updateMetaTagSrv.getSeoContent('Home').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords)
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
          console.log("this.products : "+JSON.stringify(this.products))
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
  addToCart(product) {
    const cartData = {
      categoryId: product.categoryId,
      productId: product.productId,
      selectQuantity: 1,
      subCategoryId: product.subCategoryData[0].subCategoryId,
      vendorId: product.vendorId,
      variantId: product.variantId
    };
    this._PS.addToCart(cartData).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
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

  trackByProductId(index: number, product: any): string {
    return product.productId;
}

}
