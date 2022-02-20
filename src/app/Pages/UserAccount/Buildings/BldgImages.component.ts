import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Form } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Product, ProductVideo, Building } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
   selector: 'app-bldg-images',
   templateUrl: './BldgImages.component.html',
   styleUrls: ['./Buildings.component.scss']
})

export class BldgImagesComponent extends BaseComponent implements OnInit {

   bldg: Building;
   bldgId: number;
   messages: string;
   formData: FormData;
   mainFiles: any[];
   image1Files: any[];
   image2Files: any[];
   files: any[];

   picture: any;

   className = 'com.softenza.emarket.model.hospitality.Building';

   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }

   ngOnInit() {
      console.log('Bldg image loaded');
   }

   getBldg() {
      this.mainFiles = [];
      this.image1Files = [];
      this.image2Files = [];
      this.files = [];
      this.appService.getOneWithChildsAndFiles(this.bldgId, this.className)
         .subscribe(result => {
            if (result.id > 0) {
               this.bldg = result;
               console.log(result);
               const images: any[] = [];
               this.mainFiles = [];
               this.files = [];
               this.bldg.fileNames.forEach(item => {
                  if (item === this.bldg.image) {
                     this.mainFiles.push(
                        {
                           link: 'assets/images/buildings/' + this.bldgId + '/' + item,
                           preview: 'assets/images/buildings/' + this.bldgId + '/' + item
                        }
                     );
                  } else if (item === this.bldg.image1) {
                     this.image1Files.push(
                        {
                           link: 'assets/images/buildings/' + this.bldgId + '/' + item,
                           preview: 'assets/images/buildings/' + this.bldgId + '/' + item
                        }
                     );
                  }  else if (item === this.bldg.image2) {
                     this.image2Files.push(
                        {
                           link: 'assets/images/buildings/' + this.bldgId + '/' + item,
                           preview: 'assets/images/buildings/' + this.bldgId + '/' + item
                        }
                     );
                  }  else {
                     const image = {
                        link: 'assets/images/buildings/' + this.bldgId + '/' + item,
                        preview: 'assets/images/buildings/' + this.bldgId + '/' + item
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

   saveFiles() {
      const bldg = { ...this.bldg };
      bldg.remainingFileNames = [];
      bldg.modifiedBy = +this.appService.tokenStorage.getUserId();
      this.formData = new FormData();

      console.log(this.files);
      console.log(this.mainFiles);

      // tslint:disable-next-line: prefer-for-of

      this.listFiles(bldg, this.mainFiles, 'main_picture.');
      this.listFiles(bldg, this.image1Files, 'image1.');
      this.listFiles(bldg, this.image2Files, 'image2.');
      this.listFiles(bldg, this.files, 'picture.');

      bldg.singleImage = false;
      if (this.files.length > 0 || this.mainFiles.length > 0 || this.image1Files.length > 0
         || this.image2Files.length > 0) {
         console.log(bldg);

         this.appService.saveWithFile(bldg, this.className, this.formData, 'manageFiles')
            .subscribe(result => {
               if (result.id > 0) {
                  console.log('manageFiles');
                  this.bldg.image = result.image;
                  this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                     this.messages = res['MESSAGE.SAVE_SUCCESS'];
                  });
               } else {
                  this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                     this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
                  });
               }
            });
      }
   }

   listFiles(bldg: Building, files: any[], fileName: string) {
      for (let i = 0; i < files.length; i++) {
         if (files[i].file) {
            this.formData.append('file[]', files[i].file, fileName + files[i].file.name);
         } else {
            const pathSplitArray = files[i].link.split('/');
            bldg.remainingFileNames.push(pathSplitArray[pathSplitArray.length - 1]);
         }
      }
   }

}
