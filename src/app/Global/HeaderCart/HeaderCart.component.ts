import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
   selector: 'embryo-HeaderCart',
   templateUrl: './HeaderCart.component.html',
   styleUrls: ['./HeaderCart.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderCartComponent implements OnInit, OnChanges {

   @Input() cartProducts: any;
   @Input() count: any;
   @Input() currency: string;

   mobWidth: any;
   mobScreenSize: number = 767;

   @Output() removeProductData: EventEmitter<any> = new EventEmitter();

   hiddenBadge = true;

   constructor() {
      this.mobWidth = window.screen.width;
   }

   ngOnInit() {
      this.cartProducts = JSON.parse(localStorage.getItem('cart_item'));
      if (this.cartProducts) {
         this.count = this.cartProducts.length;
         if (this.count && this.count !== 0) {
            this.hiddenBadge = false;
         } else {
            this.hiddenBadge = true;
         }
      } 
   }

   ngOnChanges() {
      if (this.count && this.count != 0) {
         this.hiddenBadge = false;
      } else {
         this.hiddenBadge = true;
      }
   }

   public confirmationPopup(product: any) {
      this.removeProductData.emit(product);
   }

   public calculatePrice(product) {
      let total = null;
      total = product.price * product.quantity;
      return total;
   }
}