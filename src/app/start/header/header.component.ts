import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from "../../pages/home/home.service";
import { AlertService, UserService } from 'src/app/_services';
import { StartService } from "../start.service";
import { ProfileService } from '../../pages/profile/profile.service';
import { RootComponent } from '../../_shared/components/root/root.component';


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
  // cartDataLength: number = 0;
  wishLists: any = [];
  userName: string = 'Guest';
  isLoggedIn: boolean = false;

  constructor(
    public _AS: AlertService,
    private _SS: StartService,
    private _US: UserService,
    private _CS: HomeService,
    private router: Router,
    private _PFS: ProfileService) {
    super(_AS);
  }

  ngOnInit(): void {
    this.shopName = "TOQ"
    this.shopName  = localStorage.getItem("shopName")
    this.getAllGroups();
    this._CS.emitCardData().subscribe(x => {
      if (x) {
        this.getCartItems();
      }
    });
    this.getCartItems();
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
        }
      }
    });
    this._US.getAuth().subscribe(data => {
      this.isLoggedIn = data;
    });
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
    this.carts = [];
    this._US.getAuth().subscribe(res => {
      if (res) {
        this._CS.getCartProducts().subscribe(
          (data: any) => {
            if (data.meta.status) {
              this.carts = data.data;
              this.Cgst=data.cgst;
              this.Igst=data.igst;
              this.deliveryCharges = data.deliveryCharge;
              this.convenienceFee = data.convenienceFee;
              this.cartSum = data.subTotal;
              this.total = data.grandTotal;
              this.totalDiscount = data.discount;
              // this.cartTotal(this.carts);
              // this.cartDataLength = this.carts.length;
            }
            else {
              this.carts = [];
              this.deliveryCharges = 0;
              this.convenienceFee = 0;
              this.cartSum = 0;
              this.total = 0;
              this.totalDiscount = 0;
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

  // cartTotal(data) {
  //   this.total = 0;
  //   let actualPrice = 0;
  //   let discountedPrice = 0;
  //   this.cartSum = 0;
  //   for (let i = 0; i < data.length; i++) {
  //     this.cartSum = Number(this.cartSum) + Number(data[i].discountedPrice * data[i].selectQuantity);
  //     actualPrice = Number(actualPrice) + Number(data[i].price * data[i].selectQuantity);
  //     discountedPrice = Number(discountedPrice) + Number(data[i].discountedPrice * data[i].selectQuantity);
  //   }
  //   this.totalDiscount = Number(actualPrice) - Number(discountedPrice);
  //   this.total = Number(this.cartSum) + Number(this.deliveryCharges);
  // }

  // updateCartTotal() {
  //   let cartSum = 0;
  //   let total = 0;
  //   let actualPrice = 0;
  //   let discountedCost = 0;
  //   for (let i = 0; i < this.cartDataLength; i++) {
  //     const discountedPrice = this.carts[i].discountedPrice.toFixed(2);
  //     cartSum = Number(cartSum) + Number(this.carts[i].selectQuantity) * discountedPrice;
  //     actualPrice = Number(actualPrice) + Number(this.carts[i].price) * Number(this.carts[i].selectQuantity);
  //     discountedCost = Number(discountedCost) + Number(this.carts[i].discountedPrice * Number(this.carts[i].selectQuantity));
  //   }
  //   this.cartSum = cartSum;
  //   this.totalDiscount = Number(actualPrice) - Number(discountedCost);
  //   total = Number(total) + Number(this.cartSum) + Number(this.deliveryCharges);
  //   this.total = total;
  // }

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

  getAllGroups() {
    this._SS.getAllGroups(this.shopName).subscribe(
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
