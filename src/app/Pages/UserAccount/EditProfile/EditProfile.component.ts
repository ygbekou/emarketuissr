import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { User } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'app-edit-profile',
   templateUrl: './EditProfile.component.html',
   styleUrls: ['./EditProfile.component.scss']
})
export class EditProfileComponent extends BaseComponent implements OnInit {

   user: User = new User();
   messages: any;
   error: string;
   formData: FormData;
   picture: any[] = [];



   type: string;
   info: FormGroup;
   address: FormGroup;
   card: FormGroup;

   emailPattern: any = /\S+@\S+\.\S+/;
   toastOption: ToastOptions = {
      title: 'Account Information',
      msg: 'Your account information updated successfully!',
      showClose: true,
      timeout: 3000,
      theme: 'material'
   };



   constructor(private route: ActivatedRoute,
      public appService: AppService,
      public translate: TranslateService,
      private router: Router,
      private formGroup: FormBuilder,
      private toastyService: ToastaService) {
      super(translate);
      this.route.params.subscribe(params => {
         this.route.queryParams.forEach(queryParams => {
            this.type = queryParams['type'];
         });
      });
   }

   ngOnInit() {
      this.getUser();

      this.address = this.formGroup.group({
         address: ['', [Validators.required]],
         buiding_name: ['', [Validators.required]],
         street_no: ['', [Validators.required]],
         state: ['', [Validators.required]],
         zip_code: ['', [Validators.required]],
         country: ['', [Validators.required]]
      });

      this.card = this.formGroup.group({
         card_number: ['', [Validators.required]],
         cvv: ['', [Validators.required]],
         name: ['', [Validators.required]],
         month: ['', [Validators.required]],
         year: ['', [Validators.required]]
      });
   }

   /**
    * Function is used to submit the profile info.
    * If form value is valid, redirect to profile page.
    */

   submitProfileInfo() {
      this.messages = '';
      this.user.modifiedBy = +this.appService.tokenStorage.getUserId();
      this.formData = new FormData();
      if (this.picture && this.picture.length > 0 && this.picture[0].file) {
         this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
      }

      this.appService.saveWithFile(this.user, 'User', this.formData, 'saveWithFile')
         .subscribe(data => {
            this.processResult(data, this.user, null)
            this.user = data;
         });

   }

   getUser() {
     const userId = Number(this.appService.tokenStorage.getUserId());
      if (userId > 0) {
         this.appService.getOneWithChildsAndFiles(userId, 'User')
            .subscribe(result => {
               if (result.id > 0) {
                  this.user = result;
                  this.user.confirmPassword = this.user.password;
                  const images: any[] = [];
                  this.user.fileNames.forEach(item => {
                     const image = {
                        link: 'assets/images/users/' + userId + '/' + item,
                        preview: 'assets/images/users/' + userId + '/' + item
                     }
                     images.push(image);
                  })

                  this.picture = images;

               } else {
                  this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {

                     this.error = res['MESSAGE.READ_FAILED'];

                  });
               }
            });
      }
   }


   /**
    * Function is used to submit the profile address.
    * If form value is valid, redirect to address page.
    */
   submitAddress() {
      if (this.address.valid) {
         this.router.navigate(['/account/address']).then(() => {
            this.toastyService.success(this.toastOption);
         });
      } else {
         for (const i in this.address.controls) {
            this.address.controls[i].markAsTouched();
         }
      }
   }

   /**
    * Function is used to submit the profile card.
    * If form value is valid, redirect to card page.
    */
   submitCard() {
      if (this.card.valid) {
         this.router.navigate(['/account/card']).then(() => {
            this.toastyService.success(this.toastOption);
         });
      } else {
         for (const i in this.card.controls) {
            this.card.controls[i].markAsTouched();
         }
      }
   }

}
