import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Order, OrderProduct, TabHdr, TabDtl } from 'src/app/app.models';
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
  displayedColumns: string[] = ['product', 'model', 'quantity', 'price', 'total'];
  displayedShippingColumns = ['shippingRateTitle', 'emptyFooter1', 'emptyFooter2', 'emptyFooter3', 'shippingAmount'];
  displayedTotalColumns = ['totalAmountTitle', 'emptyFooter4', 'emptyFooter5', 'emptyFooter6', 'totalAmount'];

  dataSource: MatTableDataSource<OrderProduct>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';

  @Input() userId: number;

  @Input()
  order: Order;

  storeOrder: TabHdr = new TabHdr();
  constants: Constants = new Constants();

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
        if (paramId.charAt(0) === 'o') {
          this.getOrder(Number(paramId.substring(1)));
        } else if (paramId.charAt(0) === 's') {
          this.getStoreOrder(Number(paramId.substring(1)));
        }

      }
    });
  }

  clear() {
    this.order = new Order();
    this.storeOrder = new TabHdr();
  }

  public getStoreOrder(id: number) {
    const parameters: string[] = [];
    parameters.push('e.id = |stta|' + id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.TabHdr', parameters,
      ' ')
      .subscribe((data: TabHdr[]) => {
        this.storeOrder = data[0];
        this.setStoreOrderDetails();
      },
        (error) => console.log(error),
        () => console.log('Get all Open tabs complete'));
  }

  public setStoreOrderDetails() {
    const parameters: string[] = [];
    parameters.push('e.tabId = |tId|' + this.storeOrder.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.TabDtl', parameters)
      .subscribe((data: TabDtl[]) => {
        if (data && data.length > 0) {
          this.storeOrder.tabDtls = data;
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
            this.dataSource = new MatTableDataSource(this.order.orderProducts);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }
}
