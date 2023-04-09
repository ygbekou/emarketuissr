import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Bill, BillPayment, StoreEmployee, User, Store } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
declare var Stripe: any;

@Component({
   selector: 'app-userbill-payment',
   templateUrl: './UserBillPayment.component.html',
   styleUrls: ['./Bills.component.scss']
})

export class UserBillPaymentComponent extends BaseComponent implements OnInit, AfterViewInit {

   @Input() store = new Store();
   @Output() payEvent = new EventEmitter<any>();
   messages = '';

   bill: Bill = new Bill();
   billPayment = new BillPayment();
   billPayments: BillPayment[] = [];
   saving = false;
   justSubmitted = false;

   storeEmployees: StoreEmployee[] = [];
   selectedPurchaser: User;

   isFromAdmin = true;
   hasError = false;
   totalDue = 0;

   // Credit card variables
   stripe: any;
   data: any;

   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }
   ngAfterViewInit(): void {
   }

   ngOnInit() {
      this.clear([]);
   }

   clear(data) {
      this.messages = '';
      this.billPayment = new BillPayment();
      this.billPayment.paymentDate = new Date();
   }

   setBillPaymentInfo(result: any) {
      this.billPayment.bill = this.bill;
      this.billPayment.dueDate = new Date();
      this.billPayment.paymentDate = new Date();
      this.billPayment.modifiedBy = + this.appService.tokenStorage.getUserId();
      this.billPayment.language = this.appService.appInfoStorage.language;
      if (result) {
         this.billPayment.stripePaymentMethodId = result.paymentMethod.id;
      }
   }

   pay(result: any) {
      this.errors = '';
      this.messages = '';

      this.setBillPaymentInfo(result);

      this.appService.saveWithUrl('/service/finance/payBillOnline',
         this.billPayment)
         .subscribe((savedBillPayment: BillPayment) => {
            console.log(savedBillPayment);
            if (savedBillPayment.errors === null || savedBillPayment.errors.length === 0) {
               if (savedBillPayment.status === 1) {
                  this.translate.get(['MESSAGE.PAYMENT_UNSUCCESS']).subscribe(res => {
                     this.errors = res['MESSAGE.PAYMENT_UNSUCCESS'];
                  });
               } else {
                  this.translate.get('MESSAGE.PAYMENT_SUCCESS', {
                  pay_amount: this.appService.formatAmount(savedBillPayment.amount, this.store.currency)
               }).subscribe(res => {
                     this.messages = res;
                  });

                  setTimeout(() => {
                     this.initPaymentMethod();
                     this.billPayment.nameOnCard = '';
                  }, 0);

                  this.payEvent.emit(true);
               }
            } else {
               this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
               });
            }
         });

   }

   onTogglePmntMethodChange($event) {
      this.billPayment.paymentMethodCode = $event.value;
      if ($event.value === 'CREDIT_CARD') {
         setTimeout(() => {
            this.initPaymentMethod();
         }, 0);
      }
   }

   initPaymentMethod() {
      this.appService.getObject('/service/order/stripe-key').toPromise()
         .then(result => {
            return result;
         })
         .then(data => {
            return this.setupElements(data);
         })
         .then(data => {
            this.data = data;
            document.querySelector('button').disabled = false;

            const form = document.getElementById('payment-form');
            form.addEventListener('submit', this.handleCardSave.bind(this));
         });
   }

   setupElements(data) {
      this.stripe = Stripe(data.publishableKey);

      /* ------- Set up Stripe Elements to use in checkout form ------- */
      const elements = this.stripe.elements();
      const style = {
         base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
               color: '#aab7c4'
            }
         },
         invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
         }
      };

      const card = elements.create('card', { style: style });
      card.mount('#card-element');

      return {
         stripe: this.stripe,
         card: card,
         clientSecret: data.clientSecret
      };
   }

   handleCardSave(event) {
      event.preventDefault();
      this.saveCard(this.data.stripe, this.data.card, this.data.clientSecret);
   }

   saveCard(stripe, card, clientSecret) {
      this.errors = '';
      this.messages = '';
      stripe
         .createPaymentMethod('card', card)
         .then(result => {
            if (result.error) {
               this.translate.get(['MESSAGE.INVALID_CARD', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.INVALID_CARD'];
               });
               console.log('Error: ' + result.error);
               // showError(result.error.message);
            } else {
               this.billPayment.paymentMethodCode = 'CREDIT_CARD';
               this.billPayment.paymentMethodName = 'Credit Card';
               this.billPayment.stripePaymentMethodId = result.paymentMethod.id;
               this.pay(null);
            }
         })
         .then(function (result) {
            console.log(result);
            if (result) {
               return result.json();
            }
         })
         .then(function (response) {
            if (response && response.error) {
               // showError(response.error);
            } else if (response && response.requiresAction) {
               // Request authentication
               // handleAction(response.clientSecret);
            } else {
               // orderComplete(response.clientSecret);
            }
         });
   }
}
