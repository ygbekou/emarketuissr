import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { CategoryDescription } from 'src/app/app.models';
import { Router } from '@angular/router';

@Component({
   selector: 'header-two',
   templateUrl: './HeaderTwo.component.html',
   styleUrls: ['./HeaderTwo.component.scss']
})
export class HeaderTwoComponent implements OnInit {

   popupResponse: any;

   public categories: CategoryDescription[] = [];
   // = ['All Categories', 'Computers', 'Food', 'Vegetables'];
   selectedCategory = 'All Categories';
   addressType: string;
   searchText: string;

   constructor(public appService: AppService, 
      public translate: TranslateService,
      public router: Router) { }

   ngOnInit() {

   }


   public toggleSearch() {
      document.querySelector('app-main').classList.toggle('form-open');
   }

   public toggleSidebar() {
      this.appService.sidenavOpen = !this.appService.sidenavOpen;
   }

   public openConfirmationPopup(value: any) {
      let message = "Are you sure you want to delete this product?";
      this.appService.confirmationPopup(message).
         subscribe(res => { this.popupResponse = res },
            err => console.log(err),
            () => this.getPopupResponse(this.popupResponse, value, 'cart')
         );
   }

   public getPopupResponse(response: any, value: any, type) {
      if (response) {
         if (type == 'cart') {
            this.appService.removeLocalCartProduct(value);
         } else {
            this.appService.removeLocalWishlistProduct(value);
         }
      }
   }

   public addAllWishlistToCart(values: any) {
      this.appService.addAllWishListToCart(values);
   }

   public openWishlistConfirmationPopup(value: any) {
      let message = "Are you sure you want to add all products?";
      this.appService.confirmationPopup(message).
         subscribe(res => { this.popupResponse = res },
            err => console.log(err),
            () => this.getPopupResponse(this.popupResponse, value, 'wishlist')
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

   public searchProducts() {
      this.router.navigate(['/products'], { queryParams: { searchText: this.searchText }});
   }
}
