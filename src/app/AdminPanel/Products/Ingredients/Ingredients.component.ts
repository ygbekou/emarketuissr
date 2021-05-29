import { Component, OnInit, ViewChild } from '@angular/core';
import { IngredientDescription } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-ingredients',
  templateUrl: './Ingredients.component.html',
  styleUrls: ['./Ingredients.component.scss']
})
export class IngredientsComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'name', 'status'];
  dataSource: MatTableDataSource<IngredientDescription>;
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
    this.appService.getAllByCriteria('com.softenza.emarket.model.IngredientDescription', parameters)
      .subscribe((data: IngredientDescription[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all IngredientDescription complete'));
  }

  public remove(ingredientDesc: IngredientDescription) {
    this.messages = '';
    this.appService.delete(ingredientDesc.id, 'com.softenza.emarket.model.IngredientDescription')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(ingredientDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<IngredientDescription>(this.dataSource.data);
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
