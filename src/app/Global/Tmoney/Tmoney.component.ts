import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Tmoney, User } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import CardUtils from 'src/app/Services/cardUtils';


@Component({
  selector: 'app-Tmoney',
  templateUrl: './Tmoney.component.html',
  styleUrls: ['./Tmoney.component.scss']
})
export class TmoneyComponent implements OnInit { 

  tmoney: Tmoney = new Tmoney();
  user: User = new User();
  messages: string;
  errors: string;
  creditCardBackground = 'background-image: url(assets/images/cards/card-edit.png)';

  @Output()
  tmoneySaveEvent = new EventEmitter<Tmoney>();

  @Input()
  paymentType: string;


  constructor(
    public appService: AppService,
    public translate: TranslateService) {
  }

  ngOnInit() {


  }

  /**
    * Function is used to submit the profile card.
    * If form value is valid, redirect to card page.
    */
   submitTmoney() {
      this.messages = '';
      this.errors = '';
      this.user.id = +this.appService.tokenStorage.getUserId();
      this.tmoney.user = this.user
      this.tmoney.type = this.paymentType;
      this.appService.save(this.tmoney, this.paymentType)
         .subscribe(result => {
         if (result.id > 0) {
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
               this.messages = res['MESSAGE.SAVE_SUCCESS'];
               this.tmoneySaveEvent.emit(result);
               this.tmoney = new Tmoney();
            });
         } else {
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
               this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
            });
         }
      });
      
   }

}
