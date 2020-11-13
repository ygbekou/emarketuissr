import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CreditCard, User } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import CardUtils from 'src/app/Services/cardUtils';

declare var Stripe: any;

@Component({
  selector: 'app-PaymentCard',
  templateUrl: './PaymentCard.component.html',
  styleUrls: ['./PaymentCard.component.scss']
})
export class PaymentCardComponent implements OnInit {

  card: CreditCard = new CreditCard();
  user: User = new User();
  messages: string;
  errors: string;
  creditCardBackground = 'background-image: url(assets/images/cards/card-edit.png)';
  stripe: any;

  data: any;

  @Output() 
  cardSaveEvent = new EventEmitter<CreditCard>();


  constructor(
    public appService: AppService,
    public translate: TranslateService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {

   //this.user.id = this.appService.tokenStorage.getUserId() ;

   this.initPaymentMethod();


  }

   initPaymentMethod() {
      this.appService.getObject('/service/catalog/stripe-key').toPromise()
   .then(result => {
      return result;
  })
  .then(data => {
    return this.setupElements(data);
  })
  .then(data => {
     console.info(data);
     this.data = data;
    document.querySelector('button').disabled = false;

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', this.handleCardSave.bind(this));
  });
   }


   handleCardSave(event) {
      event.preventDefault();
      this.saveCard(this.data.stripe, this.data.card, this.data.clientSecret); 
   }

   setupElements (data) {
      this.stripe = Stripe(data.publishableKey);

      /* ------- Set up Stripe Elements to use in checkout form ------- */
      var elements = this.stripe.elements();
      var style = {
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

      var card = elements.create('card', { style: style });
      card.mount('#card-element');

      return {
         stripe: this.stripe,
         card: card,
         clientSecret: data.clientSecret
      };
   };


   /*
   * Collect card details and pay for the order
   */
   saveCard(stripe, card, clientSecret) {
      // changeLoadingState(true);
      
      // Collects card details and creates a PaymentMethod
      stripe
         .createPaymentMethod('card', card)
         .then(result => {
            if (result.error) {
               //showError(result.error.message);
            } else {
               this.saveCustomer(result)
            }
         })
         .then(function(result) {
            return result.json();
         })
         .then(function(response) {
            if (response.error) {
               //showError(response.error);
            } else if (response.requiresAction) {
               // Request authentication
               //handleAction(response.clientSecret);
            } else {
               ///orderComplete(response.clientSecret);
            }
         });
   };


   saveCustomer(result) {
      // changeLoadingState(true);
 
      this.appService.saveWithUrl('/service/catalog/attachPaymentMethodToCustomer', 
      {userId: this.appService.tokenStorage.getUserId(), paymentMethodId: result.paymentMethod.id})
         .subscribe(result => {
            if (result.result === 'SUCCESS') {
               alert('Here ...')
            } else {
               this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
               });
            }
         });
      
   };




  /**
    * Function is used to submit the profile card.
    * If form value is valid, redirect to card page.
    */
   submitCard() {
      this.messages = '';
      this.errors = '';
      this.user.id = +this.appService.tokenStorage.getUserId();
      this.card.user = this.user
      this.card.cardType = CardUtils.getCardType(this.card);
      if (this.card.cardType === '') {
         this.translate.get(['MESSAGE.INVALID_CARD', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.INVALID_CARD'];
         });
      } else {
         this.appService.saveWithUrl('/service/catalog/save_creditcard', this.card)
            .subscribe(result => {
               if (result.id > 0) {
                  this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                     this.messages = res['MESSAGE.SAVE_SUCCESS'];
                     this.cardSaveEvent.emit(result);
                     this.card = new CreditCard();
                  });
               } else {
                  this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                     this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
                  });
               }
            });
      }
   }

   getBackground() {
      this.creditCardBackground = 'background-image: url(assets/images/cards/'
         + this.card.cardNumber.substring(0, 1) + '.png)';
      return this.sanitizer.bypassSecurityTrustStyle(`url(${this.creditCardBackground})`);
   }
}
