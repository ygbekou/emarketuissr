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
  onlineOrdersColumns: string[] = ['id', 'customer', 'status', 'total', 'city', 'country', 'dateAdded', 'dateModified'];
  storeOrdersColumns: string[] = ['transid', 'date', 'type', 'amount', 'balance', 'status'];

  onlineDS: MatTableDataSource<Order>;
  @ViewChild('MatPaginatorO', { static: true }) onlinePG: MatPaginator;
  @ViewChild(MatSort, { static: true }) onlineST: MatSort;

  storeDS: MatTableDataSource<TabHdr>;
  @ViewChild('MatPaginatorS', { static: true }) storePG: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeST: MatSort;
  messages = '';
  button = 'filter';
  @Input() userId: number;
  searchCriteria: OrderSearchCriteria;
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  orderStatuses: OrderStatus[];
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.searchCriteria = new OrderSearchCriteria();
    this.searchCriteria.orderType = 0;
    this.searchCriteria.userId = this.userId;
    this.searchCriteria.langId = this.appService.appInfoStorage.language.id;
    this.getStores();
    this.search();
    this.getOrderStatuses();
  }


  changeOrderType(event) {
    this.searchCriteria.orderType = event.index;
    this.search();

  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  getOrderStatuses() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |langCode|' + this.appService.appInfoStorage.language.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.OrderStatus', parameters)
      .subscribe((data: OrderStatus[]) => {
        this.orderStatuses = data;
      },
        error => console.log(error),
        () => console.log('Get all OrderStatus complete'));
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.searchCriteria = new OrderSearchCriteria();
      this.searchCriteria.orderType = 0;
    } else {

      if (this.searchCriteria.orderType === 0) {
        this.appService.saveWithUrl('/service/order/orders', this.searchCriteria)
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
