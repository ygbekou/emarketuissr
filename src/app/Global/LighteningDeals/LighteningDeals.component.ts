import { Component, OnInit, Input } from '@angular/core';
import { MarketingDescription } from 'src/app/app.models';

@Component({
  selector: 'embryo-lightening-deals',
  templateUrl: './LighteningDeals.component.html',
  styleUrls: ['./LighteningDeals.component.scss']
})
export class LighteningDealsComponent implements OnInit {

  @Input() lighteningDeals: MarketingDescription[] = [];

  constructor() { }

  ngOnInit() {
  }

}
