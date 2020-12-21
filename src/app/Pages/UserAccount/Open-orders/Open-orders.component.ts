import { Component, OnInit, Input } from '@angular/core';
import { OrderSearchCriteria, Order, OnlineOrderVO, ProductDescVO, OrderProduct, CartItem } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-open-orders',
  templateUrl: './Open-orders.component.html',
  styleUrls: ['./Open-orders.component.scss']
})
export class OpenOrdersComponent extends BaseComponent implements OnInit {
  messages = '';
  searchCriteria: OrderSearchCriteria;
  orders: OnlineOrderVO[] = [];
  products: ProductDescVO[] = [];
  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.getOpenOrders();
    this.getBoughtProducts();
  }
  getOpenOrders() {
    this.messages = '';
    this.searchCriteria = new OrderSearchCriteria();
    this.searchCriteria.orderType = 0;
    this.searchCriteria.miscText1 = "'PENDING','PROCESSING','PROCESSED','SHIPPED'";
    this.searchCriteria.userId = Number(this.appService.tokenStorage.getUserId());
    this.searchCriteria.langId = this.appService.appInfoStorage.language.id;
    console.log(this.searchCriteria);
    this.appService.saveWithUrl('/service/order/onlineOrders', this.searchCriteria)
      .subscribe((data: any[]) => {
        this.orders = data;
        console.log(data);
        if (data.length > 0) {
          for (const o of this.orders) {
            this.setOrderDetails(o);
          }
        } else {
          this.translate.get(['MESSAGE.NO_OPEN_ORDER', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
            this.messages = res['MESSAGE.NO_OPEN_ORDER'];
          });
        }
      },
        error => console.log(error),
        () => console.log('Get all Orders complete'));
  }

  setOrderDetails(order: OnlineOrderVO) {
    this.appService.getOneWithChildsAndFiles(order.orderId, 'Order')
      .subscribe(result => {
        if (result.id > 0) {
          order.orderProducts = result.orderProducts;
        }
      });
  }

  getBoughtProducts() {
    this.appService.getObjects('/service/catalog/getBoughtProducts/' +
      this.appService.appInfoStorage.language.id
      + '/' + this.appService.tokenStorage.getUserId() + '/10')
      .subscribe((data: ProductDescVO[]) => {
        this.products = data;
      },
        error => console.log(error),
        () => console.log('Get all getBoughtProducts complete'));
  }


  public addToCart(orderProduct: OrderProduct) {
    this.appService.getObject('/service/catalog/getProductOnSale/' +
      this.appService.appInfoStorage.language.id + '/' + orderProduct.ptsId)
      .subscribe((data: ProductDescVO) => {
        console.log(data);
        const ci = new CartItem(data);
        ci.quantity = 1;
        this.appService.addToCart(ci);
      },
        (error) => console.log(error),
        () => console.log('Get all getProductOnSale complete'));
  }

  public addPrdToCart(value) {
    const ci = new CartItem(value);
    ci.quantity = 1;
    this.appService.addToCart(ci);
  }

  public cancel(orderId: number) {
    const order = new Order();
    order.id = orderId;
    const index: number = this.orders.findIndex((ord) => ord.orderId === order.id);

    this.appService.saveWithUrl('/service/order/cancelOrder/', order)
      .subscribe((data: Order) => {
        if (data.errors) {
          // there was an issue.
          console.log(data.errors);
        } else {
          if (index !== -1) {
            this.orders.splice(index, 1);
          }
        }
      },
        error => {
          console.log(error);
        },
        () => console.log('Cancel order complete'));
  }

}
