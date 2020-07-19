import { Component, OnInit } from '@angular/core';
import { CreditCard } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cards',
  templateUrl: './Cards.component.html',
  styleUrls: ['./Cards.component.scss']
})
export class CardsComponent implements OnInit {

  creditCards: CreditCard[] = [];
  error: string;
  constructor(public appService: AppService, public translate: TranslateService) {
  }

  ngOnInit() {

    this.getCreditCards();

  }

  public delete(cardId: number) {
    this.appService.delete(cardId, 'com.softenza.emarket.model.CreditCard')
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
      this.appService.getAllByCriteria('com.softenza.emarket.model.CreditCard', parameters)
        .subscribe((data: CreditCard[]) => {
          this.creditCards = data;
        },
          error => console.log(error),
          () => console.log('Get all CreditCard complete for userId=' + userId));
    }
  }
}
