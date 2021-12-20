import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OrderStatus, StoreSearchCriteria, Reservation, ReservationSearchCriteria } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-reservations',
  templateUrl: './Reservations.component.html',
  styleUrls: ['./Reservations.component.scss']
})
export class ReservationsComponent extends BaseComponent implements OnInit {
  onlineReservationsColumns: string[] = ['id', 'customer', 'beginDate', 'endDate', 'total', 'city', 'country', 'status'];
  storeReservationsColumns: string[] = ['id', 'cashier', 'beginDate', 'endDate', 'total', 'status'];

  onlineDS: MatTableDataSource<Reservation>;
  @ViewChild('MatPaginatorO', { static: true }) onlinePG: MatPaginator;
  @ViewChild(MatSort, { static: true }) onlineST: MatSort;

  storeDS: MatTableDataSource<any>;
  @ViewChild('MatPaginatorS', { static: true }) storePG: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeST: MatSort;

  messages = '';
  fromAdmin = false;
  button = 'filter';
  @Input() userId: number;
  searchCriteria: ReservationSearchCriteria;
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  orderStatuses: OrderStatus[];
  colors = ['primary', 'secondary'];

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    if (!(this.userId === undefined)) {
      this.fromAdmin = true;
    }
    this.clear();
    this.search();
    this.getOrderStatuses();
  }

  private clear() {
    const oType = this.searchCriteria ? this.searchCriteria.source : 1;
    this.searchCriteria = new ReservationSearchCriteria();
    this.searchCriteria.source = oType;
    this.searchCriteria.userId = this.userId;
    this.searchCriteria.langId = this.appService.appInfoStorage.language.id;
  }

  changeOrderSource(event) {
    if (event.index === 0) {
      this.searchCriteria.source = 1;
    }
    if (event.index === 1) {
      this.searchCriteria.source = 2;
    }

    this.search();

  }


  getOrderStatuses() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |langCode|' + this.appService.appInfoStorage.language.id + '|Integer');
    parameters.push('e.status = |staCode|1|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.OrderStatus', parameters)
      .subscribe((data: OrderStatus[]) => {
        this.orderStatuses = data;
      },
        error => console.log(error),
        () => console.log('Get all OrderStatus complete'));
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

      if (this.searchCriteria.source === 1) {
        this.appService.saveWithUrl('/service/hospitality/onlineReservations', this.searchCriteria)
          .subscribe((data: any[]) => {
            this.onlineDS = new MatTableDataSource(data);
            this.onlineDS.paginator = this.onlinePG;
            this.onlineDS.sort = this.onlineST;
          },
            error => console.log(error),
            () => console.log('Get all Reservations complete'));

      } else if (this.searchCriteria.source === 2) {
        this.appService.saveWithUrl('/service/hospitality/storeReservations', this.searchCriteria)
          .subscribe((data: any[]) => {
            this.storeDS = new MatTableDataSource(data);
            this.storeDS.paginator = this.storePG;
            this.storeDS.sort = this.storeST;
          },
            error => console.log(error),
            () => console.log('Get all Reservations complete'));
      }
    }
  }

  public applyFilter(filterValue: string) {
    if (this.searchCriteria.source === 1) {
      this.onlineDS.filter = filterValue.trim().toLowerCase();
      if (this.onlineDS.paginator) {
        this.onlineDS.paginator.firstPage();
      }
    } else if (this.searchCriteria.source === 2) {
      this.storeDS.filter = filterValue.trim().toLowerCase();
      if (this.storeDS.paginator) {
        this.storeDS.paginator.firstPage();
      }
    }

  }

}
