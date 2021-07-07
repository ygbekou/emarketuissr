import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { StoreSearchCriteria, Store, StoreEmployee, Supplier, Bill, BillSearchCriteria } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { BillComponent } from './Bill.component';
import { UserBillComponent } from './UserBill.component';
import { BillPaymentComponent } from './BillPayment.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-bills',
  templateUrl: './Bills.component.html',
  styleUrls: ['./Bills.component.scss']
})
export class BillsComponent extends BaseComponent implements OnInit {

  billsColumns: string[] = ['reference', 'billDate', 'description', 'amount', 'amountDue', 'dueDate', 'status'];
  billsDatasource: MatTableDataSource<Bill>;
  @ViewChild('MatPaginatorBills', { static: false }) billsPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) billsSort: MatSort;


  @ViewChild(BillComponent, { static: false }) billComponent: BillComponent;
  @ViewChild(UserBillComponent, { static: false }) userBillComponent: UserBillComponent;
  @ViewChild(BillPaymentComponent, { static: false }) billPaymentComponent: BillPaymentComponent;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: BillSearchCriteria = new BillSearchCriteria();
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
 /*    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    }); */
  }

  ngAfterViewInit() {
    this.searchCriteria.storeId = 0;
  /*   if (this.isAdminPage) {
      this.searchCriteria.status = 1;
    } */
    this.search();
  }

  private clear() {
    this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.searchCriteria = new BillSearchCriteria();
  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = this.userId;
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
      this.searchCriteria.userId =  this.userId;
      console.log('User Id = '+ this.userId);
      this.appService.saveWithUrl('/service/finance/getBills', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.billsDatasource = new MatTableDataSource(data);
          this.billsDatasource.paginator = this.billsPaginator;
          this.billsDatasource.sort = this.billsSort;
        },
          error => console.log(error),
          () => console.log('Get bills complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.billsDatasource.filter = filterValue.trim().toLowerCase();
    if (this.billsDatasource.paginator) {
      this.billsDatasource.paginator.firstPage();
    }

  }

  getBillDetails(bill: any) {
    this.selected.setValue(1);
    if (this.userId) {
      this.userBillComponent.newBillSelected(bill);
    } else {
      this.billComponent.getBill(bill);
      this.billPaymentComponent.newBillSelected(bill);
    }

  }

  storeSelected(event) {

    setTimeout(() => {
      this.searchCriteria.storeId = this.selectedStore.id;
      this.search();
      this.selected.setValue(0);
      this.getMyStoreEmployees();

      if (this.billComponent) {
        if (event && event.value) {
          this.billComponent.store = event.value;
        } else {
          this.billComponent.store = event;
        }

        this.billComponent.getMyStoreEmployees();
        this.billComponent.clear([]);
      }
    }, 500);
  }

  updateDataTable(bill: Bill) {
    this.updateDatasourceData(this.billsDatasource, this.billsPaginator, this.billsSort, bill);
    this.billPaymentComponent.newBillSelected(bill);
    // this.selected.setValue(0);
  }

  updateDataTableFromPayment(bill: Bill) {
    this.updateDatasourceData(this.billsDatasource, this.billsPaginator, this.billsSort, bill);
    this.billComponent.getBill(bill);
  }
}
