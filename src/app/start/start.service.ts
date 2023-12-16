import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StartService {

  private group = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  getAllStores() {
    const url = `${environment.apiUrl}store/list`;
    return this.http.get(url);
  }

  getAllGroups(shopName) {
    const url = `${environment.apiUrl}categories/listallcategoryforvendor?shopName=`+shopName;
    return this.http.get(url);
  }


  changeStore() {
    const url = `${environment.apiUrl}cart/change/store`;
    return this.http.get(url);
  }

  logout() {
    const url = `${environment.apiUrl}users/logout`;
    return this.http.post(url, {});
  }

  contactUs(contactData: any) {
    const url = `${environment.apiUrl}contactus`;
    return this.http.post(url, contactData);
  }

  getGroups(): Observable<any> {
    return this.group.asObservable();
  }

  updateGroups(group: any) {
    this.group.next(group);
  }

  getContactDetails(shopName) {
    const url = `${environment.apiUrl}vendor/vendordetailsforshop?shopName=`+shopName;
    return this.http.get(url);
  }
  getSocialMediaDetails(shopName) {
    const url = `${environment.apiUrl}vendor/socialmediaforshop?shopName=`+shopName;
    return this.http.get(url);
  }
}
