import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, ProductToStore, ProductTransfer, StoreSearchCriteria, GenericResponse, StoreEmployee } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-product-transfer',
  templateUrl: './ProductTransfer.component.html',
  styleUrls: ['./Transfers.component.scss']
})
export class ProductTransferComponent extends BaseComponent implements OnInit, AfterViewInit {

  fromProductColumns: string[] = ['image', 'productName', 'qty', 'transferQty', 'actions'];
  fromProductDatasource: MatTableDataSource<ProductToStore>;
  @ViewChild('fromProductPaginator', { static: true }) fromProductPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) fromProductSort: MatSort;

  toProductColumns: string[] = ['image', 'productName', 'qty'];
  toProductDatasource: MatTableDataSource<ProductToStore>;
  @ViewChild('toProductPaginator', { static: true }) toProductPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) toProductSort: MatSort;

  productTransfer: ProductTransfer = new ProductTransfer();

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Output() productTransferEvent = new EventEmitter<any>();

  fromStore: Store = new Store();
  toStore: Store = new Store();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  savedProductStore: ProductToStore = new ProductToStore();
  comment: string;
  storeEmployee: StoreEmployee;

  addNew = false;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });

    this.getStores();

  }

  ngAfterViewInit() {
    this.fromProductDatasource = new MatTableDataSource<ProductToStore>([]);
    this.fromProductDatasource.paginator = this.fromProductPaginator;

    this.toProductDatasource = new MatTableDataSource([]);
    this.toProductDatasource.paginator = this.toProductPaginator;
  }

  clear() {
    this.messages = '';
  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  getStoreEmployee() {
    if (+this.appService.tokenStorage.getUserId() > 0) {
      const parameters: string[] = [];
      parameters.push('e.employee.id = |userId|' + this.appService.tokenStorage.getUserId() + '|Integer');
      parameters.push('e.store.id = |storeId|' + this.fromStore.id + '|Integer');
      this.appService.getAllByCriteria('StoreEmployee', parameters)
        .subscribe((data: StoreEmployee[]) => {
          if (data && data.length > 0) {
            this.storeEmployee = data[0];
            if (this.storeEmployee.canTransfer === 0) {
              this.fromProductColumns = ['image', 'productName', 'qty'];
            } else {
              this.fromProductColumns = ['image', 'productName', 'qty', 'transferQty', 'actions'];
            }
          }
        },
          error => console.log(error),
          () => console.log('Get store employee complete for storeId = ' + this.fromStore.id + ' userId = '
          + this.appService.tokenStorage.getUserId()));
    }
  }

  getFromProductStoreList() {
    this.appService.saveWithUrl('/service/catalog/getStoreMenuUnassignedProductStores/',
      {
        storeId: this.fromStore.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: ProductToStore[]) => {
          this.reinitializingDatasourceData(this.fromProductDatasource,
            this.fromProductPaginator, this.fromProductSort, data);
      },
        error => console.log(error),
        () => console.log('Get all from store products complete'));
  }

  getToProductStoreList() {
    this.appService.saveWithUrl('/service/catalog/getStoreMenuUnassignedProductStores/',
      {
        storeId: this.toStore.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: ProductToStore[]) => {
          this.reinitializingDatasourceData(this.toProductDatasource,
            this.toProductPaginator, this.toProductSort, data);
      },
        error => console.log(error),
        () => console.log('Get all to store products complete'));
  }

  fromStoreSelected(event) {
    setTimeout(() => {
      this.getStoreEmployee();
      this.getFromProductStoreList();
    }, 500);
  }

  toStoreSelected(event) {
    setTimeout(() => {
      this.getToProductStoreList();
    }, 500);
  }

  makeTransfer(fromPrdStore: ProductToStore) {
    this.messages = '';
    this.productTransfer = new ProductTransfer();
    this.productTransfer.modifiedBy = +this.appService.tokenStorage.getUserId();
    this.productTransfer.productId = fromPrdStore.product.id;
    this.productTransfer.fromPtsId = fromPrdStore.id;
    this.productTransfer.toStoreId = this.toStore.id;
    this.productTransfer.quantity = fromPrdStore.transferQty;
    this.productTransfer.comment = this.comment;

    this.appService.saveWithUrl('/service/catalog/transferProduct/', this.productTransfer)
      .subscribe((data: ProductToStore) => {
        this.processResult(data, this.savedProductStore, null);
        this.savedProductStore = data;

        if (this.savedProductStore.id > 0) {
          this.updateDatasourceData(this.toProductDatasource, this.toProductPaginator,
            this.toProductSort, this.savedProductStore);

          fromPrdStore.quantity -= fromPrdStore.transferQty;
          fromPrdStore.transferQty = undefined;
        } else {
          if (data.errors[0] === 'UNKNOWN_TRANSFER_PRODUCT') {
            this.translate.get(['VALIDATION.UNKNOWN_TRANSFER_PRODUCT']).subscribe(res => {
              this.messages = res['VALIDATION.UNKNOWN_TRANSFER_PRODUCT'];
            });
          }
        }
      },
      error => console.log(error),
      () => console.log('Product Transfer complete'));
  }


  setToggleValues() {

  }


  isEmpty(value: string): boolean {
    '';
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }

}
