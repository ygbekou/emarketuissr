import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'embryo-TopProducts',
   templateUrl: './TopProducts.component.html',
   styleUrls: ['./TopProducts.component.scss']
})
export class TopProductsComponent implements OnInit {

   @Input() products: any;

   @Input() currency: any;

   @Output() addToCart: EventEmitter<any> = new EventEmitter();

   gridLength = 4;
   randomSortProducts: any;

   constructor(public appService: AppService, public translate: TranslateService) { }

   ngOnInit() {
      console.log(this.products);
      if (this.products) {
         this.randomSortProducts = this.products.sort(() => Math.random() - 0.5);
      }
   }

   public addToCartProduct(value: any) {
      value.status = 1;
      this.addToCart.emit(value);
   }

   public extendGridStructure(status) {
      if (status) {
         if (this.gridLength != 12) {
            this.gridLength += 4;
         }
      } else {
         if (this.gridLength != 4) {
            this.gridLength -= 4;
         }
      }
   }

}
