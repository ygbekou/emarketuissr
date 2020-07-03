import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, ProductDescription, Language } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';

@Component({
	selector: 'app-product-description',
	templateUrl: './ProductDescription.component.html',
	styleUrls: ['./ProductDescription.component.scss']
})

export class ProductDescriptionComponent implements OnInit {

   form: FormGroup;
   mainImgPath: string;
	colorsArray: string[] = ['Red', 'Blue', 'Yellow', 'Green'];
   sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   public imagePath;

   messages = '';

   'data': any = [
      {
         'image': 'https://via.placeholder.com/625x800',
         'image_gallery': [
            'https://via.placeholder.com/625x800',
            'https://via.placeholder.com/625x800',
            'https://via.placeholder.com/625x800',
            'https://via.placeholder.com/625x800',
            'https://via.placeholder.com/625x800'
         ]
      }
   ];


   @Input() product: Product;
   @Input() f: Form;

   productDescription: ProductDescription;
   selectedTab = 0;
   selectedMainTabIndex = 0;

   constructor(public formBuilder: FormBuilder,
      protected translate: TranslateService,
      public appService: AppService) { }

	ngOnInit() {

      this.mainImgPath = this.data[0].image;
      this.form = this.formBuilder.group({
			name					: [],
			price 				: [],
			availablity   		: [],
			product_code 		: [],
			description 		: [],
			tags					: [],
			features				: []
      });

      this.productDescription = this.product.productDescriptions[0];

   }

   /**
    * getImagePath is used to change the image path on click event.
    */
   public getImagePath(imgPath: string, index: number) {
      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index + '_img').className += ' border-active';
   }


   onLangChanged(event) {
      this.messages = '';
    this.product.productDescriptions.forEach(prodDesc => {
      if (prodDesc.languageName === event.tab.textLabel) {
        this.productDescription = prodDesc;
        return;
      }
    });
   }

   save() {
    this.messages = '';
    try {
      this.product.status = (this.product.status == null || this.product.status.toString() === 'false') ? 0 : 1;
      const prod = new Product();
      prod.model = this.product.model;
      prod.id = this.product.id;
      this.productDescription.product = prod;
      this.appService.save(this.productDescription, 'ProductDescription')
         .subscribe(result => {
            if (result.id > 0) {
               this.productDescription = result;
               this.product.id = result.product.id;
               this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.SAVE_SUCCESS'];
               });
            } else {
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
