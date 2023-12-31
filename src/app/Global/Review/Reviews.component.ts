import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-Reviews',
  templateUrl: './Reviews.component.html',
  styleUrls: ['./Review.component.scss']
})
export class ReviewsComponent implements OnInit {

   @Input()
   reviewType: string;

   @Input()
   details: any;

   @Input()
   reviews: any;

   constructor() { }

   ngOnInit() {
   }

}
