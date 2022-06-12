import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Building, Store, Address } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-building',
  templateUrl: './Building.component.html',
  styleUrls: ['./Building.component.scss']
})

export class BuildingComponent extends BaseComponent implements OnInit {

  messages = '';
  building: Building;
  selectedStore: Store;
  CLASS_NAME = 'com.softenza.emarket.model.hospitality.Building';
  addresses: Address[] = [];
  formData = new FormData();
  picture: any[] = [];
  saving = false;
  justSubmitted = false;

  @Output() buildingSaveEvent = new EventEmitter<Building>();

  constructor(
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public appService: AppService) {
    super(translate);
  }

  ngOnInit() {
    this.getAddresses();
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getBuilding(params.id);
      }
    });

  }

  getAddresses() {
    console.log('Get addresses called');
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

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }

  clearMessages($event) {
    this.messages = '';
  }

  setImage($event) {
    console.log('Setting image' + $event);
    this.building.image = $event;
  }


  clear() {
    this.building = new Building();
  }

  getBuilding(building: Building) {
    this.messages = '';
    if (building && building.id > 0) {
      this.appService.getOneWithChildsAndFiles(building.id, this.CLASS_NAME)
        .subscribe(result => {
          if (result.id > 0) {
            this.building = result;
            const images: any[] = [];
            const image = {
              link: 'assets/images/buildings/' + this.building.id + '/' + this.building.image,
              preview: 'assets/images/buildings/' + this.building.id + '/' + this.building.image
            };
            images.push(image);
            this.picture = images;

          } else {
            this.building = new Building();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      this.clear();
    }
  }

  setToggles() {
    this.building.status = (this.building.status == null
      || this.building.status.toString() === 'false'
      || this.building.status.toString() === '0') ? 0 : 1;

    this.building.principal = (this.building.principal == null
      || this.building.principal.toString() === 'false'
      || this.building.principal.toString() === '0') ? 0 : 1;

    this.building.fullRental = (this.building.fullRental == null
      || this.building.fullRental.toString() === 'false'
      || this.building.fullRental.toString() === '0') ? 0 : 1;

    this.building.onlineBooking = (this.building.onlineBooking == null
      || this.building.onlineBooking.toString() === 'false'
      || this.building.onlineBooking.toString() === '0') ? 0 : 1;


    this.building.topProperty = (this.building.topProperty == null
      || this.building.topProperty.toString() === 'false'
      || this.building.topProperty.toString() === '0') ? 0 : 1;
  }


  save() {
    console.log('Saving Building ... ');
    if (this.justSubmitted) {
      this.justSubmitted = false;
      console.log('Just submitted');
      return;
    }


    this.setToggles();

    this.saving = true;
    this.building.storeId = this.selectedStore.id;
    this.messages = '';
    try {

      this.formData = new FormData();
      if (this.picture && this.picture.length > 0 && this.picture[0].file) {
        this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
      }

      this.appService.saveWithFile(this.building, this.CLASS_NAME, this.formData, 'saveWithFile')
        .subscribe((data: Building) => {
          this.processResult(data, this.building, null);
          this.building = data;
          this.buildingSaveEvent.emit(this.building);
          this.clear();
          this.saving = false;
          this.picture = [];
        }, error => {
          this.saving = false;
          console.log(error);
        }, () => {
          this.saving = false;
          console.log('Save Building complete');
        }
        );

    } catch (e) {
      console.log(e);
    }
  }
}
