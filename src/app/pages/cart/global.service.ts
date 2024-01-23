import {BehaviorSubject} from 'rxjs';   
import { Injectable } from '@angular/core';
@Injectable({providedIn: 'root'})
export class GlobalService {
 itemValue = new BehaviorSubject(this.theItem);

 set theItem(value) {
    this.itemValue.next(value);
    localStorage.setItem('cartCount', value);
 }

 get theItem() {
   return localStorage.getItem('cartCount');
 }
}