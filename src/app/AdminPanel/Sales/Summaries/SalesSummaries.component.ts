import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OrderStatus, StoreSearchCriteria, Store, SalesSummary, SalesSummarySearchCriteria } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

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
  salesSummariesColumns: string[] = ['storeName', 'monthyear', 'paymentMethod', 'total', 'taxFees', 'shippingCost', 'processingFees', 'totalPaid', 'totalDue', 'status'];
  salesSummariesDatasource: MatTableDataSource<SalesSummary>;
  @ViewChild('MatPaginatorSalesSummaries', { static: true }) salesSummariesPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) salesSummariesSort: MatSort;

  expandedElement: SearchResponse | null;
  messages = '';
  button = 'filter';

  @Input()
  userId: number;

  searchCriteria: SalesSummarySearchCriteria = new SalesSummarySearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  paymentMethods: OrderStatus[];
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  allStore = new Store();

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.clear();
    this.getStores();
  }


  ngAfterViewInit() {
    this.searchCriteria.status = 0;
    this.searchCriteria.storeId = 0;
    this.search();
  }

  private clear() {
    this.searchCriteria.userId = this.userId;
    this.searchCriteria = new SalesSummarySearchCriteria();
  }

  changeOrderType(event) {
    this.search();

  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = this.userId;
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

}
