import { Component, OnInit } from '@angular/core';
import { MetakeywordsService } from '../../../_services/metakeywords.service';
import { SEOService } from '../../../_services/seo.service';
@Component({
  selector: 'app-return-policy',
  templateUrl: './return-policy.component.html',
  styleUrls: ['./return-policy.component.css']
})
export class ReturnPolicyComponent implements OnInit {

  constructor(private updateMetaTagSrv:MetakeywordsService,private seoService: SEOService) { }

  ngOnInit(): void {
    this.seoService.updateCanonicalUrl('https://toq.co.in/return-policy')
  }

}
