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
  orderStatuses: OrderStatus[] = [];
  filteredOrderStatuses: OrderStatus[] = [];

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
    parameters.push('e.status = |staCode|1|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.OrderStatus', parameters)
      .subscribe((data: OrderStatus[]) => {
        this.orderStatuses = data;
        this.filterOrderStatuses();
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

        this.processDataSourceDeleteResult(resp, this.messages, this.orderHistory, this.dataSource);
      });
  }

  save() {
    this.messages = '';
    this.errors = '';

    console.log(this.orderHistory)
    if ((!this.orderHistory.orderStatus || !(this.orderHistory.orderStatus.id > 0))
      && (!this.orderHistory.comment || this.orderHistory.comment.trim() === '')) {
      this.translate.get(['VALIDATION.COMMENT_OR_STATUS', 'COMMON.SUCCESS']).subscribe(res => {
        this.messages = res['VALIDATION.COMMENT_OR_STATUS'];
      });
    } else {

      try {
        this.orderHistory.order.id = this.order.id;
        this.orderHistory.user.id = Number(this.appService.tokenStorage.getUserId());
        if (!this.orderHistory.orderStatus || !(this.orderHistory.orderStatus.id > 0)) {
          this.orderHistory.orderStatus = this.order.orderStatus;
        }

        this.setToggleValues();
        this.appService.saveWithUrl('/service/order/saveOrderHistory', this.orderHistory)
          .subscribe(result => {
            this.processResult(result, this.order, null);
            if (result.id > 0) {
              this.order.orderStatus = this.orderHistory.orderStatus;
              this.orderHistory = new OrderHistory();
              this.getOrderHistories();
              this.filterOrderStatuses();
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

  public filterOrderStatuses() {
    this.filteredOrderStatuses = [];
    this.orderStatuses.forEach( orderStatus => {
      if (orderStatus.name === 'SHIPPED' || orderStatus.name === 'DELIVERED' || orderStatus.name === 'PROCESSING') {
        this.filteredOrderStatuses.push(orderStatus);
      }
    });
    // }
    // if (this.order.orderStatus.name === 'SHIPPED') {
    //   this.orderStatuses.forEach( orderStatus => {
    //     if (orderStatus.name === 'PROCESSING' || orderStatus.name === 'DELIVERED') {
    //       this.filteredOrderStatuses.push(orderStatus);
    //     }
    //   });
    // }
    // if (this.order.orderStatus.name === 'DELIVERED') {
    //   this.orderStatuses.forEach( orderStatus => {
    //     if (orderStatus.name === 'PROCESSING' || orderStatus.name === 'SHIPPED') {
    //       this.filteredOrderStatuses.push(orderStatus);
    //     }
    //   });
    // }
    return this.filteredOrderStatuses;
  }


  public onToggleGroupChange(event) {
    this.orderHistory.orderStatus = event.value;

  }

}
