import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { RoomSearchCriteria, RoomType, Building, RoomTypeDesc, AmenityDesc } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { AmenityComponent } from './Amenity.component';


@Component({
  selector: 'app-amenities',
  templateUrl: './Amenities.component.html',
  styleUrls: ['./Amenities.component.scss']
})
export class AmenitiesComponent extends BaseComponent implements OnInit {
  amenitiesColumns: string[] = ['name', 'desc', 'image', 'status', 'actions'];
  amenitiesDatasource: MatTableDataSource<AmenityDesc>;
  @ViewChild('MatPaginatorAmenities', { static: true }) amenitiesPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) amenitiesSort: MatSort;


  @ViewChild(AmenityComponent, { static: false }) amenityComponent: AmenityComponent;
  messages = '';
  button = 'filter';
  CLASS_NAME = 'com.softenza.emarket.model.hospitality.Amenity';
  RTD_CLASS_NAME = 'com.softenza.emarket.model.hospitality.AmenityDesc';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: RoomSearchCriteria = new RoomSearchCriteria();
  amenityDescs: AmenityDesc[] = [];

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
    this.getAmenities();
    this.setDataSource([]);

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });
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

  changeOrderType(event) {
  }


  getAmenities() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |languageId|' + this.appService.appInfoStorage.language.id + '|Integer');

    this.appService.getAllByCriteria(this.RTD_CLASS_NAME, parameters)
      .subscribe((data: AmenityDesc[]) => {

        this.setDataSource(data);
      },
        error => console.log(error),
        () => console.log('Get amenity descs for building complete'));
  }

  setDataSource(data: AmenityDesc[]) {
    this.amenitiesDatasource = new MatTableDataSource(data);
    this.amenitiesDatasource.paginator = this.amenitiesPaginator;
    this.amenitiesDatasource.sort = this.amenitiesSort;
  }


  public applyFilter(filterValue: string) {
    this.amenitiesDatasource.filter = filterValue.trim().toLowerCase();
    if (this.amenitiesDatasource.paginator) {
      this.amenitiesDatasource.paginator.firstPage();
    }

  }

  getAmenityDetails(amenityDesc: any) {
    this.amenityComponent.getDescriptions(amenityDesc.amenity.id);
  }

  amenitySaved($event) {
    const amenity = $event;

    amenity.amenityDescs.forEach(element => {
        if (element.language.id === this.appService.appInfoStorage.language.id) {
          element.amenity = amenity;
          if (!this.amenitiesDatasource.data) {
            this.amenitiesDatasource.data = [];
          }
          this.updateDataTable(element);
        }
    });
  }

  updateDataTable(amenityDesc: AmenityDesc) {
    this.updateDatasourceData(this.amenitiesDatasource, this.amenitiesPaginator, this.amenitiesSort, amenityDesc);
  }
}
