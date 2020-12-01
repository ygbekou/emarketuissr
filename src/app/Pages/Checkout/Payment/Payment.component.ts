import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { AppService } from '../../../Services/app.service';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User, Address, CreditCard, Order } from 'src/app/app.models';
import { Constants } from 'src/app/app.constants';

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
   offerCards: any = [
      {
         id: 1,
         name: 'Debit Card',
         content: 'Visa Mega Shopping Offer'
      },
      {
         id: 2,
         name: 'Credit Card',
         content: 'American Express 20% Flat'
      },
      {
         id: 3,
         name: 'Debit Card',
         content: 'BOA Buy 1 Get One Offer'
      },
      {
         id: 4,
         name: 'Master Card',
         content: 'Mastercard Elite Card'
      },
      {
         id: 5,
         name: 'Debit Card',
         content: 'Visa Mega Shopping Offer'
      }
   ];

   bankCardsImages: any = [
      {
         id: 1,
         image: 'assets/images/client-logo-1.png'
      },
      {
         id: 2,
         image: 'assets/images/client-logo-2.png'
      },
      {
         id: 3,
         image: 'assets/images/client-logo-3.png'
      },
      {
         id: 4,
         image: 'assets/images/client-logo-4.png'
      },
      {
         id: 5,
         image: 'assets/images/client-logo-5.png'
      }
   ];

   paymentFormOne: FormGroup;

   user: User = new User();
   error: string;

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
      // console.log('On init of cart');
      this.appService.recalculateCart(true);
   }

   ngAfterViewInit() {
      // console.log(this.appService.localStorageCartProducts);
   }


   getUser(userId: number) {
      this.appService.getOneWithChildsAndFiles(userId, 'User')
         .subscribe(result => {
            if (result.id > 0) {
               this.user = result;

               // this.user.addresss.forEach(address => {
               //    if (address.addressType === 1) {
               //       if (address.status === 1) {
               //          this.user.shippingAddress = address;
               //          return;
               //       }
               //    }
               //    if (address.addressType === 2) {
               //       if (address.status === 1) {
               //          this.user.billingAddress = address;
               //          return;
               //       }
               //    }
               //  });

               //  this.user.creditCards.forEach(creditCard => {
               //    if (creditCard.status === 1) {
               //       this.user.creditCard = creditCard;
               //       return;
               //    }
               //  });


               //  if (this.user.shippingAddress === undefined) {
               //    this.user.shippingAddress = new Address();
               //  }
               //   if (this.user.billingAddress === undefined) {
               //    this.user.billingAddress = new Address();
               //  }
               //  if (this.user.creditCard === undefined) {
               //    this.user.creditCard = new CreditCard();
               //  }
            } else {
               this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                  this.error = res['MESSAGE.READ_FAILED'];
               });
            }
         });

   }

   public setStep(index: number) {
      this.step = index;
      switch (index) {
         case 0:
            this.isDisabledPaymentStepTwo = true;
            this.isDisabledPaymentStepThree = true;
            break;
         case 1:
            this.isDisabledPaymentStepThree = false;
            break;
         default:

            break;
      }
   }

   public toggleRightSidenav() {
      this.appService.paymentSidenavOpen = !this.appService.paymentSidenavOpen;
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

   public submitPayment() {
      const userDetailsGroup = <FormGroup>(this.paymentFormOne.controls['user_details']);
      if (userDetailsGroup.valid) {
         switch (this.step) {
            case 0:
               this.step = 1;
               this.isDisabledPaymentStepTwo = false;
               break;
            case 1:
               this.step = 2;
               break;

            default:
               // code...
               break;
         }
      } else {
         this.isDisabledPaymentStepTwo = true;
         this.isDisabledPaymentStepThree = true;
         for (const i in userDetailsGroup.controls) {
            userDetailsGroup.controls[i].markAsTouched();
         }
      }
   }

   public selectedPaymentTabChange(value) {
      const paymentGroup = <FormGroup>(this.paymentFormOne.controls['payment']);

      paymentGroup.markAsUntouched();

      if (value && value.index === 1) {
         paymentGroup.controls['card_number'].clearValidators();
         paymentGroup.controls['user_card_name'].clearValidators();
         paymentGroup.controls['cvv'].clearValidators();
         paymentGroup.controls['expiry_date'].clearValidators();

         paymentGroup.controls['bank_card_value'].setValidators([Validators.required]);
      } else {

         paymentGroup.controls['card_number'].setValidators([Validators.required]);
         paymentGroup.controls['user_card_name'].setValidators([Validators.required]);
         paymentGroup.controls['cvv'].setValidators([Validators.required]);
         paymentGroup.controls['expiry_date'].setValidators([Validators.required]);

         paymentGroup.controls['bank_card_value'].clearValidators();
      }

      paymentGroup.controls['card_number'].updateValueAndValidity();
      paymentGroup.controls['user_card_name'].updateValueAndValidity();
      paymentGroup.controls['cvv'].updateValueAndValidity();
      paymentGroup.controls['expiry_date'].updateValueAndValidity();
      paymentGroup.controls['bank_card_value'].updateValueAndValidity();
   }

   public finalStep() {
      const paymentGroup = <FormGroup>(this.paymentFormOne.controls['payment']);
      if (paymentGroup.valid) {
         this.appService.addBuyUserDetails(this.paymentFormOne.value);
         this.router.navigate(['/checkout/final-receipt']);
      } else {
         for (const i in paymentGroup.controls) {
            paymentGroup.controls[i].markAsTouched();
         }
      }
   }

   isUserLoggedIn() {
      return this.appService.tokenStorage.getUserId() !== null;
   }


   placeYourOrder() {
      this.order = new Order();

      this.order.products = this.appService.localStorageCartProducts;
      this.order.total = this.appService.navbarCartTotal;
      this.order.userId = this.user.id;
      this.order.language = this.appService.appInfoStorage.language;

      this.appService.saveWithUrl('/service/order/proceedCheckout/', this.order)
         .subscribe((data: Order) => {
            // console.info("Saved Order");
            // console.info(this.order);
            // console.info(window.location.href);

            if (data.errors !== null && data.errors !== undefined) {
               this.error = data.errors[0];
            }

            if (this.user.paymentMethodCode === 'TMONEY') {
               const url = data.paygateGlobalPaymentUrl.replace('BASE_URL', Constants.apiServer);
               window.location.href = url;
               return;
            }
         },
            error => console.log(error),
            () => console.log('Changing Payment Method complete'));
   }
}



