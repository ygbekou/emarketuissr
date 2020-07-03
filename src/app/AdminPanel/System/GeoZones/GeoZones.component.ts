import { Component, OnInit, ViewChild } from '@angular/core';
import { GeoZone, Country, ZoneToGeoZone, Zone } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-geo-zone',
  templateUrl: './GeoZones.component.html',
  styleUrls: ['./GeoZones.component.scss']
})
export class GeoZonesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  displayedColumns2: string[] = ['id', 'country', 'zone', 'actions'];
  dataSource: MatTableDataSource<GeoZone>;
  zoneToGeoZoneDS: MatTableDataSource<ZoneToGeoZone>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  geoZone: GeoZone = new GeoZone();
  countries: Country[] = [];
  zones: Zone[] = [];
  messages = '';
  errors = '';
  selectedTab = 0;
  constructor(public appService: AppService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.getCountries();
    this.getZoneToGeoZone();
    this.getAll();
  }

  getAll() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.GeoZone', parameters)
      .subscribe((data: GeoZone[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all GeoZone complete'));
  }

  getZones(country: Country) {
    const parameters: string[] = [];
    parameters.push('e.country.id = |countryId|' + country.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.Zone', parameters)
      .subscribe((data: Zone[]) => {
        this.zones = data;
      },
        error => console.log(error),
        () => console.log('Get all GeoZone complete'));
  }

  getZoneToGeoZone() {
    const parameters: string[] = [];
    parameters.push('e.geoZone.id = |geoZoneId|' + this.geoZone.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.ZoneToGeoZone', parameters)
      .subscribe((data: ZoneToGeoZone[]) => {
        this.zoneToGeoZoneDS = new MatTableDataSource(data);
        this.zoneToGeoZoneDS.paginator = this.paginator;
        this.zoneToGeoZoneDS.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all GeoZone complete'));
  }

  addNewZoneToGeoZone() {
    console.log('Add new');
    this.zoneToGeoZoneDS.data.unshift(new ZoneToGeoZone());
    this.zoneToGeoZoneDS = new MatTableDataSource<ZoneToGeoZone>(this.zoneToGeoZoneDS.data);
    this.zoneToGeoZoneDS.paginator = this.paginator;
    this.zoneToGeoZoneDS.sort = this.sort;
  }


  saveZoneToGeoZone(zoneToGeoZone: ZoneToGeoZone) {
    this.messages = '';
    this.errors = '';
    if (zoneToGeoZone.country && zoneToGeoZone.zone) {
      zoneToGeoZone.geoZone = this.geoZone;
      this.saveZoneToGeoZone(zoneToGeoZone);
      try {
        this.messages = '';
        console.log(zoneToGeoZone);
        const index: number = this.zoneToGeoZoneDS.data.indexOf(zoneToGeoZone);
        this.appService.save(zoneToGeoZone, 'ZoneToGeoZone')
          .subscribe(result => {
            if (result.id > 0) {
              if (index !== -1) {
                this.zoneToGeoZoneDS.data.splice(index, 1);
              }
              this.zoneToGeoZoneDS.data.push(result);
              this.zoneToGeoZoneDS = new MatTableDataSource<ZoneToGeoZone>(this.zoneToGeoZoneDS.data);
              this.zoneToGeoZoneDS.paginator = this.paginator;
              this.zoneToGeoZoneDS.sort = this.sort;
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.selectedTab = 1;
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
              });
            }
          });

      } catch (e) {
        console.log(e);
      }
    }
  }
  public deleteZoneToGeoZone(zoneToGeoZone: ZoneToGeoZone) {
    this.messages = '';
    this.errors = '';
    if (!(zoneToGeoZone.id > 0)) {
      const index: number = this.zoneToGeoZoneDS.data.indexOf(zoneToGeoZone);
      if (index !== -1) {
        this.zoneToGeoZoneDS.data.splice(index, 1);
        this.zoneToGeoZoneDS = new MatTableDataSource<ZoneToGeoZone>(this.zoneToGeoZoneDS.data);
        this.zoneToGeoZoneDS.paginator = this.paginator;
        this.zoneToGeoZoneDS.sort = this.sort;
      }
    } else {
      this.appService.delete(zoneToGeoZone.id, 'com.softenza.emarket.model.ZoneToGeoZone')
        .subscribe(resp => {
          if (resp.result === 'SUCCESS') {
            const index: number = this.zoneToGeoZoneDS.data.indexOf(zoneToGeoZone);
            if (index !== -1) {
              this.zoneToGeoZoneDS.data.splice(index, 1);
              this.zoneToGeoZoneDS = new MatTableDataSource<ZoneToGeoZone>(this.zoneToGeoZoneDS.data);
              this.zoneToGeoZoneDS.paginator = this.paginator;
              this.zoneToGeoZoneDS.sort = this.sort;
            }
          } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
            this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
            });
          } else {
            this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.ERROR_OCCURRED'];
            });
          }
        });
    }
  }


  getCountries() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.Country', parameters)
      .subscribe((data: Country[]) => {
        this.countries = data;
      },
        error => console.log(error),
        () => console.log('Get all Countries complete'));
  }

  public remove(geoZone: GeoZone) {
    this.messages = '';
    this.errors = '';
    this.appService.delete(geoZone.id, 'com.softenza.emarket.model.GeoZone')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(geoZone);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<GeoZone>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
          });
        } else {
          this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.ERROR_OCCURRED'];
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

  clear() {
    this.geoZone = new GeoZone();
    this.dataSource = new MatTableDataSource();
    this.zoneToGeoZoneDS = new MatTableDataSource();
  }

  addSectionItem() {
    this.selectedTab = 1;
    this.geoZone = new GeoZone();
  }
  edit(si: GeoZone) {
    this.geoZone = si;
    this.getZoneToGeoZone();
    this.selectedTab = 1;
  }
  save() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      console.log(this.geoZone);
      const index: number = this.dataSource.data.indexOf(this.geoZone);
      this.appService.save(this.geoZone, 'GeoZone')
        .subscribe(result => {
          if (result.id > 0) {
            this.geoZone = result;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<GeoZone>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.selectedTab = 1;
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

}
