import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Address } from 'src/app/app.models';

@Component({
  selector: 'app-address',
  templateUrl: './Address.component.html',
  styleUrls: ['./Address.component.scss']
})
export class AddressComponent implements OnInit {

  addresses: Address[] = [];
  error: string;
  constructor(public appService: AppService, public translate: TranslateService) {
  }

  ngOnInit() {

    this.getAddresses();

  }


  getAddresses() {
    const userId = Number(this.appService.tokenStorage.getUserId());
    if (userId > 0) {
      const parameters: string[] = [];
      parameters.push('e.user.id = |userId|' + userId + '|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.Address', parameters)
        .subscribe((data: Address[]) => {
          this.addresses = data;
        },
          error => console.log(error),
          () => console.log('Get all addresses complete for userId=' + userId));
    }
  }

}
