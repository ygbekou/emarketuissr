import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { AppService } from '../../Services/app.service';
import { Store } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'embryo-BrandsLogo',
   templateUrl: './BrandsLogo.component.html',
   styleUrls: ['./BrandsLogo.component.scss']
})
export class BrandslogoComponent implements OnInit, OnChanges {

   @Input() isRTL: any;

   stores: Store[] = [];
   error: string;
   slideConfig: any;

   constructor(public appService: AppService, public translate: TranslateService) {
   }

   ngOnInit() {
      this.getStores();
   }

   getStores() {
      const userId = Number(this.appService.tokenStorage.getUserId());
      if (userId > 0) {
         const parameters: string[] = [];
         parameters.push('e.owner.id = |userId|' + userId + '|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.Store', parameters)
            .subscribe((data: Store[]) => {
               this.stores = data;
            },
               error => console.log(error),
               () => console.log('Get all Store complete for userId=' + userId));
      }
   }

   ngOnChanges() {
      this.slideConfig = {
         infinite: true,
         centerMode: true,
         slidesToShow: 5,
         slidesToScroll: 2,
         autoplay: true,
         autoplaySpeed: 2000,
         rtl: this.isRTL,
         responsive: [
            {
               breakpoint: 768,
               settings: {
                  centerMode: true,
                  slidesToShow: 4,
                  slidesToScroll: 2,
                  autoplay: true,
                  autoplaySpeed: 2000
               }
            },
            {
               breakpoint: 480,
               settings: {
                  centerMode: true,
                  slidesToShow: 1,
                  autoplay: true,
                  autoplaySpeed: 2000
               }
            }
         ]
      };
   }



}
