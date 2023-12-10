import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Data } from '@angular/router';
import { AppService } from '../../../Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MediaObserver } from '@angular/flex-layout';
import { ProductDescVO, Language, ProductSearchCriteria, CartItem } from 'src/app/app.models';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { Meta } from '@angular/platform-browser';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

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
   url: string;

   constructor(public appService: AppService,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private readonly metaService: Meta,
      @Inject(PLATFORM_ID) private platformId: Object) {
      super(translate);

      // this.activatedRoute.data.subscribe((response: any) => {
      //    console.log('PRODUCT FETCHING', response);
      //    this.product = response.product;
      //    this.setMeta(this.product);
      //    console.log('PRODUCT FETCHED');
      // });

   }

   ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
         // path: 'dtl/:prdId/:ptsId',
         this.prdId = params.prdId;
         this.ptsId = params.ptsId;
         this.topN = 4;
         this.url = 'http://100.24.25.220:4000' + '/#/products/dtl/'
            + params.prdId + '/' + params.ptsId;
         /* 
         console.log(params.prdId);
         console.log(params.ptsId); */

         this.getData();
      });

      console.log(
         'Activated route data in Component:::',
         this.activatedRoute.data
      );
   }

   getProduct(langId: number) {
      this.appService.getObject('/service/catalog/getProductOnSale/' +
         langId + '/' + this.ptsId)
         .subscribe((data: ProductDescVO) => {
            console.log(data)
            this.product = data;
            //this.setMeta(this.product);
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
            langId, 0, 0, 0, '0', 1, this.product.product.id, this.topN, 0, 0, 0
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
            let lang = this.appService.navigator.language;
            if (lang) {
               lang = lang.substring(0, 2);
            }
            // if (this.cookieService.get('lang')) {
            //    lang = this.cookieService.get('lang');
            //    console.log('Using cookie lang=' + this.cookieService.get('lang'));
            // } else if (lang) {
            //    console.log('Using browser lang=' + lang);
            //    // this.translate.use(lang);
            // } else {
            //    lang = 'fr';
            //    console.log('Using default lang=fr');
            // }
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


   setMeta(data: ProductDescVO) {

      console.log(data);

      const url = 'http://100.24.25.220:4000' + '/#/products/dtl/'
         + data.product.id + '/' + data.product.ptsId;

      //  this.url = 'https://www.amazon.com/Lenovo-Tab-M10-Plus-Tablet/dp/B09TPY1PZZ/?_encoding=UTF8&pd_rd_w=Fm934&content-id=amzn1.sym.5d6183d9-1130-430c-a422-12838648d677&pf_rd_p=5d6183d9-1130-430c-a422-12838648d677&pf_rd_r=EATMSA4QQX97AGVV25S9&pd_rd_wg=olZSg&pd_rd_r=da195456-3508-48d5-b292-d90f8416f63e&ref_=pd_gw_dealz_rd';
      const descTag = { property: 'og:description', content: data.description };
      const descSel = 'property="og:description"';
      this.metaService.updateTag(descTag);

      const imgTag = {
         property: 'og:image', content: 'http://100.24.25.220:4000'
            + '/assets/images/products/' + data.product.id + '/' + data.product.image

         //   property: 'og:image', content: 'https://m.media-amazon.com/images/I/31m6g30vWtL._AC_US40_.jpg'
      };
      const imgSel = 'property="og:image"';
      this.metaService.removeTag(imgSel);
      this.metaService.addTag(imgTag, false);

      const urlTag = { property: 'og:url', content: url };
      const urlSel = 'property="og:url"';
      this.metaService.removeTag(urlSel);
      this.metaService.addTag(urlTag, false);

      const titleTag = { property: 'og:title', content: data.name };
      const titleSel = 'property="og:title"';
      this.metaService.removeTag(titleSel);
      this.metaService.addTag(titleTag, false);

      const typeTag = { property: 'og:type', content: 'Article' };
      const typeSel = 'property="og:type"';
      this.metaService.removeTag(typeSel);
      this.metaService.addTag(typeTag, false);
   }
}
