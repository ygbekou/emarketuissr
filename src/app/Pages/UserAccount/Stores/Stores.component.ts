import { Component, OnInit, Input } from '@angular/core';
import { Store, StoreSearchCriteria } from 'src/app/app.models';
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
  fromAdmin = false;
  @Input()
  userId;

  constructor(public appService: AppService, public translate: TranslateService) {

  }

  ngOnInit() {

    if (this.userId === undefined) {
      this.userId = Number(this.appService.tokenStorage.getUserId());
    } else {
      this.fromAdmin = true;
    }
    this.getStores();

  }

  private getStores() {
    const storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
    storeSearchCriteria.status = 1;
    storeSearchCriteria.userId = this.userId;
    console.log(storeSearchCriteria);
    this.appService.saveWithUrl('/service/catalog/stores', storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }


}
