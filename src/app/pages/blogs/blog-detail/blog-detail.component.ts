import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BlogDetailsService } from "./blog-detail.service";
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blogId : any =""
  blogsData: any = ""
  constructor(
    private _PS: BlogDetailsService,
    private routes: ActivatedRoute ,private updateMetaTagSrv:MetakeywordsService,private seoService: SEOService
  ) {
    
  }

  ngOnInit(): void {
    this.routes.params.subscribe((data: any)  => {
      console.log("data :"+JSON.stringify(data))
      console.log("blogId :"+ data.blogId)
      this.blogId = data.blogId;
      this.getBlogDetails();
      this.seoService.updateCanonicalUrl('https://toq.co.in/blogs/'+data.blogId)
      this.updateMetaTagSrv.getSeoContent(data.blogId).subscribe(
        (data: any) => {
          if (data.meta.status) {
            this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords)
          }
        }
      )

    });
   
  }

  getBlogDetails() {
    this._PS.getBlogDetails(this.blogId).subscribe((data: any) => {
      if (data.meta.status) {
        this.blogsData = data.data;
        // this.updateMetaTagSrv.getSeoContent(this.blogsData.blogsTitle).subscribe(
        //   (data: any) => {
        //     if (data.meta.status) {
        //       this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords)
        //     }
        //   }
        // )
      } else {
      }
    });
  }
}