import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, StoreEmployee, User, Transaction, Fund } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-fund',
  templateUrl: './Fund.component.html',
  styleUrls: ['./Funds.component.scss']
})
export class FundComponent extends BaseComponent implements OnInit {

  messages = '';
  fund: Fund = new Fund();

  storeEmployees: StoreEmployee[] = [];
  selectedPurchaser: User;

  formData = new FormData();
  picture: any[] = [];

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Input() store = new Store();
  @Output() fundSaveEvent = new EventEmitter<any>();

  saving = false;
  justSubmitted = false;

  fundTypes: any = [];
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
        this.fund.id = params.id;
        this.clear([]);
        this.getFund(params.id);
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });

    this.getMyStoreEmployees();

    this.clear([]);

  }

  filterFundTypes() {
    this.fundTypes = [];
    this.appService.appInfoStorage.fundTypes.forEach(ft => {
        if (this.storeEmployee.canApprove || ft.fundType.approverOnly !== 1) {
          this.fundTypes.push(ft);
        }
    });
  }

  clear(data) {
    this.messages = '';
    this.fund = new Fund();
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

          this.storeEmployees.forEach(se => {
            if (+this.appService.tokenStorage.getUserId() === se.employee.id) {
              this.storeEmployee = se;
              this.filterFundTypes();
            }
          });

        },
          (error) => console.log(error),
          () => console.log('Get all StoreEmployees complete'));
    }
  }


  getFund(fund: Fund) {
    this.messages = '';
    if (fund && fund.id > 0) {
      this.appService.getOneWithChildsAndFiles(fund.id, 'Fund')
        .subscribe(result => {
          if (result.id > 0) {
            this.fund = result;
            const images: any[] = [];
            const image = {
              link: 'assets/images/funds/' + this.fund.id + '/' + this.fund.image,
              preview: 'assets/images/funds/' + this.fund.id + '/' + this.fund.image
            };
            images.push(image);
            this.picture = images;

          } else {
            this.fund = new Fund();
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
    console.log('Save called');
    if (this.justSubmitted) {
      this.justSubmitted = false;
      console.log('Just submitted');
      return;
    }
    this.saving = true;
    this.messages = '';
    this.fund.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (!this.fund.store.id) {
      this.fund.store.id = this.store.id;
    }
    this.setToggleValues();

    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }

    console.log(this.fund);
    this.appService.saveWithFile(this.fund, 'Fund', this.formData, 'saveWithFile')
      .subscribe((data: Fund) => {
        this.processResult(data, this.fund, null);
        this.fund = data;
        this.fund.storeName = this.store.name;
        this.fundSaveEvent.emit(this.fund);
        this.fund = new Fund();
        this.saving = false;
        this.setDatasource([]);
        this.picture = [];
      }, error => {
          this.saving = false;
          console.log(error);
        }, () => {
            this.saving = false;
            console.log('Save Fund complete');
          }
        );

  }

  submit() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.fund.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/submitFund/', this.fund)
      .subscribe((data: Fund) => {
        console.log(data);
        this.processResult(data, this.fund, null);
        this.fund = data;
        this.fund.storeName = this.store.name;
        this.fundSaveEvent.emit(this.fund);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Submit Fund complete'));
  }

  reopen() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.fund.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/reopenFund/', this.fund)
      .subscribe((data: Fund) => {
        this.processResult(data, this.fund, null);
        this.fund = data;
        this.fund.storeName = this.store.name;
        this.fundSaveEvent.emit(this.fund);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Reopen Fund complete'));
  }

    reject() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.fund.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/rejectTransaction/', this.fund)
      .subscribe((data: Fund) => {
        this.processResult(data, this.fund, null);
        this.fund = data;
        this.fund.storeName = this.store.name;
        this.fundSaveEvent.emit(this.fund);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Reopen Fund complete'));
  }

  approve() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.fund.modifiedBy = +this.appService.tokenStorage.getUserId();
    this.fund.approvedBy = new User();
    this.fund.approvedBy.id = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/approveFund/', this.fund)
      .subscribe((data: Fund) => {
        console.log(data);
        this.processResult(data, this.fund, null);
        this.fund = data;
        this.fund.storeName = this.store.name;
        this.fundSaveEvent.emit(this.fund);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Approve PoHrd complete'));
  }

  cancel() {
    this.fund.status = 9;
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.fund.modifiedBy = +this.appService.tokenStorage.getUserId();
        this.appService.save(this.fund, 'Transaction')
      .subscribe((data: Fund) => {
        this.processResult(data, this.fund, null);
        this.fund = data;
        this.fund.storeName = this.store.name;
        this.fundSaveEvent.emit(this.fund);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Save Fund complete'));
  }

  setToggleValues() {
    this.fund.status = (this.fund.status == null
      || this.fund.status.toString() === 'false'
      || this.fund.status.toString() === '0') ? 0 : 1;
  }

}
