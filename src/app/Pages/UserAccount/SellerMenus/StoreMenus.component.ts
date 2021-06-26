import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { StoreSearchCriteria, StoreIngredient, IngredientSearchCriteria, Store, SalesSummary, Payout, MenuSearchCriteria, StoreMenu } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { StoreMenuComponent } from './StoreMenu.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-store-menus',
  templateUrl: './StoreMenus.component.html',
  styleUrls: ['./StoreMenus.component.scss']
})
export class StoreMenusComponent extends BaseComponent implements OnInit {
  storeMenusColumns: string[] = ['menuName', 'status', 'actions'];
  storeMenusDatasource: MatTableDataSource<StoreMenu>;
  @ViewChild('MatPaginatorStoreMenus', { static: true }) storeMenusPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeMenusSort: MatSort;


  @ViewChild(StoreMenuComponent, { static: false }) storeMenuComponent: StoreMenuComponent;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: MenuSearchCriteria = new MenuSearchCriteria();
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
    this.searchCriteria = new MenuSearchCriteria();
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

      this.appService.saveWithUrl('/service/catalog/getStoreMenus', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.storeMenusDatasource = new MatTableDataSource(data);
          this.storeMenusDatasource.paginator = this.storeMenusPaginator;
          this.storeMenusDatasource.sort = this.storeMenusSort;
        },
          error => console.log(error),
          () => console.log('Get store menus complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.storeMenusDatasource.filter = filterValue.trim().toLowerCase();
    if (this.storeMenusDatasource.paginator) {
      this.storeMenusDatasource.paginator.firstPage();
    }

  }

  getStoreMenuDetails(storeMenu: any) {
    this.storeMenuComponent.getStoreMenu(storeMenu);
    this.storeMenuComponent.getStoreUnassignedMenus();
    this.selected.setValue(1);
  }

  storeSelected(event) {

    setTimeout(() => {
        this.searchCriteria.storeId = this.selectedStore.id;
        this.search();

        if (this.storeMenuComponent) {
          this.storeMenuComponent.store = event.value;
          this.storeMenuComponent.clear();
          this.storeMenuComponent.getStoreUnassignedMenus();
        }
      }, 500);
  }

  updateDataTable(storeMenu: StoreMenu) {
    this.updateDatasourceData(this.storeMenusDatasource, this.storeMenusPaginator, this.storeMenusSort, storeMenu);
    this.selected.setValue(0);
  }
}
