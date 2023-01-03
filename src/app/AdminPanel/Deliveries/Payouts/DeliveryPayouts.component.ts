import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OrderStatus, StoreSearchCriteria, Store, Payout, PayoutSearchCriteria, PayoutVO } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-delivery-payouts',
  templateUrl: './DeliveryPayouts.component.html',
  styleUrls: ['./DeliveryPayouts.component.scss']
})
export class DeliveryPayoutsComponent extends BaseComponent implements OnInit {


  s
  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || +params.id === 0) {
        setTimeout(() => {
          
        }, 500);
      } else {
        
      }
    });

  }
}
