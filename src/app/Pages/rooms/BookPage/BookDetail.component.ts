import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MediaObserver } from '@angular/flex-layout';
import { Language, RoomStoreVO, HotelSearchCriteria, RoomListVO, RoomTypeVO, Reservation, Tmoney, Flooz } from 'src/app/app.models';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
declare var Stripe: any;

@Component({
   selector: 'app-book-detail',
   templateUrl: './BookDetail.component.html',
   styleUrls: ['./BookDetail.component.scss']
})
export class BookDetailComponent extends BaseComponent implements OnInit {

   roomsColumns: string[] = ['roomTypeName', 'price', 'actions'];
   roomsDatasource: MatTableDataSource<RoomTypeVO>;
   @ViewChild('MatPaginatorRooms', { static: true }) roomsPaginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) roomsSort: MatSort;

   backgroundColor = '#4c76b2';
   color = '#fff';

   roomStore: RoomStoreVO = new RoomStoreVO();
   roomTypeVO: RoomTypeVO;
   storeId: number;
   searchCriteria: HotelSearchCriteria = new HotelSearchCriteria();
   price: number;
   reserv = new Reservation()
   step = 1;

   // Credit card variables
   stripe: any;
   data: any;

   isLogged = false;
   wantToLogin = false;
   continueAsGuest = false;
   forgotPassword = false;
   needToRegister = false;



   constructor(public appService: AppService,
      public router: Router,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private activatedRoute: ActivatedRoute) {
      super(translate);
   }

   ngOnInit() {
      this.appService.getCountries();
      this.copyUserInfo();
      this.activatedRoute.queryParams.subscribe(params => {
         this.searchCriteria.storeId = params.storeId;
         this.searchCriteria.roomTypeId = params.roomTypeId;
         this.searchCriteria.checkinDate = new Date(params.checkinDate);
         this.searchCriteria.checkoutDate = new Date(params.checkoutDate);
         this.searchCriteria.rooms = params.rooms;
         this.searchCriteria.days = params.days;
         this.searchCriteria.roomTypeName = params.roomTypeName;
         this.getRoomStore();

      });

   }

   getRoomStore() {
      this.searchCriteria.languageId = this.appService.appInfoStorage.language.id;
      this.searchCriteria.withAmenities = true;
      this.appService.saveWithUrl('/service/hospitality/getRoomsForSale/', this.searchCriteria).subscribe((data: RoomListVO) => {
         if (data.roomStoreVOs && data.roomStoreVOs.length > 0) {
            console.log(data.roomStoreVOs[0]);
            this.roomStore = data.roomStoreVOs[0];
            this.roomTypeVO = this.roomStore.roomTyeVOs[0];
            this.reserv.currencyCode = this.roomStore.currencyCode;
            this.reserv.currencyDecimalPlace = this.roomStore.currencyDecimalPlace;
            this.reserv.currencyId = this.roomStore.currencyId;
         }
      },
         error => console.log(error),
         () => console.log('Get all getRoomsOnSale complete'));
   }


   copyUserInfo() {
      if (this.hasLoggedIn()) {
         this.reserv.userId = Number(this.appService.tokenStorage.getUserId());
         this.reserv.firstName = this.appService.tokenStorage.getFirstName();
         this.reserv.lastName = this.appService.tokenStorage.getLastName();
         this.reserv.contact = this.appService.tokenStorage.getFirstName() + ' '
            + this.appService.tokenStorage.getLastName();
         this.reserv.email = this.appService.tokenStorage.getEmail();
         this.reserv.phone = this.appService.tokenStorage.getUser().mobilePhone;
         this.reserv.guestFirstName = this.appService.tokenStorage.getFirstName();
         this.reserv.guestLastName = this.appService.tokenStorage.getLastName();
         this.reserv.guestEmail = this.appService.tokenStorage.getEmail();
      }
   }

   onForgotPassword() {
      this.forgotPassword = true;
      this.wantToLogin = false;
      this.continueAsGuest = false;
   }

   onSendPassword() {
      this.wantToLogin = true;
      this.forgotPassword = false;
      this.continueAsGuest = false;
   }

   onPymtMethodSelect(event) {
      this.step = 3;
      this.reserv.pymtMethodCode = event.paymentMethodCode;
      if (this.reserv.pymtMethodCode === 'CREDIT_CARD') {
         this.reserv.last4Digits = event.last4Digits;
      } else if (this.reserv.pymtMethodCode === 'TMONEY') {
         this.reserv.tmoney = new Tmoney();
         this.reserv.tmoney.phoneNumber = event.tmoneyPhone;
      } else if (this.reserv.pymtMethodCode === 'FLOOZ') {
         this.reserv.flooz = new Flooz();
         this.reserv.flooz.phoneNumber = event.tmoneyPhone;
      }


   }

   setReserv() {
      this.reserv.roomTypeIds = [];
      this.reserv.roomTypeIds.push(this.searchCriteria.roomTypeId);
      this.reserv.storeId = this.searchCriteria.storeId;
      this.reserv.languageId = this.appService.appInfoStorage.language.id;
      this.reserv.language = new Language();
      this.reserv.language.id = this.appService.appInfoStorage.language.id;
      this.reserv.beginDate = this.searchCriteria.checkinDate;
      this.reserv.endDate = this.searchCriteria.checkoutDate;
      this.reserv.nbrAdult = this.searchCriteria.adults + '';
      this.reserv.nbrChild = this.searchCriteria.children + '';
      this.reserv.quantity = this.searchCriteria.rooms;
      this.reserv.days = this.searchCriteria.days;
      this.reserv.nbrRooms = this.searchCriteria.rooms;
      this.reserv.currencyCode = this.roomStore.currencyCode;
      this.reserv.currencyId = this.roomStore.currencyId;
      this.reserv.roomTypes = this.appService.selectedRoomStore.roomTyeVOs;

   }



   setDataSource(data: RoomTypeVO[]) {
      this.roomsDatasource = new MatTableDataSource(data);
      this.roomsDatasource.paginator = this.roomsPaginator;
      this.roomsDatasource.sort = this.roomsSort;
   }


   ngAfterViewInit() {
   }

   initPaymentMethod() {
      this.appService.getObject('/service/order/stripe-key').toPromise()
         .then(result => {
            return result;
         })
         .then(data => {
            return this.setupElements(data);
         })
         .then(data => {
            this.data = data;
            document.querySelector('button').disabled = false;

            const form = document.getElementById('payment-form');
            form.addEventListener('submit', this.handleCardSave.bind(this));
         });
   }


   handleCardSave(event) {
      event.preventDefault();
      this.saveCard(this.data.stripe, this.data.card, this.data.clientSecret);
   }

   setupElements(data) {
      this.stripe = Stripe(data.publishableKey);

      /* ------- Set up Stripe Elements to use in checkout form ------- */
      const elements = this.stripe.elements();
      const style = {
         base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
               color: '#aab7c4'
            }
         },
         invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
         }
      };

      const card = elements.create('card', { style: style });
      card.mount('#card-element');

      return {
         stripe: this.stripe,
         card: card,
         clientSecret: data.clientSecret
      };
   }


   /*
   * Collect card details and pay for the order
   */
   saveCard(stripe, card, clientSecret) {
      this.errors = '';
      stripe
         .createPaymentMethod('card', card)
         .then(result => {
            if (result.error) {
               this.translate.get(['MESSAGE.INVALID_CARD', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.INVALID_CARD'];
               });
               console.log('Error: ' + result.error);
               // showError(result.error.message);
            } else {
               this.reserv.pymtMethodCode = 'CREDIT_CARD';
               this.reserv.pymtMethodName = 'Credit Card';
               this.reserv.stripePaymentMethodId = result.paymentMethod.id;
               this.step = 3;
               //this.book(result);
            }
         })
         .then(function (result) {
            console.log(result);
            if (result) {
               return result.json();
            }
         })
         .then(function (response) {
            if (response && response.error) {
               // showError(response.error);
            } else if (response && response.requiresAction) {
               // Request authentication
               // handleAction(response.clientSecret);
            } else {
               // orderComplete(response.clientSecret);
            }
         });
   }


   book(result: any) {
      console.log(result);
      this.setReserv();
      if (result) {
         this.reserv.stripePaymentMethodId = result.paymentMethod.id;
      }

      this.appService.saveWithUrl('/service/hospitality/reserve',
         this.reserv)
         .subscribe((savedRes: Reservation) => {
            console.log(savedRes);
            if (savedRes.errors === null || savedRes.errors.length === 0) {
               if (savedRes.status === 5) {
                  this.translate.get(['MESSAGE.PAYMENT_UNSUCCESS']).subscribe(res => {
                     this.errors = res['MESSAGE.PAYMENT_UNSUCCESS'];
                  });
               } else {
                  this.step = 3;
                  this.reserv = savedRes;
                  this.router.navigate(['/rooms/reservations/' + this.reserv.id],
                     { queryParams: {} });
               }
            } else {
               this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
               });
            }
         });

   }

   goToStep2() {
      this.step = 2;

      if (this.reserv.pymtMethodCode === 'CREDIT_CARD') {
         this.initPaymentMethod()
      }
   }

   goToStep1() {
      this.step = 1;
      this.copyUserInfo();
   }

   hasLoggedIn() {
      return this.appService.tokenStorage.getUserId() && Number(this.appService.tokenStorage.getUserId()) > 0;
   }

   onTogglePmntMethodChange($event) {
      this.step = 2;
      this.reserv.pymtMethodCode = $event.value;
      if ($event.value === 'CREDIT_CARD') {
         setTimeout(() => {
            this.initPaymentMethod();
         }, 0);
      }
   }

   payAtRegister() {
      this.step = 3;
      this.reserv.pymtMethodCode = 'PAY_AT_REGISTER';
      this.reserv.phone = '';
   }

   editUserInfo() {
      this.step = 1;
   }

   editPymtInfo() {
      this.step = 2;
      this.initPaymentMethod()
   }

   gotoConfirmation() {
      this.step = 3;
   }

   counter(i: number) {
      return new Array(i);
   }
}
