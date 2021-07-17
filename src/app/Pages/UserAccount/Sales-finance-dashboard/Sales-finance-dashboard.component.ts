import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatStepper, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-sales-finance-dashboard',
  templateUrl: './Sales-finance-dashboard.component.html',
  styleUrls: ['./Sales-finance-dashboard.component.scss']
})
export class SalesFinanceDashboardComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  messages: string;
  public sidenavOpen = true;

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {

  }

}
