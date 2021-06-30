import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { StoreSearchCriteria, Store, PoHdr, POSearchCriteria, StoreEmployee, Supplier } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { PurchaseOrderComponent } from './PurchaseOrder.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-purchase-orders',
  templateUrl: './PurchaseOrders.component.html',
  styleUrls: ['./PurchaseOrders.component.scss']
})
export class PurchaseOrdersComponent extends BaseComponent implements OnInit {

  purchaseOrdersColumns: string[] = ['purchaser', 'supplier', 'poDate', 'subTotal', 'taxes', 'discount', 'amount', 'status', 'actions'];
  purchaseOrdersDatasource: MatTableDataSource<PoHdr>;
  @ViewChild('MatPaginatorPurchaseOrders', { static: false }) purchaseOrdersPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) purchaseOrdersSort: MatSort;


  @ViewChild(PurchaseOrderComponent, { static: false }) purchaseOrderComponent: PurchaseOrderComponent;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: POSearchCriteria = new POSearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  allStore = new Store();
  selected = new FormControl(0);
  selectedStore: Store;
  storeEmployees: StoreEmployee[] = [];
  suppliers: Supplier[] = [];

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
    this.getSuppliers();
  }

  private clear() {
    this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.searchCriteria = new POSearchCriteria();
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

  public getSuppliers() {
    const parameters: string[] = [];
    //parameters.push('e.store.id = |sId|' + this.store.id + '|Integer');
    parameters.push('e.status = |supplierStatus|1|Integer');
    this.appService.getAllByCriteria('Supplier', parameters, ' ')
      .subscribe((data: Supplier[]) => {
        this.suppliers = data;
        console.log(this.suppliers);
      },
        (error) => console.log(error),
        () => console.log('Get all Suppliers complete'));
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

      this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();

      this.appService.saveWithUrl('/service/finance/getPurchaseOrders', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.purchaseOrdersDatasource = new MatTableDataSource(data);
          this.purchaseOrdersDatasource.paginator = this.purchaseOrdersPaginator;
          this.purchaseOrdersDatasource.sort = this.purchaseOrdersSort;
        },
          error => console.log(error),
          () => console.log('Get purchase orders complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.purchaseOrdersDatasource.filter = filterValue.trim().toLowerCase();
    if (this.purchaseOrdersDatasource.paginator) {
      this.purchaseOrdersDatasource.paginator.firstPage();
    }

  }

  getPurchaseOrderDetails(poHdr: any) {
    this.selected.setValue(1);
    this.purchaseOrderComponent.getPoHdr(poHdr);
  }

  storeSelected(event) {

    setTimeout(() => {
        this.searchCriteria.storeId = this.selectedStore.id;
        this.search();
        this.selected.setValue(0);
        this.getMyStoreEmployees();

        if (this.purchaseOrderComponent) {
          this.purchaseOrderComponent.store = event.value;
          this.purchaseOrderComponent.getMyStoreEmployees();
          this.purchaseOrderComponent.getSuppliers();
          //this.purchaseOrderComponent.getStoreProducts();
          this.purchaseOrderComponent.clear([]);
        }
      }, 500);
  }

  updateDataTable(poHdr: PoHdr) {
    this.updateDatasourceData(this.purchaseOrdersDatasource, this.purchaseOrdersPaginator, this.purchaseOrdersSort, poHdr);
    this.selected.setValue(0);
  }
}
