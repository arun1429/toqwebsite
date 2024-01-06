import { Component, OnInit } from '@angular/core';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(private updateMetaTagSrv:MetakeywordsService,private seoService: SEOService) { }

  ngOnInit(): void {
    this.updateMetaTagSrv.getSeoContent('FAQ').subscribe(
      (data: any) => {
        if (data.meta.status) {
          this.updateMetaTagSrv.updateMetaKeywords(data.data.title,data.data.description,data.data.keywords)
        }
      }
    )
    this.seoService.updateCanonicalUrl('https://toq.co.in/faq')
  }

}
