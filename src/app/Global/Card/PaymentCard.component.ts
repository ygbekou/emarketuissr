import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CreditCard, User } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import CardUtils from 'src/app/Services/cardUtils';


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

  @Output() 
  cardSaveEvent = new EventEmitter<CreditCard>();


  constructor(
    public appService: AppService,
    public translate: TranslateService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {


  }

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
         this.appService.save(this.card, 'CreditCard')
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
