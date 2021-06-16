import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, Address, Country, Zone, CreditCard, Store, Currency, TimeZone, PresentPreorderScreen, StoreShipper, Shipper } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from "@angular/common";

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
   shippers: Shipper[] = [];
   creditCardBackground = 'background-image: url(assets/images/cards/card-edit.png)';
   address: Address = new Address();
   card: CreditCard = new CreditCard();
   formData: FormData;
   picture: any[] = [];
   picture1: any[] = [];
   picture0: any[] = [];
   storeShippers: StoreShipper[] = [];
   addresses: Address[] = [];
   sId = -1;
   store: Store = new Store();
   currencies: Currency[] = [];
   presentPreorderScreens: PresentPreorderScreen[] = [];
   timeZones: TimeZone[] = [];
   public addressTypes = [
      { id: 1, name: 'Shipping address' },
      { id: 2, name: 'Billing address' }
   ];
   type: string;
   cardForm: FormGroup;

   emailPattern: any = /\S+@\S+\.\S+/;
   isAdminPage = false;

   constructor(private route: ActivatedRoute,
      public appService: AppService,
      public router: Router,
      public translate: TranslateService,
      private sanitizer: DomSanitizer,
      private formGroup: FormBuilder,
      private location: Location) {
      super(translate);
      this.route.params.subscribe(() => {
         if (this.appService.appInfoStorage.language.code === 'fr') {
            this.addressTypes = [
               { id: 1, name: 'Adresse d\'expédition' },
               { id: 2, name: 'Adresse de Facturation' }
            ];
         }
         this.generateStoreCode();
         this.route.queryParams.forEach(queryParams => {
            this.type = queryParams['type'];
            this.getAddress(queryParams['adrId']);
            this.getCard(queryParams['cId']);
            if (queryParams['sId']) {
               this.sId = queryParams['sId'];
            }
            this.getStore(queryParams['sId']);
         });
      });
   }

   ngOnInit() {
      this.getCurrencies();
      this.getUser();
      this.getCountries();
      this.getAddresses();
      this.getTimeZones();
      this.getPresentPreorderScreens();
      this.cardForm = this.formGroup.group({
         card_number: ['', [Validators.required]],
         cvv: ['', [Validators.required]],
         name: ['', [Validators.required]],
         month: ['', [Validators.required]],
         year: ['', [Validators.required]]
      });

      this.route.data.subscribe(value => {
         this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
            && (this.location.path().startsWith('/admin/'));
      });
   }

   getShippers() {
      const parameters: string[] = [];
      parameters.push('e.status= |abc|1|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.Shipper', parameters)
         .subscribe((data: Shipper[]) => {
            this.shippers = data;
            this.storeShippers.forEach((ss) => {
               const index: number = this.shippers.findIndex((tb) => tb.id === ss.shipper.id);
               if (index !== -1) {
                  this.shippers.splice(index, 1);
               }
            });

         },
            error => console.log(error),
            () => console.log('Get all Shipper complete'));
   }

   getStoreShippers() {
      const parameters: string[] = [];
      parameters.push('e.store.id= |abc|' + this.store.id + '|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.StoreShipper', parameters)
         .subscribe((data: StoreShipper[]) => {
            this.storeShippers = data;
            this.getShippers();
         },
            error => console.log(error),
            () => console.log('Get all Shipper complete'));
   }

   public deleteStoreShipper(id: number) {
      this.appService.delete(id, 'com.softenza.emarket.model.StoreShipper')
         .subscribe(resp => {
            if (resp.result === 'SUCCESS') {
               this.getStoreShippers();
            }
         });
   }

   changeShipper(storeShipper: StoreShipper) {
      storeShipper.storeStatus = (storeShipper.storeStatus == null
         || storeShipper.storeStatus.toString() === 'false'
         || storeShipper.storeStatus.toString() === '0') ? 0 : 1;
      console.log(storeShipper);
      this.appService.save(storeShipper, 'StoreShipper')
         .subscribe(result => {
            if (result.id > 0) {
               // this. getStoreShippers(Number(this.appService.tokenStorage.getUserId()));
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
   addShipper(shipper: Shipper) {
      const ss: StoreShipper = new StoreShipper();
      ss.shipper = shipper;
      ss.store = this.store;
      ss.storeStatus = 1;
      ss.shipperStatus = 0;
      ss.shipCount = 0;
      this.appService.save(ss, 'StoreShipper')
         .subscribe(result => {

            if (result.id > 0) {
               this.getStoreShippers();
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

   getAddresses() {
      console.log('Get addresses called');
      const userId = Number(this.appService.tokenStorage.getUserId());
      if (userId > 0) {
         const parameters: string[] = [];
         parameters.push('e.user.id = |userId|' + userId + '|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.Address', parameters)
            .subscribe((data: Address[]) => {
               this.addresses = data;
               console.log(this.addresses);
               if (this.sId !== -1) {
                  if (!this.addresses || this.addresses.length === 0) {
                     console.log('rerouting');
                     this.router.navigate(['/account/addresses'], { queryParams: { fromPage: 'fromStore' } });
                  }
               }
            },
               error => console.log(error),
               () => console.log('Get all addresses complete for userId=' + userId));
      }
   }

   compareObjects(o1: any, o2: any): boolean {
      return o1 && o2 ? (o1.id === o2.id) : false;
   }
   getBackground() {
      this.creditCardBackground = 'background-image: url(assets/images/cards/'
         + this.card.cardNumber.substring(0, 1) + '.png)';
      return this.sanitizer.bypassSecurityTrustStyle(`url(${this.creditCardBackground})`);
   }

   getCurrencies() {
      const parameters: string[] = [];
      parameters.push('e.status = |abc|1|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.Currency', parameters,
         ' order by e.code ')
         .subscribe((data: Currency[]) => {
            this.currencies = data;
         },
            error => console.log(error),
            () => console.log('Get all CategoryDescription complete'));
   }

   getPresentPreorderScreens() {
      const parameters: string[] = [];
      parameters.push('e.status = |abc|1|Integer');
      parameters.push('e.language.id = |languageId|' + this.appService.appInfoStorage.language.id + '|Integer');
      this.appService.getAllByCriteria('PresentPreorderScreen', parameters,
         ' order by e.id ')
         .subscribe((data: PresentPreorderScreen[]) => {
            this.presentPreorderScreens = data;
         },
            error => console.log(error),
            () => console.log('Get all PresentPreorderScreen complete'));
   }

   get() {
      const parameters: string[] = [];
      parameters.push('e.status = |abc|1|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.Currency', parameters,
         ' order by e.code ')
         .subscribe((data: Currency[]) => {
            this.currencies = data;
         },
            error => console.log(error),
            () => console.log('Get all CategoryDescription complete'));
   }


   getTimeZones() {
      const parameters: string[] = [];
      this.appService.getAllByCriteria('com.softenza.emarket.model.TimeZone', parameters,
         ' order by e.description ')
         .subscribe((data: TimeZone[]) => {
            this.timeZones = data;
         },
            error => console.log(error),
            () => console.log('Get all TimeZone complete'));
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

   generateStoreCode() {
      const d = new Date();
      this.store.code = (this.user.firstName ?
         this.user.firstName.charAt(0) : ''
      ) + (this.user.lastName ?
         this.user.lastName.charAt(0) : '')
         + d.getTime();
   }

   submitStoreInfo() {
      this.messages = '';
      this.errors = '';

      this.store.status = (this.store.status == null
         || this.store.status.toString() === 'false'
         || this.store.status.toString() === '0') ? 0 : 1;

      this.store.onlineStore = (this.store.onlineStore == null
         || this.store.onlineStore.toString() === 'false'
         || this.store.onlineStore.toString() === '0') ? 0 : 1;

      this.store.acceptDeliveryCash = (this.store.acceptDeliveryCash == null
         || this.store.acceptDeliveryCash.toString() === 'false'
         || this.store.acceptDeliveryCash.toString() === '0') ? 0 : 1;

      this.store.acceptPickupCash = (this.store.acceptPickupCash == null
         || this.store.acceptPickupCash.toString() === 'false'
         || this.store.acceptPickupCash.toString() === '0') ? 0 : 1;

      this.store.sendSMSNewOrder = (this.store.sendSMSNewOrder == null
         || this.store.sendSMSNewOrder.toString() === 'false'
         || this.store.sendSMSNewOrder.toString() === '0') ? 0 : 1;

      this.store.sendSMSOrderCancel = (this.store.sendSMSOrderCancel == null
         || this.store.sendSMSOrderCancel.toString() === 'false'
         || this.store.sendSMSOrderCancel.toString() === '0') ? 0 : 1;

      this.store.sendSMSLowInventory = (this.store.sendSMSLowInventory == null
         || this.store.sendSMSLowInventory.toString() === 'false'
         || this.store.sendSMSLowInventory.toString() === '0') ? 0 : 1;

      this.store.sendSMSShipper = (this.store.sendSMSShipper == null
         || this.store.sendSMSShipper.toString() === 'false'
         || this.store.sendSMSShipper.toString() === '0') ? 0 : 1;

      this.store.autoUpload = (this.store.autoUpload == null
         || this.store.autoUpload.toString() === 'false'
         || this.store.autoUpload.toString() === '0') ? 0 : 1;

      this.store.useMenu = (this.store.useMenu == null
         || this.store.useMenu.toString() === 'false'
         || this.store.useMenu.toString() === '0') ? 0 : 1;

            this.store.allowPickup = (this.store.allowPickup == null
         || this.store.allowPickup.toString() === 'false'
         || this.store.allowPickup.toString() === '0') ? 0 : 1;

       this.store.allowReopen = (this.store.allowReopen == null
         || this.store.allowReopen.toString() === 'false'
         || this.store.allowReopen.toString() === '0') ? 0 : 1;

      this.store.modifiedBy = +this.appService.tokenStorage.getUserId();
      this.store.owner = this.user;
      console.log(this.store);
      this.formData = new FormData();
      if (this.picture1 && this.picture1.length > 0 && this.picture1[0].file) {
         this.formData.append('file[]', this.picture1[0].file, 'picture.' + this.picture1[0].file.name);
      }
      if (this.picture0 && this.picture0.length > 0 && this.picture0[0].file) {
         this.formData.append('file[]', this.picture0[0].file, 'storeFrontImage.' + this.picture0[0].file.name);
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

   changeStoreShipper(user: User) {
      this.user.isShipper = (this.user.isShipper == null
         || this.user.isShipper.toString() === 'false'
         || this.user.isShipper.toString() === '0') ? 0 : 1;
      this.appService.saveWithUrl('/service/user/user/changeShipperSettings', user)
         .subscribe((data: any) => {
            console.log(data);
            if (data.result === 'SUCCESS') {
               this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.SAVE_SUCCESS'];
               });
            } else {
               this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_UNSUCCESS'] + ' : ' + data.result;
               });
            }
         },
            error => console.log(error),
            () => console.log('Get all changeStoreShipper complete'));
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
      console.log(storeId);
      if (storeId > 0) {
         this.picture1 = [];
         this.picture0 = [];
         this.appService.getOneWithChildsAndFiles(storeId, 'Store')
            .subscribe(result => {
               if (result.id > 0) {
                  this.store = result;
                  this.getStoreShippers();
                  console.log(this.store);
                  const images: any[] = [];
                  const image = {
                     link: 'assets/images/stores/' + this.store.id + '/' + this.store.image,
                     preview: 'assets/images/stores/' + this.store.id + '/' + this.store.image
                  };
                  images.push(image);
                  this.picture1 = images;


                  const images0: any[] = [];
                  const image0 = {
                     link: 'assets/images/stores/' + this.store.id + '/' + this.store.storeFrontImage,
                     preview: 'assets/images/stores/' + this.store.id + '/' + this.store.storeFrontImage
                  };
                  images0.push(image0);
                  this.picture0 = images0;

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
                  console.log(this.user);
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
                  console.log(this.user);
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
