import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Building, Store } from 'src/app/app.models';
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
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getBuilding(params.id);
      }
    });

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
  }


  save() {
    console.log('Saving Building ... ');
    if (this.justSubmitted) {
      this.justSubmitted = false;
      console.log('Just submitted');
      return;
    }

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