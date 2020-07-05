import { Component, OnInit, ViewChild } from '@angular/core';
import { Language } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-languages',
  templateUrl: './Languages.component.html',
  styleUrls: ['./Languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'code', 'sortOrder', 'actions'];
  dataSource: MatTableDataSource<Language>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  language: Language = new Language();
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
    this.appService.getAllByCriteria('com.softenza.emarket.model.Language', parameters, ' order by e.sortOrder ')
      .subscribe((data: Language[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Language complete'));
  }

  public remove(language: Language) {
    this.messages = '';
    this.errors = '';
    this.appService.delete(language.id, 'com.softenza.emarket.model.Language')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(language);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Language>(this.dataSource.data);
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
    this.language = new Language();
    this.dataSource = new MatTableDataSource();
  }

  addSectionItem() {
    this.selectedTab = 1;
    this.language = new Language();
  }
  edit(si: Language) {
    this.language = si;
    this.selectedTab = 1;
  }
  save() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      const index: number = this.dataSource.data.indexOf(this.language);
      this.language.status = (this.language.status == null || this.language.status.toString() === 'false') ? 0 : 1;
      this.appService.save(this.language, 'Language')
        .subscribe(result => {
          if (result.id > 0) {
            this.language = new Language();
            this.selectedTab = 0;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<Language>(this.dataSource.data);
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
