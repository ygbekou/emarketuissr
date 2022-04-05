import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import {
   Store, RoomListVO, HotelSearchCriteria
} from 'src/app/app.models';
import { ActivatedRoute } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
   selector: 'app-room-search',
   templateUrl: './RoomsSearch.component.html',
   styleUrls: ['./RoomsSearch.component.scss']
})
export class RoomsSearchComponent implements OnInit {

   storeCatId = 0;
   marketId = 0;
   searchText = '0';
   storeId = 0;
   @Input()
   page = 'list';
   @Input()
   searchCriteria: HotelSearchCriteria = new HotelSearchCriteria();
   searchCritCopy: HotelSearchCriteria = new HotelSearchCriteria();
   minDate: Date = new Date();
   minCheckoutDate: Date = new Date();
   sortSelect = 1;
   selectedStore: Store;
   message: string;
   errors: string;
   running = false;
   @Input()
   stores: Store[] = [];
   @Input()
   filteredStores: Store[];
   @Output()
   searchEvent = new EventEmitter<any>();
   buttonLabel = 'Go';
   hasInvalidDates = false;
   BEGIN_HOURS = ['00', '01', '03', '04', '05', '06', '07', '08',
      '09', '10', '11', '12', '13', '14', '15', '16', '17', '18',
      '19', '20', '21', '22', '23'];
   END_HOURS = ['00', '01', '03', '04', '05', '06', '07', '08', '09',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '20', '21', '22', '23'];


   constructor(public appService: AppService,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private sanitizer: DomSanitizer,
      private activatedRoute: ActivatedRoute) { }

   ngOnInit() {
      this.activatedRoute.queryParams.subscribe(params => {
      });
   }

   ngAfterViewInit() {
      if (this.page === 'detail') {
         this.translate.get(['COMMON.CHANGE_SEARCH']).subscribe(res => {
            this.buttonLabel = res['COMMON.CHANGE_SEARCH'];
         });
      }
   }

   // Getting all the product based on the Top Search
   getRooms() {
      this.running = true;
      this.errors = '';
      if (this.searchCriteria.checkinDate > this.searchCriteria.checkoutDate) {
         this.hasInvalidDates = true;
         this.running = false;
         return;
      }
      if (this.selectedStore) {
         this.searchCriteria.storeId = this.selectedStore.id;
      }
      const beginDateStr = new Date(this.searchCriteria.checkinDate.getTime()
         - (this.searchCriteria.checkinDate.getTimezoneOffset() * 60000))
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
         const endDateStr = new Date(this.searchCriteria.checkoutDate.getTime()
            - (this.searchCriteria.checkoutDate.getTimezoneOffset() * 60000))
            .toISOString()
            .split('T')[0];
         this.searchCriteria.checkoutTS = new Date(endDateStr + 'T23:59:59');
      }
      this.searchCriteria.languageId = this.appService.appInfoStorage.language.id;
      const diffInMs = Math.abs(this.searchCriteria.checkoutDate.valueOf() - this.searchCriteria.checkinDate.valueOf());
      this.searchCriteria.days = Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
      this.searchCritCopy = { ... this.searchCriteria };
      this.appService.saveWithUrl('/service/hospitality/getRoomsForSale/',
         this.searchCriteria).subscribe((data: RoomListVO) => {
            this.running = false;
            console.log(data);
            if (!data || !data.roomStoreVOs || !(data.roomStoreVOs.length > 0)) {
               this.errors = '-';
            }
            this.searchEvent.emit(data);
         },
            error => {
               console.log(error);
               this.running = false;
            },
            () => {
               console.log('Get all getRoomsOnSale complete');
               this.running = false;
            });
   }


   onCheckinDateChange(event) {
      this.minCheckoutDate = this.searchCriteria.checkinDate;
      // this.searchCriteria.checkoutDate = undefined;
   }

   beginHourSelected(event) {
      this.END_HOURS = [];
      for (let i = Number(event.value) + 1; i <= 23; i++) {
         this.END_HOURS.push(i <= 9 ? '0' + i : '' + i);
      }
   }

   selectStore(aStore: Store) {
      this.selectedStore = aStore;
      this.searchCriteria.location = aStore.cityCountryName;
      this.searchCriteria.address = aStore.address;
   }

   unSelectStore() {
      this.selectedStore = undefined;
      this.searchCriteria.storeId = undefined;
      this.searchCriteria.location = undefined;
      this.searchCriteria.address = undefined;
   }

   filterOptions(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
         this.filteredStores = this.stores
            .filter((store) => {
               /*     store.address.city
                      && store.address.city.toLowerCase().startsWith(filterValue);
                      console.log(store.address.city);
                   console.log(store.address.city
                      && store.address.city.toLowerCase().startsWith(filterValue)); */
            });

         console.log(this.filteredStores);
      } else {
         this.filteredStores = this.stores;
      }
   }
}
