import { Component, OnInit, Input } from '@angular/core';
import { Order, CancellationReason, OrderSearchCriteria, OnlineOrderVO, ReservationSearchCriteria, ReservationVO, Reservation } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cancel-reservations',
  templateUrl: './Cancel-reservations.component.html',
  styleUrls: ['./Open-reservations.component.scss']
})
export class CancelReservationsComponent extends BaseComponent implements OnInit {

  cancellationReasons: CancellationReason[];
  messages = '';
  errors = '';
  searchCriteria: ReservationSearchCriteria;

  @Input() reviewType: string;

  reservation: ReservationVO;
  canEdit = false;
  cancellationReason: string;

  action = 'cancelling';
  isAdmin = false;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
    super(translate);
  }

  ngOnInit() {

    this.getCancellationReasons();
    this.activatedRoute.data.subscribe(value => {
      this.isAdmin = (value && value.expectedRole && value.expectedRole[0] === 'Administrator');
    });

    this.activatedRoute.params.subscribe(params => {
      this.getReservation(params.reservationId);
    });
  } 

  public getReservation(id: number) {
    this.searchCriteria = new ReservationSearchCriteria();
    this.searchCriteria.reservationId = id;
    this.searchCriteria.langId = this.appService.appInfoStorage.language.id;
    this.appService.saveWithUrl('/service/hospitality/reservationWithRooms', this.searchCriteria)
      .subscribe((data: any[]) => {
        this.reservation = data[0];
        if (data.length > 0) {
          console.log(this.reservation);
        } else {
          this.translate.get(['MESSAGE.NO_OPEN_ORDER', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
            this.messages = res['MESSAGE.NO_OPEN_ORDER'];
          });
        }
      },
        error => console.log(error),
        () => console.log('Get Reservation complete'));
  }

  getCancellationReasons() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |langId|' + this.appService.appInfoStorage.language.id + '|Integer');
    this.appService.getAllByCriteria('CancellationReason', parameters)
      .subscribe((data: CancellationReason[]) => {
        this.cancellationReasons = data;
      },
        error => console.log(error),
        () => console.log('Get all CancellationReasons complete'));
  }


  public cancel() {
    this.messages = '';
    const reserv = new Reservation();
    reserv.id = this.reservation.reservationId;
    reserv.cancellationReason = this.cancellationReason;

    this.appService.saveWithUrl('/service/hospitality/cancelReservation/', reserv)
      .subscribe((data: Reservation) => {
        if (data.errors) {
          // there was an issue.
          this.translate.get(['MESSAGE.' + data.errors[0]]).subscribe(res => {
            this.errors = res['MESSAGE.' + data.errors[0]];
            if (data.errors[0] === 'RESERV_CANCELLED_NO_REFUND') {
              this.action = 'cancelled';
            }
          });
        } else {
          this.action = 'cancelled';
          this.translate.get('MESSAGE.RESERV_CANCELLATION_SUCCESSFUL', { reserv_number: reserv.id }).subscribe(res => {
            this.messages = res;
          });
        }
      },
        error => {
          console.log(error);
        },
        () => console.log('Cancel reservation complete'));
  }

}
