import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { StoreSearchCriteria, Store, Tranlog, TranlogSearchCriteria, StoreEmployee} from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { TranlogComponent } from './Tranlog.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-tranlogs',
  templateUrl: './Tranlogs.component.html',
  styleUrls: ['./Tranlogs.component.scss']
})
export class TranlogsComponent extends BaseComponent implements OnInit, AfterViewInit {

  // tranlogsColumns: string[] = ['tranlogType', 'paidBy', 'receiver', 'tranlogDate', 'salaryDate', 'amount', 'actions'];
  tranlogsColumns: string[] = ['refNbr', 'author', 'oldQty', 'newQty',
   'oldPrice', 'newPrice', 'oldRebate', 'newRebate', 'tranlogDate', 'operation'];
  tranlogsDatasource: MatTableDataSource<Tranlog>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) tranlogsSort: MatSort;


  @ViewChild(TranlogComponent, { static: false }) tranlogComponent: TranlogComponent;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: TranlogSearchCriteria = new TranlogSearchCriteria();
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
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }

  ngAfterViewInit() {
    this.search();
  }

  private clear() {
    this.searchCriteria = new TranlogSearchCriteria();
    const d = new Date();
    d.setDate(d.getDate() - 1);
    this.searchCriteria.beginDate = d;
    this.searchCriteria.endDate = new Date();
  }

  changeOrderType(event) {
  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
        if (this.stores && this.stores.length > 0) {
          this.selectedStore = this.stores[0];
          this.getMyStoreEmployees();
          this.storeSelected(this.selectedStore);
        }
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  public getMyStoreEmployees() {
    this.storeEmployees = [];
    if (this.selectedStore) {
      const parameters: string[] = [];
      parameters.push('e.store.id = |sId|' + this.selectedStore.id + '|Integer');
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
    const diff = Math.ceil((this.searchCriteria.endDate.getTime() - this.searchCriteria.beginDate.getTime()) / (1000 * 3600 * 24));
    console.log(diff);
    if (this.button.endsWith('clear')) {
      this.clear();
    } else if (!(diff >= 0 && diff <= 30)) {
      this.translate.get(['VALIDATION.INVALID_DATE_RANGE', 'COMMON.ERROR']).subscribe(res => {
        this.messages = res['VALIDATION.INVALID_DATE_RANGE'];
      });
    } else {
      this.appService.saveWithUrl('/service/order/tranlogs', this.searchCriteria)
        .subscribe((data: any[]) => {
          // console.log(data);
          this.tranlogsDatasource = new MatTableDataSource(data);
          this.tranlogsDatasource.paginator = this.paginator;
          this.tranlogsDatasource.sort = this.tranlogsSort;
        },
          error => console.log(error),
          () => console.log('Get tranlogs complete'));
    }
  }

  public applyFilter(filterValue: string) {
    this.tranlogsDatasource.filter = filterValue.trim().toLowerCase();
    if (this.tranlogsDatasource.paginator) {
      this.tranlogsDatasource.paginator.firstPage();
    }
  }

  getTranlog(tranlog: any) {
    this.selected.setValue(1);
    this.tranlogComponent.getTranlog(tranlog);
  }

  storeSelected(event) {
    this.getMyStoreEmployees();
    setTimeout(() => {
      this.searchCriteria.storeId = this.selectedStore.id;
      this.search();
    }, 500);
  }
}
