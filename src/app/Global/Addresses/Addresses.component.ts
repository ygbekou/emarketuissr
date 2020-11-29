import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Address } from 'src/app/app.models';
import { AddressComponent } from '../Address/Address.component';
import { MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'app-addresses',
  templateUrl: './Addresses.component.html',
  styleUrls: ['./Addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  addresses: Address[] = [];
  shippingAddresses: Address[] = [];
  billingAddresses: Address[] = [];
  error: string;

  @Input()
  userId;

  addressType = 0;
  @ViewChild('shippingAddressComponent', {static: false}) shippingAddressComponent: AddressComponent;
  @ViewChild('billingAddressComponent', {static: false}) billingAddressComponent: AddressComponent;
  @ViewChild('shippingExpansionPanelElement', {static: false}) shippingExpansionPanelElement: MatExpansionPanel;
  @ViewChild('billingExpansionPanelElement', {static: false}) billingExpansionPanelElement: MatExpansionPanel;


  constructor(public appService: AppService, public translate: TranslateService) {
  }

  ngOnInit() {

    if (this.userId === undefined) {
      this.userId = Number(this.appService.tokenStorage.getUserId());
    }

    this.getAddresses();

  }


  getAddresses() {
    this.shippingAddresses = [];
    this.billingAddresses = [];

    if (this.userId > 0) {
      const parameters: string[] = [];
      parameters.push('e.user.id = |userId|' + this.userId + '|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.Address', parameters)
        .subscribe((data: Address[]) => {
          this.shippingAddresses = data.filter(this.isShippingAddr);
          this.billingAddresses = data.filter(this.isBillingAddr);
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

  isShippingAddr(element, index, array) {
    return element.addressType === 1;
  }

  isBillingAddr(element, index, array) {
    return element.addressType === 2;
  }

  changePaymentAddress(address: Address) {
    this.appService.saveWithUrl('/service/catalog/changePaymentAddress/', address)
      .subscribe((data: Address[]) => {
        if (address.addressType === 1 || address.addressType === 0) {
          this.shippingAddresses = data.filter(this.isShippingAddr);
        } else if (address.addressType === 2 || address.addressType === 0) {
          this.billingAddresses = data.filter(this.isBillingAddr);
        }
      },
        error => console.log(error),
        () => console.log('Changing Payment Method complete'));
  }

  updateTable(address: Address) {

    if (address.addressType === 1) {
      const index = this.shippingAddresses.findIndex(x => x.id === address.id);
      if (index === -1) {
        this.shippingAddresses.push(address);
      } else {
        this.shippingAddresses[index] = address;
      }
    } else if (address.addressType === 2) {
      const index = this.billingAddresses.findIndex(x => x.id === address.id);
      if (index === -1) {
        this.billingAddresses.push(address);
      } else {
        this.billingAddresses[index] = address;
      }
    }

  }

  isForShippingAddresses() {
    return this.addressType === 1 || this.addressType === 0 || this.addressType === undefined;
  }

  isForBillingAddresses() {
    return this.addressType === 2 || this.addressType === 0 || this.addressType === undefined;
  }

  setAddressType(addressType: number) {
    setTimeout(() => {
				this.addressType = addressType;
      }, 0);
  }

  onAddressSaved($event) {
      this.updateTable($event);
      this.shippingExpansionPanelElement.close();
      this.billingExpansionPanelElement.close();
   }


   editAddress(addressId: number, addressType: number) {
      if (addressType === 1) {
        this.shippingAddressComponent.getAddress(addressId);
        this.shippingExpansionPanelElement.open();
      }
      if (addressType === 2) {
        this.billingAddressComponent.getAddress(addressId);
        this.billingExpansionPanelElement.open();
      }
   }
}
