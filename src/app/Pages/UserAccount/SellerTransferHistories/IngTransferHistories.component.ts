import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { StoreSearchCriteria, Store, StoreEmployee, PrdHistSearchCriteria, StoreIngredientInventory } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-ingtransfer-histories',
  templateUrl: './IngTransferHistories.component.html',
  styleUrls: ['./TransferHistories.component.scss']
})
export class IngTransferHistoriesComponent extends BaseComponent implements OnInit, AfterViewInit {

  ingHistColumns: string[] = ['storeName', 'ingredientName', 'quantity', 'createDate', 'fromStoreName', 'toStoreName' ];
  ingHistDatasource: MatTableDataSource<StoreIngredientInventory>;
  @ViewChild('MatPaginator', { static: true }) ingHistPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) ingHistSort: MatSort;

  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: PrdHistSearchCriteria = new PrdHistSearchCriteria();
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

  ngAfterViewInit() {

  }

  private clear() {
    this.searchCriteria = new PrdHistSearchCriteria();
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
      this.appService.saveWithUrl('/service/catalog/getStoreIngInventories', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.ingHistDatasource = new MatTableDataSource(data);
          this.ingHistDatasource.paginator = this.ingHistPaginator;
          this.ingHistDatasource.sort = this.ingHistSort;
        },
          error => console.log(error),
          () => console.log('Get store ing inventories complete'));
    }
  }


  storeSelected(event) {
    setTimeout(() => {
      this.searchCriteria.storeId = this.selectedStore.id;
      this.search();
      this.getMyStoreEmployees();
    }, 500);
  }

}
