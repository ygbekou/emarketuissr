import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomerTransaction, CustomerReward } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-customer-reward',
  templateUrl: './CustomerReward.component.html',
  styleUrls: ['./CustomerHistory.component.scss']
})
export class CustomerRewardComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['dateAdded', 'orderId', 'points', 'description', 'actions'];
  dataSource: MatTableDataSource<CustomerReward>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  errors = '';

  customerReward: CustomerReward = new CustomerReward();

  @Input()
  userId: number;

  @Input()
  orderId: number;

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.customerReward.user.id = this.userId;
    this.getCustomerRewards();
  }

  getOrderAndSave() {
    this.messages = '';
    if (this.orderId > 0) {
      this.appService.getOne(this.orderId, 'Order')
        .subscribe(result1 => {
          if (result1 !== null && result1.id > 0 && result1.userId === this.userId) {
            this.customerReward.order.id = result1.id;
            this.customerReward.user.id = this.userId;
            this.appService.save(this.customerReward, 'CustomerReward')
              .subscribe(result => {
                if (result.id > 0) {
                  this.customerReward = new CustomerReward();
                  this.orderId = null;
                  this.dataSource.data.push(result);
                  this.dataSource = new MatTableDataSource<CustomerReward>(this.dataSource.data);
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
          } else {
            this.customerReward.order.id = undefined;
            this.translate.get(['COMMON.READ', 'MESSAGE.INVALID_ORDER_ID']).subscribe(res => {
              this.messages = res['MESSAGE.INVALID_ORDER_ID'];
            });
          }
        });
    }
  }

  getCustomerRewards() {
    const parameters: string[] = [];
    if (this.userId !== null && this.userId !== undefined) {
      parameters.push('e.user.id = |userId|' + this.userId + '|Integer');
    }
    this.appService.getAllByCriteria('CustomerReward', parameters)
      .subscribe((data: CustomerReward[]) => {
        this.dataSource = new MatTableDataSource<CustomerReward>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all CustomerReward complete'));
  }

  edit(customerRewardId: number) {
    if (customerRewardId > 0) {
      this.appService.getOne(customerRewardId, 'CustomerReward')
        .subscribe(result => {
          if (result && result.id > 0) {
            this.customerReward = result;
            this.orderId = this.customerReward.order.id;
          } else {
            this.customerReward = new CustomerReward();
            /* this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            }); */
          }
        });
    }
  }

  public remove(customerRewardId: number) {
    this.messages = '';
    this.appService.delete(customerRewardId, 'CustomerReward')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.findIndex(element => element.id === customerRewardId);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<CustomerReward>(this.dataSource.data);
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

  add() {
    this.customerReward = new CustomerReward();
    this.orderId = undefined;
  }


  save() {
    this.messages = '';
    this.errors = '';
    try {
      if (!this.customerReward.id || !(this.customerReward.id > 0)) {
        this.getOrderAndSave();
      } else {
        this.customerReward.user.id = this.userId;
        const index: number = this.dataSource.data.findIndex(element => element.id === this.customerReward.id);
        this.appService.save(this.customerReward, 'CustomerReward')
          .subscribe(result => {
            if (result.id > 0) {
              this.customerReward = new CustomerReward();
              this.orderId = null;
              if (index !== -1) {
                this.dataSource.data.splice(index, 1);
              }
              this.dataSource.data.push(result);
              this.dataSource = new MatTableDataSource<CustomerReward>(this.dataSource.data);
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
      }

    } catch (e) {
      console.log(e);
    }
  }

}
