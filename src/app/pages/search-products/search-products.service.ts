import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SearchProductsService {

  constructor(private http: HttpClient) { }

  searchProduct(searchKey:string) {
    const url = `${environment.apiUrl}products/search?searchKey=${searchKey}`;
    return this.http.get(url);
  }

}
