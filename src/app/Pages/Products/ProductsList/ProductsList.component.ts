import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { Language, Pagination, ProductDescVO, MarketingDescription, CategoryDescription, SearchCriteria, ProductListVO, CartItem } from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'app-prod-list-all',
   templateUrl: './ProductsList.component.html',
   styleUrls: ['./ProductsList.component.scss']
})
export class ProductsListComponent implements OnInit {

   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) sort: any;
   @ViewChild('sidenav', { static: false }) sidenav: any;
   dataSource: MatTableDataSource<ProductDescVO>;
   public viewType = 'grid';
   public viewCol = 33.3;
   public count = 6;
   public searchFields: any;
   products: ProductDescVO[] = [];
   public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
   public message: string;
   public errors: string;
   public watcher: Subscription;
   catId = 0;
   marketId = 0;
   searchText = '0';
   storeId = 0;
   markDesc: MarketingDescription = new MarketingDescription();
   catDesc: CategoryDescription = new CategoryDescription();
   slideConfig: any;
   height = { 'height': '70px' };
   public counts = [2, 3, 6, 12, 24, 36];
   dummyCat = '';

   productList: ProductListVO = new ProductListVO();
   public searchCriteria: SearchCriteria = new SearchCriteria();


   public sortings = [
      { code: 'priceasc', name: 'Prix ascendant' },
      { code: 'pricedesc', name: 'Prix descendant' },
      { code: 'rating', name: 'Rating' }];

   constructor(public appService: AppService,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private activatedRoute: ActivatedRoute) { }

   ngOnInit() {

      if (this.appService.appInfoStorage.language.code === 'en') {
         this.sortings = [
            { code: 'priceasc', name: 'Price ascending' },
            { code: 'pricedesc', name: 'Price descending' },
            { code: 'rating', name: 'Rating' }];
      }
      this.sort = this.sortings[0];

      this.dataSource = new MatTableDataSource();


      this.activatedRoute.params.subscribe(params => {
         console.log(params);
         console.log(params.type);

         this.catId = 0;
         this.marketId = 0;

         if (params.type) {
            const type = params.type.substring(0, 3);
            if (type === 'cat') {
               this.catId = params.type.substring(3);
            } else if (type === 'mak') {
               this.marketId = params.type.substring(3);
            }

            if (this.catId > 0 || this.marketId > 0) {
               console.log('catId=' + this.catId + ', marketId=' + this.marketId);
               this.getData();
            }
         }

      });


      this.activatedRoute.queryParams.subscribe(params => {

         console.info(this.activatedRoute.queryParams);
         this.activatedRoute.queryParams.forEach(queryParams => {
            if (queryParams['searchText'] !== undefined) {
               this.searchText = queryParams['searchText'];
               this.getData();
            }

            if (queryParams['storeId'] !== undefined) {
               this.storeId = queryParams['storeId'];
               this.getData();
            }

         });


      });



      this.watcher = this.mediaObserver.media$.subscribe((change: MediaChange) => {
         if (change.mqAlias === 'xs') {
            this.viewCol = 100;
         } else if (change.mqAlias === 'sm') {
            this.viewCol = 50;
         } else if (change.mqAlias === 'md') {
            this.viewCol = 50;
         } else {
            this.viewCol = 33.3;
         }
      });

   }
   getProducts() {
      this.appService.getObject('/service/catalog/getProductsOnSale/' +
         this.appService.appInfoStorage.language.id + '/' + this.storeId + '/' + this.marketId + '/' + this.catId + '/' + this.searchText)
         .subscribe((data: ProductListVO) => {
            this.productList = data;
            this.translate.get(['COMMON.ALL_CATEGORIES', 'COMMON.ALL_CATEGORIES']).subscribe(res => {
               this.dummyCat = res['COMMON.ALL_CATEGORIES'];
            });
            if (this.productList && this.productList.categories) {
               this.productList.categories.unshift(this.dummyCat);
            }

            // console.log(data);
            const result = this.filterData(data.productDescVOs);
            if (result.data.length === 0) {
               // this.properties.length = 0;
               this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
               this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
                  this.message = res['MESSAGE.NO_RESULT_FOUND'];
               });
            }
            // console.log(result.data.categories);
            this.dataSource = new MatTableDataSource(result.data);
            this.pagination = result.pagination;
            this.message = null;

            this.dataSource.filterPredicate = (data, filter) => {
               let found = true;
               if (this.searchCriteria.priceMin && this.searchCriteria.priceMax) {

                  if (!(data.product.price >= this.searchCriteria.priceMin
                     && data.product.price <= this.searchCriteria.priceMax)) {
                     found = false;
                  }
               } else if (this.searchCriteria.priceMin && !this.searchCriteria.priceMax) {
                  if (!(data.product.price >= this.searchCriteria.priceMin)) {
                     found = false;
                  }
               } else if (!this.searchCriteria.priceMin && this.searchCriteria.priceMax) {
                  if (!(data.product.price <= this.searchCriteria.priceMax)) {
                     found = false;
                  }
               }

               if (this.searchCriteria.category) {
                  if (!(this.searchCriteria.category === data.category) &&
                     this.searchCriteria.category !== this.dummyCat) {
                     found = false;
                  }
               }

               if (this.searchCriteria.text) {
                  if (!(data.name.toLowerCase().indexOf(this.searchCriteria.text.toLowerCase()) > -1)) {
                     found = false;
                  }
               }

               return found;
            }

         },
            error => console.log(error),
            () => console.log('Get all getProductsOnSale complete'));
   }

   public getData() {
      const parameters: string[] = [];
      this.appService.getAllByCriteria('com.softenza.emarket.model.Language',
         parameters, ' order by e.sortOrder ')
         .subscribe((data: Language[]) => {
            let lang = navigator.language;
            if (lang) {
               lang = lang.substring(0, 2);
            }
            if (Cookie.get('lang')) {
               lang = Cookie.get('lang');
               console.log('Using cookie lang=' + Cookie.get('lang'));
            } else if (lang) {
               console.log('Using browser lang=' + lang);
               // this.translate.use(lang);
            } else {
               lang = 'fr';
               console.log('Using default lang=fr');
            }
            data.forEach(language => {
               if (language.code === lang) {
                  this.getProducts();
                  this.getMarkDescs(language.id);
                  this.getCatDescs(language.id);
               }
            });

         }, error => console.log(error),
            () => console.log('Get Languages complete'));
   }

   getMarkDescs(langId: number) {
      const parameters: string[] = [];
      if (this.marketId > 0) {
         parameters.push('e.marketing.id = |marketingId|' + this.marketId + '|Integer');
         parameters.push('e.language.id = |langId|' + langId + '|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.MarketingDescription', parameters)
            .subscribe((data: MarketingDescription[]) => {
               if (data && data.length > 0) {
                  this.markDesc = data[0];
               }
            },
               error => console.log(error),
               () => console.log('Get all Marketing Item complete'));
      }
   }

   getCatDescs(langId: number) {
      const parameters: string[] = [];
      if (this.catId > 0) {
         parameters.push('e.category.id = |categoryId|' + this.catId + '|Integer');
         parameters.push('e.language.id = |langId|' + langId + '|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.CategoryDescription', parameters)
            .subscribe((data: CategoryDescription[]) => {
               if (data && data.length > 0) {
                  this.catDesc = data[0];
                  console.log(this.catDesc);
               }
            },
               error => console.log(error),
               () => console.log('Get all Category Item complete'));
      }
   }

   public applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }

   public applyAllFilter() {
      this.dataSource.filter = '' + Math.random();
   }


   public addToCart(value) {
      this.appService.addToCart(value);
   }

   public addToWishList(value) { 
      this.appService.addToWishlist(value);
   }

   public transformHits(hits) {
      hits.forEach(hit => {
         hit.stars = [];
         for (let i = 1; i <= 5; i) {
            hit.stars.push(i <= hit.rating);
            i += 1;
         }
      });
      return hits;
   }

   public changeCount(count) {
      this.count = count;
      // this.products.length = 0;
      this.resetPagination();
      this.filterProducts();
   }
   public changeSorting(sort) {
      this.sort = sort;
      this.filterProducts();
   }
   public changeViewType(obj) {
      if (obj.viewType === 'list') {
         this.changeCount(1);
      } else if (this.count === 1) {
         this.changeCount(6);
      }
      this.viewType = obj.viewType;
      this.viewCol = obj.viewCol;
   }


   public onPageChange(e) {
      this.pagination.page = e.pageIndex + 1;
      this.filterProducts();
      // window.scrollTo(0, 0);
   }

   public resetPagination() {
      if (this.paginator) {
         this.paginator.pageIndex = 0;
      }
      this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
   }

   public filterProducts() {
      const result = this.filterData(this.products);
      if (result.data.length === 0) {
         // this.properties.length = 0;
         this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
         this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
            this.message = res['MESSAGE.NO_RESULT_FOUND'];
         });
      }
      this.dataSource = new MatTableDataSource(result.data);
      this.pagination = result.pagination;
      this.message = null;
   }


   public filterData(data) {
      return this.appService.filterData(data, this.searchFields, this.sort.code, this.pagination.page, this.pagination.perPage);
   }

   public searchClicked(data: string) {

      this.searchCriteria.text = data.trim().toLowerCase();
      this.applyAllFilter();
      // this.applyFilter(data);
   }

   selectForSaleProduct($event) {
      console.log($event);
   }

   buy() {

   }

}
