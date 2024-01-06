import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services';
import { CartService } from '../../cart/cart.service';
import { ProductsService } from "../products.service";
import { Options } from '@angular-slider/ngx-slider';
import { RootComponent } from '../../../_shared/components/root/root.component';
import { CheckoutService } from '../../checkout/checkout.service';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends RootComponent implements OnInit, AfterViewInit {
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
  stock: number = 0;
  minPrice: number = 0;
  states:any=[]
  maxPrice: number = 0;
  options: Options = {
    floor: 0,
    ceil: 0
  };
  filterCity=''
  currentPageNumber = 1;
  discountStatus: boolean;
  statusOff: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    public _AS: AlertService,
    private _PS: ProductsService,
    private routes: ActivatedRoute,
    private _CS: CartService,private seoService: SEOService,private updateMetaTagSrv:MetakeywordsService,
    private _CHS: CheckoutService,
    private router: Router) {
    super(_AS);
  }

  ngOnInit(): void {
    this.routes.params.subscribe(
      data => {
        this.categorySlug = data.categorySlug;
       this.getProductBySlug(data.categorySlug)
        this.getAllCategories();
        this.seoService.updateCanonicalUrl(data.categorySlug)
      }
    ) 
    this.getStates();
    this.getDiscount(this.offerPrise,this.price)
    this.updateMetaTagSrv.getSeoContent('Product Page').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords)
        }
      }
    )
   
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
    this.outOfStock();
    this.cdr.detectChanges();
  }

  checkSelectedIndex(indexValue: number) {
    this.selectedIndex = indexValue;
  }

  sort(key, status) {
    this.sortingType = status;
    this.sortingElement = key;
  }

  outOfStock() {
    if (this.stock !== 0) {
      this.stock = 0;
    } else {
      this.stock = 1;
    }
  }

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

  getProductByCategoryId(categoryId: string, indexValue?: number) {
    let obj = {
      id: categoryId
    }
    this._PS.getProductBycatIdSubCatId(obj).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.products = data.data;
          this.selectedIndex = indexValue;
          this.getMaxPrice();
        } else {
          this.products = []
        }
      }
    )
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
    this.zone.run(() => {
      this.options = {
        floor: 0,
        ceil: 0
      }
      this.minPrice = 0;
      this.maxPrice = 0;
      this.options = {
        floor: Math.min(...priceArray),
        ceil: Math.max(...priceArray)
      }
      this.minPrice = Math.min(...priceArray)
      this.maxPrice = Math.max(...priceArray);
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

  addToCart(product) {
    const cartData = {
      categoryId: product.categoryId,
      productId: product.productId,
      selectQuantity: 1,
      subCategoryId: product.subCategoryData[0].subCategoryId,
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
        this.router.navigateByUrl("/login");
        this.alertMessage({ type: "danger", title: "Error Occured", value: "Please login first" });
      }
    );
  }

  trackByProductId(index: number, product: any): string {
    return product.productId;
}

}
