import { Component, OnInit, Input } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { OptionDescription, OptionValueDescription, ProductToStore, ProductStoreOption, ProductStoreOptionValue } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
   selector: 'app-productstore-options',
   templateUrl: './ProductStoreOptions.component.html',
   styleUrls: ['./ProductStoreOptions.component.scss']
})

export class ProductStoreOptionsComponent extends BaseComponent implements OnInit {

   @Input() productToStore: ProductToStore;
   @Input() productToStoreId: number;

   messages: string;
   currentOption: string;
   optionOptions: OptionDescription[];
   filteredOptionOptions: OptionDescription[];

   productStoreOptions: ProductStoreOption[];
   productStoreOption: ProductStoreOption;
   productStoreOptionValues: ProductStoreOptionValue[];
   optionValues: OptionValueDescription[];

   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }

   ngOnInit() {
      this.productStoreOption = new ProductStoreOption();
      // this.getProductToStoreSelectedOptions(this.pro);
      // this.getProductToStoreUnselectedOptions();
   }

   public reset() {
      console.log('reset called');
      this.currentOption = '';
      this.messages = '';
      this.productStoreOption = new ProductStoreOption();
      this.optionValues = [];
      this.productStoreOptionValues = [];
      this.productStoreOptions = [];
      this.optionOptions = [];
      this.filteredOptionOptions = [];
   }
   getProductToStoreUnselectedOptions(productToStoreId: number) {
      this.appService.getObjects('/service/catalog/producttostoreunselectedoptions/' + this.appService.appInfoStorage.language.id
         + '/' + productToStoreId)
         .subscribe((data: OptionDescription[]) => {
            this.optionOptions = data;
            this.filteredOptionOptions = data;
            this.optionOptions.forEach(element => {
               element.id = element.option.id;
            });

            console.log(data)

         },
            error => console.log(error),
            () => console.log('Get product unselected OptionDescription complete'));
   }

   getProductToStoreSelectedOptions(productToStoreId: number) {
      this.appService.getObjects('/service/catalog/producttostoreselectedoptions/'
         + productToStoreId + '/' + this.appService.appInfoStorage.language.id)
         .subscribe((data: ProductStoreOption[]) => {
            data.forEach(element => {
               this.addOption(element);
            });

            if (data.length > 0) {
               this.getProductStoreOption(data[0].id);
            }
         },
            error => console.log(error),
            () => console.log('Get productToStore selected OptionDescription complete'));
   }


   filterOptions(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
         this.filteredOptionOptions = this.optionOptions.filter(attrDesc => attrDesc.name.toLowerCase().startsWith(filterValue));
      } else {
         this.filteredOptionOptions = this.optionOptions;
      }
      // return this.optionOptions;
   }


   saveProductStoreOption(optDesc: OptionDescription) {

      const productStoreOption = new ProductStoreOption();
      productStoreOption.option.id = optDesc.id;
      productStoreOption.productToStore = new ProductToStore();
      productStoreOption.productToStore.id = this.productToStoreId;

      this.appService.saveWithUrl('/service/crud/ProductStoreOption/save/', productStoreOption)
         .subscribe((data: ProductStoreOption) => {
            this.processResult(data, this.productStoreOption, null);
            productStoreOption.optionName = optDesc.name;
            productStoreOption.id = data.id;
            this.addOption(productStoreOption);
            // Removing the just saved option from dropdown
            const index = this.optionOptions.findIndex(x => x.id === optDesc.id);
            this.optionOptions.splice(index, 1);
            this.currentOption = '';
            this.getProductStoreOption(data.id);
         },
            error => console.log(error),
            () => console.log('Save selected product option complete'));

   }


   requiredChanged() {
      this.productStoreOption.required = (this.productStoreOption.required == null
         || this.productStoreOption.required.toString() === 'false'
         || this.productStoreOption.required.toString() === '0') ? 0 : 1;

      this.appService.saveWithUrl('/service/crud/ProductStoreOption/save/', this.productStoreOption)
         .subscribe((data: ProductStoreOption) => {
            this.processResult(data, this.productStoreOption, null);
         },
            error => console.log(error),
            () => console.log('Save selected product store option complete'));
   }

   saveProductStoreOption2() {
      this.productStoreOption.required = (this.productStoreOption.required == null
         || this.productStoreOption.required.toString() === 'false'
         || this.productStoreOption.required.toString() === '0') ? 0 : 1;

      if (this.isDateOption()) {
         this.productStoreOption.value = this.productStoreOption.valueDate.toLocaleDateString();
      }

      if (this.isTimeOption()) {
         this.productStoreOption.value = this.productStoreOption.timeHour + ':' + this.productStoreOption.timeMinute;
      }

      this.appService.saveWithUrl('/service/crud/ProductStoreOption/save/', this.productStoreOption)
         .subscribe((data: ProductStoreOption) => {
            this.processResult(data, this.productStoreOption, null);
         },
            error => console.log(error),
            () => console.log('Save selected product store option complete'));

   }

   public get dateTimeLocal(): string {
      return this.productStoreOption.value;
   }

   public set dateTimeLocal(v: string) {
      this.productStoreOption.value = v;
   }


   public addOption(productStoreOption: ProductStoreOption): void {

      this.messages = '';
      if (!this.productStoreOptions || this.productStoreOptions === null) {
         this.productStoreOptions = [];
      }

      let prStoreOpt: ProductStoreOption;
      if (productStoreOption === undefined) {
         prStoreOpt = new ProductStoreOption();
         prStoreOpt.productToStore.id = this.productToStoreId;
      }
      this.productStoreOptions.push(productStoreOption !== undefined ? productStoreOption : prStoreOpt);
   }

   public deleteProductStoreOption(productStoreOption: ProductStoreOption, index: number) {

      if (productStoreOption.id === undefined || productStoreOption.id === null) {
         this.productStoreOptions.splice(index, 1);
         return;
      }

      this.appService.delete(productStoreOption.id, 'ProductStoreOption')
         .subscribe(data => {
            this.removeItem(this.productStoreOptions, productStoreOption.id);
            this.processDeleteResult(data, this.messages);
            this.productStoreOptionValues = [];
         });
   }

   getProductStoreOption(productStoreOptionId: number) {
      this.messages = '';
      console.log(productStoreOptionId);
      if (productStoreOptionId > 0) {
         this.appService.getOneWithChildsAndFiles(productStoreOptionId, 'ProductStoreOption')
            .subscribe(result => {
               if (result.id > 0) {
                  this.productStoreOption = result;
                  this.getOptionValues();
                  this.productStoreOptionValues = this.productStoreOption.productStoreOptionValues;
                  this.productStoreOption.productStoreOptionValues = [];
                  if (this.isDateOption()) {
                     this.productStoreOption.valueDate = new Date(this.productStoreOption.value);
                  }

                  if (this.isTimeOption()) {
                     this.productStoreOption.timeHour = +this.productStoreOption.value.split(':')[0];
                     this.productStoreOption.timeMinute = +this.productStoreOption.value.split(':')[1];
                  }

               } else {
                  this.productStoreOption = new ProductStoreOption();
                  this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                     this.messages = res['MESSAGE.READ_FAILED'];
                  });
               }
            });
      }
   }

   saveProductStoreOptionValue(psov: ProductStoreOptionValue) {

      psov.subtract = (psov.subtract == null
         || psov.subtract.toString() === 'false'
         || psov.subtract.toString() === '0') ? 0 : 1;

      psov.productStoreOption = this.productStoreOption;

      this.appService.saveWithUrl('/service/crud/ProductStoreOptionValue/save/', psov)
         .subscribe((data: ProductStoreOption) => {
            this.processResult(data, this.productStoreOption, null);
            // this.productOptions[i].id = data.id;
            psov.id = data.id;
         },
            error => console.log(error),
            () => console.log('Save selected product store option value complete'));

   }


   public deleteProductStoreOptionValue(productStoreOptionValue: ProductStoreOptionValue, index: number) {

      if (productStoreOptionValue.id === undefined || productStoreOptionValue.id === null) {
         this.productStoreOptionValues.splice(index, 1);
         return;
      }

      this.appService.delete(productStoreOptionValue.id, 'ProductStoreOptionValue')
         .subscribe(data => {
            this.removeItem(this.productStoreOptionValues, productStoreOptionValue.id);
            this.processDeleteResult(data, this.messages);
         });
   }

   public addProductStoreOptionValue(productStoreOptionValue: ProductStoreOptionValue): void {
      this.messages = '';
      if (!this.productStoreOptionValues || this.productStoreOptionValues === null) {
         this.productStoreOptionValues = [];
      }

      let prStoreOptVal: ProductStoreOptionValue;
      if (productStoreOptionValue === undefined) {
         prStoreOptVal = new ProductStoreOptionValue();
         prStoreOptVal.productToStore.id = this.productToStoreId;
         prStoreOptVal.option.id = this.productStoreOption.option.id;
         prStoreOptVal.productStoreOption.id = this.productStoreOption.id;
      }
      this.productStoreOptionValues.unshift(productStoreOptionValue !== undefined ? productStoreOptionValue : prStoreOptVal);
   }

   isTextOption() {
      return this.productStoreOption.option.optionType === 'Text';
   }

   isTextAreaOption() {
      return this.productStoreOption.option.optionType === 'Textarea';
   }

   isDateOption() {
      return this.productStoreOption.option.optionType === 'Date';
   }

   isTimeOption() {
      return this.productStoreOption.option.optionType === 'Time';
   }

   isDateTimeOption() {
      return this.productStoreOption.option.optionType === 'Date & Time';
   }

   isSelectOption() {
      return this.productStoreOption.option.optionType === 'Select';
   }

   isRadioOption() {
      return this.productStoreOption.option.optionType === 'Radio';
   }

   isCheckboxOption() {
      return this.productStoreOption.option.optionType === 'Checkbox';
   }

   isSelectableOption() {
      return this.isSelectOption() || this.isRadioOption() || this.isCheckboxOption();
   }

   getOptionValues() {
      const parameters: string[] = [];
      parameters.push('e.language.id = |languageId|' + this.appService.appInfoStorage.language.id + '|Integer');
      parameters.push('e.option.id = |optionId|' + this.productStoreOption.option.id + '|Integer');

      this.appService.getAllByCriteria('OptionValueDescription', parameters)
         .subscribe((data: OptionValueDescription[]) => {

            this.optionValues = data;
            this.optionValues.forEach(element => {
               element.id = element.optionValue.id;
            });

         },
            error => console.log(error),
            () => console.log('Get OptionValueDescription Items for Option complete'));
   }


   getStyle(productStoreOption: ProductStoreOption) {
      if (productStoreOption.id === this.productStoreOption.id) {
         return { 'background-color': '#8AACB8' };
      } else {
         return { 'background-color': '#ADD8E6' };
      }
   }
}
