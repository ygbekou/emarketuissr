import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OrderStatus, StoreSearchCriteria, Store, Payout, PayoutSearchCriteria } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { FormControl } from '@angular/forms';
import { PayoutComponent } from './Payout.component';

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
  payoutColumns: string[] = ['payoutDate', 'storeName', 'year', 'total', 'proofPayoutId', 'dateAdded', 'id', 'reversePayoutId'];
  payoutDatasource: MatTableDataSource<Payout>;
  @ViewChild('MatPaginatorPayout', { static: true }) payoutPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) payoutSort: MatSort;

  @ViewChild(PayoutComponent, { static: false }) payoutComponent: PayoutComponent;
  expandedElement: SearchResponse | null;
  messages = '';
  button = 'filter';

  @Input()
  userId: number;

  searchCriteria: PayoutSearchCriteria = new PayoutSearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  paymentMethods: OrderStatus[];
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  selected = new FormControl(0);

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.clear();
    this.getStores();
    this.search();
  }

  private clear() {
    this.searchCriteria.userId = this.userId;
  }

  changeOrderType(payoutId: number) {
    this.payoutComponent.getPayout(payoutId);
    this.selected.setValue(1);
  }

  private getStores() {
    this.searchCriteria.userId = this.userId;
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
        this.payoutComponent.stores = this.stores;
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  search() {
    //this.setToggleValues();
    console.log(this.searchCriteria);
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

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

}
