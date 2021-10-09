import { Component, OnInit, ViewChild } from '@angular/core';
import { Building, StoreSearchCriteria, Store } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { BuildingComponent } from './Building.component';
import { FormControl } from '@angular/forms';
import { RoomsComponent } from '../rooms/Rooms.component';

@Component({
  selector: 'app-buildings',
  templateUrl: './Buildings.component.html',
  styleUrls: ['./Buildings.component.scss']
})
export class BuildingsComponent extends BaseComponent implements OnInit {

  @ViewChild(BuildingComponent, { static: false }) buildingView: BuildingComponent;
  @ViewChild(RoomsComponent, { static: false }) roomsView: RoomsComponent;

  displayedColumns: string[] = ['name', 'image', 'status'];
  dataSource: MatTableDataSource<Building>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';

  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  selectedStore: Store;

  selected = new FormControl(0);
  selectedBldgId;

  className = 'com.softenza.emarket.model.hospitality.Building';

  constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

  ngOnInit() {

    this.getStores();

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

  getAll() {
    const parameters: string[] = [];

    parameters.push('e.storeId = |sId|' + this.selectedStore.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.hospitality.Building', parameters)
      .subscribe((data: Building[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Building complete'));
  }

  public remove(building: Building) {
    this.messages = '';
    this.appService.delete(building.id, this.className)
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(building);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Building>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
          });
        } else {
          this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.ERROR_OCCURRED'];
          });
        }
      });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  storeSelected(event) {

    setTimeout(() => {

      this.selected.setValue(0);
      this.getAll();

      if (this.buildingView) {
        this.buildingView.clear();
        if (event && !event.value) {
          this.buildingView.selectedStore = event;
        } else {
          this.buildingView.selectedStore = event.value;
        }
      }
    }, 500);
  }

  selectBuilding(building: Building) {

    this.selectedBldgId = building.id;

    setTimeout(() => {

      if (this.buildingView) {
        this.buildingView.getBuilding(building);
      }

      if (this.roomsView) {
        this.roomsView.building = building;
        this.roomsView.getRooms();
        this.roomsView.roomComponent.building = building;
        this.roomsView.roomComponent.deriveFloorList();
        this.roomsView.roomComponent.getRoomTypes();
      }

      this.selected.setValue(1);

    }, 500);
  }

  onBuildingSave($event) {
    this.updateDatasourceData(this.dataSource, this.paginator, this.sort, $event);
  }
}
