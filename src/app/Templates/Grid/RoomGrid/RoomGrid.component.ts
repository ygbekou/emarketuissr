import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { HotelSearchCriteria } from 'src/app/app.models';

@Component({
   selector: 'embryo-RoomGrid',
   templateUrl: './RoomGrid.component.html',
   styleUrls: ['./RoomGrid.component.scss']
})
export class RoomGridComponent implements OnInit {

   @Input() roomStores: any;
   @Input() searchCriteria: HotelSearchCriteria;
   @Input() days: number;
   @Input() rooms: number;
   @Input() adults: number;
   @Input() currency: string;
   @Input() fromPage: string;
   @Input() gridLength: any;
   @Input() viewType: any;
   @Input() viewCol: any;
   @Output() selectRoomStore: EventEmitter<any> = new EventEmitter();
   @Output() removeRoomStore: EventEmitter<any> = new EventEmitter();
   @Input() gridThree = false;
   @Output() addToCart: EventEmitter<any> = new EventEmitter();
   @Output() addToWishList: EventEmitter<any> = new EventEmitter();
   loaded = false;
   lg = 25;
   xl = 25;
   trackByObjectID(index, hit) {
      return hit.objectID;
   }

   constructor(public appService: AppService) { }
   ngOnInit() {
      if (this.gridThree) {
         this.lg = 33;
         this.xl = 33;
      }
   }

   public selectForSaleRoomStore(roomStore: any) {
      this.selectRoomStore.emit(roomStore);
   }

   public removeRoomStoreFromList(roomStore: any) {
      this.removeRoomStore.emit(roomStore);
   }

   public addToCartProduct(value: any) {
      this.addToCart.emit(value);
   }

   public onLoad() {
      this.loaded = true;
   }

   public productAddToWishlist(value: any, parentClass) {
      if (!(document.getElementById(parentClass).classList.contains('wishlist-active'))) {
         const element = document.getElementById(parentClass).className += ' wishlist-active';
      }
      // const ci = new CartItem(value);
      this.addToWishList.emit(value);
   }

   public checkCartAlready(singleProduct) {
      const products = JSON.parse(window.localStorage.getItem('cart_item')) || [];
      if (!products.some((item) => item.name === singleProduct.name)) {
         return true;
      }
   }
}
