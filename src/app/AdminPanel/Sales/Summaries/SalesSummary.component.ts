import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Payout, Store, SalesSummarySearchCriteria, PayoutVO, SalesSummary } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';
import { SalesSummariesIncludeComponent } from '../Summaries/SalesSummariesInclude.component';
import { MatStepper } from '@angular/material';
import { Location } from "@angular/common";


@Component({
  selector: 'app-sales-summary',
  templateUrl: './SalesSummary.component.html',
  styleUrls: ['./SalesSummaries.component.scss'] 
})
export class SalesSummaryComponent  extends BaseComponent implements OnInit {

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild(SalesSummariesIncludeComponent, { static: false }) salesSummariesIncludeComponent: SalesSummariesIncludeComponent;
  messages = '';
  payout: Payout = new Payout();
  salesSummary: SalesSummary = new SalesSummary();

  constants: Constants = new Constants();
  stores: Store[] = [];
  formData: FormData;
  picture: any[] = [];
  @Output() payoutSaveEvent = new EventEmitter<any>();

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
      super(translate);
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {

      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.salesSummary.id = params.id;
        this.clear();
        this.getPayout(params.id);
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/sales/payouts'));
    });

  }

  clear() {
    this.payout = new Payout();
    this.payout.status = 1;
  }

  getSalesSummary(salesSummaryId: number) {
    this.messages = '';
    if (salesSummaryId > 0) {
      this.appService.getOneWithChildsAndFiles(salesSummaryId, 'SalesSummary')
        .subscribe(result => {
          if (result.id > 0) {
            this.salesSummary = result;
          } else {
            this.salesSummary = new SalesSummary();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  getPayout(payoutId: number) {
    this.messages = '';
    if (payoutId > 0) {
      this.appService.getOneWithChildsAndFiles(payoutId, 'Payout')
        .subscribe(result => {
          if (result.id > 0) {
            this.payout = result;
            setTimeout(() => {
              this.salesSummariesIncludeComponent.selectedCurrency = this.payout.currency;
              this.salesSummariesIncludeComponent.setDataSource(this.payout.salesSummaryVOs, 'fromSalesSummaryDetails', this.payout.total);
            }, 500);

            const images: any[] = [];
            const image = {
                link: 'assets/images/payouts/' + this.payout.id + '/' + this.payout.image,
                preview: 'assets/images/payouts/' + this.payout.id + '/' + this.payout.image
            };
            images.push(image);
            this.picture = images;
          } else {
            this.payout = new Payout();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }

  acknowledgeSalesSummary() {
    this.messages = '';
    this.appService.saveWithUrl('/service/order/acknowledgeSalesSummary/', this.salesSummary)
      .subscribe((data: Payout) => {
        this.processResult(data, this.salesSummary, null);
        this.getSalesSummary(data.id);
        this.getPayout(this.payout.id);
      },
        error => console.log(error),
        () => console.log('Aknowledgement complete'));
  }
}
