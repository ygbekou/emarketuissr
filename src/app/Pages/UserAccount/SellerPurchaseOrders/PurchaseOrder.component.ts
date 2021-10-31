import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, PoDtl, PoHdr, StoreEmployee, User, Supplier } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { PurchaseOrderDetailsComponent } from './PurchaseOrderDetails.component';


@Component({
  selector: 'app-purchase-order',
  templateUrl: './PurchaseOrder.component.html',
  styleUrls: ['./PurchaseOrders.component.scss']
})
export class PurchaseOrderComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('ProductsComponent', { static: false }) productsComponent: PurchaseOrderDetailsComponent;
  @ViewChild('IngredientsComponent', { static: false }) ingredientsComponent: PurchaseOrderDetailsComponent;

  messages = '';
  poHdr: PoHdr = new PoHdr();

  storeEmployees: StoreEmployee[] = [];
  suppliers: Supplier[] = [];
  poDtls: PoDtl[] = [];

  selectedPurchaser: User;

  formData = new FormData();
  picture: any[] = [];

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Input() store = new Store();
  @Output() poHdrSaveEvent = new EventEmitter<any>();

  supplier: Supplier = new Supplier();
  saving = false;
  justSubmitted = false;
  addNew = false;
  storeEmployee: StoreEmployee;

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
        this.poHdr.id = params.id;
        this.clear([]);
        this.getPoHdr(params.id);
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
    //this.currentOption = '';
    this.poHdr = new PoHdr();
    this.setDatasource([]);
    this.picture = [];
  }

  setDatasource(data) {
    setTimeout(() => {
      const prdPoDtls = data.filter(poDtl => poDtl.product && poDtl.product.id > 0);
      if (this.productsComponent) {
        this.productsComponent.poHdr = this.poHdr;
        this.productsComponent.setDatasource(prdPoDtls);
        this.productsComponent.getStoreProducts(this.store.id);
      }

      const igdPoDtls = data.filter(poDtl => poDtl.ingredient && poDtl.ingredient.id > 0);
      if (this.ingredientsComponent) {
        this.ingredientsComponent.poHdr = this.poHdr;
        this.ingredientsComponent.setDatasource(igdPoDtls);
        this.ingredientsComponent.getStoreIngredients(this.store.id);
      }
    }, 1000);
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
          
          this.storeEmployees.forEach(se => {
            if (+this.appService.tokenStorage.getUserId() === se.employee.id) {
              this.storeEmployee = se;
            }
          });

        },
          (error) => console.log(error),
          () => console.log('Get all StoreEmployees complete'));
    }
  }

  public getSuppliers() {
    const parameters: string[] = [];
    //parameters.push('e.store.id = |sId|' + this.store.id + '|Integer');
    parameters.push('e.status = |supplierStatus|1|Integer');
    this.appService.getAllByCriteria('Supplier', parameters, ' ')
      .subscribe((data: Supplier[]) => {
        this.suppliers = data;
        console.log(this.suppliers);
      },
        (error) => console.log(error),
        () => console.log('Get all Suppliers complete'));
  }


  getPoHdr(poHdr: PoHdr) {
    this.messages = '';
    if (poHdr && poHdr.id > 0) {
      this.appService.getOneWithChildsAndFiles(poHdr.id, 'PoHdr')
        .subscribe(result => {
          if (result.id > 0) {
            this.poHdr = result;
            this.getPoDtls();

            const images: any[] = [];
            const image = {
              link: 'assets/images/pohdrs/' + this.poHdr.id + '/' + this.poHdr.image,
              preview: 'assets/images/pohdrs/' + this.poHdr.id + '/' + this.poHdr.image
            };
            images.push(image);
            this.picture = images;

          } else {
            this.poHdr = new PoHdr();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      this.clear([]);
    }
  }

  getPoDtls() {

    this.appService.saveWithUrl('/service/finance/getPurchaseOrderDetails',
      {
        poHdrId: this.poHdr.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: any[]) => {
        this.setDatasource(data);
      },
        error => console.log(error),
        () => console.log('Get purchase order products complete'));

  }


  save() {
    console.log('Save called');
    if (this.justSubmitted) {
      this.justSubmitted = false;
      console.log('Just submitted');
      return;
    }
    this.saving = true;
    this.messages = '';
    this.poHdr.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (!this.poHdr.store.id) {
      this.poHdr.store.id = this.store.id;
    }
    this.setToggleValues();

    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }

    this.appService.saveWithFile(this.poHdr, 'PoHdr', this.formData, 'saveWithFile')
      .subscribe((data: PoHdr) => {
        this.processResult(data, this.poHdr, null);
        this.poHdr = data;
        this.poHdr.storeName = this.store.name;
        this.poHdrSaveEvent.emit(this.poHdr);
        this.getPoDtls();
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Save PoHdr complete'));
  }

  submit() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.poHdr.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/submitPoHdr/', this.poHdr)
      .subscribe((data: PoHdr) => {
        console.log(data);
        this.processResult(data, this.poHdr, null);
        this.poHdr = data;
        this.poHdr.storeName = this.store.name;
        this.poHdrSaveEvent.emit(this.poHdr);
        this.getPoDtls();
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Submit PoHrd complete'));
  }

  reopen() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.poHdr.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/reopenPoHdr/', this.poHdr)
      .subscribe((data: PoHdr) => {
        console.log(data);
        this.processResult(data, this.poHdr, null);
        this.poHdr = data;
        this.poHdr.storeName = this.store.name;
        this.poHdrSaveEvent.emit(this.poHdr);
        this.getPoDtls();
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Reopen PoHrd complete'));
  }

  approve() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.poHdr.modifiedBy = +this.appService.tokenStorage.getUserId();
    this.poHdr.approvedBy = new User();
    this.poHdr.approvedBy.id = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/approvePoHdr/', this.poHdr)
      .subscribe((data: PoHdr) => {
        console.log(data);
        this.processResult(data, this.poHdr, null);
        this.poHdr = data;
        this.poHdr.storeName = this.store.name;
        this.poHdrSaveEvent.emit(this.poHdr);
        this.getPoDtls();
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Approve PoHrd complete'));
  }

  cancel() {
    this.poHdr.status = 9;
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.poHdr.modifiedBy = +this.appService.tokenStorage.getUserId();
        this.appService.save(this.poHdr, 'PoHdr')
      .subscribe((data: PoHdr) => {
        this.processResult(data, this.poHdr, null);
        this.poHdr = data;
        this.poHdr.storeName = this.store.name;
        this.poHdrSaveEvent.emit(this.poHdr);
        this.getPoDtls();
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Save PoHdr complete'));
  }
  setToggleValues() {
    this.poHdr.status = (this.poHdr.status == null
      || this.poHdr.status.toString() === 'false'
      || this.poHdr.status.toString() === '0') ? 0 : 1;
  }

  changeTab($event) {
    if ($event.index === 0) {
      this.productsComponent.poDtlColumns[2] = 'productName';
    } else if ($event.index === 1) {
      this.ingredientsComponent.poDtlColumns[2] = 'ingredientName';
    }
  }


  calculateAmount() {
    if (this.poHdr.subTotal) {
      this.poHdr.amount = Number(this.poHdr.subTotal);
    }

    if (this.poHdr.taxes) {
      if (!this.poHdr.amount) {
        this.poHdr.amount = 0;
      }
      this.poHdr.amount += Number(this.poHdr.taxes);
    }
    if (this.poHdr.discount) {
      if (!this.poHdr.amount) {
        this.poHdr.amount = 0;
      }
      this.poHdr.amount -= Number(this.poHdr.discount);
    }
  }


  addNewSupplier() {
    this.addNew = true;
    this.supplier = new Supplier();
  }

  saveSupplier() {
    this.messages = '';
    this.supplier.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.setSupplierToggleValues();

    this.appService.save(this.supplier, 'Supplier')
      .subscribe((data: Supplier) => {
        this.processResult(data, this.supplier, null);
        this.supplier = data;
        this.poHdr.supplier = this.supplier;
        this.addNew = false;
        this.suppliers.push(this.supplier);
      },
        error => console.log(error),
        () => console.log('Save Supplier complete'));
  }


  setSupplierToggleValues() {
    this.supplier.status = (this.supplier.status == null
      || this.supplier.status.toString() === 'false'
      || this.supplier.status.toString() === '0') ? 0 : 1;

  }

  cancelSupplier() {
    this.addNew = false;
    this.supplier = new Supplier();
  }
}
