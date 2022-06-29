import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartItem, ProductVO, ProductDescVO, GenericResponse } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

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

   public errors: string;

   @Output() addToCart: EventEmitter<any> = new EventEmitter();

   @Output() addToWishList: EventEmitter<any> = new EventEmitter();

   loaded = false;
   lg = 25;
   xl = 25;

   trackByObjectID(index, hit) {
      return hit.objectID;
   }

   constructor(public appService: AppService,
      public translate: TranslateService) { }

   ngOnInit() {

      if (this.gridThree) {
         this.lg = 33;
         this.xl = 33;
      }

      console.log('Products:  ');
      console.log(this.products);
   }

   public selectForSaleProduct(product: any) {
      this.selectProduct.emit(product);
   }

   public removeProductFromList(product: any) {
      this.removeProduct.emit(product);
   }

   toggleAvailableOnline(prdDescVo: ProductDescVO) {
      const availOnline = prdDescVo.product.availableOnline = (prdDescVo.product.availableOnline == null
         || prdDescVo.product.availableOnline.toString() === 'false'
         || prdDescVo.product.availableOnline.toString() === '0') ? 1 : 0;

      this.appService.updateObject('/service/catalog/setOnlineOffline/' +
         prdDescVo.product.ptsId + '/' + availOnline + '/'
         + this.appService.tokenStorage.getUserId()).subscribe(async (data: GenericResponse) => {
            if (data.result === 'SUCCESS') {
               this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_SUCCESS'];
               });
            } else {
               this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
               });
            }
         },
            (error) => console.log(error),
            () => console.log('closeTab complete'));
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
