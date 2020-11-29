import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AddressesComponent } from 'src/app/Global/Addresses/Addresses.component';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-PaymentChangeAddress',
  templateUrl: './PaymentChangeAddress.component.html',
  styleUrls: ['./PaymentChangeAddress.component.scss']
})
export class PaymentChangeAddressComponent implements OnInit, AfterViewInit {

   @ViewChild(AddressesComponent, {static: false}) paymentAddresses: AddressesComponent;
   addressType = 0;
   panelOpenState = false;


   @Input()
   userId: number;

   constructor(public appService: AppService,
               public router: Router,
               private route: ActivatedRoute,
               public translate: TranslateService
               ) {
                  this.route.queryParams.forEach(queryParams => {
                     if (+queryParams['addressType'] > 0) {
                        this.addressType = +queryParams['addressType'];
                     }
      });

   }

   ngOnInit() {

   }

   ngAfterViewInit() {
      this.paymentAddresses.setAddressType(this.addressType);

      if (this.userId === undefined) {
         this.userId = Number(this.appService.tokenStorage.getUserId());
      }

   }

   onAddressSaved($event) {
      this.paymentAddresses.updateTable($event);
   }
}



