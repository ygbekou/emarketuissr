import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaymentCardsComponent } from 'src/app/Global/Cards/PaymentCards.component';
import { TmoneysComponent } from 'src/app/Global/Tmoneys/Tmoneys.component';
import { PaymentMethodChangeVO } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-PaymentChangeModel',
  templateUrl: './PaymentChangeModel.component.html',
  styleUrls: ['./PaymentChangeModel.component.scss']
})
export class PaymentChangeModelComponent implements OnInit, AfterViewInit {

   @ViewChild(PaymentCardsComponent, {static: false}) paymentCardsComponent: PaymentCardsComponent;
   @ViewChild('TmoneysComponent', {static: false}) tmoneysComponenet: TmoneysComponent;
   @ViewChild('FloozsComponent', {static: false}) floozsComponent: TmoneysComponent;

   paymentMethodChange: PaymentMethodChangeVO = new PaymentMethodChangeVO();
   paypalMethodStatus: number;
   panelOpenState = false;

   constructor(public appService: AppService,
               public router: Router,
               public translate: TranslateService,
               private activatedRoute: ActivatedRoute
               ) {
      this.activatedRoute.queryParams.forEach(queryParams => {
         this.paypalMethodStatus = queryParams['paymentMethodCode'] === 'PAYPAL' ? 1 : undefined;
      });
   }

   ngOnInit() {
      
   }

   ngAfterViewInit() {
   }

   onCardSaved($event) {
      this.paymentCardsComponent.updateTable($event);
   }

   onCardMethodSelected($event) {
      this.floozsComponent.getTmoneys();
      this.tmoneysComponenet.getTmoneys();
      this.paypalMethodStatus = 0;
   }


   onTmoneySaved($event) {
      this.tmoneysComponenet.updateTable($event);
   }

   onTmoneyMethodSelected($event) {
      this.floozsComponent.getTmoneys();
      this.paymentCardsComponent.getCreditCards();
      this.paypalMethodStatus = 0;
   }

   onFloozSaved($event) {
      this.floozsComponent.updateTable($event);
   }

   onFloozMethodSelected($event) {
      this.tmoneysComponenet.getTmoneys();
      this.paymentCardsComponent.getCreditCards();
      this.paypalMethodStatus = 0;
   }



   changePaymentMethod(paymentMethodCode: string) {

      this.paymentMethodChange.userId = Number(this.appService.tokenStorage.getUserId());
      this.paymentMethodChange.paymentMethodCodeId = null;
      this.paymentMethodChange.paymentMethodCode = paymentMethodCode;

      this.appService.saveWithUrl('/service/order/changePaymentMethod/', this.paymentMethodChange)
         .subscribe((data: any) => {
            this.floozsComponent.getTmoneys();
            this.tmoneysComponenet.getTmoneys();
            this.paymentCardsComponent.getCreditCards();
            this.paypalMethodStatus = 1;
         },
         error => console.log(error),
         () => console.log('Changing Payment Method complete'));
   }

}



