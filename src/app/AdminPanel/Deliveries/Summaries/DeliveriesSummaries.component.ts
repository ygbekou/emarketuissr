import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OrderStatus, StoreSearchCriteria, Store, SalesSummary, SalesSummarySearchCriteria, Payout, DeliveriesSummary, Shipper } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { DeliveriesSummaryComponent } from './DeliveriesSummary.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-deliveries-summaries',
  templateUrl: './DeliveriesSummaries.component.html',
  styleUrls: ['./DeliveriesSummaries.component.scss']
})
export class DeliveriesSummariesComponent extends BaseComponent implements OnInit {
  deliveriesSummariesColumns: string[] = ['shipperName', 'monthyear', 'paymentMethod', 'total', 'totalDue', 'totalPaid', 'totalRemaining', 'status', 'actions'];
  deliveriesSummariesDatasource: MatTableDataSource<DeliveriesSummary>;
  @ViewChild('MatPaginatorDeliveriesSummaries', { static: true }) deliveriesSummariesPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) deliveriesSummariesSort: MatSort;

  @ViewChild(DeliveriesSummaryComponent, { static: false }) deliveriesSummaryComponent: DeliveriesSummaryComponent;
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
  shippers: Shipper[] = [];
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
    this.isAdminPage = !this.userId
  }

  ngAfterViewInit() {
    this.searchCriteria.storeId = 0;
    this.searchCriteria.endDate = new Date();
    const beginDate = new Date();
    beginDate.setFullYear(this.searchCriteria.endDate.getFullYear() - 1);
    this.searchCriteria.beginDate = beginDate;
    if (this.isAdminPage) {
      //this.searchCriteria.status = 1;
    }
    this.search();
  }

  private clear() {
    this.searchCriteria = new SalesSummarySearchCriteria();
  }

  changeOrderType(event) {
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

      this.searchCriteria.userId = this.userId;
      this.appService.saveWithUrl('/service/order/deliveriesSummaries', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.deliveriesSummariesDatasource = new MatTableDataSource(data);
          this.deliveriesSummariesDatasource.paginator = this.deliveriesSummariesPaginator;
          this.deliveriesSummariesDatasource.sort = this.deliveriesSummariesSort;
        },
          error => console.log(error),
          () => console.log('Get all deliveries summaries complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.deliveriesSummariesDatasource.filter = filterValue.trim().toLowerCase();
    if (this.deliveriesSummariesDatasource.paginator) {
      this.deliveriesSummariesDatasource.paginator.firstPage();
    }

  }


  acknowledgeDeliveriesSummary(ssId: number) {
    this.messages = '';
    const ds = new DeliveriesSummary();
    ds.id = ssId;
    ds.acknowledger.id = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/order/acknowledgeDeliveriesSummary/', ds)
      .subscribe((data: Payout) => {
        this.processResult(data, ds, null);
        this.search();
      },
        error => console.log(error),
        () => console.log('Aknowledgement complete'));
  }


  getDeliveriesSummaryDetails(ddeliveriesSummaryId: number, payoutId: number) {
    this.deliveriesSummaryComponent.getDeliveriesSummary(ddeliveriesSummaryId);
    this.deliveriesSummaryComponent.getPayout(payoutId);
    this.selected.setValue(1);
  }


  public getShipperSearchPopupResponse(response: any, value: any) {
    if (response) {
      console.log('Value returned from comment popup... ');
      console.log(value);
      this.searchCriteria = value;
    }
  }

  openSearchPopup() {
    this.appService.shipperSearch(this.searchCriteria).
      subscribe(res => {

        console.log(res);
      },
        err => console.log(err),
        () => console.log('Shipper search done... ')
      );

  }

}
