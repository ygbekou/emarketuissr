import { Component, OnInit } from '@angular/core';
import { Store, User } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';

@Component({
  selector: 'app-store',
  templateUrl: './Store.component.html'
})
export class StoreComponent  extends BaseComponent implements OnInit {
  messages = '';
  errors = '';

  formData: FormData;
  picture: any[] = [];

  store: Store;
  constants: Constants = new Constants();

  userId: number;
  user:  User = new User();


  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
      super(translate);
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getStore(params.id);
      }
    });
  }

  clear() {
    this.store = new Store();
  }

  getUser() {
    this.messages = '';

    if (this.userId > 0) {
      this.appService.getOne(this.userId, 'User')
        .subscribe(result => {
          if (result !== null && result.id > 0) {
            this.store.owner.id = result.id;
            this.user = result;
          } else {
            this.store.owner.id = undefined;
            this.user = new User();
            this.translate.get(['COMMON.READ', 'MESSAGE.INVALID_USER_ID']).subscribe(res => {
              this.messages = res['MESSAGE.INVALID_USER_ID'];
            });
          }
        });
    }
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
      this.store.modifiedBy = +this.appService.tokenStorage.getUserId();
      //this.store.owner = this.user;
      console.log(this.store);
      this.formData = new FormData();

      if (this.picture && this.picture.length > 0) {
        if (this.picture[0].file) {
          this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
        } else {
          const pathSplitArray = this.picture[0].link.split('/');
            this.store.remainingFileNames.push(pathSplitArray[pathSplitArray.length - 1]);
        }
      }
      this.appService.saveWithFile(this.store, 'Store', this.formData, 'saveWithFile')
         .subscribe(data => {
            this.processResult(data, this.store, null);
            this.store = data;
         });
   }


  setToggleValues(store: Store) {
    store.status = (store.status === null
      || store.status === undefined
      || store.status.toString() === 'false'
      || store.status.toString() === '0') ? 0 : 1;
  }

  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }

}