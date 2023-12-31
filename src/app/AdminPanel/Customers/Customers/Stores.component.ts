import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreSearchCriteria, Store } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-all-stores',
  templateUrl: './Stores.component.html',
  styleUrls: ['./Users.component.scss']
})
export class StoresComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'userFullName', 'status', 'aprvStatus', 'dateAdded'];
  dataSource: MatTableDataSource<Store>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  searchCriteria: StoreSearchCriteria;
  button = 'filter';
  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.searchCriteria = new StoreSearchCriteria();
    this.search();
  }

  private clear() {
    this.searchCriteria = new StoreSearchCriteria();
  }
  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {
      this.appService.saveWithUrl('/service/catalog/stores', this.searchCriteria)
        .subscribe((data: Store[]) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
          error => console.log(error),
          () => console.log('Get all Stores complete'));
    }
  }

  public remove(store: Store) {
    this.messages = '';
    this.appService.delete(store.id, 'Store')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(store);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Store>(this.dataSource.data);
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

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
