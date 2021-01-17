import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import {
   Language, Pagination, ProductDescVO, MarketingDescription, CategoryDescription, SearchCriteria,
   ProductListVO, CartItem, Store, ProductSearchCriteria
} from 'src/app/app.models';
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

   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) sort: any;
   @ViewChild('sidenav', { static: false }) sidenav: any;

   dataSource: MatTableDataSource<ProductDescVO>;
   public viewType = 'grid';
   public viewCol = 33.3;
   public count = 6;
   public searchFields: any;
   public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
   public message: string;
   public errors: string;
   public watcher: Subscription;
   catId = 0;
   marketId = 0;
   searchText = '0';
   storeId = 0;
   store = new Store();
   markDesc: MarketingDescription = new MarketingDescription();
   catDesc: CategoryDescription = new CategoryDescription();
   slideConfig: any;
   height = { 'height': '70px' };
   public counts = [2, 3, 6, 12, 24, 36];
   dummyCat = '';

   productList: ProductListVO = new ProductListVO();
   currentFilteredProductList: ProductListVO = new ProductListVO();
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

         console.log(this.activatedRoute.queryParams);
         this.activatedRoute.queryParams.forEach(queryParams => {
            if (queryParams['searchText'] !== undefined) {
               this.searchText = queryParams['searchText'];
               this.getData();
            }

            if (queryParams['storeId'] !== undefined) {
               this.storeId = queryParams['storeId'];
               this.getStore();
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

   getStore() {
      // alert(this.storeId);
      if (this.storeId > 0) {
         this.appService.saveWithUrl('/service/catalog/getStore', {'type': 'Store', 'id': this.storeId})
            .subscribe(result => {
            if (result.id > 0) {
               this.store = result;
               console.log(this.store);
            }
         });
      }
   }


   // Getting all the product based on the Top Search
   getProducts() {
      this.appService.saveWithUrl('/service/catalog/getProductsOnSale/',
         new ProductSearchCriteria(this.appService.appInfoStorage.language.id,
            this.storeId, this.marketId, this.catId, this.searchText, 0, 0, 0, 0)
      ).subscribe((data: ProductListVO) => {
            this.applyGridFilter(data);
         },
            error => console.log(error),
            () => console.log('Get all getProductsOnSale complete'));
   }

   applyGridFilter(data) {
      // Make a copy of the backend returned data to avoid going to backend when a filtering is made.
      this.productList = data;
      this.currentFilteredProductList = undefined;
      this.translate.get(['COMMON.ALL_CATEGORIES', 'COMMON.ALL_CATEGORIES']).subscribe(res => {
         this.dummyCat = res['COMMON.ALL_CATEGORIES'];
      });

      // Making the category list.
      if (this.productList && this.productList.categories) {
         this.productList.categories.unshift(this.dummyCat);
      }

      this.createDatasource(data.productDescVOs);
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
      this.createDatasource(this.filterDataBySearchCriteria(this.searchCriteria, this.dummyCat));
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
      console.log('resetPagination called');
      this.firstPagePagination();
      this.pagination.totalPages = Math.ceil(this.pagination.total / this.count);
      this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
   }

   public firstPagePagination() {
      if (this.paginator) {
         this.paginator.pageIndex = 0;
         this.paginator.firstPage();
      }
   }

   public filterProducts() {
      this.createDatasource(this.currentFilteredProductList && this.currentFilteredProductList.productDescVOs
         ? this.currentFilteredProductList.productDescVOs : this.productList.productDescVOs);
   }

   public searchClicked(data: string) {
      this.searchCriteria.text = data.trim().toLowerCase();
      this.firstPagePagination();
      this.createDatasource(this.filterDataBySearchCriteria(this.searchCriteria, this.dummyCat));
      this.resetPagination();

   }

   filterDataBySearchCriteria(searchCriteria, dummyCat) {
      const filteredData = this.productList.productDescVOs.filter(function (data) {
         let found = true;
         if (searchCriteria.priceMin && searchCriteria.priceMax) {

            if (!(data.product.price >= searchCriteria.priceMin
               && data.product.price <= searchCriteria.priceMax)) {
               found = false;
            }
         } else if (searchCriteria.priceMin && !searchCriteria.priceMax) {
            if (!(data.product.price >= searchCriteria.priceMin)) {
               found = false;
            }
         } else if (!searchCriteria.priceMin && searchCriteria.priceMax) {
            if (!(data.product.price <= searchCriteria.priceMax)) {
               found = false;
            }
         }

         if (searchCriteria.category) {
            if (!(searchCriteria.category === data.category) &&
               searchCriteria.category !== dummyCat) {
               found = false;
            }
         }

         if (searchCriteria.text) {
            if (!(data.name.toLowerCase().indexOf(searchCriteria.text.toLowerCase()) > -1)) {
               found = false;
            }
         }
         console.log('Filter Predicate called.');
         return found;
      });

      this.currentFilteredProductList = new ProductListVO();
      this.currentFilteredProductList.productDescVOs = filteredData;
      return filteredData;
   }


   createDatasource(listData) {
      const result = this.filterData(listData);
      this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
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

   selectForSaleProduct($event) {
      console.log($event);
   }

   buy() {

   }

}
