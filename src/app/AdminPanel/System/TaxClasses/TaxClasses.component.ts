import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxClass, TaxRule, TaxRate } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-tax-class',
  templateUrl: './TaxClasses.component.html',
  styleUrls: ['./TaxClasses.component.scss']
})
export class TaxClassesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'description', 'actions'];
  displayedColumns2: string[] = ['id', 'rate', 'based', 'priority', 'actions'];
  dataSource: MatTableDataSource<TaxClass>;
  taxRuleDS: MatTableDataSource<TaxRule>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  taxClass: TaxClass = new TaxClass();
  taxRates: TaxRate[] = [];
  messages = '';
  errors = '';
  selectedTab = 0;
  constructor(public appService: AppService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.getTaxRates();
    // this.getTaxRule();
    this.getAll();
  }

  getAll() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.TaxClass', parameters)
      .subscribe((data: TaxClass[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all TaxClass complete'));
  }

  getTaxRule() {
    const parameters: string[] = [];
    parameters.push('e.taxClass.id = |taxClassId|' + this.taxClass.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.TaxRule', parameters)
      .subscribe((data: TaxRule[]) => {
        this.taxRuleDS = new MatTableDataSource(data);
        this.taxRuleDS.paginator = this.paginator;
        this.taxRuleDS.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all TaxClass complete'));
  }

  addNewTaxRule() {
    if (!this.taxRuleDS || this.taxRuleDS == null || !this.taxRuleDS.data) {
      const data: TaxRule[] = [];
      this.taxRuleDS = new MatTableDataSource(data);
      this.taxRuleDS.data = [];
    }
    this.taxRuleDS.data.unshift(new TaxRule());
    this.taxRuleDS = new MatTableDataSource<TaxRule>(this.taxRuleDS.data);
    this.taxRuleDS.paginator = this.paginator;
    this.taxRuleDS.sort = this.sort;
  }


  saveTaxRule(taxRule: TaxRule) {
    this.messages = '';
    this.errors = '';
    if (taxRule.taxRate && taxRule.priority) {
      taxRule.taxClass = this.taxClass;
      try {
        this.messages = '';
        console.log(taxRule);
        const index: number = this.taxRuleDS.data.indexOf(taxRule);
        this.appService.save(taxRule, 'TaxRule')
          .subscribe(result => {
            if (result.id > 0) {
              if (index !== -1) {
                this.taxRuleDS.data.splice(index, 1);
              }
              this.taxRuleDS.data.push(result);
              this.taxRuleDS = new MatTableDataSource<TaxRule>(this.taxRuleDS.data);
              this.taxRuleDS.paginator = this.paginator;
              this.taxRuleDS.sort = this.sort;
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
  public deleteTaxRule(taxRule: TaxRule) {
    this.messages = '';
    this.errors = '';
    if (!(taxRule.id > 0)) {
      const index: number = this.taxRuleDS.data.indexOf(taxRule);
      if (index !== -1) {
        this.taxRuleDS.data.splice(index, 1);
        this.taxRuleDS = new MatTableDataSource<TaxRule>(this.taxRuleDS.data);
        this.taxRuleDS.paginator = this.paginator;
        this.taxRuleDS.sort = this.sort;
      }
    } else {
      this.appService.delete(taxRule.id, 'com.softenza.emarket.model.TaxRule')
        .subscribe(resp => {
          if (resp.result === 'SUCCESS') {
            const index: number = this.taxRuleDS.data.indexOf(taxRule);
            if (index !== -1) {
              this.taxRuleDS.data.splice(index, 1);
              this.taxRuleDS = new MatTableDataSource<TaxRule>(this.taxRuleDS.data);
              this.taxRuleDS.paginator = this.paginator;
              this.taxRuleDS.sort = this.sort;
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
  }


  getTaxRates() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.TaxRate', parameters)
      .subscribe((data: TaxRate[]) => {
        this.taxRates = data;
      },
        error => console.log(error),
        () => console.log('Get all TaxRates complete'));
  }

  public remove(taxClass: TaxClass) {
    this.messages = '';
    this.errors = '';
    this.appService.delete(taxClass.id, 'com.softenza.emarket.model.TaxClass')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(taxClass);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<TaxClass>(this.dataSource.data);
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
    this.taxClass = new TaxClass();
    this.dataSource = new MatTableDataSource();
    this.taxRuleDS = new MatTableDataSource();
  }

  addSectionItem() {
    this.selectedTab = 1;
    this.taxClass = new TaxClass();
  }
  edit(si: TaxClass) {
    this.taxClass = si;
    this.getTaxRule();
    this.selectedTab = 1;
  }
  save() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      console.log(this.taxClass);
      const index: number = this.dataSource.data.indexOf(this.taxClass);
      this.appService.save(this.taxClass, 'TaxClass')
        .subscribe(result => {
          if (result.id > 0) {
            this.taxClass = result;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<TaxClass>(this.dataSource.data);
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
