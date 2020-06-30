import { Component, OnInit, ViewChild } from '@angular/core';
import { Section } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-categories',
  templateUrl: './Categories.component.html',
  styleUrls: ['./Categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'name', 'title', 'lang', 'actions'];
  dataSource: MatTableDataSource<Section>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  constructor(public appService: AppService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.wack.model.website.Section', parameters)
      .subscribe((data: Section[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Section complete'));
  }

  public remove(section: Section) {
    this.messages = '';
    this.appService.delete(section.id, 'com.wack.model.website.Section')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(section);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Section>(this.dataSource.data);
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