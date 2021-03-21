import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User, CreditCard, Order, ZoneToGeoZone, Store, TimePeriod } from 'src/app/app.models';
import { Constants } from 'src/app/app.constants';
import { DatePipe } from '@angular/common';

import moment from 'moment-timezone';
import { CartComponent } from '../../Cart/Cart.component';

@Component({
   selector: 'app-Payment-Currency',
   templateUrl: './PaymentCurrency.component.html',
   styleUrls: ['./Payment.component.scss'],
   providers: [DatePipe]
})
export class PaymentCurrencyComponent implements OnInit, AfterViewInit {

   step = 0;
   isDisabledPaymentStepTwo = true;
   isDisabledPaymentStepThree = false;
   emailPattern: any = /\S+@\S+\.\S+/;

   @ViewChild(CartComponent, { static: false }) cartComponent: CartComponent;

   @Input() user: User = new User();
   error: string;
   message: string;
   storeHoursMessage: string;
   notify = false;
   order: Order = new Order();
   shouldNotify: false;
   orderTotal: number;

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
   purchasePossible: boolean;
   hours: number[];
   minutes: string[];
   timePeriods: TimePeriod[];

   orderHours: number;
   orderMinutes: string;
   orderTimePeriod: string;

   timePeriodMap = new Map();

   nextOpenDateTime: Date;
   nextCloseDateTime: Date;
   openLater: boolean;
   minScheduleDate: Date;
   maxScheduleDate: Date;

   constructor(public appService: AppService,
      public router: Router,
      public translate: TranslateService,
      private datePipe: DatePipe
   ) {

      this.processPaymentConfirmation();
   }

   ngOnInit() {

      this.error = '';
      if (!this.order) {
         this.order = new Order();
      }

      this.appService.navbarCartDeliveryMap[this.storeId] = localStorage.getItem('deliveryMode');
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
            if (this.pickUp === '1') {
               this.isStoreOpen();
            } else {
               this.getZoneToGeoZone();
            }
          }
        });
    }
  }

   getHours() {
      this.hours = [];
      this.timePeriodMap = new Map();
      const openHour = this.storeOpen ? new Date().getHours() : this.nextOpenDateTime.getHours();
      const closeHour = this.nextCloseDateTime.getHours();

      this.minScheduleDate = new Date(this.nextOpenDateTime);
      this.maxScheduleDate = new Date(this.nextOpenDateTime);
      this.maxScheduleDate.setDate(this.maxScheduleDate.getDate() + 7);

      console.log(this.maxScheduleDate);

      let j = 0;
      for (let i = openHour; i < closeHour; i++) {
         // if (i > 12) {
         //    let periodValue = this.timePeriodMap.get(Number(i - 12));
         //    if (!periodValue) {
         //       periodValue = [];
         //       this.hours[j] = Number(i - 12);
         //    }
         //    periodValue.push(this.appService.getTimePeriod('PM'));
         //    this.timePeriodMap.set(Number(i - 12), periodValue);
         // } else {
         //    let periodValue = this.timePeriodMap.get(i);
         //    if (!periodValue) {
         //       periodValue = [];
         //       this.hours[j] = Number(i);
         //    }
         //    periodValue.push(this.appService.getTimePeriod('AM'));
         //    this.timePeriodMap.set(i, periodValue);
         // }
         this.hours[j] = Number(i);
         j++;
      }

      this.hours.sort(function(a, b) { return a - b; });
   }

   public isStoreOpen() {

      this.nextOpenDateTime = undefined;
      this.nextCloseDateTime = undefined;
      this.storeOpen = false;
      const dayNumber = new Date().getDay();

      const openTime = JSON.parse(JSON.stringify(this.store))['openTime' + dayNumber];
      const closeTime = JSON.parse(JSON.stringify(this.store))['closeTime' + dayNumber];

      let nextDayNumber = dayNumber === 6 ? 0 : dayNumber + 1;
      let nextOpenTime = null;
      let nextCloseTime = null;
      let iterCount = 0;
      for (let i = 0; i <= 6; i++) {
         iterCount++;
         console.log('i= ' + i + ', iterCount =' + iterCount + ', nextDayNumber =' + nextDayNumber);
         nextOpenTime = JSON.parse(JSON.stringify(this.store))['openTime' + nextDayNumber];
         nextCloseTime = JSON.parse(JSON.stringify(this.store))['closeTime' + nextDayNumber];
         if (nextOpenTime != null && nextOpenTime.length >= 3 &&
            nextCloseTime !== null && nextCloseTime.length >= 3) {
            break;
         } else {
            nextDayNumber += i;
            nextDayNumber = nextDayNumber === 7 ? 0 : nextDayNumber;
         }
      }
      const now = new Date();
      this.openLater = false;
      let openDateTime = null;
      let closeDateTime = null;
      if (openTime != null && openTime.length >= 3 &&
         closeTime !== null && closeTime.length >= 3) {

         const today = this.datePipe.transform(now, 'yyyy-MM-dd ');
         openDateTime = new Date(moment.tz(today + openTime, this.store.timeZone.name).format('YYYY-MM-DD HH:mm'));
         closeDateTime = new Date(moment.tz(today + closeTime, this.store.timeZone.name).format('YYYY-MM-DD HH:mm'));
         if (openDateTime.getTime() <= now.getTime() && now.getTime() <= closeDateTime.getTime()) {
            this.storeOpen = true;
            this.nextOpenDateTime = openDateTime;
            this.nextCloseDateTime = closeDateTime;
         }
         if (now.getTime() < closeDateTime.getTime() && now.getTime() < openDateTime.getTime()) {
            this.openLater = true;
            this.nextOpenDateTime = openDateTime;
            this.nextCloseDateTime = closeDateTime;
         }
         console.log('openDateTime = ' + openDateTime);
         console.log('closeDateTime = ' + closeDateTime);
      }

      console.log('nextOpenDateTime = ' + nextOpenTime);
      console.log('nextCloseDateTime = ' + nextCloseTime);
      if (nextOpenTime != null && nextOpenTime.length >= 3 &&
         nextCloseTime !== null && nextCloseTime.length >= 3) {
         const tomorrow = new Date();
         tomorrow.setDate(tomorrow.getDate() + iterCount);
         const tomorrowD = this.datePipe.transform(tomorrow, 'yyyy-MM-dd ');
         const nextOpenDateTime = new Date(moment.tz(tomorrowD + nextOpenTime, this.store.timeZone.name).format('YYYY-MM-DD HH:mm'));
         const nextCloseDateTime = new Date(moment.tz(tomorrowD + nextCloseTime, this.store.timeZone.name).format('YYYY-MM-DD HH:mm'));

         if (!this.storeOpen) {
            if (this.openLater) {
               // same day
               this.translate.get('MESSAGE.STORE_CLOSED1', {
                  store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName,
                  open_time: this.datePipe.transform(openDateTime, 'HH:mm'),
                  close_time: this.datePipe.transform(closeDateTime, 'HH:mm'),
               }).subscribe((res) => {
               this.storeHoursMessage = res;
                  console.log(this.storeHoursMessage);
               });
            } else if (iterCount === 1) {
               this.translate.get('MESSAGE.STORE_CLOSED', {
                  store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName,
                  open_time: this.datePipe.transform(nextOpenDateTime, 'HH:mm'),
                  close_time: this.datePipe.transform(nextCloseDateTime, 'HH:mm'),
               }).subscribe((res) => {
               this.storeHoursMessage = res;
               console.log(this.storeHoursMessage);
               });
               this.nextOpenDateTime = nextOpenDateTime;
               this.nextCloseDateTime = nextCloseDateTime;
            } else {
               this.translate.get('WEEKDAYLONG.' + nextDayNumber).subscribe((res1) => {
               this.translate.get('MESSAGE.STORE_CLOSED2', {
                  store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName,
                  open_time: this.datePipe.transform(nextOpenDateTime, 'HH:mm'),
                  close_time: this.datePipe.transform(nextCloseDateTime, 'HH:mm'),
                  day: res1,
               }).subscribe((res) => {
                  this.storeHoursMessage = res;
                  console.log(this.storeHoursMessage);
               });
               });
               this.nextOpenDateTime = nextOpenDateTime;
               this.nextCloseDateTime = nextCloseDateTime;
            }
         }
      } else {
         this.purchasePossible = false;
         this.translate.get('MESSAGE.STORE_PICKUP_NOT_AVAILABLE',
            { store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName }).subscribe((res) => {
            this.error = res;
         });
      }
   }


   public isDeliveryOpen() {

      this.nextOpenDateTime = undefined;
      this.nextCloseDateTime = undefined;
      this.deliveryOpen = false;
      const dayNumber = new Date().getDay();

      const openTime = JSON.parse(JSON.stringify(this.zoneToGeoZone.geoZone))['delStart' + dayNumber];
      const closeTime = JSON.parse(JSON.stringify(this.zoneToGeoZone.geoZone))['delEnd' + dayNumber];

      let nextDayNumber = dayNumber === 6 ? 0 : dayNumber + 1;
      let nextOpenTime = null;
      let nextCloseTime = null;
      let iterCount = 0;
      for (let i = 0; i <= 6; i++) {
         iterCount++;
         console.log('i= ' + i + ', iterCount =' + iterCount + ', nextDayNumber =' + nextDayNumber);
         nextOpenTime = JSON.parse(JSON.stringify(this.zoneToGeoZone.geoZone))['delStart' + nextDayNumber];
         nextCloseTime = JSON.parse(JSON.stringify(this.zoneToGeoZone.geoZone))['delEnd' + nextDayNumber];
         if (nextOpenTime != null && nextOpenTime.length >= 3 &&
            nextCloseTime !== null && nextCloseTime.length >= 3) {
            break;
         } else {
            nextDayNumber += i;
            nextDayNumber = nextDayNumber === 7 ? 0 : nextDayNumber;
         }
      }

      const now = new Date();
      this.openLater = false;
      let openDateTime = null;
      let closeDateTime = null;
      if (openTime != null && openTime.length >= 3 &&
         closeTime !== null && closeTime.length >= 3) {
         const today = this.datePipe.transform(now, 'yyyy-MM-dd ');
         openDateTime = new Date(moment.tz(today + openTime, this.store.timeZone.name).format('YYYY-MM-DD HH:mm'));
         closeDateTime = new Date(moment.tz(today + closeTime, this.store.timeZone.name).format('YYYY-MM-DD HH:mm'));

         if (openDateTime.getTime() <= now.getTime() && now.getTime() <= closeDateTime.getTime()) {
            this.deliveryOpen = true;
            this.nextOpenDateTime = openDateTime;
            this.nextCloseDateTime = closeDateTime;
         }

         if (now.getTime() < closeDateTime.getTime() && now.getTime() < openDateTime.getTime()) {
            this.openLater = true;
            this.nextOpenDateTime = openDateTime;
            this.nextCloseDateTime = closeDateTime;
         }
      }

      if (nextOpenTime != null && nextOpenTime.length >= 3 &&
         nextCloseTime !== null && nextCloseTime.length >= 3) {
         const tomorrow = new Date();
         tomorrow.setDate(tomorrow.getDate() + iterCount);
         const tomorrowD = this.datePipe.transform(tomorrow, 'yyyy-MM-dd ');
         const nextOpenDateTime = new Date(moment.tz(tomorrowD + nextOpenTime, this.store.timeZone.name).format('YYYY-MM-DD HH:mm'));
         const nextCloseDateTime = new Date(moment.tz(tomorrowD + nextCloseTime, this.store.timeZone.name).format('YYYY-MM-DD HH:mm'));

         if (!this.deliveryOpen) {
            console.log(this.datePipe.transform(now, 'yyyy-MM-dd'));
            console.log(this.datePipe.transform(nextOpenDateTime, 'yyyy-MM-dd'));
            if (this.openLater) {
               // same day
               this.translate.get('MESSAGE.NO_DELIVERY_PERIOD1',
                  {
                  store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName,
                  open_time: this.datePipe.transform(openDateTime, 'HH:mm'),
                  close_time: this.datePipe.transform(closeDateTime, 'HH:mm'),
               }).subscribe((res) => {
                  this.storeHoursMessage = res;
                  console.log(this.storeHoursMessage);
               });
            } else
            if (iterCount === 1) {
               this.translate.get('MESSAGE.NO_DELIVERY_PERIOD',
               {
                  store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName,
                  open_time: this.datePipe.transform(nextOpenDateTime, 'HH:mm'),
                  close_time: this.datePipe.transform(nextCloseDateTime, 'HH:mm'),
               }).subscribe((res) => {
                  this.storeHoursMessage = res;
                  console.log(this.storeHoursMessage);
               });
               this.nextOpenDateTime = nextOpenDateTime;
               this.nextCloseDateTime = nextCloseDateTime;
            } else {
               this.translate.get('WEEKDAYLONG.' + nextDayNumber).subscribe((res1) => {
               this.translate.get('MESSAGE.NO_DELIVERY_PERIOD2',
               {
                  store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName,
                  open_time: this.datePipe.transform(nextOpenDateTime, 'HH:mm'),
                  close_time: this.datePipe.transform(nextCloseDateTime, 'HH:mm'),
                  day: res1,
               }).subscribe((res) => {
                  this.storeHoursMessage = res;
                  console.log(this.storeHoursMessage);
               });
            });

            this.nextOpenDateTime = nextOpenDateTime;
            this.nextCloseDateTime = nextCloseDateTime;
          }
      }
    } else {
      this.purchasePossible = false;
      this.translate.get('MESSAGE.STORE_DOESNOT_SHIP_TO_ADDRESS',
        { store_name: this.appService.navbarCartCurrencyMap[this.storeId].storeName }).subscribe((res) => {
          this.error = res;
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
      const orderId = this.order === null ? this.order.id : null;

      // this.order = new Order();
      this.order.id = orderId;
      this.order.products = this.appService.localStorageCartProductsMap[this.storeId];
      this.order.total = this.appService.navbarCartTotalMap[this.storeId];
      this.order.shippingCost = this.appService.navbarCartShippingMap[this.storeId];
      this.order.taxFees = this.appService.navbarCartShippingMap[this.storeId];
      this.order.userId = this.user.id;
      this.order.language = this.appService.appInfoStorage.language;
      this.order.userAgent = this.appService.getUserAgent();

      const preorderDate = this.datePipe.transform(this.order.preorderDate, 'yyyy-MM-dd ');
      const storeTimeZoneMoment =  moment(preorderDate + this.order.preorderHour + ':'
               + this.order.preorderMinute, null)
               .tz(this.store.timeZone.name).format('YYYY-MM-DD HH:mm');
      const preorderDatetime = new Date(storeTimeZoneMoment);
      this.order.expected = preorderDatetime;


      if (!this.user.paymentMethodCode) {
         this.translate.get('VALIDATION.SELECT_PAYMENT_METHOD').subscribe(res => {
            this.error = res;
            this.cartComponent.error = res;
         });
      } else if (!this.user.billingAddress || !this.user.billingAddress.city) {
         this.translate.get('VALIDATION.SELECT_BILLING_ADDRESS').subscribe(res => {
            this.error = res;
            this.cartComponent.error = res;
         });
      } else if (this.pickUp === '0' && (!this.user.shippingAddress || !this.user.shippingAddress.city)) {
         this.translate.get('VALIDATION.SELECT_SHIPPING_ADDRESS').subscribe(res => {
            this.error = res;
            this.cartComponent.error = res;
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
                           this.cartComponent.error = res;
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
      }).subscribe((data: Order) => {
         this.order = data;
         if (data.errors !== null && data.errors !== undefined) {
            this.error = data.errors[0];
            this.cartComponent.error = data.errors[0];
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
      this.error = '';
      this.appService.navbarCartDeliveryMap[this.storeId] = this.pickUp;
      this.scheduleForLaterChecked(null);
      localStorage.setItem('deliveryMode', this.pickUp);
      if (this.pickUp === '1') {
         if (this.store === null || this.store === undefined) {
            this.getStore();
         } else {
            this.isStoreOpen();
         }
      } else {
         if (this.store === null || this.store === undefined) {
            this.getStore();
         } else {
            if (!this.zoneToGeoZone) {
               this.getZoneToGeoZone();
            } else {
               this.isDeliveryOpen();
            }
         }
      }
      this.getHours();

      this.appService.recalculateCart(false);
   }

   scheduleForLaterChecked(event) {
      if (event && event.checked) {
         this.getHours();
      } else {
         this.order.preorderDate = null;
         this.order.preorderHour = null;
         this.order.preorderMinute = null;
         this.order.preorderTimePeriod = null;
      }
      this.disableForStoreClose();
   }

   hourSelectionChange(event) {
      this.timePeriods = this.timePeriodMap.get(event.value);
      this.disableForStoreClose();
   }

   minuteSelectionChange(event) {
      this.disableForStoreClose();
   }

   timePeriodSelectionChange(event) {
      this.disableForStoreClose();
   }

   showPreorder() {
      const canShowPreorder = (
                        (this.store && this.store.presentPreorderScreen && this.store.presentPreorderScreen.name === 'ALWAYS')
                        || (!this.storeOpen && this.store && this.store.presentPreorderScreen
                           && this.store.presentPreorderScreen.name === 'WHEN_CLOSED')
                        );
      return canShowPreorder;
   }

   disableForStoreClose() {
      const disable = ((!this.storeOpen && this.pickUp === '1') || (!this.deliveryOpen && this.pickUp === '0'))
                  && ((this.store && this.store.presentPreorderScreen && this.store.presentPreorderScreen.name === 'ALWAYS')
                     || (this.store && this.store.presentPreorderScreen &&  this.store.presentPreorderScreen.name === 'WHEN_CLOSED')
                     )
                  && (!this.order.preorderDate || !this.order.preorderHour || !this.order.preorderMinute);
      this.appService.navbarCartStoreAllowOrderMap[this.store.id] = disable;

      return disable;
   }

}

