import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from "../../pages/home/home.service";
import { AlertService, UserService } from 'src/app/_services';
import { StartService } from "../start.service";
import { ProfileService } from '../../pages/profile/profile.service';
import { RootComponent } from '../../_shared/components/root/root.component';
import { GlobalService } from 'src/app/pages/cart/global.service';
import { CartService } from 'src/app/pages/cart/cart.service';
import { GlobalWishService } from 'src/app/pages/cart/globalwish.service';


declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends RootComponent implements OnInit {
  shopName: string;
  groupsData: any = [];
  carts: any = [];
  searchKey: string;
  cartSum: number = 0;
  total: number = 0;
  Cgst:Number=0;
  Igst:Number=0;
  totalDiscount: Number = 0;
  deliveryCharges: Number = 0;
  convenienceFee: Number = 0;
  cartDataLength: string = "0";
  wishDataLength: string = "0";
  currentUser: any;
  wishLists: any = [];
  userName: string = 'Guest';
  isLoggedIn: boolean = false;

  constructor(
    public _AS: AlertService,
    private _SS: StartService,
    private _US: UserService,
    private _CS: CartService,
    private globalSrv: GlobalService,
    private globalWishSrv: GlobalWishService,
    private router: Router,
    private _PFS: ProfileService) {
    super(_AS);
  }

  ngOnInit(): void {
    localStorage.setItem("totalCartCount" , "0")
    this.shopName = "TOQ"
    this.shopName  = localStorage.getItem("shopName")
    this.getAllGroups("TOQ");
    this._CS.emitCardData().subscribe(x => {
      if (x) {
        this.getCartItems();
      }
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.globalSrv.itemValue.subscribe((nextValue) => {
          this.cartDataLength =nextValue
      })
        this.globalWishSrv.itemValue.subscribe((nextValue) => {
          this.wishDataLength =nextValue
        })
        
    if(this.currentUser){
      var lastSavedCart = []
      if(localStorage.getItem("lastSavedCart") != null ){
        lastSavedCart =   JSON.parse(localStorage.getItem("lastSavedCart"))
        this.cartDataLength =lastSavedCart.length.toString()
        for(let i=0; i<lastSavedCart.length; i++){
          const cartData = {
            categoryId: lastSavedCart[i].categoryId,
            vendorId: lastSavedCart[i].vendorId,
            productId: lastSavedCart[i].productId,
            selectQuantity: lastSavedCart[i].selectQuantity,
            subCategoryId: lastSavedCart[i].subCategoryId,
            variantId: lastSavedCart[i].variantId,
            personalisedMessage: lastSavedCart[i].personalisedMessage,
            cardType : lastSavedCart[i].cardType,
            giftTo : lastSavedCart[i].giftTo,
            giftFrom :lastSavedCart[i].giftFrom
          };
          this._CS.addToCart(cartData).subscribe(
            (data: any) => {
            if(i== (lastSavedCart.length -1)){
              lastSavedCart = []
              this.globalSrv.theItem = lastSavedCart.length.toString()
               localStorage.setItem("lastSavedCart" , JSON.stringify(lastSavedCart))
              this.getCartItems()
            }
            },
          )
        }
      }else {
      this.getCartItems();
    }
    }else {
      var lastSavedCart = []
      lastSavedCart =   JSON.parse(localStorage.getItem("lastSavedCart"))
      if(localStorage.getItem("lastSavedCart") == null ){
        this.cartDataLength = "0"
      }else {
        if(lastSavedCart != null  && lastSavedCart.length != 0){
          this.cartDataLength =lastSavedCart.length.toString()
          console.log("lastSavedCart.length : "+JSON.stringify(lastSavedCart.length))
        }else {
         this.cartDataLength = "0"
        }
      }
      console.log("lastSavedCart : "+JSON.stringify(lastSavedCart))
  }
  if(this.currentUser){
    var lastSavedWish = []
    if(localStorage.getItem("lastSavedWish") != null ){
      lastSavedWish =   JSON.parse(localStorage.getItem("lastSavedWish"))
      this.wishDataLength =lastSavedWish.length.toString()
      for(let i=0; i<lastSavedWish.length; i++){
        const cartData = {
          categoryId: lastSavedWish[i].categoryId,
          vendorId: lastSavedWish[i].vendorId,
          productId: lastSavedWish[i].productId,
          selectQuantity: lastSavedWish[i].selectQuantity,
          subCategoryId: lastSavedWish[i].subCategoryId,
          variantId: lastSavedWish[i].variantId,
        };
        this._PFS.addToWishList(cartData).subscribe(
          (data: any) => {
          if(i== (lastSavedWish.length -1)){
            lastSavedWish = []
            this.globalWishSrv.theItem = lastSavedWish.length.toString()
             localStorage.setItem("lastSavedWish" , JSON.stringify(lastSavedWish))
            this.getWishListItems()
          }
          },
        )
      }
    }else {
    this.getWishListItems();
  }
  }else {
    var lastSavedWish = []
    lastSavedWish =   JSON.parse(localStorage.getItem("lastSavedWish"))
    if(localStorage.getItem("lastSavedWish") == null ){
      this.wishDataLength = "0"
    }else {
      if(lastSavedWish.length !=0){
        this.wishDataLength =lastSavedWish.length.toString()
        console.log("lastSavedWish.length : "+JSON.stringify(lastSavedWish.length))
      }else {
       this.wishDataLength = "0"
      }
    }
   
    console.log("lastSavedWish : "+JSON.stringify(lastSavedWish))
}
 
    this.getWishListItems();
    this._PFS.emitWishListData().subscribe(x => {
      if (x) {
        this.getWishListItems();
      }
    });
    this._US.getUser().subscribe(data => {
      if (data) {
        if (data && data.fullName) {
          this.userName = data.fullName;
          var lastSavedCart = []
          lastSavedCart =   JSON.parse(localStorage.getItem("lastSavedCart"))
          if(lastSavedCart != null  && lastSavedCart.length != 0){
            this.cartDataLength =lastSavedCart.length.toString()
            for(let i=0; i<lastSavedCart.length; i++){
              const cartData = {
                categoryId: lastSavedCart[i].categoryId,
                vendorId: lastSavedCart[i].vendorId,
                productId: lastSavedCart[i].productId,
                selectQuantity: lastSavedCart[i].selectQuantity,
                subCategoryId: lastSavedCart[i].subCategoryId,
                variantId: lastSavedCart[i].variantId,
                personalisedMessage: lastSavedCart[i].personalisedMessage,
                cardType : lastSavedCart[i].cardType,
                giftTo : lastSavedCart[i].giftTo,
                giftFrom :lastSavedCart[i].giftFrom
              };
              this._CS.addToCart(cartData).subscribe(
                (data: any) => {
                if(i== (lastSavedCart.length -1)){
                  lastSavedCart = []
                  this.globalSrv.theItem = lastSavedCart.length.toString()
                   localStorage.setItem("lastSavedCart" , JSON.stringify(lastSavedCart))
                  this.getCartItems()
                }
                },
              )
            }
          }else {
          this.getCartItems();
        }
        }
      }
    });
    this._US.getAuth().subscribe(data => {
      this.isLoggedIn = data;
    });
  }
 async redirectToProductPage(categorySlug : string) {
  await  localStorage.setItem("currentPageNumber","1")
      this.router.navigateByUrl("/products/"+categorySlug);
  }
  getWishListItems() {
    this._US.getAuth().subscribe(res => {
      if (res) {
        this._PFS.getWishList().subscribe(
          (data: any) => {
            if (data.meta.status) {
              this.wishLists = data.data;
            }
            else {
              this.wishLists = [];
            }
          }
        )
      }
    })

  }

  getCartItems() {
    this._US.getAuth().subscribe(res => {
      if (res) {
        this._CS.getCartProducts().subscribe(
          
          (data: any) => {
            console.log("data : "+JSON.stringify(data))
            if (data.meta.status) {
              this.carts = data.data;
              this.Cgst=data.cgst;
              this.Igst=data.igst;
              localStorage.setItem("totalCartCount" , data.data.length.toString())
              this.deliveryCharges = data.deliveryCharge;
              this.convenienceFee = data.convenienceFee;
              this.cartSum = data.subTotal;
              this.total = data.grandTotal;
              this.totalDiscount = data.discount;
            }
            else {
              this.carts = [];
              this.deliveryCharges = 0;
              localStorage.setItem("totalCartCount" , "0")
              this.convenienceFee = 0;
              this.cartSum = 0;
              this.total = 0;
              this.totalDiscount = 0;
              console.log("data.meta.msg : "+data.meta.msg)
              if(data.meta.msg == "Session Expired."){
                this.logout()
              }
            }
          }
        )
      }
    })
  }

  removeFromCart(cartId: string) {
    this._CS.removeFromCart(cartId).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
        }
        else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    );
  }
  categories_title() {
    $(".categories_title").on("click", function () {
      $(this).toggleClass('active');
      $('.categories_menu_toggle').slideToggle('fast');
    });
    $(document).mouseup(function (e) {
      var container = $(".categories_menu");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('.categories_menu_toggle').hide();
      }
    });
  }

  getAllGroups(shopName) {
    this._SS.getAllGroups(shopName).subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.groupsData = data.data;
          this.categories_title();
          this._SS.updateGroups(this.groupsData);
        }
        else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    )
  }

  onKeydown(e) {
    if (!this.searchKey) {
      return alert("Please Provide Search Key");
    }
    else {
      this.closeSideBar();
      this.router.navigate(['/userprofile/search'], { queryParams: { search: this.searchKey } });
    }
  }

  logout() {
    let getCurrentUser=JSON.parse(localStorage.getItem('currentUser'))
    if(getCurrentUser.loginType==='google'){
 
      // this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
      this.carts = [];
      this._US.updateUser(false, null);
      localStorage.removeItem('currentUser');
      location.reload()
      // this.router.navigate(['/userprofile/login']);
    }
    else{
    this._SS.logout().subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.alertMessage({ type: "success", title: "Success", value: data.meta.msg });
          this.carts = [];
          this._US.updateUser(false, null);
          localStorage.removeItem('currentUser');
          this.router.navigate(['/userprofile/login']);
        }
        else {
          this.alertMessage({ type: "danger", title: "Error Occured", value: data.meta.msg });
        }
      }
    )
    }
  }

  closeSideBar() {
    $('.Offcanvas_menu_wrapper,.off_canvars_overlay').removeClass('active');
  }
  getAddr(data){
    // console.log('data..',data);
  }
}
