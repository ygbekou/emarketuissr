import { Component, OnInit, Input, OnChanges, Renderer2, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AppService } from '../../Services/app.service';
import { ProductDescription } from 'src/app/app.models';

@Component({
   selector: 'embryo-ShopDetails',
   templateUrl: './ShopDetails.component.html',
   styleUrls: ['./ShopDetails.component.scss']
})
export class ShopDetailsComponent implements OnInit, OnChanges {

   @Input() detailData: ProductDescription;
   @Input() currency: string;
   @Input() fromPage: string;
   @Output() sellProduct: EventEmitter<any> = new EventEmitter();
   @Output() selectProduct: EventEmitter<any> = new EventEmitter();
   mainImgPath: string;
   totalPrice: any;
   type: any;
   colorsArray: string[] = ['Red', 'Blue', 'Yellow', 'Green'];
   sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   productReviews: any;

   constructor(private route: ActivatedRoute,
      private router: Router,
      public appService: AppService
   ) {
      console.log('constructor called');
      console.log(this.detailData);
      this.appService.getProductReviews().valueChanges().subscribe(res => { this.productReviews = res });
   }

   ngOnInit() {
      console.log('ngOnInit called');
      console.log(this.detailData);
      this.mainImgPath = 'assets/images/products/' + this.detailData.product.id + '/' + this.detailData.product.image;
      this.totalPrice = this.detailData.product.price;

      this.route.params.subscribe(res => {
         this.type = null;
         this.type = res.type;
      });
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
      this.totalPrice = detailData.price * value;
   }

   public reviewPopup(detailData) {
      let reviews: any = null;
      for (let review of this.productReviews) {
         reviews = review.user_rating;
      }

      this.appService.reviewPopup(detailData, reviews);
   }

   public addToWishlist(value: any) {
      this.appService.addToWishlist(value);
   }

   public addToCart(value: any) {
      this.appService.addToCart(value);
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
