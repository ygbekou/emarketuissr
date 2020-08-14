import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../../Services/app.service';
import { MarketingDescription, Language, Pagination } from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'app-view-all',
   templateUrl: './ViewAll.component.html',
   styleUrls: ['./ViewAll.component.scss']
})
export class ViewAllComponent implements OnInit {

   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) sort: MatSort;
   dataSource: MatTableDataSource<MarketingDescription>;
   public viewType = 'grid';
   public viewCol = 33.3;
   public count = 6;
   public searchFields: any;
   public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
   public message: string;
   public errors: string;
   public watcher: Subscription;
   marketings: MarketingDescription[] = [];
   sectionId = 0;
   slideConfig: any;
   height = {'height':  '220px' };
   public counts = [2, 3, 6, 12, 24, 36];
   constructor(public appService: AppService,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private route: ActivatedRoute) { }

   ngOnInit() {
      this.route.params.subscribe(params => {
         this.route.queryParams.forEach(queryParams => {
            this.sectionId = Number(queryParams['id']);
            console.log(this.sectionId);
            if (this.sectionId === 2) {
               this.height = {'height':  '100px' };
            } else {
               this.height = {'height':  '220px' };
            }
            this.getMarketings();
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

   addToCart($event) {

   }
   public getMarketings() {
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
                  this.getSliders(language.id);
               }
            });

         }, error => console.log(error),
            () => console.log('Get Languages complete'));
   }
   getSliders(langId: number) {
      const parameters: string[] = [];
      parameters.push('e.language.id = |langCode|' + langId + '|Integer');
      parameters.push('e.marketing.section = |sInS|' + this.sectionId + '|Integer');
      parameters.push('e.marketing.status = |stta|1|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.MarketingDescription', parameters,
         ' order by e.marketing.sortOrder')
         .subscribe((data: MarketingDescription[]) => {
            this.marketings = data;
            const result = this.filterData(data);
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
         },
            error => console.log(error),
            () => console.log('Get all MarketingDescription complete'));
   }


   public applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
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
      const result = this.filterData(this.marketings);
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
      return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
   }

   public searchClicked(data: string) {
      this.applyFilter(data);
   }

}
