import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-stores',
  templateUrl: './Stores.component.html',
  styleUrls: ['./Stores.component.scss']
})
export class StoresComponent implements OnInit {

  stores: Store[] = [];
  error: string;
  constructor(public appService: AppService, public translate: TranslateService) {
  }

  ngOnInit() {

    this.getStores();

  }

  public delete(cardId: number) {
    this.appService.delete(cardId, 'com.softenza.emarket.model.Store')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          this.getStores();
        }
      });
  }

  getStores() {
    const userId = Number(this.appService.tokenStorage.getUserId());
    if (userId > 0) {
      const parameters: string[] = [];
      parameters.push('e.owner.id = |userId|' + userId + '|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.Store', parameters)
        .subscribe((data: Store[]) => {
          this.stores = data;
        },
          error => console.log(error),
          () => console.log('Get all Store complete for userId=' + userId));
    }
  }
}
