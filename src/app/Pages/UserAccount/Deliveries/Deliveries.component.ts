import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { User, StoreShipper } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './Deliveries.component.html',
  styleUrls: ['./Deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {
  user: User = new User();
  errors: string;
  messages: string;
  iconSize = 'lg';
  storeShippers: StoreShipper[] = [];
  iconColor = '';
  constructor(public appService: AppService, public translate: TranslateService) { }

  ngOnInit() {
    this.getUser(Number(this.appService.tokenStorage.getUserId()));
    this.getStoreShippers(Number(this.appService.tokenStorage.getUserId()));
  }

  getUser(userId: number) {
    this.appService.getOneWithChildsAndFiles(userId, 'User')
      .subscribe(result => {
        if (result.id > 0) {
          this.user = result;
        } else {
          this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
            this.errors = res['MESSAGE.READ_FAILED'];
          });
        }
      });

  }

  getStoreShippers(userId: number) {
    if (userId > 0) {
      this.storeShippers = [];
      const parameters: string[] = [];
      parameters.push('e.shipper.user.id = |userId|' + userId + '|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.StoreShipper', parameters)
        .subscribe((data: StoreShipper[]) => {
          console.log(data);
          this.storeShippers = data;
        },
          error => console.log(error),
          () => console.log('Get all StoreShipper complete for userId=' + userId));
    }
  }

  changeStoreShip(val: number) {
    this.user.isShipper = val;
    this.appService.saveWithUrl('/service/user/user/changeShipperSettings', this.user)
      .subscribe((data: any) => {
        console.log(data);
        this.getStoreShippers(this.user.id);
        if (data.result === 'SUCCESS') {
          this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
            this.messages = res['MESSAGE.SAVE_SUCCESS'];
          });
        } else {
          this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.SAVE_UNSUCCESS'] + ' : ' + data.result;
          });
        }
      },
        error => console.log(error),
        () => console.log('Get all changeStoreShipper complete'));
  }

  changeStoreShipper(storeShipper: StoreShipper) {
    storeShipper.shipperStatus = (storeShipper.shipperStatus == null
      || storeShipper.shipperStatus.toString() === 'false'
      || storeShipper.shipperStatus.toString() === '0') ? 0 : 1;
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
}
