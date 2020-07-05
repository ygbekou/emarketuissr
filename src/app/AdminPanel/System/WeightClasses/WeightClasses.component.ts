import { Component, OnInit, ViewChild } from '@angular/core';
import { WeightClassDescription } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-weight-classes',
  templateUrl: './WeightClasses.component.html',
  styleUrls: ['./WeightClasses.component.scss']
})
export class WeightClassesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'unit', 'value', 'actions'];
  dataSource: MatTableDataSource<WeightClassDescription>;
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
    parameters.push('e.language.code = |langCode|' + this.appService.appInfoStorage.language.code + '|String');
    this.appService.getAllByCriteria('com.softenza.emarket.model.WeightClassDescription', parameters)
      .subscribe((data: WeightClassDescription[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all WeightClassDescription complete'));
  }

  public remove(weightClassDesc: WeightClassDescription) {
    this.messages = '';
    this.appService.delete(weightClassDesc.id, 'com.softenza.emarket.model.WeightClassDescription')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(weightClassDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<WeightClassDescription>(this.dataSource.data);
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
