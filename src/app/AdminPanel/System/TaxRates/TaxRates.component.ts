import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxRate, GeoZone } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-tax-rates',
  templateUrl: './TaxRates.component.html',
  styleUrls: ['./TaxRates.component.scss']
})
export class TaxRatesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'taxType', 'rate', 'createDate', 'modDate', 'actions'];
  dataSource: MatTableDataSource<TaxRate>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  taxRate: TaxRate = new TaxRate();
  messages = '';
  errors = '';
  selectedTab = 0;
  geoZones: GeoZone[] = [];
  constructor(public appService: AppService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.getGeoZones();
    this.getAll();
  }
  getAll() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.TaxRate', parameters)
      .subscribe((data: TaxRate[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all TaxRate complete'));
  }

  getGeoZones() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.GeoZone', parameters)
      .subscribe((data: GeoZone[]) => {
        this.geoZones = data;
      },
        error => console.log(error),
        () => console.log('Get all Countries complete'));
  }

  public remove(taxRate: TaxRate) {
    this.messages = '';
    this.errors = '';
    this.appService.delete(taxRate.id, 'com.softenza.emarket.model.TaxRate')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(taxRate);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<TaxRate>(this.dataSource.data);
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
    this.taxRate = new TaxRate();
    this.dataSource = new MatTableDataSource();
  }

  addSectionItem() {
    this.selectedTab = 1;
    this.taxRate = new TaxRate();
  }
  edit(si: TaxRate) {
    this.taxRate = si;
    this.selectedTab = 1;
  }
  save() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      console.log(this.taxRate);
      const index: number = this.dataSource.data.indexOf(this.taxRate);
      this.appService.save(this.taxRate, 'TaxRate')
        .subscribe(result => {
          if (result.id > 0) {
            this.taxRate = new TaxRate();
            this.selectedTab = 0;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<TaxRate>(this.dataSource.data);
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
