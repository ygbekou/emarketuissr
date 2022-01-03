import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, StoreEmployee, User, Transaction } from 'src/app/app.models';
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
export class TransactionComponent extends BaseComponent implements OnInit {

  messages = '';
  transaction: Transaction = new Transaction();

  storeEmployees: StoreEmployee[] = [];
  selectedPurchaser: User;

  formData = new FormData();
  picture: any[] = [];

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Input() store = new Store();
  @Output() transactionSaveEvent = new EventEmitter<any>();

  saving = false;
  justSubmitted = false;

  transactionTypes: any = [];
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

  filterTransactionTypes() {
    this.transactionTypes = [];
    this.appService.appInfoStorage.transactionTypes.forEach(tt => {
        if (this.storeEmployee.canApprove || tt.transactionType.approverOnly !== 1) {
          this.transactionTypes.push(tt);
        }
    });
  }

  clear(data) {
    this.messages = '';
    //this.currentOption = '';
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

          this.storeEmployees.forEach(se => {
            if (+this.appService.tokenStorage.getUserId() === se.employee.id) {
              this.storeEmployee = se;
              this.filterTransactionTypes();
            }
          });

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
    this.transaction.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (!this.transaction.store.id) {
      this.transaction.store.id = this.store.id;
    }
    this.setToggleValues();

    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }

    console.log(this.transaction);
    this.appService.saveWithFile(this.transaction, 'Transaction', this.formData, 'saveWithFile')
      .subscribe((data: Transaction) => {
        this.processResult(data, this.transaction, null);
        this.transaction = data;
        this.transaction.storeName = this.store.name;
        this.transactionSaveEvent.emit(this.transaction);
        this.transaction = new Transaction();
        this.saving = false;
        this.setDatasource([]);
        this.picture = [];
      }, error => {
          this.saving = false;
          console.log(error);
        }, () => {
            this.saving = false;
            console.log('Save Transaction complete');
          }
        );

  }

  submit() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.transaction.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/submitTransaction/', this.transaction)
      .subscribe((data: Transaction) => {
        console.log(data);
        this.processResult(data, this.transaction, null);
        this.transaction = data;
        this.transaction.storeName = this.store.name;
        this.transactionSaveEvent.emit(this.transaction);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Submit Transaction complete'));
  }

  reopen() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.transaction.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/reopenTransaction/', this.transaction)
      .subscribe((data: Transaction) => {
        this.processResult(data, this.transaction, null);
        this.transaction = data;
        this.transaction.storeName = this.store.name;
        this.transactionSaveEvent.emit(this.transaction);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Reopen Transaction complete'));
  }

    reject() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.transaction.modifiedBy = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/rejectTransaction/', this.transaction)
      .subscribe((data: Transaction) => {
        this.processResult(data, this.transaction, null);
        this.transaction = data;
        this.transaction.storeName = this.store.name;
        this.transactionSaveEvent.emit(this.transaction);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Reopen Transaction complete'));
  }

  approve() {
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.transaction.modifiedBy = +this.appService.tokenStorage.getUserId();
    this.transaction.approvedBy = new User();
    this.transaction.approvedBy.id = +this.appService.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/finance/approveTransaction/', this.transaction)
      .subscribe((data: Transaction) => {
        console.log(data);
        this.processResult(data, this.transaction, null);
        this.transaction = data;
        this.transaction.storeName = this.store.name;
        this.transactionSaveEvent.emit(this.transaction);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Approve PoHrd complete'));
  }

  cancel() {
    this.transaction.status = 9;
    this.justSubmitted = true;
    this.saving = true;
    this.messages = '';
    this.transaction.modifiedBy = +this.appService.tokenStorage.getUserId();
        this.appService.save(this.transaction, 'Transaction')
      .subscribe((data: Transaction) => {
        this.processResult(data, this.transaction, null);
        this.transaction = data;
        this.transaction.storeName = this.store.name;
        this.transactionSaveEvent.emit(this.transaction);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Save Transaction complete'));
  }

  setToggleValues() {
    this.transaction.status = (this.transaction.status == null
      || this.transaction.status.toString() === 'false'
      || this.transaction.status.toString() === '0') ? 0 : 1;
  }

}
