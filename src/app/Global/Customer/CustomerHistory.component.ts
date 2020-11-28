import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ReturnHistory, CustomerHistory } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
@Component({
  selector: 'app-customer-history',
  templateUrl: './CustomerHistory.component.html'
})
export class CustomerHistoryComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['dateAdded', 'comment', 'notified', 'actions'];
  dataSource: MatTableDataSource<CustomerHistory>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  errors = '';

  customerHistory: CustomerHistory = new CustomerHistory();

  @Input()
  userId: number;

  constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

  ngOnInit() {
    this.customerHistory.user.id = this.userId;
    this.getCustomerHistories();
  }

  getCustomerHistories() {
    const parameters: string[] = [];
    if (this.userId !== null && this.userId !== undefined) {
        parameters.push('e.user.id = |userId|' + this.userId + '|Integer');
    }
    this.appService.getAllByCriteria('CustomerHistory', parameters)
      .subscribe((data: CustomerHistory[]) => {
        this.dataSource = new MatTableDataSource<CustomerHistory>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all CustomerHistory complete'));
  }

  edit(customerHistoryId: number) {
    if (customerHistoryId > 0) {
      this.appService.getOne(customerHistoryId, 'CustomerHistory')
        .subscribe(result => {
          if (result.id > 0) {
            this.customerHistory = result;
          } else {
            this.customerHistory = new CustomerHistory();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  public remove(customerHistoryId: number) {
    this.messages = '';
    this.appService.delete(customerHistoryId, 'CustomerHistory')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.findIndex(element => element.id === customerHistoryId);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<CustomerHistory>(this.dataSource.data);
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
    this.customerHistory = new CustomerHistory();
  }

  save() {
    this.messages = '';
    this.errors = '';
    try {

      this.customerHistory.user.id = this.userId;
      this.setToggleValues();
      const index: number = this.dataSource.data.findIndex(element => element.id === this.customerHistory.id);
      this.appService.save(this.customerHistory, 'CustomerHistory')
        .subscribe(result => {
          if (result.id > 0) {
            this.customerHistory = new CustomerHistory();
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<CustomerHistory>(this.dataSource.data);
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
    this.customerHistory.notify = (
      this.customerHistory.notify === null
      || this.customerHistory.notify === undefined
      || this.customerHistory.notify.toString() === 'false'
      || this.customerHistory.notify.toString() === '0') ? 0 : 1;
  }

}
