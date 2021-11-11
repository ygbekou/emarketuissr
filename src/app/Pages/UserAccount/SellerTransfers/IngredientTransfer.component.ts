import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, StoreSearchCriteria, StoreIngredient, IngredientTransfer, StoreEmployee } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-ingredient-transfer',
  templateUrl: './IngredientTransfer.component.html',
  styleUrls: ['./Transfers.component.scss']
}) 
export class IngredientTransferComponent extends BaseComponent implements OnInit, AfterViewInit {

  fromIngredientColumns: string[] = ['image', 'ingredientName', 'qty', 'transferQty', 'actions'];
  fromIngredientDatasource: MatTableDataSource<StoreIngredient>;
  @ViewChild('fromIngredientPaginator', { static: true }) fromIngredientPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) fromIngredientSort: MatSort;

  toIngredientColumns: string[] = ['image', 'ingredientName', 'qty'];
  toIngredientDatasource: MatTableDataSource<StoreIngredient>;
  @ViewChild('toIngredientPaginator', { static: true }) toIngredientPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) toIngredientSort: MatSort;

  ingredientTransfer: IngredientTransfer = new IngredientTransfer();

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Output() productTransferEvent = new EventEmitter<any>();

  fromStore: Store = new Store();
  toStore: Store = new Store();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  savedStoreIngredient: StoreIngredient = new StoreIngredient();
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
    this.fromIngredientDatasource = new MatTableDataSource<StoreIngredient>([]);
    this.fromIngredientDatasource.paginator = this.fromIngredientPaginator;

    this.toIngredientDatasource = new MatTableDataSource([]);
    this.toIngredientDatasource.paginator = this.toIngredientPaginator;
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
              this.fromIngredientColumns = ['image', 'ingredientName', 'qty'];
            } else {
              this.fromIngredientColumns = ['image', 'ingredientName', 'qty', 'transferQty', 'actions'];
            }
          }
        },
          error => console.log(error),
          () => console.log('Get store employee complete for storeId = ' + this.fromStore.id + ' userId = '
          + this.appService.tokenStorage.getUserId()));
    }
  }

  getFromIngredientStoreList() {
    this.appService.saveWithUrl('/service/catalog/getStoreIngredients/',
      {
        storeId: this.fromStore.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: StoreIngredient[]) => {
          this.reinitializingDatasourceData(this.fromIngredientDatasource,
            this.fromIngredientPaginator, this.fromIngredientSort, data);
      },
        error => console.log(error),
        () => console.log('Get all from store ingredients complete'));
  }

  getToIngredientStoreList() {
    this.appService.saveWithUrl('/service/catalog/getStoreIngredients/',
      {
        storeId: this.toStore.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: StoreIngredient[]) => {
          this.reinitializingDatasourceData(this.toIngredientDatasource,
            this.toIngredientPaginator, this.toIngredientSort, data);
      },
        error => console.log(error),
        () => console.log('Get all to store ingredients complete'));
  }

  fromStoreSelected(event) {
    setTimeout(() => {
      this.getStoreEmployee();
      this.getFromIngredientStoreList();
    }, 500);
  }

  toStoreSelected(event) {
    setTimeout(() => {
      this.getToIngredientStoreList();
    }, 500);
  }

  makeTransfer(fromStoreIng: StoreIngredient) {
    this.messages = '';
    this.ingredientTransfer = new IngredientTransfer();
    this.ingredientTransfer.modifiedBy = +this.appService.tokenStorage.getUserId();
    this.ingredientTransfer.ingredientId = fromStoreIng.ingredient.id;
    this.ingredientTransfer.fromStIngId = fromStoreIng.id;
    this.ingredientTransfer.toStoreId = this.toStore.id;
    this.ingredientTransfer.quantity = fromStoreIng.transferQty;
    this.ingredientTransfer.comment = this.comment;

    this.appService.saveWithUrl('/service/catalog/transferIngredient/', this.ingredientTransfer)
      .subscribe((data: StoreIngredient) => {
        this.processResult(data, this.savedStoreIngredient, null);
        this.savedStoreIngredient = data;

        if (this.savedStoreIngredient.id > 0) {
          this.updateDatasourceData(this.toIngredientDatasource, this.toIngredientPaginator,
            this.toIngredientSort, this.savedStoreIngredient);

          fromStoreIng.quantity -= fromStoreIng.transferQty;
          fromStoreIng.transferQty = undefined;
        } else {
          if (data.errors[0] === 'UNKNOWN_TRANSFER_INGREDIENT') {
            this.translate.get(['VALIDATION.UNKNOWN_TRANSFER_INGREDIENT']).subscribe(res => {
              this.messages = res['VALIDATION.UNKNOWN_TRANSFER_INGREDIENT'];
            });
          }
        }
      },
      error => console.log(error),
      () => console.log('Ingredient Transfer complete'));
  }

}
