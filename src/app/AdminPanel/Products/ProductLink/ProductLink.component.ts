import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, CategoryDescription, ProductToCategory, ProductDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-product-link',
   templateUrl: './ProductLink.component.html',
   styleUrls: ['./ProductLink.component.scss']
})

export class ProductLinkComponent extends BaseComponent implements OnInit {

   @Input() product: Product;
   @Input() productId: number;
   @Input() f: Form;
   @Output() productChangeEvent = new EventEmitter<Product>();

   categories: CategoryDescription[][] = [];
   categoryId: number;
   finalSelectedCatDescs: CategoryDescription[] = [];
   finalDeletedCatDescs: number[] = [];
   selectedCatDescs: CategoryDescription[] = [];
   depth = 0;
   messages: string;

   pCategories: CategoryDescription[][] = [];
   pCategoryId: number;
   pFinalSelectedCatDescs: CategoryDescription[] = [];
   pFinalDeletedCatDescs: number[] = [];
   pSelectedCatDescs: CategoryDescription[] = [];
   pDepth = 0;



   options = ['One', 'Two'];
   filteredOptions: Observable<string[]>;
   currentOption: string;

   relatedProductOptions: ProductDescription[];
   filteredRelatedProductOptions: Observable<ProductDescription[]>;
   selectedRelatedProduct: ProductDescription;
   finalSelectedRelatedProdDescs: ProductDescription[] = [];

   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }

   ngOnInit() {

      this.product = new Product();

      for (let counter = 0; counter < 10; counter++) {
         // console.log('for loop executed : ' + counter);
         this.categories[counter] = [];
      }

      setTimeout(() => {
         this.categories.splice(1);
      }, 1000);

      this.getParentCategoryDescriptions();
      this.getProductCategoryDescriptions();
   }

   filterStates(val: string) {
      if (val) {
         const filterValue = val.toLowerCase();
         return this.options.filter(state => state.toLowerCase().startsWith(filterValue));
      }
      return this.options;
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
      this.finalDeletedCatDescs.push(categoryDescId);
      this.finalSelectedCatDescs[index].action = 'delete';

      const ptc = new ProductToCategory();
      ptc.category = this.finalSelectedCatDescs[index].category;
      ptc.product = new Product();
      ptc.product.id = this.productId;

      this.appService.saveWithUrl('/service/crud/ProductToCategory/delete/', ptc)
         .subscribe((data: ProductToCategory[]) => {
            this.processDeleteResult(data, this.messages);
            this.finalSelectedCatDescs.splice(index, 1);
         },
            error => console.log(error),
            () => console.log('Delete of selected category complete'));
   }

   addCategory(indexOfElement: number, index: number) {

      const ptc = new ProductToCategory();
      ptc.category = this.finalSelectedCatDescs[index].category;
      ptc.product = new Product();
      ptc.product.id = this.productId;
      ptc.action = 'Ignore_parent';

      this.appService.saveWithUrl('/service/crud/ProductToCategory/save/', ptc)
         .subscribe((data: ProductToCategory[]) => {
            this.processResult(data, ptc, null);
            const name = this.finalSelectedCatDescs[index].name;
            this.finalSelectedCatDescs[index].name = '';
            for (const catIndex in this.selectedCatDescs) {
               this.finalSelectedCatDescs[index].longName += (+catIndex > 0 ? ' > ' : '') 
                  + this.selectedCatDescs[catIndex].name;
            }
         },
            error => console.log(error),
            () => console.log('Delete of selected category complete'));
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
         this.finalSelectedCatDescs[index].category = this.selectedCatDescs[indexOfElement].category;
         this.finalSelectedCatDescs[index].id = this.selectedCatDescs[indexOfElement].category.id;
         this.finalSelectedCatDescs[index].name = this.selectedCatDescs[indexOfElement].name;

         this.addCategory(indexOfElement, index);
      }
   }


   setProduct(prod: Product) {
      this.product = prod;
   }

}
