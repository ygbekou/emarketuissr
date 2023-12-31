import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Payout, Store, SalesSummarySearchCriteria, PayoutVO } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';
import { SalesSummariesIncludeComponent } from '../Summaries/SalesSummariesInclude.component';
import { MatStepper } from '@angular/material';
import { Location } from "@angular/common";
import { DeliveriesSummariesIncludeComponent } from './DeliveriesSummariesInclude.component';


@Component({
  selector: 'app-payout', 
  templateUrl: './Payout.component.html',
  styleUrls: ['./Payouts.component.scss']
})
export class PayoutComponent extends BaseComponent implements OnInit {

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild(SalesSummariesIncludeComponent, { static: false }) salesSummariesIncludeComponent: SalesSummariesIncludeComponent;
  @ViewChild(DeliveriesSummariesIncludeComponent,
      { static: false }) deliveriesSummariesIncludeComponent: DeliveriesSummariesIncludeComponent;
  messages = '';
  payout: Payout = new Payout();
  constants: Constants = new Constants();
  stores: Store[] = [];
  formData: FormData;
  picture: any[] = [];
  @Output() payoutSaveEvent = new EventEmitter<any>();

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Input() type = 'sale';

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
        this.payout.id = params.id;
        this.clear();
        this.getPayout(params.id);
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });
  }

  clear() {
    this.payout = new Payout();
    this.payout.status = 1;
  }

  getPayout(payoutId: number, clearMessages = true) {

    if (clearMessages) {
      this.messages = '';
    }

    if (payoutId > 0) {
      this.appService.getOneWithChildsAndFiles(payoutId, 'Payout')
        .subscribe(result => {
          if (result.id > 0) {
            this.payout = result;
            this.payout.payoutDate = new Date(this.payout.payoutDate);
            setTimeout(() => {
              if (this.type === 'sale' && !this.payout.reversePayoutId) {
                this.salesSummariesIncludeComponent.selectedCurrency = this.payout.currency;
                this.salesSummariesIncludeComponent.setDataSource(this.payout.salesSummaryVOs, 'edit', this.payout.total);
              }

              if (this.type === 'delivery' && !this.payout.reversePayoutId) {
                this.deliveriesSummariesIncludeComponent.selectedCurrency = this.payout.currency;
                this.deliveriesSummariesIncludeComponent.setDataSource(this.payout.deliveriesSummaryVOs, 'edit', this.payout.total);
              }
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
      this.payout.status = 1;
    }
  }

  save() {
    this.messages = '';
    if (this.type === 'sale') {
      this.payout.currency = this.payout.store.currency;
    }

    this.payout.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (this.type === 'delivery' && this.payout.shipperId) {
      this.payout.shipper.id = this.payout.shipperId;
    }

    if (!this.payout.id) {
      this.payout.payer.id = +this.appService.tokenStorage.getUserId();
    }
    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }

    this.appService.saveWithFileUsingUrl('/service/order/savePayout/', this.payout, this.formData)
      .subscribe((data: Payout) => {
        this.processResult(data, this.payout, null);
        this.payout = data;
        this.payoutSaveEvent.emit(new PayoutVO(this.payout));
      },
        error => console.log(error),
        () => console.log('Get all getProductsForCategoryForSale complete'));
  }

  saveSimple() {
    this.messages = '';
    try {
      this.appService.save(this.payout, 'Payout')
        .subscribe(data => {
          this.processResult(data, this.payout, null);
          this.payout = data;
          this.payoutSaveEvent.emit(new PayoutVO(this.payout));
        });
    } catch (e) {
      console.log(e);
    }
  }

  reverse() {
    this.payout.reversePayoutId = this.payout.id;
    this.payout.id = undefined;
    this.payout.status = 3;
    this.payout.total = -this.payout.total;
    this.payout.salesSummarys = [];
    this.save();
  }

  acknowledge() {
    this.payout.status = 2;
    this.payout.salesSummarys = [];
    this.saveSimple();
  }


  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';
    return val.length === 0;
  }

  searchSalesSummaries() {
    if (this.salesSummariesIncludeComponent) {
      this.payout.total = 0;
      const searchCriteria = new SalesSummarySearchCriteria();
      searchCriteria.storeId = this.payout.store.id;
      searchCriteria.currencyId = this.payout.store.currency.id;
      searchCriteria.year = this.payout.year;
      searchCriteria.totalDueGreaterThan = 0;
      searchCriteria.status = 1;
      this.salesSummariesIncludeComponent.searchCriteria = searchCriteria;
      this.salesSummariesIncludeComponent.selectedCurrency = this.payout.store.currency;
      this.salesSummariesIncludeComponent.search();
      this.stepper.selectedIndex = 1;
    }
  }

  searchDeliveriesSummaries() {
    if (this.deliveriesSummariesIncludeComponent) {
      this.payout.total = 0;
      const searchCriteria = new SalesSummarySearchCriteria();
      searchCriteria.storeId = this.payout.store.id;
      searchCriteria.currencyId = this.payout.store.currency.id;
      searchCriteria.year = this.payout.year;
      searchCriteria.totalDueGreaterThan = 0;
      searchCriteria.status = 1;
      this.deliveriesSummariesIncludeComponent.searchCriteria = searchCriteria;
      this.deliveriesSummariesIncludeComponent.selectedCurrency = this.payout.store.currency;
      this.deliveriesSummariesIncludeComponent.search();
      this.stepper.selectedIndex = 1;
    }
  }

  updateTotalDue(payout: Payout) {
    this.payout.total = payout.total;
    this.payout.salesSummaryIds = payout.salesSummaryIds;
    this.payout.deliveriesSummaryIds = payout.deliveriesSummaryIds;
    this.payout.currency = payout.currency;
  }

  openSearchPopup() {
    this.appService.shipperSearch(this.payout).
      subscribe(res => {
        console.log(res);
      },
        err => console.log(err),
        () => console.log('Shipper search done... ')
      );

  }
}
