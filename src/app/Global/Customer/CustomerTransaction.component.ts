import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomerTransaction } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-customer-transaction',
  templateUrl: './CustomerTransaction.component.html'
})
export class CustomerTransactionComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['dateAdded', 'orderId', 'montant', 'description', 'actions'];
  dataSource: MatTableDataSource<CustomerTransaction>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  errors = '';

  customerTransaction: CustomerTransaction = new CustomerTransaction();

  @Input()
  userId: number;

  @Input()
  orderId: number;

  constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

  ngOnInit() {
    this.customerTransaction.user.id = this.userId;
    this.getCustomerTransactions();
  }

  getOrder() {
    this.messages = '';

    if (this.orderId > 0) {
      this.appService.getOne(this.orderId, 'Order')
        .subscribe(result => {
          if (result !== null && result.id > 0) {
            this.customerTransaction.order.id = result.id;
          } else {
            this.customerTransaction.order.id = undefined;
            this.translate.get(['COMMON.READ', 'MESSAGE.INVALID_ORDER_ID']).subscribe(res => {
              this.messages = res['MESSAGE.INVALID_ORDER_ID'];
            });
          }
        });
    }
  }

  getCustomerTransactions() {
    const parameters: string[] = [];
    if (this.userId !== null && this.userId !== undefined) {
        parameters.push('e.user.id = |userId|' + this.userId + '|Integer');
    }
    this.appService.getAllByCriteria('CustomerTransaction', parameters)
      .subscribe((data: CustomerTransaction[]) => {
        this.dataSource = new MatTableDataSource<CustomerTransaction>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all CustomerTransaction complete'));
  }

  edit(customerHistoryId: number) {
    if (customerHistoryId > 0) {
      this.appService.getOne(customerHistoryId, 'CustomerTransaction')
        .subscribe(result => {
          if (result.id > 0) {
            this.customerTransaction = result;
            this.orderId = this.customerTransaction.order.id;
          } else {
            this.customerTransaction = new CustomerTransaction();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  public remove(customerTransactionId: number) {
    this.messages = '';
    this.appService.delete(customerTransactionId, 'CustomerTransaction')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.findIndex(element => element.id === customerTransactionId);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<CustomerTransaction>(this.dataSource.data);
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
    this.customerTransaction = new CustomerTransaction();
    this.orderId = undefined;
  }


  save() {
    this.messages = '';
    this.errors = '';
    try {

      this.customerTransaction.user.id = this.userId;
      this.setToggleValues();
      const index: number = this.dataSource.data.findIndex(element => element.id === this.customerTransaction.id);
      this.appService.save(this.customerTransaction, 'CustomerHistory')
        .subscribe(result => {
          if (result.id > 0) {
            this.customerTransaction = new CustomerTransaction();
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<CustomerTransaction>(this.dataSource.data);
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
    this.customerTransaction.notify = (
      this.customerTransaction.notify === null
      || this.customerTransaction.notify === undefined
      || this.customerTransaction.notify.toString() === 'false'
      || this.customerTransaction.notify.toString() === '0') ? 0 : 1;
  }

}
