import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { HomeService } from "../home.service";
import { Options } from '@angular-slider/ngx-slider';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent extends RootComponent implements OnInit, AfterViewInit {
  shopName: string;
  products: any = [];
  stock: number = 0;
  discountStatus: boolean;
  statusOff: boolean;
  banners: any = [];
  bannerCarouselOption: OwlOptions = {
    animateOut: 'fadeOut',
    autoplay: true,
    loop: false,
    rewind: true,
    nav: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 10000,
    items: 1,
    autoHeight: true,
    dots: true,
    navText: ['<i class="ion-chevron-left"></i>', '<i class="ion-chevron-right"></i>'],
  }
  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    public _AS: AlertService,
    private _PS: HomeService,
    private routes: ActivatedRoute,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
    this.routes.params.subscribe(
      data => {
        this.shopName = data.vendorName;
        this.getProductsByGroupId();
        this.getAllBanners();
        localStorage.setItem("shopName",data.vendorName)
      }
    ) 
  }
  ngAfterViewInit() {
    this.outOfStock();
    this.cdr.detectChanges();
  }
  getAllBanners() {
    this._PS.getVendorBanners(this.shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.banners = data.data;
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
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
  getProductsByGroupId() {
  
    this._PS.getProducts(this.shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.products = data.data;
          console.log("this.products : "+JSON.stringify(this.products))
        } else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
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
