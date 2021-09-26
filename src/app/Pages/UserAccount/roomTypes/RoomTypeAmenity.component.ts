import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { RoomTypeAmenity, RoomSearchCriteria, RoomType, AmenityDesc, Amenity } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-rt-amenity',
  templateUrl: './RoomTypeAmenity.component.html'
})
export class RoomTypeAmenityComponent extends BaseComponent implements OnInit, AfterViewInit {

  aAmenityColumns: string[] = ['image', 'amenityName', 'actions'];
  aAmenityDatasource: MatTableDataSource<Amenity>;
  @ViewChild('aAmenityPaginator', { static: true }) aAmenityPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) aAmenitySort: MatSort;

  sAmenityColumns: string[] = ['image', 'amenityName', 'actions'];
  sAmenityDatasource: MatTableDataSource<Amenity>;
  @ViewChild('sAmenityPaginator', { static: true }) sAmenityPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sAmenitySort: MatSort;

  messages = '';
  panelOpenState = false;
  CLASS_NAME = 'com.softenza.emarket.model.hospitality.RoomTypeAmenity';
  //roomTypeAmenity: RoomTypeAmenity = new RoomTypeAmenity();
  searchCriteria: RoomSearchCriteria = new RoomSearchCriteria();
  //menuDescriptions: MenuDescription[] = [];

  //currentOption: string;
  //Options: MenuDescription[];
  //filteredMenuOptions: MenuDescription[];

  roomTypeAmenity: RoomTypeAmenity = new RoomTypeAmenity();
  roomType: RoomType = new RoomType();

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  //@Output() storeMenuSaveEvent = new EventEmitter<any>();

  addNew = false;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.roomType.id = params.id;
        this.clear();
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });

    this.aAmenityDatasource = new MatTableDataSource<Amenity>([]);

  }

  ngAfterViewInit() {
    this.aAmenityDatasource.paginator = this.aAmenityPaginator;
    this.sAmenityDatasource = new MatTableDataSource([]);
    this.sAmenityDatasource.paginator = this.sAmenityPaginator;
  }

  clear() {
    this.messages = '';
  }

  getRoomTypeUnassignedAmenities() {
    this.appService.saveWithUrl('/service/hospitality/getRoomTypeUnassignedAmenities/',
      {
        roomTypeId: this.roomType.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: Amenity[]) => {
        this.aAmenityDatasource = new MatTableDataSource(data);
        this.aAmenityDatasource.paginator = this.aAmenityPaginator;
        this.aAmenityDatasource.sort = this.aAmenitySort;

      },
        error => console.log(error),
        () => console.log('Get all room type unassigned amenity complete'));
  }

  getRoomTypeAmenities() {
    this.appService.saveWithUrl('/service/hospitality/getRoomTypeAmenities',
      {
        roomTypeId: this.roomType.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: any[]) => {
         this.sAmenityDatasource = new MatTableDataSource(data);
        this.sAmenityDatasource.paginator = this.sAmenityPaginator;
        this.sAmenityDatasource.sort = this.sAmenitySort;
      },
        error => console.log(error),
        () => console.log('Get room type assigned amenities complete'));

  }


  isEmpty(value: string): boolean {
    '';
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }


  saveRoomTypeAmenity(amenity: Amenity) {
    const roomTypeAmenity = new RoomTypeAmenity();
    const oldAmenityName = amenity.name;
    const oldAmenityImage = amenity.image;
    roomTypeAmenity.roomType = this.roomType;
    roomTypeAmenity.amenity = amenity;

    this.appService.saveWithUrl('/service/crud/RoomTypeAmenity/save/', roomTypeAmenity)
      .subscribe((data: RoomTypeAmenity) => {
        this.processResult(data, roomTypeAmenity, null);
        roomTypeAmenity.id = data.id;
        //productStoreMenu.productName = oldProductName;
        roomTypeAmenity.image = oldAmenityImage;
        //productStoreMenu.product = new Product();
        //productStoreMenu.product.id = productStoreMenu.productId;
        this.updateDatasourceData(this.sAmenityDatasource, this.sAmenityPaginator, this.sAmenitySort, roomTypeAmenity);
        this.processDataSourceDeleteResult({ result: 'SUCCESS' }, this.messages, amenity, this.aAmenityDatasource);
        this.aAmenityDatasource.data = Array.from(this.aAmenityDatasource.data);
      },
        error => console.log(error),
        () => console.log('Save selected room type amenity complete'));

  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }

  public deleteRoomTypeAmenity(roomTypeAmenity: RoomTypeAmenity, index: number) {

    this.messages = '';

    const amenity = roomTypeAmenity.amenity;

    this.appService.delete(roomTypeAmenity.id, this.CLASS_NAME)
      .subscribe(data => {

        this.updateDatasourceData(this.aAmenityDatasource, this.aAmenityPaginator, this.aAmenitySort, amenity);
        this.processDataSourceDeleteResult(data, this.messages, roomTypeAmenity, this.sAmenityDatasource);
        this.sAmenityDatasource.data = Array.from(this.sAmenityDatasource.data);

      });
  }
  
  public applyAvailableAmenityFilter(filterValue: string) {
    this.aAmenityDatasource.filter = filterValue.trim().toLowerCase();
    if (this.aAmenityDatasource.paginator) {
      this.aAmenityDatasource.paginator.firstPage();
    }
  }

  public applySelectedAmenityFilter(filterValue: string) {
    this.sAmenityDatasource.filter = filterValue.trim().toLowerCase();
    if (this.sAmenityDatasource.paginator) {
      this.sAmenityDatasource.paginator.firstPage();
    }
  }

}
