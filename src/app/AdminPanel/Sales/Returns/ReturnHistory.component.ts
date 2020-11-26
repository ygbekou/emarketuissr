import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Order, OrderStatus, OrderHistory, ReturnHistory } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-returnHistory',
  templateUrl: './ReturnHistory.component.html',
  styleUrls: ['./Returns.component.scss']
})
export class ReturnHistoryComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['dateAdded', 'comment', 'status', 'notified', 'actions'];
  dataSource: MatTableDataSource<ReturnHistory>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  errors = '';

  returnHistory: ReturnHistory = new ReturnHistory();

  @Input()
  returnId: number;

  constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

  ngOnInit() {
    this.returnHistory.returnId = this.returnId;
    this.appService.refreshReferenceData('ReturnStatus');
    this.getReturnHistories();
  }

  getReturnHistories() {
    const parameters: string[] = [];
    if (this.returnId !== null && this.returnId !== undefined) {
        parameters.push('e.returnId = |returnId|' + this.returnId + '|Integer');
    }
    this.appService.getAllByCriteria('ReturnHistory', parameters)
      .subscribe((data: ReturnHistory[]) => {
        this.dataSource = new MatTableDataSource<ReturnHistory>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all ReturnHistory complete'));
  }

  edit(returnHistoryId: number) {
    if (returnHistoryId > 0) {
      this.appService.getOne(returnHistoryId, 'ReturnHistory')
        .subscribe(result => {
          if (result.id > 0) {
            this.returnHistory = result;
          } else {
            this.returnHistory = new ReturnHistory();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  public remove(returnHistoryId: number) {
    this.messages = '';
    this.appService.delete(returnHistoryId, 'ReturnHistory')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.findIndex(element => element.id === returnHistoryId);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<ReturnHistory>(this.dataSource.data);
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

      this.returnHistory.returnId = this.returnId;
      this.setToggleValues();
      console.info(this.returnHistory);
      const index: number = this.dataSource.data.findIndex(element => element.id === this.returnHistory.id);
      this.appService.save(this.returnHistory, 'ReturnHistory')
        .subscribe(result => {
          if (result.id > 0) {
            this.returnHistory = new ReturnHistory();
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<ReturnHistory>(this.dataSource.data);
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
    this.returnHistory.notify = (
      this.returnHistory.notify === null
      || this.returnHistory.notify === undefined
      || this.returnHistory.notify.toString() === 'false'
      || this.returnHistory.notify.toString() === '0') ? 0 : 1;
  }

}
