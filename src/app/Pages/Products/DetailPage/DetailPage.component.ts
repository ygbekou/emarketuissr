import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MediaObserver } from '@angular/flex-layout';
import { ProductDescVO, Pagination, Language, Product } from 'src/app/app.models';
import { MatTableDataSource } from '@angular/material';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
   selector: 'app-DetailPage',
   templateUrl: './DetailPage.component.html',
   styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {

   prdId = 0;
   ptsId = 0;
   products: ProductDescVO[] = [];
   product: ProductDescVO;

   constructor(public appService: AppService,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private activatedRoute: ActivatedRoute) {

   }

   ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
         // path: 'dtl/:prdId/:ptsId', 
         this.prdId = params.prdId;
         this.ptsId = params.ptsId;
         console.log(params.prdId);
         console.log(params.ptsId);
         this.getData();
      });

   }

   getProduct(langId: number) {
      this.appService.getObject('/service/catalog/getProductOnSale/' +
         langId + '/' + this.ptsId)
         .subscribe((data: ProductDescVO) => {
            this.product = data;
            console.log(data);
         },
            error => console.log(error),
            () => console.log('Get all getProductOnSale complete'));
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
      this.appService.addToCart(value);
   }

   public addToWishList(value) {
      this.appService.addToWishlist(value);
   }

}
