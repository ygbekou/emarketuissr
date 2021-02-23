import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../Services/app.service';
import { ProductDescVO, CartItem, ProductOption, ProductOptionValue } from 'src/app/app.models';
import { Constants } from 'src/app/app.constants';
import { Title, Meta } from '@angular/platform-browser';

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
   url = '';
   colorsArray: string[] = ['Red', 'Blue', 'Yellow', 'Green'];
   sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   productReviews: any;

   queryParams: any;
   error: string;

   constructor(private route: ActivatedRoute,
      private router: Router,

      private titleService: Title,
      private metaService: Meta,
      public appService: AppService
   ) {
      console.log(' ShopDetailsComponent - constructor called');
   }

   ngOnInit() {
      console.log(' ShopDetailsComponent- ngOnInit called - from page = ' + this.fromPage);
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

      this.titleService.setTitle(this.detailData.name);

      this.url = Constants.webServer + '/#/products/dtl/'
         + this.detailData.product.id + '/' + this.detailData.product.ptsId;
      const descTag = { property: 'og:description', content: this.detailData.description };
      const descSel = 'property="og:description"';
      this.metaService.removeTag(descSel);
      this.metaService.addTag(descTag, false);

      const imgTag = {
         property: 'og:image', content: Constants.webServer
            + '/assets/images/products/' + this.detailData.product.id + '/' + this.detailData.product.image
      };
      const imgSel = 'property="og:image"';
      this.metaService.removeTag(imgSel);
      this.metaService.addTag(imgTag, false);

      const urlTag = { property: 'og:url', content: this.url };
      const urlSel = 'property="og:url"';
      this.metaService.removeTag(urlSel);
      this.metaService.addTag(urlTag, false);

      const titleTag = { property: 'og:title', content: this.detailData.name };
      const titleSel = 'property="og:title"';
      this.metaService.removeTag(titleSel);
      this.metaService.addTag(titleTag, false);

      const typeTag = { property: 'og:type', content: 'Article' };
      const typeSel = 'property="og:type"';
      this.metaService.removeTag(typeSel);
      this.metaService.addTag(typeTag, false);
   }

   ngOnChanges() {
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

      let errorFound = false;
      this.error = '';
      this.detailData.povos.forEach(optionDesc => {
         if (optionDesc.optionType === 'Text' || optionDesc.optionType === 'Textarea') {
            optionDesc.povs.forEach(optionValueDesc => {
               if (optionValueDesc.value !== undefined && optionValueDesc.value !== null) {
                  this.detailData.product.selectedOptionsMap[optionDesc.id] = optionValueDesc;
               }
            });
         }

         if (optionDesc.required === 1 && !this.detailData.product.selectedOptionsMap[optionDesc.id]) {
            this.error = 'The option: ' + optionDesc.name + ' is required.';
            errorFound = true;
         }
      });

      if (errorFound) {
         return;
      }

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

  checkboxChange(event, prdOption: ProductOption, prdOptionValue: ProductOptionValue ) {

    const optionKey = prdOption.id + '|' + prdOptionValue.ovId;
    if (this.detailData.product.selectedOptionsMap[optionKey] === undefined) {
        if (event.checked) {
          this.detailData.product.selectedOptionsMap[optionKey] = prdOptionValue;
        }
    } else {
        if (!event.checked) {
          delete this.detailData.product.selectedOptionsMap[optionKey];
        }
    }

    this.updatePriceWithOptions();
  }

   radioButtonChange( event, prdOption: ProductOption, prdOptionValue: ProductOptionValue ) {
      const optionKey = prdOption.id;
      this.detailData.product.selectedOptionsMap[optionKey] = prdOptionValue;

      this.updatePriceWithOptions();
   }

   singleSelectionChange(event, prdOption: ProductOption, prdOptionValue: ProductOptionValue ) {
      const optionKey = prdOption.id;
      this.detailData.product.selectedOptionsMap[optionKey] = prdOptionValue;

      this.updatePriceWithOptions();
   }

   public updatePriceWithOptions() {
      let totalOptionPrice = 0;
      for (const [key, optionDesc] of Object.entries(this.detailData.product.selectedOptionsMap)) {
         if (optionDesc['price'] !== undefined && optionDesc['price'] > 0 ) {
            if (optionDesc['pricePrefix'] === '+') {
               totalOptionPrice += optionDesc['price'];
            } else if (optionDesc['pricePrefix'] === '-') {
               totalOptionPrice -= optionDesc['price'];
            }
         }
      }

      this.detailData.product.totalPrice = (this.detailData.product.percentagePrice > 0 ? this.detailData.product.percentagePrice
                                    : this.detailData.product.price) + totalOptionPrice;
   }
}
