import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { StoreSearchCriteria, StoreIngredient, IngredientSearchCriteria, Store, SalesSummary, Payout } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { StoreIngredientComponent } from './StoreIngredient.component';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-store-ingredients',
  templateUrl: './StoreIngredients.component.html',
  styleUrls: ['./StoreIngredients.component.scss']
})
export class StoreIngredientsComponent extends BaseComponent implements OnInit {
  storeIngredientsColumns: string[] = ['storeName', 'ingredientName', 'quantity', 'minimumQty', 'maximumQty', 'status', 'actions'];
  storeIngredientsDatasource: MatTableDataSource<StoreIngredient>;
  @ViewChild('MatPaginatorStoreIngredients', { static: true }) storeIngredientsPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeIngredientsSort: MatSort;

  @ViewChild(StoreIngredientComponent, { static: false }) storeIngredientComponent: StoreIngredientComponent;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: IngredientSearchCriteria = new IngredientSearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  allStore = new Store();
  selected = new FormControl(0);
  selectedStore: Store;

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
    this.searchCriteria.storeId = 0;

    if (this.isAdminPage) {
      this.searchCriteria.status = 1;
    }
    this.search();
  }

  private clear() {
    this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.searchCriteria = new IngredientSearchCriteria();
  }

  changeOrderType(event) {
  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

       this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
       this.searchCriteria.languageId = +this.appService.appInfoStorage.language.id;

      this.appService.saveWithUrl('/service/catalog/getStoreIngredients', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.storeIngredientsDatasource = new MatTableDataSource(data);
          this.storeIngredientsDatasource.paginator = this.storeIngredientsPaginator;
          this.storeIngredientsDatasource.sort = this.storeIngredientsSort;
        },
          error => console.log(error),
          () => console.log('Get store ingredients complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.storeIngredientsDatasource.filter = filterValue.trim().toLowerCase();
    if (this.storeIngredientsDatasource.paginator) {
      this.storeIngredientsDatasource.paginator.firstPage();
    }

  }

  getStoreIngredientDetails(storeIngredient: any) {
    this.storeIngredientComponent.getStoreIngredient(storeIngredient);
    this.storeIngredientComponent.getStoreUnassignedIngredients();
    this.selected.setValue(1);
  }

  storeSelected(event) {
    this.searchCriteria.inventoryLevel = null;
    this.searchCriteria.storeId = this.selectedStore.id;
    this.search();
    this.storeIngredientComponent.store = event.value;
    this.storeIngredientComponent.clear();
    this.storeIngredientComponent.getStoreUnassignedIngredients();
  }

  updateDataTable(storeIngredient: StoreIngredient) {
    this.updateDatasourceData(this.storeIngredientsDatasource, this.storeIngredientsPaginator, this.storeIngredientsSort, storeIngredient);
    this.selected.setValue(0);
  }
}
