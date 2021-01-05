import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { Store, Review, ReviewSearchCriteria } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ReviewsTableComponent } from './ReviewsTable.component';

@Component({
  selector: 'app-admin-reviews',
  templateUrl: './AdminReviews.component.html',
  styleUrls: ['./AdminReviews.component.scss']
})

export class AdminReviewsComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('ProductReviewComponent', { static: false }) productReviewComponent: ReviewsTableComponent;
  @ViewChild('StoreReviewComponent', { static: false }) storeReviewComponent: ReviewsTableComponent;

  messages = '';
  button = 'filter';
  @Input() userId: number;

  searchCriteria: ReviewSearchCriteria = new ReviewSearchCriteria();
  srSearchCriteria: ReviewSearchCriteria = new ReviewSearchCriteria();

  reviews: Review[] = [];
  colors = ['primary', 'secondary'];

  stores: Store[] = [];

  productFirstLoad = true;
  storeFirstLoad = true;

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.clear();
    this.getStores();
  }

  ngAfterViewInit() {
    this.search();
  }

  private clear() {
    const oldReviewType = (this.searchCriteria.reviewType === undefined ? 0 : this.searchCriteria.reviewType);
    const oldReviewTypeString = (this.searchCriteria.reviewTypeString === undefined ? 'product' : this.searchCriteria.reviewTypeString);
    this.searchCriteria = new ReviewSearchCriteria();
    this.searchCriteria.languageId = this.appService.appInfoStorage.language.id;
    this.searchCriteria.approvalStatus = 0;
    this.searchCriteria.status = 1;
    this.searchCriteria.reviewType = oldReviewType;
    this.searchCriteria.reviewTypeString = oldReviewTypeString;
  }

  changeReviewType(event) {
    this.searchCriteria.reviewType = event.index;
    this.searchCriteria.reviewTypeString = event.index === 0 ? 'product' : 'store';

    if (this.searchCriteria.reviewType === 0) {
      this.storeReviewComponent.productReviewsColumns = ['id', 'productName', 'author', 'headline', 'comments', 'enabled',
                          'approved', 'createDate'];
    } else {
      this.storeReviewComponent.productReviewsColumns = ['id', 'storeName', 'author', 'headline', 'comments', 'enabled',
                          'approved', 'createDate'];
    }

    if (event.index === 0 && this.productFirstLoad) {
      this.search();
      this.productFirstLoad = false;
    }
    if (event.index === 1 && this.storeFirstLoad) {
      this.search();
      this.storeFirstLoad = false;
    }

  }

  private getStores() {
    this.srSearchCriteria.approvalStatus = 0;
    this.appService.saveWithUrl('/service/catalog/stores', this.srSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }


  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {
      if (this.searchCriteria.reviewType === 0) {
        this.productReviewComponent.searchCriteria = this.searchCriteria;
        this.productReviewComponent.productReviewsColumns = ['id', 'productName', 'author', 'headline', 'comments', 'enabled',
                            'approved', 'createDate'];
        this.productReviewComponent.search();
      } else {
        this.storeReviewComponent.searchCriteria = this.searchCriteria;
        this.storeReviewComponent.productReviewsColumns = ['id', 'storeName', 'author', 'headline', 'comments', 'enabled',
                            'approved', 'createDate'];
        this.storeReviewComponent.search();
      }
    }
  }

  public applyFilter(filterValue: string) {
    if (this.searchCriteria.reviewType === 0) {
      this.productReviewComponent.applyFilter(filterValue);
    } else {
      this.storeReviewComponent.applyFilter(filterValue);
    }

  }
}
