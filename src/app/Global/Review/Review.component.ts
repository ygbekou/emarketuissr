import { Component, OnInit, Input } from '@angular/core';
import { Review, ProductDescription, Store, ProductDescVO, ProductSearchCriteria } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { ActivatedRoute, Router } from '@angular/router';

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
  products: ProductDescVO[] = [];

  store: Store;
  canEdit = false;
  reviewClass: string;

  action = 'saving';
  isAdmin = false;

  constructor(public appService: AppService,
    public translate: TranslateService,
    public router: Router,
    private activatedRoute: ActivatedRoute) {
    super(translate);
    if (this.appService.tokenStorage.getUserId() === null) {
      this.router.navigate(['/session/signin']);
    }
  }

  ngOnInit() {

    this.activatedRoute.data.subscribe(value => {
      this.isAdmin = (value && value.expectedRole && value.expectedRole[0] === 'Administrator');
    });

    this.activatedRoute.params.subscribe(params => {

      this.action = 'saving';
      this.messages = '';
      this.errors = '';
      this.reviewType = params.reviewType;

      if ('store' === this.reviewType) {
        this.productDesc = undefined;
        this.reviewClass = 'StoreReview';
        this.getStore(params.reviewTypeId);
      } else {
        this.store = undefined;
        this.reviewClass = 'ProductReview';
        this.getProductDescriptions(params.reviewTypeId);
      }
      this.getReview(params.reviewId);

    });
  }


  public getStore(id: number) {
    const parameters: string[] = [];
    parameters.push('e.id = |storeId|' + id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.Store', parameters,
      ' ')
      .subscribe((data: Store[]) => {
        this.store = data[0];
        this.review.store = new Store();
        this.review.store.id = this.store.id;
        this.review.type = this.reviewClass;
      },
        (error) => console.log(error),
        () => console.log('Get Store complete'));
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
          this.review.type = this.reviewClass;
        }
      },
        error => console.log(error),
        () => console.log('Get all Category Item complete'));
  }

  getReview(reviewId: number) {
    if (reviewId > 0) {
      this.appService.getOneWithChildsAndFiles(reviewId, this.reviewClass)
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
    if (!this.isAdmin) {
      this.review.rating = rating;
    }
  }

  approve() {

    this.review.approvalStatus = 1;
    this.save();
  }

  reject() {

    this.review.approvalStatus = 2;
    this.save();
  }

  save() {
    this.messages = '';
    this.errors = '';

    if (this.review.rating === 0) {
      this.translate.get(['MESSAGE.INVALID_RATING']).subscribe(res => {
        this.messages = res['MESSAGE.INVALID_RATING'];
      });
      return;
    }

    try {
      this.formData = new FormData();
      if (this.picture && this.picture.length > 0 && this.picture[0].file) {
        this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
      }
      this.setToggleValues();
      this.review.user.id = +this.appService.tokenStorage.getUserId();
      // this.review.author = this.appService.tokenStorage.getUser().lastName + ' ' + this.appService.tokenStorage.getUser().firstName;
      this.review.author =   this.appService.tokenStorage.getUser().firstName;

      this.appService.saveWithFileUsingUrl('/service/catalog/submit' + this.reviewClass + '/', this.review, this.formData)
        .subscribe(result => {
          this.processResult(result, this.review, null);
          if (result.id > 0) {
            if (!this.isAdmin) {
              this.action = 'saved';
              this.review = new Review();
              this.getBoughtProducts();
            }
          }
        });

    } catch (e) {
      console.log(e);
    }

  }

  setToggleValues() {
    this.review.status = (this.review.status === null
      || this.review.status === undefined
      || this.review.status.toString() === 'false'
      || this.review.status.toString() === '0') ? 0 : 1;
  }


  getBoughtProducts() {
    this.appService.saveWithUrl('/service/catalog/getBoughtProducts/', new ProductSearchCriteria(
      this.appService.appInfoStorage.language.id, 0, 0, 0, '0', 1, 0, 10, Number(this.appService.tokenStorage.getUserId())
    ))
      .subscribe((data: ProductDescVO[]) => {
        this.products = data;
      },
        error => console.log(error),
        () => console.log('Get all getBoughtProducts complete'));
  }



}
