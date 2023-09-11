import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { StoreSearchCriteria, Store, StoreEmployee, Supplier, Bill, BillSearchCriteria } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { BillComponent } from './Bill.component';
import { UserBillComponent } from './UserBill.component';
import { BillPaymentComponent } from './BillPayment.component';
import { UserBillPaymentComponent } from './UserBillPayment.component';

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
  @ViewChild(UserBillPaymentComponent, { static: false }) userBillPaymentComponent: UserBillPaymentComponent;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = true;

  searchCriteria: BillSearchCriteria = new BillSearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  allStore = new Store();
  selected = new FormControl(0);
  selectedStore: Store;
  storeEmployees: StoreEmployee[] = [];
  suppliers: Supplier[] = [];

  totalDue = 0;
  unpaidBillIds = [];
  action = 'details';
  saving = false;

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.clear();
    this.getStores();
  }

  ngAfterViewInit() {
    this.searchCriteria.storeId = 0;
    this.search(false);
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

  getTotalDue(data: any[], showPaymentPage: boolean) {
    this.totalDue = 0;
    this.unpaidBillIds = [];
    data.forEach(b => {
      if (b.amountDue) {
        this.totalDue += b.amountDue;
        this.unpaidBillIds.push(b.id);
      }
    });

    if (showPaymentPage) {
      this.showPayment();
    }
  }

  search(showPaymentPage: boolean) {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {
      this.searchCriteria.userId =  this.userId;
      console.log('User Id = ' + this.userId);
      this.appService.saveWithUrl('/service/finance/getBills', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.getTotalDue(data, showPaymentPage);
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
      this.userBillPaymentComponent.bill = bill;
      this.userBillPaymentComponent.updateAmounts(bill.amountDue);
    } else {
      this.billComponent.getBill(bill);
      this.billPaymentComponent.newBillSelected(bill);
    }

  }

  storeSelected(event) {

    this.messages = '';
    this.errors = '';
    setTimeout(() => {
      this.searchCriteria.storeId = this.selectedStore.id;
      this.userBillPaymentComponent.store = this.selectedStore;
      this.search(false);
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

  showPayment() {
    this.action = 'payment';
    this.userBillPaymentComponent.totalDue = this.totalDue;
    this.userBillPaymentComponent.updateAmounts(this.totalDue);
    this.userBillPaymentComponent.billPayment.unpaidBillIds = this.unpaidBillIds;
  }

  showDetails() {
    this.action = 'details';
  }

  setSaving(value: boolean) {
    this.saving = value;
  }
}
