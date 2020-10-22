import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaymentCardsComponent } from 'src/app/Global/Cards/PaymentCards.component';

@Component({
  selector: 'app-PaymentChangeModel',
  templateUrl: './PaymentChangeModel.component.html',
  styleUrls: ['./PaymentChangeModel.component.scss']
})
export class PaymentChangeModelComponent implements OnInit, AfterViewInit {

   @ViewChild(PaymentCardsComponent, {static: false}) paymentCards: PaymentCardsComponent;

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
      this.paymentCards.updateTable($event);
   }
}



