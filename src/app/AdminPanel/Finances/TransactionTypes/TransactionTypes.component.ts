import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionTypeDescription } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { TransactionTypeComponent } from '../TransactionType/TransactionType.component';

@Component({
  selector: 'app-transactionTypes',
  templateUrl: './TransactionTypes.component.html',
  styleUrls: ['./TransactionTypes.component.scss']
})
export class TransactionTypesComponent extends BaseComponent implements OnInit {

  @ViewChild(TransactionTypeComponent, { static: false }) transactionTypeView: TransactionTypeComponent;

  displayedColumns: string[] = ['name', 'approverOnly', 'status', 'actions'];
  dataSource: MatTableDataSource<TransactionTypeDescription>;
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
    this.appService.getAllByCriteria('TransactionTypeDescription', parameters)
      .subscribe((data: TransactionTypeDescription[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all TransactionTypeDescription complete'));
  }

  public remove(ttDesc: TransactionTypeDescription) {
    this.messages = '';
    this.appService.delete(ttDesc.transactionType.id, 'TransactionType')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(ttDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<TransactionTypeDescription>(this.dataSource.data);
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
    const transType = $event;

    transType.transactionTypeDescriptions.forEach(element => {
        if (element.language.id === this.appService.appInfoStorage.language.id) {
          transType.transactionTypeDescriptions[0].transactionType = transType;
          if (!this.dataSource.data) {
            this.dataSource.data = [];
          }
          // this.dataSource.data.push(transType.transactionTypeDescriptions[0]);
          // this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.updateDatasourceData(this.dataSource, this.paginator, this.sort, transType.transactionTypeDescriptions[0]);
        }
    });
  }
}
