import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Order, OrderSearchCriteria, OrderStatus, TabHdr, StoreSearchCriteria, Store } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-orders',
  templateUrl: './Orders.component.html',
  styleUrls: ['./Orders.component.scss']
})
export class OrdersComponent extends BaseComponent implements OnInit {
  onlineOrdersColumns: string[] = ['id', 'storeName', 'customer', 'status', 'total', 'city', 'country', 'dateAdded'];
  storeOrdersColumns: string[] = ['id', 'storeName', 'cashier', 'status', 'amount', 'rebate', 'qty', 'date'];

  onlineDS: MatTableDataSource<Order>;
  @ViewChild('MatPaginatorO', { static: true }) onlinePG: MatPaginator;
  @ViewChild(MatSort, { static: true }) onlineST: MatSort;

  storeDS: MatTableDataSource<TabHdr>;
  @ViewChild('MatPaginatorS', { static: true }) storePG: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeST: MatSort;
  messages = '';
  fromAdmin = false;
  button = 'filter';
  @Input() userId: number;
  searchCriteria: OrderSearchCriteria;
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  orderStatuses: OrderStatus[];
  stores: Store[] = [];
  colors = ['primary', 'secondary'];
  selectedStore: Store;
  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    if (!(this.userId === undefined)) {
      this.fromAdmin = true;
    }
    this.clear();
    this.getStores();
    this.getOrderStatuses();
  }

  private clear() {
    this.messages = '';
    const oType = this.searchCriteria ? this.searchCriteria.orderType : 0;
    this.searchCriteria = new OrderSearchCriteria();
    this.searchCriteria.orderType = oType;
    this.searchCriteria.userId = this.userId;
    this.searchCriteria.langId = this.appService.appInfoStorage.language.id;
    this.searchCriteria.storeId = this.selectedStore ? this.selectedStore.id : 0;
    this.searchCriteria.beginDate = new Date();
    this.searchCriteria.endDate = new Date();
  }

  changeOrderType(event) {
    this.searchCriteria.orderType = event.index;
    this.search();

  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }
  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = this.userId;
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
        if (this.stores && this.stores.length > 0) {
          this.selectedStore = this.stores[0];
          this.storeSearchCriteria.storeId = this.stores[0].id;
          this.search();
        }
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  getOrderStatuses() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |langCode|' + this.appService.appInfoStorage.language.id + '|Integer');
    parameters.push('e.status = |staCode|1|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.OrderStatus', parameters)
      .subscribe((data: OrderStatus[]) => {
        this.orderStatuses = data;
      },
        error => console.log(error),
        () => console.log('Get all OrderStatus complete'));
  }

  search() {
    this.messages = '';
    console.log(this.searchCriteria);
    this.searchCriteria.storeId = this.selectedStore.id;
    const diff = Math.ceil((this.searchCriteria.endDate.getTime() - this.searchCriteria.beginDate.getTime()) / (1000 * 3600 * 24));
    console.log(diff);
    if (!(diff >= 0 && diff <= 30)) {
      this.translate.get(['VALIDATION.INVALID_DATE_RANGE', 'COMMON.ERROR']).subscribe(res => {
        this.messages = res['VALIDATION.INVALID_DATE_RANGE'];
      });
    } else if (this.button.endsWith('clear')) {
      this.clear();
    } else {

      if (this.searchCriteria.orderType === 0) {
        this.appService.saveWithUrl('/service/order/onlineOrders', this.searchCriteria)
          .subscribe((data: any[]) => {
            this.onlineDS = new MatTableDataSource(data);
            this.onlineDS.paginator = this.onlinePG;
            this.onlineDS.sort = this.onlineST;
          },
            error => console.log(error),
            () => console.log('Get all Orders complete'));

      } else {
        this.appService.saveWithUrl('/service/order/storeOrders', this.searchCriteria)
          .subscribe((data: any[]) => {
            this.storeDS = new MatTableDataSource(data);
            this.storeDS.paginator = this.storePG;
            this.storeDS.sort = this.storeST;
          },
            error => console.log(error),
            () => console.log('Get all Orders complete'));
      }
    }
  }

  public applyFilter(filterValue: string) {
    if (this.searchCriteria.orderType === 0) {
      this.onlineDS.filter = filterValue.trim().toLowerCase();
      if (this.onlineDS.paginator) {
        this.onlineDS.paginator.firstPage();
      }
    } else {
      this.storeDS.filter = filterValue.trim().toLowerCase();
      if (this.storeDS.paginator) {
        this.storeDS.paginator.firstPage();
      }
    }

  }

}
