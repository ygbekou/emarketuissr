import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ReservationHistory, Reservation } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-reservation-history',
  templateUrl: './ReservationHistory.component.html',
  styleUrls: ['./Reservations.component.scss']
})
export class ReservationHistoryComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['dateAdded', 'user', 'comment', 'status'];
  dataSource: MatTableDataSource<ReservationHistory>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  errors = '';

  CLASS_NAME = 'com.softenza.emarket.model.hospitality.ReservationHistory';

  reservationHistory: ReservationHistory = new ReservationHistory();

  @Input() reservationType: string;
  @Input() reservation: Reservation;
  @Input() storeOwnerId: number;
  canEdit = false;

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.reservationHistory.reservation.id = this.reservation.id;
    this.reservationHistory.notify = 1;
    this.getReservationHistories();
  }

  getReservationHistories() {
    const parameters: string[] = [];
    if (this.reservation.id !== null && this.reservation.id !== undefined) {
      parameters.push('e.reservation.id = |reservationId|' + this.reservation.id + '|Integer');
    }
    this.appService.getAllByCriteria(this.CLASS_NAME, parameters, ' ORDER BY e.createDate DESC')
      .subscribe((data: ReservationHistory[]) => {
        this.dataSource = new MatTableDataSource<ReservationHistory>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setCanEdit();
      },
        error => console.log(error),
        () => console.log('Get all ReservationHistory complete'));
  }

  edit(reservationHistoryId: number) {
    if (reservationHistoryId > 0) {
      this.appService.getOne(reservationHistoryId, this.CLASS_NAME)
        .subscribe(result => {
          if (result) {
            if (result.id > 0) {
              this.reservationHistory = result;
            } else {
              this.reservationHistory = new ReservationHistory();
              this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
                this.messages = res['MESSAGE.READ_FAILED'];
              });
            }
          }
        });
    }
  }

  public remove(reservationHistoryId: number) {
    this.messages = '';
    this.appService.delete(reservationHistoryId, this.CLASS_NAME)
      .subscribe(resp => {

        this.processDataSourceDeleteResult(resp, this.messages, this.reservationHistory, this.dataSource);
      });
  }

  addNew() {
    this.messages = '';
    this.errors = '';
    this.reservationHistory = new ReservationHistory();
    this.reservationHistory.status = this.reservation.status;
  }

  save() {
    this.messages = '';
    this.errors = '';

    console.log(this.reservationHistory)
    if ((!this.reservationHistory.status || !(this.reservationHistory.status > 0))
      && (!this.reservationHistory.comment || this.reservationHistory.comment.trim() === '')) {
      this.translate.get(['VALIDATION.COMMENT_OR_STATUS', 'COMMON.SUCCESS']).subscribe(res => {
        this.messages = res['VALIDATION.COMMENT_OR_STATUS'];
      });
    } else {

      try {
        this.reservationHistory.reservation.id = this.reservation.id;
        this.reservationHistory.user.id = Number(this.appService.tokenStorage.getUserId());
        if (!this.reservationHistory.status || !(this.reservationHistory.status > 0)) {
          this.reservationHistory.status = this.reservation.status;
        }

        this.setToggleValues();
        this.appService.saveWithUrl('/service/hospitality/saveReservationHistory', this.reservationHistory)
          .subscribe(result => {
            this.processResult(result, this.reservation, null);
            if (result.id > 0) {
              this.reservationHistory.status = this.reservationHistory.status;
              this.reservationHistory = new ReservationHistory();
              window.location.reload();

            }
          });

      } catch (e) {
        console.log(e);
      }
    }
  }

  setToggleValues() {
    this.reservationHistory.notify = (this.reservationHistory.notify === null
      || this.reservationHistory.notify.toString() === 'false'
      || this.reservationHistory.notify.toString() === '0') ? 0 : 1;
  }

  public setCanEdit() {
    console.log('current user id:' + this.appService.tokenStorage.getUserId());
    console.log('store owner:' + this.storeOwnerId);
    console.log('Role:' + this.appService.tokenStorage.getRole());
    if (Number(this.appService.tokenStorage.getUserId()) === this.storeOwnerId ||
      Number(this.appService.tokenStorage.getRole()) === 3) { // this is the store owner
      this.canEdit = true;
      this.displayedColumns = ['dateAdded', 'user', 'comment', 'status', 'notified', 'actions'];
    } else {
      this.canEdit = false;
    }
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }

  public onToggleGroupChange(event) {
    console.log(event.value);
    this.reservationHistory.status = event.value;
  }

}
