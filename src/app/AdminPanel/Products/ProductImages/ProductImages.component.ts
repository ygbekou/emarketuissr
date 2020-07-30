import { Component, OnInit, Input } from '@angular/core';
import { Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, ProductVideo } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
   selector: 'app-product-images',
   templateUrl: './ProductImages.component.html',
   styleUrls: ['./ProductImages.component.scss']
})

export class ProductImagesComponent extends BaseComponent implements OnInit {

   @Input() product: Product;
   @Input() productId: number;
   @Input() f: Form;

   messages: string;
   formData: FormData;
   files: any[];
   mainFiles: any[];
   picture: any;

   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }

   ngOnInit() {
      this.getProduct();
   }

   getProduct() {
      this.appService.getOneWithChildsAndFiles(this.productId, 'com.softenza.emarket.model.Product')
         .subscribe(result => {
            if (result.id > 0) {
               this.product = result;
               console.log(result);
               const images: any[] = [];
               this.mainFiles = [];
               this.files = [];
               this.product.fileNames.forEach(item => { 
                  if (item === this.product.image) {
                     this.mainFiles.push(
                        {
                           link: 'assets/images/products/' + this.productId + '/' + item,
                           preview: 'assets/images/products/' + this.productId + '/' + item
                        }
                     )
                  } else {
                     const image = {
                        link: 'assets/images/products/' + this.productId + '/' + item,
                        preview: 'assets/images/products/' + this.productId + '/' + item
                     }
                     images.push(image);
                  }
               })
               this.files = images;
            } else {
               this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                  this.messages = res['MESSAGE.READ_FAILED'];
               });
            }
         });
   }

   save() {
      const product = new Product();
      product.id = this.productId;
      this.product.modifiedBy = +this.appService.tokenStorage.getUserId();
      this.formData = new FormData();

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.files.length; i++) {
         if (this.files[i].file) {
            this.formData.append('file[]', this.files[i].file, 'picture.' + this.files[i].file.name);
         }
      } 
      for (let i = 0; i < this.mainFiles.length; i++) {
         if (this.mainFiles[i].file) { 
            this.formData.append('file[]', this.mainFiles[i].file, 'main_picture.' + this.mainFiles[i].file.name);
         }
      }
      product.productVideos = this.product.productVideos;
      product.singleImage = false;
      if (this.files.length > 0) {
         console.log(product);

         this.appService.saveWithFile(product, 'Product', this.formData, 'saveWithFile')
            .subscribe(result => {
               if (result.id > 0) {
                  console.log('saveWithFile');
                  this.product = result;
                  this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                     this.messages = res['MESSAGE.SAVE_SUCCESS'];
                  });
               } else {
                  this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                     this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
                  });
               }
            });
      } else {
         this.appService.save(product, 'Product')
            .subscribe(result => {
               if (result.id > 0) {
                  this.product.id = result.id;
                  this.processResult(result, this.product, null);
               }
            });
      }
   }

   public addProductVideo(): void {
      if (!this.product.productVideos) {
         this.product.productVideos = [];
      }
      this.product.productVideos.push(new ProductVideo());
   }

   public deleteProductVideo(id: number, index: number) {

      if (id === undefined || id === null) {
         this.removeItem(this.product.productVideos, id);
         return;
      }

      this.appService.delete(id, 'com.softenza.emarket.model.Product')
         .subscribe(data => {
            this.removeItem(this.product.productVideos, id);
            this.processDeleteResult(data, this.messages);
         });
   }

   public deleteFile(product: Product, fileName: string) {
      const vo = { id: product.id, name: fileName };
      this.appService.deleteFile('com.wack.model.website.Product', vo)
         .subscribe(data => {
            this.removeElement(this.product.fileNames, fileName);
         });
   }


}
