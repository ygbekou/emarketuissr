import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Product, ProductDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDescriptionComponent } from '../ProductDescription/ProductDescription.component';
import { BaseComponent } from '../../baseComponent';

@Component({
   selector: 'app-product',
   templateUrl: './Product.component.html',
   styleUrls: ['./Product.component.scss']
})

export class ProductComponent extends BaseComponent implements OnInit {

   messages = '';

   @ViewChild(ProductDescriptionComponent, {static: false}) productDescriptionView: ProductDescriptionComponent;

   product: Product;


   constructor(
     private activatedRoute: ActivatedRoute,
      public translate: TranslateService,
      public appService: AppService) { 
        super(translate);
      }

   ngOnInit() {

      this.activatedRoute.params.subscribe(params => {
        if (params.id === undefined || params.id === 0) {
          this.clear();
        } else {
          this.clear();
          this.getProductDescriptions(params.id);
        }
      });

   }

   clear() {
     this.product = new Product();

      for (const lang of this.appService.appInfoStorage.languages) {

          const pd = new ProductDescription();
          pd.language = lang;
          this.product.productDescriptions.push(pd);

        }
   }

   getProductDescriptions(productId: number) {
      const parameters: string[] = [];
      if (productId != null) {
         parameters.push('e.product.id = |productId|' + productId + '|Integer');
      }
      this.appService.getAllByCriteria('com.softenza.emarket.model.ProductDescription', parameters)
         .subscribe((data: ProductDescription[]) => {
           
          if (data !== null && data.length > 0) {
            this.product = data[0].product;
            this.product.productDescriptions = data;
            this.productDescriptionView.product = this.product;
            this.productDescriptionView.refreshLangObjects();
            
          }
      },
        error => console.log(error),
        () => console.log('Get all Category Item complete'));
   }

   setProductToggles() {
      this.product.status = (this.product.status == null || this.product.status.toString() === 'false') ? 0 : 1;
      this.product.shipping = (this.product.shipping == null || this.product.shipping.toString() === 'false') ? 0 : 1;
      this.product.subtract = (this.product.subtract == null || this.product.subtract.toString() === 'false') ? 0 : 1;
   }

  save() {
    this.messages = '';
    try {
      this.setProductToggles();
      const prod = {...this.product};
      prod.productDescriptions = [];

      this.appService.save(prod, 'Product')
        .subscribe(result => {
          if (result.id > 0) {
            this.product.id = result.id;
            this.processResult(result, this.product, null);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }
}
