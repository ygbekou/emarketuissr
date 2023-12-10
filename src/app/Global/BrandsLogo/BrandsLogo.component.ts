import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { AppService } from '../../Services/app.service';
import { Store, Language, StoreCategoryDesc } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'embryo-BrandsLogo',
   templateUrl: './BrandsLogo.component.html',
   styleUrls: ['./BrandsLogo.component.scss']
})
export class BrandslogoComponent implements OnInit, OnChanges {

   @Input() isRTL: any;

   stores: Store[] = [];
   error: string;
   appInfoStorage: any;
   storeCategories: StoreCategoryDesc[] = [];
/*
   slideConfig = {
         infinite: true,
         centerMode: true,
         slidesToShow: 5,
         slidesToScroll: 2,
         autoplay: true,
         autoplaySpeed: 2000,
         rtl: this.isRTL,
         responsive: [
            {
               breakpoint: 768,
               settings: {
                  centerMode: true,
                  slidesToShow: 4,
                  slidesToScroll: 2,
                  autoplay: true,
                  autoplaySpeed: 2000
               }
            },
            {
               breakpoint: 480,
               settings: {
                  centerMode: true,
                  slidesToShow: 1,
                  autoplay: true,
                  autoplaySpeed: 2000
               }
            }
         ]
      }; */

   slideConfig = {
      'slidesToShow': 6,
      'slidesToScroll': 1,
      'arrows': true,
      'swipeToSlide': true,
      'infinite': true,
      'autoplay': true,
      'autoplaySpeed': 2000,
      'responsive': [
         {
            breakpoint: 1200,
            settings: {
               slidesToShow: 5
            }
         },
          {
            breakpoint: 1024,
            settings: {
               slidesToShow: 4
            }
         },
          {
            breakpoint: 800,
            settings: {
               slidesToShow: 3
            }
         },
         {
            breakpoint: 600,
            settings: {
               slidesToShow: 2
            }
         },
         {
            breakpoint: 480,
            settings: {
               slidesToShow: 1
            }
         }
      ]
   };

   constructor(public appService: AppService, 
      public translate: TranslateService) {
   }

   ngOnInit() {
      this.getData();
   }

   getData() {
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
                  this.getStoreCategories(language.id);
               }
            });

         }, error => console.log(error),
            () => console.log('Get Languages complete'));
   }

   public getStoreCategories(langId) {
      const parameters: string[] = [];
      parameters.push('e.language.id = |langCode|' + langId + '|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.StoreCategoryDesc', parameters,
         ' order by e.storeCat.sortOrder ')
         .subscribe((data: StoreCategoryDesc[]) => {
            this.storeCategories = data;
            this.getStores();
         },
            (error) => console.log(error),
            () => console.log('Get all StoreCategoryDesc complete'));
   }

   getAllByCriteria(arg0: string, parameters: string[], arg2: string) {
      throw new Error('Method not implemented.');
   }

   getStores() {
      const parameters: string[] = [];
      parameters.push('e.displayWeb = |abc|1|Integer');
      parameters.push('e.aprvStatus = |xyz|1|Integer');
      parameters.push('e.status = |klm|1|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.Store', parameters)
         .subscribe((data: Store[]) => {
            this.stores = data;
            console.log(this.appService.appInfoStorage.storeCategories);
            this.stores.forEach((store) => {
               for (const cat of this.storeCategories) {
                  if (store.storeCat.id === cat.storeCat.id) {
                     store.catName = cat.name;
                     store.catUrl = cat.storeCat.url;
                     break;
                  }
               }

               if (!store.catUrl) {
                  store.catUrl = '/products';
               }
            });
         },
            error => console.log(error),
            () => console.log('Get Top Store complete'));

   }

   ngOnChanges() {

   }



}
