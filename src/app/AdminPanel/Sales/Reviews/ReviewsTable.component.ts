import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Store, Review, ReviewSearchCriteria } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-reviews-table',
  templateUrl: './ReviewsTable.component.html',
  styleUrls: ['./AdminReviews.component.scss']
})
export class ReviewsTableComponent extends BaseComponent implements OnInit {
  productReviewsColumns: string[] = ['id', 'productName', 'author', 'headline', 'comments', 'enabled',
    'approved', 'createDate'];

  productReviewsDatasource: MatTableDataSource<Review>;
  @ViewChild('ProductMatPaginator', { static: true }) productReviewsPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) productReviewsSort: MatSort;

  messages = '';
  button = 'filter';
  @Input() userId: number;

  searchCriteria: ReviewSearchCriteria = new ReviewSearchCriteria();

  reviews: Review[] = [];
  colors = ['primary', 'secondary'];

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {

  }


  search() {
    this.setToggleValues();

    this.appService.saveWithUrl('/service/order/reviews', this.searchCriteria)
      .subscribe((data: any[]) => {
        this.productReviewsDatasource = new MatTableDataSource(data);
        this.productReviewsDatasource.paginator = this.productReviewsPaginator;
        this.productReviewsDatasource.sort = this.productReviewsSort;
      },
        error => console.log(error),
        () => console.log('Get all Reviews complete'));
  }

  public applyFilter(filterValue: string) {
    if (this.searchCriteria.reviewType === 0) {
      this.productReviewsDatasource.filter = filterValue.trim().toLowerCase();
      if (this.productReviewsDatasource.paginator) {
        this.productReviewsDatasource.paginator.firstPage();
      }
    }
  }


  public setToggleValues() {
    if (this.searchCriteria.status !== null && this.searchCriteria.status !== undefined) {
      this.searchCriteria.status = this.searchCriteria.status.toString() === 'false'
      || this.searchCriteria.status.toString() === '0' ? 0 : 1;
    }

    if (this.searchCriteria.approvalStatus !== null && this.searchCriteria.approvalStatus !== undefined) {
      this.searchCriteria.approvalStatus = this.searchCriteria.approvalStatus.toString() === 'false'
      || this.searchCriteria.approvalStatus.toString() === '0' ? 0 : 1;
    }
  }


}
