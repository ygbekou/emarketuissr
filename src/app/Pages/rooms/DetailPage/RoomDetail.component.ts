import { Component, OnInit } from '@angular/core';
import {
   MatSnackBar,
   MatSnackBarConfig,
   MatSnackBarHorizontalPosition,
   MatSnackBarVerticalPosition
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MediaObserver } from '@angular/flex-layout';
import { RoomStoreVO, HotelSearchCriteria, RoomListVO, Reservation, Country } from 'src/app/app.models';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
   selector: 'app-room-detail',
   templateUrl: './RoomDetail.component.html',
   styleUrls: ['./RoomDetail.component.scss']
})
export class RoomDetailComponent extends BaseComponent implements OnInit {

   snackMessage = 'Please select a room.';
   addExtraClass = false;
   action = true;
   backgroundColor = '#4c76b2';
   color = '#fff';
   roomStore: RoomStoreVO;
   storeId: number;
   searchCriteria: HotelSearchCriteria = new HotelSearchCriteria();
   firstImage = '';
   secondImage = '';
   mainImage = '';
   filesCopy = [];
   fiveImages = [];
   currentLow = 0;
   currentHigh = 0;
   hasError = false;
   hasInvalidDates = false;

   constructor(public appService: AppService,
      public router: Router,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private activatedRoute: ActivatedRoute,
      public snackBar: MatSnackBar) {
      super(translate);
      this.appService.selectedRoomStore = new RoomStoreVO();
   }

   ngOnInit() {
      this.activatedRoute.queryParams.subscribe(params => {
         this.searchCriteria.storeId = params.storeId;
         if (params.checkinDate) {
            this.searchCriteria.checkinDate = new Date(params.checkinDate.substr(0, 4), params.checkinDate.substr(5, 2) - 1,
               params.checkinDate.substr(8, 2));
         } else {
            this.searchCriteria.checkinDate = new Date();
         }
         if (params.checkoutDate) {
            this.searchCriteria.checkoutDate = new Date(params.checkoutDate.substr(0, 4), params.checkoutDate.substr(5, 2) - 1,
               params.checkoutDate.substr(8, 2));
         } else {
            this.searchCriteria.checkoutDate = new Date();
         }

         this.searchCriteria.rooms = params.rooms ? params.rooms : 1;
         this.searchCriteria.days = params.days ? params.days : 1;
         this.searchCriteria.roomTypeName = params.roomTypeName;
         this.getRoomStore();
      });

   }

   getRoomStore() {
      if (this.searchCriteria.checkinDate > this.searchCriteria.checkoutDate) {
         this.hasInvalidDates = true;
         return;

      }

      const beginDateStr = new Date(this.searchCriteria.checkinDate.getTime())
         .toISOString()
         .split('T')[0];


      if (this.searchCriteria.beginHr) {
         this.searchCriteria.checkinTS = new Date(beginDateStr + 'T' + this.searchCriteria.beginHr + ':00:00');
      } else {
         this.searchCriteria.checkinTS = new Date(beginDateStr + 'T00:00:00');
      }

      if (this.searchCriteria.endHr) {
         this.searchCriteria.checkoutTS = new Date(beginDateStr + 'T' + this.searchCriteria.endHr + ':59:59');
      } else {
         const endDateStr = new Date(this.searchCriteria.checkoutDate.getTime())
            .toISOString()
            .split('T')[0];
         this.searchCriteria.checkoutTS = new Date(endDateStr + 'T23:59:59');
      }

      this.searchCriteria.languageId = this.appService.appInfoStorage.language.id;
      const diffInMs = Math.abs(this.searchCriteria.checkoutDate.valueOf() - this.searchCriteria.checkinDate.valueOf());
      this.searchCriteria.days = Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;

      this.searchCriteria.languageId = this.appService.appInfoStorage.language.id;
      this.searchCriteria.withAmenities = true;
      this.appService.saveWithUrl('/service/hospitality/getRoomsForSale/',
         this.searchCriteria).subscribe((data: RoomListVO) => {
            if (data.roomStoreVOs && data.roomStoreVOs.length > 0) {
               this.roomStore = data.roomStoreVOs[0];
               this.firstImage = this.roomStore.image1;
               this.secondImage = this.roomStore.image2;
               this.mainImage = this.roomStore.image;

               let j = 0;
               if (this.roomStore.fileNames) {
                  for (let i = 0; i < this.roomStore.fileNames.length; i++) {
                     if (this.roomStore.fileNames[i] === this.roomStore.image
                        || this.roomStore.fileNames[i] === this.roomStore.image1
                        || this.roomStore.fileNames[i] === this.roomStore.image2
                        || this.roomStore.fileNames[i] === this.roomStore.image3) {
                        continue;
                     } else {
                        if (j < 12) {
                           this.fiveImages.push(this.roomStore.fileNames[i]);
                        }
                        this.filesCopy.push(this.roomStore.fileNames[i]);
                        j++;
                     }
                  }
               }

               this.currentHigh = this.filesCopy.length < 10 ? this.filesCopy.length - 1 : 9;
               // this.setDataSource(this.roomStore.roomTyeVOs);
            }
         },
            error => console.log(error),
            () => console.log('Get all getRoomsOnSale complete'));
   }


   reserve(roomTypeId: number) {
      console.log('Room Type ID: ' + roomTypeId);
      const reserv = new Reservation();
      reserv.roomTypeIds = [];
      reserv.roomTypeIds.push(roomTypeId);
      reserv.storeId = this.searchCriteria.storeId;
      reserv.languageId = this.appService.appInfoStorage.language.id;
      reserv.userId = Number(this.appService.tokenStorage.getUserId());
      reserv.clientId = Number(this.appService.tokenStorage.getUserId());
      reserv.beginDate = this.searchCriteria.checkinDate;
      reserv.endDate = this.searchCriteria.checkoutDate;
      reserv.firstName = this.appService.tokenStorage.getFirstName();
      reserv.lastName = this.appService.tokenStorage.getLastName();
      reserv.nbrAdult = this.searchCriteria.adults + '';
      reserv.nbrChild = this.searchCriteria.children + '';
      reserv.quantity = this.searchCriteria.rooms;
      reserv.contact = this.appService.tokenStorage.getFirstName() + ' '
         + this.appService.tokenStorage.getLastName();
      reserv.cashier = this.appService.tokenStorage.getFirstName() + ' '
         + this.appService.tokenStorage.getLastName();
      reserv.email = 'test@gmail.com';
      reserv.sex = 'M';
      reserv.comments = 'Reserving Hotel';
      reserv.country = new Country();
      reserv.country.id = 228;
      reserv.phone = '888-999-202';
      reserv.idType = 1;
      reserv.idNbr = 'G1203698696';
      reserv.days = this.searchCriteria.days;
      reserv.nbrRooms = this.searchCriteria.rooms;

      this.appService.saveWithUrl('/service/hospitality/reserve/',
         reserv).subscribe(() => {

         },
            error => console.log(error),
            () => console.log('Get all getRoomsOnSale complete'));
   }

   changeImageSrc(src: string) {
      const myImg = document.getElementById('thirdImage') as HTMLImageElement;
      myImg.src = src;
      // document.getElementById('thirdImage').src = src;
      document.getElementById('thirdImage')[0].src = src;
   }

   previous() {
      let j = 0;
      if (this.currentLow <= 0) {
         return;
      }

      const maxI = this.currentLow + 9 > this.filesCopy.length - 1 ? this.filesCopy.length - 1 : this.currentLow + 9;
      for (let i = this.currentLow - 1; i < this.filesCopy.length; i++) {
         this.fiveImages[j] = this.filesCopy[i];
         j++;

         if (j === 12) {
            break;
         }
      }

      if (this.currentLow > 0) {
         this.currentLow--;
      }
      this.currentHigh--;
   }

   next() {
      let j = 0;
      if (this.currentHigh >= this.filesCopy.length) {
         return;
      }

      const maxI = this.currentLow + 9 > this.filesCopy.length - 1 ? this.filesCopy.length - 1 : this.currentLow + 9;
      for (let i = this.currentLow + 1; i < this.filesCopy.length; i++) {
         this.fiveImages[j] = this.filesCopy[i];
         j++;
         if (j === 12) {
            break;
         }
      }

      this.currentLow++;
      if (this.currentHigh < this.filesCopy.length) {
         this.currentHigh++;
      }
   }

   counter(i: number) {
      return new Array(i);
   }

   goToCheckout() {
      if (this.appService.selectedRoomStore.total <= 0) {
         this.translate.get(['MESSAGE.PLEASE_SELECT_A_ROOM']).subscribe(res => {
            this.snackMessage = res['MESSAGE.PLEASE_SELECT_A_ROOM'];
         });
         this.action = false;
         this.hasError = true;
         this.open();
         return;
      }

      if (this.appService.selectedRoomStore.roomTyeVOs.length > 0) {
         this.router.navigate(['/rooms/booking/'],
            {
               queryParams: {
                  storeId: this.searchCriteria.storeId,
                  checkinDate: this.searchCriteria.checkinDate,
                  checkoutDate: this.searchCriteria.checkoutDate,
                  rooms: this.searchCriteria.rooms,
                  days: this.searchCriteria.days
               }
            });
      }
   }


   roomChanged() {
      this.appService.selectedRoomStore = new RoomStoreVO();
      this.appService.selectedRoomStore.roomTyeVOs = [];
      this.roomStore.roomTyeVOs.forEach(rt => {
         if (rt.nbRooms > 0) {
            rt.total = rt.price * rt.nbRooms * this.searchCriteria.days;
            this.appService.selectedRoomStore.total += rt.total;
            this.appService.selectedRoomStore.nbrRooms += +rt.nbRooms;
            this.appService.selectedRoomStore.roomTyeVOs.push(rt);
         }
      });
   }

   open() {
      const config = new MatSnackBarConfig();
      config.verticalPosition = this.verticalPosition;
      config.horizontalPosition = this.horizontalPosition;
      config.duration = this.setAutoHide ? this.autoHide : 0;
      this.snackBar.open(this.snackMessage, undefined, config);
   }

   searchEventHandler(data: RoomListVO) {
      this.roomStore = data.roomStoreVOs[0];
   }

   scroll(sectionId) {
      let element = document.getElementById(sectionId);

      if (element) {
         element.scrollIntoView(); // scroll to a particular element
      }
   }
}
