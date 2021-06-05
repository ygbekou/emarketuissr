import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuDescription } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { MenuComponent } from '../Menu/Menu.component';

@Component({
  selector: 'app-menus',
  templateUrl: './Menus.component.html',
  styleUrls: ['./Menus.component.scss']
})
export class MenusComponent extends BaseComponent implements OnInit {

  @ViewChild(MenuComponent, { static: false }) menuView: MenuComponent;

  displayedColumns: string[] = ['name', 'status', 'actions'];
  dataSource: MatTableDataSource<MenuDescription>;
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
    this.appService.getAllByCriteria('MenuDescription', parameters)
      .subscribe((data: MenuDescription[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all MenuDescription complete'));
  }

  public remove(menuDesc: MenuDescription) {
    this.messages = '';
    this.appService.delete(menuDesc.menu.id, 'Menu')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(menuDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<MenuDescription>(this.dataSource.data);
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


  onMenuSave($event) {
    const menu = $event;

    menu.menuDescriptions.forEach(element => {
        if (element.language.id === this.appService.appInfoStorage.language.id) {
          menu.menuDescriptions[0].menu = menu;
          if (!this.dataSource.data) {
            this.dataSource.data = [];
          }
          this.dataSource.data.push(menu.menuDescriptions[0]);
          this.dataSource = new MatTableDataSource(this.dataSource.data);
        }
    });
  }
}
