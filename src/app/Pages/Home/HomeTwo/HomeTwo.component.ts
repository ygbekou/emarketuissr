import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { MarketingDescription, Language, ProductVO } from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
   selector: 'app-home-two',
   templateUrl: './HomeTwo.component.html',
   styleUrls: ['./HomeTwo.component.scss']
})
export class HomeTwoComponent implements OnInit {

   topProducts: ProductVO[] = [];
   lighteningDealsProducts: any;
   marketings: MarketingDescription[] = [];

   constructor(public appService: AppService) { }

   ngOnInit() {
      this.lighteningDeals();
      // this.getProducts();
   }

   public lighteningDeals() {
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
                  this.getSliders(language.id);
                  this.getProductsOnSale(language.id);
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
               this.appService.getObjects('/service/catalog/getProductsOnSale/' +
                  langId + '/0/' + data[0].marketing.id)
                  .subscribe((data2: ProductVO[]) => {
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
