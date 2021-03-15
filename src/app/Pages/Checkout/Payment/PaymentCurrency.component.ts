import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '../../../Services/app.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User, CreditCard, Order, ZoneToGeoZone, Store } from 'src/app/app.models';
import { Constants } from 'src/app/app.constants';

@Component({
   selector: 'app-Payment-Currency',
   templateUrl: './PaymentCurrency.component.html',
   styleUrls: ['./Payment.component.scss']
})
export class PaymentCurrencyComponent implements OnInit, AfterViewInit {

   step = 0;
   isDisabledPaymentStepTwo = true;
   isDisabledPaymentStepThree = false;
   emailPattern: any = /\S+@\S+\.\S+/;
   paymentFormOne: FormGroup;

   @Input()
   user: User = new User();
   error: string;
   message: string;
   storeHoursMessage: string;
   notify = false;
   order: Order;
   shouldNotify: false;
   orderTotal: number;
   pickUpDatetime: Date;
   @Input() pickUp: '0' | '1';
   @Input() scheduleForLater: boolean;
   allStepDone = false;

   @Input()
   storeId: number;
   @Output() orderCompleteEvent = new EventEmitter<Order>();

   store: Store;
   hasOrderSucceed: boolean;
   zoneToGeoZone: ZoneToGeoZone;
   storeOpen: boolean;
   deliveryOpen: boolean;
   hours: number[];
   minutes: string[];
   timePeriods = ['AM', 'PM'];

   orderHours: number;
   orderMinutes: string;
   orderTimePeriod: string;

   timePeriodMap = new Map();

   constructor(public appService: AppService,
      public router: Router,
      public translate: TranslateService
   ) {

      this.processPaymentConfirmation();
   }

   ngOnInit() {

      this.error = '';
      if (!this.order) {
         this.order = new Order();
      }

      if (!localStorage.getItem('deliveryMode')) {
         localStorage.setItem('deliveryMode', '0');
      }
      this.appService.navbarCartDeliveryMap[this.storeId] = localStorage.getItem('deliveryMode');
      if (this.pickUp === '0') {
         this.getZoneToGeoZone();
      }
      this.getStore();
   }

   ngAfterViewInit() {
      this.minutes = ['00', '15', '30', '45'];
   }

   getStore() {
    if (this.storeId > 0) {
      this.appService.getOne(this.storeId, 'Store')
        .subscribe(result => {
          if (result.id > 0) {
            this.store = result;
            this.isStoreOpen();
          }
        });
    }
  }

   getHours() {
      this.hours = [];
      console.log(this.hours);
      console.log(this.minutes);
      const dayNumber = new Date().getDay();
      const openTime = JSON.parse(JSON.stringify(this.store))['openTime' + dayNumber];
      const closeTime = JSON.parse(JSON.stringify(this.store))['closeTime' + dayNumber];
      const openHour = Number(openTime.split(':')[0]);
      const closeHour = Number(closeTime.split(':')[0]);
      let j = 0;
      for (let i = openHour; i < 22; i++) {
         if (i > 12) {
            let periodValue = this.timePeriodMap.get(Number(i - 12));
            if (!periodValue) {
               periodValue = [];
               this.hours[j] = Number(i - 12);
            }
            periodValue.push('PM');
            this.timePeriodMap.set(Number(i - 12), periodValue);
         } else {
            let periodValue = this.timePeriodMap.get(i);
            if (!periodValue) {
               periodValue = [];
               this.hours[j] = Number(i);
            }
            periodValue.push('AM');
            this.timePeriodMap.set(i, periodValue);
         }
         j++;
      }

      this.hours.sort(function(a, b) { return a - b });
      console.log(this.hours);
   }

   isStoreOpen() {
      const dayNumber = new Date().getDay();
      let openTime = JSON.parse(JSON.stringify(this.store))['openTime' + dayNumber];
      let closeTime = JSON.parse(JSON.stringify(this.store))['closeTime' + dayNumber];

      if (openTime == null) {
         openTime = '00:00';
      }
      if (closeTime == null) {
         closeTime = '23:59';
      }

      const now = new Date();
      const utcDatetime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

      const storeUtcOpenDatetime = this.appService.getUtcDatetime(Number(openTime.split(':')[0]),
               Number(openTime.split(':')[1]), 0, this.store.timeZone.gmtOffset);
      const storeUtcCloseDatetime = this.appService.getUtcDatetime(Number(closeTime.split(':')[0]),
               Number(closeTime.split(':')[1]), 59, this.store.timeZone.gmtOffset);

      this.storeOpen = storeUtcOpenDatetime <= utcDatetime && storeUtcCloseDatetime >= utcDatetime;
      if (!this.storeOpen) {
         this.translate.get('MESSAGE.STORE_CLOSED',
                     { store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName,
                     open_time: openTime, close_time: closeTime }).subscribe(res => {
            this.storeHoursMessage = res;
         });
      }
   }

   isDeliveryOpen() {
      const dayNumber = new Date().getDay();
      let openTime = JSON.parse(JSON.stringify(this.zoneToGeoZone.geoZone))['delStart' + dayNumber];
      let closeTime = JSON.parse(JSON.stringify(this.zoneToGeoZone.geoZone))['delEnd' + dayNumber];

      if (openTime == null) {
         openTime = '00:00';
      }
      if (closeTime == null) {
         closeTime = '23:59';
      }


      const now = new Date();
      const utcDatetime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

      const storeUtcOpenDatetime = this.appService.getUtcDatetime(Number(openTime.split(':')[0]),
               Number(openTime.split(':')[1]), 0, this.store.timeZone.gmtOffset);
      const storeUtcCloseDatetime = this.appService.getUtcDatetime(Number(closeTime.split(':')[0]),
               Number(closeTime.split(':')[1]), 59, this.store.timeZone.gmtOffset);

      this.deliveryOpen = storeUtcOpenDatetime <= utcDatetime && storeUtcCloseDatetime >= utcDatetime;
      if (!this.deliveryOpen) {
         this.translate.get('MESSAGE.STORE_CLOSED',
                     { store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName,
                     open_time: openTime, close_time: closeTime }).subscribe(res => {
            this.storeHoursMessage = res;
         });
      }
   }


   getZoneToGeoZone() {

      console.log('Calling Geozone for Store id: ' + this.storeId + ' and Shipping Address id ' + this.user.shippingAddress.zone.id);

      this.appService.saveWithUrl('/service/order/getZoneToGeoZone/', {
            'storeId': this.storeId,
            'zoneId': this.user.shippingAddress.zone.id,
            'countryId': this.user.shippingAddress.country.id
         })
         .subscribe((data: ZoneToGeoZone) => {
            if (data !== null && data.errors !== null && data.errors !== undefined) {
               this.error = data.errors[0];
            } else {
               this.zoneToGeoZone = data;
               this.appService.navbarCartShippingGeoZoneMap[this.storeId] = this.zoneToGeoZone;
               console.log(this.zoneToGeoZone);
               if (data === null) {
                  this.translate.get('MESSAGE.STORE_DOESNOT_SHIP_TO_ADDRESS',
                     { store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName }).subscribe(res => {
                     this.error = res;
                  });
               } else {
                  this.isDeliveryOpen();
               }
            }

            console.log('Calling Recalculate ...');
            this.appService.recalculateCart(false);
         },
         error => console.log(error),
         () => console.log('ZoneToGeoZone retrieved '));

   }

   getUser(userId: number) {
      this.appService.getOneWithChildsAndFiles(userId, 'User')
         .subscribe(result => {
            if (result.id > 0) {
               this.user = result;
               if (this.user.paymentMethodCode === 'CREDIT_CARD') {
                  this.appService.getObject('/service/order/customer/' + userId + '/active_card')
                     .subscribe((data: CreditCard) => {
                        this.user.creditCard = data;
                     },
                        error => console.log(error),
                        () => console.log('Get user active CreditCard complete for userId=' + userId));
               } else if (this.user.paymentMethodCode === 'TMONEY') {
                  this.processPaymentConfirmation();
               }
            } else {
               this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                  this.error = res['MESSAGE.READ_FAILED'];
               });
            }
         });

   }


   public getCartProducts() {
      let total = 0;
      let totalShippingWeight = 0;
      let shippingPrice = 0;
      if (this.appService.localStorageCartProducts && this.appService.localStorageCartProducts.length > 0) {
         for (const product of this.appService.localStorageCartProducts) {
            if (!product.quantity) {
               product.quantity = 1;
            }
            total += (product.price * product.quantity);
            totalShippingWeight += product.shippingWeight;
         }

         shippingPrice = this.zoneToGeoZone.geoZone.weightRate * Math.ceil(totalShippingWeight / this.zoneToGeoZone.geoZone.shippingWeight);
         this.appService.navbarCartShippingMap[this.storeId] = shippingPrice;
         total += (shippingPrice + this.appService.tax);
         return total;
      }
      this.orderTotal = total;
      return total;
   }


   isUserLoggedIn() {
      return this.appService.tokenStorage.getUserId() !== null;
   }


   placeYourOrder() {
      const orderId = this.order ? this.order.id : null;
      // this.order = new Order();
      this.order.id = orderId;
      this.order.products = this.appService.localStorageCartProductsMap[this.storeId];
      this.order.total = this.appService.navbarCartTotalMap[this.storeId];
      this.order.shippingCost = this.appService.navbarCartShippingMap[this.storeId];
      this.order.taxFees = this.appService.navbarCartShippingMap[this.storeId];
      this.order.userId = this.user.id;
      this.order.language = this.appService.appInfoStorage.language;
      this.order.userAgent = this.appService.getUserAgent();
      this.order.pickupDatetime = this.pickUpDatetime;

      if (!this.user.paymentMethodCode) {
         this.translate.get('VALIDATION.SELECT_PAYMENT_METHOD').subscribe(res => {
            this.error = res;
         });
      } else if (!this.user.billingAddress || !this.user.billingAddress.city) {
         this.translate.get('VALIDATION.SELECT_BILLING_ADDRESS').subscribe(res => {
            this.error = res;
         });
      } else if (this.pickUp === '0' && (!this.user.shippingAddress || !this.user.shippingAddress.city)) {
         this.translate.get('VALIDATION.SELECT_SHIPPING_ADDRESS').subscribe(res => {
            this.error = res;
         });
      } else {
         if (this.pickUp === '1') {
            this.order.shippingMethod = 'PICKUP';
            this.order.shippingCode = 'PICKUP';
         } else {
            this.order.shippingMethod = 'DELIVERY';
            this.order.shippingCode = 'DELIVERY';
         }
         if (this.user.paymentMethodCode === 'CREDIT_CARD' && this.user.creditCard) {
            this.order.paymentInfo = this.user.creditCard.cardType +
               ' - xxx' + this.user.creditCard.last4Digits +
               ' - Exp: ' + this.user.creditCard.expMonth + '/' +
               this.user.creditCard.expYear;
         }
         this.appService.getIp()
            .subscribe((data1: any) => {
               this.order.ip = data1.ip;

               this.appService.timerCountDownPopup(Constants.ORDER_WAIT_TIME);
               console.log('before call');
               this.appService.saveWithUrl('/service/order/proceedCheckout/', this.order)
                  .subscribe((data: Order) => {
                     console.log(data);
                     this.appService.timerCountDownPopupClose();
                     this.order = data;
                     if (data.errors !== null && data.errors !== undefined) {
                        this.translate.get('MESSAGE.' + data.errors[0]).subscribe(res => {
                           this.error = res;
                        });
                     } else {
                        if (this.user.paymentMethodCode !== 'TMONEY') {
                           this.appService.completeOrder(+this.storeId);
                           this.orderCompleteEvent.emit(this.order);
                        } else {
                           const url = data.paygateGlobalPaymentUrl.replace('BASE_URL', Constants.webServer);
                           window.location.href = url;
                           return;
                        }
                     }

                  },
                     error => {
                        console.log(error);
                        console.log('Error');
                        this.appService.timerCountDownPopupClose();
                     },
                     () => console.log('Place Order complete'));

            }, error => console.log(error),
               () => console.log('Get IP complete'));
      }
   }

   processPaymentConfirmation() {
      if (this.appService.getStoredOrderId() && this.appService.getStoredOrderId() > 0) {
         this.appService.saveWithUrl('/service/order/payment/confirm/', {
            'identifier': this.appService.getStoredOrderId()
         })
            .subscribe((data: Order) => {
               this.order = data;
               if (data.errors !== null && data.errors !== undefined) {
                  this.error = data.errors[0];
               } else {
                  this.appService.completeOrder(+this.storeId);
                  this.orderCompleteEvent.emit(this.order);
               }
               this.appService.clearOrderId();
            },
               error => console.log(error),
               () => console.log('Changing Payment Method complete'));
      }
   }


   updateOrder(order: Order) {
      if (order.errors !== null && order.errors !== undefined) {
         this.translate.get('MESSAGE.' + order.errors[0]).subscribe(res => {
            this.error = res;
         });
      } else {
         this.orderCompleteEvent.emit(order);
      }
   }

   public setDestMessage() {
      console.log(this.shouldNotify);
      if (this.shouldNotify) {
         if (this.user.shippingAddress && this.user.shippingAddress.phone) {
            this.order.shippingCustomField = ('+' + this.user.shippingAddress.country.code) +
               this.user.shippingAddress.phone;
         } else {
            this.order.shippingCustomField =

               (this.user.shippingAddress && this.user.shippingAddress.country) ?
                  ('+' + this.user.shippingAddress.country.code) : '';
         }

         this.order.customField = this.getNoteToRecipient();
      } else {
         this.order.customField = '';
      }

   }


   public getNoteToRecipient(): string {

      let hi = '';
      let thank = '';
      let pickup = '';
      let delivery = '';

      this.translate.get(['COMMON.HI', 'COMMON.ERROR']).subscribe((res) => {
         hi = res['COMMON.HI'];
      });
      this.translate.get(['COMMON.THANK_YOU', 'COMMON.ERROR']).subscribe((res) => {
         thank = res['COMMON.THANK_YOU'];
      });
      this.translate.get(['MESSAGE.BOUGHT_FOR_PICKUP', 'COMMON.ERROR']).subscribe((res) => {
         pickup = res['MESSAGE.BOUGHT_FOR_PICKUP'];
      });
      this.translate.get(['MESSAGE.BOUGHT_FOR_DELIVERY', 'COMMON.ERROR']).subscribe((res) => {
         delivery = res['MESSAGE.BOUGHT_FOR_DELIVERY'];
      });

      const buff = hi + ' '
         + (this.user.shippingAddress ? this.user.shippingAddress.firstName : '') + '. '
         + (this.pickUp ? pickup : delivery) + ' ';
      return buff;
   }


   deliveryOptionChange(event) {
      this.appService.navbarCartDeliveryMap[this.storeId] = this.pickUp;
      localStorage.setItem('deliveryMode', this.pickUp);
      if (this.pickUp === '1') {
         if (this.store === null || this.store === undefined) {
            this.getStore();
         } else {
            this.isStoreOpen();
         }
      }
   }

   scheduleForLaterChecked(event) {
      if (event.checked) {
         this.getHours();
      }
   }

   hourSelectionChange(event) {
      console.log(this.timePeriodMap.get(event.value));
      this.timePeriods = this.timePeriodMap.get(event.value);
   }

   showPreorder() {
      const canShowPreorder = (this.store.presentPreorderScreen && this.store.presentPreorderScreen.name === 'ALWAYS');
      return canShowPreorder;
   }

}

