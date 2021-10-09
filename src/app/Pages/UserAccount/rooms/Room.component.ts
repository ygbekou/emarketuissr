import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Building, Store, Room, RoomTypeDesc } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

@Component({
  selector: 'app-room',
  templateUrl: './Room.component.html',
  styleUrls: ['./Room.component.scss']
})

export class RoomComponent extends BaseComponent implements OnInit {

  messages = '';
  room: Room;
  selectedStore: Store;
  CLASS_NAME = 'com.softenza.emarket.model.hospitality.Room';
  RTD_CLASS_NAME = 'com.softenza.emarket.model.hospitality.RoomTypeDesc';

  saving = false;
  justSubmitted = false;

  building: Building;
  floors: Array<any> = [];
  roomTypeDescs: RoomTypeDesc[] = [];

  @Output() roomSaveEvent = new EventEmitter<Room>();

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
        this.getRoom(params.id);
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
    this.room = new Room();
  }

  getRoomTypes() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |languageId|' + this.appService.appInfoStorage.language.id + '|Integer');
    parameters.push('e.roomType.storeId = |stId|' + this.building.storeId + '|Integer');

    this.appService.getAllByCriteria(this.RTD_CLASS_NAME, parameters)
      .subscribe((data: RoomTypeDesc[]) => {

        this.roomTypeDescs = data;
      },
        error => console.log(error),
        () => console.log('Get room type descs for store complete'));
  }

  getRoom(room: Room) {
    this.messages = '';
    if (room && room.id > 0) {
      this.appService.getOneWithChildsAndFiles(room.id, this.CLASS_NAME)
        .subscribe(result => {
          if (result.id > 0) {
            this.room = result;
          } else {
            this.room = new Room();
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
    this.room.status = (this.room.status == null
      || this.room.status.toString() === 'false'
      || this.room.status.toString() === '0') ? 0 : 1;
  }


  save() {
    console.log('Saving Building ... ');
    if (this.justSubmitted) {
      this.justSubmitted = false;
      console.log('Just submitted');
      return;
    }

    this.room.building = this.building;
    this.saving = true;
    this.messages = '';
    try {

      this.appService.saveWithUrl('/service/hospitality/saveRoom/', this.room)
      .subscribe((data: Room) => {
          this.processResult(data, this.room, null);
          this.room = data;

          for (const rtd of this.roomTypeDescs) {
            if (this.room.roomType.id === rtd.roomType.id) {
              this.room.roomTypeName = rtd.name;
            }
          }

          this.roomSaveEvent.emit(this.room);
          this.clear();
          this.saving = false;
        }, error => {
            this.saving = false;
            console.log(error);
          }, () => {
              this.saving = false;
              console.log('Save Room complete');
            }
          );

    } catch (e) {
      console.log(e);
    }
  }

  deriveFloorList() {
    this.floors = Array.from({length: this.building.nbrFloors}, (v, k) => k + 1 );
  }

  compareFloors(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1 === o2) : false;
  }
}
