import { Component, OnInit, ViewChild } from '@angular/core';
import { IngredientDescription, IconDesc } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { IconComponent } from './Icon.component';

@Component({
  selector: 'app-icons',
  templateUrl: './Icons.component.html',
  styleUrls: ['./Icons.component.scss']
})
export class IconsComponent extends BaseComponent implements OnInit {

  @ViewChild(IconComponent, { static: false }) iconView: IconComponent;

  displayedColumns: string[] = ['code', 'name', 'status', 'actions'];
  dataSource: MatTableDataSource<IconDesc>;
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
    this.appService.getAllByCriteria('IconDesc', parameters)
      .subscribe((data: IconDesc[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all IconDesc complete'));
  }

  public remove(iDesc: IconDesc) {
    this.messages = '';
    this.appService.delete(iDesc.icon.id, 'Icon')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(iDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<IconDesc>(this.dataSource.data);
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
    const icon = $event;

    icon.iconDescs.forEach(element => {
        if (element.language.id === this.appService.appInfoStorage.language.id) {
          icon.iconDescs[0].icon = icon;
          if (!this.dataSource.data) {
            this.dataSource.data = [];
          }
          this.updateDatasourceData(this.dataSource, this.paginator, this.sort, icon.iconDescs[0]);
        }
    });
  }
}
