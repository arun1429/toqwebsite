import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NewarrivalProductsService {

  constructor(private http: HttpClient) { }

  getAllLatestProducts(shopName){
    const url = `${environment.apiUrl}products/latestarrivalbyvendor?shopName=`+shopName+'&requestCount=1000';
    return this.http.get(url);
  }

}
