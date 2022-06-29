import { Component, OnInit, Input } from '@angular/core';
import { Store, StoreCategoryDesc, Language } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
   selector: 'app-top-stores',
   templateUrl: './TopStores.component.html',
   styleUrls: ['./TopStores.component.scss']
})
export class TopStoresComponent implements OnInit {


   @Input() isRTL: any;

   stores: Store[] = [];
   error: string;
   appInfoStorage: any;
   storeCategories: StoreCategoryDesc[] = [];

   constructor(public appService: AppService, public translate: TranslateService) { }

   ngOnInit() {
      this.getData();
   }

   getData() {
      const parameters: string[] = [];
      this.appService.getAllByCriteria('com.softenza.emarket.model.Language', parameters, ' order by e.sortOrder ')
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
      parameters.push('e.onlineStore = |efg|1|Integer');
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
               if (store.isHotel === 1) {
                  store.catUrl = '/rooms/detail?storeId=' + store.id;
               }
            });
         },
            error => console.log(error),
            () => console.log('Get Top Store complete'));

   }

}
