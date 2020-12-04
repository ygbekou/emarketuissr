import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Product, ProductDescription, Language } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';

@Component({
   selector: 'app-product-description',
   templateUrl: './ProductDescription.component.html',
   styleUrls: ['./ProductDescription.component.scss']
})

export class ProductDescriptionComponent implements OnInit {

   messages = '';

   @Input() product: Product;

   productDescription: ProductDescription;
   selectedTab = 0;
   selectedMainTabIndex = 0;

   constructor(protected translate: TranslateService,
      public appService: AppService) {
      console.log('In product desc');
      console.log(this.product);
   }

   ngOnInit() {

      this.refreshLangObjects();

   }

   setProduct(prod: Product) {
      console.log('set is called');
      console.log(prod);
      this.product = prod;
      this.refreshLangObjects();
   }

   refreshLangObjects() {
      let first = true;
      this.appService.appInfoStorage.languages.forEach(language => {
         let found = false;
         this.product.productDescriptions.forEach(aProductDesc => {
            if (aProductDesc.language.code === language.code) {
               found = true;
               if (first) {
                  this.productDescription = aProductDesc;
                  first = false;
               }
            }
         });
      });
   }


   onLangChanged(event) {
      this.messages = '';
      console.log('tab changed')
      this.product.productDescriptions.forEach(prodDesc => {
         if (prodDesc.language.name === event.tab.textLabel) {
            this.productDescription = prodDesc;
            return;
         }
      });
   }

   save() {
      this.messages = '';
      try {
         // const prod = new Product();
         // prod.model = this.product.model;
         // prod.id = this.product.id;
         // prod.status = 1;
         console.log(this.product);
         this.productDescription.product =   this.appService.cloneProduct(this.product);
         this.appService.save(this.productDescription, 'ProductDescription')
            .subscribe(result => {
               if (result.id > 0) {
                  this.productDescription = result;
                  this.product.id = result.product.id;
                  this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                     this.messages = res['MESSAGE.SAVE_SUCCESS'];
                  });
               } else {
                  this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                     this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
                  });
               }
            });

      } catch (e) {
         console.log(e);
      }
   }
}
