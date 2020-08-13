import { Component, OnInit, Input } from '@angular/core';
import { MarketingDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'embryo-lightening-deals',
  templateUrl: './LighteningDeals.component.html',
  styleUrls: ['./LighteningDeals.component.scss']
})
export class LighteningDealsComponent implements OnInit {

  @Input() lighteningDeals: MarketingDescription[] = [];

  constructor(public appService: AppService, public translate: TranslateService) { }

  ngOnInit() {
  }

}
