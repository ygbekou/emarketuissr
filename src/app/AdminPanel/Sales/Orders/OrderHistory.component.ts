import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Order, OrderStatus, OrderHistory, User } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-order-history',
  templateUrl: './OrderHistory.component.html',
  styleUrls: ['./Orders.component.scss']
})
export class OrderHistoryComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['dateAdded', 'user', 'comment', 'status'];
  dataSource: MatTableDataSource<OrderHistory>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  errors = '';
  orderStatuses: OrderStatus[];

  orderHistory: OrderHistory = new OrderHistory();

  @Input() orderType: string;
  @Input() order: Order;
  @Input() storeOwnerId: number;
  canEdit = false;

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.orderHistory.order.id = this.order.id;
    this.orderHistory.notify = 1;
    this.getOrderStatuses();
    this.getOrderHistories();
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

  getOrderHistories() {
    const parameters: string[] = [];
    if (this.order.id !== null && this.order.id !== undefined) {
      parameters.push('e.order.id = |orderId|' + this.order.id + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.OrderHistory', parameters)
      .subscribe((data: OrderHistory[]) => {
        this.dataSource = new MatTableDataSource<OrderHistory>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setCanEdit();
      },
        error => console.log(error),
        () => console.log('Get all OrderHistory complete'));
  }

  edit(orderHistoryId: number) {
    if (orderHistoryId > 0) {
      this.appService.getOne(orderHistoryId, 'com.softenza.emarket.model.OrderHistory')
        .subscribe(result => {
          if (result) {
            if (result.id > 0) {
              this.orderHistory = result;
            } else {
              this.orderHistory = new OrderHistory();
              this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                this.messages = res['MESSAGE.READ_FAILED'];
              });
            }
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
    if ((!this.orderHistory.orderStatus || !(this.orderHistory.orderStatus.id > 0))
      && (!this.orderHistory.comment || this.orderHistory.comment.trim() === '')) {
      this.translate.get(['VALIDATION.COMMENT_OR_STATUS', 'COMMON.SUCCESS']).subscribe(res => {
        this.messages = res['VALIDATION.COMMENT_OR_STATUS'];
      });
      console.log(this.messages);
    } else {
      if (!this.orderHistory.orderStatus || !(this.orderHistory.orderStatus.id > 0)) {
        this.orderHistory.orderStatus.id = this.order.orderStatus.id;
      } else if (this.orderHistory.orderStatus.name !== this.order.statusCode) {
        this.order.orderStatus.id = this.orderHistory.orderStatus.id;
        this.order.statusCode = this.orderHistory.orderStatus.name;
        this.appService.save(this.order, 'Order')
          .subscribe(result => {
            if (result.id > 0) {
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
              });
            }
          });

      }
      try {
        this.orderHistory.order.id = this.order.id;
        if (this.orderHistory.id > 0) {
          this.order.modifiedBy = Number(this.appService.tokenStorage.getUserId());
        } else {
          const user = new User();
          user.id = Number(this.appService.tokenStorage.getUserId());
          this.orderHistory.user = user;
        }
        this.setToggleValues();
        this.appService.save(this.orderHistory, 'OrderHistory')
          .subscribe(result => {
            if (result.id > 0) {
              this.orderHistory = new OrderHistory();
              this.getOrderHistories();
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
              });
            }
          });

      } catch (e) {
        console.log(e);
      }
    }
  }

  setToggleValues() {
    this.orderHistory.notify = (this.orderHistory.notify === null
      || this.orderHistory.notify.toString() === 'false'
      || this.orderHistory.notify.toString() === '0') ? 0 : 1;
  }

  public setCanEdit() {
    console.log('current user id:' + this.appService.tokenStorage.getUserId());
    console.log('store owner:' + this.storeOwnerId);
    console.log('Role:' + this.appService.tokenStorage.getRole());
    if (Number(this.appService.tokenStorage.getUserId()) === this.storeOwnerId ||
      Number(this.appService.tokenStorage.getRole()) === 3) { // this is the store owner
      this.canEdit = true;
      this.displayedColumns = ['dateAdded', 'user', 'comment', 'status', 'notified', 'actions'];
    } else {
      this.canEdit = false;
    }
  }

}
