import { Component, OnInit, Input } from '@angular/core';
import { Order, CancellationReason, OrderSearchCriteria, OnlineOrderVO } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-cancel',
  templateUrl: './OrderCancel.component.html',
  styleUrls: ['./OrderCancel.component.scss']
})
export class OrderCancelComponent extends BaseComponent implements OnInit {

  cancellationReasons: CancellationReason[];
  messages = '';
  errors = '';
  searchCriteria: OrderSearchCriteria;

  @Input() reviewType: string;

  order: OnlineOrderVO;
  canEdit = false;
  cancellationReason;

  action = 'cancelling';
  isAdmin = false;

  constructor(public appService: AppService,
      public translate: TranslateService,
      private activatedRoute: ActivatedRoute) {
    super(translate);
  }

  ngOnInit() {

    this.getCancellationReasons();
    this.activatedRoute.data.subscribe(value => {
      this.isAdmin = (value && value.expectedRole && value.expectedRole[0] === 'Administrator');
    });

    this.activatedRoute.params.subscribe(params => {
      this.getOrder(params.orderId);
    });
  }


  public getOrder(id: number) {
    this.searchCriteria = new OrderSearchCriteria();
    this.searchCriteria.orderId = id;
    this.searchCriteria.langId = this.appService.appInfoStorage.language.id;
    this.appService.saveWithUrl('/service/order/onlineOrders', this.searchCriteria)
      .subscribe((data: any[]) => {
        this.order = data[0];
        if (data.length > 0) {
          console.log(this.order)
        } else {
          this.translate.get(['MESSAGE.NO_OPEN_ORDER', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
            this.messages = res['MESSAGE.NO_OPEN_ORDER'];
          });
        }
      },
        error => console.log(error),
        () => console.log('Get all Order complete'));
  }

  getCancellationReasons() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |langId|' + this.appService.appInfoStorage.language.id + '|Integer');
    this.appService.getAllByCriteria('CancellationReason', parameters)
      .subscribe((data: CancellationReason[]) => {
        this.cancellationReasons = data;
      },
    error => console.log(error),
    () => console.log('Get all CancellationReasons complete'));
  }


  public cancel() {
    const order = new Order();
    order.id = this.order.orderId;
    order.cancellationReason = this.cancellationReason;

    this.appService.saveWithUrl('/service/order/cancelOrder/', order)
      .subscribe((data: Order) => {
        if (data.errors) {
          // there was an issue.
          this.errors = data.errors[0];
        } else {
          this.action = 'cancelled';
        }
      },
        error => {
          console.log(error);
        },
        () => console.log('Cancel order complete'));
  }

}
