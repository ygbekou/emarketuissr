import { Component, OnInit, Input, ViewChild, QueryList } from '@angular/core';
import { Wallet, WalletTrans, User, Language, WalletTransDTO } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
declare var Stripe: any;

@Component({
  selector: 'app-wallet',
  templateUrl: './Wallet.component.html',
  styleUrls: ['./Wallets.component.scss']
})
export class WalletComponent extends BaseComponent implements OnInit {
  wltCols: string[] = ['date', 'type', 'amount', 'store'];
  wltDS: MatTableDataSource<WalletTransDTO>;
  @ViewChild(MatPaginator, { static: false }) wltPaginator;
  @ViewChild(MatSort, { static: true }) wltSort;

  @Input()
  wallet: Wallet = new Wallet();
  error: string;
  errors: string;
  messages = '';
  fromAdmin = false;
  @Input()
  userId;
  step = 1;

  // Credit card variables
  stripe: any;
  data: any;

  constructor(public appService: AppService, public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {

    if (this.userId === undefined) {
      this.userId = Number(this.appService.tokenStorage.getUserId());
    } else {
      this.fromAdmin = true;
    }
  }

  ngAfterViewInit() {

  }

  getWalletTransList(walletId: number) {
    this.appService.saveWithUrl('/service/finance/getWalletTransList/',
      {
        walletId: walletId
      })
      .subscribe((data: WalletTransDTO[]) => {

        let i = 0;
        for (const wl of data) {
          this.wltDS = new MatTableDataSource<WalletTransDTO>(data);
          this.wltDS.paginator = this.wltPaginator;
          this.wltDS.sort = this.wltSort;

          i++;
        }
      },
        error => console.log(error),
        () => console.log('Get wallet trans list complete'));
  }

}
