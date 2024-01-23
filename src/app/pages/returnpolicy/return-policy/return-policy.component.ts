import { Component, OnInit } from '@angular/core';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
import { AllContentService } from '../../aboutus/allcontent.service';
@Component({
  selector: 'app-return-policy',
  templateUrl: './return-policy.component.html',
  styleUrls: ['./return-policy.component.css']
})
export class ReturnPolicyComponent implements OnInit {

  constructor(private updateMetaTagSrv:MetakeywordsService,private seoService: SEOService, private allContent :AllContentService) { }
  allContentDetails: any;
  shopName: string;
  ngOnInit(): void {
    this.shopName = "TOQ"
    this.shopName  = localStorage.getItem("shopName")
    this.getContactDetails();
    this.seoService.updateCanonicalUrl('https://toq.co.in/return-policy')
    this.updateMetaTagSrv.getSeoContent('Terms & Conditions').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords,"https://toq.co.in/return-policy"+data.categorySlug,data.data.imageUrl)
        }
      }
  )  
}
getContactDetails() {
  this.allContent.getAllContent(this.shopName).subscribe(
    (data: any) => {
      if (data.meta.status) {
        this.allContentDetails = data.data;
      }
    }
  )
}
}
