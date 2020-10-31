import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaymentCardsComponent } from 'src/app/Global/Cards/PaymentCards.component';
import { TmoneysComponent } from 'src/app/Global/Tmoneys/Tmoneys.component';

@Component({
  selector: 'app-PaymentChangeModel',
  templateUrl: './PaymentChangeModel.component.html',
  styleUrls: ['./PaymentChangeModel.component.scss']
})
export class PaymentChangeModelComponent implements OnInit, AfterViewInit {

   @ViewChild(PaymentCardsComponent, {static: false}) paymentCardsComponenet: PaymentCardsComponent;
   @ViewChild('TmoneysComponent', {static: false}) tmoneysComponenet: TmoneysComponent;
   @ViewChild('FloozsComponent', {static: false}) floozsComponent: TmoneysComponent;

   constructor(public appService: AppService,
               public router: Router,
               public translate: TranslateService
               ) {

   }

   ngOnInit() {

   }

   ngAfterViewInit() {
   }

   onCardSaved($event) {
      this.paymentCardsComponenet.updateTable($event);
   }

   onCardMethodSelected($event) {
      this.floozsComponent.getTmoneys();
      this.tmoneysComponenet.getTmoneys();
   }


   onTmoneySaved($event) {
      this.tmoneysComponenet.updateTable($event);
   }

   onTmoneyMethodSelected($event) {
      this.floozsComponent.getTmoneys();
      this.paymentCardsComponenet.getCreditCards();
   }

   onFloozSaved($event) {
      this.floozsComponent.updateTable($event);
   }

   onFloozMethodSelected($event) {
      this.tmoneysComponenet.getTmoneys();
      this.paymentCardsComponenet.getCreditCards();
   }
}



