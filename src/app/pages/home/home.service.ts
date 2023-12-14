import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  emittedValue = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  getVendorGroups(shopName) {
    const url = `${environment.apiUrl}categories/group/listvendor?shopName=`+shopName;
    return this.http.get(url);
  }
  getVendorBanners(shopName) {
    const url = `${environment.apiUrl}banner/vendorbannerlist?shopName=`+shopName;
    return this.http.get(url);
  }
  getVendorBestProducts(shopName) {
    const url = `${environment.apiUrl}products/bestsellerbyvendor?shopName=`+shopName;
    return this.http.get(url);
  }
  getProducts(shopName) {
    const url = `${environment.apiUrl}products/list`;
    return this.http.get(url);
  }

  getVendorLatestProducts(shopName){
    const url = `${environment.apiUrl}products/latestarrivalbyvendor?shopName=`+shopName;
    return this.http.get(url);
  }
  getVendorSalesProducts(shopName){
    const url = `${environment.apiUrl}products/salesproductsbyvendor?shopName=`+shopName;
    return this.http.get(url);
  }
  
  getLatestProducts(storeId: string) {
    const url = `${environment.apiUrl}products/recent?storeId=${storeId}`;
    return this.http.get(url);
  }
  removeFromCart(cartId: string) {
    const url = `${environment.apiUrl}cart/delete?cartId=${cartId}`;
    return this.http.delete(url).pipe(
      tap(
        (res: any) => {
          if (res.meta.status) {
            this.emittedValue.next(true);
          }
        }
      )
    );
  }

  addToCart(cartData) {
    const url = `${environment.apiUrl}cart/add`;
    return this.http.post(url, cartData).pipe(
      tap((res: any) => {
        if (res.meta.status) {
          this.emittedValue.next(true);
        }
      })
    );
  }

  emitCardData(): Observable<boolean> {
    return this.emittedValue.asObservable();
  }

  getCartProducts() {
    const url = `${environment.apiUrl}cart/list`;
    return this.http.get(url);
  }

  applyPromocode(discountName: string) {
    const url = `${environment.apiUrl}cart/applypromocode?discountName=${discountName}`;
    return this.http.post(url, {});
  }

  removePromocode() {
    const url = `${environment.apiUrl}cart/promocode`;
    return this.http.delete(url);
  }

  getAllPromocode(vendorId: string) {
    const url = `${environment.apiUrl}banner/getpromocode?vendorId=${vendorId}`;
    return this.http.get(url);
  }

  addAddress(body) {
    const url = `${environment.apiUrl}address/add`;
    return this.http.post(url, body);
  }

  editAddress(body) {
    const url = `${environment.apiUrl}address/update`;
    return this.http.put(url, body);
  }

  getStates() {
    return this.http.get("assets/state_district.json");
  }

  getAddress() {
    const url = `${environment.apiUrl}address/list`;
    return this.http.get(url);
  }

  placeOrder(body) {
    const url = `${environment.apiUrl}order/placeorder`;
    return this.http.post(url, body);
  }
  deleteAddress(addressId) {
    const url = `${environment.apiUrl}address/delete/${addressId}`;
    return this.http.delete(url);
  }
  getProductDetailsByVariantId(variantId, selectedQty) {
    const url = `${environment.apiUrl}products/getvariantdetails?variantId=${variantId}&selectedQuantity=${selectedQty}`;
    return this.http.get(url);
  }

  getPromoCodes() {
    const url = `${environment.apiUrl}banner/getpromocode`;
    return this.http.get(url);
  }

  updateQuantity(productId, variantId, quantity, cartId) {
    const body = {
      productId: productId,
      variantId: variantId,
      selectQuantity: quantity,
      cartId: cartId
    };
    const url = `${environment.apiUrl}cart/update/quantity`;
    return this.http.post(url, body)
  }

  cartValidate(addressId: string) {
    const url = `${environment.apiUrl}cart/validate/list?addressId=${addressId}`;
    return this.http.get(url);
  }
  sendOtp(loginData: any) {
    const url = `${environment.apiUrl}users/sendotp`;
    return this.http.post(url, loginData);
  }
  
  login(loginData: any) {
    const url = `${environment.apiUrl}users/login`;
    return this.http.post(url, loginData);
  }

  otpVerify(otpData: any) {
    const url = `${environment.apiUrl}users/verifyotp`;
    return this.http.post(url, otpData);
  }

  socialLogin(obj){
    const url=`${environment.apiUrl}users/social/login`
    return this.http.post(url,obj)
  }
  register(registerData: any) {
    const url = `${environment.apiUrl}users/signup`;
    return this.http.post(url, registerData);
  }
  searchProduct(searchKey:string) {
    const url = `${environment.apiUrl}products/search?searchKey=${searchKey}`;
    return this.http.get(url);
  }

}
