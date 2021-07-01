import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, StoreEmployee, User, Supplier, BillDtl, Bill } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { BillDetailsComponent } from './BillDetails.component';


@Component({
  selector: 'app-bill',
  templateUrl: './Bill.component.html',
  styleUrls: ['./Bills.component.scss']
})
export class BillComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('ProductsComponent', { static: false }) productsComponent: BillDetailsComponent;
  @ViewChild('ServicesComponent', { static: false }) servicesComponent: BillDetailsComponent;

  messages = '';
  bill: Bill = new Bill();
  storeEmployees: StoreEmployee[] = [];
  billDtls: BillDtl[] = [];

  selectedPurchaser: User;
  formData = new FormData();
  picture: any[] = [];

  @Input() isAdminPage = false;
  @Input() store = new Store();
  @Output() billSaveEvent = new EventEmitter<any>();

  saving = false;
  justSubmitted = false;

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
        this.bill.id = params.id;
        this.clear([]);
        this.getBill(params.id);
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
    this.bill = new Bill();
    this.setDatasource([]);
    this.picture = [];
  }

  setDatasource(data) {
    setTimeout(() => {
      const prdBillDtls = data.filter(billDtl => billDtl.product && billDtl.product.id > 0);
      if (this.productsComponent) {
        this.productsComponent.bill = this.bill;
        this.productsComponent.setDatasource(prdBillDtls);
        this.productsComponent.getStoreProducts(this.store.id);
      }

      const serBillDtls = data.filter(billDtl => billDtl.service && billDtl.service.id > 0);
      if (this.servicesComponent) {
        this.servicesComponent.bill = this.bill;
        this.servicesComponent.setDatasource(serBillDtls);
        this.servicesComponent.getServices();
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
          console.log(this.storeEmployees);
        },
          (error) => console.log(error),
          () => console.log('Get all StoreEmployees complete'));
    }
  }

  getBill(bill: Bill) {
    this.messages = '';
    if (bill && bill.id > 0) {
      this.appService.getOneWithChildsAndFiles(bill.id, 'Bill')
        .subscribe(result => {
          if (result.id > 0) {
            this.bill = result;
            this.getBillDtls();

            const images: any[] = [];
            const image = {
              link: 'assets/images/pohdrs/' + this.bill.id + '/' + this.bill.image,
              preview: 'assets/images/pohdrs/' + this.bill.id + '/' + this.bill.image
            };
            images.push(image);
            this.picture = images;

          } else {
            this.bill = new Bill();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      this.clear([]);
    }
  }

  getBillDtls() {

    this.appService.saveWithUrl('/service/finance/getBillDetails',
      {
        billId: this.bill.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: any[]) => {
        this.setDatasource(data);
      },
        error => console.log(error),
        () => console.log('Get bill products complete'));

  }


  save() {
    if (this.justSubmitted) {
      this.justSubmitted = false;
      return;
    }
    this.saving = true;
    this.messages = '';
    this.bill.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (!this.bill.store.id) {
      this.bill.store.id = this.store.id;
    }

    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }

    this.appService.saveWithFile(this.bill, 'Bill', this.formData, 'saveWithFile')
      .subscribe((data: Bill) => {
        this.processResult(data, this.bill, null);
        this.bill = data;
        this.bill.storeName = this.store.name;
        this.billSaveEvent.emit(this.bill);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Save PoHdr complete'));
  }

  submit() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.bill.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/submitBill/', this.bill)
      .subscribe((data: Bill) => {
        console.log(data);
        this.processResult(data, this.bill, null);
        this.bill = data;
        this.getBillDtls();
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Submit Bill complete'));
  }

  changeTab($event) {
    if ($event.index === 0) {
      this.productsComponent.billDtlColumns[2] = 'productName';
    } else if ($event.index === 1) {
      this.servicesComponent.billDtlColumns[2] = 'serviceName';
    }
  }

  calculateAmount () {
    if (this.bill.subTotal) {
      this.bill.amount = Number(this.bill.subTotal);
    }

    if (this.bill.taxes) {
      if (!this.bill.amount) {
        this.bill.amount = 0;
      }
      this.bill.amount += Number(this.bill.taxes);
    }
    if (this.bill.discount) {
      if (!this.bill.amount) {
        this.bill.amount = 0;
      }
      this.bill.amount -= Number(this.bill.discount);
    }
  }

}
