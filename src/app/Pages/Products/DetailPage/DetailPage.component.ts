import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../../Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MediaObserver } from '@angular/flex-layout';
import { ProductDescVO, Language, ProductSearchCriteria, CartItem } from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
   selector: 'app-DetailPage',
   templateUrl: './DetailPage.component.html',
   styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent extends BaseComponent implements OnInit {

   prdId = 0;
   ptsId = 0;
   topN = 4;
   public viewType = 'grid';
   public viewCol = 25;
   products: ProductDescVO[] = [];
   product: ProductDescVO;
   popupResponse: any;

   constructor(public appService: AppService,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private activatedRoute: ActivatedRoute) {
      super(translate);
   }

   ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
         // path: 'dtl/:prdId/:ptsId',
         this.prdId = params.prdId;
         this.ptsId = params.ptsId;
         this.topN = 4;
         /* 
         console.log(params.prdId);
         console.log(params.ptsId); */
         this.getData();
      });

   }

   getProduct(langId: number) {
      this.appService.getObject('/service/catalog/getProductOnSale/' +
         langId + '/' + this.ptsId)
         .subscribe((data: ProductDescVO) => {
            console.log(data)
            this.product = data;
            this.getRelatedProducts(langId);
         },
            error => console.log(error),
            () => console.log('Get all getProductOnSale complete'));
   }

   /*   constructor(public languageId: number,
              public storeId: number,
              public marketingId: number,
              public catId: number,
              public searchText: string,
              public fromWeb = 1,
              public productId: number,
              public topN: number,
              public userId: number,
  ) */

   getRelatedProducts(langId: number) {
      this.appService.saveWithUrl('/service/catalog/getRelatedProductsOnSale/',
         new ProductSearchCriteria(
            langId, 0, 0, 0, '0', 1, this.product.product.id, this.topN, 0, 0
         ))
         .subscribe((data: ProductDescVO[]) => {
            this.products = data;
            console.log(this.products);
         },
            error => console.log(error),
            () => console.log('Get all getRelatedProductsOnSale complete'));
   }

   showMore() {
      this.topN += 4;
      this.getRelatedProducts(this.appService.appInfoStorage.language.id);
   }
   public getData() {
      const parameters: string[] = [];
      this.appService.getAllByCriteria('com.softenza.emarket.model.Language',
         parameters, ' order by e.sortOrder ')
         .subscribe((data: Language[]) => {
            let lang = navigator.language;
            if (lang) {
               lang = lang.substring(0, 2);
            }
            if (Cookie.get('lang')) {
               lang = Cookie.get('lang');
               console.log('Using cookie lang=' + Cookie.get('lang'));
            } else if (lang) {
               console.log('Using browser lang=' + lang);
               // this.translate.use(lang);
            } else {
               lang = 'fr';
               console.log('Using default lang=fr');
            }
            data.forEach(language => {
               if (language.code === lang) {
                  this.getProduct(language.id);
               }
            });

         }, error => console.log(error),
            () => console.log('Get Languages complete'));
   }


   public addToCart(value) {
      if (value.product.hasOption === 1) {
         this.appService.productOptionPopup(value).
         subscribe(res => { this.popupResponse = res; },
            err => console.log(err),
            () => this.getCartPopupResponse(this.popupResponse, value)
         );
      } else {
         const ci = new CartItem(value);
         this.appService.addToCart(ci);
      }
   }

   public getCartPopupResponse(response: any, value: any) {
      if (response) {
         const ci = new CartItem(value);
         this.appService.addToCart(ci);
      }
   }

   public addToWishList(value) {
      if (value.product.hasOption === 1) {
         this.appService.productOptionPopup(value).
         subscribe(res => { this.popupResponse = res; },
            err => console.log(err),
            () => this.getWishPopupResponse(this.popupResponse, value)
         );
      } else {
         const ci = new CartItem(value);
         this.appService.addToWishlist(ci);
      }
   }

   public getWishPopupResponse(response: any, value: any) {
      if (response) {
         const ci = new CartItem(value);
         this.appService.addToWishlist(ci);
      }
   }

}
