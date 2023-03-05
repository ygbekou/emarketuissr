import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DiscountCardTransDTO, DiscountCardDTO, DiscountCardSearchCriteria } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { AdminDiscountCardComponent } from 'src/app/AdminPanel/Finances/DiscountCards/AdminDiscountCard.component';

@Component({
  selector: 'app-rewards',
  templateUrl: './Rewards.component.html',
  styleUrls: ['./Rewards.component.scss']
})
export class RewardsComponent extends BaseComponent implements OnInit {

  @ViewChild(AdminDiscountCardComponent, { static: false }) discountCardComponent: AdminDiscountCardComponent;
  discountCards: DiscountCardDTO[] = [];
  sDiscountCard: DiscountCardDTO;
  discountCardTrans: DiscountCardTransDTO;
  error: string;
  errors: string;
  messages = '';
  fromAdmin = false;
  @Input()
  userId;
  step = 1;

  searchCriteria: DiscountCardSearchCriteria = new DiscountCardSearchCriteria();

  constructor(public appService: AppService, public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {

    if (this.userId === undefined) {
      this.userId = Number(this.appService.tokenStorage.getUserId());
    } else {
      this.fromAdmin = true;
    }

    this.getRewards();

  }

  ngAfterViewInit() {
    this.searchCriteria.userId = Number(this.appService.tokenStorage.getUserId());
  }


  private getRewards() {

    this.searchCriteria.userId = Number(this.appService.tokenStorage.getUserId());

    this.appService.saveWithUrl('/service/finance/discountCards', this.searchCriteria)
      .subscribe((data: any[]) => {
        this.discountCards = data;
        console.log(this.discountCards);
      },
        error => console.log(error),
        () => console.log('Get all discount card complete'));
  }

  getDetails(discountCard: DiscountCardDTO) {
    this.discountCardComponent.discountCard = discountCard;
    this.discountCardComponent.getDiscountCardTransList(discountCard.id);
  }


}
