import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SellingProductsService {

  constructor(private http: HttpClient) { }

  getVendorBestProducts(shopName) {
    const url = `${environment.apiUrl}products/bestsellerbyvendor?shopName=`+shopName+'&requestCount=1000';
    return this.http.get(url);
  }

}
