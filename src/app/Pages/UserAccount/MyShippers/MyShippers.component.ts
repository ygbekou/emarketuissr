import { Component, OnInit } from '@angular/core';
import { StoreSearchCriteria, Store, POSearchCriteria, StoreShipper, Shipper } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
@Component({
  selector: 'app-purchase-orders',
  templateUrl: './MyShippers.component.html',
  styleUrls: ['./MyShippers.component.scss']
})
export class MyShippersComponent extends BaseComponent implements OnInit {
  searchCriteria: POSearchCriteria = new POSearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  store: Store;
  storeShippers: StoreShipper[] = [];
  shippers: Shipper[] = [];
  errors: '';

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.getStores();
    this.getShippers();
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }
  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
        if (this.stores && this.stores.length === 1) {
          this.store = this.stores[0];
          this.getStoreShippers();
        }
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  storeSelected() {
    this.getStoreShippers();
  }

  getShippers() {
    const parameters: string[] = [];
    parameters.push('e.status= |abc|1|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.Shipper', parameters)
      .subscribe((data: Shipper[]) => {
        this.shippers = data;
        this.storeShippers.forEach((ss) => {
          const index: number = this.shippers.findIndex((tb) => tb.id === ss.shipper.id);
          if (index !== -1) {
            this.shippers.splice(index, 1);
          }
        });
      },
        error => console.log(error),
        () => console.log('Get all Shipper complete'));
  }

  getStoreShippers() {
    const parameters: string[] = [];
    parameters.push('e.store.id= |abc|' + this.store.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.StoreShipper', parameters)
      .subscribe((data: StoreShipper[]) => {
        this.storeShippers = data;
        this.getShippers();
      },
        error => console.log(error),
        () => console.log('Get all Shipper complete'));
  }

  public deleteStoreShipper(id: number) {
    this.appService.delete(id, 'com.softenza.emarket.model.StoreShipper')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          this.getStoreShippers();
        }
      });
  }

  changeShipper(storeShipper: StoreShipper) {
    storeShipper.storeStatus = (storeShipper.storeStatus == null
      || storeShipper.storeStatus.toString() === 'false'
      || storeShipper.storeStatus.toString() === '0') ? 0 : 1;
    console.log(storeShipper);
    this.appService.save(storeShipper, 'StoreShipper')
      .subscribe(result => {
        if (result.id > 0) {
          // this. getStoreShippers(Number(this.appService.tokenStorage.getUserId()));
          this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
            this.messages = res['MESSAGE.SAVE_SUCCESS'];
          });
        } else {
          this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
          });
        }
      });
  }
  addShipper(shipper: Shipper) {
    const ss: StoreShipper = new StoreShipper();
    ss.shipper = shipper;
    ss.store = this.store;
    ss.storeStatus = 1;
    ss.shipperStatus = 0;
    ss.shipCount = 0;
    this.appService.save(ss, 'StoreShipper')
      .subscribe(result => {

        if (result.id > 0) {
          this.getStoreShippers();
          this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
            this.messages = res['MESSAGE.SAVE_SUCCESS'];
          });
        } else {
          this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
          });
        }
      });
  }
}
