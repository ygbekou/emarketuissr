import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, CategoryDescription, ProductToCategory, Category } from 'src/app/app.models';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
	selector: 'app-product-link',
	templateUrl: './ProductLink.component.html',
	styleUrls: ['./ProductLink.component.scss']
})

export class ProductLinkComponent extends BaseComponent implements OnInit {

   @Input() product: Product;
   @Input() productId: number;
   @Input() f: Form;

   categories: CategoryDescription[][] = [];
   categoryId: number;
   finalSelectedCatDescs: CategoryDescription[] = [];
   finalDeletedCatDescs: number[] = [];
   selectedCatDescs: CategoryDescription[] = [];
   depth = 0;
   messages: string;



   constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

   ngOnInit() {

      this.product = new Product();

      for (let counter = 0; counter < 10; counter++) {
         console.log('for loop executed : ' + counter);
         this.categories[counter] = [];
      }

      setTimeout(() => {
          this.categories.splice(1);
      }, 1000);

      this.getParentCategoryDescriptions();
      this.getProductCategoryDescriptions();
   }

   getProductCategoryDescriptions() {
      this.depth = 0;
      this.categories = [];
       this.appService.getObjects('/service/catalog/productcategorydescriptions/'
         + this.productId + '/' + this.appService.appInfoStorage.language.id)
      .subscribe((data: CategoryDescription[]) => {
         this.finalSelectedCatDescs = data;
         this.finalSelectedCatDescs.forEach(element => {
            element.id = element.category.id;
         });
      },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
   }

   getParentCategoryDescriptions() {
      this.depth = 0;
      this.categories = [];
       this.appService.getObjects('/service/catalog/categorydescriptions/'
         + this.appService.appInfoStorage.language.id + '/' + this.productId)
      .subscribe((data: CategoryDescription[]) => {
         this.categories[this.depth] = data;
         this.depth++;
         this.categories[this.depth] = [];

         setTimeout(() => {
            this.categories.splice(this.depth);
         }, 5);
      },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
   }


   removeCategory(categoryDescId: number, index: number) {
      //this.finalDeletedCatDescs.push(categoryDescId);
      //this.finalSelectedCatDescs.splice(index, 1);
      this.finalSelectedCatDescs[index].action = 'delete';

   }

   categorySelected(selectedCatDesc: CategoryDescription, indexOfElement: number) {

      const indexIncrement = indexOfElement + 1;
      this.categories.splice(indexIncrement);
      this.selectedCatDescs.splice(indexIncrement);
      this.depth = indexIncrement;

      if (this.selectedCatDescs[indexOfElement].category.childCount > 0) {
         this.appService.getObjects('/service/catalog/categorydescriptions/' + this.appService.appInfoStorage.language.id
            + '/' + this.selectedCatDescs[indexOfElement].category.id + '/' + this.productId)
         .subscribe((data: CategoryDescription[]) => {
            this.categories[this.depth] = data;
            this.depth++;
            this.categories[this.depth] = [];

            setTimeout(() => {
               this.categories.splice(this.depth);
            }, 5);
         },
         error => console.log(error),
         () => console.log('Get all CategoryDescription complete'));
      } else {
         const index = this.finalSelectedCatDescs.length;
         this.finalSelectedCatDescs[index] = new CategoryDescription();
         this.finalSelectedCatDescs[index].id = this.selectedCatDescs[indexOfElement].category.id;
         this.finalSelectedCatDescs[index].name = this.selectedCatDescs[indexOfElement].name;

         const name = this.finalSelectedCatDescs[index].name;
         this.finalSelectedCatDescs[index].name = '';
         for (const catIndex in this.selectedCatDescs) {
            this.finalSelectedCatDescs[index].longName += (+catIndex > 0 ? ' > ' : '') + this.selectedCatDescs[catIndex].name;
         }
      }
   }


   save() {
      this.messages = '';

      try {
         const productToCategorys = [];
         this.finalSelectedCatDescs.forEach(element => {
            const productToCategory = new ProductToCategory();
            productToCategory.category = new Category();
            productToCategory.category.id = element.id;
            productToCategory.action = element.action;

            productToCategorys.push(productToCategory);
         });


         const product = new Product();
         product.id = this.productId;
         product.productToCategorys = productToCategorys;

         this.appService.save(product, 'Product')
            .subscribe(result => {
            if (result.id > 0) {
               this.product.id = result.id;
               this.processResult(result, this.product, null);
               this.getParentCategoryDescriptions();
               this.getProductCategoryDescriptions();
            }
        });

    } catch (e) {
      console.log(e);
    }
   }
}
