import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, CategoryDescription, ProductToCategory, Category, ProductDescription, ProductRelated } from 'src/app/app.models';
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
         console.log('for loop executed : ' + counter);
         this.categories[counter] = [];
      }

      setTimeout(() => {
         this.categories.splice(1);
      }, 1000);

      this.getParentCategoryDescriptions();
      this.getProductCategoryDescriptions();
      this.getRelatedProducts();
      this.getProductRelatedDescriptions();
   }

   filterStates(val: string) {
      if (val) {
         const filterValue = val.toLowerCase();
         return this.options.filter(state => state.toLowerCase().startsWith(filterValue));
      }
      return this.options;
   }

   filterRelatedProducts(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name;
         return this.relatedProductOptions.filter(prodDesc => prodDesc.name.toLowerCase().startsWith(filterValue));
      }
      return this.relatedProductOptions;
   }

   getProductRelatedDescriptions() {
      this.appService.getObjects('/service/catalog/productrelateddescriptions/'
         + this.productId + '/' + this.appService.appInfoStorage.language.id)
         .subscribe((data: ProductDescription[]) => {
            this.finalSelectedRelatedProdDescs = data;
            this.finalSelectedRelatedProdDescs.forEach(element => {
               element.id = element.product.id;
            });
         },
            error => console.log(error),
            () => console.log('Get all ProductDescription complete'));
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

   getRelatedProducts() {
      this.depth = 0;
      this.categories = [];
      this.appService.getObjects('/service/catalog/relatedproducts/' + this.appService.appInfoStorage.language.id
         + '/' + this.productId)
         .subscribe((data: ProductDescription[]) => {
            this.relatedProductOptions = data;
         },
            error => console.log(error),
            () => console.log('Get all ProductDescription complete'));
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

   removeRelatedProduct(selectedProductDesc: ProductDescription, index: number) {

      const pr = new ProductRelated();
      pr.related = new Product();
      pr.related.id = this.finalSelectedRelatedProdDescs[index].product.id;
      pr.product = new Product();
      pr.product.id = this.productId;
      alert('here');

      this.appService.saveWithUrl('/service/crud/ProductRelated/delete/', pr)
         .subscribe((data: ProductToCategory[]) => {
            this.processDeleteResult(data, this.messages);
            this.finalSelectedRelatedProdDescs.splice(index, 1);
         },
            error => console.log(error),
            () => console.log('Delete of selected related product complete'));
   }

   addCategory(indexOfElement: number, index: number) {

      const ptc = new ProductToCategory();
      ptc.category = this.finalSelectedCatDescs[index].category;
      ptc.product = new Product();
      ptc.product.id = this.productId;

      this.appService.saveWithUrl('/service/crud/ProductToCategory/save/', ptc)
         .subscribe((data: ProductToCategory[]) => {
            this.processResult(data, ptc, null);
            const name = this.finalSelectedCatDescs[index].name;
            this.finalSelectedCatDescs[index].name = '';
            for (const catIndex in this.selectedCatDescs) {
               this.finalSelectedCatDescs[index].longName += (+catIndex > 0 ? ' > ' : '') + this.selectedCatDescs[catIndex].name;
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


   relatedSelected(selectedProdDesc: ProductDescription) {

      const pr = new ProductRelated();
      pr.related = selectedProdDesc.product;
      pr.product = new Product();
      pr.product.id = this.productId;

      this.appService.saveWithUrl('/service/crud/ProductRelated/save/', pr)
         .subscribe((data: ProductRelated[]) => {
            this.processResult(data, pr, null);
            this.finalSelectedRelatedProdDescs.push(selectedProdDesc);
         },
            error => console.log(error),
            () => console.log('Delete of selected related product complete'));

   }

   setProduct(prod: Product) {
      this.product = prod;
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


         const product = this.product.clone();
         product.id = this.productId;
         product.productToCategorys = productToCategorys;
         this.appService.save(product, 'Product')
            .subscribe(result => {
               if (result.id > 0) {
                  this.product.id = result.id;
                  this.processResult(result, this.product, null);
                  this.getParentCategoryDescriptions();
                  this.getProductCategoryDescriptions();
                  // this.productChangeEvent.emit(this.product);
               }
            });

      } catch (e) {
         console.log(e);
      }
   }
}
