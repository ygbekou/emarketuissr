import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Order, OrderProduct, TabHdr, TabDtl, Store, Currency } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';

@Component({
  selector: 'app-orders-overview',
  templateUrl: './OrderView.component.html',
  styleUrls: ['./Orders.component.scss']
})
export class OrderViewComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['product', 'quantity', 'price', 'total'];
  displayedShippingColumns = ['shippingRateTitle', 'emptyFooter1', 'emptyFooter2', 'shippingAmount'];
  displayedTaxesColumns = ['taxes', 'emptyFooter7', 'emptyFooter8', 'taxAmount'];
  displayedTotalColumns = ['totalAmountTitle', 'emptyFooter4', 'emptyFooter5', 'totalAmount'];

  onlineDS: MatTableDataSource<OrderProduct>;
  @ViewChild('MatPaginatorO', { static: true }) onlinePG: MatPaginator;
  @ViewChild(MatSort, { static: true }) onlineST: MatSort;

  storeDS: MatTableDataSource<TabDtl>;
  @ViewChild('MatPaginatorS', { static: true }) storePG: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeST: MatSort;
  messages = '';

  @Input() userId: number;

  @Input()
  order: Order;
  store: Store = new Store();
  storeOrder: TabHdr = new TabHdr();
  constants: Constants = new Constants();
  orderType = 'o';
  deviceInfo = null;
  canEdit = false;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      const paramId: string = params.id;
      if (params.id === undefined || params.id === '0') {
        this.clear();
      } else {
        this.clear();
        this.orderType = paramId.charAt(0);
        if (paramId.charAt(0) === 'o') {
          this.getOrder(Number(paramId.substring(1)));
        } else if (paramId.charAt(0) === 's') {
          this.getStoreOrder(Number(paramId.substring(1)));
        }

      }
    });


  }

  public setCanEdit() {
    console.log('current user id:' + this.appService.tokenStorage.getUserId());
    console.log('store owner:' + this.store.owner.id);
    console.log('Role:' + this.appService.tokenStorage.getRole());
    if (Number(this.appService.tokenStorage.getUserId()) === this.store.owner.id ||
      Number(this.appService.tokenStorage.getRole()) === 3) { // this is the store owner
      this.canEdit = true;
    } else {
      this.canEdit = false;
    }
  }

  clear() {
    this.order = new Order();
    this.storeOrder = new TabHdr();
    this.store = new Store();
    this.store.currency = new Currency();
  }

  public getStoreOrder(id: number) {
    const parameters: string[] = [];
    parameters.push('e.id = |stta|' + id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.TabHdr', parameters,
      ' ')
      .subscribe((data: TabHdr[]) => {
        this.storeOrder = data[0];
        this.getStore(this.storeOrder.storeId);
        this.setStoreOrderDetails();
      },
        (error) => console.log(error),
        () => console.log('Get all Open tabs complete'));
  }

  public getStore(id: number) {
    const parameters: string[] = [];
    parameters.push('e.id = |stta|' + id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.Store', parameters,
      ' ')
      .subscribe((data: Store[]) => {
        this.store = data[0];
        this.setCanEdit();
      },
        (error) => console.log(error),
        () => console.log('Get Store complete'));
  }
  public setStoreOrderDetails() {
    const parameters: string[] = [];
    parameters.push('e.tabId = |tId|' + this.storeOrder.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.TabDtl', parameters)
      .subscribe((data: TabDtl[]) => {
        if (data && data.length > 0) {
          this.storeOrder.tabDtls = data;
          this.storeDS = new MatTableDataSource(this.storeOrder.tabDtls);
          this.storeDS.paginator = this.storePG;
          this.storeDS.sort = this.storeST;
        }
      },
        (error) => console.log(error),
        () => console.log('Get all TabDtl  complete'));

  }

  getOrder(orderId: number) {
    if (orderId > 0) {
      this.appService.getOneWithChildsAndFiles(orderId, 'Order')
        .subscribe(result => {
          if (result.id > 0) {
            this.order = result;
            this.getStore(this.order.storeId);
            this.order.orderOptionMap = {};
            this.order.orderOptions.forEach(item => {
              if (this.order.orderOptionMap[item.name] === undefined) {
                this.order.orderOptionMap[item.name] = [];
              }

              this.order.orderOptionMap[item.name].push(item);
            });

            this.onlineDS = new MatTableDataSource(this.order.orderProducts);
            this.onlineDS.paginator = this.onlinePG;
            this.onlineDS.sort = this.onlineST;
          } else {
            this.order = new Order();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  public applyFilter(filterValue: string) {
    if (this.orderType === 'o') {
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

  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';
    return val.length === 0;
  }

}
