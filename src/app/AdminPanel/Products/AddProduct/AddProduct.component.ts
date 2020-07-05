import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppInfoStorage } from 'src/app/app.info.storage';
import { Product, ProductDescription, Language } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDescriptionComponent } from '../ProductDescription/ProductDescription.component';

@Component({
   selector: 'app-add-product',
   templateUrl: './AddProduct.component.html',
   styleUrls: ['./AddProduct.component.scss']
})

export class AddProductComponent implements OnInit {

   form: FormGroup;
   mainImgPath: string;
   colorsArray: string[] = ['Red', 'Blue', 'Yellow', 'Green'];
   sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   public imagePath;
   messages = '';

   @ViewChild(ProductDescriptionComponent, {static: false}) productDescriptionView: ProductDescriptionComponent;

   product: Product;


   constructor(private activatedRoute: ActivatedRoute,
      protected translate: TranslateService,
      public appService: AppService) { }

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


   save() {
    this.messages = '';
    try {
      this.messages = '';

      const prod = this.product.cloneWithoutChilds(this.product);

      this.product.status = (this.product.status == null || this.product.status.toString() === 'false') ? 0 : 1;
      this.appService.save(prod, 'Product')
        .subscribe(result => {
          if (result.id > 0) {
            this.product.copyData(result);
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            //this.selectedTab = 1;
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });

    } catch (e) {
      console.log(e);
    }
   }
}
