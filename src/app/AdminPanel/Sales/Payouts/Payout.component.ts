import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Payout, Store, SalesSummarySearchCriteria } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';
import { SalesSummariesIncludeComponent } from '../Summaries/SalesSummariesInclude.component';
import { MatStepper } from '@angular/material';


@Component({
  selector: 'app-payout',
  templateUrl: './Payout.component.html',
  styleUrls: ['./Payouts.component.scss']
})
export class PayoutComponent  extends BaseComponent implements OnInit {

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild(SalesSummariesIncludeComponent, { static: false }) salesSummariesIncludeComponent: SalesSummariesIncludeComponent;
  messages = '';
  payout: Payout = new Payout();
  constants: Constants = new Constants();
  stores: Store[] = [];
  formData: FormData;
  picture: any[] = [];

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
      super(translate);
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.payout.id = params.id;
        this.clear();
        this.getPayout(params.id);
      }
    });
  }

  clear() {
    this.payout = new Payout();
  }

  getPayout(payoutId: number) {
    if (payoutId > 0) {
      this.appService.getOneWithChildsAndFiles(payoutId, 'Payout')
        .subscribe(result => {
          if (result.id > 0) {
            this.payout = result;
            setTimeout(() => {
              this.salesSummariesIncludeComponent.selectedCurrency = this.payout.currency;
              this.salesSummariesIncludeComponent.setDataSource(this.payout.salesSummaryVOs, 'edit', this.payout.total);
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
    } else {
      this.payout = new Payout();
    }
  }

  save() {
    this.messages = '';
    this.setToggleValues();
    console.log(this.payout);
    this.payout.currency = this.payout.store.currency;

    this.payout.modBy = +this.appService.tokenStorage.getUserId();
    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }

    this.appService.saveWithFileUsingUrl('/service/order/savePayout/', this.payout, this.formData)
      .subscribe((data: Payout) => {
        this.processResult(data, this.payout, null);
        this.payout = data;
      },
        error => console.log(error),
        () => console.log('Get all getProductsForCategoryForSale complete'));
  }

  reverse() {
    this.payout.reversePayoutId = this.payout.id;
    this.payout.id = undefined;
    this.payout.total = -this.payout.total;
    this.save();
  }

  setToggleValues() {
    this.payout.status = (this.payout.status === null || this.payout.status === undefined
      || this.payout.status.toString() === 'false' || this.payout.status.toString() === '0') ? 0 : 1;
  }

  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }

  searchSalesSummaries() {

    if (this.salesSummariesIncludeComponent) {
      const searchCriteria = new SalesSummarySearchCriteria();
      searchCriteria.storeId = this.payout.store.id;
      searchCriteria.currencyId = this.payout.store.currency.id;
      searchCriteria.year = this.payout.year;

      this.salesSummariesIncludeComponent.searchCriteria = searchCriteria;
      this.salesSummariesIncludeComponent.selectedCurrency = this.payout.currency;
      this.salesSummariesIncludeComponent.search();
      this.stepper.selectedIndex = 1;
    }
  }

  updateTotalDue(payout: Payout) {
    console.log(this.payout);
      this.payout.total = payout.total;
      this.payout.salesSummaryIds = payout.salesSummaryIds;
   }
}
