import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-order-detail',
  templateUrl: './Order-detail.component.html',
  styleUrls: ['./Order-detail.component.scss']
})
export class OrderDetailComponent extends BaseComponent implements OnInit {

  messages: string;
  public sidenavOpen = true;

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {

  }

}
