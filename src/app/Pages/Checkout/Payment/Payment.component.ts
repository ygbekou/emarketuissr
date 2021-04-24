import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '../../../Services/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User, Address, CreditCard, Order } from 'src/app/app.models';
import { PaymentCurrencyComponent } from './PaymentCurrency.component';

@Component({
   selector: 'app-Payment',
   templateUrl: './Payment.component.html',
   styleUrls: ['./Payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

   @ViewChild(PaymentCurrencyComponent, { static: false }) paymentCurrencyComponent: PaymentCurrencyComponent;

   step = 0;
   isDisabledPaymentStepTwo = true;
   isDisabledPaymentStepThree = false;
   emailPattern: any = /\S+@\S+\.\S+/;
   paymentFormOne: FormGroup;

   user: User = new User();
   error: string;
   message: string;

   order: Order;
   orderTotal: number;
   allStepDone: boolean;
   deliveryMode: '0'|'1';

   constructor(public appService: AppService,
      public router: Router,
      public translate: TranslateService,
      private activatedRoute: ActivatedRoute
   ) {

      this.appService.removeBuyProducts();
      this.user.shippingAddress = new Address();
      this.user.billingAddress = new Address();
      this.user.creditCard = new CreditCard();
      this.getUser(Number(this.appService.tokenStorage.getUserId()));
   }

   ngOnInit() {
      this.deliveryMode = <'0' | '1'> window.localStorage.getItem('deliveryMode');
      if (!this.deliveryMode) {
         this.deliveryMode = '0';
         this.deliveryOptionChange(null);
      }

      this.appService.recalculateCart(true);
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
                        this.setAllStepDone();
                        this.redirectToUserInfo();
                     },
                        error => console.log(error),
                        () => console.log('Get user active CreditCard complete for userId=' + userId));
               } else {
                  //this.processPaymentConfirmation();
                  this.setAllStepDone();
                  this.redirectToUserInfo();
               }
            } else {
               this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                  this.error = res['MESSAGE.READ_FAILED'];
               });
            }
         });

   }

   isUserLoggedIn() {
      return this.appService.tokenStorage.getUserId() !== null;
   }


   updateOrder(order: Order) {
      this.order = order;
      this.message = '';
      console.log(this.appService.localStorageCartProducts);
      if (this.appService.localStorageCartProducts
         && this.appService.localStorageCartProducts.length > 1) {
            console.log('more products?');
         this.translate.get('MESSAGE.PARTIAL_ORDER_SUCCESS', { storeName: order.storeName }).subscribe(res => {
            this.message = res;
         });
      }
   }

   setAllStepDone() {
      if (this.deliveryMode === '1') {
         this.allStepDone = this.user.shippingAddress && this.user.shippingAddress.id
                  && this.user.billingAddress && this.user.billingAddress.id
            && ((this.user.creditCard !== null && this.user.creditCard.stripePaymentMethodId !== null)
               || (this.user.tmoney !== null && this.user.tmoney.id > 0)
               || (this.user.flooz !== null && this.user.flooz.id > 0));
      } else if (this.deliveryMode === '0') {
         this.allStepDone = this.user.billingAddress && this.user.billingAddress.id
            && ((this.user.creditCard !== null && this.user.creditCard.stripePaymentMethodId !== null)
               || (this.user.tmoney !== null && this.user.tmoney.id > 0)
               || (this.user.flooz !== null && this.user.flooz.id > 0));
      }
      //this.deliveryMode = deliveryInfo.deliveryMode;
   }


   deliveryOptionChange(event) {
      window.localStorage.setItem('deliveryMode', this.deliveryMode);
   }

   redirectToUserInfo() {
      if (this.deliveryMode && !this.user.shippingAddress && !this.user.billingAddress) {
         this.router.navigate(['/checkout/addresses'], { queryParams: {addressType: 0, fromPage: 'checkout'} });
      } else if (this.deliveryMode === '0' && !this.user.shippingAddress) {
         this.router.navigate(['/checkout/addresses'], { queryParams: {addressType: 1, fromPage: 'checkout'} });
      } else if (this.deliveryMode && !this.user.billingAddress) {
         this.router.navigate(['/checkout/addresses'], { queryParams: {addressType: 2, fromPage: 'checkout'} });
      } else if (this.deliveryMode && ((this.user.creditCard === null || !this.user.creditCard.stripePaymentMethodId)
               && (this.user.tmoney === null || this.user.tmoney.id <= 0)
               && (this.user.flooz === null || this.user.flooz.id <= 0))) {
         this.router.navigate(['/checkout/cards'], { queryParams: {fromPage: 'checkout'} });
      }
   }

}



