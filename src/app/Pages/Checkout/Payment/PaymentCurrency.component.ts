import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../Services/app.service';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User, Address, CreditCard, Order, Currency } from 'src/app/app.models';
import { Constants } from 'src/app/app.constants';

@Component({
   selector: 'app-Payment-Currency',
   templateUrl: './PaymentCurrency.component.html',
   styleUrls: ['./Payment.component.scss']
})
export class PaymentCurrencyComponent implements OnInit, AfterViewInit {

   step = 0;
   isDisabledPaymentStepTwo = true;
   isDisabledPaymentStepThree = false;
   emailPattern: any = /\S+@\S+\.\S+/;
   paymentFormOne: FormGroup;

   user: User = new User();
   error: string;

   order: Order;
   orderTotal: number;
   pickUp: '0' | '1' = '0';

   @Input()
   currencyId: number;
   @Output() orderCompleteEvent = new EventEmitter<Order>();

   hasOrderSucceed: boolean;

   constructor(public appService: AppService,
      public router: Router,
      public translate: TranslateService
   ) {

      this.appService.removeBuyProducts();
      this.user.shippingAddress = new Address();
      this.user.billingAddress = new Address();
      this.user.creditCard = new CreditCard();
      this.getUser(Number(this.appService.tokenStorage.getUserId()));

   }

   ngOnInit() {



   }

   ngAfterViewInit() {

   }


   getUser(userId: number) {
      this.appService.getOneWithChildsAndFiles(userId, 'User')
         .subscribe(result => {
            if (result.id > 0) {
               this.user = result;
               if (this.user.paymentMethodCode === 'CREDIT_CARD') {
                  this.appService.getObject('/service/order/customer/' + userId + '/active_card')
                     .subscribe((data: CreditCard) => {
                        this.user.creditCard = data;
                     },
                        error => console.log(error),
                        () => console.log('Get user active CreditCard complete for userId=' + userId));
               } else if (this.user.paymentMethodCode === 'TMONEY') {
                  this.processPaymentConfirmation();
               }
            } else {
               this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                  this.error = res['MESSAGE.READ_FAILED'];
               });
            }
         });

   }


   public getCartProducts() {
      let total = 0;
      if (this.appService.localStorageCartProducts && this.appService.localStorageCartProducts.length > 0) {
         for (const product of this.appService.localStorageCartProducts) {
            if (!product.quantity) {
               product.quantity = 1;
            }
            total += (product.price * product.quantity);
         }
         total += (this.appService.shipping + this.appService.tax);
         return total;
      }
      this.orderTotal = total;
      return total;
   }


   isUserLoggedIn() {
      return this.appService.tokenStorage.getUserId() !== null;
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
         } else {
            this.order.shippingMethod = 'DELIVERY';
            this.order.shippingCode = 'DELIVERY';
         }
         this.appService.getIp()
            .subscribe((data1: any) => {
               this.order.ip = data1.ip;

               this.appService.timerCountDownPopup(Constants.ORDER_WAIT_TIME);
               console.log('before call');
               this.appService.saveWithUrl('/service/order/proceedCheckout/', this.order)
                  .subscribe((data: Order) => {
                     console.log(data);
                     this.appService.timerCountDownPopupClose();
                     this.order = data;
                     if (data.errors !== null && data.errors !== undefined) {
                        this.translate.get('MESSAGE.' + data.errors[0]).subscribe(res => {
                           this.error = res;
                        });
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
                        console.log('Error');
                        this.appService.timerCountDownPopupClose();
                     },
                     () => console.log('Place Order complete'));

            }, error => console.log(error),
               () => console.log('Get IP complete'));
      }
   }

   processPaymentConfirmation() {
      if (this.appService.getStoredOrderId() && this.appService.getStoredOrderId() > 0) {
         this.appService.saveWithUrl('/service/order/payment/confirm/', {
            'identifier': this.appService.getStoredOrderId()
         })
            .subscribe((data: Order) => {
               this.order = data;
               if (data.errors !== null && data.errors !== undefined) {
                  this.error = data.errors[0];
               } else {
                  this.appService.completeOrder(+this.currencyId);
                  this.orderCompleteEvent.emit(this.order);
               }
               this.appService.clearOrderId();
            },
               error => console.log(error),
               () => console.log('Changing Payment Method complete'));
      }
   }


   updateOrder(order: Order) {
      if (order.errors !== null && order.errors !== undefined) {
         this.translate.get('MESSAGE.' + order.errors[0]).subscribe(res => {
            this.error = res;
         });
      } else {
         this.orderCompleteEvent.emit(order);
      }
   }
}



