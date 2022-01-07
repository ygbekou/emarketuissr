import { Component, OnInit, ViewChild } from '@angular/core';
import { FundTypeDescription } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { FundTypeComponent } from '../FundType/FundType.component';

@Component({
  selector: 'app-fundTypes',
  templateUrl: './FundTypes.component.html',
  styleUrls: ['./FundTypes.component.scss']
})
export class FundTypesComponent extends BaseComponent implements OnInit {

  @ViewChild(FundTypeComponent, { static: false }) fundTypeView: FundTypeComponent;

  displayedColumns: string[] = ['name', 'approverOnly', 'status', 'actions'];
  dataSource: MatTableDataSource<FundTypeDescription>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language.code = |langCode|' + this.appService.appInfoStorage.language.code + '|String');
    this.appService.getAllByCriteria('FundTypeDescription', parameters)
      .subscribe((data: FundTypeDescription[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all FundTypeDescription complete'));
  }

  public remove(ftDesc: FundTypeDescription) {
    this.messages = '';
    this.appService.delete(ftDesc.fundType.id, 'FundType')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(ftDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<FundTypeDescription>(this.dataSource.data);
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


  onSave($event) {
    const fdType = $event;

    fdType.fundTypeDescriptions.forEach(element => {
        if (element.language.id === this.appService.appInfoStorage.language.id) {
          fdType.fundTypeDescriptions[0].fundType = fdType;
          if (!this.dataSource.data) {
            this.dataSource.data = [];
          }
          
          this.updateDatasourceData(this.dataSource, this.paginator, this.sort, fdType.fundTypeDescriptions[0]);
        }
    });
  }
}
