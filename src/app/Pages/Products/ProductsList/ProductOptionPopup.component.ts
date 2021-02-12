import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProductOptionValue, ProductOption, CartItem } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-ProductOptionPopup',
  templateUrl: './ProductOptionPopup.component.html',
  styleUrls: ['./ProductsList.component.scss']
})
export class ProductOptionPopupComponent implements OnInit {

  productDesc: any;
  popupResponse: any;

  constructor(public appService: AppService,
    public dialogRef: MatDialogRef<ProductOptionPopupComponent>) {

    }

  ngOnInit() {
    this.productDesc.product.totalPrice = this.productDesc.product.price;
    this.productDesc.product.selectedOptionsMap = {};
  }


  checkboxChange(event, prdOption: ProductOption, prdOptionValue: ProductOptionValue ) {

    const optionKey = prdOption.id + '|' + prdOptionValue.ovId;
    if (this.productDesc.product.product.selectedOptionsMap[optionKey] === undefined) {
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


  public addToCart(value) {
    const ci = new CartItem(value);
    this.appService.addToCart(ci);
  }

  


}
