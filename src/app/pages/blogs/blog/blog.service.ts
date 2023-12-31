import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }
  getBlogs() {
    const url = `${environment.apiUrl}blogs/listweb/`;
    return this.http.get(url);
  }
   
  getPortfolioList() {
    const url = `${environment.apiUrl}portfolios/listweb`;
    return this.http.get(url);
  }

}


