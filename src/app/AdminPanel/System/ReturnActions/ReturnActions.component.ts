import { Component, OnInit, ViewChild } from '@angular/core';
import { ReturnAction } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-return-action',
  templateUrl: './ReturnActions.component.html',
  styleUrls: ['./ReturnActions.component.scss']
})
export class ReturnActionsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'language', 'actions'];
  dataSource: MatTableDataSource<ReturnAction>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  returnAction: ReturnAction = new ReturnAction();
  messages = '';
  errors = '';
  selectedTab = 0;
  constructor(public appService: AppService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.ReturnAction', parameters)
      .subscribe((data: ReturnAction[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all ReturnAction complete'));
  }

  public remove(returnAction: ReturnAction) {
    this.messages = '';
    this.errors = '';
    this.appService.delete(returnAction.id, 'com.softenza.emarket.model.ReturnAction')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(returnAction);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<ReturnAction>(this.dataSource.data);
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
    this.returnAction = new ReturnAction();
    this.dataSource = new MatTableDataSource();
  }

  addSectionItem() {
    this.selectedTab = 1;
    this.returnAction = new ReturnAction();
  }
  edit(si: ReturnAction) {
    this.returnAction = si;
    this.selectedTab = 1;
  }
  save() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      console.log(this.returnAction);
      const index: number = this.dataSource.data.indexOf(this.returnAction);
      this.appService.save(this.returnAction, 'ReturnAction')
        .subscribe(result => {
          if (result.id > 0) {
            this.returnAction = new ReturnAction();
            this.selectedTab = 0;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<ReturnAction>(this.dataSource.data);
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
