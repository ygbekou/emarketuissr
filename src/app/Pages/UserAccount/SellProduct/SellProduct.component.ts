import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CategoryDescription, ProductDescription, Product, ProductToCategory, Category, Store, Pagination, ProductToStore } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatStepper, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-sell-product',
  templateUrl: './SellProduct.component.html',
  styleUrls: ['./SellProduct.component.scss']
})
export class SellProductComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  categories: CategoryDescription[][] = [];
  categoryId = 0;
  productId = 0;
  finalSelectedCatDescs: CategoryDescription[] = [];
  finalDeletedCatDescs: number[] = [];
  selectedCatDescs: CategoryDescription[] = [];
  depth = 0;
  messages: string;
  product: Product = new Product();
  productDesc: ProductDescription = new ProductDescription();
  selectedStore: Store = new Store();
  options = ['One', 'Two'];
  filteredOptions: Observable<string[]>;
  currentOption: string;
  products: ProductDescription[] = [];
  stores: Store[] = [];
  dataSource: MatTableDataSource<ProductDescription>;
  productStore: ProductToStore = new ProductToStore();
  public sidenavOpen = true;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 6;
  public searchFields: any;
  public removedSearchField: string;
  public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
  public message: string;
  public errors: string;
  public watcher: Subscription; 

  constructor(public appService: AppService,
    public translate: TranslateService,
    public mediaObserver: MediaObserver) {
    super(translate);
    this.productDesc.product = new Product();
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.sidenavOpen = false;
        this.viewCol = 100;
      } else if (change.mqAlias === 'sm') {
        this.sidenavOpen = false;
        this.viewCol = 50;
      } else if (change.mqAlias === 'md') {
        this.viewCol = 50;
        this.sidenavOpen = true;
      } else {
        this.viewCol = 33.3;
        this.sidenavOpen = true;
      }
    });
  }

  ngOnInit() {

    this.getStores();

    this.product = new Product();

    for (let counter = 0; counter < 10; counter++) {
      console.log('for loop executed : ' + counter);
      this.categories[counter] = [];
    }

    setTimeout(() => {
      this.categories.splice(1);
    }, 1000);

    this.getParentCategoryDescriptions();
    this.getProductCategoryDescriptions();
  }

  getProductCategoryDescriptions() {
    this.depth = 0;
    this.categories = [];
    this.appService.getObjects('/service/catalog/productcategorydescriptions/'
      + this.productId + '/' + this.appService.appInfoStorage.language.id)
      .subscribe((data: CategoryDescription[]) => {
        this.finalSelectedCatDescs = data;
        this.finalSelectedCatDescs.forEach(element => {
          element.id = element.category.id;
        });
      },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
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
  getParentCategoryDescriptions() {
    this.depth = 0;
    this.categories = [];
    this.appService.getObjects('/service/catalog/categorydescriptions/'
      + this.appService.appInfoStorage.language.id + '/' + this.productId)
      .subscribe((data: CategoryDescription[]) => {
        this.categories[this.depth] = data;
        this.depth++;
        this.categories[this.depth] = [];
        setTimeout(() => {
          this.categories.splice(this.depth);
        }, 5);
      },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
  }

  categorySelected(selectedCatDesc: CategoryDescription, indexOfElement: number) {
    const indexIncrement = indexOfElement + 1;
    this.categories.splice(indexIncrement);
    this.selectedCatDescs.splice(indexIncrement);
    this.depth = indexIncrement;

    if (this.selectedCatDescs[indexOfElement].category.childCount > 0) {
      this.appService.getObjects('/service/catalog/categorydescriptions/' + this.appService.appInfoStorage.language.id
        + '/' + this.selectedCatDescs[indexOfElement].category.id + '/' + this.productId)
        .subscribe((data: CategoryDescription[]) => {
          this.categories[this.depth] = data;
          this.depth++;
          this.categories[this.depth] = [];

          setTimeout(() => {
            this.categories.splice(this.depth);
          }, 5);
        },
          error => console.log(error),
          () => console.log('Get all CategoryDescription complete'));
    } else {
      this.getProducts(this.selectedCatDescs[indexOfElement]);
    }
  }

  getProducts(cat: CategoryDescription) {
    console.log(cat);
    console.log(this.selectedStore);
    console.log(this.appService.appInfoStorage.language);
    this.appService.getObjects('/service/catalog/getProductsForCategoryForSale/' + this.appService.appInfoStorage.language.id
      + '/' + cat.category.id + '/' + this.selectedStore.id)
      .subscribe((data: ProductDescription[]) => {
        this.products = data;
        this.stepper.selectedIndex = 2;
        const result = this.filterData(data);
        if (result.data.length === 0) {
          // this.properties.length = 0;
          this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
          this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
            this.message = res['MESSAGE.NO_RESULT_FOUND'];
          });
        }
        this.dataSource = new MatTableDataSource(result.data);
        // console.log('These are the products');
        // console.log(this.dataSource.filteredData);
        this.pagination = result.pagination;
        this.message = null;

      },
        error => console.log(error),
        () => console.log('Get all getProductsForCategoryForSale complete'));
  }


  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }

  public searchClicked(data: string) {
    this.applyFilter(data);
  }

  selectForSaleProduct($event) {
    this.productDesc = $event;
    this.productStore = new ProductToStore();
    this.stepper.selectedIndex = 3;
  }

  sell() {
    this.messages = '';
    this.errors = '';
    this.productStore.product = this.productDesc.product;
    this.productStore.store = this.selectedStore;
    this.productStore.modifiedBy = +this.appService.tokenStorage.getUserId();
    this.productStore.status = (this.productStore.status == null
      || this.productStore.status.toString() === 'false'
      || this.productStore.status.toString() === '0') ? 0 : 1;
    this.appService.save(this.productStore, 'ProductStore')
      .subscribe(result => {
        if (result.id > 0) {
          if (result.id > 0) {
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        }
      });

  }

}