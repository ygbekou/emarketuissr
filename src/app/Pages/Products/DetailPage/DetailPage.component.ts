import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { AppService } from '../../../Services/app.service';

@Component({
  selector: 'app-DetailPage',
  templateUrl: './DetailPage.component.html',
  styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {

   id                : any;
   type              : any;
   apiResponse       : any;
   singleProductData : any;
   productsList      : any;

   constructor(private route: ActivatedRoute,
              private router: Router,
              public appService: AppService) {
      
   }

   ngOnInit() {
      this.route.params.subscribe(res => {
         this.id = res.id;
         this.type = res.type;
         this.getData();
      })
   }

   public getData() {
      this.appService.getProducts().valueChanges().subscribe(res => this.checkResponse(res));
   }

   public checkResponse(response) {
      this.productsList = null;
      this.productsList = response[this.type];
      for(let data of this.productsList)
      {
         if(data.id == this.id) {
            this.singleProductData = data;
            break;
         }
      }
   }

   public addToCart(value) {
      this.appService.addToCart(value);
   }

   public addToWishList(value) {
      this.appService.addToWishlist(value);
   }

}
