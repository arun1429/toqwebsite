import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { CartService } from '../../cart/cart.service';
import { SellingProductsService } from "../selling-products.service";
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
@Component({
  selector: 'app-selling-products',
  templateUrl: './selling-products.component.html',
  styleUrls: ['./selling-products.component.css']
})
export class SellingProductsComponent extends RootComponent implements OnInit {

  products: any = [];
  currentPageNumber: 1;
  discountStatus:boolean
  offerPrise:any;
  price:any
  shopName: string;
  constructor(
    private routes: ActivatedRoute,
    public _AS: AlertService,
    private _SPS: SellingProductsService,
    private _CS: CartService,private seoService: SEOService,private updateMetaTagSrv:MetakeywordsService,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
    this.shopName = "TOQ"
    this.shopName  = localStorage.getItem("shopName")
    this.getAllProducts(this.shopName);
    this.updateMetaTagSrv.getSeoContent('Best Selling Products').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords)
        }
      }
    )
    this.seoService.updateCanonicalUrl('https://toq.co.in/bestsellingproducts')
  }

  getAllProducts(shopName) {
    this._SPS.getVendorBestProducts(shopName).subscribe(
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
