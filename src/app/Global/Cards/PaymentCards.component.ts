import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CreditCard, PaymentMethodChangeVO, Tmoney } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import CardUtils from 'src/app/Services/cardUtils';

@Component({
  selector: 'app-PaymentCards',
  templateUrl: './PaymentCards.component.html',
  styleUrls: ['./PaymentCards.component.scss']
})
export class PaymentCardsComponent implements OnInit {

  displayedColumns: string[] = ['selected', 'image', 'cardNumber', 'name', 'expire', 'action'];
  creditCardsDataSource: MatTableDataSource<CreditCard>;
  selectedCard: CreditCard;

  panelOpenState = false;
  @Output()
  changePaymentMethodEvent = new EventEmitter<any>();

  creditCards: CreditCard[] = [];
  error: string;
  paymentMethodChange: PaymentMethodChangeVO = new PaymentMethodChangeVO();

  cardUtils = new CardUtils();

  constructor(public appService: AppService, public translate: TranslateService) {
  }

  ngOnInit() {

    this.creditCardsDataSource = new MatTableDataSource();
    this.getCreditCards();

  }

  public delete(cardId: string) {
    this.appService.saveWithUrl('/service/order/deleteCard',
      {
         userId: this.appService.tokenStorage.getUserId(),
         paymentMethodId: cardId
      })
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          this.getCreditCards();
        }
      });
  }

  getCreditCards() {
    const userId = Number(this.appService.tokenStorage.getUserId());
    if (userId > 0) {
      const parameters: string[] = [];
      parameters.push('e.user.id = |userId|' + userId + '|Integer');
      this.appService.getObject('/service/order/customer/' + userId + '/cards')
        .subscribe((data: CreditCard[]) => {
          this.creditCards = data;
          this.creditCardsDataSource = new MatTableDataSource(data);
          this.selectedCard = data[0];
        },
          error => console.log(error),
          () => console.log('Get all CreditCard complete for userId=' + userId));
    }
  }

  changePaymentMethod(creditCard: CreditCard) {

    this.paymentMethodChange.userId = Number(this.appService.tokenStorage.getUserId());
    this.paymentMethodChange.paymentMethodCodeId = creditCard.id;
    this.paymentMethodChange.paymentMethodCode = 'CREDIT_CARD';
    this.paymentMethodChange.stripePaymentMethodId = creditCard.stripePaymentMethodId;

    this.appService.saveWithUrl('/service/order/changePaymentMethod/', this.paymentMethodChange)
      .subscribe((data: any) => {
        this.getCreditCards();
        this.changePaymentMethodEvent.emit(data);
      },
        error => console.log(error),
        () => console.log('Changing Payment Method complete'));
  }

  updateTable(card: CreditCard) {

    const index = this.creditCardsDataSource.data.findIndex(x => x.id === card.id);

    if (index === -1) {
      this.creditCardsDataSource.data.push(card);
    } else {
      this.creditCardsDataSource.data[index] = card;
    }

    this.creditCardsDataSource.data = this.creditCardsDataSource.data.slice();
  }

}
