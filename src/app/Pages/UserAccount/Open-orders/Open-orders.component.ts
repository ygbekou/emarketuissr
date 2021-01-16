import { Component, OnInit, Input } from '@angular/core';
import { OrderSearchCriteria, Order, OnlineOrderVO, ProductDescVO, OrderProduct, CartItem, ProductSearchCriteria } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { Router } from '@angular/router';

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
    public router: Router,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    console.log('login : ' + this.appService.tokenStorage.getUserId());
    if (!this.appService.tokenStorage.getUserId()) {
      console.log('navigating.. to signin');
      this.router.navigate(['/session/signin'],
        { queryParams: { fromPage: '/account/open-orders' } });
    } else {
      this.getOpenOrders();
      this.getBoughtProducts();
    }
  }
  getOpenOrders() {
    this.messages = '';
    this.searchCriteria = new OrderSearchCriteria();
    this.searchCriteria.orderType = 0;
    this.searchCriteria.miscText1 = "'PENDING','PROCESSING','PROCESSED','SHIPPED'";
    this.searchCriteria.miscNum1 = Number(this.appService.tokenStorage.getUserId());
    this.searchCriteria.langId = this.appService.appInfoStorage.language.id;
    console.log(this.searchCriteria);
    this.appService.saveWithUrl('/service/order/onlineOrders', this.searchCriteria)
      .subscribe((data: any[]) => {
        this.orders = data;
        // console.log(data);
        if (data.length > 0) {
          // for (const o of this.orders) {
          //   this.setOrderDetails(o);
          // }
          // console.log(this.orders);
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
    this.appService.saveWithUrl('/service/catalog/getBoughtProducts/', new ProductSearchCriteria(
      this.appService.appInfoStorage.language.id, 0, 0, 0, '0', 1, 0, 10, Number(this.appService.tokenStorage.getUserId())
    ))
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
        // console.log(data);
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

  public cancel() {
    this.router.navigate(['/checkout']);
  }

}
