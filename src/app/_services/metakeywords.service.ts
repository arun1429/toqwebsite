import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MetakeywordsService {

  constructor(private titleService: Title, private metaService: Meta,private http:HttpClient) { }

  getSeoContent(page:any){
    const url=`${environment.apiUrl}seodataweb/seocontent?page=${page}`
    return this.http.get(url);
  }


  getContent(id:any){
    const url=`${environment.apiUrl}/seodataweb/getseowebcontentid?id=${id}`
    // /getseowebcontentid?id=
    return this.http.get(url);
  }

  updateMetaKeywords(title: string,description: string,keywords: string){
    this.titleService.setTitle(title);
    this.metaService.updateTag(
      { name: 'description', content: description }
    );
    this.metaService.updateTag(
      { name: 'keywords', content: keywords }
    );
  }
}
