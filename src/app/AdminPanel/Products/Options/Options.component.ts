import { Component, OnInit, ViewChild } from '@angular/core';
import { OptionDescription } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-options',
  templateUrl: './Options.component.html',
  styleUrls: ['./Options.component.scss']
})
export class OptionsComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'sortOrder'];
  dataSource: MatTableDataSource<OptionDescription>;
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
    this.appService.getAllByCriteria('com.softenza.emarket.model.OptionDescription', parameters)
      .subscribe((data: OptionDescription[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all OptionDescription complete'));
  }

  public remove(optionDesc: OptionDescription) {
    this.messages = '';
    this.appService.delete(optionDesc.id, 'OptionDescription')
      .subscribe(resp => {
        this.processDataSourceDeleteResult(resp, this.messages, optionDesc, this.dataSource);
      });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
