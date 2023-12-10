import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { MarketingDescription, Language, ProductDescVO, ProductSearchCriteria, StoreCatVO } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'app-home-two',
   templateUrl: './HomeTwo.component.html',
   styleUrls: ['./HomeTwo.component.scss']
})
export class HomeTwoComponent implements OnInit {

   topProducts: ProductDescVO[] = [];
   lighteningDealsProducts: any;
   marketings: MarketingDescription[] = [];
   storeCats: StoreCatVO[] = [];

   constructor(public appService: AppService, public translate: TranslateService) { }

   ngOnInit() {
      this.lighteningDeals();
      
      if (this.appService.appInfoStorage.language) {
         this.getSliders2(this.appService.appInfoStorage.language.id);
      } else {
         this.getLangAndSliders();
      }
   }

   
   getLangAndSliders() {
      const parameters: string[] = [];
      this.appService.getAllByCriteria('com.softenza.emarket.model.Language', parameters, ' order by e.sortOrder ')
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
                  this.getSliders2(language.id);
               }
            });

         }, error => console.log(error),
            () => console.log('Get Languages complete'));
   }

   getSliders2(langId: number) {
      const parameters: string[] = [];
      parameters.push('e.language.id = |langCode|' + langId + '|Integer');
      parameters.push('e.marketing.status = |stta|1|Integer');
      parameters.push('e.marketing.section = |sInS|2|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.MarketingDescription', parameters,
         ' order by e.marketing.sortOrder ')
         .subscribe((data: MarketingDescription[]) => {
            this.marketings = data;
         },
            error => console.log(error),
            () => console.log('Get all MarketingDescription complete'));
   }


   public getStoreCats(langId) {
      this.appService.getObjects('/service/catalog/getStoreCats/' + langId + '/2')
         .subscribe((data: StoreCatVO[]) => {
            this.storeCats = data;
         }, (error) => console.log(error),
            () => console.log('Get all getStoreCats complete'));
   }
   public lighteningDeals() {
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
                  this.getSliders(language.id);
                  this.getProductsOnSale(language.id);
                  this.getStoreCats(language.id)
               }
            });

         }, error => console.log(error),
            () => console.log('Get Languages complete'));
   }

   getSliders(langId: number) {
      const parameters: string[] = [];
      parameters.push('e.language.id = |langCode|' + langId + '|Integer');
      parameters.push('e.marketing.section = |sInS|3|Integer');
      parameters.push('e.marketing.status = |stta|1|Integer');
      parameters.push('e.marketing.sortOrder <= |sOrd|8|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.MarketingDescription', parameters,
         ' order by e.marketing.sortOrder')
         .subscribe((data: MarketingDescription[]) => {
            this.marketings = data;
            console.log(this.marketings);
         },
            error => console.log(error),
            () => console.log('Get all MarketingDescription complete'));
   }

   getProductsOnSale(langId: number) {
      this.topProducts = [];
      const parameters: string[] = [];
      parameters.push('e.language.id = |langCode|' + langId + '|Integer');
      parameters.push('e.marketing.section = |sInS|4|Integer');
      parameters.push('e.marketing.status = |stta|1|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.MarketingDescription', parameters,
         ' order by e.marketing.sortOrder')
         .subscribe((data: MarketingDescription[]) => {
            // console.log(data);
            if (data && data.length > 0) {
               this.appService.saveWithUrl('/service/catalog/getProductsOnSale/',
                  new ProductSearchCriteria(
                     this.appService.appInfoStorage.language.id, 0, data[0].marketing.id, 0, '0',
                     0, 0, 0, 0, 0, 0))
                  .subscribe((data2: ProductDescVO[]) => {
                     this.topProducts = data2;
                     // console.log(this.topProducts);
                  },
                     error => console.log(error),
                     () => console.log('Get all getProductsOnSale complete'));

            }
         },
            error => console.log(error),
            () => console.log('Get  MarketingDescription complete'));

   }



   public getLighteningDealsResponse(res) {
      let productsArray: any = [];
      this.lighteningDealsProducts = null;
      productsArray.push(this.last(res.men));
      productsArray.push(this.last(res.women));
      productsArray.push(this.last(res.gadgets));
      productsArray.push(this.last(res.accessories));

      this.lighteningDealsProducts = productsArray;
   }

   last(array) {
      return array[array.length - 1];
   }

   public getProducts() {
      this.appService.getProducts().valueChanges()
         .subscribe(res => this.getProductsResponse(res));
   }

   public getProductsResponse(res) {
      this.topProducts = null;
      let products = ((res.men.concat(res.women)).concat(res.gadgets)).concat(res.accessories);
      this.topProducts = products;
   }

   public addToCart(value) {
      this.appService.addToCart(value);
   }

}
