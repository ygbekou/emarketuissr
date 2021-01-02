import { Component, OnInit, Input } from '@angular/core';
import { Review, Product, ProductDescription } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './Review.component.html',
  styleUrls: ['./Review.component.scss']
})
export class ReviewComponent extends BaseComponent implements OnInit {

  formData: FormData;
  picture: any[] = [];
  messages = '';
  errors = '';

  review: Review = new Review();

  @Input() reviewType: string;

  productDesc: ProductDescription;
  canEdit = false;

  constructor(public appService: AppService,
      public translate: TranslateService,
      private activatedRoute: ActivatedRoute) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.getReview(params.reviewId);
      this.getProductDescriptions(params.productId);
    });
  }

  getProductDescriptions(productId: number) {
    const parameters: string[] = [];
    if (productId != null) {
      parameters.push('e.product.id = |productId|' + productId + '|Integer');
      parameters.push('e.language.id = |languageId|' + this.appService.appInfoStorage.language.id + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.ProductDescription', parameters)
      .subscribe((data: ProductDescription[]) => {

        if (data !== null && data.length > 0) {
          this.productDesc = data[0];
          this.review.product.id = this.productDesc.product.id;
        }
      },
        error => console.log(error),
        () => console.log('Get all Category Item complete'));
  }

  getReview(reviewId: number) {
    if (reviewId > 0) {
      this.appService.getOneWithChildsAndFiles(reviewId, 'ProductReview')
        .subscribe(result => {
          if (result.id > 0) {
            this.review = result;
            this.picture.push(
              {
                link: 'assets/images/productreviews/' + this.review.id + '/' + this.review.image,
                preview: 'assets/images/productreviews/' + this.review.id + '/' + this.review.image
              }
            );
          } else {
            this.review = new Review();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  updateRating(rating: number) {
    this.review.rating = rating;
  }

  edit(reviewId: number) {
    if (reviewId > 0) {
      this.appService.getOne(reviewId, 'ProductReview')
        .subscribe(result => {
          if (result) {
            if (result.id > 0) {
              this.review = result;
            } else {
              this.review = new Review();
              this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                this.messages = res['MESSAGE.READ_FAILED'];
              });
            }
          }
        });
    }
  }

  public remove(reviewId: number) {
    this.messages = '';
    this.appService.delete(reviewId, 'ProductReview')
      .subscribe(resp => {
        //this.processDataSourceDeleteResult(resp, this.messages, this.orderHistory, this.dataSource);
      });
  }

  save() {
    this.messages = '';
    this.errors = '';
    
    try {
      this.formData = new FormData();
      if (this.picture && this.picture.length > 0 && this.picture[0].file) {
        this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
      }
      this.setToggleValues();
      this.review.user.id = +this.appService.tokenStorage.getUserId();
      this.review.author = this.appService.tokenStorage.getUser().lastName + ' ' + this.appService.tokenStorage.getUser().firstName
      this.appService.saveWithFileUsingUrl('/service/catalog/submitReview/', this.review, this.formData)
        .subscribe(result => {
          this.processResult(result, this.review, null);
          if (result.id > 0) {
            
          }
        });

    } catch (e) {
      console.log(e);
    }
    
  }

  setToggleValues() {
    this.review.status = (this.review.status === null
      || this.review.status.toString() === 'false'
      || this.review.status.toString() === '0') ? 0 : 1;
  }

  public setCanEdit() {
    // console.log('current user id:' + this.appService.tokenStorage.getUserId());
    // console.log('Role:' + this.appService.tokenStorage.getRole());
    // if (Number(this.appService.tokenStorage.getUserId()) === this.storeOwnerId ||
    //   Number(this.appService.tokenStorage.getRole()) === 3) { // this is the store owner
    //   this.canEdit = true;
    //   this.displayedColumns = ['dateAdded', 'user', 'comment', 'status', 'notified', 'actions'];
    // } else {
    //   this.canEdit = false;
    // }
  }

}
