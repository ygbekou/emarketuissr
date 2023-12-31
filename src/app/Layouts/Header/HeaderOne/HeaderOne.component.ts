import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../../../Services/app.service';

@Component({
  selector: 'HeaderOne',
  templateUrl: './HeaderOne.component.html',
  styleUrls: ['./HeaderOne.component.scss']
})
export class HeaderOneComponent implements OnInit {

   toggleActive     : boolean = false;
   cartProducts     : any;
   popupResponse    : any;
   wishlistProducts : any;

   constructor(public appService: AppService) {}

   ngOnInit() {
   }

   public toggleSearch() {
      document.querySelector('app-main').classList.toggle('form-open');
   }

   public toggleSidebar()
   {
      this.appService.sidenavOpen = !this.appService.sidenavOpen;
   }

   public openConfirmationPopup(value:any) {
      let message = "Are you sure you want to delete this product?";
      this.appService.confirmationPopup(message).
         subscribe(res => {this.popupResponse = res},
                   err => console.log(err),
                   ()  => this.getPopupResponse(this.popupResponse, value, 'cart')
                  );
   }

   public getPopupResponse(response:any, value:any, type) {
      if(response) {
         if(type == 'cart'){
            this.appService.removeLocalCartProduct(value);
         } else {
            this.appService.removeLocalWishlistProduct(value);
         }
      }
   }

   public addAllWishlistToCart(values:any) {
      this.appService.addAllWishListToCart(values);
   } 

   public openWishlistConfirmationPopup(value:any) {
      let message = "Are you sure you want to add all products?";
      this.appService.confirmationPopup(message).
         subscribe(res => {this.popupResponse = res},
                   err => console.log(err),
                   ()  => this.getPopupResponse(this.popupResponse, value, 'wishlist')
                  );
   }

   public selectedCurrency(value) {
      this.appService.currency = value;
   }

   public selectedLanguage(value) {
      this.appService.language = value;
   }

   public addToCart(value) {
      this.appService.addToCart(value, 'wishlist');
   }
}
