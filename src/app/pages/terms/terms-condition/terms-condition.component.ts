import { Component, OnInit } from '@angular/core';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
import { AllContentService } from '../../aboutus/allcontent.service';
@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.css']
})
export class TermsConditionComponent implements OnInit {

  constructor(private updateMetaTagSrv:MetakeywordsService,private seoService: SEOService, private allContent :AllContentService) { }
  allContentDetails: any;
  shopName: string;
  ngOnInit(): void {
    this.shopName = "TOQ"
    this.shopName  = localStorage.getItem("shopName")
    this.getContactDetails();
    this.seoService.updateCanonicalUrl('https://toq.co.in/terms-conditions')
    this.updateMetaTagSrv.getSeoContent('Terms & Conditions').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords,"https://toq.co.in/terms-conditions"+data.categorySlug,data.data.imageUrl)
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
