import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, OptionDescription, ProductOption, Options, ProductOptionValue, OptionValueDescription, OptionValue } from 'src/app/app.models';
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

   messages: string;
   currentOption: string;
   optionOptions: OptionDescription[];
   filteredOptionOptions: Observable<OptionDescription[]>;

   productOptions: ProductOption[];
   productOption: ProductOption;
   productOptionValues: ProductOptionValue[];
   optionValues: OptionValueDescription[];
   
   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }

   ngOnInit() {
      this.productOption = new ProductOption();
      this.getProductSelectedOptions();
      this.getProductUnselectedOptions();
   }

   getProductUnselectedOptions() {
      this.appService.getObjects('/service/catalog/productunselectedoptions/' + this.appService.appInfoStorage.language.id
         + '/' + this.productId)
         .subscribe((data: OptionDescription[]) => {
            this.optionOptions = data;
            this.optionOptions.forEach(element => {
               element.id = element.option.id;
            })

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

            if (data.length > 0) {
               this.getProductOption(data[0].id);
            }
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


   saveProductOption(optDesc: OptionDescription) {

      const productOption = new ProductOption();
      productOption.option.id = optDesc.id;
      productOption.product = new Product();
      productOption.product.id = this.productId;

      this.appService.saveWithUrl('/service/crud/ProductOption/save/', productOption)
         .subscribe((data: ProductOption) => {
            this.processResult(data, this.productOption, null);
            productOption.optionName = optDesc.name;
            productOption.id = data.id;
            this.addOption(productOption);

            // Removing the just saved option from dropdown
            const index = this.optionOptions.findIndex(x => x.id === optDesc.id);
            this.optionOptions.splice(index, 1);
            this.currentOption = '';

            this.getProductOption(data.id);
         },
            error => console.log(error),
            () => console.log('Save selected product option complete'));

   }

   saveProductOption2() {

      this.productOption.required = (this.productOption.required == null
      || this.productOption.required.toString() === 'false'
      || this.productOption.required.toString() === '0') ? 0 : 1;

      if (this.isDateOption()) {
         this.productOption.value = this.productOption.valueDate.toLocaleDateString();
      }
     
      if (this.isTimeOption()) {
         this.productOption.value = this.productOption.timeHour + ':' + this.productOption.timeMinute;
      }

      this.appService.saveWithUrl('/service/crud/ProductOption/save/', this.productOption)
         .subscribe((data: ProductOption) => {
            this.processResult(data, this.productOption, null);
         },
            error => console.log(error),
            () => console.log('Save selected product option complete'));

   }

   public get dateTimeLocal(): string {
    return this.productOption.value;
  }

  public set dateTimeLocal(v: string) {
    this.productOption.value = v;
  }


    public addOption(productOption: ProductOption): void {
      
      this.messages = '';
      if (!this.productOptions || this.productOptions === null ) {
         this.productOptions = [];
      }

      let prOpt: ProductOption;
      if (productOption === undefined) {
         prOpt = new ProductOption();
         prOpt.product.id = this.productId;
      }
      this.productOptions.push(productOption !== undefined ? productOption : prOpt);
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

   getProductOption(productOptionId: number) {
      this.messages = '';
      if (productOptionId > 0) {
         this.appService.getOneWithChildsAndFiles(productOptionId, 'ProductOption')
            .subscribe(result => {
          if (result.id > 0) {
            this.productOption = result;
            this.getOptionValues();
            this.productOptionValues = this.productOption.productOptionValues;
            this.productOption.productOptionValues = [];
            if (this.isDateOption()) {
               this.productOption.valueDate = new Date(this.productOption.value);
            }

            if (this.isTimeOption()) {
               this.productOption.timeHour = +this.productOption.value.split(':')[0];
               this.productOption.timeMinute = +this.productOption.value.split(':')[1];
            }

          } else {
            this.productOption = new ProductOption();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

   saveProductOptionValue(pov: ProductOptionValue) {

      pov.subtract = (pov.subtract == null
      || pov.subtract.toString() === 'false'
      || pov.subtract.toString() === '0') ? 0 : 1;

      pov.productOption = this.productOption;

      this.appService.saveWithUrl('/service/crud/ProductOptionValue/save/', pov)
         .subscribe((data: ProductOption) => {
            this.processResult(data, this.productOption, null);
            //this.productOptions[i].id = data.id;
            pov.id = data.id;
         },
            error => console.log(error),
            () => console.log('Save selected product option complete'));

   }


  public deleteProductOptionValue(productOptionValue: ProductOptionValue, index: number) {

      if (productOptionValue.id === undefined || productOptionValue.id === null) {
         this.productOptionValues.splice(index, 1);
         return;
      }

      this.appService.delete(productOptionValue.id, 'ProductOptionValue')
         .subscribe(data => {
            this.removeItem(this.productOptionValues, productOptionValue.id);
            this.processDeleteResult(data, this.messages);
            
         });
   }

   public addProductOptionValue(productOptionValue: ProductOptionValue): void {
      this.messages = '';
      if (!this.productOptionValues || this.productOptionValues === null ) {
         this.productOptionValues = [];
      }

      let prOptVal: ProductOptionValue;
      if (productOptionValue === undefined) {
         prOptVal = new ProductOptionValue();
         prOptVal.product.id = this.productId;
         prOptVal.option.id = this.productOption.option.id;
         prOptVal.productOption.id = this.productOption.id;
      }
      this.productOptionValues.unshift(productOptionValue !== undefined ? productOptionValue : prOptVal);
   }

  isTextOption() {
     return this.productOption.option.optionType === 'Text';
  }

  isTextAreaOption() {
     return this.productOption.option.optionType === 'Textarea';
  }

  isDateOption() {
     return this.productOption.option.optionType === 'Date';
  }

  isTimeOption() {
     return this.productOption.option.optionType === 'Time';
  }

  isDateTimeOption() {
     return this.productOption.option.optionType === 'Date & Time';
  }

  isSelectOption() {
     return this.productOption.option.optionType === 'Select';
  }

  isRadioOption() {
     return this.productOption.option.optionType === 'Radio';
  }

  isCheckboxOption() {
     return this.productOption.option.optionType === 'Checkbox';
  }

  isSelectableOption() {
     return this.isSelectOption() || this.isRadioOption() || this.isCheckboxOption();
  }
  
  getOptionValues() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |languageId|' + this.appService.appInfoStorage.language.id + '|Integer');
    parameters.push('e.option.id = |optionId|' + this.productOption.option.id + '|Integer');

    this.appService.getAllByCriteria('OptionValueDescription', parameters)
      .subscribe((data: OptionValueDescription[]) => {

        this.optionValues = data;
        this.optionValues.forEach(element => {
            element.id = element.optionValue.id;
         })

      },
        error => console.log(error),
        () => console.log('Get OptionValueDescription Items for Option complete'));
  }


  getStyle(productOption: ProductOption) {
    if (productOption.id === this.productOption.id) {
       return {'background-color': '#8AACB8'};
    } else {
      return {'background-color': '#ADD8E6'};
    }
  }
}
