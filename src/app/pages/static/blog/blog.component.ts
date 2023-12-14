import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BlogService } from "./blog.service";
// import { MetakeywordsService } from '../_services/metakeywords.service';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogsData: any = []
  constructor(
    private _PS: BlogService,
    private routes: ActivatedRoute
    // ,private updateMetaTagSrv:MetakeywordsService
  ) {
    
  }

  ngOnInit(): void {
    this.getBlogs();
    // this.updateMetaTagSrv.getSeoContent('Blogs').subscribe(
    //   (data: any) => {
    //     if (data.meta.status) {
    //       this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords)
    //     }
    //   }
    // )
  }

  getBlogs() {
    this._PS.getBlogs().subscribe((data: any) => {
      if (data.meta.status) {
        this.blogsData = data.data;
      } else {
      }
    });
  }
}