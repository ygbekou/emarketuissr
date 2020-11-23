import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Order, OrderStatus, OrderHistory } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-orderHistory',
  templateUrl: './OrderHistory.component.html',
  styleUrls: ['./Orders.component.scss']
})
export class OrderHistoryComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['dateAdded', 'comment', 'status', 'notified', 'actions'];
  dataSource: MatTableDataSource<OrderHistory>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  errors = '';
  orderStatuses: OrderStatus[];

  orderHistory: OrderHistory = new OrderHistory();

  @Input()
  orderId: number;

  constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

  ngOnInit() {
    this.orderHistory.order.id = this.orderId;
    this.getOrderStatuses();
    this.getOrderHistories();
  }

  getOrderStatuses() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.OrderStatus', parameters)
      .subscribe((data: OrderStatus[]) => {
        this.orderStatuses = data;
      },
        error => console.log(error),
        () => console.log('Get all OrderStatus complete'));
  }

  getOrderHistories() {
    const parameters: string[] = [];
    if (this.orderId !== null && this.orderId !== undefined) {
        parameters.push('e.order.id = |orderId|' + this.orderId + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.OrderHistory', parameters)
      .subscribe((data: OrderHistory[]) => {
        this.dataSource = new MatTableDataSource<OrderHistory>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all OrderHistory complete'));
  }

  edit(orderHistoryId: number) {
    if (orderHistoryId > 0) {
      this.appService.getOne(orderHistoryId, 'com.softenza.emarket.model.OrderHistory')
        .subscribe(result => {
          if (result.id > 0) {
            this.orderHistory = result;
          } else {
            this.orderHistory = new OrderHistory();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  public remove(orderHistoryId: number) {
    this.messages = '';
    this.appService.delete(orderHistoryId, 'OrderHistory')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.findIndex(element => element.id === orderHistoryId);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<OrderHistory>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
          });
        } else {
          this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.ERROR_OCCURRED'];
          });
        }
      });
  }


  save() {
    this.messages = '';
    this.errors = '';
    try {

      this.orderHistory.order.id = this.orderId;
      console.log(this.orderHistory);
      this.setToggleValues();
      const index: number = this.dataSource.data.findIndex(element => element.id === this.orderHistory.id);
      this.appService.save(this.orderHistory, 'OrderHistory')
        .subscribe(result => {
          if (result.id > 0) {
            this.orderHistory = new OrderHistory();
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<OrderHistory>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });

    } catch (e) {
      console.log(e);
    }
  }


  setToggleValues() {
    this.orderHistory.notify = (this.orderHistory.notify === null
      || this.orderHistory.notify.toString() === 'false'
      || this.orderHistory.notify.toString() === '0') ? 0 : 1;
  }

}
