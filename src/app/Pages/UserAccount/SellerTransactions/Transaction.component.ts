import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, ProductStoreMenu, ProductDescription, StoreEmployee, User, Transaction } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-transaction',
  templateUrl: './Transaction.component.html',
  styleUrls: ['./Transactions.component.scss']
})
export class TransactionComponent extends BaseComponent implements OnInit, AfterViewInit {

  messages = '';
  transaction: Transaction = new Transaction();

  currentOption: string;
  productOptions: ProductDescription[];
  filteredProductOptions: ProductDescription[];

  storeProductMenu: ProductStoreMenu = new ProductStoreMenu();
  storeEmployees: StoreEmployee[] = [];

  selectedPurchaser: User;

  formData = new FormData();
  picture: any[] = [];

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Input() store = new Store();
  @Output() transactionSaveEvent = new EventEmitter<any>();

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear([]);
      } else {
        this.transaction.id = params.id;
        this.clear([]);
        this.getTransaction(params.id);
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });

    this.getMyStoreEmployees();

    this.clear([]);

  }

  ngAfterViewInit() {

  }

  clear(data) {
    this.messages = '';
    this.currentOption = '';
    this.transaction = new Transaction();
    this.setDatasource([]);
    this.picture = [];
  }

  setDatasource(data) {
  }

  public getMyStoreEmployees() {
    if (this.store.id) {
      const parameters: string[] = [];
      parameters.push('e.store.id = |sId|' + this.store.id + '|Integer');
      parameters.push('e.store.status = |storeStatus|1|Integer');
      parameters.push('e.status = |employeeStatus|1|Integer');
      this.appService.getAllByCriteria('StoreEmployee', parameters, ' ')
        .subscribe((data: StoreEmployee[]) => {
          this.storeEmployees = data;
        },
          (error) => console.log(error),
          () => console.log('Get all StoreEmployees complete'));
    }
  }

  getTransaction(transaction: Transaction) {
    this.messages = '';
    if (transaction && transaction.id > 0) {
      this.appService.getOneWithChildsAndFiles(transaction.id, 'Transaction')
        .subscribe(result => {
          if (result.id > 0) {
            this.transaction = result;

            const images: any[] = [];
            const image = {
              link: 'assets/images/transactions/' + this.transaction.id + '/' + this.transaction.image,
              preview: 'assets/images/transactions/' + this.transaction.id + '/' + this.transaction.image
            };
            images.push(image);
            this.picture = images;

          } else {
            this.transaction = new Transaction();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      this.transaction = new Transaction();
      this.setDatasource([]);
    }
  }


  getStoreProducts() {
    this.appService.getObjects('/service/catalog/getMyProductsOnSale/'
      + this.appService.appInfoStorage.language.id + '/' + this.store.id)
    .subscribe((data: ProductDescription[]) => {
      this.filteredProductOptions = data;
      this.productOptions = data;
    },
      error => console.log(error),
      () => console.log('Get all store product complete'));
  }


  filterOptions(val) {
    if (val) {
      const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
      this.filteredProductOptions = this.productOptions
        .filter(productDesc => productDesc.name.toLowerCase().startsWith(filterValue));
    } else {
      this.filteredProductOptions = this.productOptions;
    }
  }

  save() {
    this.messages = '';
    this.transaction.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (!this.transaction.store.id) {
      this.transaction.store.id = this.store.id;
    }
    this.setToggleValues();

    let nbFiles = 0;
    for (const img of this.picture) {
      nbFiles++;
      this.formData.append('file[]', img.file, 'picture.jpg');
    }

    this.appService.saveWithFile(this.transaction, 'Transaction', this.formData, 'saveWithFile')
      .subscribe((data: Transaction) => {
        this.processResult(data, this.transaction, null);
        this.transaction = data;
        this.transaction.storeName = this.store.name;
        this.transactionSaveEvent.emit(this.transaction);
      },
        error => console.log(error),
        () => console.log('Save Transaction complete'));
  }

  setToggleValues() {
    this.transaction.status = (this.transaction.status == null
      || this.transaction.status.toString() === 'false'
      || this.transaction.status.toString() === '0') ? 0 : 1;
  }

  isEmpty(value: string): boolean {
    '';
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }
}
