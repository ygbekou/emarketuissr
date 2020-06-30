import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppInfoStorage } from 'src/app/app.info.storage';
import { Product, ProductDescription, Language } from 'src/app/app.models';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';

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

   product: Product;


   constructor(public formBuilder: FormBuilder,
      protected translate: TranslateService,
      public appService: AdminPanelServiceService) { }

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

      this.product = new Product();

      // this.appService.getAllByCriteria('com.softenza.emarket.model.Language', [])
      // .subscribe((data: Language[]) => {
       
        for (var lang of this.appService.appInfoStorage.languages) {
            let pd = new ProductDescription();
            pd.name = lang.name;
            this.product.productDescriptions.push(pd);
            
         }
      // }, error => console.log(error),
      //   () => console.log('Get Languages complete'));


   }

   /**
    * getImagePath is used to change the image path on click event.
    */
   public getImagePath(imgPath: string, index: number) {
      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index + '_img').className += ' border-active';
   }
}
