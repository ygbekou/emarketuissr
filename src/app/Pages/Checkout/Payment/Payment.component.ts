import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '../../../Services/app.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User, Address, CreditCard, Order } from 'src/app/app.models';

@Component({
   selector: 'app-Payment',
   templateUrl: './Payment.component.html',
   styleUrls: ['./Payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

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
      this.appService.recalculateCart(true);
   }

   ngAfterViewInit() {
      // this.getUser(Number(this.appService.tokenStorage.getUserId()));
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
         this.translate.get('MESSAGE.PARTIAL_ORDER_SUCCESS', { currency: order.currencyCode }).subscribe(res => {
            this.message = res;
         });
      }
   }

}



