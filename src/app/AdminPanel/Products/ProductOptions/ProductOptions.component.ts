import { Component, OnInit, Input } from '@angular/core';
import { Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, OptionDescription, ProductOption } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-product-options',
   templateUrl: './ProductOptions.component.html',
   styleUrls: ['./ProductOptions.component.scss']
})

export class ProductOptionsComponent extends BaseComponent implements OnInit {

   @Input() product: Product;
   @Input() productId: number;
   @Input() f: Form;

   messages: string;
   currentOption: string;
   optionOptions: OptionDescription[];
   filteredOptionOptions: Observable<OptionDescription[]>;

   productOptions: ProductOption[];
   
   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }

   ngOnInit() {
      this.getProductSelectedOptions();
      this.getProductUnselectedOptions();
   }

   getProductUnselectedOptions() {
      this.appService.getObjects('/service/catalog/productunselectedoptions/' + this.appService.appInfoStorage.language.id
         + '/' + this.productId)
         .subscribe((data: OptionDescription[]) => {
            this.optionOptions = data;

         },
         error => console.log(error),
         () => console.log('Get product unselected OptionDescription complete'));
   }

   getProductSelectedOptions() {
      this.appService.getObjects('/service/catalog/productselectedoptions/'
         + this.productId + '/' + this.appService.appInfoStorage.language.id)
         .subscribe((data: ProductOption[]) => {
            data.forEach(element => {
               this.addOption(element);
            });
         },
            error => console.log(error),
            () => console.log('Get product selected OptionDescription complete'));
   }


   filterOptions(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
         return this.optionOptions.filter(attrDesc => attrDesc.name.toLowerCase().startsWith(filterValue));
      }
      return this.optionOptions;
   }

   saveProductOption(productOpt: ProductOption, i: number) {

      this.appService.saveWithUrl('/service/crud/ProductOption/save/', productOpt)
         .subscribe((data: ProductOption) => {
            this.processResult(data, productOpt, null);
            this.productOptions[i].id = data.id;
         },
            error => console.log(error),
            () => console.log('Save selected product option complete'));

   }

    public addOption(productOption: ProductOption): void {
      if (!this.productOptions || this.productOptions === null ) {
         this.productOptions = [];
      }

      let prOpt: ProductOption;
      if (productOption === undefined) {
         prOpt = new ProductOption();
         prOpt.product.id = this.productId;
      }
      this.productOptions.unshift(productOption !== undefined ? productOption : prOpt);
   }

   public deleteProductOption(productOption: ProductOption, index: number) {

      if (productOption.id === undefined || productOption.id === null) {
         this.productOptions.splice(index, 1);
         return;
      }

      this.appService.delete(productOption.id, 'ProductOption')
         .subscribe(data => {
            this.removeItem(this.productOptions, productOption.id);
            this.processDeleteResult(data, this.messages);
            
         });
   }

}
