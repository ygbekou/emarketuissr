import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ProductReview',
  templateUrl: './ProductReview.component.html',
  styleUrls: ['./ProductReview.component.scss']
})
export class ProductReviewComponent implements OnInit {

   @Input()
   singleProductDetails: any;
   @Input()
   reviews: any;

   constructor() { }

   ngOnInit() {
   }

}
