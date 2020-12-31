import { Component, OnInit } from '@angular/core';
import { Store, Currency } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './Store.component.html'
})
export class StoreComponent extends BaseComponent implements OnInit {
  messages = '';
  errors = '';
  formData: FormData;
  picture: any[] = [];
  currencies: Currency[] = [];
  store: Store;
  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
    super(translate);
  }

  ngOnInit() {
    this.getCurrencies();
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getStore(params.id);
      }
    });
  }

  generateStoreCode() {
    const d = new Date();
    this.store.code = (this.store.owner.firstName ?
      this.store.owner.firstName.charAt(0) : ''
    ) + (this.store.owner.lastName ?
      this.store.owner.lastName.charAt(0) : '')
      + d.getTime();
  }


  clear() {
    this.store = new Store();
  }

  getStore(storeId: number) {
    if (storeId > 0) {
      this.appService.getOneWithChildsAndFiles(storeId, 'Store')
        .subscribe(result => {
          if (result.id > 0) {
            this.store = result;
            this.store.fileNames.forEach(item => {
              if (item === this.store.image) {
                this.picture.push(
                  {
                    link: 'assets/images/stores/' + this.store.id + '/' + item,
                    preview: 'assets/images/stores/' + this.store.id + '/' + item
                  }
                );
              } else {
                // Do Nothing
              }
            });
          } else {
            this.store = new Store();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  submitStoreInfo() {
    this.messages = '';
    this.errors = '';
    this.store.status = (this.store.status == null
      || this.store.status.toString() === 'false'
      || this.store.status.toString() === '0') ? 0 : 1;

    this.store.aprvStatus = (this.store.aprvStatus == null
      || this.store.aprvStatus.toString() === 'false'
      || this.store.aprvStatus.toString() === '0') ? 0 : 1;

    this.store.displayWeb = (this.store.displayWeb == null
      || this.store.displayWeb.toString() === 'false'
      || this.store.displayWeb.toString() === '0') ? 0 : 1;

    this.store.displayMb = (this.store.displayMb == null
      || this.store.displayMb.toString() === 'false'
      || this.store.displayMb.toString() === '0') ? 0 : 1;

    this.store.modifiedBy = +this.appService.tokenStorage.getUserId();
    this.formData = new FormData();
    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }
    this.appService.saveWithFile(this.store, 'Store', this.formData, 'saveWithFile')
      .subscribe(data => {
        this.processResult(data, this.store, null);
        this.store = data;
      });
  }


  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';
    return val.length === 0;
  }

  getCurrencies() {
    const parameters: string[] = [];
    parameters.push('e.status = |abc|1|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.Currency', parameters,
      ' order by e.code ')
      .subscribe((data: Currency[]) => {
        this.currencies = data;
      },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
  }

}
