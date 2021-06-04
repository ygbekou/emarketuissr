import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, StoreMenu, MenuSearchCriteria, MenuDescription, ProductStoreMenu, ProductToStore, Product } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-store-menu',
  templateUrl: './StoreMenu.component.html',
  styleUrls: ['./StoreMenus.component.scss']
})
export class StoreMenuComponent  extends BaseComponent implements OnInit, AfterViewInit {

  aProductColumns: string[] = ['image', 'productName', 'actions'];
  aProductDatasource: MatTableDataSource<ProductToStore>;
  @ViewChild('aProductPaginator', { static: true }) aProductPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) aProductSort: MatSort;

  sProductColumns: string[] = ['image', 'productName', 'actions'];
  sProductDatasource: MatTableDataSource<ProductStoreMenu>;
  @ViewChild('sProductPaginator', { static: true }) sProductPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sProductSort: MatSort;

  messages = '';
  storeMenu: StoreMenu = new StoreMenu();
  searchCriteria: MenuSearchCriteria = new MenuSearchCriteria();
  menuDescriptions: MenuDescription[] = [];

  currentOption: string;
  menuOptions: MenuDescription[];
  filteredMenuOptions: MenuDescription[];

  storeProductMenu: ProductStoreMenu = new ProductStoreMenu();

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Input() store = new Store();
  @Output() storeMenuSaveEvent = new EventEmitter<any>();

  selection;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
      super(translate);
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.storeMenu.id = params.id;
        this.clear();
        this.getStoreMenu(params.id);
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });

    this.aProductDatasource = new MatTableDataSource<ProductToStore>([]);

  }

  ngAfterViewInit() {
    this.aProductDatasource.paginator = this.aProductPaginator;

    this.sProductDatasource = new MatTableDataSource([]);
    this.sProductDatasource.paginator = this.sProductPaginator;
  }

  clear() {
    this.messages = '';
    this.storeMenu = new StoreMenu();
    this.currentOption = '';
  }

  getStoreMenuUnassignedProducts() {
    this.appService.saveWithUrl('/service/catalog/getStoreMenuUnassignedProductStores/',
      {
        storeId: this.store.id,
        storeMenuId: this.storeMenu.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: ProductToStore[]) => {
        this.aProductDatasource = new MatTableDataSource(data);
        this.aProductDatasource.paginator = this.aProductPaginator;
        this.aProductDatasource.sort = this.aProductSort;

      },
        error => console.log(error),
        () => console.log('Get all store menu unassigned products complete'));
  }


  getStoreMenu(storeMenu: StoreMenu) {
    this.messages = '';
    if (storeMenu && storeMenu.id > 0) {
      // this.getStoreIngredientInventory(storeMenu.id);
      this.appService.getOneWithChildsAndFiles(storeMenu.id, 'StoreMenu')
        .subscribe(result => {
          if (result.id > 0) {
            this.storeMenu = result;
            this.storeMenu.menuName = storeMenu.menu.name;
            this.getStoreMenuUnassignedProducts();
            this.getStoreMenuProducts();
          } else {
            this.storeMenu = new StoreMenu();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      this.clear();
    }
  }


  getStoreUnassignedMenus() {
    this.searchCriteria.storeId = this.store.id;
    this.searchCriteria.languageId = this.appService.appInfoStorage.language.id;

    this.appService.saveWithUrl('/service/catalog/getStoreUnassignedMenus', this.searchCriteria)
      .subscribe((data: any[]) => {
        this.menuDescriptions = data;

        this.menuOptions = data;
          this.filteredMenuOptions = data;
      },
        error => console.log(error),
        () => console.log('Get menus complete'));

  }

  getStoreMenuProducts() {

      this.appService.saveWithUrl('/service/catalog/getProductStoreMenus',
      {
        storeId: this.storeMenu.store.id,
        storeMenuId: this.storeMenu.id,
        languageId: this.appService.appInfoStorage.language.id
      })
        .subscribe((data: any[]) => {
          this.sProductDatasource = new MatTableDataSource(data);
          this.sProductDatasource.paginator = this.sProductPaginator;
          this.sProductDatasource.sort = this.sProductSort;
        },
          error => console.log(error),
          () => console.log('Get store menu products complete'));

  }



  filterOptions(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
         this.filteredMenuOptions = this.menuOptions
          .filter(menuDesc => menuDesc.name.toLowerCase().startsWith(filterValue));
      } else {
         this.filteredMenuOptions = this.menuOptions;
      }
   }

   save() {
    this.messages = '';
    this.storeMenu.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (!this.storeMenu.store.id ) {
      this.storeMenu.store.id = this.store.id;
    }
    this.currentOption = this.storeMenu.menuName;

    this.setToggleValues();

    this.appService.save(this.storeMenu, 'StoreMenu')
      .subscribe((data: StoreMenu) => {
        this.processResult(data, this.storeMenu, null);
        this.storeMenu = data;
        this.storeMenu.storeName = this.store.name;
        this.storeMenu.menuName = this.currentOption;
        this.storeMenuSaveEvent.emit(this.storeMenu);
      },
        error => console.log(error),
        () => console.log('Save StoreMenu complete'));
  }

  validateSelectedMenu() {

    if (typeof(this.storeMenu.menuName) === 'string') {
      const index = this.menuOptions.findIndex(x => x.name === this.storeMenu.menuName);
      if (index === -1) {
        return false;
      } else {
        this.storeMenu.menu = this.menuOptions[index].menu;
      }
    }

    if (!this.storeMenu.menu || !this.storeMenu.menu.id) {
      return false;
    }

    return true;
  }

  setToggleValues() {
    this.storeMenu.status = (this.storeMenu.status == null
          || this.storeMenu.status.toString() === 'false'
          || this.storeMenu.status.toString() === '0') ? 0 : 1;
  }

  setSelectedMenu(menuDesc: MenuDescription) {
    console.log(menuDesc);
     this.storeMenu.menu = menuDesc.menu;
  }

  isEmpty(value: string): boolean {'';
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }


  saveProductStoreMenu(productStore: ProductToStore) {
      const productStoreMenu = new ProductStoreMenu();
      const oldProductName = productStore.productName;
      const oldProductImage = productStore.image;
      productStoreMenu.productStoreId = productStore.id;
      productStoreMenu.storeMenuId = this.storeMenu.id;
      productStoreMenu.menu = this.storeMenu.menu;
      productStoreMenu.productId = productStore.product.id;
      productStoreMenu.storeId = productStore.store.id;

      this.appService.saveWithUrl('/service/crud/ProductStoreMenu/save/', productStoreMenu)
         .subscribe((data: ProductStoreMenu) => {
            this.processResult(data, productStoreMenu, null);
            productStoreMenu.id = data.id;
            productStoreMenu.productName = oldProductName;
            productStoreMenu.image = oldProductImage;
            productStoreMenu.product = new Product();
            productStoreMenu.product.id = productStoreMenu.productId;
            this.updateDatasourceData(this.sProductDatasource, this.sProductPaginator, this.sProductSort, productStoreMenu);
            this.processDataSourceDeleteResult({result: 'SUCCESS'}, this.messages, productStore, this.aProductDatasource);
            this.aProductDatasource.data = Array.from(this.aProductDatasource.data);
         },
            error => console.log(error),
            () => console.log('Save selected product store menu complete'));

   }

   public deleteProductStoreMenu(productStoreMenu: ProductStoreMenu, index: number) {

      this.messages = '';

      const productStore = new ProductToStore();
      productStore.id = productStoreMenu.productStoreId;
      productStore.productName = productStoreMenu.productName;
      productStore.product = new Product();
      productStore.product.id = productStoreMenu.product.id;
      productStore.image = productStoreMenu.image;
      productStore.store = new Store();
      productStore.store.id = productStoreMenu.storeId;

      this.appService.delete(productStoreMenu.id, 'ProductStoreMenu')
         .subscribe(data => {

            this.updateDatasourceData(this.aProductDatasource, this.aProductPaginator, this.aProductSort, productStore);
            this.processDataSourceDeleteResult(data, this.messages, productStoreMenu, this.sProductDatasource);
            this.sProductDatasource.data = Array.from(this.sProductDatasource.data);

         });
   }

  public applyAvailableProductFilter(filterValue: string) {
    this.aProductDatasource.filter = filterValue.trim().toLowerCase();
    if (this.aProductDatasource.paginator) {
      this.aProductDatasource.paginator.firstPage();
    }
  }

  public applySelectedProductFilter(filterValue: string) {
    this.sProductDatasource.filter = filterValue.trim().toLowerCase();
    if (this.sProductDatasource.paginator) {
      this.sProductDatasource.paginator.firstPage();
    }
  }

}
