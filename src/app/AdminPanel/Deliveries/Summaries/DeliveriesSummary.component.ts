import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Payout, Store, SalesSummarySearchCriteria, PayoutVO, DeliveriesSummary, Order, OrderSearchCriteria } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';
import { MatStepper, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Location } from "@angular/common";
import { DeliveriesSummariesIncludeComponent } from '../../Sales/Payouts/DeliveriesSummariesInclude.component';


@Component({
  selector: 'app-deliveries-summary',
  templateUrl: './DeliveriesSummary.component.html',
  styleUrls: ['./DeliveriesSummaries.component.scss']
})
export class DeliveriesSummaryComponent extends BaseComponent implements OnInit {

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild(DeliveriesSummariesIncludeComponent, { static: false })
  deliveriesSummariesIncludeComponent: DeliveriesSummariesIncludeComponent;

  onlineOrdersColumns: string[] = ['id', 'storeName', 'customer', 'status', 'shippingCost', 'city', 'country', 'dateAdded'];
  onlineOrdersDS: MatTableDataSource<Order>;
  @ViewChild('MatPaginatorOnlineOrders', { static: true }) onlineOrdersPG: MatPaginator;
  @ViewChild(MatSort, { static: true }) onlineOrdersST: MatSort;
  searchCriteria: OrderSearchCriteria;

  messages = '';
  payout: Payout = new Payout();
  deliveriesSummary: DeliveriesSummary = new DeliveriesSummary();

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
    this.searchCriteria = new OrderSearchCriteria();
    this.activatedRoute.params.subscribe(params => {

      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.deliveriesSummary.id = params.id;
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

  getDeliveriesSummary(deliveriesSummaryId: number) {
    this.messages = '';
    if (deliveriesSummaryId > 0) {
      this.search(deliveriesSummaryId);
      this.appService.getOneWithChildsAndFiles(deliveriesSummaryId, 'DeliveriesSummary')
        .subscribe(result => {
          if (result.id > 0) {
            this.deliveriesSummary = result;
          } else {
            this.deliveriesSummary = new DeliveriesSummary();
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
              this.deliveriesSummariesIncludeComponent.selectedCurrency = this.payout.currency;
              this.deliveriesSummariesIncludeComponent.setDataSource(this.payout.deliveriesSummaryVOs,
                'fromDeliveriesSummaryDetails', this.payout.total);
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

  acknowledgeDeliveriesSummary() {
    this.messages = '';
    this.deliveriesSummary.acknowledger.id = +this.appService.tokenStorage.getUserId();
    this.deliveriesSummary.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/order/acknowledgeSalesSummary/', this.deliveriesSummary)
      .subscribe((data: Payout) => {
        this.processResult(data, this.deliveriesSummary, null);
        this.getDeliveriesSummary(data.id);
        this.getPayout(this.payout.id);
      },
        error => console.log(error),
        () => console.log('Aknowledgement complete'));
  }

  search(deliveriesSummaryId: number) {
    this.messages = '';
    this.searchCriteria.deliveriesSummaryId = deliveriesSummaryId;
    this.searchCriteria.langId = this.appService.appInfoStorage.language.id;
    this.appService.saveWithUrl('/service/order/onlineOrders', this.searchCriteria)
      .subscribe((data: any[]) => {
        this.onlineOrdersDS = new MatTableDataSource(data);
        this.onlineOrdersDS.paginator = this.onlineOrdersPG;
        this.onlineOrdersDS.sort = this.onlineOrdersST;
      },
        error => console.log(error),
        () => console.log('Get all Orders complete'));

  }

}
