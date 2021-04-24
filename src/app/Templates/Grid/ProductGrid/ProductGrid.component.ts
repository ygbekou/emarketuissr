import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';

@Component({
   selector: 'embryo-ProductGrid',
   templateUrl: './ProductGrid.component.html',
   styleUrls: ['./ProductGrid.component.scss']
})
export class ProductGridComponent implements OnInit {

   @Input() products: any;

   @Input() currency: string;
   @Input() fromPage: string;
   @Input() gridLength: any;
   @Input() viewType: any;
   @Input() viewCol: any;
   @Output() selectProduct: EventEmitter<any> = new EventEmitter();
   @Output() removeProduct: EventEmitter<any> = new EventEmitter();
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

   public selectForSaleProduct(product: any) {
      this.selectProduct.emit(product);
   }

   public removeProductFromList(product: any) {
      this.removeProduct.emit(product);
   }

   public addToCartProduct(value: any) {
      // const ci = new CartItem(value);
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
