import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User, Address, CreditCard } from 'src/app/app.models';
import { MatStepper } from '@angular/material';

@Component({
   selector: 'app-Payment-DeliveryStepper',
   templateUrl: './PaymentDeliveryStepper.component.html',
   styleUrls: ['./Payment.component.scss']
})
export class PaymentDeliveryStepper implements OnInit, AfterViewInit {

   @ViewChild('stepper', { static: false }) stepper: MatStepper;

   step = 0;
   isDisabledPaymentStepTwo = true;
   isDisabledPaymentStepThree = false;
   emailPattern: any = /\S+@\S+\.\S+/;

   user: User = new User();
   error: string;
   @Input() pickUp: '0' | '1';
   @Output() setAllStepDone: EventEmitter<any> = new EventEmitter();

   constructor(public appService: AppService,
      public router: Router,
      public translate: TranslateService
   ) {

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
                     this.deliveryOptionChange(null);
                  },
                     error => console.log(error),
                     () => console.log('Get user active CreditCard complete for userId=' + userId));
            } else {
               this.deliveryOptionChange(null);
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

   deliveryOptionChange(event) {
      if (this.pickUp === '1') {
         if (this.hasAllPickupInfoSet()) {
            this.setAllStepDone.emit({status: true, deliveryMode: this.pickUp});
         } else {
            this.stepper.selectedIndex ++;
         }
      } else if (this.pickUp === '0') {
         if (this.hasAllDeliveryInfoSet()) {
            this.setAllStepDone.emit({status: true, deliveryMode: this.pickUp});
         } else {
            this.stepper.selectedIndex ++;
         }
      }
   }

   hasPaymentMethod() {
      return ((this.user.paymentMethodCode === 'CREDIT_CARD' && this.user.creditCard !== null)
         || (this.user.paymentMethodCode === 'FLOOZ' && this.user.tmoney.phoneNumber !== null)
         || (this.user.paymentMethodCode === 'TMONEY' && this.user.tmoney.phoneNumber !== null)
         )
   }

   hasAllDeliveryInfoSet() {
      return this.hasPaymentMethod()
         && this.user.shippingAddress !== null
            && this.user.billingAddress !== null;
   }

   hasAllPickupInfoSet() {
      return this.hasPaymentMethod()
            && this.user.billingAddress !== null;
   }

}



