import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { CartService } from '../../cart/cart.service';
import { NewarrivalProductsService } from "../newarrival-products.service";
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
@Component({
  selector: 'app-newarrival-products',
  templateUrl: './newarrival-products.component.html',
  styleUrls: ['./newarrival-products.component.css']
})
export class NewarrivalProductsComponent extends RootComponent implements OnInit {

  products: any = [];
  searchKey: string;
  currentPageNumber: 1;
  shopName: string;
  discountStatus:boolean
  offerPrise:any;
  price:any
  constructor(
    private routes: ActivatedRoute,
    public _AS: AlertService,
    private _SPS: NewarrivalProductsService,private seoService: SEOService,private updateMetaTagSrv:MetakeywordsService,
    private _CS: CartService,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
    this.shopName = "TOQ"
    this.shopName  = localStorage.getItem("shopName")
    this.getAllProducts(this.shopName);
    this.updateMetaTagSrv.getSeoContent('New Arrivals').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords)
        }
      }
    )
    this.seoService.updateCanonicalUrl('https://toq.co.in/newarrivalproducts')
  }

  getAllProducts(shopName) {
    this._SPS.getAllLatestProducts(shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.products = data.data;
        } else {
          this.products = []
        }
      }
    )
  }
  

  addToCart(product) {
    const cartData = {
      categoryId: product.categoryId,
      productId: product.productId,
      selectQuantity: 1,
      subCategoryId: product.subCategoryId,
      vendorId: product.vendorId,
      variantId: product.variantId
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
        this.router.navigateByUrl("/userprofile/login");
        this.alertMessage({ type: "danger", title: "Error Occured", value: "Please login first" });
      }
    );
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
