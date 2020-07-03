import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppInfoStorage } from 'src/app/app.info.storage';
import { Product, ProductDescription, Language } from 'src/app/app.models';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { AppService } from 'src/app/Services/app.service';

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

      this.product = new Product();

        for (var lang of this.appService.appInfoStorage.languages) {

            let pd = new ProductDescription();
            pd.languageId = lang.id;
            pd.languageName = lang.name;
            this.product.productDescriptions.push(pd);

         }

   }

   /**
    * getImagePath is used to change the image path on click event.
    */
   public getImagePath(imgPath: string, index: number) {
      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index + '_img').className += ' border-active';
   }


   save() {
    this.messages = '';
    try {
      this.messages = '';
      //const index: number = this.dataSource.data.indexOf(this.language);
      this.product.status = (this.product.status == null || this.product.status.toString() === 'false') ? 0 : 1;
      this.appService.save(this.product, 'Product')
        .subscribe(result => {
          if (result.id > 0) {
            // this.language = new Language();
            // this.selectedTab = 0;
            // if (index !== -1) {
            //   this.dataSource.data.splice(index, 1);
            // }
            // this.dataSource.data.push(result);
            // this.dataSource = new MatTableDataSource<Language>(this.dataSource.data);
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
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
