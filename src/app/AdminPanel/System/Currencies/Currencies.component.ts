import { Component, OnInit, ViewChild } from '@angular/core';
import { Currency } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-currencys',
  templateUrl: './Currencies.component.html',
  styleUrls: ['./Currencies.component.scss']
})
export class CurrenciesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'code', 'value', 'modDate', 'actions'];
  dataSource: MatTableDataSource<Currency>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currency: Currency = new Currency();
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
    this.appService.getAllByCriteria('com.softenza.emarket.model.Currency', parameters)
      .subscribe((data: Currency[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Currency complete'));
  }

  public remove(currency: Currency) {
    this.messages = '';
    this.errors = '';
    this.appService.delete(currency.id, 'com.softenza.emarket.model.Currency')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(currency);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Currency>(this.dataSource.data);
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
    this.currency = new Currency();
    this.dataSource = new MatTableDataSource();
  }

  addSectionItem() {
    this.selectedTab = 1;
    this.currency = new Currency();
  }
  edit(si: Currency) {
    this.currency = si;
    this.selectedTab = 1;
  }
  save() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      const index: number = this.dataSource.data.indexOf(this.currency);
      this.currency.status = (this.currency.status == null || this.currency.status.toString() === 'false') ? 0 : 1;
      this.appService.save(this.currency, 'Currency')
        .subscribe(result => {
          if (result.id > 0) {
            this.currency = new Currency();
            this.selectedTab = 0;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<Currency>(this.dataSource.data);
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
