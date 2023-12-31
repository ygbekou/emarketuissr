import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastaService, ToastOptions } from 'ngx-toasta';

@Component({
   selector: 'app-EditProfile',
   templateUrl: './EditProfile.component.html',
   styleUrls: ['./EditProfile.component.scss']
})
export class EditProfileComponent implements OnInit {

   type: string;
   info: FormGroup;
   address: FormGroup;
   card: FormGroup;
   emailPattern: any = /\S+@\S+\.\S+/;
   toastOption: ToastOptions = {
      title: "Account Information",
      msg: "Your account information updated successfully!",
      showClose: true,
      timeout: 3000,
      theme: "material"
   };

   constructor(private route: ActivatedRoute,
      private router: Router,
      private formGroup: FormBuilder,
      private toastyService: ToastaService) {

      this.route.params.subscribe(params => {
         this.route.queryParams.forEach(queryParams => {
            this.type = queryParams['type'];
         });
      });
   }

   ngOnInit() {
      this.info = this.formGroup.group({
         first_name: ['', [Validators.required]],
         last_name: ['', [Validators.required]],
         gender: ['male'],
         date: [],
         phone_number: ['', [Validators.required]],
         location: [''],
         email: ['', [Validators.required, Validators.pattern(this.emailPattern)]]
      });
   }

   /**
    * Function is used to submit the profile info.
    * If form value is valid, redirect to profile page.
    */
   submitProfileInfo() {
      if (this.info.valid) {
         this.router.navigate(['/admin/account/profile']).then(() => {
            this.toastyService.success(this.toastOption);
         });
      } else {
         for (let i in this.info.controls) {
            this.info.controls[i].markAsTouched();
         }
      }
   }

}
