import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../Services/app.service';

@Component({
  selector: 'app-Signin',
  templateUrl: './Signin.component.html',
  styleUrls: ['./Signin.component.scss']
})
export class SigninComponent implements OnInit {


   constructor(public appService : AppService) { }

   ngOnInit() {
   }

   public toggleRightSidenav() {
      this.appService.paymentSidenavOpen = !this.appService.paymentSidenavOpen;
   }

   public getCartProducts() {
      let total = 0;
      if(this.appService.localStorageCartProducts && this.appService.localStorageCartProducts.length>0) {
         for(let product of this.appService.localStorageCartProducts) {
            if(!product.quantity){
               product.quantity = 1;
            }
            total += (product.price*product.quantity);
         }
         total += (this.appService.shipping+this.appService.tax);
         return total;
      }
      return total;  
   }

}
