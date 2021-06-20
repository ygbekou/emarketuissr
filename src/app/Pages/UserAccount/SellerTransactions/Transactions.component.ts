import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { StoreSearchCriteria, Store, Transaction, TransactionSearchCriteria } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { TransactionComponent } from './Transaction.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-transactions',
  templateUrl: './Transactions.component.html',
  styleUrls: ['./Transactions.component.scss']
})
export class TransactionsComponent extends BaseComponent implements OnInit {

  transactionsColumns: string[] = ['transactionType', 'paidBy', 'receiver', 'transactionDate', 'salaryDate', 'amount', 'actions'];
  transactionsDatasource: MatTableDataSource<Transaction>;
  @ViewChild('MatPaginatorTransactions', { static: true }) transactionsPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) transactionsSort: MatSort;


  @ViewChild(TransactionComponent, { static: false }) transactionComponent: TransactionComponent;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: TransactionSearchCriteria = new TransactionSearchCriteria();
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
    this.searchCriteria = new TransactionSearchCriteria();
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

      this.appService.saveWithUrl('/service/finance/getTransactions', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.transactionsDatasource = new MatTableDataSource(data);
          this.transactionsDatasource.paginator = this.transactionsPaginator;
          this.transactionsDatasource.sort = this.transactionsSort;
        },
          error => console.log(error),
          () => console.log('Get store menus complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.transactionsDatasource.filter = filterValue.trim().toLowerCase();
    if (this.transactionsDatasource.paginator) {
      this.transactionsDatasource.paginator.firstPage();
    }

  }

  getTransaction(transaction: any) {
    this.selected.setValue(1);
    this.transactionComponent.getTransaction(transaction);
  }

  storeSelected(event) {

    setTimeout(() => {
        this.searchCriteria.storeId = this.selectedStore.id;
        this.search();
        this.selected.setValue(0);

        if (this.transactionComponent) {
          this.transactionComponent.store = event.value;
          this.transactionComponent.getMyStoreEmployees();
          this.transactionComponent.clear([]);
        }
      }, 500);
  }

  updateDataTable(transaction: Transaction) {
    this.updateDatasourceData(this.transactionsDatasource, this.transactionsPaginator, this.transactionsSort, transaction);
    this.selected.setValue(0);
  }
}
