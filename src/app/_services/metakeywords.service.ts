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
    const url=`${environment.apiUrl}seodataweb/seocontent?page=${page}&shopName=TOQ`
    return this.http.get(url);
  }


  getContent(id:any){
    const url=`${environment.apiUrl}/seodataweb/getseowebcontentid?id=${id}`
    // /getseowebcontentid?id=
    return this.http.get(url);
  }

  updateMetaKeywords(title: string,description: string,keywords: string,url : string,imageUrl: string ){
    this.titleService.setTitle(title);
    this.metaService.updateTag(
      { name: 'description', content: description }
    );
    this.metaService.updateTag(
      { name: 'keywords', content: keywords }
    );
    this.metaService.updateTag(
      { property: 'og:site_name', content: "TOQ" }
    );
    this.metaService.updateTag(
      { property: 'og:url', content: url }
    );
    this.metaService.updateTag(
      { property: 'og:title', content: keywords }
    );
    this.metaService.updateTag(
      { property: 'og:type', content: "website" }
    );
    this.metaService.updateTag(
      { property: 'og:description', content: description }
    );
    this.metaService.updateTag(
      { property: 'og:image', content: imageUrl }
    );
    this.metaService.updateTag(
      { property: 'og:image:secure_url', content: imageUrl }
    );
    this.metaService.updateTag(
      { property: 'og:image:width', content: "1920" }
    );
    this.metaService.updateTag(
      { property: 'og:image:height', content: "500" }
    );
    this.metaService.updateTag(
      { name: 'twitter:site', content : "@toq" }
    );
    this.metaService.updateTag(
      { property: 'twitter:card', content: "summary_large_image" }
    );
    this.metaService.updateTag(
      { property: 'twitter:title', content: keywords }
    );
    this.metaService.updateTag(
      { property: 'twitter:description', content: description }
    );
    this.metaService.updateTag(
      { property: 'google-site-verification', content: "Sg_Wrdlj_mKvHiSnIA6pKcur1Y3Zj0ksxe7ROtn6Lzc" }
    );
  }
}
