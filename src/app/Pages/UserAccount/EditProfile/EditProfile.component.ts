import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, Address, Country, Zone, CreditCard, Store } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
   selector: 'app-edit-profile',
   templateUrl: './EditProfile.component.html',
   styleUrls: ['./EditProfile.component.scss']
})
export class EditProfileComponent extends BaseComponent implements OnInit {
   countries: Country[] = [];
   zones: Zone[] = [];
   user: User = new User();
   messages: any;
   errors: any;
   creditCardBackground = 'background-image: url(assets/images/cards/card-edit.png)';
   address: Address = new Address();
   card: CreditCard = new CreditCard();
   formData: FormData;
   picture: any[] = [];
   addresses: Address[] = [];
   store: Store = new Store();
   public addressTypes = [
      { id: 1, name: 'Shipping address' },
      { id: 2, name: 'Billing address' }
   ];
   type: string;
   cardForm: FormGroup;

   emailPattern: any = /\S+@\S+\.\S+/;

   constructor(private route: ActivatedRoute,
      public appService: AppService,
      public translate: TranslateService,
      private sanitizer: DomSanitizer,
      private formGroup: FormBuilder) {
      super(translate);
      this.route.params.subscribe(() => {
         if (this.appService.appInfoStorage.language.code === 'fr') {
            this.addressTypes = [
               { id: 1, name: 'Adresse d\'expédition' },
               { id: 2, name: 'Adresse de Facturation' }
            ];
         }
         this.route.queryParams.forEach(queryParams => {
            this.type = queryParams['type'];
            this.getAddress(queryParams['adrId']);
            this.getCard(queryParams['cId']);
            this.getStore(queryParams['sId']);
         });
      });
   }

   ngOnInit() {
      this.getUser();
      this.getCountries();
      this.getAddresses();
      this.cardForm = this.formGroup.group({
         card_number: ['', [Validators.required]],
         cvv: ['', [Validators.required]],
         name: ['', [Validators.required]],
         month: ['', [Validators.required]],
         year: ['', [Validators.required]]
      });
   }

   getAddresses() {
      const userId = Number(this.appService.tokenStorage.getUserId());
      if (userId > 0) {
         const parameters: string[] = [];
         parameters.push('e.user.id = |userId|' + userId + '|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.Address', parameters)
            .subscribe((data: Address[]) => {
               this.addresses = data;
            },
               error => console.log(error),
               () => console.log('Get all addresses complete for userId=' + userId));
      }
   }

   getBackground() {
      this.creditCardBackground = 'background-image: url(assets/images/cards/'
         + this.card.cardNumber.substring(0, 1) + '.png)';
      return this.sanitizer.bypassSecurityTrustStyle(`url(${this.creditCardBackground})`);
   }

   getZones(country: Country) {
      if (country) {
         const parameters: string[] = [];
         parameters.push('e.country.id = |countryId|' + country.id + '|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.Zone', parameters)
            .subscribe((data: Zone[]) => {
               this.zones = data;
            },
               error => console.log(error),
               () => console.log('Get all GeoZone complete'));
      }
   }
   getCountries() {
      const parameters: string[] = [];
      this.appService.getAllByCriteria('com.softenza.emarket.model.Country', parameters)
         .subscribe((data: Country[]) => {
            this.countries = data;
         },
            error => console.log(error),
            () => console.log('Get all Countries complete'));
   }
   /**
    * Function is used to submit the profile info.
    * If form value is valid, redirect to profile page.
    */

   submitProfileInfo() {
      this.messages = '';
      this.errors = '';
      this.user.modifiedBy = +this.appService.tokenStorage.getUserId();
      this.formData = new FormData();
      if (this.picture && this.picture.length > 0 && this.picture[0].file) {
         this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
      }
      this.appService.saveWithFile(this.user, 'User', this.formData, 'saveWithFile')
         .subscribe(data => {
            this.processResult(data, this.user, null);
            this.user = data;
         });
   }


   submitStoreInfo() {
      this.messages = '';
      this.errors = '';
      this.store.status = (this.store.status == null
         || this.store.status.toString() === 'false'
         || this.store.status.toString() === '0') ? 0 : 1;
      this.store.modifiedBy = +this.appService.tokenStorage.getUserId();
      this.store.owner = this.user;
      console.log(this.store);
      this.formData = new FormData();
      if (this.picture && this.picture.length > 0 && this.picture[0].file) {
         this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
      }
      this.appService.saveWithFile(this.store, 'Store', this.formData, 'saveWithFile')
         .subscribe(data => {
            this.processResult(data, this.store, null);
            this.store = data;
         });
   }


   getAddress(addressId: number) {
      if (addressId > 0) {
         const parameters: string[] = [];
         parameters.push('e.id = |addressId|' + addressId + '|Integer');
         this.appService.getOne(addressId, 'Address')
            .subscribe((data: Address) => {
               this.address = data;
            },
               error => console.log(error),
               () => console.log('Get all address complete for addressId=' + addressId));
      }
   }

   getCard(cardId: number) {
      if (cardId > 0) {
         const parameters: string[] = [];
         parameters.push('e.id = |cardId|' + cardId + '|Integer');
         this.appService.getOne(cardId, 'CreditCard')
            .subscribe((data: CreditCard) => {
               this.card = data;
            },
               error => console.log(error),
               () => console.log('Get all CreditCard complete for CreditCard=' + cardId));
      }
   }


   getStore(storeId: number) {
      if (storeId > 0) {
         this.appService.getOneWithChildsAndFiles(storeId, 'Store')
            .subscribe(result => {
               if (result.id > 0) {
                  this.store = result;
                  const images: any[] = [];
                  const image = {
                     link: 'assets/images/stores/' + this.store.id + '/' + this.store.image,
                     preview: 'assets/images/stores/' + this.store.id + '/' + this.store.image
                  };
                  images.push(image);
                  this.picture = images;
               } else {
                  this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                     this.errors = res['MESSAGE.READ_FAILED'];
                  });
               }
            });
      }
   }


   getUser() {
      const userId = Number(this.appService.tokenStorage.getUserId());
      if (userId > 0) {
         this.appService.getOneWithChildsAndFiles(userId, 'User')
            .subscribe(result => {
               if (result.id > 0) {
                  this.user = result;
                  this.user.confirmPassword = this.user.password;
                  const images: any[] = [];
                  this.user.fileNames.forEach(item => {
                     const image = {
                        link: 'assets/images/users/' + userId + '/' + item,
                        preview: 'assets/images/users/' + userId + '/' + item
                     };
                     images.push(image);
                  });
                  this.picture = images;
               } else {
                  this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                     this.errors = res['MESSAGE.READ_FAILED'];
                  });
               }
            });
      }
   }


   /**
    * Function is used to submit the profile address.
    * If form value is valid, redirect to address page.
    */
   submitAddress() {
      this.messages = '';
      this.errors = '';
      this.address.user = this.user;
      console.log(this.address);
      this.appService.save(this.address, 'Address')
         .subscribe(result => {
            if (result.id > 0) {
               this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.SAVE_SUCCESS'];
               });
            } else {
               this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
               });
            }
         });
   }

   /**
    * Function is used to submit the profile card.
    * If form value is valid, redirect to card page.
    */
   submitCard() {
      this.messages = '';
      this.errors = '';
      this.card.user = this.user;
      this.card.cardType = this.getCardType();
      console.log(this.card);
      if (this.card.cardType === '') {
         this.translate.get(['MESSAGE.INVALID_CARD', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.INVALID_CARD'];
         });
      } else {
         this.appService.save(this.card, 'CreditCard')
            .subscribe(result => {
               if (result.id > 0) {
                  this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                     this.messages = res['MESSAGE.SAVE_SUCCESS'];
                  });
               } else {
                  this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                     this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
                  });
               }
            });
      }
   }

   getCardType(): string {
      if (this.card.cardNumber && this.card.cardNumber.length > 1) {
         const firstDigit: string = this.card.cardNumber.substring(0, 1);
         if (firstDigit === '3') {
            return 'Amex';
         } else if (firstDigit === '4') {
            return 'Visa';
         } else if (firstDigit === '5') {
            return 'MasterCard';
         } else if (firstDigit === '6') {
            return 'Discover';
         }
      }
      return '';
   }

}
