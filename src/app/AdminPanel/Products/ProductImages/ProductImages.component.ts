import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
   @Output() imageSaveEvent = new EventEmitter<String>();

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
      console.log('Product image loaded');
      this.getProduct();
   }

   setProduct(prod: Product) {
      this.product = prod;
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
                     );
                  } else {
                     const image = {
                        link: 'assets/images/products/' + this.productId + '/' + item,
                        preview: 'assets/images/products/' + this.productId + '/' + item
                     };
                     images.push(image);
                  }
               });
               this.files = images;
            } else {
               this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                  this.messages = res['MESSAGE.READ_FAILED'];
               });
            }
         });
   }

   save() {
      console.log(this.product);
      const product = { ...this.product };
      product.productDescriptions = [];
      product.productVideos = [];
      product.productToCategorys = [];
      product.id = this.productId;
      product.remainingFileNames = [];
      product.modifiedBy = +this.appService.tokenStorage.getUserId();
      this.formData = new FormData();

      console.log(this.files);
      console.log(this.mainFiles);

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.files.length; i++) {
         if (this.files[i].file) {
            console.log('Additional file added: ' + 'picture.' + this.files[i].file.name);
            this.formData.append('file[]', this.files[i].file, 'picture.' + this.files[i].file.name);
         } else {
            console.log(this.files[i]);
            const pathSplitArray = this.files[i].link.split('/');
            product.remainingFileNames.push(pathSplitArray[pathSplitArray.length - 1]);
         }
      }
      for (let i = 0; i < this.mainFiles.length; i++) {
         if (this.mainFiles[i].file) {
            console.log('main file added: ' + 'main_picture.' + this.mainFiles[i].file.name);
            this.formData.append('file[]', this.mainFiles[i].file, 'main_picture.' + this.mainFiles[i].file.name);
         } else {
            console.log(this.mainFiles[i]);
            const pathSplitArray = this.mainFiles[i].link.split('/');
            product.remainingFileNames.push(pathSplitArray[pathSplitArray.length - 1]);
         }
      }

      console.log(this.formData);

      product.productVideos = this.product.productVideos;
      product.singleImage = false;
      if (this.files.length > 0 || this.mainFiles.length > 0) {
         console.log(product);

         this.appService.saveWithFile(product, 'Product', this.formData, 'saveWithFile')
            .subscribe(result => {
               if (result.id > 0) {
                  console.log('saveWithFile');
                  this.product.productVideos = result.productVideos;
                  this.product.image = result.image;
                  this.imageSaveEvent.emit(this.product.image);
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
                  this.imageSaveEvent.emit(this.product.image);
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
