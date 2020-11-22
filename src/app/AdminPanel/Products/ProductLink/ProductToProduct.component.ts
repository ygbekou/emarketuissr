import { Component, OnInit, Input } from '@angular/core';
import { Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, CategoryDescription, ProductToCategory, ProductDescription, ProductRelated } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-product-to-product',
   templateUrl: './ProductToProduct.component.html',
   styleUrls: ['./ProductLink.component.scss']
})

export class ProductToProductComponent extends BaseComponent implements OnInit {

   @Input() product: Product;
   @Input() productId: number;
   @Input() f: Form;

   categories: CategoryDescription[][] = [];
   categoryId: number;
   finalSelectedCatDesc: CategoryDescription;
   finalDeletedCatDescs: number[] = [];
   selectedCatDescs: CategoryDescription[] = [];
   depth = 0;
   messages: string;

   options = ['One', 'Two'];
   filteredOptions: Observable<string[]>;
   currentOption: string;

   relatedProductOptions: ProductDescription[];
   filteredRelatedProductOptions: ProductDescription[] = [];
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
         this.filteredRelatedProductOptions = this.relatedProductOptions.filter(prodDesc => 
            prodDesc.name.toLowerCase().startsWith(filterValue));
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

   getRelatedProducts(categoryId: number) {

      if (categoryId !== undefined) {
         this.appService.getObjects('/service/catalog/relatedproducts/' + this.appService.appInfoStorage.language.id
            + '/' + categoryId + '/' + this.productId )
            .subscribe((data: ProductDescription[]) => {
               this.relatedProductOptions = data;
               this.currentOption = '';
            },
               error => console.log(error),
               () => console.log('Get all non related product complete'));
      }
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

   removeRelatedProduct(selectedProductDesc: ProductDescription, index: number) {

      const pr = new ProductRelated();
      pr.related = new Product();
      pr.related.id = this.finalSelectedRelatedProdDescs[index].product.id;
      pr.product = new Product();
      pr.product.id = this.productId;

      this.appService.saveWithUrl('/service/crud/ProductRelated/delete/', pr)
         .subscribe((data: ProductToCategory[]) => {
            this.processDeleteResult(data, this.messages);
            this.finalSelectedRelatedProdDescs.splice(index, 1);
         },
            error => console.log(error),
            () => console.log('Delete of selected related product complete'));
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
          this.getRelatedProducts(this.selectedCatDescs[indexOfElement].category.id);
      }
   }


   relatedSelected(selectedProdDesc: ProductDescription) {

      const pr = new ProductRelated();
      pr.related = selectedProdDesc.product;
      pr.product = new Product();
      pr.product.id = this.productId;
      pr.action = 'Ignore_parent';

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


}
