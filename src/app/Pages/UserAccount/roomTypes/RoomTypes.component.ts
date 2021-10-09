import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { RoomSearchCriteria, RoomType, Building, RoomTypeDesc, Store, StoreSearchCriteria } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { RoomTypeComponent } from './RoomType.component';
import { RoomTypeAmenityComponent } from './RoomTypeAmenity.component';


@Component({
  selector: 'app-roomTypes',
  templateUrl: './RoomTypes.component.html',
  styleUrls: ['./RoomTypes.component.scss']
})
export class RoomTypesComponent extends BaseComponent implements OnInit {
  roomTypesColumns: string[] = ['name', 'price', 'qty', 'availableQty', 'status', 'actions'];
  roomTypesDatasource: MatTableDataSource<RoomTypeDesc>;
  @ViewChild('MatPaginatorRoomTypes', { static: true }) roomTypesPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) roomTypesSort: MatSort;


  @ViewChild(RoomTypeComponent, { static: false }) roomTypeComponent: RoomTypeComponent;
  @ViewChild(RoomTypeAmenityComponent, { static: false }) roomTypeAmenityComponent: RoomTypeAmenityComponent;

  messages = '';
  button = 'filter';
  CLASS_NAME = 'com.softenza.emarket.model.hospitality.RoomType';
  RTD_CLASS_NAME = 'com.softenza.emarket.model.hospitality.RoomTypeDesc';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: RoomSearchCriteria = new RoomSearchCriteria();
  roomTypeDescs: RoomTypeDesc[] = [];

  selected = new FormControl(0);
  building: Building;

  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  selectedStore: Store;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.getStores();
    //this.clear();
    //this.setDataSource([]);

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
  }

  private clear() {
    this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.searchCriteria = new RoomSearchCriteria();
  }

  private getStores() {
    this.storeSearchCriteria.status = 1;
    this.storeSearchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.appService.saveWithUrl('/service/catalog/stores', this.storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
        if (this.stores && this.stores.length === 1) {
          this.selectedStore = this.stores[0];
          this.storeSelected(this.selectedStore);
        }
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }


  getRoomTypes() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |languageId|' + this.appService.appInfoStorage.language.id + '|Integer');
    parameters.push('e.roomType.storeId = |stId|' + this.selectedStore.id + '|Integer');

    this.appService.getAllByCriteria(this.RTD_CLASS_NAME, parameters)
      .subscribe((data: RoomTypeDesc[]) => {

        this.setDataSource(data);
      },
        error => console.log(error),
        () => console.log('Get room type descs for building complete'));
  }

  setDataSource(data: RoomTypeDesc[]) {
    this.roomTypesDatasource = new MatTableDataSource(data);
    this.roomTypesDatasource.paginator = this.roomTypesPaginator;
    this.roomTypesDatasource.sort = this.roomTypesSort;
  }


  public applyFilter(filterValue: string) {
    this.roomTypesDatasource.filter = filterValue.trim().toLowerCase();
    if (this.roomTypesDatasource.paginator) {
      this.roomTypesDatasource.paginator.firstPage();
    }

  }

  storeSelected(event) {

    setTimeout(() => {
      this.getRoomTypes();
      this.roomTypeComponent.storeId = this.selectedStore.id;
    }, 500);
  }

  getRoomTypeDetails(roomTypeDesc: any) {
    this.roomTypeComponent.getDescriptions(roomTypeDesc.roomType.id);
    this.roomTypeAmenityComponent.roomType = roomTypeDesc.roomType;
    this.roomTypeAmenityComponent.getRoomTypeUnassignedAmenities();
    this.roomTypeAmenityComponent.getRoomTypeAmenities();
  }

  roomTypeSaved($event) {
    const roomType = $event;

    roomType.roomTypeDescs.forEach(element => {
        if (element.language.id === this.appService.appInfoStorage.language.id) {
          element.roomType = roomType;
          if (!this.roomTypesDatasource.data) {
            this.roomTypesDatasource.data = [];
          }
          this.updateDataTable(element);
        }
    });
  }

  roomTypeCleared() {
    if (this.roomTypeAmenityComponent) {
      this.roomTypeAmenityComponent.clear();
      this.roomTypeAmenityComponent.roomType = new RoomType();
    }
  }

  updateDataTable(roomTypeDesc: RoomTypeDesc) {
    this.updateDatasourceData(this.roomTypesDatasource, this.roomTypesPaginator, this.roomTypesSort, roomTypeDesc);
  }
}
