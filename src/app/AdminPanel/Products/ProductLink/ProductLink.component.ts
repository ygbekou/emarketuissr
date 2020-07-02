import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product } from 'src/app/app.models';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';

@Component({
	selector: 'app-product-link',
	templateUrl: './ProductLink.component.html',
	styleUrls: ['./ProductLink.component.scss']
})

export class ProductLinkComponent implements OnInit {

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


   @Input() product: Product;
   @Input() f: Form;


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
