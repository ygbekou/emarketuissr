import { Component, OnInit, Input } from '@angular/core';
import { Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, AttributeDescription, ProductAttribute } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-product-attributes',
   templateUrl: './ProductAttributes.component.html',
   styleUrls: ['./ProductAttributes.component.scss']
})

export class ProductAttributesComponent extends BaseComponent implements OnInit {

   @Input() product: Product;
   @Input() productId: number;
   @Input() f: Form;

   messages: string;
   currentOption: string;
   attributeOptions: AttributeDescription[];
   filteredAttributeOptions: Observable<AttributeDescription[]>;

   productAttributes: ProductAttribute[];

   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }

   ngOnInit() {
      this.getProductSelectedAttributes();
      this.getProductUnselectedAttributes();
   }

   getProductUnselectedAttributes() {
      this.appService.getObjects('/service/catalog/productunselectedattributes/' + this.appService.appInfoStorage.language.id
         + '/' + this.productId)
         .subscribe((data: AttributeDescription[]) => {
            this.attributeOptions = data;

         },
            error => console.log(error),
            () => console.log('Get product unselected AttributeDescription complete'));
   }

   getProductSelectedAttributes() {
      this.appService.getObjects('/service/catalog/productselectedattributes/'
         + this.productId + '/' + this.appService.appInfoStorage.language.id)
         .subscribe((data: ProductAttribute[]) => {
            data.forEach(element => {
               this.addAttribute(element);
            });
         },
            error => console.log(error),
            () => console.log('Get product selected AttributeDescription complete'));
   }


   filterAttributes(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
         return this.attributeOptions.filter(attrDesc => attrDesc.name.toLowerCase().startsWith(filterValue));
      }
      return this.attributeOptions;
   }

   saveProductAttribute(productAttr: ProductAttribute, i: number) {

      this.appService.saveWithUrl('/service/crud/ProductAttribute/save/', productAttr)
         .subscribe((data: ProductAttribute) => {
            this.processResult(data, productAttr, null);
            this.productAttributes[i].id = data.id;
         },
            error => console.log(error),
            () => console.log('Save selected product attribute complete'));

   }

   public addAttribute(): void {
      if (!this.productAttributes || this.productAttributes === null) {
         this.productAttributes = [];
      }

      let prAttr: ProductAttribute;
      prAttr = new ProductAttribute();
      prAttr.product.id = this.productId;
      this.productAttributes.unshift(prAttr);
   }

   public deleteProductAttribute(productAttribute: ProductAttribute, index: number) {

      if (productAttribute.id === undefined || productAttribute.id === null) {
         this.productAttributes.splice(index, 1);
         return;
      }

      this.appService.delete(productAttribute.id, 'ProductAttribute')
         .subscribe(data => {
            this.removeItem(this.productAttributes, productAttribute.id);
            this.processDeleteResult(data, this.messages);

         });
   }

}
