import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-seller-bills',
  templateUrl: './SellerBills.component.html',
  styleUrls: ['./SellerBills.component.scss']
})
export class SellerBillsComponent extends BaseComponent implements OnInit {
 
  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {

  }

}
