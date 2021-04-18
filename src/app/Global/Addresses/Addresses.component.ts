import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Address } from 'src/app/app.models';
import { AddressComponent } from '../Address/Address.component';
import { MatExpansionPanel } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addresses',
  templateUrl: './Addresses.component.html',
  styleUrls: ['./Addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  addresses: Address[] = [];
  error: string;
  indexExpanded = -1;
  panelOpenState = false;
  @Input() userId;
  @Input() addressType;
  @Input() deliveryMode;
  @ViewChild('shippingAddressComponent', { static: false }) shippingAddressComponent: AddressComponent;
  @ViewChild('shippingExpansionPanelElement', { static: false }) shippingExpansionPanelElement: MatExpansionPanel;
  public fromPage = '';
  step = 0;
  constructor(public appService: AppService,
    public router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService) {
    this.route.queryParams.forEach(queryParams => {
      if (queryParams['fromPage']) {
        console.log('From page: ' + queryParams['fromPage']);
        this.fromPage = queryParams['fromPage'];
      }
    });
  }

  ngOnInit() {
    console.log('address type =' + this.addressType);

    if (this.userId === undefined) {
      this.userId = Number(this.appService.tokenStorage.getUserId());
    }
    this.getAddresses();
  }

  setStep(index: number) {
    this.step = index;
  }
  getAddresses() {
    if (this.userId > 0) {
      const parameters: string[] = [];
      parameters.push('e.user.id = |userId|' + this.userId + '|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.Address', parameters)
        .subscribe((data: Address[]) => {
          this.addresses = data;
          if (this.addresses.length === 0) {
            this.shippingExpansionPanelElement.open();
          }
        },
          error => console.log(error),
          () => console.log('Get all addresses complete for userId=' + this.userId));
    }
  }

  removeAddress(addressId: number) {
    this.appService.delete(addressId, 'com.softenza.emarket.model.Address')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          this.getAddresses();
        }
      });
  }

  selectAddress(address: Address) {
    address.addressType = this.addressType;
    this.appService.saveWithUrl('/service/catalog/setShipPayAddress/', address)
      .subscribe((data) => {
        if (this.fromPage === 'fromStore') {
          this.router.navigate(['/account/profile/edit'], { queryParams: { type: 'store', sId: '0' } });
        } else {
          this.router.navigate(['/checkout/payment'], { queryParams: { deliveryMode: this.deliveryMode } });
        }
      },
        error => console.log(error),
        () => console.log('Changing Payment Method complete'));
  }


  updateTable(address: Address) {
    const index = this.addresses.findIndex(x => x.id === address.id);
    if (index === -1) {
      this.addresses.push(address);
    } else {
      this.addresses[index] = address;
    }
  }

  onAddressSaved($event) {
    if (this.fromPage === 'fromStore') {
      this.router.navigate(['/account/profile/edit'], { queryParams: { type: 'store', sId: '0' } });
    } else if (this.fromPage === 'checkout') {
      this.router.navigate(['/checkout/payment'], { queryParams: { deliveryMode: this.deliveryMode } });
    } else {
      this.updateTable($event);
      if (this.shippingExpansionPanelElement) {
        this.shippingExpansionPanelElement.close();
      }
    }

  }

  editAddress(addressId: number) {
    this.shippingAddressComponent.getAddress(addressId);
    this.shippingExpansionPanelElement.open();
  }
}
