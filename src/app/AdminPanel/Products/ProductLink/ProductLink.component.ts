import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, CategoryDescription } from 'src/app/app.models';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { AppService } from 'src/app/Services/app.service';

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

   categories: CategoryDescription[][] = [];
   categoryId: number;
   selectedCatDesc: CategoryDescription;
   selectedCatDescs: CategoryDescription[] = [];
   initialSelectedCatDescs: CategoryDescription[] = [];
   depth = 0;

   constructor(public formBuilder: FormBuilder,
      protected translate: TranslateService,
      public appService: AppService) { }

	ngOnInit() {

      this.getAll();
   }


   /**
    * getImagePath is used to change the image path on click event.
    */
   public getImagePath(imgPath: string, index: number) {
      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index + '_img').className += ' border-active';
   }
   

   getAll() {
      this.depth = 0;
      this.categories = [];
      const parameters: string[] = [];
      parameters.push('e.language.id = |langCode|' + this.appService.appInfoStorage.language.id + '|Integer');
      parameters.push('e.category.parent IS NULL|parentCat|0|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.CategoryDescription', parameters,
      ' order by e.category.sortOrder ')
      .subscribe((data: CategoryDescription[]) => {
        this.categories[this.depth] = data;
        this.depth++;
      },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
   }

   categorySelected(selectedCatDesc: CategoryDescription, indexOfElement: number) {
      
      const indexIncrement = indexOfElement + 1;
      this.categories.splice(indexIncrement);
      this.depth = indexIncrement;

      this.initialSelectedCatDescs[indexOfElement] = this.selectedCatDescs[indexOfElement];

      if (this.selectedCatDescs[indexOfElement].category.childCount > 0) {
         const parameters: string[] = [];
         parameters.push('e.language.id = |langCode|' + this.appService.appInfoStorage.language.id + '|Integer');
         parameters.push('e.category.parent.id = |parentCatId|' + this.selectedCatDescs[indexOfElement].category.id + '|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.CategoryDescription', parameters,
         ' order by e.category.sortOrder ')
         .subscribe((data: CategoryDescription[]) => {
         this.categories[this.depth] = data;
         this.depth++;
         },
         error => console.log(error),
         () => console.log('Get all CategoryDescription complete'));
      } else {
         this.selectedCatDesc = selectedCatDesc;
      }
   }
}
