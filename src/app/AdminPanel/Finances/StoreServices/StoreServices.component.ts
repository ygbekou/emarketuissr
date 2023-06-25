import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Store, StoreService, ServiceSearchCriteria, Service } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { StoreServiceComponent } from './StoreService.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-store-services',
  templateUrl: './StoreServices.component.html',
  styleUrls: ['./StoreServices.component.scss']
})
export class StoreServicesComponent extends BaseComponent implements OnInit {

  ssColumns: string[] = ['name', 'renewalDate', 'startDate', 'endDate', 'amount', 'billRecur', 'renewalRecur', 'actions'];
  ssDatasource: MatTableDataSource<StoreService>;
  @ViewChild('MatPaginatorSs', { static: false }) ssPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) ssSort: MatSort;

  @ViewChild(StoreServiceComponent, { static: false }) storeServiceComponent: StoreServiceComponent;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: ServiceSearchCriteria = new ServiceSearchCriteria();
  colors = ['primary', 'secondary'];

  selected = new FormControl(0);
  @Input() selectedStore: Store;
  services: Service[] = [];

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.clear();

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
    this.searchCriteria = new ServiceSearchCriteria();
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

      this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();

      this.appService.saveWithUrl('/service/finance/getStoreServices', this.searchCriteria)
        .subscribe((data: any[]) => {

          this.ssDatasource = new MatTableDataSource(data);
          this.ssDatasource.paginator = this.ssPaginator;
          this.ssDatasource.sort = this.ssSort;
        },
          error => console.log(error),
          () => console.log('Get store services complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.ssDatasource.filter = filterValue.trim().toLowerCase();
    if (this.ssDatasource.paginator) {
      this.ssDatasource.paginator.firstPage();
    }

  }

  getStoreServiceDetails(ss: any) {
    this.selected.setValue(1);
    this.storeServiceComponent.getStoreService(ss);
  }

  storeSelected(event) {

    setTimeout(() => {
      this.searchCriteria.storeId = this.selectedStore.id;
      this.search();
      this.selected.setValue(0);

      if (this.storeServiceComponent) {
        this.storeServiceComponent.store = event.value;
        this.storeServiceComponent.getMyStoreEmployees();
        this.storeServiceComponent.clear([]);
      }
    }, 500);
  }

  updateDataTable(storeService: StoreService) {
    this.updateDatasourceData(this.ssDatasource, this.ssPaginator, this.ssSort, storeService);
    this.selected.setValue(0);
  }

  setStore(store: Store) {
    setTimeout(() => {
      this.selectedStore = store;
      this.searchCriteria.storeId = store.id;
      this.search();
    }, 500);
  }

  tabChanged(store: Store) {
    setTimeout(() => {
      if (this.storeServiceComponent) {
        console.log(store);
        this.storeServiceComponent.store = store;
      }
    }, 500);
  }
}
