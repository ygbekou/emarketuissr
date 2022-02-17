import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, RoomType, RoomTypeDesc, Building, Amenity, AmenityDesc, IconDesc } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-amenity',
  templateUrl: './Amenity.component.html',
  styleUrls: ['./Amenity.component.scss']
})

export class AmenityComponent extends BaseComponent implements OnInit {

  messages = '';
  amenity: Amenity;
  iconDescs: IconDesc[];

  formData = new FormData();
  picture: any[] = [];
  saving = false;
  justSubmitted = false;

  CLASS_NAME = 'com.softenza.emarket.model.hospitality.AmenityDesc';
  ICON_CLASS_NAME = 'com.softenza.emarket.model.IconDesc';

  @Output() amenitySaveEvent = new EventEmitter<Amenity>();

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
        this.getDescriptions(params.id);
      }
    });

    this.getIcons();

  }

  clearMessages($event) {
    this.messages = '';
  }

  setAmenity($event) {
    this.amenity = $event;
  }

  clear() {
    this.amenity = new Amenity();
    this.amenity.amenityDescs = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const ad = new AmenityDesc();
      ad.language = lang;
      ad.name = '';
      this.amenity.amenityDescs.push(ad);
    }
  }

  getIcons() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |langCode|' + this.appService.appInfoStorage.language.id + '|Integer');
    parameters.push('e.icon.status = |staCode|1|Integer');
    this.appService.getAllByCriteria(this.ICON_CLASS_NAME, parameters)
      .subscribe((data: IconDesc[]) => {
        this.iconDescs = data;
      },
        error => console.log(error),
        () => console.log('Get all OrderStatus complete'));
  }

  getDescriptions(amenityId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (amenityId != null) {
      parameters.push('e.amenity.id = |amenityId|' + amenityId + '|Integer');
    }
    this.appService.getAllByCriteria(this.CLASS_NAME, parameters)
      .subscribe((data: AmenityDesc[]) => {

        if (data !== null && data.length > 0) {
          this.amenity = data[0].amenity;
          this.amenity.amenityDescs = data;
          const images: any[] = [];
          const image = {
            link: 'assets/images/amenities/' + this.amenity.id + '/' + this.amenity.image,
            preview: 'assets/images/amenities/' + this.amenity.id + '/' + this.amenity.image
          };
          images.push(image);
          this.picture = images;


        }
      },
        error => console.log(error),
        () => console.log('Get all amenity desc complete'));
  }

  setToggles() {
    this.amenity.status = (this.amenity.status == null
      || this.amenity.status.toString() === 'false'
      || this.amenity.status.toString() === '0') ? 0 : 1;
  }

  cleanDescriptions(amenity: Amenity) {
    amenity.amenityDescs.forEach(element => {
       element.amenity = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;    });
  }


  save() {
    console.log('Saving Amenity ... ');
    if (this.justSubmitted) {
      this.justSubmitted = false;
      console.log('Just submitted');
      return;
    }

    this.saving = true;
    this.messages = '';

    this.setToggles();
    const thisAmenity = {...this.amenity};
    this.cleanDescriptions(thisAmenity);

    try {

      this.formData = new FormData();
      if (this.picture && this.picture.length > 0 && this.picture[0].file) {
        this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
      }

      this.appService.saveWithFile(thisAmenity, this.CLASS_NAME, this.formData, 'saveWithFile')
        .subscribe((result) => {
          this.processResult(result, this.amenity, null);
          this.amenity = {...result};
          this.amenitySaveEvent.emit(this.amenity);
          this.clear();
          this.saving = false;
          this.picture = [];
        }, error => {
            this.saving = false;
            console.log(error);
          }, () => {
              this.saving = false;
              console.log('Save Amenity complete');
            }
          );

    } catch (e) {
      console.log(e);
    }
  }

}
