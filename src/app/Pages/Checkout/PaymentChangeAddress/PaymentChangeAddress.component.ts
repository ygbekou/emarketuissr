import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AddressesComponent } from 'src/app/Global/Addresses/Addresses.component';

@Component({
  selector: 'app-PaymentChangeAddress',
  templateUrl: './PaymentChangeAddress.component.html',
  styleUrls: ['./PaymentChangeAddress.component.scss']
})
export class PaymentChangeAddressComponent implements OnInit, AfterViewInit {

   @ViewChild(AddressesComponent, {static: false}) paymentAddresses: AddressesComponent;
   addressType: number = 1;

   constructor(public appService: AppService,
               public router: Router,
               private route: ActivatedRoute,
               public translate: TranslateService
               ) {
                  this.route.queryParams.forEach(queryParams => {
         this.addressType = +queryParams['addressType'];
         
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



