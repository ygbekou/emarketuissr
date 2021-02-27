import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProductOptionValue, ProductOption } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ProductOptionPopup',
  templateUrl: './ProductOptionPopup.component.html',
  styleUrls: ['./ProductsList.component.scss']
})
export class ProductOptionPopupComponent implements OnInit {

  @Input()
  productDesc: any;
  popupResponse: any;
  qty = 1;
  error = '';

  constructor(public appService: AppService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<ProductOptionPopupComponent>) {

    }

  ngOnInit() {
    this.productDesc.product.totalPrice = this.productDesc.product.price;
    this.productDesc.quantity = 1;
    this.productDesc.product.selectedOptionsMap = {};
  }


  checkboxChange(event, prdOption: ProductOption, prdOptionValue: ProductOptionValue ) {

    const optionKey = prdOption.id + '|' + prdOptionValue.ovId;
    if (this.productDesc.product.selectedOptionsMap[optionKey] === undefined) {
        if (event.checked) {
          this.productDesc.product.selectedOptionsMap[optionKey] = prdOptionValue;
        }
    } else {
        if (!event.checked) {
          delete this.productDesc.product.selectedOptionsMap[optionKey];
        }
    }

    this.updatePriceWithOptions();
  }

  radioButtonChange( event, prdOption: ProductOption, prdOptionValue: ProductOptionValue ) {
    const optionKey = prdOption.id;
    this.productDesc.product.selectedOptionsMap[optionKey] = prdOptionValue;

    this.updatePriceWithOptions();
  }

   singleSelectionChange(event, prdOption: ProductOption, prdOptionValue: ProductOptionValue ) {
      const optionKey = prdOption.id;
      this.productDesc.product.selectedOptionsMap[optionKey] = prdOptionValue;

      this.updatePriceWithOptions();
   }

   public updatePriceWithOptions() {
      let totalOptionPrice = 0;
      for (const [key, optionDesc] of Object.entries(this.productDesc.product.selectedOptionsMap)) {
         if (optionDesc['price'] !== undefined && optionDesc['price'] > 0 ) {
            if (optionDesc['pricePrefix'] === '+') {
               totalOptionPrice += optionDesc['price'];
            } else if (optionDesc['pricePrefix'] === '-') {
               totalOptionPrice -= optionDesc['price'];
            }
         }
      }

      this.productDesc.product.totalPrice = (this.productDesc.product.percentagePrice > 0 ? this.productDesc.product.percentagePrice
                                    : this.productDesc.product.price) + totalOptionPrice;
   }

  public shouldClose() {
    let errorFound = false;
    this.error = '';
    this.productDesc.povos.forEach(optionDesc => {
        if (optionDesc.optionType === 'Text' || optionDesc.optionType === 'Textarea') {
          optionDesc.povs.forEach(optionValueDesc => {
              if (optionValueDesc.value !== undefined && optionValueDesc.value !== null) {
                this.productDesc.product.selectedOptionsMap[optionDesc.id] = optionValueDesc;
              }
          });
        }

        if (optionDesc.required === 1 && !this.productDesc.product.selectedOptionsMap[optionDesc.id]) {
          this.translate.get('VALIDATION.OPTION_IS_REQUIRED', { option_description: optionDesc.name }).subscribe(res => {
            this.error = res;
          });
          errorFound = true;
        }
    });

    if (!errorFound) {
      this.dialogRef.close(this.productDesc);
    }
  }
}
