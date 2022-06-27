import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { formatDate } from '@angular/common';
import {
   Language, Pagination, MarketingDescription, CategoryDescription, Store, CartItem, RoomStoreVO,
   RoomListVO, HotelSearchCriteria, BuildingVO
} from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatSortable } from '@angular/material';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment-timezone';

@Component({
   selector: 'app-room-list',
   templateUrl: './RoomsList.component.html',
   styleUrls: ['./RoomsList.component.scss']
})
export class RoomsListComponent implements OnInit {

   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) sort: any;
   @ViewChild('sidenav', { static: false }) sidenav: any;

   dataSource: MatTableDataSource<RoomStoreVO>;
   public viewType = 'grid';
   public viewCol = 33;
   public count = 48;
   public backgroundImg: any;
   public searchFields: any;
   public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
   public message: string;
   public errors: string;
   public watcher: Subscription;
   catId = 0;
   storeCatId = 0;
   marketId = 0;
   searchText = '0';
   storeId = 0;
   store = new Store();
   stores: Store[] = [];
   buildings: BuildingVO[] = [];
   filteredStores: Store[];
   markDesc: MarketingDescription = new MarketingDescription();
   catDesc: CategoryDescription = new CategoryDescription();
   // slideConfig: any;
   height = { 'height': '70px' };
   public counts = [12, 24, 36, 48, 96];
   dummyCat = '';
   popupResponse: any;

   roomList: RoomListVO = new RoomListVO();
   currentFilteredRoomList: RoomListVO = new RoomListVO();
   searchCriteria: HotelSearchCriteria = new HotelSearchCriteria();
   searchCritCopy: HotelSearchCriteria = new HotelSearchCriteria();
   minDate: Date = new Date();
   minCheckoutDate: Date = new Date();
   sortSelect = 1;
   selectedStore: Store;

   cities: string[] = [];
   topPropertiesLabel = '';

   BEGIN_HOURS = ['00', '01', '03', '04', '05', '06', '07', '08',
      '09', '10', '11', '12', '13', '14', '15', '16', '17', '18',
      '19', '20', '21', '22', '23'];
   END_HOURS = ['00', '01', '03', '04', '05', '06', '07', '08', '09',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '20', '21', '22', '23'];

   public sortings = [
      { code: 'priceasc', name: 'Prix ascendant' },
      { code: 'pricedesc', name: 'Prix descendant' },
      { code: 'rating', name: 'Rating' }];
   slideConfig = {
      'slidesToShow': 6,
      'slidesToScroll': 1,
      'arrows': true,
      'swipeToSlide': true,
      'infinite': true,
      'autoplay': true,
      'autoplaySpeed': 2000,
      'responsive': [
         {
            breakpoint: 1200,
            settings: {
               slidesToShow: 5
            }
         },
         {
            breakpoint: 1024,
            settings: {
               slidesToShow: 4
            }
         },
         {
            breakpoint: 800,
            settings: {
               slidesToShow: 3
            }
         },
         {
            breakpoint: 600,
            settings: {
               slidesToShow: 2
            }
         },
         {
            breakpoint: 480,
            settings: {
               slidesToShow: 1
            }
         }
      ]
   };


   constructor(public appService: AppService,
      public router: Router,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private sanitizer: DomSanitizer,
      private activatedRoute: ActivatedRoute) { }

   ngOnInit() {

      this.translate.get('COMMON.TOP_PROPERTIES').subscribe((res) => {
         this.topPropertiesLabel = res;
      });

      // if (this.appService.appInfoStorage.language.code === 'en') {
      this.sortings = [
         { code: 'storeNameAsc', name: 'Store Name ascending' },
         { code: 'storeNameDsc', name: 'Store Name descending' },
         { code: 'rating', name: 'Rating' }];
      // }
      this.sort = this.sortings[0];

      this.dataSource = new MatTableDataSource();

      this.activatedRoute.queryParams.subscribe(params => {
         console.log(this.activatedRoute.queryParams);
         this.activatedRoute.queryParams.forEach(queryParams => {
            if (queryParams['searchText'] !== undefined) {
               this.searchText = queryParams['searchText'];
               this.getData();
            }
            if (queryParams['storeId'] !== undefined) {
               this.storeId = queryParams['storeId'];
               this.searchCriteria.storeId = this.storeId;
               this.searchCriteria.topProperty = 1;
               this.getStoresFromCat();
               this.getStore();
            }

            if (queryParams['storeCatId'] !== undefined) {
               this.storeCatId = queryParams['storeCatId'];
               this.searchCritCopy.rooms = 1;
               this.searchCritCopy.adults = 1;
               this.searchCritCopy.days = 1;
               this.searchCritCopy.children = 1;
               this.searchCritCopy.checkinDate = new Date();
               this.searchCritCopy.checkoutDate = new Date();
               this.searchCriteria.topProperty = 1;
               this.getStoresFromCat();
            }

         });
      });


      this.watcher = this.mediaObserver.media$.subscribe((change: MediaChange) => {
         if (change.mqAlias === 'xs') {
            this.viewCol = 100;
         } else if (change.mqAlias === 'sm') {
            this.viewCol = 50;
         } else if (change.mqAlias === 'md') {
            this.viewCol = 50;
         } else {
            this.viewCol = 33.3;
         }
         this.viewCol = 100;
      });

   }

   getStore() {
      // alert(this.storeId);
      if (this.storeId > 0) {
         this.appService.saveWithUrl('/service/catalog/getStore', { 'type': 'Store', 'id': this.storeId })
            .subscribe(result => {
               if (result.id > 0) {
                  this.store = result;
                  this.translate.get('COMMON.TOP_STORE_PROPERTIES',
                     {
                        STORE_NAME: this.store.name
                     }).subscribe((res) => {
                        this.topPropertiesLabel = res;
                     });
               }
            });
      }
   }

   setImage() {
      if (this.store) {
         if (this.store.storeFrontImage) {
            this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle('url(' +
               '/assets/images/stores/' + this.store.id + '/' + this.store.storeFrontImage + ')');
         } else {
            this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle('url(/assets/images/page-title-bar.jpg)');
         }
      } else {
         this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle('url(/assets/images/page-title-bar.jpg)');
      }
      console.log(this.backgroundImg);
   }


   public getStoresFromCat() {
      this.appService.saveWithUrl('/service/hospitality/getBuildings/',
         this.searchCriteria).subscribe((data: BuildingVO[]) => {
            this.buildings = data;
            console.log(this.buildings);
            if (this.buildings.length === 1) {
               const bldg = this.buildings[0];
               this.router.navigate(['/rooms/detail/'],
                  {
                     queryParams: {
                        storeId: bldg.buildingType === 1 ? bldg.storeId : 0,
                        bdgId: bldg.buildingType === 1 ? 0 : bldg.buildingId,
                        checkinDate: formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'),
                        checkoutDate: formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'),
                        rooms: 1,
                        adults: 1,
                        days: 1,
                        children: 1
                     }
                  });
            }
         },
            error => console.log(error),
            () => console.log('Get all buildings complete'));
   }


   filterCities() {
      this.filteredStores = [];
      if (this.stores && this.stores.length > 0) {
         for (const st of this.stores) {
            const index: number = this.filteredStores.findIndex((tb) => tb.cityCountryName === st.cityCountryName);
            console.log(st.cityCountryName + '--' + index);
            if (index === -1) {
               this.filteredStores.push(st);
            }
         }
      }
   }


   // Getting all the product based on the Top Search
   getRooms() {
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
            // if (data.roomStoreVOs && data.roomStoreVOs.length > 0) {
            this.applyGridFilter(data);
            // }
            console.log(data);
         },
            error => console.log(error),
            () => console.log('Get all getRoomsOnSale complete'));
   }

   applyGridFilter(data) {
      // Make a copy of the backend returned data to avoid going to backend when a filtering is made.
      this.roomList = data;
      this.currentFilteredRoomList = undefined;
      this.translate.get(['COMMON.ALL_CATEGORIES', 'COMMON.ALL_CATEGORIES']).subscribe(res => {
         this.dummyCat = res['COMMON.ALL_CATEGORIES'];
      });

      // Making the category list.
      if (this.roomList && this.roomList.roomTypes) {
         this.roomList.roomTypes.unshift(this.dummyCat);
      }

      this.createDatasource(data.roomStoreVOs);
   }

   public getData() {
      const parameters: string[] = [];
      this.appService.getAllByCriteria('com.softenza.emarket.model.Language',
         parameters, ' order by e.sortOrder ')
         .subscribe((data: Language[]) => {
            let lang = navigator.language;
            if (lang) {
               lang = lang.substring(0, 2);
            }
            if (Cookie.get('lang')) {
               lang = Cookie.get('lang');
               console.log('Using cookie lang=' + Cookie.get('lang'));
            } else if (lang) {
               console.log('Using browser lang=' + lang);
               // this.translate.use(lang);
            } else {
               lang = 'fr';
               console.log('Using default lang=fr');
            }
            data.forEach(language => {
               if (language.code === lang) {
                  this.getRooms();
               }
            });

         }, error => console.log(error),
            () => console.log('Get Languages complete'));
   }

   public applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }

   public applyAllFilter() {
      this.firstPagePagination();
      this.createDatasource(this.filterDataBySearchCriteria(this.searchCriteria, this.dummyCat));
      this.resetPagination();
   }

   public getCartPopupResponse(response: any, value: any) {
      if (response) {

      }
   }

   public addToWishList(value) {
      if (value.product.hasOption === 1) {
         this.appService.productOptionPopup(value).
            subscribe(res => { this.popupResponse = res; },
               err => console.log(err),
               () => this.getWishPopupResponse(this.popupResponse, value)
            );
      } else {
         const ci = new CartItem(value);
         this.appService.addToWishlist(ci);
      }
   }

   public getWishPopupResponse(response: any, value: any) {
      if (response) {
         const ci = new CartItem(value);
         ci.quantity = value.quantity;
         this.appService.addToWishlist(ci);
      }
   }

   public transformHits(hits) {
      hits.forEach(hit => {
         hit.stars = [];
         for (let i = 1; i <= 5; i) {
            hit.stars.push(i <= hit.rating);
            i += 1;
         }
      });
      return hits;
   }

   public changeCount(count) {
      this.count = count;
      // this.products.length = 0;
      this.resetPagination();
      this.filterProducts();
   }

   public changeSorting(sort) {
      this.sort = sort;
      this.filterProducts();
   }

   public changeViewType(obj) {
      if (obj.viewType === 'list') {
         this.changeCount(1);
      } else if (this.count === 1) {
         this.changeCount(6);
      }
      this.viewType = obj.viewType;
      this.viewCol = obj.viewCol;
   }


   public onPageChange(e) {
      this.pagination.page = e.pageIndex + 1;
      this.filterProducts();
      // window.scrollTo(0, 0);
   }

   public resetPagination() {
      console.log('resetPagination called');
      this.firstPagePagination();
      this.pagination.totalPages = Math.ceil(this.pagination.total / this.count);
      this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
   }

   public firstPagePagination() {
      if (this.paginator) {
         this.paginator.pageIndex = 0;
         this.paginator.firstPage();
      }
   }

   public filterProducts() {
      this.createDatasource(this.currentFilteredRoomList && this.currentFilteredRoomList.roomStoreVOs
         ? this.currentFilteredRoomList.roomStoreVOs : this.roomList.roomStoreVOs);
   }

   public searchClicked(data: string) {
      this.searchCriteria.text = data.trim().toLowerCase();
      this.firstPagePagination();
      this.createDatasource(this.filterDataBySearchCriteria(this.searchCriteria, this.dummyCat));
      this.resetPagination();

   }

   filterDataBySearchCriteria(searchCriteria, dummyCat) {
      const filteredData = this.roomList.roomStoreVOs.filter(function (data) {
         const found = true;
         // if (searchCriteria.priceMin && searchCriteria.priceMax) {

         //    if (!(data..price >= searchCriteria.priceMin
         //       && data.price <= searchCriteria.priceMax)) {
         //       found = false;
         //    }
         // } else if (searchCriteria.priceMin && !searchCriteria.priceMax) {
         //    if (!(data.price >= searchCriteria.priceMin)) {
         //       found = false;
         //    }
         // } else if (!searchCriteria.priceMin && searchCriteria.priceMax) {
         //    if (!(data.price <= searchCriteria.priceMax)) {
         //       found = false;
         //    }
         // }

         // if (searchCriteria.roomTypeName) {
         //    if (!(searchCriteria.roomTypeName === data.roomTypeName) &&
         //       searchCriteria.roomTypeName !== dummyCat) {
         //       found = false;
         //    }
         // }

         // if (searchCriteria.text) {
         //    if (!(data.roomTypeName.toLowerCase().indexOf(searchCriteria.text.toLowerCase()) > -1)) {
         //       found = false;
         //    }
         // }
         console.log('Filter Predicate called.');
         return found;
      });

      this.currentFilteredRoomList = new RoomListVO();
      this.currentFilteredRoomList.roomStoreVOs = filteredData;
      return filteredData;
   }


   createDatasource(listData) {
      // this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
      this.message = null;
      const result = this.filterData(listData);
      if (result.data.length === 0) {
         this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
         this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
            this.message = res['MESSAGE.NO_RESULT_FOUND'];
         });
      }

      this.dataSource = new MatTableDataSource(result.data);
      this.pagination = result.pagination;
   }

   public filterData(data) {
      return this.appService.filterData(data, this.searchFields, this.sort.code, this.pagination.page, this.pagination.perPage);
   }

   selectForSaleProduct($event) {
      console.log($event);
   }

   filterOptions(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
         this.filteredStores = this.stores
            .filter((store) => {
               /*  store.address.city
                   && store.address.city.toLowerCase().startsWith(filterValue); */
            });
      } else {
         this.filteredStores = this.stores;
      }
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

   sortSelected() {
      if (this.sortSelect === 1) {
         this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
            if (a.lowestPrice < b.lowestPrice) {
               return -1;
            } else if (a.lowestPrice > b.lowestPrice) {
               return 1;
            } else {
               return 0;
            }
         });

      } else if (this.sortSelect === 2) {
         this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
            if (a.highestPrice > b.highestPrice) {
               return -1;
            } else if (a.highestPrice < b.highestPrice) {
               return 1;
            } else {
               return 0;
            }
         });
      } else if (this.sortSelect === 3) {
         this.dataSource.data = this.appService.sortData('rating', this.dataSource.data);
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

   searchEventHandler(data: RoomListVO) {
      this.applyGridFilter(data);
   }

   isHotel(bdg: BuildingVO) {
      return bdg.buildingType === 1
   }
}
