import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, StoreEmployee, User, Supplier, BillDtl, Bill, StoreService, ServiceDescription } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-store-service',
  templateUrl: './StoreService.component.html',
  styleUrls: ['./StoreServices.component.scss']
})
export class StoreServiceComponent extends BaseComponent implements OnInit, AfterViewInit {

  messages = '';
  storeService: StoreService = new StoreService();
  storeEmployees: StoreEmployee[] = [];

  selectedPurchaser: User;
  formData = new FormData();
  picture: any[] = [];

  @Input() isAdminPage = false;
  store = new Store();
  @Output() storeServiceSaveEvent = new EventEmitter<any>();

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
        this.storeService.id = params.id;
        this.clear([]);
        this.getStoreService(params.id);
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
    this.storeService = new StoreService();
    this.picture = [];
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

  getStoreService(storeService: StoreService) {
    this.messages = '';
    if (storeService && storeService.id > 0) {
      this.appService.getOneWithChildsAndFiles(storeService.id, 'StoreService')
        .subscribe(result => {
          if (result.id > 0) {
            this.storeService = result;
            console.log(this.storeService);

            if (this.storeService.renewalDate !== null && this.storeService.renewalDate !== undefined) {
              console.log('Renewal Date is not null before: ' + this.storeService.renewalDate);
              this.storeService.renewalDate = new Date(this.storeService.renewalDate);
              console.log('Renewal Date is not null after: ' + this.storeService.renewalDate);
            }
            if (this.storeService.startDate !== null && this.storeService.startDate !== undefined) {
              console.log('Start Date is not null before: ' + this.storeService.startDate);
              this.storeService.startDate = new Date(this.storeService.startDate);
              console.log('Start Date is not null after: ' + this.storeService.startDate);
            }
            if (this.storeService.endDate !== null && this.storeService.endDate !== undefined) {
              console.log('End Date is not null before: ' + this.storeService.endDate);
              this.storeService.endDate = new Date(this.storeService.endDate);
              console.log('End Date is not null after: ' + this.storeService.endDate);
            }

            const images: any[] = [];
            const image = {
              link: 'assets/images/storeservices/' + this.storeService.id + '/' + this.storeService.image,
              preview: 'assets/images/storeservices/' + this.storeService.id + '/' + this.storeService.image
            };
            images.push(image);
            this.picture = images;

          } else {
            this.storeService = new StoreService();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      this.clear([]);
    }
  }

  save() {
    if (this.justSubmitted) {
      this.justSubmitted = false;
      return;
    }
    this.saving = true;
    this.messages = '';
    this.storeService.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (!this.storeService.store.id) {
      this.storeService.store.id = this.store.id;
    }

    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }

    this.appService.saveWithFile(this.storeService, 'StoreService', this.formData, 'saveWithFile')
      .subscribe((data: StoreService) => {
        this.processResult(data, this.storeService, null);
        this.storeService = data;
        this.storeService.storeName = this.store.name;
        this.storeService.service.name = this.appService.getServiceDesc(this.storeService.service).name;
        this.storeServiceSaveEvent.emit(this.storeService);
        this.saving = false; 
      },
        error => console.log(error),
        () => console.log('Save Store Service complete'));
  }

}
