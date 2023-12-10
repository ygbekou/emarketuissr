import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ChangeDetectorRef } from '@angular/core';

import { AppService } from '../../Services/app.service';
import { Order, User, ZoneToGeoZone, Store } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/app.constants';

@Component({
   selector: 'embryo-Cart',
   templateUrl: './Cart.component.html',
   styleUrls: ['./Cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewChecked {
   error: string;
   message: string;
   order: Order;
   products: any;
   user: User = new User();
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   popupResponse: any;
   @Input()
   storeId: number;
   @Input()
   store: Store;
   @Input() purchasePossible: boolean;
   @Input()
   pickUp;
   @Output()
   orderCompleteEvent = new EventEmitter<Order>();
   @Output()
   placeYourOrderEvent = new EventEmitter<any>();
   @Input()
   zoneToGeoZone: ZoneToGeoZone;
   changed = false;
   constructor(public appService: AppService,
      private router: Router,
      private translate: TranslateService,
      private loadingBar: LoadingBarService,
      private cdRef: ChangeDetectorRef) {
      this.getUser(Number(this.appService.tokenStorage.getUserId()));

   }

   ngOnInit() {
   }


   getUser(userId: number) {
      this.appService.getOneWithChildsAndFiles(userId, 'User')
         .subscribe(result => {
            if (result.id > 0) {
               this.user = result;
            } else {
               this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                  this.error = res['MESSAGE.READ_FAILED'];
               });
            }
         });
   }
   ngAfterViewChecked(): void {
      this.cdRef.detectChanges();
   }

   public removeProduct(value: any) {
      const message = 'Are you sure you want to delete this product?';
      this.appService.confirmationPopup(message).
         subscribe(res => { this.popupResponse = res; },
            err => console.log(err),
            () => this.getPopupResponse(this.popupResponse, value)
         );
   }

   public getPopupResponse(response, value) {
      if (response) {
         this.appService.removeLocalCartProduct(value);
      }
   }

   public calculateProductSinglePrice(product: any, value: any) {
      product.quantity = value;
      const price = this.appService.calculateCartItemTotal(product);
      if (this.changed) {
         // this.appService.recalculateCart(false);
         this.calculateShippingCost();
         this.changed = false;
      }
      return price;
   }

   public calculateTotalPrice() {
      let subtotal = 0;
      if (this.appService.localStorageCartProducts && this.appService.localStorageCartProducts.length > 0) {
         for (const product of this.appService.localStorageCartProducts) {
            subtotal += this.calculateProductSinglePrice(product, product.quantity);
         }
         return subtotal;
      }
      return subtotal;

   }

   public getTotalPrice() {
      let total = 0;
      const totalShippingWeight = 0;
      const shippingPrice = 0;
      if (this.appService.localStorageCartProducts && this.appService.localStorageCartProducts.length > 0) {
         for (const product of this.appService.localStorageCartProducts) {
            total += (product.price * product.quantity);
         }
         total += (this.appService.shipping + this.appService.tax);
         return total;
      }

      return total;

   }

   public updateLocalCartProduct() {
      this.appService.updateAllLocalCartProduct(this.appService.localStorageCartProducts);
      this.router.navigate(['/checkout']);
   }

   public getQuantityValue(product) {
      if (product.quantity) {
         return product.quantity;
      } else {
         return 1;
      }
   }

   placeYourOrder() {
      this.placeYourOrderEvent.emit();
   }


   updateCartProducts() {
      const cartProducts = [];
      for (const [key, value] of Object.entries(this.appService.localStorageCartProductsMap)) {
         cartProducts.push(...<[]>value);
      }
      setTimeout(() => {
         localStorage.setItem('cart_item', JSON.stringify(cartProducts));
      }, 500);

   }


   public calculateShippingCost() {
      console.log('Calculating shipping cost');
      console.log(this.store);
      console.log(this.user.shippingAddress);
      this.appService.distance = 0.0;
      if (this.store.latitude && this.store.longitude
         && this.user.shippingAddress &&
         this.user.shippingAddress.latitude
         && this.user.shippingAddress.longitude) {
         const distance = Math.ceil(google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(this.user.shippingAddress.latitude,
               this.user.shippingAddress.longitude),
            new google.maps.LatLng(this.store.latitude, this.store.longitude)) / 1000.0);
         console.log('Distance = ' + distance);
         console.log('this.store.maxDistance = ' + this.store.maxDistance);
         if (this.store.maxDistance
            && distance > this.store.maxDistance) {
            this.appService.distance = distance;
            this.translate.get('MESSAGE.MAX_DELIVERY_DIST_EXCEEDED',
               {
                  store_name: this.store.name,
                  max_distance: this.store.maxDistance,
               }).subscribe((res) => {
                  this.error = res;
                  // this.maxDistExceeded = res;
               });
         } else {
            this.appService.distance = distance;
            this.appService.recalculateCart(false);
         }
      } else {
         this.appService.recalculateCart(false);
      }
   }
}
