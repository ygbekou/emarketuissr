import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ChangeDetectorRef } from '@angular/core';

import { AppService } from '../../Services/app.service';
import { Order, User } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/app.constants';

@Component({
   selector: 'embryo-Cart',
   templateUrl: './Cart.component.html',
   styleUrls: ['./Cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewChecked {
   error: string;
   message: string;

   order: Order;
   products: any;
   user: User = new User();
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   popupResponse: any;
   @Input()
   currencyId: number;
   @Input() pickUp;
   @Output() orderCompleteEvent = new EventEmitter<Order>();

   constructor(public appService: AppService,
      private router: Router,
      private translate: TranslateService,
      private loadingBar: LoadingBarService,
      private cdRef: ChangeDetectorRef) {
      this.getUser(Number(this.appService.tokenStorage.getUserId()));
   }

   ngOnInit() {
   }


   getUser(userId: number) {
      this.appService.getOneWithChildsAndFiles(userId, 'User')
         .subscribe(result => {
            if (result.id > 0) {
               this.user = result;
            } else {
               this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                  this.error = res['MESSAGE.READ_FAILED'];
               });
            }
         });

   }
   ngAfterViewChecked(): void {
      this.cdRef.detectChanges();
   }

   public removeProduct(value: any) {
      const message = 'Are you sure you want to delete this product?';
      this.appService.confirmationPopup(message).
         subscribe(res => { this.popupResponse = res; },
            err => console.log(err),
            () => this.getPopupResponse(this.popupResponse, value)
         );
   }

   public getPopupResponse(response, value) {
      if (response) {
         this.appService.removeLocalCartProduct(value);
      }
   }

   public calculateProductSinglePrice(product: any, value: any) {
      product.quantity = value;
      const price = this.appService.calculateCartItemTotal(product);
      this.appService.recalculateCart(false);
      return price;
   }

   public calculateTotalPrice() {
      let subtotal = 0;
      if (this.appService.localStorageCartProducts && this.appService.localStorageCartProducts.length > 0) {
         for (const product of this.appService.localStorageCartProducts) {
            subtotal += this.calculateProductSinglePrice(product, product.quantity);
         }
         return subtotal;
      }
      return subtotal;

   }

   public getTotalPrice() {
      let total = 0;
      if (this.appService.localStorageCartProducts && this.appService.localStorageCartProducts.length > 0) {
         for (const product of this.appService.localStorageCartProducts) {
            total += (product.price * product.quantity);
         }
         total += (this.appService.shipping + this.appService.tax);
         return total;
      }

      return total;

   }

   public updateLocalCartProduct() {
      this.appService.updateAllLocalCartProduct(this.appService.localStorageCartProducts);
      this.router.navigate(['/checkout']);
   }

   public getQuantityValue(product) {
      if (product.quantity) {
         return product.quantity;
      } else {
         return 1;
      }
   }

   placeYourOrder() {
      const orderId = this.order ? this.order.id : null;
      this.order = new Order();
      this.order.id = orderId;
      this.order.products = this.appService.localStorageCartProductsMap[this.currencyId];
      this.order.total = this.appService.navbarCartTotalMap[this.currencyId];
      this.order.userId = this.user.id;
      this.order.language = this.appService.appInfoStorage.language;
      this.order.userAgent = this.appService.getUserAgent();
      if (!this.user.paymentMethodCode) {
         this.translate.get('VALIDATION.SELECT_PAYMENT_METHOD').subscribe(res => {
            this.error = res;
         });
      } else if (!this.user.billingAddress || !this.user.billingAddress.city) {
         this.translate.get('VALIDATION.SELECT_BILLING_ADDRESS').subscribe(res => {
            this.error = res;
         });
      } else if (this.pickUp === '0' && (!this.user.shippingAddress || !this.user.shippingAddress.city)) {
         this.translate.get('VALIDATION.SELECT_SHIPPING_ADDRESS').subscribe(res => {
            this.error = res;
         });
      } else {
         if (this.pickUp === '1') {
            this.order.shippingMethod = 'PICKUP';
            this.order.shippingCode = 'PICKUP';
         }
         this.appService.getIp()
            .subscribe((data1: any) => {
               this.order.ip = data1.ip;
               this.appService.timerCountDownPopup(Constants.ORDER_WAIT_TIME);
               this.appService.saveWithUrl('/service/order/proceedCheckout/', this.order)
                  .subscribe((data: Order) => {

                     this.appService.timerCountDownPopupClose();
                     this.order = data;
                     if (data.errors !== null && data.errors !== undefined) {
                        this.translate.get('MESSAGE.' + data.errors[0]).subscribe(res => {
                           this.error = res;
                        });
                        this.orderCompleteEvent.emit(this.order);
                     } else {
                        if (this.user.paymentMethodCode !== 'TMONEY') {
                           this.appService.completeOrder(+this.currencyId);
                           this.orderCompleteEvent.emit(this.order);
                        } else {
                           const url = data.paygateGlobalPaymentUrl.replace('BASE_URL', Constants.apiServer);
                           window.location.href = url;
                           return;
                        }
                     }

                  },
                     error => {
                        console.log(error);
                        this.appService.timerCountDownPopupClose();
                     },
                     () => console.log('Place Order complete'));

            }, error => console.log(error),
               () => console.log('Get IP complete'));

      }
   }

}
