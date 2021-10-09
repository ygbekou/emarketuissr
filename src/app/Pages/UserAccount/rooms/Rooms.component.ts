import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Room, RoomSearchCriteria, Building, RoomTypeDesc, Store } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { RoomComponent } from './Room.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-rooms',
  templateUrl: './Rooms.component.html',
  styleUrls: ['./Rooms.component.scss']
})
export class RoomsComponent extends BaseComponent implements OnInit {
  roomsColumns: string[] = ['roomTypeName', 'roomNbr', 'floorNbr', 'status', 'actions'];
  roomsDatasource: MatTableDataSource<Room>;
  @ViewChild('MatPaginatorRooms', { static: true }) roomsPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) roomsSort: MatSort;


  @ViewChild(RoomComponent, { static: false }) roomComponent: RoomComponent;
  messages = '';
  button = 'filter';
  CLASS_NAME = 'com.softenza.emarket.model.hospitality.Room';
  RT_CLASS_NAME = 'com.softenza.emarket.model.hospitality.RoomType';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: RoomSearchCriteria = new RoomSearchCriteria();
  roomTypeSearchCriteria: RoomSearchCriteria = new RoomSearchCriteria();
  roomTypeDescs: RoomTypeDesc[] = [];
  rooms: Room[] = [];
  colors = ['primary', 'secondary'];

  selected = new FormControl(0);
  building: Building;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.clear();
    this.setDataSource([]);

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }
  ngAfterViewInit() {
    this.searchCriteria.storeId = 0;
    if (this.isAdminPage) {
      this.searchCriteria.status = 1;
    }
    this.search();
  }

  private clear() {
    this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.searchCriteria = new RoomSearchCriteria();
  }

  changeOrderType(event) {
  }

  setDataSource(data: Room[]) {
    this.roomsDatasource = new MatTableDataSource(data);
    this.roomsDatasource.paginator = this.roomsPaginator;
    this.roomsDatasource.sort = this.roomsSort;
  }

  getRooms() {
    const parameters: string[] = [];
    parameters.push('e.building.id = |bId|' + this.building.id + '|Integer');

    this.appService.getAllByCriteria(this.CLASS_NAME, parameters)
      .subscribe((data: Room[]) => {
        console.log(data);

        for (const room of data) {
          this.setRoomTypeName(room);
        }

        this.setDataSource(data);
      },
        error => console.log(error),
        () => console.log('Get rooms for building complete'));
  }



  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

      this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
      this.searchCriteria.languageId = +this.appService.appInfoStorage.language.id;

      this.appService.saveWithUrl('/service/hospitality/getRooms', this.searchCriteria)
        .subscribe((data: any[]) => {
          console.log(data);
          this.roomsDatasource = new MatTableDataSource(data);
          this.roomsDatasource.paginator = this.roomsPaginator;
          this.roomsDatasource.sort = this.roomsSort;
        },
          error => console.log(error),
          () => console.log('Get rooms complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.roomsDatasource.filter = filterValue.trim().toLowerCase();
    if (this.roomsDatasource.paginator) {
      this.roomsDatasource.paginator.firstPage();
    }

  }


  setRoomTypeName(room: Room) {
    for (const roomTypeDesc of room.roomTypeDescs) {
      if (roomTypeDesc.language.id === this.appService.appInfoStorage.language.id) {
        room.roomTypeName = roomTypeDesc.name;
        return;
      }
    }

    return '';
  }

  getRoomDetails(room: any) {
    this.roomComponent.getRoom(room);
  }


  updateDataTable(room: Room) {
    this.updateDatasourceData(this.roomsDatasource, this.roomsPaginator, this.roomsSort, room);
  }
}
