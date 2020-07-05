import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryDescription, ProductDescription } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-products',
  templateUrl: './Products.component.html',
  styleUrls: ['./Products.component.scss']
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'name', 'sortOrder', 'status', 'actions'];
  dataSource: MatTableDataSource<ProductDescription>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  lang = 'fr';
  constructor(public appService: AppService,
    private translate: TranslateService) { }

  ngOnInit() {
    console.info(Cookie.get('lang'));
    this.setLang();
    this.getAll();
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language.code = |langCode|' + this.lang + '|String');
    this.appService.getAllByCriteria('com.softenza.emarket.model.ProductDescription', parameters)
      .subscribe((data: ProductDescription[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all ProductDescription complete'));
  }

  public remove(productDesc: ProductDescription) {
    this.messages = '';
    this.appService.delete(productDesc.id, 'com.softenza.emarket.model.ProductDescription')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(productDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<ProductDescription>(this.dataSource.data);
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

  setLang() {
    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      lang = Cookie.get('lang');
      console.log('Using cookie lang=' + Cookie.get('lang'));
    } else if (lang) {
      console.log('Using browser lang=' + lang);
      // this.translate.use(lang);
    } else {
      lang = 'fr';
      console.log('Using default lang=fr');
    }
    this.lang = lang;
  }
}
