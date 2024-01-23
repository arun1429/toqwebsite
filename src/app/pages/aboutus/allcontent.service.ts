import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AllContentService {

  constructor(private http: HttpClient) { }
  getAllContent(shopName) {
    const url = `${environment.apiUrl}contactinfo/allwebcontent?shopName=`+shopName;
    return this.http.get(url);
  }
}


