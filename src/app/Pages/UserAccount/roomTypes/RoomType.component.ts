import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, RoomType, RoomTypeDesc, Building } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-roomType',
  templateUrl: './RoomType.component.html',
  styleUrls: ['./RoomType.component.scss']
})

export class RoomTypeComponent extends BaseComponent implements OnInit {

  messages = '';
  roomType: RoomType;
  storeId: number;

  formData = new FormData();
  picture: any[] = [];
  saving = false;
  justSubmitted = false;

  CLASS_NAME = 'com.softenza.emarket.model.hospitality.RoomTypeDesc';
  @Output() roomTypeSaveEvent = new EventEmitter<RoomType>();
  @Output() clearEvent = new EventEmitter();

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

  }

  clearMessages($event) {
    this.messages = '';
  }

  setRoomType($event) {
    this.roomType = $event;
  }

  clear() {
    this.roomType = new RoomType();
    this.roomType.roomTypeDescs = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const rtd = new RoomTypeDesc();
      rtd.language = lang;
      rtd.name = '';
      this.roomType.roomTypeDescs.push(rtd);
    }

    this.clearEvent.emit();
  }

  getDescriptions(roomTypeId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (roomTypeId != null) {
      parameters.push('e.roomType.id = |roomTypeId|' + roomTypeId + '|Integer');
    }
    this.appService.getAllByCriteria(this.CLASS_NAME, parameters)
      .subscribe((data: RoomTypeDesc[]) => {

        if (data !== null && data.length > 0) {
          this.roomType = data[0].roomType;
          this.roomType.roomTypeDescs = data;
          const images: any[] = [];
          const image = {
            link: 'assets/images/roomtypes/' + this.roomType.id + '/' + this.roomType.image,
            preview: 'assets/images/roomtypes/' + this.roomType.id + '/' + this.roomType.image
          };
          images.push(image);
          this.picture = images;


        }
      },
        error => console.log(error),
        () => console.log('Get all roomType desc complete'));
  }

  setToggles() {
    this.roomType.status = (this.roomType.status == null
      || this.roomType.status.toString() === 'false'
      || this.roomType.status.toString() === '0') ? 0 : 1;
  }

  cleanDescriptions(roomType: RoomType) {
    roomType.roomTypeDescs.forEach(element => {
       element.roomType = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;    });
  }


  save() {
    console.log('Saving Room Type ... ');
    if (this.justSubmitted) {
      this.justSubmitted = false;
      console.log('Just submitted');
      return;
    }

    this.saving = true;
    this.messages = '';

    this.roomType.storeId = this.storeId;
    this.setToggles();
    const thisRoomType = {...this.roomType};
    this.cleanDescriptions(thisRoomType);

    try {

      this.formData = new FormData();
      if (this.picture && this.picture.length > 0 && this.picture[0].file) {
        this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
      }

      this.appService.saveWithFile(thisRoomType, this.CLASS_NAME, this.formData, 'saveWithFile')
        .subscribe((result) => {
          this.processResult(result, this.roomType, null);
          this.roomType = {...result};
          this.roomTypeSaveEvent.emit(this.roomType);
          this.clear();
          this.saving = false;
          this.picture = [];
        }, error => {
            this.saving = false;
            console.log(error);
          }, () => {
              this.saving = false;
              console.log('Save Room Type complete');
            }
          );

    } catch (e) {
      console.log(e);
    }
  }

}
