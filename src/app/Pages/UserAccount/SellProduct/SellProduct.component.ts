import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CategoryDescription, ProductDescription, Product, Store,
  Pagination, ProductToStore, SearchCriteria, StoreSearchCriteria
} from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatStepper, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-sell-product',
  templateUrl: './SellProduct.component.html',
  styleUrls: ['./SellProduct.component.scss']
})
export class SellProductComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
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
  currentFilteredProducts: ProductDescription[] = [];
  productSearchCriteria: SearchCriteria = new SearchCriteria();

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

  formData = new FormData();
  picture: any[] = [];
  justSubmitted = false;
  saving = false;

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
    this.saving = false;
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

  private getStores() {
    const storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
    storeSearchCriteria.status = 1;
    storeSearchCriteria.aprvStatus = 1;
    storeSearchCriteria.userId = Number(this.appService.tokenStorage.getUserId());
    console.log(storeSearchCriteria);
    this.appService.saveWithUrl('/service/catalog/stores', storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
        if (this.stores.length === 1) {
          this.selectedStore = this.stores[0];
          this.stepper.selectedIndex = 1;
        }
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
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

  categorySelected(indexOfElement: number) {
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
        this.currentFilteredProducts = undefined;
        this.products = data;
        this.stepper.selectedIndex = 2;
        this.createDatasource(data);

      },
        error => console.log(error),
        () => console.log('Get all getProductsForCategoryForSale complete'));
  }

  createDatasource(listData) {
    this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
    this.message = null;
    const result = this.filterData(listData);
    if (result.data.length === 0) {
      this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
      this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
        this.message = res['MESSAGE.NO_RESULT_FOUND'];
      });
    }

    this.dataSource = new MatTableDataSource(result.data);
    this.pagination = result.pagination;
  }

  filterProductDataBySearchCriteria(searchCriteria) {
    const filteredData = this.products.filter(function (data) {
      let found = true;
      if (searchCriteria.text) {
        if (!(data.name.toLowerCase().indexOf(searchCriteria.text.toLowerCase()) > -1)) {
          found = false;
        }
      }
      console.log('Filter Predicate called.');
      return found;
    });

    this.currentFilteredProducts = filteredData;
    return filteredData;
  }

  public searchClicked(data: string) {
    this.productSearchCriteria.text = data.trim().toLowerCase();
    this.firstPagePagination();
    this.createDatasource(this.filterProductDataBySearchCriteria(this.productSearchCriteria));
    this.resetPagination();

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

  selectForSaleProduct($event) {
    this.productDesc = $event;
    this.productStore = new ProductToStore();
    this.productStore.dateAvailable = new Date();
    this.productStore.minimum = 0;
    this.productStore.quantity = 0;
    this.productStore.maxQty = 0;
    this.productStore.sortOrder = 0;
    this.productStore.availableOnline = 1;
    this.productStore.price = this.productDesc.product.price ?
      this.productDesc.product.price : 0;
    this.productStore.vipPrice = this.productDesc.product.price ?
      this.productDesc.product.price : 0;
    this.productStore.shippingWeight = this.productDesc.product.shippingWeight ?
      this.productDesc.product.shippingWeight : 0;
    this.productStore.points = Number(
      this.productDesc.product.price ?
        this.productDesc.product.price.toFixed(0) : 0);
    this.productStore.status = 1;
    this.stepper.selectedIndex = 3;
  }

  quickSell($event) {
    this.messages = '';
    this.errors = '';
    this.productDesc = $event;
    this.productStore = new ProductToStore();
    this.productStore.dateAvailable = new Date();
    this.productStore.minimum = 0;
    this.productStore.maxQty = 0;
    this.productStore.quantity = 0;
    this.productStore.sortOrder = 0;
    this.productStore.availableOnline = 1;
    this.productStore.price = this.productDesc.product.price ?
      this.productDesc.product.price : 0;
    this.productStore.vipPrice = this.productDesc.product.price ?
      this.productDesc.product.price : 0;
    this.productStore.shippingWeight = this.productDesc.product.shippingWeight ?
      this.productDesc.product.shippingWeight : 0;
    this.productStore.points = Number(
      this.productDesc.product.price ?
        this.productDesc.product.price.toFixed(0) : 0);
    this.productStore.status = 1;
    // this.stepper.selectedIndex = 3;
    this.productStore.product = this.productDesc.product;
    this.productStore.store = this.selectedStore;
    this.productStore.modifiedBy = +this.appService.tokenStorage.getUserId();
    console.log(this.productStore);
    // const index: number = this.products.indexOf(this.productDesc);
    this.appService.saveWithUrl('/service/catalog/quickSellProduct', this.productStore)
      .subscribe(result => {
        if (result.id > 0) {
          if (result.id > 0) {
            const index: number = this.dataSource.data.indexOf(this.productDesc);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
              this.dataSource = new MatTableDataSource<ProductDescription>(this.dataSource.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
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

  sell() {
    this.messages = '';
    this.errors = '';
    this.productStore.product = this.productDesc.product;
    this.productStore.store = this.selectedStore;
    this.productStore.availableOnline = 1;
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


  importProducts() { 
    console.log('Import product started ...');
    if (this.justSubmitted) {
      this.justSubmitted = false;
      console.log('Just submitted');
      return;
    }
    this.saving = true;
    this.messages = '';

    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }


    this.appService.downloadWithFileUsingUrl('/service/catalog/importProducts', {
      storeId: this.selectedStore.id,
      modifiedBy: +this.appService.tokenStorage.getUserId()
    }, this.formData)
      .subscribe((data: any) => {

        this.saving = false; 

        const blob = new Blob([data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        saveAs(blob, 'productImportResult.xlsx');

        this.translate.get(['MESSAGE.PRODUCTS_IMPORT_COMPLETED']).subscribe(res => {
          this.messages = res['MESSAGE.PRODUCTS_IMPORT_COMPLETED'];
        });

        //this.picture = [];
      }, error => {
        this.saving = false; 
        console.log(error);
      }, () => {
        this.saving = false;
        console.log('Save Transaction complete');
      }
      );

  }

}
