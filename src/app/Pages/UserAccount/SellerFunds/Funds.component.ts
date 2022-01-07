import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { StoreSearchCriteria, Store, StoreEmployee, FundSearchCriteria, Fund, FundType } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { FundComponent } from './Fund.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-funds',
  templateUrl: './Funds.component.html',
  styleUrls: ['./Funds.component.scss']
})
export class FundsComponent extends BaseComponent implements OnInit, AfterViewInit {

  fundsColumns: string[] = ['id', 'fundType', 'paidBy', 'receivedBy', 'description', 'fundDate', 'amount', 'status' ];
  fundsDatasource: MatTableDataSource<Fund>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) fundsSort: MatSort;


  @ViewChild(FundComponent, { static: false }) fundComponent: FundComponent;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: FundSearchCriteria = new FundSearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  allStore = new Store();
  selected = new FormControl(0);
  selectedStore: Store;
  storeEmployees: StoreEmployee[] = [];

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.clear();
    this.getStores();

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }

  ngAfterViewInit() {
    this.searchCriteria.storeId = 0;
    if (this.isAdminPage) {
      this.searchCriteria.status = 1;
    }
    this.search();
  }

  private clear() {
    this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.searchCriteria = new FundSearchCriteria();
  }

  changeOrderType(event) {
  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
        if (this.stores && this.stores.length === 1) {
          this.selectedStore = this.stores[0];
          this.storeSelected(this.selectedStore);
        }
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  public getMyStoreEmployees() {
    if (this.searchCriteria.storeId) {
      const parameters: string[] = [];
      parameters.push('e.store.id = |sId|' + this.searchCriteria.storeId + '|Integer');
      parameters.push('e.store.status = |storeStatus|1|Integer');
      parameters.push('e.status = |employeeStatus|1|Integer');
      this.appService.getAllByCriteria('StoreEmployee', parameters, ' ')
        .subscribe((data: StoreEmployee[]) => {
          this.storeEmployees = data;
        },
          (error) => console.log(error),
          () => console.log('Get all StoreEmployees complete'));
    }
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {
      this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
      this.appService.saveWithUrl('/service/finance/getFunds', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.fundsDatasource = new MatTableDataSource(data);
          this.fundsDatasource.paginator = this.paginator;
          this.fundsDatasource.sort = this.fundsSort;
        },
          error => console.log(error),
          () => console.log('Get funds complete'));
    }
  }

  public applyFilter(filterValue: string) {
    this.fundsDatasource.filter = filterValue.trim().toLowerCase();
    if (this.fundsDatasource.paginator) {
      this.fundsDatasource.paginator.firstPage();
    }
  }

  getFund(fund: any) {
    this.selected.setValue(1);
    this.fundComponent.getFund(fund);
  }

  storeSelected(event) {
    setTimeout(() => {
      this.searchCriteria.storeId = this.selectedStore.id;
      this.search();
      this.selected.setValue(0);
      this.getMyStoreEmployees();
      if (this.fundComponent) {
        if (event && !event.value) {
          this.fundComponent.store = event;
        } else {
          this.fundComponent.store = event.value;
        }
        console.log(event);
        this.fundComponent.getMyStoreEmployees();
        this.fundComponent.clear([]);
      }
    }, 500);
  }

  updateDataTable(fund: Fund) {
    const copyFund = {...fund};
    copyFund.fundType.name = this.getFundName(fund.fundType);
    this.updateDatasourceData(this.fundsDatasource, this.paginator, this.fundsSort, copyFund);
  }

  getFundName(fundType: FundType): string {
    for (const ft of this.appService.appInfoStorage.fundTypes) {
      if (ft.fundType.id === fundType.id) {
        return ft.name;
      }
    }
    return null;
  }

  public calculateTotal() {
    return this.fundsDatasource ? this.fundsDatasource.data.reduce((accum, curr) => accum + curr.amount, 0) : 0;
  }
}
