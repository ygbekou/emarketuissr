import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  CategoryDescription, Product, Store, Pagination, ProductToStore, Marketing, MarketingProduct,
  ProductDescVO, ProductSearchCriteria, ProductListVO, SearchCriteria
} from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatStepper, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-market-product',
  templateUrl: './MarketingProduct.component.html',
  styleUrls: ['./MarketingProduct.component.scss']
})
export class MarketingProductComponent extends BaseComponent implements OnInit {

  @Input() marketing: Marketing;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: true }) sort2: MatSort;

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
  prodDescVO: ProductDescVO = new ProductDescVO();
  selectedStore: Store = new Store();
  options = ['One', 'Two'];
  filteredOptions: Observable<string[]>;
  currentOption: string;

  products: ProductDescVO[] = [];
  currentFilteredProducts: ProductDescVO[] = [];
  productSearchCriteria: SearchCriteria = new SearchCriteria();

  selectedProducts: ProductDescVO[] = [];
  currentFilteredSelectedProducts: ProductDescVO[] = [];
  productSearchCriteria2: SearchCriteria = new SearchCriteria();


  stores: Store[] = [];
  dataSource: MatTableDataSource<ProductDescVO>;
  dataSource2: MatTableDataSource<ProductDescVO>;

  productStore: ProductToStore = new ProductToStore();
  marketingProduct: MarketingProduct = new MarketingProduct();
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
  public pagination2: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
  public message: string;
  public errors: string;
  public watcher: Subscription;

  constructor(public appService: AppService,
    public translate: TranslateService,
    public mediaObserver: MediaObserver) {
    super(translate);
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

    for (let counter = 0; counter < 10; counter++) {
      console.log('for loop executed : ' + counter);
      this.categories[counter] = [];
    }

    setTimeout(() => {
      this.categories.splice(1);
    }, 1000);

    this.getParentCategoryDescriptions();
    this.getProductCategoryDescriptions();
    this.getSelectedProducts();
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
      parameters.push('e.aprvStatus = |approveStatus|1|Integer');
      parameters.push('e.status = |pId|1|Integer');
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
    this.appService.saveWithUrl('/service/catalog/getProductsOnSale/',
      new ProductSearchCriteria(
        this.appService.appInfoStorage.language.id, this.selectedStore.id,
        0, cat.category.id, '0', 0, 0, 0, 0
      ))
      .subscribe((productListVO: ProductListVO) => {

        this.currentFilteredProducts = undefined;
        this.products = productListVO.productDescVOs;
        this.stepper.selectedIndex = 2;
        this.createDatasource(productListVO.productDescVOs, 1);

      },
        error => console.log(error),
        () => console.log('Get all getProductsForCategoryForSale complete'));
  }

  createDatasource(listData, opt: number) {
    this.message = null;
    const result = this.filterData(listData, opt);
    if (result.data.length === 0) {
        this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
          this.message = res['MESSAGE.NO_RESULT_FOUND'];
        });
    }

    if (opt === 1) {
      this.dataSource = new MatTableDataSource(result.data);
      this.pagination = result.pagination;
    } else {
      this.dataSource2 = new MatTableDataSource(result.data);
      this.pagination2 = result.pagination;
    }
  }

  filterProductDataBySearchCriteria(searchCriteria) {
    const filteredData = this.products.filter(function (data) {
        let found = true;
        if (searchCriteria.text) {
          if (!(data.name.toLowerCase().indexOf(searchCriteria.text.toLowerCase()) > -1)) {
              found = false;
          }
        }
        return found;
    });

    this.currentFilteredProducts = filteredData;
    return filteredData;
  }

  filterProductDataBySearchCriteria2(searchCriteria) {
    const filteredData = this.selectedProducts.filter(function (data) {
        let found = true;
        if (searchCriteria.text) {
          if (!(data.name.toLowerCase().indexOf(searchCriteria.text.toLowerCase()) > -1)) {
              found = false;
          }
        }
        return found;
    });

    this.currentFilteredSelectedProducts = filteredData;
    return filteredData;
  }


  public searchClicked(data: string, opt: number) {
    this.firstPagePagination(opt);
    if (opt === 1) {
      this.productSearchCriteria.text = data.trim().toLowerCase();
      this.createDatasource(this.filterProductDataBySearchCriteria(this.productSearchCriteria), opt);
    } else {
      this.productSearchCriteria2.text = data.trim().toLowerCase();
      this.createDatasource(this.filterProductDataBySearchCriteria2(this.productSearchCriteria2), opt);
    }
    this.resetPagination(opt);

  }



  getSelectedProducts() {
    this.appService.saveWithUrl('/service/catalog/getProductsOnSale/',
      new ProductSearchCriteria(
        this.appService.appInfoStorage.language.id, 0, this.marketing.id, 0, '0', 0, 0, 0, 0
      ))
      .subscribe((data: any) => {
        this.selectedProducts = data.productDescVOs;
        if (this.selectedProducts && this.selectedProducts.length > 0) {
          // console.log(data);
          const result = this.filterData(this.selectedProducts, 2);
          if (result.data.length === 0) {
            // this.properties.length = 0;
            this.pagination2 = new Pagination(1, this.count, null, 2, 0, 0);
            this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
              this.message = res['MESSAGE.NO_RESULT_FOUND'];
            });
          }
          // console.log(result.data);
          this.dataSource2 = new MatTableDataSource(result.data);
          this.pagination2 = result.pagination;
          this.message = null;
        }
      },
        error => console.log(error),
        () => console.log('Get all getProductsOnSale complete'));
  }



  public applyFilter(filterValue: string, opt: number) {
    if (opt === 1) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.dataSource2.filter = filterValue.trim().toLowerCase();
      if (this.dataSource2.paginator) {
        this.dataSource2.paginator.firstPage();
      }
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

  public changeCount(count, opt: number) {
    this.count = count;
    // this.products.length = 0;
    this.resetPagination(opt);
    this.filterProducts(opt);
  }
  public changeSorting(sort, opt: number) {
    if (opt === 1) {
      this.sort = sort;
    } else {
      this.sort2 = sort;
    }
    this.filterProducts(opt);
  }
  public changeViewType(obj, opt: number) {
    if (obj.viewType === 'list') {
      this.changeCount(1, opt);
    } else if (this.count === 1) {
      this.changeCount(6, opt);
    }
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e, opt: number) {
    if (opt === 1) {
      this.pagination.page = e.pageIndex + 1;
    } else {
      this.pagination2.page = e.pageIndex + 1;
    }

    this.filterProducts(opt);
    // window.scrollTo(0, 0);
  }

  public resetPagination(opt: number) {
    if (opt === 1) {
      this.firstPagePagination(opt);
      this.pagination.totalPages = Math.ceil(this.pagination.total / this.count);
      this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);

    } else {
      this.firstPagePagination(opt);
      this.pagination2.totalPages = Math.ceil(this.pagination2.total / this.count);
      this.pagination2 = new Pagination(1, this.count, null, null, this.pagination2.total, this.pagination2.totalPages);

    }
  }

  public firstPagePagination(opt: number) {
    if (opt === 1) {
      if (this.paginator) {
          this.paginator.pageIndex = 0;
          this.paginator.firstPage();
      }
    } else {
      if (this.paginator2) {
          this.paginator2.pageIndex = 0;
          this.paginator2.firstPage();
      }
    }
  }


  public filterProducts(opt: number) {
    let result = null;
    if (opt === 1) {
      result = this.filterData(this.products, opt);
    } else {
      result = this.filterData(this.selectedProducts, opt);
    }
    if (result.data.length === 0) {
      // this.properties.length = 0;
      if (opt === 1) {
        this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
      } else {
        this.pagination2 = new Pagination(1, this.count, null, 2, 0, 0);
      }

      this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
        this.message = res['MESSAGE.NO_RESULT_FOUND'];
      });
    }
    if (opt === 1) {
      this.dataSource = new MatTableDataSource(result.data);
      this.pagination = result.pagination;
    } else {
      this.dataSource2 = new MatTableDataSource(result.data);
      this.pagination2 = result.pagination;
    }

    this.message = null;
  }


  public filterData(data, opt: number) {
    if (opt === 1) {
      return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);

    } else {
      return this.appService.filterData(data, this.searchFields, this.sort2, this.pagination2.page, this.pagination2.perPage);
    }
  }


  selectForMarketing($event) {
    this.prodDescVO = $event;
    this.marketingProduct = new MarketingProduct();
    this.stepper.selectedIndex = 3;
  }

  removeProduct($event) {
    console.log($event);
    this.appService.delete($event.product.ptsId, 'com.softenza.emarket.model.MarketingProduct')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          this.getSelectedProducts();
        }
      });
  }

  sell() {
    this.messages = '';
    this.errors = '';
    this.marketingProduct.product = new Product();
    this.marketingProduct.product.id = this.prodDescVO.product.id;
    this.marketingProduct.store = this.selectedStore;
    this.marketingProduct.marketing = this.marketing;
    this.marketingProduct.modifiedBy = +this.appService.tokenStorage.getUserId();
    this.marketingProduct.status = (this.marketingProduct.status == null
      || this.marketingProduct.status.toString() === 'false'
      || this.marketingProduct.status.toString() === '0') ? 0 : 1;
    this.appService.save(this.marketingProduct, 'MarketingProduct')
      .subscribe(result => {
        if (result.id > 0) {
          if (result.id > 0) {
            this.selectedProducts.push(this.prodDescVO);
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
