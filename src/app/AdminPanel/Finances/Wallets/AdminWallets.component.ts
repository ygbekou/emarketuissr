import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../baseComponent';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { WalletDTO, Store, User, WalletSearchCriteria, Wallet } from 'src/app/app.models';
import { WalletComponent } from 'src/app/Pages/UserAccount/Wallets/Wallet.component';
import { AppService } from 'src/app/Services/app.service';
import { AdminWalletComponent } from './AdminWallet.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-admin-wallets',
  templateUrl: './AdminWallets.component.html',
  styleUrls: ['./AdminWallets.component.scss']
})
export class AdminWalletsComponent extends BaseComponent implements OnInit {
  walletsColumns: string[] = ['userName', 'currency', 'balance', 'actions'];
  walletsDatasource: MatTableDataSource<WalletDTO>;
  @ViewChild('MatPaginatorWallets', { static: true }) walletsPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) walletsSort: MatSort;

  @ViewChild(AdminWalletComponent, { static: false }) walletComponent: AdminWalletComponent;
  expandedElement: SearchResponse | null;
  messages = '';
  button = 'filter';

  @Input()
  userId: number;
  @Input() isAdminPage = false;

  searchCriteria: WalletSearchCriteria = new WalletSearchCriteria();
  stores: Store[] = [];
  users: User[] = [];
  colors = ['primary', 'secondary'];

  allStore = new Store();
  selected = new FormControl(0);

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.clear();
    this.isAdminPage = !this.userId
  }

  ngAfterViewInit() {
    this.searchCriteria.storeId = 0;
    this.searchCriteria.endDate = new Date();
    const beginDate = new Date();
    beginDate.setFullYear(this.searchCriteria.endDate.getFullYear() - 1);
    this.searchCriteria.beginDate = beginDate;
    if (this.isAdminPage) {
      //this.searchCriteria.status = 1;
    }
    this.search();
  }

  private clear() {
    this.searchCriteria = new WalletSearchCriteria();
  }

  changeOrderType(event) {
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

      //this.searchCriteria.userId = this.userId;
      this.appService.saveWithUrl('/service/finance/wallets', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.walletsDatasource = new MatTableDataSource(data);
          this.walletsDatasource.paginator = this.walletsPaginator;
          this.walletsDatasource.sort = this.walletsSort;
        },
          error => console.log(error),
          () => console.log('Get all wallet complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.walletsDatasource.filter = filterValue.trim().toLowerCase();
    if (this.walletsDatasource.paginator) {
      this.walletsDatasource.paginator.firstPage();
    }

  }

  getWalletDetails(wallet: WalletDTO) {
    this.walletComponent.wallet = wallet;
    this.walletComponent.getWalletTransList(wallet.id);
    this.selected.setValue(1);
  }


  public getShipperSearchPopupResponse(response: any, value: any) {
    if (response) {
      console.log('Value returned from comment popup... ');
      console.log(value);
      this.searchCriteria = value;
    }
  }

  openSearchPopup() {
    this.appService.userSearch(this.searchCriteria).
      subscribe(res => {

        console.log(res);
      },
        err => console.log(err),
        () => console.log('User search done... ')
      );

  }

}
