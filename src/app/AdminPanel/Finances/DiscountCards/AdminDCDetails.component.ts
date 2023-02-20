import { Component, OnInit, Input, ViewChild, QueryList } from '@angular/core';
import { DiscountCardTransDTO, DiscountCardDTO, DCDetail } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
declare var Stripe: any;

@Component({
  selector: 'app-admin-dcdetails',
  templateUrl: './AdminDCDetails.component.html',
  styleUrls: ['./AdminDiscountCards.component.scss']
})
export class AdminDCDetailsComponent extends BaseComponent implements OnInit {
  dtlCols: string[] = ['qty', 'fraction', 'earnedPoints'];
  dtlDS: MatTableDataSource<DCDetail>;
  @ViewChild(MatPaginator, { static: false }) dtlPaginator;
  @ViewChild(MatSort, { static: true }) dtlSort;

  error: string;
  errors: string;
  messages = '';
  fromAdmin = false;
  @Input()
  userId;
  @Input()
  dct: DiscountCardTransDTO;
  step = 1;

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

  getDCDetailList(discountCardTransId: number) {
    this.appService.saveWithUrl('/service/finance/getDCTransDetails/',
      {
        discountCardTransId: discountCardTransId,
        transType: 'OO'
      })
      .subscribe((data: DCDetail[]) => {

        let i = 0;
        for (const wl of data) {
          this.dtlDS = new MatTableDataSource<DCDetail>(data);
          this.dtlDS.paginator = this.dtlPaginator;
          this.dtlDS.sort = this.dtlSort;

          i++;
        }
      },
        error => console.log(error),
        () => console.log('Get dicount card trans details complete'));
  }

}
