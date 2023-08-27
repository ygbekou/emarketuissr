import { Component, OnInit, ViewChild } from '@angular/core';
import { ReturnStatus } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-return-statuses',
  templateUrl: './ReturnStatuses.component.html',
  styleUrls: ['./ReturnStatuses.component.scss']
})
export class ReturnStatusesComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'language', 'description', 'actions'];
  dataSource: MatTableDataSource<ReturnStatus>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  returnStatus: ReturnStatus = new ReturnStatus();
  messages = '';
  errors = '';
  selectedTab = 0;
  constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.ReturnStatus', parameters)
      .subscribe((data: ReturnStatus[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all ReturnStatus complete'));
  }

  public remove(returnStatus: ReturnStatus) {
    this.messages = '';
    this.errors = '';
    this.appService.delete(returnStatus.id, 'com.softenza.emarket.model.ReturnStatus')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(returnStatus);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<ReturnStatus>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
          });
        } else {
          this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.ERROR_OCCURRED'];
          });
        }
      });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clear() {
    this.returnStatus = new ReturnStatus();
    this.dataSource = new MatTableDataSource();
  }

  addSectionItem() {
    this.selectedTab = 1;
    this.returnStatus = new ReturnStatus();
  }

  edit(returnStatusId: number) {
    if (returnStatusId > 0) {
      this.appService.getOne(returnStatusId, 'ReturnAction')
        .subscribe(result => {
          if (result.id > 0) {
            this.returnStatus = result;
            this.selectedTab = 1;
            console.info(this.returnStatus);
          } else {
            this.returnStatus = new ReturnStatus();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }


  save() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      console.log(this.returnStatus);
      const index: number = this.dataSource.data.indexOf(this.returnStatus);
      this.appService.save(this.returnStatus, 'ReturnStatus')
        .subscribe(result => {
          if (result.id > 0) {
            this.returnStatus = new ReturnStatus();
            this.selectedTab = 0;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<ReturnStatus>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.selectedTab = 1;
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

}
