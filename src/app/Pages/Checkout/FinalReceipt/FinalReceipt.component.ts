import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from '../../../Services/app.service';

@Component({
  selector: 'app-FinalReceipt',
  templateUrl: './FinalReceipt.component.html',
  styleUrls: ['./FinalReceipt.component.scss']
})
export class FinalReceiptComponent implements OnInit {

   deliveryDate : any;
   products     : any;
   userDetails  : any;
   todayDate    : any = new Date();

   constructor(public appService: AppService, public router: Router) {
      this.getDeliveryDate();
      this.userDetails = JSON.parse(localStorage.getItem("user"));
   }

   ngOnInit() {
   }

   public getDeliveryDate() {
      this.deliveryDate = new Date();
      this.deliveryDate.setDate(this.deliveryDate.getDate() + 5); 
   }

   public calculateProductSinglePrice(product:any, value: any) {
      let price = 0;
      if(!value) {
         value = 1;
      }
      price = product.price*value;
      return price;
   }

   public calculateTotalPrice() {
      let subtotal = 0;
      if(this.appService.buyUserCartProducts && this.appService.buyUserCartProducts.length>0) {
         for(let product of this.appService.buyUserCartProducts) {
            if(!product.quantity){
               product.quantity = 1;
            }
            subtotal += (product.price *product.quantity) ;
         }
         return subtotal;
      }
      return subtotal;
   }

   public getTotalPrice() {
      let total = 0;
      if(this.appService.buyUserCartProducts && this.appService.buyUserCartProducts.length>0) {
         for(let product of this.appService.buyUserCartProducts) {
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

   public goToHome() {
      this.appService.removeBuyProducts();
      this.router.navigate(['/']);
   }

}
