import { Component, OnInit, Input, OnChanges, Renderer2, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AppService } from '../../Services/app.service';
import { ProductDescription, ProductDescVO, CartItem } from 'src/app/app.models';
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
      const ci = new CartItem(value);
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

}
