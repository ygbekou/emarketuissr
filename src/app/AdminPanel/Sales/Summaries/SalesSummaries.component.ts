import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OrderStatus, StoreSearchCriteria, Store, SalesSummary, SalesSummarySearchCriteria, Payout } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { SalesSummaryComponent } from './SalesSummary.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-sales-summaries',
  templateUrl: './SalesSummaries.component.html',
  styleUrls: ['./SalesSummaries.component.scss']
})
export class SalesSummariesComponent extends BaseComponent implements OnInit {
  salesSummariesColumns: string[] = ['storeName', 'monthyear', 'total', 'processingFees', 'totalDue', 'totalPaid', 'status', 'actions'];
  salesSummariesDatasource: MatTableDataSource<SalesSummary>;
  @ViewChild('MatPaginatorSalesSummaries', { static: true }) salesSummariesPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) salesSummariesSort: MatSort;

  @ViewChild(SalesSummaryComponent, { static: false }) salesSummaryComponent: SalesSummaryComponent;
  expandedElement: SearchResponse | null;
  messages = '';
  button = 'filter';

  @Input()
  userId: number;
  @Input() isAdminPage = false;

  searchCriteria: SalesSummarySearchCriteria = new SalesSummarySearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  paymentMethods: OrderStatus[];
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  allStore = new Store();
  selected = new FormControl(0);

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.clear();
    this.getStores();


    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });
  }


  ngAfterViewInit() {
    this.searchCriteria.storeId = 0;
    this.searchCriteria.endDate = new Date();
    const beginDate = new Date();
    beginDate.setFullYear(this.searchCriteria.endDate.getFullYear() - 1);
    this.searchCriteria.beginDate = beginDate;

    if (this.isAdminPage) {
      this.searchCriteria.status = 1;
    }
   

    this.search();
  }

  private clear() {
    this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.searchCriteria = new SalesSummarySearchCriteria();
  }

  changeOrderType(event) {
  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

       this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
      this.appService.saveWithUrl('/service/order/salesSummaries', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.salesSummariesDatasource = new MatTableDataSource(data);
          this.salesSummariesDatasource.paginator = this.salesSummariesPaginator;
          this.salesSummariesDatasource.sort = this.salesSummariesSort;
        },
          error => console.log(error),
          () => console.log('Get all sales summaries complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.salesSummariesDatasource.filter = filterValue.trim().toLowerCase();
    if (this.salesSummariesDatasource.paginator) {
      this.salesSummariesDatasource.paginator.firstPage();
    }

  }


  acknowledgeSalesSummary(ssId: number) {
    this.messages = '';
    const ss = new SalesSummary();
    ss.id = ssId;
    ss.acknowledger.id = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/order/acknowledgeSalesSummary/', ss)
      .subscribe((data: Payout) => {
        this.processResult(data, ss, null);
        this.search();
      },
        error => console.log(error),
        () => console.log('Aknowledgement complete'));
  }


  getSalesSummaryDetails(salesSummaryId: number, payoutId: number) {
    this.salesSummaryComponent.getSalesSummary(salesSummaryId);
    this.salesSummaryComponent.getPayout(payoutId);
    this.selected.setValue(1);
  }

}
