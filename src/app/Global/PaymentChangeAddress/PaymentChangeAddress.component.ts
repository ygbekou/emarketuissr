import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
   addressType: number = 0;

   constructor(public appService: AppService,
               public router: Router,
               private route: ActivatedRoute,
               public translate: TranslateService
               ) {
                  this.route.queryParams.forEach(queryParams => {
                     if (queryParams['addressType'] !== undefined) {
                        this.addressType = +queryParams['addressType'];
                     }
         
      });

   }

   ngOnInit() {
      
   }

   ngAfterViewInit() {
      this.paymentAddresses.setAddressType(this.addressType);
   }

   onAddressSaved($event) {
      this.paymentAddresses.updateTable($event);
   }
}



