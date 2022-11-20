import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CategoryDescription, ProductDescription, Product, Store, Pagination,
  ProductToStore, ProductDiscount, ProductSearchCriteria, ProductListVO,
  ProductDescVO, SearchCriteria, StoreSearchCriteria, RunReportVO, Parameter, ProductStoreIngredient, GenericResponse
} from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatStepper, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ProductStoreOptionsComponent } from 'src/app/AdminPanel/Products/ProductStoreOptions/ProductStoreOptions.component';
import { Constants } from 'src/app/app.constants';
import { ProductStoreIngredientsComponent } from 'src/app/AdminPanel/Products/ProductStoreIngredients/ProductStoreIngredients.component';
import { ComboProductComponent } from 'src/app/AdminPanel/Products/ProductLink/ComboProduct.component';

@Component({
  selector: 'app-my-products',
  templateUrl: './MyProducts.component.html',
  styleUrls: ['./MyProducts.component.scss']
})
export class MyProductsComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  displayedColumns: string[] = ['priority', 'quantity', 'price', 'percentage', 'dateStart', 'dateEnd', 'hourStart', 'hourEnd', 'status', 'actions'];
  productDiscountDatasource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) productDiscountPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) productDiscountSort: MatSort;

  @ViewChild('ProductStoreOptionsComponent', { static: false }) prdStoreOptView: ProductStoreOptionsComponent;
  @ViewChild(ProductStoreIngredientsComponent, { static: false }) prdStoreIngredientsView: ProductStoreIngredientsComponent;
  @ViewChild(ComboProductComponent, { static: false }) comboProductView: ComboProductComponent;
  @ViewChild('copyOptionsProductStoreOptionsComponent', { static: false }) copyPrdStoreOptView: ProductStoreOptionsComponent;

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

  products: ProductDescVO[] = [];
  currentFilteredProducts: ProductDescVO[] = [];
  productSearchCriteria: SearchCriteria = new SearchCriteria();

  copyOptionsProducts: ProductDescVO[] = [];
  copyOptionsStore: Store = new Store();
  copyOptionsPrdStore: ProductToStore = new ProductToStore();

  // This is used to copy options.
  selectedPrd: ProductDescVO;

  stores: Store[] = [];
  dataSource: MatTableDataSource<ProductDescVO>;
  productStore: ProductToStore = new ProductToStore();
  originalQty: number;
  public sidenavOpen = true;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 48;
  public searchFields: any;
  public removedSearchField: string;
  public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
  public message: string;
  public productDiscountMessage: string;
  public errors: string;
  public productDiscountErrors: string;
  public watcher: Subscription;
  public allInvnReport = '';
  public lowInvnReport = '';
  public reportRun = false;
  public disablePrice: boolean;
  public disablePercentage: boolean;

  popupResponse: any;

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
      this.categories[counter] = [];
    }

    setTimeout(() => {
      this.categories.splice(1);
    }, 1000);
  }

  getStoreProducts(store: Store) {
    this.selectedStore = store;
    this.stepper.selectedIndex = 1;
    this.getProducts(store);
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
          this.getProducts(this.stores[0]);
        }
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }



  getProducts(store: Store) {
    this.appService.saveWithUrl('/service/catalog/getProductsOnSale/',
      new ProductSearchCriteria(this.appService.appInfoStorage.language.id,
        store.id, 0, 0, '0', 0, 0, 0, 0, 0, 1))
      .subscribe((data: ProductListVO) => {
        this.currentFilteredProducts = undefined;
        this.products = data.productDescVOs;
        this.stepper.selectedIndex = 1;
        this.createDatasource(data.productDescVOs);

      },
        error => console.log(error),
        () => console.log('Get all getProductsForCategoryForSale complete'));
  }

  getCopyOptionProducts(store: Store) {
    this.appService.saveWithUrl('/service/catalog/getProductsOnSale/',
      new ProductSearchCriteria(this.appService.appInfoStorage.language.id,
        store.id, 0, 0, '0', 0, 0, 0, 0, 0, 1))
      .subscribe((data: ProductListVO) => {
        this.copyOptionsProducts = data.productDescVOs;

      },
        error => console.log(error),
        () => console.log('Get all store product complete'));
  }


  createDatasource(listData) {
    console.log('createDatasource');
    this.message = null;
    this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
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
    console.log('changeCount');
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

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  selectForSaleProduct($event) {
    this.productDesc = $event;
    this.prdStoreOptView.reset();
    this.appService.getObject('/service/catalog/getProductToStore/' + this.selectedStore.id + '/' + this.productDesc.product.id)
      .subscribe((data: ProductToStore) => {
        if (data !== null && data.id > 0) {
          this.productStore = data;
          this.originalQty = data.quantity;
          this.prdStoreOptView.getProductToStoreSelectedOptions(data.id);
          this.prdStoreOptView.getProductToStoreUnselectedOptions(data.id);
        } else {
          this.productStore = new ProductToStore();
          this.productStore.availableOnline = this.selectedStore.onlineStore;
          this.productStore.productDiscounts.push(new ProductDiscount());
          this.productStore.productStoreIngredients.push(new ProductStoreIngredient());
        }
        this.productDiscountDatasource = new MatTableDataSource(this.productStore.productDiscounts);
        this.productDiscountDatasource.paginator = this.productDiscountPaginator;
        this.productDiscountDatasource.sort = this.productDiscountSort;
        this.prdStoreIngredientsView.productToStoreId = this.productStore.id;
        this.prdStoreIngredientsView.storeId = this.productStore.store.id;
        this.prdStoreIngredientsView.resetDatasource(this.productStore.productStoreIngredients);

        this.comboProductView.productToStore = this.productStore;
        this.comboProductView.storeId = this.productStore.store.id;
        this.comboProductView.getProductParentDescriptions();

      },
        error => console.log(error),
        () => console.log('Get ProductToStore complete for store=' + this.selectedStore.id + ' and ' + this.productDesc.product.id));
    this.stepper.selectedIndex = 2;
  }

  public getCommentPopupResponse(response: any, value: any) {
    if (response) {
      console.log('Value returned from comment popup... ');
      console.log(value);
      this.productStore.quantityComment = value;
    }
  }


  sell() {
    this.messages = '';
    this.errors = '';

    if (this.selectedStore.reasonRequired === 1 && this.originalQty !== this.productStore.quantity) {
      this.appService.commentPopup(this.productStore).
        subscribe(res => {
          this.popupResponse = res;
          if (res.shouldSave && this.productStore.quantityComment && this.productStore.quantityComment.trim().length > 0) {
            this.productStore.shouldPerformExtraUpdate = true;
            this.productStore.diffQty = this.productStore.quantity - this.originalQty;
            this.proceedSell();
          }
        },
          err => console.log(err),
          () => this.getCommentPopupResponse(this.popupResponse, this.productStore)
        );
    } else {
      this.proceedSell();
    }

  }


  proceedSell() {

    this.productStore.product = new Product();
    this.productStore.product.id = this.productDesc.product.id;
    this.productStore.store = this.selectedStore;
    this.productStore.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.productStore.status = (this.productStore.status == null
      || this.productStore.status.toString() === 'false'
      || this.productStore.status.toString() === '0') ? 0 : 1;
    this.productStore.availableOnline = (this.productStore.availableOnline == null
      || this.productStore.availableOnline.toString() === 'false'
      || this.productStore.availableOnline.toString() === '0') ? 0 : 1;

    this.productStore.subtract = (this.productStore.subtract == null
      || this.productStore.subtract.toString() === 'false'
      || this.productStore.subtract.toString() === '0') ? 0 : 1;

    this.productStore.allowNegInvn = (this.productStore.allowNegInvn == null
      || this.productStore.allowNegInvn.toString() === 'false'
      || this.productStore.allowNegInvn.toString() === '0') ? 0 : 1;

    console.log(this.productStore);
    this.appService.save(this.productStore, 'ProductStore')
      .subscribe(result => {
        if (result.id > 0) {
          this.originalQty = this.productStore.quantity;
          this.productStore.quantityComment = '';
          this.productStore.shouldPerformExtraUpdate = false;
          this.productStore.diffQty = 0;
          this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
            this.messages = res['MESSAGE.SAVE_SUCCESS'];
          });
        } else {
          this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
          });
        }
      });

  }


  addDiscount() {
    this.productDiscountDatasource.data.unshift(new ProductDiscount());
    this.productDiscountDatasource = new MatTableDataSource(this.productDiscountDatasource.data);
    this.productDiscountDatasource.paginator = this.productDiscountPaginator;
    this.productDiscountDatasource.sort = this.productDiscountSort;

  }

  public deleteProductDiscount(productDiscount: ProductDiscount, index: number) {

    if (productDiscount.id === undefined || productDiscount.id === null) {
      this.productDiscountDatasource = this.resetDatasource(this.productDiscountDatasource, index);
      return;
    }

    this.appService.delete(productDiscount.id, 'ProductDiscount')
      .subscribe(data => {
        this.productDiscountDatasource = this.processDataSourceDeleteResult(data,
          this.messages, productDiscount, this.productDiscountDatasource);
      });
  }


  saveProductDiscount(productDiscount: ProductDiscount) {
    this.messages = '';
    this.errors = '';
    this.setToggleValues(productDiscount);

    if (!this.validateProductDiscount(productDiscount)) {
      return;
    }
    productDiscount.storeId = this.selectedStore.id;
    productDiscount.ptsId = this.productStore.id;
    productDiscount.modifiedBy = +this.appService.tokenStorage.getUserId();
    this.appService.save(productDiscount, 'ProducDiscount')
      .subscribe(result => {
        this.processResult(result, productDiscount, null);
      });

  }

  validateProductDiscount(productDiscount: ProductDiscount) {
    if (this.isBlank(productDiscount.priority) ||
      this.isBlank(productDiscount.dateStart) ||
      this.isBlank(productDiscount.dateEnd)) {
      this.translate.get(['VALIDATION.START_FIELD_REQUIRED', 'COMMON.ERROR']).subscribe(res => {
        this.errors = res['VALIDATION.START_FIELD_REQUIRED'];
      });
      return false;
    }

    if (this.isBlank(productDiscount.price) && this.isBlank(productDiscount.percentage)) {
      this.translate.get(['VALIDATION.PRICE_OR_PERCENT', 'COMMON.ERROR']).subscribe(res => {
        this.errors = res['VALIDATION.PRICE_OR_PERCENT'];
      });
      return false;
    }

    if ((this.isBlank(productDiscount.price) && !this.isBlank(productDiscount.quantity))
      || (!this.isBlank(productDiscount.price) && this.isBlank(productDiscount.quantity))
    ) {
      this.translate.get(['VALIDATION.PRICE_AND_QTY', 'COMMON.ERROR']).subscribe(res => {
        this.errors = res['VALIDATION.PRICE_AND_QTY'];
      });
      return false;
    }

    if (new Date(productDiscount.dateStart) > new Date(productDiscount.dateEnd)) {
      this.translate.get(['VALIDATION.BEGIN_G_END', 'COMMON.ERROR']).subscribe(res => {
        this.errors = res['VALIDATION.BEGIN_G_END'];
      });
      return false;
    }

    for (const pd of this.productStore.productDiscounts) {
      if (pd.priority === productDiscount.quantity
        && productDiscount.status === 1 && pd.status === 1) {
        this.translate.get(['VALIDATION.DUPLICATE_PRIORITY', 'COMMON.ERROR']).subscribe(res => {
          this.errors = res['VALIDATION.DUPLICATE_PRIORITY'];
        });
        return false;
      }
    }

    return true;
  }

  setToggleValues(productDiscount: ProductDiscount) {
    productDiscount.status = (!productDiscount.status
      || productDiscount.status === null
      || productDiscount.status.toString() === 'false'
      || productDiscount.status.toString() === '0') ? 0 : 1;
  }

  togglePrice(productDiscount: ProductDiscount) {
    productDiscount.price = undefined;
    productDiscount.quantity = undefined;
    productDiscount.disablePrice = !this.isBlank(productDiscount.percentage);
  }

  togglePercentage(productDiscount: ProductDiscount) {
    productDiscount.percentage = undefined;
    productDiscount.disablePercentage = !this.isBlank(productDiscount.price);
  }

  isBlank(value) {
    return value === undefined || value === null || value.toString() === '';
  }

  changeTab($event) {
    console.log('Tab changed');
    this.messages = '';
    this.prdStoreIngredientsView.getProductToStoreSelectedOptions(this.productStore.id);
    this.prdStoreIngredientsView.getProductStoreOptionValues(this.productStore.id, null);
  }

  runReport(type: number) {
    this.reportRun = false;
    this.allInvnReport = '';
    this.lowInvnReport = '';
    let qtyMax = 0;
    if (type === 1) { // all inventory
      qtyMax = 999999999;
    }

    const rep = new RunReportVO();
    rep.reportName = 'inventory';
    const parm1 = new Parameter('pStoreId', this.selectedStore.id + '');
    const parm2 = new Parameter('pLang', this.appService.appInfoStorage.language.code);
    const parm3 = new Parameter('pQtyMax', qtyMax + '');
    rep.parameters = [];
    rep.parameters.push(parm1, parm2, parm3);

    this.appService.saveWithUrl('/service/report/run/', rep)
      .subscribe((data: any) => {
        console.log(data);
        this.openInNewTab(Constants.webServer + '/assets/reports/' + data[0]);
        /*  if (type === 1) { // all inventory
           this.allInvnReport = Constants.webServer + '/assets/reports/' + data[0];
         } else {
           this.lowInvnReport = Constants.webServer + '/assets/reports/' + data[0];
         } */
      },
        error => console.log(error),
        () => console.log('Get ProductToStore complete for store=' + this.selectedStore.id + ' and ' + this.productDesc.product.id));

  }
  openInNewTab(url) {
    const win = window.open(url, '_blank');
    win.focus();
  }

   public deletePts(ptsId: number) {
      const message = 'Are you sure you want to delete this product from the store?';
      this.appService.confirmationPopup(message).
         subscribe(res => {this.popupResponse = res;},
                   err => console.log(err),
                   ()  => this.proceedDeletePts(this.popupResponse, ptsId)
                  );
   }

  proceedDeletePts(response, ptsId: number) {
    this.messages = '';
    this.errors = '';

    if (response) {
      this.appService.updateObject('/service/catalog/deleteProductFromStore/' + ptsId)
        .subscribe(async (data: GenericResponse) => {
        if (data.result === 'SUCCESS') {
          this.translate.get(['MESSAGE.DELETE_SUCCESS']).subscribe(res => {
            this.errors = res['MESSAGE.DELETE_SUCCESS'];
          });
          this.stepper.selectedIndex = 0;
          this.createDatasource([]);
        } else if (data.result === 'OBJECT_HAS_CHILD') {
          this.translate.get(['MESSAGE.OBJECT_HAS_CHILD']).subscribe(res => {
            this.errors = res['MESSAGE.OBJECT_HAS_CHILD'];
          });
        } else {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.DELETE_UNSUCCESS'];
          });
        }
      },
        (error) => console.log(error),
        () => console.log('closeTab complete'));
    }
  }


  productSelected(event) {
    setTimeout(() => {
      this.messages = '';
      this.errors = '';

      this.appService.getObject('/service/catalog/getProductToStore/' + this.copyOptionsStore.id + '/' + this.selectedPrd.product.id)
      .subscribe((data: ProductToStore) => {
        if (data !== null && data.id > 0) {
          this.copyOptionsPrdStore = data;

          this.copyPrdStoreOptView.getProductToStoreSelectedOptions(this.copyOptionsPrdStore.id);
        }
         },
        error => console.log(error),
        () => console.log('Get ProductToStore complete for store=' + this.selectedStore.id + ' and ' + this.productDesc.product.id));
    }, 500);
  }

  storeSelected(event) {

    setTimeout(() => {
      this.getCopyOptionProducts(this.copyOptionsStore);
    }, 500);
  }


   public copyOptionsFromPts() {
      const message = 'Are you sure you want to copy these options?';
      this.appService.confirmationPopup(message).
         subscribe(res => {this.popupResponse = res;},
                   err => console.log(err),
                   ()  => this.proceedCopyOptionsFromPts(this.popupResponse)
                  );
   }

  proceedCopyOptionsFromPts(response) {

    this.messages = '';
    this.errors = '';
    if (response) {
      this.appService.updateObject('/service/catalog/copyOptionsFromPts/'
      + this.copyOptionsStore.id + '/' + this.selectedPrd.product.id + '/'
      + this.productStore.id + '/' + this.appService.tokenStorage.getUserId())
        .subscribe(async (data: GenericResponse) => {
        if (data.result === 'SUCCESS') {
          this.translate.get(['MESSAGE.SAVE_SUCCESS']).subscribe(res => {
            this.errors = res['MESSAGE.SAVE_SUCCESS'];
          });
        } else {
          this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
          });
        }
      },
        (error) => console.log(error),
        () => console.log('Copy products complete'));
    }
  }
}
