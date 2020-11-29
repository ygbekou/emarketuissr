import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ChangeDetectorRef } from '@angular/core';

import { AppService } from '../../Services/app.service';

@Component({
   selector: 'embryo-Cart',
   templateUrl: './Cart.component.html',
   styleUrls: ['./Cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewChecked {

   products: any;
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   popupResponse: any;

   constructor(public appService: AppService,
      private router: Router,
      private loadingBar: LoadingBarService,
      private cdRef: ChangeDetectorRef) {
   }

   ngOnInit() {
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
      let price = 0;
      product.quantity = value;
      price = product.product.price * value;

      this.appService.calculateLocalCartInfos();
      return price;
   }

   public calculateTotalPrice() {
      let subtotal = 0;
      if (this.appService.localStorageCartProducts && this.appService.localStorageCartProducts.length > 0) {
         for (const product of this.appService.localStorageCartProducts) {
            subtotal += (product.price * product.quantity);
         }
         return subtotal;
      }
      return subtotal;

   }

   public getTotalPrice() {
      let total = 0;
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
}
