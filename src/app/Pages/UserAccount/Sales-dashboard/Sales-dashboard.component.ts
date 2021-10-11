import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatStepper, MatPaginator, MatSort } from '@angular/material';
import { StoreSearchCriteria, Store } from 'src/app/app.models';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './Sales-dashboard.component.html',
  styleUrls: ['./Sales-dashboard.component.scss']
})
export class SalesDashboardComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  messages: string;
  public sidenavOpen = true;

  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.getStores();
  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.appService.appInfoStorage.STORES = data;
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }
}
