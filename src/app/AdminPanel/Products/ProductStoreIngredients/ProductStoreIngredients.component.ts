import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
   ProductToStore, ProductStoreOption, IngredientDescription, ProductStoreIngredient,
   IngredientSearchCriteria, OptionValueDescription, ProductStoreOptionValue
} from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
   selector: 'app-productstore-ingredients',
   templateUrl: './ProductStoreIngredients.component.html',
   styleUrls: ['./ProductStoreIngredients.component.scss']
})

export class ProductStoreIngredientsComponent extends BaseComponent implements OnInit {

   productStoreIngredientsColumns: string[] = ['optionName', 'optionValueName', 'ingredientName', 'quantityPerUnit', 'actions'];
   productStoreIngredientsDatasource: MatTableDataSource<ProductStoreIngredient>;
   @ViewChild('MatPaginatorProductStoreIngredients', { static: true }) productStoreIngredientsPaginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) productStoreIngredientsSort: MatSort;

   @Input() productToStore: ProductToStore;
   @Input() productToStoreId: number;
   @Input() storeId: number;

   messages: string;
   currentOption: string;
   ingredientOptions: IngredientDescription[];
   filteredIngredientOptions: IngredientDescription[];

   productStoreIngredients: ProductStoreIngredient[];
   productStoreIngredient: ProductStoreIngredient;

   searchCriteria: IngredientSearchCriteria = new IngredientSearchCriteria();

   productStoreOptions: ProductStoreOption[];
   productStoreOptionValues: ProductStoreOptionValue[];

   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }

   ngOnInit() {
      this.productStoreIngredient = new ProductStoreIngredient();
   }

   public reset() {
      this.currentOption = '';
      this.messages = '';
      this.productStoreIngredient = new ProductStoreIngredient();
      this.productStoreIngredients = [];
      this.ingredientOptions = [];
      this.filteredIngredientOptions = [];
   }

   getProductStoreAssignedIngredients() {
      this.searchCriteria.languageId = this.appService.appInfoStorage.language.id;
      this.searchCriteria.storeId = this.storeId;

      this.appService.saveWithUrl('/service/catalog/getStoreAssignedIngredients',
         this.searchCriteria).subscribe((data: any[]) => {
            this.ingredientOptions = data;
            this.filteredIngredientOptions = data;
         },
            error => console.log(error),
            () => console.log('Get product store assigned ingredients complete'));

   }


   getProductStoreUnassignedIngredients() {
      this.searchCriteria.productStoreId = this.productToStoreId;
      this.searchCriteria.languageId = this.appService.appInfoStorage.language.id;
      this.searchCriteria.storeId = this.storeId;

      this.appService.saveWithUrl('/service/catalog/getProductStoreUnassignedIngredients',
         this.searchCriteria).subscribe((data: any[]) => {
            this.ingredientOptions = data;
            this.filteredIngredientOptions = data;
         },
            error => console.log(error),
            () => console.log('Get product store unassigned ingredients complete'));

   }

   getProductStoreSelectedIngredients() {
      this.messages = '';
      this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
      this.searchCriteria.languageId = +this.appService.appInfoStorage.language.id;
      this.searchCriteria.productStoreId = this.productToStoreId;

      this.appService.saveWithUrl('/service/catalog/getProductStoreIngredients', this.searchCriteria)
         .subscribe((data: any[]) => {
            this.reinitializeDatasource(data);
            this.productStoreIngredients = Array.from({ ...data });
         },
            error => console.log(error),
            () => console.log('Get product store ingredients complete'));
   }


   validateSelectedIngredient(productStoreIngredient: ProductStoreIngredient) {

      if (typeof (productStoreIngredient.ingredientName) === 'string' && this.ingredientOptions) {
         let index = this.ingredientOptions.findIndex(x => x.name === productStoreIngredient.ingredientName);
         if (index === -1) {
            index = this.productStoreIngredients.findIndex(x => x.id === productStoreIngredient.id);
            if (index === -1) {
               return false;
            } else {
               return true;
            }
         } else {
            productStoreIngredient.ingredient = this.ingredientOptions[index].ingredient;
         }
      }

      if (!productStoreIngredient.ingredient || !productStoreIngredient.ingredient.id) {
         return false;
      }

      return true;
   }

   filterOptions(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
         this.filteredIngredientOptions = this.ingredientOptions.filter(attrDesc => attrDesc.name.toLowerCase().startsWith(filterValue));
      } else {
         this.filteredIngredientOptions = this.ingredientOptions;
      }
   }

   addNew() {
      console.log(this.productStoreIngredientsDatasource.data)
      if (!this.productStoreIngredientsDatasource.data) {
         this.productStoreIngredientsDatasource.data = [];
      }
      this.productStoreIngredientsDatasource.data.unshift(new ProductStoreIngredient());
      this.reinitializeDatasource(this.productStoreIngredientsDatasource.data);
   }

   resetDatasource(prdStoreIngredients: ProductStoreIngredient[]) {
      this.getProductStoreSelectedIngredients();
      this.getProductStoreAssignedIngredients();
   }

   reinitializeDatasource(prdStoreIngredients: ProductStoreIngredient[]) {
      this.productStoreIngredientsDatasource = new MatTableDataSource(prdStoreIngredients);
      this.productStoreIngredientsDatasource.paginator = this.productStoreIngredientsPaginator;
      this.productStoreIngredientsDatasource.sort = this.productStoreIngredientsSort;
   }

   saveProductStoreIngredient(productStoreIngredient: ProductStoreIngredient) {

      if (!this.validateSelectedIngredient(productStoreIngredient)) {
         return;
      }

      if (productStoreIngredient.productStoreOptionValue && !productStoreIngredient.productStoreOptionValue.id) {
         productStoreIngredient.productStoreOptionValue = undefined;
      }
      productStoreIngredient.productStoreId = this.productToStoreId;

      this.appService.saveWithUrl('/service/crud/ProductStoreIngredient/save/', productStoreIngredient)
         .subscribe((data: ProductStoreOption) => {
            this.processResult(data, this.productStoreIngredient, null);
            productStoreIngredient.id = data.id;
            // Removing the just saved option from dropdown
            // const index = this.ingredientOptions.findIndex(x => x.ingredient.id === productStoreIngredient.ingredient.id);
            // this.ingredientOptions.splice(index, 1);
            // this.filteredIngredientOptions = this.ingredientOptions;
            productStoreIngredient.isTouched = false;
            // this.currentOption = '';
         },
            error => console.log(error),
            () => console.log('Save selected product store ingredient complete'));

   }

   public deleteProductStoreIngredient(productStoreIngredient: ProductStoreIngredient, index: number) {

      if (productStoreIngredient.id === undefined || productStoreIngredient.id === null) {
         this.productStoreIngredientsDatasource.data.splice(index, 1);
         this.resetDatasource(this.productStoreIngredientsDatasource.data);
         return;
      }

      this.messages = '';

      this.appService.delete(productStoreIngredient.id, 'ProductStoreIngredient')
         .subscribe(data => {
            this.processDataSourceDeleteResult(data, this.messages, productStoreIngredient, this.productStoreIngredientsDatasource);
            this.productStoreIngredientsDatasource.data = Array.from(this.productStoreIngredientsDatasource.data);
            this.reinitializeDatasource(this.productStoreIngredientsDatasource.data);
         });
   }

   getProductStoreIngredient(productStoreIngredientId: number) {
      this.messages = '';
      if (productStoreIngredientId > 0) {
         this.appService.getOneWithChildsAndFiles(productStoreIngredientId, 'ProductStoreIngredient')
            .subscribe(result => {
               if (result.id > 0) {
                  this.productStoreIngredient = result;
               } else {
                  this.productStoreIngredient = new ProductStoreIngredient();
                  this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                     this.messages = res['MESSAGE.READ_FAILED'];
                  });
               }
            });
      }
   }


   getProductToStoreSelectedOptions(productToStoreId: number) {
      this.appService.getObjects('/service/catalog/producttostoreselectedoptions/'
         + productToStoreId + '/' + this.appService.appInfoStorage.language.id)
         .subscribe((data: ProductStoreOption[]) => {
            this.productStoreOptions = data;
         },
            error => console.log(error),
            () => console.log('Get productToStore selected OptionDescription complete'));
   }


   getProductStoreOptionValues(productStoreId: number, productStoreOptionId: number) {
      this.appService.getObjects('/service/catalog/productstoreoptionValues/' + productStoreId + '/0/'
       + this.appService.appInfoStorage.language.id)
         .subscribe((data: ProductStoreOptionValue[]) => {
            this.productStoreOptionValues = data;
         },
            error => console.log(error),
            () => console.log('Get productStoreoption values complete'));
   }



   optionSelected(event) {
      setTimeout(() => {
         this.getProductStoreOptionValues(this.productToStoreId, null);
      }, 500);
   }

}
