import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User, Address } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import CardUtils from 'src/app/Services/cardUtils';


@Component({
  selector: 'app-address',
  templateUrl: './Address.component.html',
  styleUrls: ['./Address.component.scss']
})
export class AddressComponent implements OnInit {

   address: Address = new Address();
   user: User = new User();
   messages: string;
   errors: string;
   addressTypes: any[];
   @Output() 
   addressSaveEvent = new EventEmitter<Address>();

   @Input()
   userId;
   @Input()
   selectedAddressType: number;

  constructor(
    public appService: AppService,
    public translate: TranslateService) {
      this.addressTypes = CardUtils.getAddressTypes();
  }

  ngOnInit() {
      this.appService.getCountries();

      if (this.userId === undefined) {
         this.userId = Number(this.appService.tokenStorage.getUserId());
      }
  }

  /**
    * Function is used to submit the profile card.
    * If form value is valid, redirect to card page.
    */
   submitAddress() {
      this.messages = '';
      this.errors = '';
      this.user.id = +this.userId;
      this.address.user = this.user;

      if (!this.isNotAddressTypePreSelected()) {
         this.address.addressType = this.selectedAddressType;
      }


       this.appService.saveWithUrl('/service/catalog/savePaymentAddress/', this.address)
         .subscribe(result => {
            if (result.id > 0) {
               this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.SAVE_SUCCESS'];
                  this.addressSaveEvent.emit(result);
                  this.address = new Address();
               });
            } else {
               this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
               });
            }
         });
   }

   isNotAddressTypePreSelected() {
      return this.selectedAddressType === undefined;
   }

   getAddress(addressId: number) {
      this.appService.getOne(addressId, 'com.softenza.emarket.model.Address')
        .subscribe((data: Address) => {
          this.address = data;
          this.appService.getZones(this.address.country);
        },
          error => console.log(error),
          () => console.log('Get address complete for addressId=' + addressId));
   }

   clear() {
      this.address = new Address();
   }
}
