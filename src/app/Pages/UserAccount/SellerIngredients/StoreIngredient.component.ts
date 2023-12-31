import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, StoreIngredient, IngredientSearchCriteria, IngredientDescription, StoreIngredientInventory, Ingredient } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-store-ingredient',
  templateUrl: './StoreIngredient.component.html',
  styleUrls: ['./StoreIngredients.component.scss']
})
export class StoreIngredientComponent  extends BaseComponent implements OnInit, AfterViewInit {

  inventoryColumns: string[] = ['quantity', 'description', 'createdBy', 'createdDate'];
  inventoryDatasource: MatTableDataSource<StoreIngredient>;
  @ViewChild(MatPaginator, { static: true }) inventoryPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) inventorySort: MatSort;

  messages = '';
  storeIngredient: StoreIngredient = new StoreIngredient();
  searchCriteria: IngredientSearchCriteria = new IngredientSearchCriteria();
  ingredientDescriptions: IngredientDescription[] = [];

  currentOption: string;
  ingredientOptions: IngredientDescription[];
  filteredIngredientOptions: IngredientDescription[];

  storeIngredientInventory: StoreIngredientInventory = new StoreIngredientInventory();

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Input() store = new Store();
  @Output() storeIngredientSaveEvent = new EventEmitter<any>();

  addNew = false;
  ingredient = new Ingredient();

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
        this.storeIngredient.id = params.id;
        this.clear();
        this.getStoreIngredient(params.id);
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });

  }

  ngAfterViewInit() {
    this.inventoryDatasource = new MatTableDataSource([]);
    this.inventoryDatasource.paginator = this.inventoryPaginator;
  }

  clear() {
    this.messages = '';
    this.storeIngredient = new StoreIngredient();
    this.currentOption = '';
  }

  getStoreIngredient(storeIngredient: StoreIngredient) {
    this.messages = '';
    if (storeIngredient && storeIngredient.id > 0) {
      this.getStoreIngredientInventory(storeIngredient.id);
      this.appService.getOneWithChildsAndFiles(storeIngredient.id, 'StoreIngredient')
        .subscribe(result => {
          if (result.id > 0) {
            this.storeIngredient = result;
            this.storeIngredient.ingredientName = storeIngredient.ingredient.name;
          } else {
            this.storeIngredient = new StoreIngredient();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      this.clear();
    }
  }


  getStoreUnassignedIngredients() {
    this.searchCriteria.storeId = this.store.id;
    this.searchCriteria.languageId = this.appService.appInfoStorage.language.id;

    this.appService.saveWithUrl('/service/catalog/getStoreUnassignedIngredients', this.searchCriteria)
      .subscribe((data: any[]) => {
        this.ingredientDescriptions = data;

        this.ingredientOptions = data;
          this.filteredIngredientOptions = data;
      },
        error => console.log(error),
        () => console.log('Get ingredients complete'));

  }

  getStoreIngredientInventory(storeIngredientId: number) {

      this.appService.saveWithUrl('/service/catalog/getStoreIngredientInventory', {'storeIngredientId': storeIngredientId})
        .subscribe((data: any[]) => {
          this.inventoryDatasource = new MatTableDataSource(data);
          this.inventoryDatasource.paginator = this.inventoryPaginator;
          this.inventoryDatasource.sort = this.inventorySort;
        },
          error => console.log(error),
          () => console.log('Get store ingredient inventory complete'));

  }


  filterOptions(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
         this.filteredIngredientOptions = this.ingredientOptions
          .filter(ingredientDesc => ingredientDesc.name.toLowerCase().startsWith(filterValue));
      } else {
         this.filteredIngredientOptions = this.ingredientOptions;
      }
   }

   save() {
    this.messages = '';
    this.storeIngredient.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (!this.storeIngredient.store.id ) {
      this.storeIngredient.store.id = this.store.id;
    }
    this.currentOption = this.storeIngredient.ingredientName;

    this.setToggleValues();

    this.appService.save(this.storeIngredient, 'StoreIngredient')
      .subscribe((data: StoreIngredient) => {
        this.processResult(data, this.storeIngredient, null);
        this.storeIngredient = data;
        this.storeIngredient.storeName = this.store.name;
        this.storeIngredient.ingredientName = this.currentOption;
        this.storeIngredientSaveEvent.emit(this.storeIngredient);
      },
        error => console.log(error),
        () => console.log('Save StoreIngredient complete'));
  }

  validateSelectedIngredient() {

    if (!this.storeIngredient.ingredient && typeof(this.storeIngredient.ingredientName) === 'string') {
      const index = this.ingredientOptions.findIndex(x => x.name === this.storeIngredient.ingredientName);
      if (index === -1) {
        return false;
      } else {
        this.storeIngredient.ingredient = this.ingredientOptions[index].ingredient;
      }
    }

    if (!this.storeIngredient.ingredient || !this.storeIngredient.ingredient.id) {
      return false;
    }

    return true;
  }

  addQuantity() {
    this.messages = '';
    this.storeIngredientInventory.modBy = +this.appService.tokenStorage.getUserId();

    if (!this.storeIngredientInventory.storeIngredient.id ) {
      this.storeIngredientInventory.storeIngredient.id = this.storeIngredient.id;
    }

    this.appService.save(this.storeIngredientInventory, 'StoreIngredientInventory')
      .subscribe((data: StoreIngredientInventory) => {
        console.log(data);
        this.processResult(data, this.storeIngredientInventory, null);
        this.storeIngredientInventory = data;
        this.addQuantityToStoreIngredient(this.storeIngredientInventory.quantity);
        this.storeIngredientInventory.addByFirstName = this.appService.tokenStorage.getUser().firstName;
        this.storeIngredientInventory.addByLastName = this.appService.tokenStorage.getUser().lastName;
        this.updateDatasourceData(this.inventoryDatasource, this.inventoryPaginator, this.inventorySort, this.storeIngredientInventory);
        this.storeIngredientInventory = new StoreIngredientInventory();
        this.storeIngredientSaveEvent.emit(this.storeIngredient);
      },
        error => console.log(error),
        () => console.log('Save StoreIngredientInventory complete'));
  }

  addQuantityToStoreIngredient(quantity: number) {
    if (!this.storeIngredient.quantity) {
      this.storeIngredient.quantity = 0;
    }
    this.storeIngredient.quantity = Number(this.storeIngredient.quantity) + Number(quantity);
  }

  setToggleValues() {
    this.storeIngredient.status = (this.storeIngredient.status == null
          || this.storeIngredient.status.toString() === 'false'
          || this.storeIngredient.status.toString() === '0') ? 0 : 1;
  }

  setSelectedIngredient(ingredientDesc: IngredientDescription) {
     this.storeIngredient.ingredient = ingredientDesc.ingredient;
  }

  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }



  saveIngredient() {
    this.messages = '';
    this.ingredient.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.setIngredientToggleValues();

    this.appService.save(this.ingredient, 'Ingredient')
      .subscribe((data: Ingredient) => {
        this.processResult(data, this.ingredient, null);
        this.ingredient = data;
        this.storeIngredient.ingredient = this.ingredient;
        this.addNew = false;
        for (const ingDesc of this.ingredient.ingredientDescriptions) {
          if (ingDesc.language.id === this.appService.appInfoStorage.language.id) {
            this.storeIngredient.ingredientName = ingDesc.name;
          }
        }
        this.save();
      },
        error => console.log(error),
        () => console.log('Save StoreMenu complete'));
  }

  addNewMenu() {
    this.addNew = true;
    this.storeIngredient = new StoreIngredient();
    this.ingredient = new Ingredient();
    this.ingredient.ingredientDescriptions = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const id = new IngredientDescription();
      id.language = lang;
      id.name = '';
      this.ingredient.ingredientDescriptions.push(id);
    }
  }

  cancel() {
    this.addNew = false;
    this.storeIngredient = new StoreIngredient();
    this.ingredient = new Ingredient();
    this.ingredient.ingredientDescriptions = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const id = new IngredientDescription();
      id.language = lang;
      id.name = '';
      this.ingredient.ingredientDescriptions.push(id);
    }
  }

  setIngredientToggleValues() {
    this.ingredient.status = (this.ingredient.status == null
      || this.ingredient.status.toString() === 'false'
      || this.ingredient.status.toString() === '0') ? 0 : 1;
  }
}
