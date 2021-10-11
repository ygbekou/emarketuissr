import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Order, OrderProduct, TabHdr, TabDtl, Store, Currency, ReservationRoom, Reservation } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';

@Component({
  selector: 'app-reservarions-overview',
  templateUrl: './ReservationView.component.html',
  styleUrls: ['./Reservations.component.scss']
})
export class ReservationViewComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['room', 'price', 'total'];
  displayedTaxesColumns = ['taxes', 'emptyFooter7', 'emptyFooter8', 'taxAmount'];
  displayedTotalColumns = ['totalAmountTitle', 'emptyFooter4', 'emptyFooter5', 'totalAmount'];

  dataSource: MatTableDataSource<ReservationRoom>;
  @ViewChild('MatPaginatorO', { static: true }) onlinePG: MatPaginator;
  @ViewChild(MatSort, { static: true }) onlineST: MatSort;

  @Input() userId: number;

  @Input()
  reservation: Reservation;
  store: Store = new Store();
  constants: Constants = new Constants();
  reservationType = 'r';
  deviceInfo = null;
  canEdit = false;

  CLASS_NAME = 'com.softenza.emarket.model.hospitality.Reservation';

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
    super(translate);
  }

  ngOnInit() {
    this.messages = '';
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      const paramId: string = params.id;
      if (params.id === undefined || params.id === '0') {
        this.clear();
      } else {
        this.clear();
        this.reservationType = paramId.charAt(0);
        this.getReservation(Number(paramId.substring(1)));
      }
    });


  }

  public setCanEdit() {
    console.log('current user id:' + this.appService.tokenStorage.getUserId());
    console.log('store owner:' + this.store.owner.id);
    console.log('Role:' + this.appService.tokenStorage.getRole());
    if (Number(this.appService.tokenStorage.getUserId()) === this.store.owner.id ||
      Number(this.appService.tokenStorage.getRole()) === 3) { // this is the store owner
      this.canEdit = true;
    } else {
      this.canEdit = false;
    }
  }

  clear() {
    this.reservation = new Reservation();
    this.store = new Store();
    this.store.currency = new Currency();
  }

  public getStore(id: number) {
    const parameters: string[] = [];
    parameters.push('e.id = |stta|' + id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.Store', parameters,
      ' ')
      .subscribe((data: Store[]) => {
        this.store = data[0];
        this.setCanEdit();
      },
        (error) => console.log(error),
        () => console.log('Get Store complete'));
  }


  getReservation(reservationId: number) {
    if (reservationId > 0) {
      this.appService.getOneWithChildsAndFiles(reservationId, this.CLASS_NAME)
        .subscribe(result => {
          if (result.id > 0) {
            this.reservation = result;
            console.log(this.reservation);
            this.getStore(this.reservation.storeId);

            this.dataSource = new MatTableDataSource(this.reservation.reservationRooms);
            this.dataSource.paginator = this.onlinePG;
            this.dataSource.sort = this.onlineST;
          } else {
            this.reservation = new Reservation();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';
    return val.length === 0;
  }

}
