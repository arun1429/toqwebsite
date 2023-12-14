import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { CartService } from '../../cart/cart.service';
import { SearchProductsService } from "../search-products.service";

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.css']
})
export class SearchProductsComponent extends RootComponent implements OnInit {

  products: any = [];
  searchKey: string;
  currentPageNumber: 1;
  discountStatus:boolean
  offerPrise:any;
  price:any
  constructor(
    private routes: ActivatedRoute,
    public _AS: AlertService,
    private _SPS: SearchProductsService,
    private _CS: CartService,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
    this.routes.queryParams.subscribe(
      data => {
        if (data && data.search && data.search.length > 0) {
          this.searchKey = data.search;
          this.getAllSearchProducts();
        }
      }
    )
    this.getDiscount(this.offerPrise,this.price)
  }

  getAllSearchProducts() {
    this._SPS.searchProduct(this.searchKey).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.products = data.data;
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
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
