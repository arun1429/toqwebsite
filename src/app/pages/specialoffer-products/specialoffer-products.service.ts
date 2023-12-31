import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SpecialOfferProductsService {

  constructor(private http: HttpClient) { }

  getVendorSalesProducts(shopName){
    const url = `${environment.apiUrl}products/salesproductsbyvendor?shopName=`+shopName+'&requestCount=1000';
    return this.http.get(url);
  }

}
