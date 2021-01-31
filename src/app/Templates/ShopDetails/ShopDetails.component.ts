import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../Services/app.service';
import { ProductDescVO, CartItem, ProductStoreOptionValueVO } from 'src/app/app.models';

@Component({
   selector: 'embryo-ShopDetails',
   templateUrl: './ShopDetails.component.html',
   styleUrls: ['./ShopDetails.component.scss']
})
export class ShopDetailsComponent implements OnInit, OnChanges {

   @Input() detailData: ProductDescVO;
   @Input() currency: string;
   @Input() fromPage: string;
   @Output() sellProduct: EventEmitter<any> = new EventEmitter();
   @Output() selectProduct: EventEmitter<any> = new EventEmitter();
   mainImgPath: string;
   totalPrice: any;
   type: any;
   qty = 1;
   colorsArray: string[] = ['Red', 'Blue', 'Yellow', 'Green'];
   sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   productReviews: any;

   queryParams: any;

   constructor(private route: ActivatedRoute,
      private router: Router,
      public appService: AppService
   ) {
      console.log('constructor called');
   }

   ngOnInit() {
      console.log('ngOnInit called');
      this.mainImgPath = 'assets/images/products/' + this.detailData.product.id + '/' + this.detailData.product.image;
      this.totalPrice = this.detailData.product.price;
      this.queryParams = {
         storeId: this.detailData.product.storeId
      };

      this.route.params.subscribe(res => {
         this.type = null;
         this.type = res.type;

         if (!this.detailData.product.selectedOptionsMap) {
            this.detailData.product.selectedOptionsMap = new Map();
         }
         this.detailData.product.totalPrice = this.detailData.product.price;
      });

      if (this.detailData && this.detailData.product) {
         console.log(this.detailData.product.quantity);
         console.log(this.detailData);
      } else {
         console.log(this.detailData);
      }
   }

   ngOnChanges() {
      console.log('ngOnChanges called');
      console.log(this.detailData);
      this.mainImgPath = null;
      this.totalPrice = null;
      this.mainImgPath = 'assets/images/products/' + this.detailData.product.id + '/' + this.detailData.product.image;
      this.totalPrice = this.detailData.product.price;
   }

   /**
    * getImagePath is used to change the image path on click event.
    */
   public getImagePath(imgPath: string, index: number) {
      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index + '_img').className += ' border-active';
   }

   public calculatePrice(detailData: any, value: any) {
      detailData.quantity = value;
      this.totalPrice = detailData.product.price * value;
   }

   public addToWishlist(value: any) {
      const ci = new CartItem(value);
      this.appService.addToWishlist(ci);
   }

   public addToCart(value: any) {
      const ci = new CartItem(this.detailData);
      ci.quantity = this.qty;
      this.appService.addToCart(ci);
   }

   public buyNow(value: any) {
      this.appService.buyNow(value);
      this.router.navigate(['/checkout']);
   }

   public selectForSaleProduct(product: any) {
      this.selectProduct.emit(product);
   }

   public submitProductForSale(product: any) {
      this.sellProduct.emit(product);
   }

   checkboxChange(event, prdStoreOptionValue: ProductStoreOptionValueVO ) {
      const optionKey = prdStoreOptionValue.optionId + '|' + prdStoreOptionValue.optionValueId;
      if (this.detailData.product.selectedOptionsMap[optionKey] === undefined) {
         if (event.checked) {
            this.detailData.product.selectedOptionsMap[optionKey] = prdStoreOptionValue;
         }
      } else {
         if (!event.checked) {
            delete this.detailData.product.selectedOptionsMap[optionKey];
         }
      }

      this.updatePriceWithOptions();
   }

   radioButtonChange( event, prdStoreOptionValue: ProductStoreOptionValueVO ) {
      const optionKey = prdStoreOptionValue.optionId;
      this.detailData.product.selectedOptionsMap[optionKey] = prdStoreOptionValue;

      this.updatePriceWithOptions();
   }

   singleSelectionChange(event, prdStoreOptionValue: ProductStoreOptionValueVO ) {
      const optionKey = prdStoreOptionValue.optionId;
      this.detailData.product.selectedOptionsMap[optionKey] = prdStoreOptionValue;

      this.updatePriceWithOptions();
   }

   public updatePriceWithOptions() {
      let totalOptionPrice = 0;
      for (const [key, optionDesc] of Object.entries(this.detailData.product.selectedOptionsMap)) {
         if (optionDesc.price !== undefined && optionDesc.price > 0 ) {
            if (optionDesc.pricePrefix === '+') {
               totalOptionPrice += optionDesc.price;
            } else if (optionDesc.pricePrefix === '-') {
               totalOptionPrice -= optionDesc.price;
            }
         }
      }

      this.detailData.product.totalPrice = (this.detailData.product.percentagePrice > 0 ? this.detailData.product.percentagePrice
                                    : this.detailData.product.price) + totalOptionPrice;
   }

}
