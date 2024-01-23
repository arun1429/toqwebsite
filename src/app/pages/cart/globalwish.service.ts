import {BehaviorSubject} from 'rxjs';   
import { Injectable } from '@angular/core';
@Injectable({providedIn: 'root'})
export class GlobalWishService {
 itemValue = new BehaviorSubject(this.theItem);

 set theItem(value) {
    this.itemValue.next(value);
    localStorage.setItem('wishCount', value);
 }

 get theItem() {
   return localStorage.getItem('wishCount');
 }
}