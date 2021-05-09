import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OrderStatus, StoreSearchCriteria, Store, Payout, PayoutSearchCriteria, PayoutVO } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { FormControl } from '@angular/forms';
import { PayoutComponent } from './Payout.component';
import { ActivatedRoute } from '@angular/router';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-payouts',
  templateUrl: './Payouts.component.html',
  styleUrls: ['./Payouts.component.scss']
})
export class PayoutsComponent extends BaseComponent implements OnInit {
  payoutColumns: string[] = ['id', 'payoutDate', 'storeName', 'year', 'total', 'proofPayoutId', 'dateAdded', 'reversePayoutId'];
  payoutDatasource: MatTableDataSource<PayoutVO>;
  @ViewChild('MatPaginatorPayout', { static: true }) payoutPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) payoutSort: MatSort;

  @ViewChild(PayoutComponent, { static: false }) payoutComponent: PayoutComponent;
  expandedElement: SearchResponse | null;
  messages = '';
  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = true;
  @Input() canAcknowledge = false;

  searchCriteria: PayoutSearchCriteria = new PayoutSearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  paymentMethods: OrderStatus[];
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  selected = new FormControl(0);

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || +params.id === 0) {
        setTimeout(() => {
          this.selected.setValue(0);
          this.searchCriteria.storeId = 0;
          this.clear();
          this.getStores();
          this.search();
        }, 500);
      } else {
        setTimeout(() => {
          this.changeOrderType(params.id);
        }, 500);
      }
    });

  }


  private clear() {
    this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.searchCriteria = new PayoutSearchCriteria();
  }

  changeOrderType(payoutId: number) {
    this.payoutComponent.isAdminPage = this.isAdminPage;
    this.payoutComponent.canAcknowledge = this.canAcknowledge;
    this.payoutComponent.getPayout(payoutId);
    this.selected.setValue(1);
  }

  private getStores() {
    this.storeSearchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
        this.payoutComponent.stores = this.stores;
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

      this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
      this.appService.saveWithUrl('/service/order/payouts', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.payoutDatasource = new MatTableDataSource(data);
          this.payoutDatasource.paginator = this.payoutPaginator;
          this.payoutDatasource.sort = this.payoutSort;
        },
          error => console.log(error),
          () => console.log('Get all payout complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.payoutDatasource.filter = filterValue.trim().toLowerCase();
    if (this.payoutDatasource.paginator) {
      this.payoutDatasource.paginator.firstPage();
    }

  }


  setToggleValues() {
    this.searchCriteria.status = (this.searchCriteria.status === null || this.searchCriteria.status === undefined
      || this.searchCriteria.status.toString() === 'false' || this.searchCriteria.status.toString() === '0') ? 0 : 1;
  }

  updateDataTable(payoutVo: PayoutVO) {
    this.payoutDatasource.data.unshift(payoutVo);
    this.payoutDatasource = new MatTableDataSource(this.payoutDatasource.data);
    this.payoutDatasource.paginator = this.payoutPaginator;
    this.payoutDatasource.sort = this.payoutSort;

    this.payoutComponent.getPayout(payoutVo.id);
  }

}
