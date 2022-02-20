import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

   // roomsColumns: string[] = ['roomTypeName', 'price', 'actions'];
   // roomsDatasource: MatTableDataSource<RoomTypeVO>;
   // @ViewChild('MatPaginatorRooms', { static: true }) roomsPaginator: MatPaginator;
   // @ViewChild(MatSort, { static: true }) roomsSort: MatSort;

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

   constructor(public appService: AppService,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private activatedRoute: ActivatedRoute) {
      super(translate);
   }

   ngOnInit() {
      this.activatedRoute.queryParams.subscribe(params => {
         this.searchCriteria.storeId = params.storeId;
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
      this.appService.saveWithUrl('/service/hospitality/getRoomsForSale/',
         this.searchCriteria).subscribe((data: RoomListVO) => {
            if (data.roomStoreVOs && data.roomStoreVOs.length > 0) {
               this.roomStore = data.roomStoreVOs[0];
               this.firstImage = this.roomStore.image1;
               this.secondImage = this.roomStore.image2;
               this.mainImage = this.roomStore.image;

               let j = 0;
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

               this.currentHigh = this.filesCopy.length < 10 ? this.filesCopy.length - 1 : 9;
               //this.setDataSource(this.roomStore.roomTyeVOs);
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
      reserv.idNbr = 'G1203698696'
      reserv.days = this.searchCriteria.days;
      reserv.nbrRooms = this.searchCriteria.rooms;

      this.appService.saveWithUrl('/service/hospitality/reserve/',
         reserv).subscribe(() => {

         },
            error => console.log(error),
            () => console.log('Get all getRoomsOnSale complete'));
   }

   changeImageSrc(src: string) {
      document.getElementById('thirdImage').src = src;
   }

   previous() {
      let j = 0;
      if (this.currentLow <= 0) {
         return;
      }

      let maxI = this.currentLow + 9 > this.filesCopy.length - 1 ? this.filesCopy.length - 1 : this.currentLow + 9;
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

      let maxI = this.currentLow + 9 > this.filesCopy.length - 1 ? this.filesCopy.length - 1 : this.currentLow + 9;
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
}
